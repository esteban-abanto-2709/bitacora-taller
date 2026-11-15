# Control de mantenimiento de autos (MVP para Frank)

## Objetivo

**Qué:** una app para llevar el control de mantenimiento y reparación de varios
autos: qué se le hizo a cada uno, cuándo y con qué kilometraje, y avisos cuando
toca el siguiente servicio (por ejemplo, el cambio de aceite). La referencia es
KixCar. Se quiere algo similar pero a medida y sin depender de un freemium.

**Para quién:** Frank y su gente (el mecánico). Lo usan desde el **celular**,
casi nunca desde una PC. El cliente final no lo usa. Son autos en su mayoría;
no hay buses, camiones ni maquinaria.

**Qué registra:**
- Unidad: placa, marca, modelo, año.
- Lecturas de kilometraje con su fecha (el km cambia en el tiempo).
- Mantenimiento o reparación: fecha, tipo, km, descripción, observación y
  costo (opcional).
- Alertas: "hace X tiempo o X km del último servicio de este tipo".

**Terminado (MVP):** Frank puede registrar sus autos y sus mantenimientos desde
el celular, y la app le avisa qué toca. Es un tracking, nada más. No lleva
reportes ni dashboards; eso entra en iteraciones según el feedback de Frank.

**Condiciones:** por ahora se usan los planes gratuitos. Si les sirve, el
siguiente paso es el hosting pago en AWS y lo del RUC 20 para el CV.

## Decisiones

- **Stack:** Next.js en Vercel (plan Hobby) más Supabase (Postgres y auth).
  Pensado mobile-first.
- **Dueño del auto:** campo opcional de contacto (nombre y teléfono). Todavía
  no se sabe si es una flota propia o si son autos de clientes del taller.
- **Alertas:** se muestran en la pantalla de inicio (vencido y próximo, por km
  o por fecha). No hay push en el MVP.
- **Intervalos:** cada tipo de servicio tiene un intervalo por defecto en km
  y/o meses (avisa lo primero que llegue), editable por auto. Ejemplo: aceite
  cada 5,000 km o 6 meses.
- **Login:** correo y contraseña con Supabase Auth. Registro público
  desactivado: Esteban crea las cuentas desde el panel de Supabase.
- **UI:** shadcn/ui + lucide, interfaz solo en español.
- **Base:** Supabase en la nube. El proyecto conectado hoy es **dev**; prod
  será un segundo proyecto que Esteban crea aparte.
- **Migraciones:** como en Ronda, sin CLI. Archivos SQL numerados en
  `apps/web/supabase/migrations` (`0001_vehicles.sql`, …) que Esteban pega en
  el SQL Editor de Supabase, primero en dev y luego en prod. Los tipos de
  TypeScript se escriben a mano.
- **Autos:** sin borrar en el MVP (solo editar). Placa única, guardada en
  mayúsculas sin espacios ni guiones.
- **Acceso:** un usuario por persona; todos ven los mismos autos. Sin
  multi-empresa por ahora.

## Plan macro

1. **Base y login:** Next.js + Supabase, login, layout mobile-first.
   **Hecho (2026-11-15).**
2. **Autos:** alta, edición y lista (placa, marca, modelo, año, contacto
   opcional). Depende de 1. **Hecho (2026-11-15).**
3. **Kilometraje:** lecturas con fecha; el km actual es la última. Depende de 2.
4. **Mantenimientos:** historial por auto (fecha, tipo, km, descripción,
   observación, costo opcional). Un servicio con km cuenta como lectura.
   Depende de 2.
5. **Avisos:** inicio con lo vencido y lo próximo. Depende de 3 y 4.

## Estructura

Mismo formato que `gym-tracker`: la app vive en `apps/web` con su propio
`package.json` y lockfile; todos los comandos se corren dentro de esa carpeta.
Node 22+ y pnpm por corepack.
