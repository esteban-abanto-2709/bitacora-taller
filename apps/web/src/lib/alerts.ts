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
