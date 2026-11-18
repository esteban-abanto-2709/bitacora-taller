alter table public.service_types
  add column interval_km integer check (interval_km > 0),
  add column interval_months smallint check (interval_months > 0);

update public.service_types as t set interval_km = v.km, interval_months = v.months
from (values
  ('Cambio de aceite', 5000, 6),
  ('Filtro de aire', 10000, 12),
  ('Filtro de combustible', 20000, 12),
  ('Frenos', 20000, 12),
  ('Alineación y balanceo', 10000, 6),
  ('Rotación de llantas', 10000, 6),
  ('Batería', null, 24),
  ('Refrigerante', 40000, 24),
  ('Bujías', 30000, 24),
  ('Afinamiento', 20000, 12)
) as v(name, km, months)
where t.name = v.name;

create table public.vehicle_service_intervals (
  vehicle_id uuid not null references public.vehicles (id),
  service_type_id smallint not null references public.service_types (id),
  interval_km integer check (interval_km > 0),
  interval_months smallint check (interval_months > 0),
  primary key (vehicle_id, service_type_id)
);

alter table public.vehicle_service_intervals enable row level security;

grant select, insert, update, delete on public.vehicle_service_intervals to authenticated;

create policy "vehicle_service_intervals_select_authenticated"
  on public.vehicle_service_intervals for select to authenticated using (true);

create policy "vehicle_service_intervals_insert_authenticated"
  on public.vehicle_service_intervals for insert to authenticated with check (true);

create policy "vehicle_service_intervals_update_authenticated"
  on public.vehicle_service_intervals for update to authenticated using (true) with check (true);

create policy "vehicle_service_intervals_delete_authenticated"
  on public.vehicle_service_intervals for delete to authenticated using (true);

create view public.vehicle_service_due with (security_invoker = true) as
  with last_service as (
    select distinct on (vehicle_id, service_type_id)
      vehicle_id, service_type_id, done_on, km
    from public.maintenance_records
    order by vehicle_id, service_type_id, done_on desc, created_at desc
  ),
  current_km as (
    select distinct on (vehicle_id) vehicle_id, km
    from public.vehicle_odometer
    order by vehicle_id, read_on desc, created_at desc
  ),
  effective as (
    select
      l.vehicle_id,
      l.service_type_id,
      l.done_on,
      l.km,
      case when o.vehicle_id is null then t.interval_km else o.interval_km end as interval_km,
      case when o.vehicle_id is null then t.interval_months else o.interval_months end as interval_months
    from last_service l
    join public.service_types t on t.id = l.service_type_id
    left join public.vehicle_service_intervals o
      on o.vehicle_id = l.vehicle_id and o.service_type_id = l.service_type_id
  )
  select
    e.vehicle_id,
    v.plate,
    e.service_type_id,
    t.name as service_type_name,
    t.sort_order,
    e.done_on as last_done_on,
    e.km as last_km,
    c.km as current_km,
    e.interval_km,
    e.interval_months,
    e.km + e.interval_km as due_km,
    (e.done_on + make_interval(months => e.interval_months))::date as due_on
  from effective e
  join public.vehicles v on v.id = e.vehicle_id
  join public.service_types t on t.id = e.service_type_id
  join current_km c on c.vehicle_id = e.vehicle_id
  where e.interval_km is not null or e.interval_months is not null;

grant select on public.vehicle_service_due to authenticated;
