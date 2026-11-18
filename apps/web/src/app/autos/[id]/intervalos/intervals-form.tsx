"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ServiceInterval } from "@/lib/alerts";
import type { IntervalsFormState } from "./actions";

export function IntervalsForm({
  action,
  intervals,
  hints,
  defaultValues,
}: {
  action: (
    prevState: IntervalsFormState,
    formData: FormData,
  ) => Promise<IntervalsFormState>;
  intervals: ServiceInterval[];
  hints: Record<number, string>;
  defaultValues: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const v = state?.values ?? defaultValues;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {intervals.map((i) => (
        <fieldset
          key={i.id}
          className="flex flex-col gap-2 rounded-lg border p-3"
        >
          <legend className="px-1 font-medium">{i.name}</legend>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`km_${i.id}`}>Km</Label>
              <Input
                id={`km_${i.id}`}
                name={`km_${i.id}`}
                type="number"
                inputMode="numeric"
                min={1}
                defaultValue={v[`km_${i.id}`]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`months_${i.id}`}>Meses</Label>
              <Input
                id={`months_${i.id}`}
                name={`months_${i.id}`}
                type="number"
                inputMode="numeric"
                min={1}
                defaultValue={v[`months_${i.id}`]}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Por defecto: {hints[i.id]}
          </p>
        </fieldset>
      ))}
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
