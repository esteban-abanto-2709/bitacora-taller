create table public.mileage_readings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id),
  km integer not null check (km between 0 and 2000000),
  read_on date not null default current_date,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id) on delete set null
);

create index mileage_readings_vehicle_read_on_idx
  on public.mileage_readings (vehicle_id, read_on desc, created_at desc);

alter table public.mileage_readings enable row level security;

grant select, insert, delete on public.mileage_readings to authenticated;

create policy "mileage_readings_select_authenticated"
  on public.mileage_readings for select to authenticated using (true);

create policy "mileage_readings_insert_authenticated"
  on public.mileage_readings for insert to authenticated with check (true);

create policy "mileage_readings_delete_authenticated"
  on public.mileage_readings for delete to authenticated using (true);
