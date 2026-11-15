"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePlate } from "@/lib/vehicles";

export type VehicleFormState = {
  error: string;
  values: Record<string, string>;
} | null;

function parseVehicleForm(formData: FormData) {
  const values = Object.fromEntries(
    ["plate", "brand", "model", "year", "owner_name", "owner_phone"].map(
      (k) => [k, String(formData.get(k) ?? "")],
    ),
  );

  const plate = normalizePlate(values.plate);
  const brand = values.brand.trim();
  const model = values.model.trim();
  const yearText = values.year.trim();
  const year = yearText ? Number(yearText) : null;

  if (!plate) return { values, error: "Ingresa la placa." };
  if (!brand || !model) {
    return { values, error: "Completa marca y modelo." };
  }
  if (year !== null && !Number.isInteger(year)) {
    return { values, error: "El año no es válido." };
  }

  return {
    values,
    data: {
      plate,
      brand,
      model,
      year,
      owner_name: values.owner_name.trim() || null,
      owner_phone: values.owner_phone.trim() || null,
    },
  };
}

function saveError(code: string | undefined) {
  return code === "23505"
    ? "Ya existe un auto con esa placa."
    : "No se pudo guardar el auto. Intenta de nuevo.";
}

export async function createVehicle(
  prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const { values, error: formError, data } = parseVehicleForm(formData);
  if (!data) return { error: formError, values };

  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").insert(data);

  if (error) return { error: saveError(error.code), values };

  redirect("/");
}

export async function updateVehicle(
  id: string,
  prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const { values, error: formError, data } = parseVehicleForm(formData);
  if (!data) return { error: formError, values };

  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").update(data).eq("id", id);

  if (error) return { error: saveError(error.code), values };

  redirect(`/autos/${id}`);
}
