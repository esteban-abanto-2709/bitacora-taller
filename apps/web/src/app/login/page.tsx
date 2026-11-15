import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Bitácora Taller
        </h1>
        <p className="text-muted-foreground">Ingresa con tu cuenta</p>
      </div>
      <LoginForm />
    </main>
  );
}
