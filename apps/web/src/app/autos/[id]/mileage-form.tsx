"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MileageFormState } from "./actions";

export function MileageForm({
  action,
  today,
}: {
  action: (
    prevState: MileageFormState,
    formData: FormData,
  ) => Promise<MileageFormState>;
  today: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="km">Kilometraje</Label>
          <Input
            id="km"
            name="km"
            type="number"
            inputMode="numeric"
            min={0}
            required
            defaultValue={state?.values.km}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="read_on">Fecha</Label>
          <Input
            id="read_on"
            name="read_on"
            type="date"
            max={today}
            required
            defaultValue={state?.values.read_on ?? today}
          />
        </div>
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Guardando…" : "Agregar lectura"}
      </Button>
    </form>
  );
}
