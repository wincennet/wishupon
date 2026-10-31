-- WishUpon: the base database, rebuilt for a fresh Supabase project.
-- Products, orders, the product photo bucket and the row-level security that
-- keeps customer details private. Safe to run more than once.

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       integer not null check (price >= 0),
  category    text not null,
  stock_qty   integer not null default 1 check (stock_qty >= 0),
  image_urls  text[] not null default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  phone             text not null,
  address           text not null,
  items             jsonb not null,
  total_price       integer not null check (total_price >= 0),
  payment_method    text not null check (payment_method in ('cod', 'bank-transfer')),
  payment_reference text,
  status            text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  created_at        timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Shoppers see only pieces that are on the shop; the signed-in owner sees and
-- changes everything.
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select to anon, authenticated using (is_active = true);

drop policy if exists "products owner all" on public.products;
create policy "products owner all" on public.products
  for all to authenticated using (true) with check (true);

-- Anyone can place an order, but only as a new pending one.
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders
  for insert to anon, authenticated with check (status = 'pending');

-- Checkout reads back the new order's id to show a reference. The public may
-- read that one column and nothing else: name, phone and address stay private.
revoke select on public.orders from anon;
grant select (id) on public.orders to anon;

drop policy if exists "orders public read id" on public.orders;
create policy "orders public read id" on public.orders
  for select to anon using (true);

drop policy if exists "orders owner all" on public.orders;
create policy "orders owner all" on public.orders
  for all to authenticated using (true) with check (true);

-- Product photos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "photos public read" on storage.objects;
create policy "photos public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "photos owner write" on storage.objects;
create policy "photos owner write" on storage.objects
  for all to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');


-- WishUpon: product options, sale prices, shop flags, and customer feedback.
--
-- ADDITIVE ONLY: new nullable columns and one new table. Nothing existing is
-- changed or dropped, so it is safe to run on the live database.
--
-- After running this, set NEXT_PUBLIC_EXTENDED_SCHEMA=1 in Vercel
-- (Project > Settings > Environment Variables) and redeploy. Until then the
-- shop ignores these fields, so deploying the code first cannot break it.

alter table public.products
  add column if not exists sizes         text[],
  add column if not exists colors        text[],
  add column if not exists old_price     integer,
  add column if not exists is_bestseller boolean not null default false,
  add column if not exists is_new        boolean not null default false;

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  rating     smallint not null check (rating between 1 and 5),
  message    text not null check (char_length(message) between 1 and 1000),
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Anyone may leave feedback, but it is saved as unapproved.
drop policy if exists "feedback insert" on public.feedback;
create policy "feedback insert" on public.feedback
  for insert to anon, authenticated
  with check (approved = false);

-- The public reads approved feedback only.
drop policy if exists "feedback read approved" on public.feedback;
create policy "feedback read approved" on public.feedback
  for select to anon, authenticated
  using (approved = true);

-- The signed-in owner can read everything, approve, and delete.
drop policy if exists "feedback owner all" on public.feedback;
create policy "feedback owner all" on public.feedback
  for all to authenticated
  using (true) with check (true);


-- WishUpon: shop settings (delivery fee) and the delivery charge on orders.
-- ADDITIVE ONLY. Safe to run more than once.

create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Shoppers read the settings (the delivery fee shows in the cart); only the
-- signed-in owner can change them.
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "settings owner write" on public.site_settings;
create policy "settings owner write" on public.site_settings
  for all to authenticated using (true) with check (true);

-- What delivery was charged on each order, so totals stay explainable later.
alter table public.orders
  add column if not exists shipping integer not null default 0;
