create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  plate text not null unique check (plate ~ '^[A-Z0-9]+$'),
  brand text not null check (length(btrim(brand)) > 0),
  model text not null check (length(btrim(model)) > 0),
  year integer check (year between 1950 and 2100),
  owner_name text,
  owner_phone text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id) on delete set null
);

alter table public.vehicles enable row level security;

grant select, insert, update on public.vehicles to authenticated;

create policy "vehicles_select_authenticated" on public.vehicles
  for select to authenticated using (true);

create policy "vehicles_insert_authenticated" on public.vehicles
  for insert to authenticated with check (true);

create policy "vehicles_update_authenticated" on public.vehicles
  for update to authenticated using (true) with check (true);
