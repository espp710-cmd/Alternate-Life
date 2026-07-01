import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isRedisConfigured, redisCommand } from "../lib/redis.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, feedback, job, date, rating } = req.body || {};
    if (!feedback) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    const feedbackItem = {
      name: name || "Anonymous Player",
      feedback,
      job: job || "None",
      rating: Number(rating) || 5,
      date: date || new Date().toISOString(),
    };

    if (!isRedisConfigured()) {
      return res.status(503).json({
        error:
          "Redis belum dikonfigurasi. Tambahkan UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN di Vercel Environment Variables.",
      });
    }

    await redisCommand(["RPUSH", "feedbacks", JSON.stringify(feedbackItem)]);

    res.json({ success: true, message: "Feedback archived successfully." });
  } catch (error: any) {
    console.error("Error in /api/feedback:", error);
    res.status(500).json({ error: error.message || "Failed to save feedback" });
  }
}
