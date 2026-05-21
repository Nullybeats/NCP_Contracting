# NCP Contracting

Marketing site + future client portal for **ncpbuild.com**.

## Layout

```
.
├── frontend/   Vite + React + TypeScript + Tailwind v4 + shadcn/ui
└── backend/    (placeholder — Hono + SQLite/Postgres, not built yet)
```

## Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build
```

Path alias `@/` → `frontend/src/`.

## Deploy

Frontend deploys to **Vercel**. Root directory: `frontend`. Framework preset:
Vite. Build command and output dir are auto-detected.

## Domain / DNS

- Registrar: Porkbun
- Nameservers: `ns{1,2}.cloudffinity.com` (DNS managed inside KnownHost)
- Currently A-record points to a KnownHost server. To move to Vercel, update
  A / CNAME records in KnownHost's DNS manager.
