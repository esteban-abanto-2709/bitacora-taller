"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePlate } from "@/lib/vehicles";

export type VehicleFormState = {
  error: string;
  values: Record<string, string>;
} | null;

export async function createVehicle(
  prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
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

  if (!plate) return { error: "Ingresa la placa.", values };
  if (!brand || !model) {
    return { error: "Completa marca y modelo.", values };
  }
  if (year !== null && !Number.isInteger(year)) {
    return { error: "El año no es válido.", values };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").insert({
    plate,
    brand,
    model,
    year,
    owner_name: values.owner_name.trim() || null,
    owner_phone: values.owner_phone.trim() || null,
  });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ya existe un auto con esa placa."
          : "No se pudo guardar el auto. Intenta de nuevo.",
      values,
    };
  }

  redirect("/");
}
