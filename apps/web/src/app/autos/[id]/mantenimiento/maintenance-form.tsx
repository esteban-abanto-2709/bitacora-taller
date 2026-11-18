"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ServiceType } from "@/lib/maintenance";
import type { MaintenanceFormState } from "./actions";

const fieldClass =
  "w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30";

export function MaintenanceForm({
  action,
  serviceTypes,
  today,
  defaultValues,
}: {
  action: (
    prevState: MaintenanceFormState,
    formData: FormData,
  ) => Promise<MaintenanceFormState>;
  serviceTypes: ServiceType[];
  today: string;
  defaultValues?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const v = state?.values ?? defaultValues;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="service_type_id">Tipo de servicio</Label>
        <select
          id="service_type_id"
          name="service_type_id"
          required
          key={v?.service_type_id}
          defaultValue={v?.service_type_id ?? ""}
          className={`${fieldClass} h-9`}
        >
          <option value="" disabled>
            Elige un tipo
          </option>
          {serviceTypes.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="done_on">Fecha</Label>
        <Input
          id="done_on"
          name="done_on"
          type="date"
          max={today}
          required
          defaultValue={v?.done_on}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="km">Kilometraje</Label>
        <Input
          id="km"
          name="km"
          type="number"
          inputMode="numeric"
          min={0}
          required
          defaultValue={v?.km}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={v?.description}
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="observation">Observación (opcional)</Label>
        <textarea
          id="observation"
          name="observation"
          rows={3}
          defaultValue={v?.observation}
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="cost">Costo en soles (opcional)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          defaultValue={v?.cost}
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
