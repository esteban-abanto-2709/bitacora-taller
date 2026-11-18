# Bitácora Taller

A maintenance log for a small car workshop, built for the **phone**.

Register each car once, log what was done to it and at what mileage, and see at
a glance which cars are due for their next service (an oil change every 5,000
km or 6 months, for example).

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## Why

Car maintenance apps are built for one owner and one car, or they lock the
features a workshop needs behind an aggressive paywall. This one is small, made
to measure, and does one thing: keep track of many cars.

## Status

MVP in progress. The UI is in Spanish.

- [x] Email and password login (accounts are created by the admin; no public sign-up)
- [x] Cars: list with plate search, create, view and edit
- [x] Mileage readings
- [x] Maintenance and repair history
- [x] Due-service alerts by mileage or date

The full plan lives in [`docs/logbook/`](./docs/logbook/).

## Stack

- **Next.js 16** (App Router, Server Actions, React Compiler) with **React 19**
- **Tailwind CSS 4** + **shadcn/ui**, icons by **lucide**
- **Supabase**: Auth and Postgres with row level security; the app talks to it
  through `@supabase/ssr`, with no backend of its own
- **pnpm**, **TypeScript** (strict), ESLint and Prettier

## Repository layout

```
bitacora-taller/
├── apps/
│   ├── web/                  # Next.js app
│   │   ├── src/
│   │   └── supabase/
│   │       └── migrations/   # Versioned schema (tables + RLS)
│   └── docker/               # Dev container (compose.yaml)
└── docs/
    └── logbook/              # Roadmap, technical debt, wishlist, changelog
```

## Running it locally

You need Docker and a Supabase project.

1. Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in your
   project's URL and publishable key.
2. Run every file in `apps/web/supabase/migrations/`, in order, in the Supabase
   SQL Editor.
3. In Supabase, turn off public sign-ups and create a user under
   **Authentication → Users**.
4. Start the app:

   ```bash
   cd apps/docker
   docker compose up -d
   ```

   Open http://localhost:3000. Code changes don't reach the container on their
   own on Windows: run `docker compose restart web`.

Checks, from `apps/web`: `pnpm lint`, `pnpm format:check` and `pnpm build`.

## License

[MIT](./LICENSE)
