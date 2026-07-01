import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isRedisConfigured, redisCommand } from "../lib/redis.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userData = req.body;
    if (!userData || !userData.name) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const id = userData.id || `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    userData.id = id;
    if (!userData.date) {
      userData.date = new Date().toISOString();
    }

    if (!isRedisConfigured()) {
      return res.status(503).json({
        error:
          "Redis belum dikonfigurasi. Tambahkan UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN di Vercel Environment Variables.",
      });
    }

    const userKey = `user:${id}`;
    await redisCommand(["SET", userKey, JSON.stringify(userData)]);
    await redisCommand(["RPUSH", "users", userKey]);

    res.json({ success: true, id, message: "User path successfully archived." });
  } catch (error: any) {
    console.error("Error in /api/save:", error);
    res.status(500).json({ error: error.message || "Failed to save user path" });
  }
}
