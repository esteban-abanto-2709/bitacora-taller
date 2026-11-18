create table public.service_types (
  id smallint generated always as identity primary key,
  name text not null unique,
  sort_order smallint not null
);

insert into public.service_types (name, sort_order) values
  ('Cambio de aceite', 1),
  ('Filtro de aire', 2),
  ('Filtro de combustible', 3),
  ('Frenos', 4),
  ('Alineación y balanceo', 5),
  ('Rotación de llantas', 6),
  ('Batería', 7),
  ('Refrigerante', 8),
  ('Bujías', 9),
  ('Afinamiento', 10),
  ('Reparación', 11);

alter table public.service_types enable row level security;

grant select on public.service_types to authenticated;

create policy "service_types_select_authenticated"
  on public.service_types for select to authenticated using (true);

create table public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id),
  service_type_id smallint not null references public.service_types (id),
  done_on date not null,
  km integer not null check (km between 0 and 2000000),
  description text,
  observation text,
  cost numeric(10, 2) check (cost >= 0),
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id) on delete set null
);

create index maintenance_records_vehicle_done_on_idx
  on public.maintenance_records (vehicle_id, done_on desc, created_at desc);

alter table public.maintenance_records enable row level security;

grant select, insert, update, delete on public.maintenance_records to authenticated;

create policy "maintenance_records_select_authenticated"
  on public.maintenance_records for select to authenticated using (true);

create policy "maintenance_records_insert_authenticated"
  on public.maintenance_records for insert to authenticated with check (true);

create policy "maintenance_records_update_authenticated"
  on public.maintenance_records for update to authenticated using (true) with check (true);

create policy "maintenance_records_delete_authenticated"
  on public.maintenance_records for delete to authenticated using (true);

create view public.vehicle_odometer with (security_invoker = true) as
  select vehicle_id, km, read_on, created_at, null::uuid as maintenance_id
  from public.mileage_readings
  union all
  select vehicle_id, km, done_on, created_at, id
  from public.maintenance_records;

grant select on public.vehicle_odometer to authenticated;
