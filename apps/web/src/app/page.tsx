import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "./login/actions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-2 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Bitácora Taller
      </h1>
      <p className="text-muted-foreground">
        Control de mantenimiento de tus autos.
      </p>
      <form action={logout} className="mt-4">
        <Button type="submit" variant="outline">
          <LogOut />
          Cerrar sesión
        </Button>
      </form>
    </main>
  );
}
