import { createClient } from "@/lib/supabase/server";

export type ServiceType = { id: number; name: string };

export type MaintenanceRecord = {
  id: string;
  vehicle_id: string;
  service_type_id: number;
  done_on: string;
  km: number;
  description: string | null;
  observation: string | null;
  cost: number | null;
  created_at: string;
  created_by: string | null;
  service_types: { name: string };
};

export function formatCost(cost: number) {
  return `S/ ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost)}`;
}

export async function getServiceTypes(): Promise<ServiceType[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_types")
    .select("id, name")
    .order("sort_order");
  return error ? null : (data as ServiceType[]);
}

export async function getMaintenanceRecords(
  vehicleId: string,
): Promise<MaintenanceRecord[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("maintenance_records")
    .select("*, service_types(name)")
    .eq("vehicle_id", vehicleId)
    .order("done_on", { ascending: false })
    .order("created_at", { ascending: false });
  return error ? null : (data as unknown as MaintenanceRecord[]);
}
