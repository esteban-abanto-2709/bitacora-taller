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

export async function getCurrentKm(
  vehicleId: string,
): Promise<{ km: number; read_on: string } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_odometer")
    .select("km, read_on")
    .eq("vehicle_id", vehicleId)
    .order("read_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return error ? null : data;
}

export async function checkKm(
  vehicleId: string,
  km: number,
  date: string,
  excludeMaintenanceId?: string,
): Promise<string | null> {
  const supabase = await createClient();
  const exclude = `maintenance_id.is.null,maintenance_id.neq.${excludeMaintenanceId}`;
  let beforeQuery = supabase
    .from("vehicle_odometer")
    .select("km")
    .eq("vehicle_id", vehicleId)
    .lte("read_on", date);
  let afterQuery = supabase
    .from("vehicle_odometer")
    .select("km")
    .eq("vehicle_id", vehicleId)
    .gt("read_on", date);
  if (excludeMaintenanceId) {
    beforeQuery = beforeQuery.or(exclude);
    afterQuery = afterQuery.or(exclude);
  }
  const [before, after] = await Promise.all([
    beforeQuery.order("km", { ascending: false }).limit(1).maybeSingle(),
    afterQuery.order("km", { ascending: true }).limit(1).maybeSingle(),
  ]);

  if (before.error || after.error) {
    return "No se pudo validar el kilometraje. Intenta de nuevo.";
  }
  if (before.data && km < before.data.km) {
    return `El kilometraje no puede ser menor que un registro anterior (${formatKm(before.data.km)}).`;
  }
  if (after.data && km > after.data.km) {
    return `El kilometraje no puede ser mayor que un registro posterior (${formatKm(after.data.km)}).`;
  }
  return null;
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
