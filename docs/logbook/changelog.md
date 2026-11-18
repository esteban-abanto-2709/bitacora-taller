# Changelog

Permanent record of all finished work. Indexed by task code
(`TD-`, `RM-`, `WL-`). Reverse order: newest on top.

**Entry format:**

```
## [CODE] Title (YYYY-MM-DD HH:MM)
Summary in ≤2 lines of what was done.
```

---

## [RM-003] Mileage readings (2026-11-18 08:54)
`mileage_readings` table (no edit), current km plus history with add and confirmed delete on the vehicle detail; readings must fit between earlier and later ones, never in the future.
Creating a vehicle takes an optional current km as its first reading.

## [RM-002] Vehicles (2026-11-15)
`vehicles` table with RLS (no delete, unique normalized plate), list with plate search on `/`, create, detail and edit pages.
Tested end to end against the dev database.

## [RM-001] Base and login (2026-11-15)
Next.js 16 app in `apps/web` with shadcn/ui, Spanish mobile-first layout, manifest and a dev container in `apps/docker`.
Email and password login with Supabase Auth; the proxy sends anyone without a session to `/login`.
