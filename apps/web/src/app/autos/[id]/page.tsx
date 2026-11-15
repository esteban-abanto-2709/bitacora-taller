import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVehicle } from "@/lib/vehicles";

async function Body({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
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
