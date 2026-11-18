import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getMaintenanceRecord, getServiceTypes } from "@/lib/maintenance";
import { formatDate, today } from "@/lib/mileage";
import { getVehicle } from "@/lib/vehicles";
import { deleteMaintenance, updateMaintenance } from "../../actions";
import { DeleteMaintenanceButton } from "../../delete-maintenance-button";
import { MaintenanceForm } from "../../maintenance-form";

async function Body({
  params,
}: {
  params: Promise<{ id: string; mid: string }>;
}) {
  const { id, mid } = await params;
  const [vehicle, record, serviceTypes] = await Promise.all([
    getVehicle(id),
    getMaintenanceRecord(mid),
    getServiceTypes(),
  ]);
  if (!vehicle || !record || record.vehicle_id !== vehicle.id) notFound();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Editar mantenimiento
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
        <>
          <MaintenanceForm
            action={updateMaintenance.bind(null, vehicle.id, record.id)}
            serviceTypes={serviceTypes}
            today={today()}
            defaultValues={{
              service_type_id: String(record.service_type_id),
              done_on: record.done_on,
              km: String(record.km),
              description: record.description ?? "",
              observation: record.observation ?? "",
              cost: record.cost === null ? "" : String(record.cost),
            }}
          />
          <DeleteMaintenanceButton
            action={deleteMaintenance.bind(null, vehicle.id, record.id)}
            label={`${record.service_types.name} del ${formatDate(record.done_on)}`}
          />
        </>
      )}
    </>
  );
}

export default function EditMaintenancePage({
  params,
}: {
  params: Promise<{ id: string; mid: string }>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8">
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Body params={params} />
      </Suspense>
    </main>
  );
}
