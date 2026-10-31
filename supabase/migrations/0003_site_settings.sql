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
