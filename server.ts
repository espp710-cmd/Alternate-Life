import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// LOCAL DATABASE PATHWAY (Fallback)
const LOCAL_DB_DIR = path.join(process.cwd(), "data");
const LOCAL_DB_PATH = path.join(LOCAL_DB_DIR, "db.json");

if (!fs.existsSync(LOCAL_DB_DIR)) {
  fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
}

function getLocalDb() {
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
    } catch (e) {
      return { users: [], userDetails: {} };
    }
  }
  return { users: [], userDetails: {} };
}

function saveLocalDb(data: any) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// REDIS REST HELPERS
// Supports both UPSTASH_REDIS_REST_* and KV_REST_API_* (Vercel Marketplace default) naming.
function getRedisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
}
function getRedisToken() {
  return process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
}

const isRedisConfigured = () => {
  return !!(getRedisUrl() && getRedisToken());
};

async function redisCommand(cmd: any[]) {
  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) throw new Error("Redis configuration missing");
  
  const cleanUrl = url.replace(/\/$/, "");
  const res = await fetch(cleanUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cmd)
  });
  if (!res.ok) {
    throw new Error(`Upstash Redis error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.result;
}

async function redisPipeline(cmds: any[][]) {
  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) throw new Error("Redis configuration missing");
  
  const cleanUrl = url.replace(/\/$/, "");
  const res = await fetch(`${cleanUrl}/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cmds)
  });
  if (!res.ok) {
    throw new Error(`Upstash Redis pipeline error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.map((d: any) => d.result);
}

// API ENDPOINTS

// 1. Save User Session
app.post("/api/save", async (req, res) => {
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

    if (isRedisConfigured()) {
      // Save details as hash or JSON string, let's use string for simpler full retrieve
      const userKey = `user:${id}`;
      await redisCommand(["SET", userKey, JSON.stringify(userData)]);
      // Add key to the users list
      await redisCommand(["RPUSH", "users", userKey]);
    } else {
      // Fallback to local file-based database
      const db = getLocalDb();
      db.users.push(`user:${id}`);
      db.userDetails[`user:${id}`] = userData;
      saveLocalDb(db);
    }

    res.json({ success: true, id, message: "User path successfully archived." });
  } catch (error: any) {
    console.error("Error in /api/save:", error);
    res.status(500).json({ error: error.message || "Failed to save user path" });
  }
});

// 1b. Save User Feedback Suggestions
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, feedback, job, date, rating } = req.body;
    if (!feedback) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    const feedbackItem = {
      name: name || "Anonymous Player",
      feedback,
      job: job || "None",
      rating: Number(rating) || 5,
      date: date || new Date().toISOString()
    };

    if (isRedisConfigured()) {
      await redisCommand(["RPUSH", "feedbacks", JSON.stringify(feedbackItem)]);
    } else {
      const db = getLocalDb();
      if (!db.feedbacks) db.feedbacks = [];
      db.feedbacks.push(feedbackItem);
      saveLocalDb(db);
    }

    res.json({ success: true, message: "Feedback archived successfully." });
  } catch (error: any) {
    console.error("Error in /api/feedback:", error);
    res.status(500).json({ error: error.message || "Failed to save feedback" });
  }
});

// 2. Retrieve All Users
app.get("/api/users", async (req, res) => {
  try {
    if (isRedisConfigured()) {
      // Fetch all keys from the "users" list
      const userKeys: string[] = await redisCommand(["LRANGE", "users", "0", "-1"]) || [];
      if (userKeys.length === 0) {
        return res.json([]);
      }

      // Fetch all users using a pipeline
      const pipelineCmds = userKeys.map(key => ["GET", key]);
      const results: string[] = await redisPipeline(pipelineCmds) || [];
      
      const users = results
        .filter(r => r !== null)
        .map(r => JSON.parse(r));
      
      res.json(users);
    } else {
      // Fallback
      const db = getLocalDb();
      const users = Object.values(db.userDetails);
      res.json(users);
    }
  } catch (error: any) {
    console.error("Error in /api/users:", error);
    // Return empty array or local fallback in case of redis glitch
    try {
      const db = getLocalDb();
      res.json(Object.values(db.userDetails));
    } catch {
      res.status(500).json({ error: error.message || "Failed to retrieve records" });
    }
  }
});

// 3. Stats Summary
app.get("/api/stats", async (req, res) => {
  try {
    let users: any[] = [];
    let feedbacks: any[] = [];
    
    if (isRedisConfigured()) {
      const userKeys: string[] = await redisCommand(["LRANGE", "users", "0", "-1"]) || [];
      if (userKeys.length > 0) {
        const pipelineCmds = userKeys.map(key => ["GET", key]);
        const results: string[] = await redisPipeline(pipelineCmds) || [];
        users = results.filter(r => r !== null).map(r => JSON.parse(r));
      }
      
      const fbCount = await redisCommand(["LLEN", "feedbacks"]) || 0;
      if (fbCount > 0) {
        const results: string[] = await redisCommand(["LRANGE", "feedbacks", "0", "-1"]) || [];
        feedbacks = results.filter(r => r !== null).map(r => typeof r === 'string' ? JSON.parse(r) : r);
      }
    } else {
      const db = getLocalDb();
      users = Object.values(db.userDetails);
      feedbacks = db.feedbacks || [];
    }

    // Process stats
    const totalUsers = users.length;
    
    // Ending distribution
    const endingDistribution: { [key: string]: number } = {};
    const popularChoices: { [key: string]: number } = {};
    
    users.forEach((u: any) => {
      // Endings
      const job = u.finalJob || "Unknown";
      endingDistribution[job] = (endingDistribution[job] || 0) + 1;

      // Decisions & Choices
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
      feedbacks
    });
  } catch (error: any) {
    console.error("Error in /api/stats:", error);
    res.status(500).json({ error: error.message || "Failed to process analytics" });
  }
});

// 4. AI-Powered Life commentary (Gemini API)
app.post("/api/ai-feedback", async (req, res) => {
  let requestLang = "id";
  try {
    const { name, finalJob, money, stress, progress, decisions, lang } = req.body;
    if (lang) {
      requestLang = lang;
    }
    
    if (!name || !finalJob) {
      return res.status(400).json({ error: "Missing required profile info" });
    }

    if (!ai) {
      // Graceful fallback if no GEMINI_API_KEY is configured
      const fallbackIn = `Dinar Maulidan's AI Guide: Wow, ${name}! Sebagai seorang ${finalJob} dengan tabungan Rp${money.toLocaleString()} dan tingkat stres ${stress}%, kamu telah mengarungi AlternateLife dengan luar biasa. Ingat, keseimbangan adalah kunci kesuksesan sejati!`;
      const fallbackEn = `Dinar Maulidan's AI Guide: Wow, ${name}! As a ${finalJob} with a wealth of $${money.toLocaleString()} and a stress level of ${stress}%, you navigated AlternateLife wonderfully. Remember, true success is all about alignment and balance!`;
      return res.json({ commentary: requestLang === 'id' ? fallbackIn : fallbackEn });
    }

    const decisionListStr = Array.isArray(decisions)
      ? decisions.map((d: any, i: number) => `Choice ${i+1}: ${d.choiceText || "Decision Made"}`).join("\n")
      : "Standard paths chosen";

    const prompt = `
      You are the ultimate cosmic game master and life counselor of "AlternateLife" simulation game created by Dinar Maulidan.
      Provide a personalized, funny, exciting, highly engaging life critique/commentary for this player:
      Name: ${name}
      Profession Achieved: ${finalJob}
      Final Wealth/Money Score: ${money}
      Final Stress Level: ${stress}%
      Final Progress Level: ${progress}%
      
      Decisions made during the game:
      ${decisionListStr}
      
      Language Requirement: Respond in exactly one paragraph. Write in ${requestLang === 'id' ? 'Bahasa Indonesia' : 'English'}.
      Keep the tone witty, modern, immersive, with custom futuristic simulator vibes.
      Refer to yourself as "Dinar's Cosmic AI Guide".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
      }
    });

    res.json({ commentary: response.text });
  } catch (error: any) {
    if (error && (error.status === "RESOURCE_EXHAUSTED" || String(error.message).includes("quota") || String(error).includes("quota") || error.code === 429)) {
      console.warn("AI Feedback: Quota exceeded or rate limit reached. Using high-quality pre-designed fallback commentary.");
    } else {
      console.error("Error generating AI feedback:", error);
    }
    res.json({ 
      commentary: requestLang === 'id' 
        ? `Layanan AI terhubung! Perjalananmu sebagai seorang profesional telah membentuk takdir kosmik baru yang tak tertandingi.`
        : `Cosmic network synced! Your journey as a professional has successfully forged a brand new destiny.`
    });
  }
});

// VITE SERVER OR STATIC SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AlternateLife Server] active and running on http://localhost:${PORT}`);
  });
}

startServer();
