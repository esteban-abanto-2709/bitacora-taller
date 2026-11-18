import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatKm,
  getCurrentKm,
  getReadings,
  today,
} from "@/lib/mileage";
import { getVehicle } from "@/lib/vehicles";
import { addReading, deleteReading } from "./actions";
import { DeleteReadingButton } from "./delete-reading-button";
import { MileageForm } from "./mileage-form";

async function Body({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [vehicle, readings, current] = await Promise.all([
    getVehicle(id),
    getReadings(id),
    getCurrentKm(id),
  ]);
  if (!vehicle) notFound();

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {vehicle.plate}
        </h1>
        <p className="text-muted-foreground">
          {vehicle.brand} {vehicle.model}
          {vehicle.year ? ` · ${vehicle.year}` : ""}
        </p>
      </div>
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            Kilometraje actual
          </h2>
          {readings === null ? (
            <p className="text-destructive">
              No se pudo cargar el kilometraje.
            </p>
          ) : current ? (
            <p>
              <span className="text-xl font-semibold">
                {formatKm(current.km)}
              </span>
              <span className="text-muted-foreground">
                {" "}
                · {formatDate(current.read_on)}
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">Sin lecturas.</p>
          )}
        </div>
        <MileageForm
          action={addReading.bind(null, vehicle.id)}
          today={today()}
        />
        {readings && readings.length > 0 && (
          <ul className="flex flex-col divide-y rounded-lg border">
            {readings.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-2 py-1 pr-1 pl-3"
              >
                <span>
                  {formatKm(r.km)}
                  <span className="text-muted-foreground">
                    {" "}
                    · {formatDate(r.read_on)}
                  </span>
                </span>
                <DeleteReadingButton
                  action={deleteReading.bind(null, vehicle.id, r.id)}
                  label={`${formatKm(r.km)} del ${formatDate(r.read_on)}`}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-muted-foreground">
          Contacto del dueño
        </h2>
        {vehicle.owner_name || vehicle.owner_phone ? (
          <>
            {vehicle.owner_name && <p>{vehicle.owner_name}</p>}
            {vehicle.owner_phone && (
              <a href={`tel:${vehicle.owner_phone}`} className="underline">
                {vehicle.owner_phone}
              </a>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Sin contacto registrado.</p>
        )}
      </section>
      <Button asChild className="w-full">
        <Link href={`/autos/${vehicle.id}/editar`}>
          <Pencil />
          Editar
        </Link>
      </Button>
    </>
  );
}

export default function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8">
      <Button asChild variant="ghost" className="self-start">
        <Link href="/">
          <ArrowLeft />
          Autos
        </Link>
      </Button>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Body params={params} />
      </Suspense>
    </main>
  );
}
