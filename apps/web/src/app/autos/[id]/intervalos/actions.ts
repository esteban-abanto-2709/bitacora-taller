"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServiceIntervals } from "@/lib/alerts";
import { MAX_KM } from "@/lib/mileage";
import { createClient } from "@/lib/supabase/server";

export type IntervalsFormState = {
  error: string;
  values: Record<string, string>;
} | null;

const SAVE_ERROR = "No se pudieron guardar los intervalos. Intenta de nuevo.";
const MAX_MONTHS = 120;

function parseInterval(text: string, max: number) {
  if (!text) return null;
  const n = Number(text);
  return Number.isInteger(n) && n >= 1 && n <= max ? n : undefined;
}

export async function saveIntervals(
  vehicleId: string,
  prevState: IntervalsFormState,
  formData: FormData,
): Promise<IntervalsFormState> {
  const types = await getServiceIntervals(vehicleId);
  if (!types) return { error: SAVE_ERROR, values: {} };

  const values = Object.fromEntries(
    types.flatMap((t) =>
      [`km_${t.id}`, `months_${t.id}`].map((k) => [
        k,
        String(formData.get(k) ?? ""),
      ]),
    ),
  );

  const upserts: {
    vehicle_id: string;
    service_type_id: number;
    interval_km: number | null;
    interval_months: number | null;
  }[] = [];
  const deletes: number[] = [];

  for (const t of types) {
    const km = parseInterval(values[`km_${t.id}`].trim(), MAX_KM);
    const months = parseInterval(values[`months_${t.id}`].trim(), MAX_MONTHS);
    if (km === undefined) {
      return { error: `El kilometraje de ${t.name} no es válido.`, values };
    }
    if (months === undefined) {
      return { error: `Los meses de ${t.name} no son válidos.`, values };
    }
    if (km === t.default_km && months === t.default_months) {
      deletes.push(t.id);
    } else {
      upserts.push({
        vehicle_id: vehicleId,
        service_type_id: t.id,
        interval_km: km,
        interval_months: months,
      });
    }
  }

  const supabase = await createClient();
  if (upserts.length > 0) {
    const { error } = await supabase
      .from("vehicle_service_intervals")
      .upsert(upserts, { onConflict: "vehicle_id,service_type_id" });
    if (error) return { error: SAVE_ERROR, values };
  }
  if (deletes.length > 0) {
    const { error } = await supabase
      .from("vehicle_service_intervals")
      .delete()
      .eq("vehicle_id", vehicleId)
      .in("service_type_id", deletes);
    if (error) return { error: SAVE_ERROR, values };
  }

  revalidatePath(`/autos/${vehicleId}`);
  revalidatePath("/");
  redirect(`/autos/${vehicleId}`);
}
