import Link from "next/link";
import { Suspense } from "react";
import { LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "./login/actions";
import { DueServices } from "./due-services";
import { VehicleList } from "./vehicle-list";

async function Body({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";

  return (
    <>
      {!q && <DueServices />}
      <form>
        <Input
          name="q"
          type="search"
          placeholder="Buscar por placa"
          aria-label="Buscar por placa"
          defaultValue={q}
        />
      </form>
      <Button asChild className="w-full">
        <Link href="/autos/nuevo">
          <Plus />
          Nuevo auto
        </Link>
      </Button>
      <VehicleList q={q} />
    </>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Autos</h1>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Cerrar sesión"
          >
            <LogOut />
          </Button>
        </form>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Body searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
