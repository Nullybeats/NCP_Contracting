import { Hono } from "hono";
import { env, MS_AUTH_BASE, MS_SCOPES } from "../lib/env.js";
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
