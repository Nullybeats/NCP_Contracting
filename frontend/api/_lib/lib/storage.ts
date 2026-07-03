import { Redis } from "@upstash/redis";
import { env } from "./env.js";

let _redis: Redis | null = null;
function redis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

const REFRESH_TOKEN_KEY = "ms:refresh_token";
const PKCE_PREFIX = "ms:pkce:";

export async function saveRefreshToken(token: string): Promise<void> {
  await redis().set(REFRESH_TOKEN_KEY, token);
}

export async function loadRefreshToken(): Promise<string | null> {
  return await redis().get<string>(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken(): Promise<void> {
  await redis().del(REFRESH_TOKEN_KEY);
}

export async function savePkceVerifier(state: string, verifier: string): Promise<void> {
  await redis().set(PKCE_PREFIX + state, verifier, { ex: 600 });
}

export async function consumePkceVerifier(state: string): Promise<string | null> {
  const key = PKCE_PREFIX + state;
  const verifier = await redis().get<string>(key);
  if (verifier) await redis().del(key);
  return verifier;
}
