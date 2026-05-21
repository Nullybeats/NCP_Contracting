# Backend (placeholder)

Planned stack: **Hono** (Node) + **SQLite** in dev / **Postgres** in prod.

Not built yet. When ready, this folder will hold the API that the frontend in
`../frontend` talks to via `VITE_API_URL`.

## Conventions (when we build it)

- `src/index.ts` — Hono app entry
- `src/routes/` — route modules
- `src/db/` — schema + migrations (likely Drizzle)
- Shared types between frontend/backend live here for now (re-export from
  `src/types/`); promote to a shared package if it grows.
