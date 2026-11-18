"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleFormState } from "./actions";

export function VehicleForm({
  action,
  defaultValues,
  askKm = false,
}: {
  action: (
    prevState: VehicleFormState,
    formData: FormData,
  ) => Promise<VehicleFormState>;
  defaultValues?: Record<string, string>;
  askKm?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const v = state?.values ?? defaultValues;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="plate">Placa</Label>
        <Input
          id="plate"
          name="plate"
          required
          autoCapitalize="characters"
          autoComplete="off"
          defaultValue={v?.plate}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="brand">Marca</Label>
        <Input id="brand" name="brand" required defaultValue={v?.brand} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="model">Modelo</Label>
        <Input id="model" name="model" required defaultValue={v?.model} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="year">Año</Label>
        <Input
          id="year"
          name="year"
          type="number"
          inputMode="numeric"
          min={1950}
          max={2100}
          defaultValue={v?.year}
        />
      </div>
      {askKm && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="km">Kilometraje actual (opcional)</Label>
          <Input
            id="km"
            name="km"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={v?.km}
          />
        </div>
      )}
      <p className="text-sm font-medium text-muted-foreground">
        Contacto del dueño (opcional)
      </p>
      <div className="flex flex-col gap-2">
        <Label htmlFor="owner_name">Nombre</Label>
        <Input id="owner_name" name="owner_name" defaultValue={v?.owner_name} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="owner_phone">Teléfono</Label>
        <Input
          id="owner_phone"
          name="owner_phone"
          type="tel"
          inputMode="tel"
          defaultValue={v?.owner_phone}
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  );
}
