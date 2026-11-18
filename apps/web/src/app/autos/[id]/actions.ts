"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatKm, MAX_KM, today } from "@/lib/mileage";

export type MileageFormState = {
  error: string;
  values: Record<string, string>;
} | null;

export async function addReading(
  vehicleId: string,
  prevState: MileageFormState,
  formData: FormData,
): Promise<MileageFormState> {
  const values = {
    km: String(formData.get("km") ?? ""),
    read_on: String(formData.get("read_on") ?? ""),
  };
  const km = Number(values.km.trim());
  const readOn = values.read_on;

  if (!values.km.trim() || !Number.isInteger(km) || km < 0 || km > MAX_KM) {
    return { error: "El kilometraje no es válido.", values };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(readOn)) {
    return { error: "Elige la fecha de la lectura.", values };
  }
  if (readOn > today()) {
    return { error: "La fecha no puede ser futura.", values };
  }

  const supabase = await createClient();
  const [before, after] = await Promise.all([
    supabase
      .from("mileage_readings")
      .select("km")
      .eq("vehicle_id", vehicleId)
      .lte("read_on", readOn)
      .order("km", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("mileage_readings")
      .select("km")
      .eq("vehicle_id", vehicleId)
      .gt("read_on", readOn)
      .order("km", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (before.error || after.error) {
    return {
      error: "No se pudo guardar la lectura. Intenta de nuevo.",
      values,
    };
  }
  if (before.data && km < before.data.km) {
    return {
      error: `El kilometraje no puede ser menor que una lectura anterior (${formatKm(before.data.km)}).`,
      values,
    };
  }
  if (after.data && km > after.data.km) {
    return {
      error: `El kilometraje no puede ser mayor que una lectura posterior (${formatKm(after.data.km)}).`,
      values,
    };
  }

  const { error } = await supabase
    .from("mileage_readings")
    .insert({ vehicle_id: vehicleId, km, read_on: readOn });
  if (error) {
    return {
      error: "No se pudo guardar la lectura. Intenta de nuevo.",
      values,
    };
  }

  revalidatePath(`/autos/${vehicleId}`);
  return null;
}

export async function deleteReading(vehicleId: string, readingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mileage_readings")
    .delete()
    .eq("id", readingId);
  if (error) throw new Error("No se pudo borrar la lectura.");
  revalidatePath(`/autos/${vehicleId}`);
}
