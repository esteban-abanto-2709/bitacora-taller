import { createClient } from "@/lib/supabase/server";
import { today } from "@/lib/mileage";

export const UPCOMING_KM = 1000;
export const UPCOMING_DAYS = 30;

export type DueService = {
  vehicle_id: string;
  plate: string;
  service_type_id: number;
  service_type_name: string;
  sort_order: number;
  last_done_on: string;
  last_km: number;
  current_km: number;
  interval_km: number | null;
  interval_months: number | null;
  due_km: number | null;
  due_on: string | null;
};

export type DueStatus = "overdue" | "upcoming";

function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export function dueStatus(s: DueService, today: string): DueStatus | null {
  if (
    (s.due_km !== null && s.current_km >= s.due_km) ||
    (s.due_on !== null && s.due_on <= today)
  ) {
    return "overdue";
  }
  if (
    (s.due_km !== null && s.due_km - s.current_km <= UPCOMING_KM) ||
    (s.due_on !== null && daysBetween(today, s.due_on) <= UPCOMING_DAYS)
  ) {
    return "upcoming";
  }
  return null;
}

export type ServiceInterval = {
  id: number;
  name: string;
  default_km: number | null;
  default_months: number | null;
  km: number | null;
  months: number | null;
  overridden: boolean;
};

export async function getServiceIntervals(
  vehicleId: string,
): Promise<ServiceInterval[] | null> {
  const supabase = await createClient();
  const [types, overrides] = await Promise.all([
    supabase
      .from("service_types")
      .select("id, name, interval_km, interval_months")
      .order("sort_order"),
    supabase
      .from("vehicle_service_intervals")
      .select("service_type_id, interval_km, interval_months")
      .eq("vehicle_id", vehicleId),
  ]);
  if (types.error || overrides.error) return null;
  return types.data.map((t) => {
    const o = overrides.data.find((r) => r.service_type_id === t.id);
    return {
      id: t.id,
      name: t.name,
      default_km: t.interval_km,
      default_months: t.interval_months,
      km: o ? o.interval_km : t.interval_km,
      months: o ? o.interval_months : t.interval_months,
      overridden: !!o,
    };
  });
}

export async function getDueServices(): Promise<
  { service: DueService; status: DueStatus }[] | null
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_service_due")
    .select("*")
    .order("plate")
    .order("sort_order");
  if (error) return null;
  const now = today();
  const items = (data as DueService[]).flatMap((service) => {
    const status = dueStatus(service, now);
    return status ? [{ service, status }] : [];
  });
  return [
    ...items.filter((i) => i.status === "overdue"),
    ...items.filter((i) => i.status === "upcoming"),
  ];
}
