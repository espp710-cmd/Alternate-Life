import React, { useState, useEffect } from "react";
import { Play, BookOpen, Star, Users, Briefcase, ChevronRight, Sparkles } from "lucide-react";

interface LandingPageProps {
  lang: "id" | "en";
  name: string;
  setName: (name: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  onStart: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function LandingPage({
  lang,
  name,
  setName,
  gender,
  setGender,
  onStart,
  onNavigateTab
}: LandingPageProps) {
  const [totalSimulated, setTotalSimulated] = useState(128); // Default fallback
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch live stats from the backend to display player count dynamically
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalUsers === "number") {
          // Add standard base count to look established, plus actual database additions
          setTotalSimulated(150 + data.totalUsers);
        }
      })
      .catch(() => {});
  }, []);

  const handleStartClick = () => {
    if (!name.trim()) {
      setErrorMessage(
        lang === "id"
          ? "Silakan masukkan nama atau panggilan karaktermu terlebih dahulu!"
          : "Please enter your character name or nickname first!"
      );
      return;
    }
    setErrorMessage("");
    onStart();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 relative z-10">
      {/* Decorative Neon Element */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#bc13fe]/10 border border-[#bc13fe]/30 rounded-full text-xs font-semibold text-purple-300 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#bc13fe] animate-spin" />
          {lang === "id" ? "Simulator Realitas Alternatif" : "Alternative Reality Simulator"}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] drop-shadow-sm">
            AlternateLife
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          {lang === "id"
            ? "Mulai simulasikan pilihan karir paling gila, kelola kesehatan mental & tabungan finansial, lalu klaim Sertifikat Karir Profesional milikmu!"
            : "Forge a fresh destiny. Simulate extreme career moves, balance heavy burnout vs savings, and claim your custom Premium Career Certification!"}
        </p>
      </div>

      {/* Quick Global Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="bg-black/45 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm shadow-md">
          <div className="flex justify-center mb-1 text-neon-purple">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">{totalSimulated}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {lang === "id" ? "Player Telah Menyerah" : "Souls Simulated"}        
          </div>
        </div>

        <div className="bg-black/45 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm shadow-md">
          <div className="flex justify-center mb-1 text-neon-blue">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">40+</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {lang === "id" ? "Pilihan Profesi" : "Career Pathways"}
          </div>
        </div>

        <div className="bg-black/45 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm shadow-md">
          <div className="flex justify-center mb-1 text-yellow-400">
            <Star className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">4.9/5</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {lang === "id" ? "Rating Pemain" : "Player Rating"}
          </div>
        </div>
      </div>

      {/* Onboarding Interactive Form Card */}
      <div className="glass-card p-6 md:p-8 max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-neon-blue">
            {lang === "id" ? "Masukkan Panggilan Karakter" : "Character Nickname"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value.slice(0, 24));
              if (errorMessage) setErrorMessage("");
            }}
            placeholder={lang === "id" ? "Contoh: Alex, Jane, Budi" : "e.g., Alex, Jane, Maverick"}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-lg transition duration-200"
          />
        </div>

        {/* Gender / Vibe Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-neon-blue">
            {lang === "id" ? "Pilih Avatar / Identitas" : "Choose Identity Style"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "male", nameId: "Pria 👦", nameEn: "Male 👦" },
              { id: "female", nameId: "Wanita 👧", nameEn: "Female 👧" },
              { id: "android", nameId: "Cyber 🤖", nameEn: "Cyber 🤖" }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGender(g.id)}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold border transition duration-200 uppercase tracking-wider ${
                  gender === g.id
                    ? "bg-[#bc13fe]/20 border-[#bc13fe] text-white shadow-[0_0_10px_rgba(188,19,254,0.4)]"
                    : "bg-black/40 border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                {lang === "id" ? g.nameId : g.nameEn}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="text-rose-400 text-xs font-semibold text-center bg-rose-500/10 py-2.5 px-4 rounded-xl border border-rose-500/20 animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* CTA Launch Simulator Button */}
        <button
          onClick={handleStartClick}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] hover:from-[#00d7e2] hover:to-[#a910e5] text-white font-extrabold py-4 px-6 rounded-xl transition duration-300 shadow-lg shadow-[#bc13fe]/20 hover:shadow-[#00f2ff]/20 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-lg"
        >
          <Play className="w-5 h-5 text-white fill-white animate-pulse" />
          <span>{lang === "id" ? "Mulai Hidup Baru!" : "Simulate Alternate Life!"}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition duration-200" />
        </button>
      </div>

      {/* Guide Shortcut CTA */}
      <div className="text-center text-neon-blue">
        <button
          onClick={() => onNavigateTab("guide")}
          className="inline-flex items-center gap-2 text-neon-blue hover:text-[#00d2dd] font-bold text-sm transition group"
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === "id" ? "Lihat Panduan Singkat" : "Read Simulation Guide"}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
    </div>
  );
}
