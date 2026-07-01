import React, { useState, useEffect } from "react";
import { RefreshCw, Star, Share2, Award, Sparkles, ChevronRight, MessageSquareCode } from "lucide-react";
import { PlayerStats, SavedUser } from "../types";
import Certificate from "./Certificate";

interface EndingScreenProps {
  lang: "id" | "en";
  playerName: string;
  gender: string;
  stats: PlayerStats;
  decisions: any[];
  onRestart: () => void;
}

export default function EndingScreen({
  lang,
  playerName,
  gender,
  stats,
  decisions,
  onRestart
}: EndingScreenProps) {
  const [rating, setRating] = useState(5);
  const [finalJob, setFinalJob] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [aiCommentary, setAiCommentary] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "sending" | "success">("idle");

  // Generate dynamic professions based on stats, setup, and path chosen
  useEffect(() => {
    // Determine dynamic profession based on choices and end-game stats
    let profession = "";
    
    // Check if there are specific path triggers in decisions list
    const lastTriggerChoice = [...decisions].reverse().find(d => d.professionTrigger);
    if (lastTriggerChoice && lastTriggerChoice.professionTrigger) {
      profession = lastTriggerChoice.professionTrigger;
    }

    // Overrule based on threshold extremes
    if (stats.money <= 1000) {
      profession = lang === "id" ? "Bankrupt Survivor 💸" : "Debt Survivor 💸";
    } else if (stats.stress >= 85) {
      profession = lang === "id" ? "Overthinking Specialist ⚡" : "Burnout Specialist ⚡";
    } else if (stats.money >= 30000) {
      profession = lang === "id" ? "Angel Investor 💎" : "Legacy Investor 💎";
    } else if (profession === "") {
      // General fallbacks based on setup
      if (stats.education === "CompSci") {
        profession = "Senior Software Engineer";
      } else if (stats.education === "Engineering") {
        profession = lang === "id" ? "Kepala Rekayasa Otomasi 🛠️" : "Principal Automation Engineer 🛠️";
      } else if (stats.education === "Business") {
        profession = "Corporate Operations Chief";
      } else if (stats.education === "CreativeArts") {
        profession = "Lead Visual Designer";
      } else if (stats.education === "SelfTaught") {
        profession = lang === "id" ? "Autodidak Fullstack Maverick ⚡" : "Self-Taught Fullstack Maverick ⚡";
      } else if (stats.education === "HighSchool") {
        profession = lang === "id" ? "Wirausaha Mandiri Tangguh" : "Resilient Solopreneur";
      } else {
        profession = "Remote Freelancer";
      }
    }

    setFinalJob(profession);

    // Calculate simulated rating 1 to 5 stars
    let r = 5;
    if (stats.stress >= 75) r -= 1;
    if (stats.stress >= 90) r -= 1;
    if (stats.money <= 2000) r -= 1;
    if (stats.money >= 20000) r += 1; // Can keep max 5
    r = Math.min(5, Math.max(1, r));
    setRating(r);

    // Create unique Accreditation ID
    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase();
    const id = `AL-${randomHex}-${new Date().getFullYear()}`;
    setUniqueId(id);

    // Query server-side Gemini API for custom cosmic AI commentary
    setIsAiLoading(true);
    fetch("/api/ai-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playerName,
        finalJob: profession,
        money: stats.money,
        stress: stats.stress,
        progress: stats.progress,
        decisions,
        lang
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.commentary) {
          setAiCommentary(data.commentary);
        }
      })
      .catch(() => {
        // Safe standard fallback in case of errors
        setAiCommentary(
          lang === "id"
            ? `Dinar's Cosmic AI Guide: Sungguh perjalanan hidup yang menarik, ${playerName}! Keseimbangan antara karir sebagai ${profession} dan kesehatan mentalmu adalah kunci sejati realitas ini.`
            : `Dinar's Cosmic AI Guide: A genuinely fascinating alternate lifetime, ${playerName}! Your equilibrium between building an empire as a ${profession} and monitoring stress is a testament to simulator balance.`
        );
      })
      .finally(() => {
        setIsAiLoading(false);
      });
  }, [stats, decisions, lang, playerName]);

  // Save results automatically to the persistent database
  useEffect(() => {
    if (!finalJob) return;

    const payload: SavedUser = {
      id: uniqueId,
      name: playerName,
      date: new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      gender,
      education: stats.education,
      vibe: stats.vibe,
      decisions: decisions.map(d => ({
        scenarioId: d.scenarioId,
        scenarioTitle: d.scenarioTitle,
        choiceText: d.choiceText,
        impact: d.impact
      })),
      finalJob,
      money: stats.money,
      stress: stats.stress,
      progress: stats.progress,
      rating
    };

    fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setSavedSuccess(true);
      })
      .catch((err) => {
        console.error("Failed to archive results:", err);
      });
  }, [finalJob, uniqueId, playerName, gender, stats, decisions, rating, lang]);

  const getSharingText = () => {
    const text = lang === "id"
      ? `Saya baru saja mensimulasikan kehidupan karir alternatif di AlternateLife sebagai seorang ${finalJob} dengan total aset Rp ${(stats.money * 1000).toLocaleString()}! Coba takdir alternatifmu sekarang!`
      : `I just completed my alternate life simulation as a ${finalJob} with a net worth of $${stats.money.toLocaleString()} in AlternateLife! Forge your alternate career now!`;
    return encodeURIComponent(text);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${getSharingText()}&url=${encodeURIComponent(window.location.origin)}`, "_blank");
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${getSharingText()}%20${encodeURIComponent(window.location.origin)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 relative z-10 animate-fade-in">
      {/* 1. Header Card with dynamic final profession */}
      <div className="glass-card p-6 md:p-8 text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#bc13fe]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#00f2ff]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#bc13fe]/10 border border-[#bc13fe]/30 rounded-full text-xs font-semibold text-purple-300">
          <Award className="w-4 h-4 text-[#bc13fe]" />
          <span>{lang === "id" ? "Simulasi Selesai!" : "Simulation Graduated!"}</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter uppercase">
          {lang === "id" ? "Takdir Akhirmu" : "Your Alternate Destiny"}
        </h2>

        <p className="text-lg md:text-xl text-neon-blue font-extrabold tracking-wide uppercase font-mono">
          🏆 {finalJob} 🏆
        </p>

        {/* Stars rating */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-7 h-7 ${
                i < rating ? "text-yellow-400 fill-yellow-400 animate-pulse" : "text-white/10"
              }`}
            />
          ))}
        </div>

        <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {lang === "id"
            ? "Kamu telah melewati berbagai tantangan hidup karir, mengorbankan waktu demi lembur, menghadapi krisis global, dan membentuk aliansi hebat."
            : "You successfully steered through diverse workplace constraints, allocated hard hours, faced macro disruptions, and finalized your legacy."}
        </p>

        {/* Share buttons strip */}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a91da] text-white py-2.5 px-5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>X / Twitter</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={shareToLinkedIn}
            className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#00669c] text-white py-2.5 px-5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      {/* 2. Custom certificate display */}
      <Certificate
        lang={lang}
        playerName={playerName}
        finalJob={finalJob}
        money={stats.money}
        stress={stats.stress}
        progress={stats.progress}
        uniqueId={uniqueId}
        date={new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
        commentary={
          isAiLoading 
            ? (lang === "id" ? "Menghubungi Dinar's Cosmic AI Guide..." : "Contacting Dinar's Cosmic AI Guide...") 
            : aiCommentary
        }
      />

      {/* 2b. Suggestions / Feedback Section */}
      <div className="glass-card p-6 md:p-8 space-y-4 max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>📬</span>
          <span>{lang === "id" ? "Saran & Masukan" : "Suggestions & Feedback"}</span>
        </h3>
        <p className="text-xs text-white/50">
          {lang === "id"
            ? "Bagikan saran atau masukan Anda untuk membantu kami mengembangkan AlternateLife menjadi lebih baik!"
            : "Share your thoughts or recommendations to help us calibrate and upgrade AlternateLife!"}
        </p>

        {feedbackStatus === "success" ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold text-center animate-fade-in">
            {lang === "id"
              ? "Terima kasih banyak! Saran Anda telah berhasil direkam dalam pangkalan data."
              : "Thank you! Your suggestion has been successfully logged."}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!feedback.trim()) return;
              setFeedbackStatus("sending");
              fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: playerName,
                  feedback,
                  job: finalJob,
                  rating: feedbackRating
                })
              })
                .then(() => {
                  setFeedbackStatus("success");
                  setFeedback("");
                })
                .catch(() => {
                  setFeedbackStatus("idle");
                });
            }}
            className="space-y-3"
          >
            {/* Clickable Star Rating Input */}
            <div className="space-y-1.5 bg-black/20 p-3 rounded-xl border border-white/5">
              <label className="text-[11px] font-bold text-white/70 block uppercase tracking-wider">
                {lang === "id" ? "Beri Rating Aplikasi ⭐" : "Rate this App ⭐"}
              </label>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFeedbackRating(starValue)}
                      className="p-1 hover:scale-110 active:scale-95 transition duration-150 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-all duration-150 ${
                          starValue <= feedbackRating 
                            ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" 
                            : "text-white/20 hover:text-white/40"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-mono text-white/50 ml-2">
                  ({feedbackRating} / 5)
                </span>
              </div>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              required
              placeholder={
                lang === "id"
                  ? "Tulis saran, fitur tambahan, atau tanggapan Anda di sini..."
                  : "Type your feature requests, bugs, or general feedback here..."
              }
              className="w-full bg-black/45 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-neon-blue"
            />
            <button
              type="submit"
              disabled={feedbackStatus === "sending"}
              className="w-full bg-white/5 border border-white/10 hover:border-neon-blue/40 text-white hover:text-neon-blue font-bold py-2 px-4 rounded-xl text-xs transition duration-200 cursor-pointer disabled:opacity-50"
            >
              {feedbackStatus === "sending"
                ? (lang === "id" ? "Mengirim..." : "Transmitting...")
                : (lang === "id" ? "Kirim Saran" : "Submit Feedback")}
            </button>
          </form>
        )}
      </div>

      {/* 3. Restart Simulator Button */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="relative inline-flex group items-center gap-2 bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] hover:from-[#00d7e2] hover:to-[#a910e5] text-white font-extrabold py-4 px-12 rounded-xl transition duration-300 shadow-lg shadow-[#bc13fe]/20 hover:shadow-[#00f2ff]/20 hover:scale-[1.02] cursor-pointer text-lg"
        >
          <RefreshCw className="w-5 h-5 text-white animate-spin-slow" />
          <span>{lang === "id" ? "Simulasikan Hidup Lain" : "Try Another Life"}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition duration-200" />
        </button>
      </div>
    </div>
  );
}
