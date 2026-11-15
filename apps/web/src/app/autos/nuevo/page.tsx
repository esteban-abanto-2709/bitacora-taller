import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createVehicle } from "../actions";
import { VehicleForm } from "../vehicle-form";

export default function NewVehiclePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Nuevo auto</h1>
        <Button asChild variant="ghost">
          <Link href="/">Cancelar</Link>
        </Button>
      </div>
      <VehicleForm action={createVehicle} />
    </main>
  );
}
