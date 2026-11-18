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
- **Kilometraje:** lecturas con fecha (por defecto hoy, nunca futura). El km
  actual es la lectura más reciente. Una lectura no puede ser menor que una
  anterior ni mayor que una posterior. Se corrige borrándola (con
  confirmación), no editándola. El alta de un auto pide el km actual como
  campo opcional, que se guarda como primera lectura.
- **Mantenimientos:** el tipo sale de una lista fija (tabla `service_types`
  sembrada por migración; un tipo nuevo es una migración). Se pueden editar y
  borrar (con confirmación). El km es obligatorio y viene prellenado con el km
  actual. El km actual del auto es lo más reciente entre lecturas y
  mantenimientos, y la regla de "no menor que una anterior" mira ambos.
- **Acceso:** un usuario por persona; todos ven los mismos autos. Sin
  multi-empresa por ahora.

## Plan macro

Vive en `docs/logbook/roadmap.md` (en orden de prioridad, con sus
dependencias); lo terminado está en `docs/logbook/changelog.md`.

## Estructura

Mismo formato que `gym-tracker`: la app vive en `apps/web` con su propio
`package.json` y lockfile; todos los comandos se corren dentro de esa carpeta.
Node 22+ y pnpm por corepack.

<!-- logbook:start — written by the logbook skill (init); replaced whole when it runs again -->
## Logbook (`docs/logbook/`)

Logbook language: English

Every project records its work in four git-versioned files under
`docs/logbook/`. `docs/` itself stays for conceptual material (vision,
definition); the operational record lives under `docs/logbook/`.

| File | Prefix | Holds |
|---|---|---|
| `technical-debt.md` | `TD-###` | Something **wrong now** in existing code. |
| `roadmap.md` | `RM-###` | **Committed** work that will be done. |
| `wishlist.md` | `WL-###` | Ideas, **maybe never**. |
| `changelog.md` | — | **Permanent** record of everything finished. |

**Passive rules (always on, no command):**

- **Language:** logbook entries are written in the logbook language above; the
  conversation stays in the user's language. Code, product text and quotes stay
  literal. If the existing files are in another language, keep theirs (never
  mix) and mention that `init` can translate them.
- **Technical debt:** if you notice it while working, record it in
  `technical-debt.md` (never as a code comment). Entry format:

  ```markdown
  ## [TD-001] Short title
  - **Location:** `path/to/file.ext:line`
  - **Risk:** N/10  (1-3 cosmetic · 4-6 slows down/moderate · 7-9 latent bug or security · 10 critical)
  - **Problem:** what's wrong, condensed.
  - **Future impact:** what it can cause if left alone.
  - **Date:** YYYY-MM-DD · **Status:** Open
  ```

- **Task lifecycle:** when **starting** a task (`RM`, `TD` or `WL`) mark it
  `In progress (YYYY-MM-DD)` in its file; when **finishing**, move it to
  `changelog.md` keeping its prefix and delete it from its file. Changelog
  format (reverse order): `## [CODE] Title (YYYY-MM-DD HH:MM)` + summary in ≤2
  lines. **The date/time is the local clock at finish; never query git for
  it.**
- **Codes:** one counter per prefix, starting at `001`; the next one = highest
  code with the **same prefix** +1, looking at its open file + changelog (other
  prefixes don't count). Never reused. Executing a task doesn't change its code: a `WL` is worked
  on directly and goes into the changelog as `WL`. Promoting `WL → RM` is only
  a priority decision the user asks for, never a prior step.
- **Files on demand:** don't create empty files; each one is born the first
  time there is something real to put in it.

**Heavy mechanics → `logbook` skill:** to set up or migrate the system
(`init`), recommend a task (`next`) or audit debt (`audit`), use the skill. It
holds the full formats, special cases (WL→RM promotion, wontfix) and
procedures.
<!-- logbook:end -->
