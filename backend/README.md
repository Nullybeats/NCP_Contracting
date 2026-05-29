# Backend — NCP Contracting

Hono on Vercel Functions. Proxies Microsoft Graph (OneDrive) for the dashboard.

## One-time setup (the parts only you can do)

### 1. Register the Microsoft app

1. Go to https://portal.azure.com → search **"Microsoft Entra ID"** → **App registrations** → **New registration**
2. Fill in:
   - **Name:** `NCP Contracting Dashboard`
   - **Supported account types:** **Personal Microsoft accounts only**
   - **Redirect URI:** select **Web**, value: `http://localhost:5173/api/auth/callback`
3. After creation, copy the **Application (client) ID** → this is `MS_CLIENT_ID`
4. Left sidebar → **Certificates & secrets** → **New client secret** → copy the **Value** (not the ID) → this is `MS_CLIENT_SECRET`
5. Left sidebar → **API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated permissions**:
   - `Files.ReadWrite`
   - `offline_access`
   - `User.Read`
   - Click **Add permissions**
6. Later for production, add a second redirect URI: `https://ncpbuild.com/api/auth/callback` (under Authentication → Web → Add URI)

### 2. Create the Upstash Redis database

1. https://upstash.com → sign up (free tier is fine) → **Create Database**
2. Name it `ncp-dashboard`, pick a region close to Vercel's
3. After creation, scroll to **REST API** section → copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 3. Fill in `.env`

```bash
cp .env.example .env
# then edit .env with the five values from steps 1 & 2,
# plus generate a session secret:
openssl rand -base64 32   # paste output as SESSION_SECRET
```

## Run locally

Backend (terminal 1):
```bash
npm install
npm run dev      # vercel dev on http://localhost:3000
```

Frontend (terminal 2, from ../frontend):
```bash
npm install
npm run dev      # vite on http://localhost:5173
```

Visit http://localhost:5173/dashboard → click **Connect OneDrive** → sign in with the client's Microsoft account → you should land back on the dashboard with his name and a list of OneDrive root items.

## Architecture

- `api/index.ts` — Vercel function entry; hands all `/api/*` to the Hono app
- `src/app.ts` — Hono app, mounts route modules under `/api`
- `src/routes/auth.ts` — OAuth2 + PKCE flow
- `src/routes/graph.ts` — Microsoft Graph proxy (session-gated)
- `src/lib/tokens.ts` — refresh-token-based access token retrieval with in-memory cache
- `src/lib/storage.ts` — Upstash Redis wrapper (one key: the refresh token)
- `src/lib/session.ts` — signed HMAC cookie (the browser never sees a Microsoft token)
- `src/lib/pkce.ts` — PKCE verifier/challenge generation

Vite proxies `/api/*` to `localhost:3000` in dev, so everything is same-origin → no CORS and cookies just work.
