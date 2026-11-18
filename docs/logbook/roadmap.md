# Roadmap

Committed work: what will be done. Code `RM-###` (never reused).
Ordered by priority, top first. When a task is finished it moves to the
changelog and is deleted from here.

**Entry format:**
- **Goal:** what we want to achieve.
- **Scope:** (optional) what's in and what's out.
- **Open questions:** (optional) what must be decided when starting.
- **Done when:** clear completion criterion.
- **Date** and **Status** (Open / In progress).

---

## [RM-005] Due-service alerts
- **Goal:** the home screen tells the mechanic which cars are due or overdue for a service.
- **Scope:** each service type has a default interval in km and/or months (whichever comes first), editable per vehicle. Alerts shown in the app only, no push. Requires RM-003 and RM-004.
- **Decided:** "upcoming" means 1,000 km or 30 days left, whichever comes first; only service types the vehicle already had at least once raise alerts.
- **Done when:** home lists overdue and upcoming services above the vehicle list.
- **Date:** 2026-11-15 · **Status:** In progress (2026-11-18)

## [RM-006] Production deploy for the workshop
- **Goal:** the workshop uses the app for real, apart from the dev data.
- **Scope:** second Supabase project for prod with every migration applied and public sign-ups off, deploy on Vercel (Hobby), the workshop's user accounts. Requires RM-005.
- **Done when:** the workshop logs in from their phone on the production URL and sees no dev data.
- **Date:** 2026-11-15 · **Status:** Open
