import React from "react";
import { GraduationCap, Zap, Heart, Sparkles, ChevronRight, Coins } from "lucide-react";

interface CharacterSetupProps {
  lang: "id" | "en";
  education: string;
  setEducation: (edu: string) => void;
  lifestyle: string;
  setLifestyle: (style: string) => void;
  vibe: string;
  setVibe: (vibe: string) => void;
  onNext: () => void;
}

export default function CharacterSetup({
  lang,
  education,
  setEducation,
  lifestyle,
  setLifestyle,
  vibe,
  setVibe,
  onNext
}: CharacterSetupProps) {
  const educations = [
    {
      id: "HighSchool",
      labelId: "SMA/SMK Sederajat",
      labelEn: "High School Grad",
      descId: "Memulai karir tanpa hutang pendidikan. Mandiri & gigih.",
      descEn: "Zero tuition loans. Extremely pragmatic & street smart.",
      money: 1000,
      stress: 0,
      progress: 5
    },
    {
      id: "CompSci",
      labelId: "S1 Ilmu Komputer",
      labelEn: "B.S. Computer Science",
      descId: "Menguasai struktur algoritma & kode. Siap mendobrak dunia teknologi.",
      descEn: "Algorithms, code syntax, and compilers. Prepared for high-tech setups.",
      money: 2500,
      stress: 20,
      progress: 15
    },
    {
      id: "Engineering",
      labelId: "S1 Teknik",
      labelEn: "B.S. Engineering",
      descId: "Analisis sistematis dan pemecahan masalah fisik yang rumit.",
      descEn: "Systematic analysis, physics modeling, and robust hardware design.",
      money: 2800,
      stress: 18,
      progress: 14
    },
    {
      id: "Business",
      labelId: "S1 Bisnis & Manajemen",
      labelEn: "B.A. Business Admin",
      descId: "Paham analisis pasar, margin keuntungan, dan pitch proposal.",
      descEn: "Understand market research, ROI models, and pitch scripts.",
      money: 3500,
      stress: 15,
      progress: 10
    },
    {
      id: "CreativeArts",
      labelId: "Sekolah Seni & Desain",
      labelEn: "Creative Arts Academy",
      descId: "Kreativitas tingkat tinggi, melukis piksel dan estetika visual.",
      descEn: "Mastering aesthetic balance, pixels, and creative writing.",
      money: 1500,
      stress: 10,
      progress: 12
    },
    {
      id: "SelfTaught",
      labelId: "Autodidak Genius",
      labelEn: "Self-Taught Maverick",
      descId: "Belajar dari video panduan & dokumentasi open-source. Tidak tertebak.",
      descEn: "Forged via documentation, documentation forums, and video guides.",
      money: 800,
      stress: 5,
      progress: 8
    }
  ];

  const vibes = [
    {
      id: "Techie",
      labelId: "Tech Prodigy 💻",
      labelEn: "Tech Prodigy 💻",
      descId: "Menambahkan bonus pertumbuhan Progress +10%",
      descEn: "Boosts career Progress growth velocity by +10%"
    },
    {
      id: "Hustler",
      labelId: "Ultimate Hustler 💰",
      labelEn: "Ultimate Hustler 💰",
      descId: "Meningkatkan pendapatan finansial sebesar +10%",
      descEn: "Increases overall Money yield by +10%"
    },
    {
      id: "Mindful",
      labelId: "Zen Master 🧘",
      labelEn: "Zen Master 🧘",
      descId: "Mengurangi dampak stres dari keputusan sebesar -15%",
      descEn: "Reduces stress damage from decisions by -15%"
    },
    {
      id: "Rebel",
      labelId: "Chaos Catalyst 🎭",
      labelEn: "Chaos Catalyst 🎭",
      descId: "Membuka tingkat pilihan ekstrim & humoris",
      descEn: "Unlocks experimental options and humorous results"
    }
  ];

  const lifestyles = [
    {
      id: "Frugal",
      labelId: "Sederhana & Frugal 🌱",
      labelEn: "Frugal Minimalist 🌱",
      descId: "Menjaga pengeluaran serendah mungkin.",
      descEn: "Keeps financial outlays as flat as possible."
    },
    {
      id: "Hedonist",
      labelId: "Sultan & Hedonis 💎",
      labelEn: "High Roller Hedonist 💎",
      descId: "Meningkatkan gengsi/proyeksi karir tapi boros.",
      descEn: "Multiplies progress projection but drains savings."
    },
    {
      id: "Balanced",
      labelId: "Keseimbangan Harmonis ⚖️",
      labelEn: "Health Balance ⚖️",
      descId: "Mengutamakan nutrisi seimbang & tidur malam cukup.",
      descEn: "Prioritizes high nutrition, fitness, and deep sleep cycles."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 relative z-10 animate-fade-in">
      {/* Setup Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] uppercase tracking-tighter">
          {lang === "id" ? "🛠️ Inisialisasi Karakter" : "🛠️ Character Calibration"}
        </h2>
        <p className="text-white/60 max-w-lg mx-auto text-sm md:text-base">
          {lang === "id"
            ? "Pilihlah latar belakang pendidikan, spesialisasi keahlian, dan gaya hidupmu untuk menentukan status awal simulasimu."
            : "Select your academic background, core skill vibe, and lifestyle metrics to adjust your baseline values."}
        </p>
      </div>

      {/* Grid of Choices */}
      <div className="space-y-6">
        {/* 1. Education Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 border-neon-blue pl-3">
            <GraduationCap className="w-5 h-5 text-neon-blue" />
            <span>{lang === "id" ? "1. Latar Belakang Pendidikan" : "1. Academic Background"}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {educations.map((edu) => (
              <button
                key={edu.id}
                onClick={() => setEducation(edu.id)}
                className={`text-left p-4 rounded-2xl border transition duration-300 relative ${
                  education === edu.id
                    ? "bg-[#bc13fe]/10 border-[#bc13fe] shadow-[0_0_15px_rgba(188,19,254,0.3)]"
                    : "bg-black/40 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="font-extrabold text-sm text-white mb-1">
                  {lang === "id" ? edu.labelId : edu.labelEn}
                </div>
                <div className="text-xs text-white/50 leading-relaxed">
                  {lang === "id" ? edu.descId : edu.descEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Vibes Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 border-neon-purple pl-3">
            <Zap className="w-5 h-5 text-neon-purple" />
            <span>{lang === "id" ? "2. Spesialisasi / Vibe Karakter" : "2. Special Skill Vibe"}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {vibes.map((vb) => (
              <button
                key={vb.id}
                onClick={() => setVibe(vb.id)}
                className={`text-left p-4 rounded-2xl border transition duration-300 ${
                  vibe === vb.id
                    ? "bg-[#bc13fe]/10 border-[#bc13fe] shadow-[0_0_15px_rgba(188,19,254,0.3)]"
                    : "bg-black/40 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="font-extrabold text-sm text-white mb-1">
                  {lang === "id" ? vb.labelId : vb.labelEn}
                </div>
                <div className="text-xs text-white/50 leading-relaxed">
                  {lang === "id" ? vb.descId : vb.descEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Lifestyle Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 border-neon-blue pl-3">
            <Heart className="w-5 h-5 text-neon-blue" />
            <span>{lang === "id" ? "3. Model Gaya Hidup" : "3. Lifestyle Setting"}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lifestyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setLifestyle(style.id)}
                className={`text-left p-4 rounded-2xl border transition duration-300 ${
                  lifestyle === style.id
                    ? "bg-[#bc13fe]/10 border-[#bc13fe] shadow-[0_0_15px_rgba(188,19,254,0.3)]"
                    : "bg-black/40 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="font-extrabold text-sm text-white mb-1">
                  {lang === "id" ? style.labelId : style.labelEn}
                </div>
                <div className="text-xs text-white/50 leading-relaxed">
                  {lang === "id" ? style.descId : style.descEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Area */}
      <div className="text-center pt-4">
        <button
          onClick={onNext}
          className="relative inline-flex group items-center gap-2 bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] hover:from-[#00d7e2] hover:to-[#a910e5] text-white font-extrabold py-4 px-12 rounded-xl transition duration-300 shadow-lg shadow-[#bc13fe]/20 hover:shadow-[#00f2ff]/20 hover:scale-[1.02] cursor-pointer text-base md:text-lg"
        >
          <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
          <span>{lang === "id" ? "Inisialisasi & Mulai Simulasi" : "Initialize & Enter Sandbox"}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition duration-200" />
        </button>
      </div>
    </div>
  );
}
