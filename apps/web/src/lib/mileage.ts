import { createClient } from "@/lib/supabase/server";

export type MileageReading = {
  id: string;
  vehicle_id: string;
  km: number;
  read_on: string;
  created_at: string;
  created_by: string | null;
};

export const MAX_KM = 2_000_000;

export function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(
    new Date(),
  );
}

export function formatKm(km: number) {
  return `${new Intl.NumberFormat("en-US").format(km)} km`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export async function getReadings(vehicleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mileage_readings")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("read_on", { ascending: false })
    .order("created_at", { ascending: false });
  return error ? null : (data as MileageReading[]);
}
