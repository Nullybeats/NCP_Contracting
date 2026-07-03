function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  get MS_CLIENT_ID() { return required("MS_CLIENT_ID"); },
  get MS_CLIENT_SECRET() { return required("MS_CLIENT_SECRET"); },
  get MS_REDIRECT_URI() { return required("MS_REDIRECT_URI"); },
  get UPSTASH_REDIS_REST_URL() { return required("UPSTASH_REDIS_REST_URL"); },
  get UPSTASH_REDIS_REST_TOKEN() { return required("UPSTASH_REDIS_REST_TOKEN"); },
  get SESSION_SECRET() { return required("SESSION_SECRET"); },
  get FRONTEND_URL() { return process.env.FRONTEND_URL ?? "http://localhost:5173"; },
  get ALLOWED_OWNER_EMAILS() {
    return (process.env.ALLOWED_OWNER_EMAILS ?? "contact@ncpbuild.com")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  },
};

export const MS_TENANT = "common";
export const MS_AUTH_BASE = `https://login.microsoftonline.com/${MS_TENANT}/oauth2/v2.0`;
export const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
export const MS_SCOPES = ["Files.Read.All", "offline_access", "User.Read"];
