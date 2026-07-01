import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isRedisConfigured, redisCommand, redisPipeline } from "../lib/redis.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let users: any[] = [];
    let feedbacks: any[] = [];

    if (isRedisConfigured()) {
      const userKeys: string[] = (await redisCommand(["LRANGE", "users", "0", "-1"])) || [];
      if (userKeys.length > 0) {
        const pipelineCmds = userKeys.map((key) => ["GET", key]);
        const results: string[] = (await redisPipeline(pipelineCmds)) || [];
        users = results.filter((r) => r !== null).map((r) => JSON.parse(r));
      }

      const fbCount = (await redisCommand(["LLEN", "feedbacks"])) || 0;
      if (fbCount > 0) {
        const results: string[] = (await redisCommand(["LRANGE", "feedbacks", "0", "-1"])) || [];
        feedbacks = results.filter((r) => r !== null).map((r) => (typeof r === "string" ? JSON.parse(r) : r));
      }
    }

    const totalUsers = users.length;

    const endingDistribution: { [key: string]: number } = {};
    const popularChoices: { [key: string]: number } = {};

    users.forEach((u: any) => {
      const job = u.finalJob || "Unknown";
      endingDistribution[job] = (endingDistribution[job] || 0) + 1;

      if (Array.isArray(u.decisions)) {
        u.decisions.forEach((d: any) => {
          if (d.choiceText) {
            popularChoices[d.choiceText] = (popularChoices[d.choiceText] || 0) + 1;
          }
        });
      }
    });

    res.json({
      totalUsers,
      endingDistribution,
      popularChoices: Object.entries(popularChoices)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([choice, count]) => ({ choice, count })),
      rawUsers: users,
      feedbacks,
    });
  } catch (error: any) {
    console.error("Error in /api/stats:", error);
    res.status(500).json({ error: error.message || "Failed to process analytics" });
  }
}
