import { Hono } from "hono";
import { authRoutes } from "./routes/auth.js";
import { graphRoutes } from "./routes/graph.js";
import { subcontractorRoutes } from "./routes/subcontractor.js";

export const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true }));
app.route("/auth", authRoutes);
app.route("/graph", graphRoutes);
app.route("/subcontractor", subcontractorRoutes);
