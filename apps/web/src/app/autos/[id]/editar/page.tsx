import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getVehicle } from "@/lib/vehicles";
import { updateVehicle } from "../../actions";
import { VehicleForm } from "../../vehicle-form";

async function Body({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Editar auto</h1>
        <Button asChild variant="ghost">
          <Link href={`/autos/${vehicle.id}`}>Cancelar</Link>
        </Button>
      </div>
      <VehicleForm
        action={updateVehicle.bind(null, vehicle.id)}
        defaultValues={{
          plate: vehicle.plate,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year === null ? "" : String(vehicle.year),
          owner_name: vehicle.owner_name ?? "",
          owner_phone: vehicle.owner_phone ?? "",
        }}
      />
    </>
  );
}

export default function EditVehiclePage({
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
