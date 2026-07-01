import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isRedisConfigured, redisCommand, redisPipeline } from "../lib/redis.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isRedisConfigured()) {
      return res.json([]);
    }

    const userKeys: string[] = (await redisCommand(["LRANGE", "users", "0", "-1"])) || [];
    if (userKeys.length === 0) {
      return res.json([]);
    }

    const pipelineCmds = userKeys.map((key) => ["GET", key]);
    const results: string[] = (await redisPipeline(pipelineCmds)) || [];

    const users = results.filter((r) => r !== null).map((r) => JSON.parse(r));

    res.json(users);
  } catch (error: any) {
    console.error("Error in /api/users:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve records" });
  }
}
