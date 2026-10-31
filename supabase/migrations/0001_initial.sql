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
