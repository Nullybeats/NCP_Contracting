import { createHmac, timingSafeEqual } from "node:crypto";
import type { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { env } from "./env.js";

const COOKIE_NAME = "ncp_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function sign(value: string): string {
  const sig = createHmac("sha256", env.SESSION_SECRET).update(value).digest("base64url");
  return `${value}.${sig}`;
}

function verify(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = createHmac("sha256", env.SESSION_SECRET).update(value).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return value;
}

export function setSession(c: Context, userId: string): void {
  setCookie(c, COOKIE_NAME, sign(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function getSession(c: Context): string | null {
  const raw = getCookie(c, COOKIE_NAME);
  if (!raw) return null;
  return verify(raw);
}

export function clearSession(c: Context): void {
  deleteCookie(c, COOKIE_NAME, { path: "/" });
}
