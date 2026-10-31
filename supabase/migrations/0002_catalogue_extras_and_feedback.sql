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
