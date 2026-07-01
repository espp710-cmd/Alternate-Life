import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAi() {
  if (ai) return ai;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let requestLang = "id";
  try {
    const { name, finalJob, money, stress, progress, decisions, lang } = req.body || {};
    if (lang) requestLang = lang;

    if (!name || !finalJob) {
      return res.status(400).json({ error: "Missing required profile info" });
    }

    const client = getAi();

    if (!client) {
      const fallbackIn = `Dinar Maulidan's AI Guide: Wow, ${name}! Sebagai seorang ${finalJob} dengan tabungan Rp${Number(money).toLocaleString()} dan tingkat stres ${stress}%, kamu telah mengarungi AlternateLife dengan luar biasa. Ingat, keseimbangan adalah kunci kesuksesan sejati!`;
      const fallbackEn = `Dinar Maulidan's AI Guide: Wow, ${name}! As a ${finalJob} with a wealth of $${Number(money).toLocaleString()} and a stress level of ${stress}%, you navigated AlternateLife wonderfully. Remember, true success is all about alignment and balance!`;
      return res.json({ commentary: requestLang === "id" ? fallbackIn : fallbackEn });
    }

    const decisionListStr = Array.isArray(decisions)
      ? decisions.map((d: any, i: number) => `Choice ${i + 1}: ${d.choiceText || "Decision Made"}`).join("\n")
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

      Language Requirement: Respond in exactly one paragraph. Write in ${requestLang === "id" ? "Bahasa Indonesia" : "English"}.
      Keep the tone witty, modern, immersive, with custom futuristic simulator vibes.
      Refer to yourself as "Dinar's Cosmic AI Guide".
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
      },
    });

    res.json({ commentary: response.text });
  } catch (error: any) {
    if (
      error &&
      (error.status === "RESOURCE_EXHAUSTED" ||
        String(error.message).includes("quota") ||
        String(error).includes("quota") ||
        error.code === 429)
    ) {
      console.warn("AI Feedback: Quota exceeded or rate limit reached. Using fallback commentary.");
    } else {
      console.error("Error generating AI feedback:", error);
    }
    res.json({
      commentary:
        requestLang === "id"
          ? `Layanan AI terhubung! Perjalananmu sebagai seorang profesional telah membentuk takdir kosmik baru yang tak tertandingi.`
          : `Cosmic network synced! Your journey as a professional has successfully forged a brand new destiny.`,
    });
  }
}
