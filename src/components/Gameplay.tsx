import React, { useState } from "react";
import { Coins, AlertTriangle, Activity, User, ArrowRight, Skull } from "lucide-react";
import { Scenario, PlayerStats, Choice } from "../types";

interface GameplayProps {
  lang: "id" | "en";
  playerName: string;
  stats: PlayerStats;
  currentScenario: Scenario;
  onMakeChoice: (choice: Choice) => void;
  scenarioIndex: number;
  totalScenarios: number;
  isRandomActive: boolean;
}

export default function Gameplay({
  lang,
  playerName,
  stats,
  currentScenario,
  onMakeChoice,
  scenarioIndex,
  totalScenarios,
  isRandomActive
}: GameplayProps) {
  // Local state to animate choice feedback
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoiceId(choice.id);
    setTimeout(() => {
      onMakeChoice(choice);
      setSelectedChoiceId(null);
    }, 400); // Small delay to let the active selection glow animation finish
  };

  // Stress level thresholds & color settings
  const getStressColor = (s: number) => {
    if (s >= 75) return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)] animate-pulse";
    if (s >= 45) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  };

  const getChoiceTypeBadge = (type: string) => {
    switch (type) {
      case "safe":
        return {
          label: lang === "id" ? "Aman 🛡️" : "Safe 🛡️",
          style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        };
      case "risky":
        return {
          label: lang === "id" ? "Berisiko ⚡" : "Risky ⚡",
          style: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
        };
      case "high_reward":
        return {
          label: lang === "id" ? "Untung Besar 💎" : "High Reward 💎",
          style: "bg-purple-500/10 border-purple-500/30 text-purple-400"
        };
      case "chaotic":
        return {
          label: lang === "id" ? "Kacau/Lucu 🎰" : "Chaotic 🎰",
          style: "bg-rose-500/10 border-rose-500/30 text-rose-400"
        };
      default:
        return {
          label: lang === "id" ? "Standard" : "Standard",
          style: "bg-gray-500/10 border-gray-500/30 text-gray-400"
        };
    }
  };

  const formatCurrency = (val: number) => {
    if (lang === "id") {
      return `Rp ${(val * 1000).toLocaleString()}`;
    } else {
      return `$ ${val.toLocaleString()}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 relative z-10 animate-fade-in">
      {/* 1. Dynamic HUD dashboard - Sticky beneath the navigation header */}
      <div className="sticky top-[74px] z-30 grid grid-cols-1 md:grid-cols-4 gap-3 bg-bg-dark/90 border border-white/15 rounded-2xl p-4 shadow-xl backdrop-blur-lg">
        {/* Profile Card */}
        <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0 pr-2">
          <div className="p-2.5 bg-[#bc13fe]/20 border border-[#bc13fe]/40 rounded-xl text-purple-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">
              {lang === "id" ? "Pemain" : "Player"}
            </div>
            <div className="text-sm font-black text-white truncate max-w-[150px]">{playerName}</div>
          </div>
        </div>

        {/* Wealth Indicator */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1 text-emerald-400 font-mono">
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4" />
              {lang === "id" ? "Uang / Tabungan" : "Wealth Balance"}
            </span>
            <span>{formatCurrency(stats.money)}</span>
          </div>
          <div className="w-full bg-black/50 border border-white/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (stats.money / 40000) * 100))}%` }}
            />
          </div>
        </div>

        {/* Stress Meter */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1 text-rose-400 font-mono">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {lang === "id" ? "Tingkat Stres" : "Stress Levels"}
            </span>
            <span className={`${stats.stress >= 75 ? "text-rose-500 animate-bounce" : ""}`}>{stats.stress} %</span>
          </div>
          <div className="w-full bg-black/50 border border-white/5 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getStressColor(stats.stress)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.stress))}%` }}
            />
          </div>
        </div>

        {/* Career Timeline Progress */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1 text-neon-blue font-mono">
            <span className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {lang === "id" ? "Timeline Simulasi" : "Simulator Timeline"}
            </span>
            <span>
              {isRandomActive
                ? "EVENT"
                : `${scenarioIndex + 1} / ${totalScenarios}`}
            </span>
          </div>
          <div className="w-full bg-black/50 border border-white/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-neon-blue to-neon-purple h-full transition-all duration-500"
              style={{ width: `${isRandomActive ? 100 : ((scenarioIndex + 1) / totalScenarios) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning Indicator */}
      {stats.stress >= 75 && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold py-2 px-4 rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
          <Skull className="w-4 h-4 text-rose-500" />
          <span>
            {lang === "id"
              ? "PERINGATAN: Tingkat stres kamu terlalu tinggi! Kamu berisiko mengalami burnout di fase berikutnya."
              : "WARNING: High mental stress! You are highly vulnerable to burnout crises in the next stage."}
          </span>
        </div>
      )}

      {/* 2. Main Narrative Card with blurred custom background */}
      <div className="relative glass-card overflow-hidden flex flex-col min-h-[380px]">
        {/* Background visual illustration layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-bg-dark/75 z-10" /> {/* Dark filter mask */}
          <img
            src={currentScenario.illustration}
            alt="Scenario Illustration"
            className="w-full h-full object-cover filter blur-[2px] scale-105"
          />
        </div>

        {/* Narrative text contents */}
        <div className="relative z-20 p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                isRandomActive
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  : "bg-[#bc13fe]/20 border border-[#bc13fe]/40 text-[#bc13fe]"
              }`}>
                {isRandomActive 
                  ? (lang === "id" ? "🚨 Kejadian Acak" : "🚨 Random Event")
                  : (lang === "id" ? "📌 Skenario Utama" : "📌 Main Scenario")}
              </span>
            </div>

            <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight drop-shadow">
              {lang === "id" ? currentScenario.titleId : currentScenario.titleEn}
            </h2>

            <p className="text-gray-100 text-sm md:text-lg leading-relaxed drop-shadow bg-black/50 p-4 rounded-2xl border border-white/10">
              {lang === "id" ? currentScenario.textId : currentScenario.textEn}
            </p>
          </div>

          {/* Interactive choices grid */}
          <div className="space-y-3 pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white/50">
              {lang === "id" ? "Tentukan Tindakanmu:" : "Determine your actions:"}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {currentScenario.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={selectedChoiceId !== null}
                    className={`text-left p-4 rounded-2xl border text-sm transition-all duration-300 relative group flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#00f2ff]/25 border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.4)] translate-x-1"
                        : "bg-black/40 border-white/10 hover:border-[#00f2ff]/40 hover:bg-black/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gray-100 font-medium group-hover:text-white transition">
                        {lang === "id" ? choice.textId : choice.textEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <ArrowRight className="w-4 h-4 text-[#bc13fe] group-hover:translate-x-1 transition duration-200" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
