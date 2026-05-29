import { Hono } from "hono";
import { GRAPH_BASE } from "../lib/env.js";
import { getSession } from "../lib/session.js";
import { getAccessToken } from "../lib/tokens.js";

export const graphRoutes = new Hono();

const ROOT = "NCP Contracting LLC";
const ACTIVE = `${ROOT}/01-Active Projects`;
const COMPLETED = `${ROOT}/02-Completed Projects`;
const TEMPLATES = `${ROOT}/09-Templates`;
const PROJECT_TEMPLATE = `${TEMPLATES}/Project Folder Template`;

graphRoutes.use("*", async (c, next) => {
  if (!getSession(c)) return c.json({ error: "unauthenticated" }, 401);
  await next();
});

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function callGraph(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "no_refresh_token" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return await fetch(`${GRAPH_BASE}${path}`, { ...init, headers });
}

function forward(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  return new Response(res.body, { status: res.status, headers });
}

async function listChildren(path: string): Promise<Response> {
  return callGraph(`/me/drive/root:/${encodePath(path)}:/children?$top=200`);
}

graphRoutes.get("/me", async () => {
  return forward(await callGraph("/me"));
});

graphRoutes.get("/files", async (c) => {
  const path = c.req.query("path") ?? ROOT;
  const graphPath = path === ""
    ? "/me/drive/root/children"
    : `/me/drive/root:/${encodePath(path)}:/children`;
  return forward(await callGraph(graphPath));
});

graphRoutes.get("/projects", async (c) => {
  const [activeRes, completedRes] = await Promise.all([
    listChildren(ACTIVE),
    listChildren(COMPLETED),
  ]);
  const active = activeRes.ok ? ((await activeRes.json()) as { value?: unknown[] }).value ?? [] : [];
  const completed = completedRes.ok ? ((await completedRes.json()) as { value?: unknown[] }).value ?? [] : [];
  return c.json({ active, completed });
});

graphRoutes.get("/project/:name", async (c) => {
  const name = c.req.param("name");
  return forward(await listChildren(`${ACTIVE}/${name}`));
});

graphRoutes.get("/project/:name/folder/:sub", async (c) => {
  const name = c.req.param("name");
  const sub = c.req.param("sub");
  return forward(await listChildren(`${ACTIVE}/${name}/${sub}`));
});

graphRoutes.get("/templates", async () => {
  return forward(await listChildren(TEMPLATES));
});

graphRoutes.get("/file/:id/thumbnail", async (c) => {
  const id = c.req.param("id");
  const size = c.req.query("size") ?? "large";
  return forward(await callGraph(`/me/drive/items/${id}/thumbnails/0/${size}/content`));
});

graphRoutes.post("/upload-session", async (c) => {
  const body = await c.req.json<{ path?: string; name?: string }>().catch(() => ({} as { path?: string; name?: string }));
  const folder = body.path;
  const name = body.name;
  if (!folder || !name) return c.json({ error: "missing path or name" }, 400);
  if (/[\\/:*?"<>|]/.test(name)) return c.json({ error: "invalid characters in name" }, 400);
  const fullPath = `${folder}/${name}`;
  const res = await callGraph(`/me/drive/root:/${encodePath(fullPath)}:/createUploadSession`, {
    method: "POST",
    body: JSON.stringify({
      item: { "@microsoft.graph.conflictBehavior": "rename" },
    }),
  });
  return forward(res);
});

graphRoutes.post("/file/:id/move", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ toPath?: string }>().catch(() => ({} as { toPath?: string }));
  if (!body.toPath) return c.json({ error: "missing toPath" }, 400);
  const res = await callGraph(`/me/drive/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      parentReference: { path: `/drive/root:/${body.toPath}` },
    }),
  });
  return forward(res);
});

graphRoutes.post("/project", async (c) => {
  const body = await c.req.json<{ name?: string }>().catch(() => ({} as { name?: string }));
  const name = body.name?.trim();
  if (!name) return c.json({ error: "missing name" }, 400);
  if (/[\\/:*?"<>|]/.test(name)) return c.json({ error: "invalid characters in name" }, 400);

  const res = await callGraph(`/me/drive/root:/${encodePath(PROJECT_TEMPLATE)}:/copy`, {
    method: "POST",
    body: JSON.stringify({
      parentReference: { path: `/drive/root:/${ACTIVE}` },
      name,
    }),
  });
  if (res.status === 202) {
    return c.json({ status: "accepted", monitor: res.headers.get("location") }, 202);
  }
  return forward(res);
});

graphRoutes.post("/project/:name/complete", async (c) => {
  const name = c.req.param("name");
  const res = await callGraph(`/me/drive/root:/${encodePath(`${ACTIVE}/${name}`)}`, {
    method: "PATCH",
    body: JSON.stringify({
      parentReference: { path: `/drive/root:/${COMPLETED}` },
    }),
  });
  return forward(res);
});
