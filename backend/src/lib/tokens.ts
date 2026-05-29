import { env, MS_AUTH_BASE, MS_SCOPES } from "./env.js";
import { loadRefreshToken, saveRefreshToken } from "./storage.js";

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface CachedAccessToken {
  token: string;
  expiresAt: number;
}

let cache: CachedAccessToken | null = null;

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: env.MS_CLIENT_ID,
    client_secret: env.MS_CLIENT_SECRET,
    code,
    redirect_uri: env.MS_REDIRECT_URI,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
    scope: MS_SCOPES.join(" "),
  });

  const res = await fetch(`${MS_AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }
  return await res.json() as TokenResponse;
}

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: env.MS_CLIENT_ID,
    client_secret: env.MS_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: MS_SCOPES.join(" "),
  });

  const res = await fetch(`${MS_AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  }
  return await res.json() as TokenResponse;
}

export async function getAccessToken(): Promise<string | null> {
  if (cache && cache.expiresAt > Date.now() + 60_000) {
    return cache.token;
  }

  const refreshToken = await loadRefreshToken();
  if (!refreshToken) return null;

  const tokens = await refreshAccessToken(refreshToken);

  if (tokens.refresh_token && tokens.refresh_token !== refreshToken) {
    await saveRefreshToken(tokens.refresh_token);
  }

  cache = {
    token: tokens.access_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
  return tokens.access_token;
}

export function clearAccessTokenCache(): void {
  cache = null;
}
