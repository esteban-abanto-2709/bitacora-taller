import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getServiceTypes } from "@/lib/maintenance";
import { getCurrentKm, today } from "@/lib/mileage";
import { getVehicle } from "@/lib/vehicles";
import { createMaintenance } from "../actions";
import { MaintenanceForm } from "../maintenance-form";

async function Body({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [vehicle, serviceTypes, current] = await Promise.all([
    getVehicle(id),
    getServiceTypes(),
    getCurrentKm(id),
  ]);
  if (!vehicle) notFound();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Nuevo mantenimiento
          </h1>
          <p className="text-muted-foreground">{vehicle.plate}</p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/autos/${vehicle.id}`}>Cancelar</Link>
        </Button>
      </div>
      {serviceTypes === null ? (
        <p className="text-destructive">
          No se pudieron cargar los tipos de servicio.
        </p>
      ) : (
        <MaintenanceForm
          action={createMaintenance.bind(null, vehicle.id)}
          serviceTypes={serviceTypes}
          today={today()}
          defaultValues={{
            done_on: today(),
            km: current ? String(current.km) : "",
          }}
        />
      )}
    </>
  );
}

export default function NewMaintenancePage({
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
