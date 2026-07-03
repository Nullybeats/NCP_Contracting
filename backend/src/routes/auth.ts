import { Hono } from "hono";
import { env, GRAPH_BASE, MS_AUTH_BASE, MS_SCOPES } from "../lib/env.js";
import { generateVerifier, challengeFromVerifier, generateState } from "../lib/pkce.js";
import { consumePkceVerifier, deleteRefreshToken, savePkceVerifier, saveRefreshToken } from "../lib/storage.js";
import { clearSession, setSession } from "../lib/session.js";
import { clearAccessTokenCache, exchangeCodeForTokens } from "../lib/tokens.js";

export const authRoutes = new Hono();

authRoutes.get("/login", async (c) => {
  const state = generateState();
  const verifier = generateVerifier();
  const challenge = challengeFromVerifier(verifier);

  await savePkceVerifier(state, verifier);

  const params = new URLSearchParams({
    client_id: env.MS_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.MS_REDIRECT_URI,
    response_mode: "query",
    scope: MS_SCOPES.join(" "),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  const hint = env.ALLOWED_OWNER_EMAILS[0];
  if (hint) params.set("login_hint", hint);

  return c.redirect(`${MS_AUTH_BASE}/authorize?${params.toString()}`);
});

authRoutes.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    return c.text(`OAuth error: ${error} - ${c.req.query("error_description") ?? ""}`, 400);
  }
  if (!code || !state) {
    return c.text("Missing code or state", 400);
  }

  const verifier = await consumePkceVerifier(state);
  if (!verifier) {
    return c.text("Invalid or expired state", 400);
  }

  const tokens = await exchangeCodeForTokens(code, verifier);
  if (!tokens.refresh_token) {
    return c.text("No refresh_token returned. Did you include offline_access scope?", 500);
  }

  // Verify the authenticated user is on the owner allowlist before persisting anything.
  const meRes = await fetch(`${GRAPH_BASE}/me`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!meRes.ok) {
    return c.text(`Could not verify identity: /me returned ${meRes.status}`, 500);
  }
  const me = (await meRes.json()) as {
    mail?: string | null;
    userPrincipalName?: string | null;
    displayName?: string | null;
  };
  const candidates = [me.mail, me.userPrincipalName]
    .filter((v): v is string => !!v)
    .map((v) => v.toLowerCase());
  const allowed = env.ALLOWED_OWNER_EMAILS;
  const isAuthorized = candidates.some((c) => allowed.includes(c));

  if (!isAuthorized) {
    // Do NOT save the refresh token — that would overwrite the owner's.
    const who = me.mail ?? me.userPrincipalName ?? me.displayName ?? "unknown";
    return c.html(
      `<!doctype html><html><head><title>Access restricted</title>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <style>
        body{margin:0;background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
        .card{max-width:520px;text-align:center}
        h1{font-size:2rem;margin:0 0 1rem;letter-spacing:-0.02em}
        p{color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 1.5rem}
        .who{color:rgba(255,255,255,0.9);font-family:ui-monospace,monospace;font-size:0.9rem;background:rgba(255,255,255,0.05);padding:0.5rem 0.75rem;border-radius:0.375rem;display:inline-block;margin-bottom:1.5rem}
        a{color:#60a5fa;text-decoration:none;font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase}
        a:hover{color:#93c5fd}
      </style></head><body><div class="card">
      <h1>Access restricted</h1>
      <p>This dashboard is for authorized owners of NCP Contracting only.</p>
      <div class="who">Signed in as: ${who}</div>
      <p><a href="${env.FRONTEND_URL}/">← Back to site</a></p>
      </div></body></html>`,
      403,
    );
  }

  await saveRefreshToken(tokens.refresh_token);
  clearAccessTokenCache();
  setSession(c, "owner");

  return c.redirect(`${env.FRONTEND_URL}/dashboard`);
});

authRoutes.post("/logout", async (c) => {
  clearSession(c);
  await deleteRefreshToken();
  clearAccessTokenCache();
  return c.json({ ok: true });
});
