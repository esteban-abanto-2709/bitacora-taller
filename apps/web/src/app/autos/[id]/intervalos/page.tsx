import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getServiceIntervals, type ServiceInterval } from "@/lib/alerts";
import { formatKm } from "@/lib/mileage";
import { getVehicle } from "@/lib/vehicles";
import { saveIntervals } from "./actions";
import { IntervalsForm } from "./intervals-form";

function defaultText(i: ServiceInterval) {
  const parts = [
    ...(i.default_km !== null ? [formatKm(i.default_km)] : []),
    ...(i.default_months !== null ? [`${i.default_months} meses`] : []),
  ];
  return parts.length > 0 ? parts.join(" · ") : "sin intervalo";
}

async function Body({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [vehicle, intervals] = await Promise.all([
    getVehicle(id),
    getServiceIntervals(id),
  ]);
  if (!vehicle) notFound();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Intervalos de servicio
          </h1>
          <p className="text-muted-foreground">{vehicle.plate}</p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/autos/${vehicle.id}`}>Cancelar</Link>
        </Button>
      </div>
      {intervals === null ? (
        <p className="text-destructive">
          No se pudieron cargar los intervalos.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Avisa lo primero que llegue. Deja un campo vacío para no avisar por
            ese criterio.
          </p>
          <IntervalsForm
            action={saveIntervals.bind(null, vehicle.id)}
            intervals={intervals}
            hints={Object.fromEntries(
              intervals.map((i) => [i.id, defaultText(i)]),
            )}
            defaultValues={Object.fromEntries(
              intervals.flatMap((i) => [
                [`km_${i.id}`, i.km === null ? "" : String(i.km)],
                [`months_${i.id}`, i.months === null ? "" : String(i.months)],
              ]),
            )}
          />
        </>
      )}
    </>
  );
}

export default function IntervalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8">
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Body params={params} />
      </Suspense>
    </main>
  );
}
