import { app } from "./_lib/app.js";

export const runtime = "nodejs";

const handler = (req: Request) => app.fetch(req);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
