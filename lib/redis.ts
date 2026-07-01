// Shared Upstash Redis REST helpers used by all /api serverless functions.
// Supports both naming conventions:
// - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (manual Upstash setup)
// - KV_REST_API_URL / KV_REST_API_TOKEN (default names from Vercel Marketplace integration)

function getRedisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
}

function getRedisToken() {
  return process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
}

export const isRedisConfigured = () => {
  return !!(getRedisUrl() && getRedisToken());
};

export async function redisCommand(cmd: any[]) {
  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) throw new Error("Redis configuration missing");

  const cleanUrl = url.replace(/\/$/, "");
  const res = await fetch(cleanUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) {
    throw new Error(`Upstash Redis error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.result;
}

export async function redisPipeline(cmds: any[][]) {
  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) throw new Error("Redis configuration missing");

  const cleanUrl = url.replace(/\/$/, "");
  const res = await fetch(`${cleanUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) {
    throw new Error(`Upstash Redis pipeline error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.map((d: any) => d.result);
}
