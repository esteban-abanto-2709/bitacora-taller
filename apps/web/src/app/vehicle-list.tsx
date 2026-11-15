import { createClient } from "@/lib/supabase/server";
import { normalizePlate } from "@/lib/vehicles";

export async function VehicleList({ q }: { q: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("vehicles")
    .select("id, plate, brand, model, year")
    .order("plate", { ascending: true });
  if (q) query = query.ilike("plate", `%${normalizePlate(q)}%`);
  const { data, error } = await query;

  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        No se pudieron cargar los autos.
      </p>
    );
  }

  if (!data.length) {
    return (
      <p className="text-muted-foreground">
        {q
          ? "No hay autos con esa placa."
          : "Todavía no hay autos registrados."}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.map((v) => (
        <li key={v.id} className="rounded-lg border bg-card p-3">
          <p className="font-semibold">{v.plate}</p>
          <p className="text-muted-foreground">
            {v.brand} {v.model}
            {v.year ? ` · ${v.year}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
