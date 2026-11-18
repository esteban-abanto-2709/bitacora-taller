"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkKm, MAX_KM, today } from "@/lib/mileage";
import { createClient } from "@/lib/supabase/server";

export type MaintenanceFormState = {
  error: string;
  values: Record<string, string>;
} | null;

function parseMaintenanceForm(formData: FormData) {
  const values = Object.fromEntries(
    [
      "service_type_id",
      "done_on",
      "km",
      "description",
      "observation",
      "cost",
    ].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  const typeText = values.service_type_id.trim();
  const serviceTypeId = Number(typeText);
  const doneOn = values.done_on.trim();
  const kmText = values.km.trim();
  const km = Number(kmText);
  const costText = values.cost.trim();

  if (!typeText || !Number.isInteger(serviceTypeId) || serviceTypeId <= 0) {
    return { values, error: "Elige el tipo de servicio." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(doneOn)) {
    return { values, error: "Elige la fecha." };
  }
  if (doneOn > today()) {
    return { values, error: "La fecha no puede ser futura." };
  }
  if (!kmText || !Number.isInteger(km) || km < 0 || km > MAX_KM) {
    return { values, error: "El kilometraje no es válido." };
  }
  if (costText && !/^\d+(\.\d{1,2})?$/.test(costText)) {
    return { values, error: "El costo no es válido." };
  }

  return {
    values,
    data: {
      service_type_id: serviceTypeId,
      done_on: doneOn,
      km,
      description: values.description.trim() || null,
      observation: values.observation.trim() || null,
      cost: costText ? Number(costText) : null,
    },
  };
}

export async function createMaintenance(
  vehicleId: string,
  prevState: MaintenanceFormState,
  formData: FormData,
): Promise<MaintenanceFormState> {
  const { values, error: formError, data } = parseMaintenanceForm(formData);
  if (!data) return { error: formError, values };

  const kmError = await checkKm(vehicleId, data.km, data.done_on);
  if (kmError) return { error: kmError, values };

  const supabase = await createClient();
  const { error } = await supabase
    .from("maintenance_records")
    .insert({ vehicle_id: vehicleId, ...data });

  if (error) {
    return {
      error: "No se pudo guardar el mantenimiento. Intenta de nuevo.",
      values,
    };
  }

  revalidatePath(`/autos/${vehicleId}`);
  redirect(`/autos/${vehicleId}`);
}
