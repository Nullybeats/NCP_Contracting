import { Hono } from "hono";
import { GRAPH_BASE } from "../lib/env.js";
import { getAccessToken } from "../lib/tokens.js";

// Public endpoint (no session required) — anyone can submit an application.
export const subcontractorRoutes = new Hono();

const ROOT = "NCP Contracting LLC";
const SUB_APPLICATIONS = `${ROOT}/04-Subcontractors/Applications`;

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

function safeName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "_").slice(0, 60);
}

subcontractorRoutes.post("/apply", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return c.json({ error: "invalid body" }, 400);
  }
  const b = body as Record<string, unknown>;
  const company = String(b.company ?? "").trim();
  const contactEmail = String(b.email ?? "").trim();
  if (!company || !contactEmail) {
    return c.json({ error: "company and email are required" }, 400);
  }

  const token = await getAccessToken();
  if (!token) {
    // Backend not currently authorized. Signal frontend to use mailto fallback.
    return c.json({ error: "onedrive-unavailable" }, 503);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${safeName(company)}_${stamp}.json`;
  const path = `${SUB_APPLICATIONS}/${filename}`;
  const content = JSON.stringify(
    { ...b, submittedAt: new Date().toISOString() },
    null,
    2,
  );

  const res = await fetch(
    `${GRAPH_BASE}/me/drive/root:/${encodePath(path)}:/content`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: content,
    },
  );
  if (!res.ok) {
    return c.json({ error: `graph ${res.status}` }, 502);
  }
  return c.json({ status: "received", filename });
});
