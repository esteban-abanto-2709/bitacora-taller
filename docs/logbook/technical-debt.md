# Technical Debt

Shortcuts, pending decisions and future risks in this project.
Code `TD-###` (never reused). Once resolved, the entry moves to the changelog
and is deleted from here.

**Entry format:**
- **Location:** affected `file:line`.
- **Risk:** 1 to 10 (1-3 cosmetic · 4-6 slows down/moderate · 7-9 latent bug or security · 10 critical).
- **Problem:** what's wrong, condensed.
- **Future impact:** what it can cause if left alone.
- **Suggestion:** (optional) how to fix it, in one line. A hint for whoever picks it up, not a spec.
- **Date** and **Status** (Open / In progress).

---

## [TD-001] Dev container doesn't pick up code changes on Windows
- **Location:** `apps/docker/compose.yaml`
- **Risk:** 3/10
- **Problem:** Turbopack doesn't receive file events through the Docker Desktop bind mount, so every change needs `docker compose restart web`.
- **Future impact:** slower feedback while developing; easy to test stale code by mistake.
- **Suggestion:** try Docker Desktop synchronized file shares; `watchOptions.pollIntervalMs` only as a last resort.
- **Date:** 2026-11-15 · **Status:** Open

## [TD-002] Default 404 page in English
- **Location:** `apps/web/src/app` (no `not-found.tsx`)
- **Risk:** 2/10
- **Problem:** a missing vehicle shows Next's default 404, in English, with a dark theme and no way back.
- **Future impact:** the mechanic lands on a dead end with text they may not read.
- **Suggestion:** add a Spanish `not-found.tsx` with a link back to the vehicle list.
- **Date:** 2026-11-15 · **Status:** Open
