import { createClient } from "@/lib/supabase/server";

export type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number | null;
  owner_name: string | null;
  owner_phone: string | null;
  created_at: string;
  created_by: string | null;
};

export function normalizePlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return error ? null : (data as Vehicle | null);
}
