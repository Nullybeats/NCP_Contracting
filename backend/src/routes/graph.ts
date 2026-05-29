import { Hono } from "hono";
import { GRAPH_BASE } from "../lib/env.js";
import { getSession } from "../lib/session.js";
import { getAccessToken } from "../lib/tokens.js";

export const graphRoutes = new Hono();

const ROOT = "NCP Contracting LLC";
const ACTIVE = `${ROOT}/01-Active Projects`;
const COMPLETED = `${ROOT}/02-Completed Projects`;
const LEADS = `${ROOT}/03-Estimates & Proposals`;
const SUBCONTRACTORS = `${ROOT}/04-Subcontractors`;
const RECEIPTS = `${ROOT}/07-Accounting/Receipts`;
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

// ---- Phase C endpoints ----

// C.4 Recent activity feed: last-modified items under 01-Active Projects
graphRoutes.get("/recent", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? 15), 50);
  const url = `/me/drive/root:/${encodePath(ACTIVE)}:/search(q='')?$select=id,name,parentReference,lastModifiedDateTime,size,file,folder,webUrl&$orderby=lastModifiedDateTime desc&$top=${limit}`;
  return forward(await callGraph(url));
});

// C.3 Leads: list of pre-active estimate/proposal folders
graphRoutes.get("/leads", async () => {
  return forward(await listChildren(LEADS));
});

// C.2 Receipts: group structure under 07-Accounting/Receipts
graphRoutes.get("/receipts", async (c) => {
  const sub = c.req.query("path");
  const target = sub ? `${RECEIPTS}/${sub}` : RECEIPTS;
  return forward(await listChildren(target));
});

// C.1 Subcontractors: list rows from the master Excel via Workbook API
graphRoutes.get("/subcontractors", async () => {
  // Locate the master list file
  const listRes = await listChildren(`${SUBCONTRACTORS}/Subcontractor master list`);
  if (!listRes.ok) return forward(listRes);
  const json = (await listRes.json()) as { value?: Array<{ name: string; id: string }> };
  const file = json.value?.find((v) => v.name.toLowerCase().endsWith(".xlsx") || v.name.toLowerCase().endsWith(".xlsm"));
  if (!file) return new Response(JSON.stringify({ error: "no xlsx in master list folder" }), { status: 404 });

  // Use first worksheet's used range
  const wbRes = await callGraph(`/me/drive/items/${file.id}/workbook/worksheets`);
  if (!wbRes.ok) return forward(wbRes);
  const wb = (await wbRes.json()) as { value?: Array<{ id: string; name: string }> };
  const sheetId = wb.value?.[0]?.id;
  if (!sheetId) return new Response(JSON.stringify({ error: "no worksheet" }), { status: 404 });

  const rangeRes = await callGraph(
    `/me/drive/items/${file.id}/workbook/worksheets('${encodeURIComponent(sheetId)}')/usedRange(valuesOnly=true)?$select=values,address`,
  );
  if (!rangeRes.ok) return forward(rangeRes);
  const range = (await rangeRes.json()) as { values?: unknown[][]; address?: string };
  return new Response(
    JSON.stringify({
      fileId: file.id,
      fileName: file.name,
      sheetName: wb.value?.[0]?.name,
      address: range.address,
      values: range.values ?? [],
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
});
