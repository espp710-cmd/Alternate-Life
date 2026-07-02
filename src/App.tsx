import React, { useState, useEffect } from "react";
import { Sun, Moon, Globe, Award, Sparkles, BookOpen, Info, Shield, Briefcase, Mail, Lock, Heart, Settings } from "lucide-react";
import ShaderBackground from "./components/ShaderBackground";
import LandingPage from "./components/LandingPage";
import CharacterSetup from "./components/CharacterSetup";
import Gameplay from "./components/Gameplay";
import EndingScreen from "./components/EndingScreen";
import ExtraPages from "./components/ExtraPages";
import AdminDashboard from "./components/AdminDashboard";

import { SCENARIOS, RANDOM_EVENTS } from "./scenarios";
import { PlayerStats, Scenario, Choice } from "./types";
import { playClickSound, playRewardSound, playCrisisSound } from "./utils/audio";

export default function App() {
  // Global View / Navigation States
  const [lang, setLang] = useState<"id" | "en">("id");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Player Onboarding Profile State
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [education, setEducation] = useState("CompSci");
  const [vibe, setVibe] = useState("Techie");
  const [lifestyle, setLifestyle] = useState("Balanced");

  // Core Simulation Metrics State
  const [stats, setStats] = useState<PlayerStats>({
    money: 2000,
    stress: 15,
    progress: 10,
    education: "CompSci",
    lifestyle: "Balanced",
    vibe: "Techie",
    gender: "male"
  });

  const [gameState, setGameState] = useState<"landing" | "setup" | "gameplay" | "ending">("landing");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [decisions, setDecisions] = useState<any[]>([]);

  // Random Event States
  const [isRandomActive, setIsRandomActive] = useState(false);
  const [currentRandomScenario, setCurrentRandomScenario] = useState<Scenario | null>(null);

  // Apply light/dark class on HTML/body for Tailwind compatibility
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);

  // Transition from Landing to Character Setup
  const handleStartGame = () => {
    playClickSound();
    setGameState("setup");
    setCurrentTab("home");
  };

  // Calibrate baseline metrics and enter Sandbox Simulator
  const handleCompleteSetup = () => {
    playClickSound();
    // Calibrate stats based on baseline education
    let initialMoney = 2000;
    let initialStress = 15;
    let initialProgress = 10;

    switch (education) {
      case "HighSchool":
        initialMoney = 1000;
        initialStress = 0;
        initialProgress = 5;
        break;
      case "CompSci":
        initialMoney = 2500;
        initialStress = 20;
        initialProgress = 15;
        break;
      case "Engineering":
        initialMoney = 2800;
        initialStress = 18;
        initialProgress = 14;
        break;
      case "Business":
        initialMoney = 3500;
        initialStress = 15;
        initialProgress = 10;
        break;
      case "CreativeArts":
        initialMoney = 1500;
        initialStress = 10;
        initialProgress = 12;
        break;
      case "SelfTaught":
        initialMoney = 800;
        initialStress = 5;
        initialProgress = 8;
        break;
    }

    setStats({
      money: initialMoney,
      stress: initialStress,
      progress: initialProgress,
      education,
      lifestyle,
      vibe,
      gender
    });

    setGameState("gameplay");
    setCurrentScenarioIndex(0);
    setDecisions([]);
    setIsRandomActive(false);
    setCurrentRandomScenario(null);
  };

  // Core Game State choice handler
  const handleMakeChoice = (choice: Choice) => {
    // 1. Calculate Stat Modifiers taking Vibe/Lifestyle multipliers into account
    let finalMoneyImpact = choice.impact.money;
    let finalStressImpact = choice.impact.stress;
    let finalProgressImpact = choice.impact.progress;

    // Apply special Vibe modifiers
    if (vibe === "Hustler" && finalMoneyImpact > 0) {
      finalMoneyImpact = Math.round(finalMoneyImpact * 1.10);
    }
    if (vibe === "Mindful" && finalStressImpact > 0) {
      finalStressImpact = Math.round(finalStressImpact * 0.85);
    }
    if (vibe === "Techie" && finalProgressImpact > 0) {
      finalProgressImpact = Math.round(finalProgressImpact * 1.10);
    }

    // Apply Lifestyle modifiers
    if (lifestyle === "Frugal" && finalMoneyImpact < 0) {
      finalMoneyImpact = Math.round(finalMoneyImpact * 0.90); // 10% discount on losses
    }
    if (lifestyle === "Hedonist") {
      if (finalProgressImpact > 0) finalProgressImpact = Math.round(finalProgressImpact * 1.15);
      if (finalMoneyImpact < 0) finalMoneyImpact = Math.round(finalMoneyImpact * 1.15); // More expensive lifestyle
    }
    if (lifestyle === "Balanced" && finalStressImpact > 0) {
      finalStressImpact = Math.round(finalStressImpact * 0.90);
    }

    // Calculate new stat thresholds
    const nextMoney = Math.max(0, stats.money + finalMoneyImpact);
    const nextStress = Math.min(100, Math.max(0, stats.stress + finalStressImpact));
    const nextProgress = Math.max(0, stats.progress + finalProgressImpact);

    const updatedStats = { ...stats, money: nextMoney, stress: nextStress, progress: nextProgress };
    setStats(updatedStats);

    // Save decision record
    const decisionLog = {
      scenarioId: isRandomActive ? currentRandomScenario?.id : SCENARIOS[currentScenarioIndex].id,
      scenarioTitle: lang === "id" 
        ? (isRandomActive ? currentRandomScenario?.titleId : SCENARIOS[currentScenarioIndex].titleId)
        : (isRandomActive ? currentRandomScenario?.titleEn : SCENARIOS[currentScenarioIndex].titleEn),
      choiceText: lang === "id" ? choice.textId : choice.textEn,
      impact: choice.impact,
      professionTrigger: choice.professionTrigger
    };
    
    const updatedDecisions = [...decisions, decisionLog];
    setDecisions(updatedDecisions);

    // 2. Decide Next Stage or Random Event Overrides
    if (isRandomActive) {
      // Return to main scenario path from random event
      setIsRandomActive(false);
      setCurrentRandomScenario(null);

      // Check if this was the final scenario
      if (currentScenarioIndex >= SCENARIOS.length - 1) {
        setGameState("ending");
      } else {
        setCurrentScenarioIndex(prev => prev + 1);
      }
    } else {
      // Trigger random events with specific condition triggers
      let eventToTrigger: Scenario | null = null;

      // 15% random chance or specific stat thresholds
      const rand = Math.random();
      if (nextStress >= 75) {
        // High Stress triggers Burnout event
        eventToTrigger = RANDOM_EVENTS.find(e => e.id === "re_burnout") || null;
      } else if (nextMoney >= 8000 && rand < 0.35) {
        // High Money yields Scam event
        eventToTrigger = RANDOM_EVENTS.find(e => e.id === "re_scam") || null;
      } else if (rand < 0.20) {
        // Flat random positive opportunity
        eventToTrigger = RANDOM_EVENTS.find(e => e.id === "re_opportunity") || null;
      }

      if (eventToTrigger && !decisions.some(d => d.scenarioId === eventToTrigger?.id)) {
        setIsRandomActive(true);
        setCurrentRandomScenario(eventToTrigger);
        playCrisisSound();
      } else {
        if (finalMoneyImpact > 0 || finalProgressImpact > 0) {
          playRewardSound();
        } else {
          playClickSound();
        }
        // Increment scenario
        if (currentScenarioIndex >= SCENARIOS.length - 1) {
          setGameState("ending");
        } else {
          setCurrentScenarioIndex(prev => prev + 1);
        }
      }
    }
  };

  // Play again state reset
  const handleRestart = () => {
    playClickSound();
    setGameState("landing");
    setCurrentScenarioIndex(0);
    setDecisions([]);
    setIsRandomActive(false);
    setCurrentRandomScenario(null);
    setCurrentTab("home");
  };

  // Shortcut navigation tab handler
  const handleNavigateTab = (tab: string) => {
    playClickSound();
    setCurrentTab(tab);
    if (tab !== "home" && gameState === "gameplay") {
      // Pause/suspend gameplay, showing auxiliary pages
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans overflow-x-hidden selection:bg-neon-purple selection:text-white flex flex-col justify-between relative">
      {/* Sleek Interface Ambient Glowing Spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#bc13fe22] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#00f2ff22] blur-[100px] rounded-full pointer-events-none"></div>

      {/* 1. Futuristic Canvas Background */}
      <ShaderBackground />

      {/* 2. Adaptive Navigation Header */}
      <header className="sticky top-0 z-50 bg-bg-dark/40 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          {/* Logo Brand */}
          <button 
            onClick={() => handleNavigateTab("home")}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#00f2ff] to-[#bc13fe] rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(188,19,254,0.4)] group-hover:scale-105 transition duration-200 font-black text-white">
              A
            </div>
            <div>
              <span className="font-extrabold text-lg text-white uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00f2ff] group-hover:to-[#bc13fe] transition duration-200">
                Alternate<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#bc13fe]">Life</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-white/40 block leading-tight font-mono ml-1.5">v1.1 Beta</span>
            </div>
          </button>

          {/* Center Navigation Links (Only show when not active in Game setups/gameplay for clean layout) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {[
              { id: "home", labelId: "🎮 Bermain", labelEn: "🎮 Simulation" },
              { id: "guide", labelId: "📖 Panduan", labelEn: "📖 Guide" },
              { id: "services", labelId: "💼 Layanan", labelEn: "💼 Services" },
              { id: "about", labelId: "👤 Kreator", labelEn: "👤 Creator" },
              { id: "admin", labelId: "📊 Telemetri", labelEn: "📊 Telemetry" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavigateTab(tab.id)}
                className={`py-1.5 px-3.5 rounded-full transition duration-150 cursor-pointer ${
                  currentTab === tab.id
                    ? "bg-[#bc13fe]/20 text-[#bc13fe] border border-[#bc13fe]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {lang === "id" ? tab.labelId : tab.labelEn}
              </button>
            ))}
          </nav>

          {/* Quick Utility Strip */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer"
              title={lang === "id" ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
            >
              <Globe className="w-3.5 h-3.5 text-neon-blue animate-spin-slow" />
              <span>{lang === "id" ? "EN 🇺🇸" : "ID 🇮🇩"}</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-gray-300 transition cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Primary Stage Orchestrator */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-8 py-10 relative z-10">
        {currentTab !== "home" ? (
          // Render extra sub-pages
          currentTab === "admin" ? (
            <AdminDashboard lang={lang} onBack={() => handleNavigateTab("home")} />
          ) : (
            <ExtraPages currentTab={currentTab} lang={lang} onBack={() => handleNavigateTab("home")} />
          )
        ) : (
          // Render stateful simulation gameplay stages
          <>
            {gameState === "landing" && (
              <LandingPage
                lang={lang}
                name={name}
                setName={setName}
                gender={gender}
                setGender={setGender}
                onStart={handleStartGame}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {gameState === "setup" && (
              <CharacterSetup
                lang={lang}
                education={education}
                setEducation={setEducation}
                lifestyle={lifestyle}
                setLifestyle={setLifestyle}
                vibe={vibe}
                setVibe={setVibe}
                onNext={handleCompleteSetup}
              />
            )}

            {gameState === "gameplay" && (
              <Gameplay
                lang={lang}
                playerName={name}
                stats={stats}
                currentScenario={isRandomActive && currentRandomScenario ? currentRandomScenario : SCENARIOS[currentScenarioIndex]}
                onMakeChoice={handleMakeChoice}
                scenarioIndex={currentScenarioIndex}
                totalScenarios={SCENARIOS.length}
                isRandomActive={isRandomActive}
              />
            )}

            {gameState === "ending" && (
              <EndingScreen
                lang={lang}
                playerName={name}
                gender={gender}
                stats={stats}
                decisions={decisions}
                onRestart={handleRestart}
              />
            )}
          </>
        )}
      </main>

      {/* 4. Elegant Glowing Footer */}
      <footer className="border-t border-white/5 bg-bg-dark/90 backdrop-blur-md py-6 px-4 md:px-8 relative z-10 text-center space-y-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            <span>Developed with absolute passion by </span>
            <a 
              href="https://instagram.com/dinar_maulidan" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 font-bold hover:text-cyan-300 transition"
            >
              Dinar Maulidan
            </a>
          </div>

          {/* Quick legal anchors */}
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => handleNavigateTab("guide")} className="hover:text-gray-300 transition font-semibold">
              {lang === "id" ? "Bantuan" : "Guide"}
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateTab("services")} className="hover:text-gray-300 transition font-semibold">
              {lang === "id" ? "Layanan Jasa" : "Services"}
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateTab("privacy")} className="hover:text-gray-300 transition font-semibold">
              {lang === "id" ? "Kebijakan Privasi" : "Privacy Policy"}
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateTab("contact")} className="hover:text-gray-300 transition font-semibold">
              {lang === "id" ? "Kontak" : "Contact"}
            </button>
            <span>•</span>
            <button 
              onClick={() => handleNavigateTab("admin")} 
              className="flex items-center gap-1 text-neon-purple hover:text-white transition font-semibold"
              title={lang === "id" ? "Konsol Admin Telemetri" : "Access Admin Console"}
            >
              <Settings className="w-3.5 h-3.5 animate-spin-slow text-[#bc13fe]" />
              <span>{lang === "id" ? "" : ""}</span>
            </button>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} AlternateLife. All rights simulated.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
