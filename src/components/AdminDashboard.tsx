import React, { useState, useEffect } from "react";
import { Lock, Eye, CheckCircle, BarChart2, Users, Coins, HelpCircle, ShieldAlert, Search } from "lucide-react";
import { SavedUser } from "../types";

export default function AdminDashboard({ lang, onBack }: { lang: "id" | "en"; onBack?: () => void }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Live telemetry data
  const [users, setUsers] = useState<SavedUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<{ name: string; feedback: string; job: string; date: string; rating?: number }[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    endingDistribution: { [key: string]: number };
    popularChoices: { choice: string; count: number }[];
  }>({
    totalUsers: 0,
    endingDistribution: {},
    popularChoices: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1011") {
      setIsAuthenticated(true);
      setErrorMessage("");
      fetchTelemetry();
    } else {
      setErrorMessage(
        lang === "id"
          ? "Sandi admin salah! Akses ditolak."
          : "Invalid supervisor passcode! Access denied."
      );
    }
  };

  const fetchTelemetry = () => {
    setIsLoading(true);
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUsers(data.rawUsers || []);
          setFeedbacks(data.feedbacks || []);
          setStats({
            totalUsers: data.totalUsers || 0,
            endingDistribution: data.endingDistribution || {},
            popularChoices: data.popularChoices || []
          });
        }
      })
      .catch((err) => console.error("Telemetry sync failure:", err))
      .finally(() => setIsLoading(false));
  };

  // Derived metrics
  const getAverageStress = () => {
    if (users.length === 0) return 0;
    const sum = users.reduce((acc, curr) => acc + (curr.stress || 0), 0);
    return Math.round(sum / users.length);
  };

  const getAverageMoney = () => {
    if (users.length === 0) return 0;
    const sum = users.reduce((acc, curr) => acc + (curr.money || 0), 0);
    return Math.round(sum / users.length);
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      (u.finalJob && u.finalJob.toLowerCase().includes(query))
    );
  });

  const formatCurrency = (val: number) => {
    if (lang === "id") {
      return `Rp ${(val * 1000).toLocaleString()}`;
    } else {
      return `$ ${val.toLocaleString()}`;
    }
  };

  // Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-blue/30 text-white/80 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer mx-auto"
          >
            <span>← {lang === "id" ? "Kembali ke Simulasi" : "Back to Simulation"}</span>
          </button>
        )}
        <div className="glass-card p-6 md:p-8 text-center space-y-6 relative z-10">
        <div className="w-16 h-16 bg-[#bc13fe]/10 border border-[#bc13fe]/30 rounded-full flex items-center justify-center mx-auto text-purple-400 shadow-[0_0_15px_rgba(188,19,254,0.2)]">
          <Lock className="w-8 h-8 text-[#bc13fe] animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
            {lang === "id" ? "Portal Admin Telemetri" : "Supervisor Telemetry Sync"}
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {lang === "id"
               ? "Masukkan sandi rahasia untuk menyinkronkan data pangkalan AlternateLife."
               : "Synchronize database metrics. Authorization passcode required."}
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            className="w-full bg-[#0a0b1e] border border-white/10 rounded-xl px-4 py-3.5 text-center text-white text-xl font-bold tracking-widest focus:outline-none focus:border-neon-blue font-mono"
          />

          {errorMessage && (
            <div className="text-rose-400 text-xs font-semibold bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white font-extrabold py-3 rounded-xl transition duration-300 cursor-pointer"
          >
            {lang === "id" ? "Masuk Konsol Admin" : "Authorize Console"}
          </button>
        </form>
      </div>
    </div>
  );
}

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 relative z-10 animate-fade-in">
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-blue/30 text-white/80 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
          >
            <span>← {lang === "id" ? "Kembali ke Beranda" : "Back to Simulation"}</span>
          </button>
        </div>
      )}
      {/* 1. Header Admin Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-card p-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter">
            📊 AlternateLife Telemetry Center
          </h2>
          <p className="text-xs text-white/50">
            {lang === "id"
              ? "Menganalisis keputusan jalan hidup dan profesi terakreditasi pangkalan data."
              : "Monitoring game metrics, pathway distribution, and database profiles."}
          </p>
        </div>

        <button
          onClick={fetchTelemetry}
          className="bg-[#bc13fe]/10 border border-[#bc13fe]/30 text-[#bc13fe] hover:bg-[#bc13fe]/20 font-bold py-2 px-4 rounded-xl text-xs transition duration-200 cursor-pointer font-mono"
        >
          {lang === "id" ? "🔄 Segarkan Data" : "🔄 Sync Telemetry"}
        </button>
      </div>

      {/* 2. Key Metrics Block */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-black/40 border border-white/10 p-5 rounded-xl backdrop-blur-sm hover:border-[#bc13fe]/30 transition-all duration-300">
          <div className="text-[#bc13fe] mb-1"><Users className="w-5 h-5" /></div>
          <div className="text-3xl font-black text-white font-mono">{stats.totalUsers}</div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">
            {lang === "id" ? "Total Pemain Database" : "Total Database Players"}
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 p-5 rounded-xl backdrop-blur-sm hover:border-neon-blue/30 transition-all duration-300">
          <div className="text-neon-blue mb-1"><Coins className="w-5 h-5" /></div>
          <div className="text-2xl font-black text-white font-mono">{formatCurrency(getAverageMoney())}</div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">
            {lang === "id" ? "Rata-Rata Kekayaan" : "Average Wealth"}
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 p-5 rounded-xl backdrop-blur-sm hover:border-rose-500/30 transition-all duration-300">
          <div className="text-rose-400 mb-1"><ShieldAlert className="w-5 h-5" /></div>
          <div className="text-3xl font-black text-white font-mono">{getAverageStress()}%</div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">
            {lang === "id" ? "Rata-Rata Stres Akhir" : "Average Final Stress"}
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 p-5 rounded-xl backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
          <div className="text-emerald-400 mb-1"><BarChart2 className="w-5 h-5" /></div>
          <div className="text-sm font-extrabold text-white truncate">
            {stats.popularChoices[0]?.choice || "N/A"}
          </div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1.5">
            {lang === "id" ? "Pilihan Terpopuler" : "Most Popular Choice"}
          </div>
        </div>
      </div>

      {/* 3. Visual Charts block (Pure responsive HTML/SVG bar graphs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Professional Career Distribution */}
        <div className="glass-card p-6 space-y-4">
          <h4 className="text-sm font-black uppercase tracking-wider text-neon-blue border-b border-white/10 pb-3 font-mono">
            🎯 {lang === "id" ? "Distribusi Hasil Profesi Akhir" : "Final Profession Accreditations"}
          </h4>

          {Object.keys(stats.endingDistribution).length === 0 ? (
            <p className="text-xs text-white/40 text-center py-10">
              {lang === "id" ? "Belum ada catatan karir terakreditasi." : "No accredited career paths tracked yet."}
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.endingDistribution).map(([job, count]) => {
                const percentage = Math.round(((count as number) / (stats.totalUsers || 1)) * 100);
                return (
                  <div key={job} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-white/80">
                      <span>{job}</span>
                      <span className="font-mono text-[10px] text-white/50">{count} players ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#0a0b1e] h-3 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(188,19,254,0.5)]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chart 2: Choice Popularity bar chart */}
        <div className="glass-card p-6 space-y-4">
          <h4 className="text-sm font-black uppercase tracking-wider text-[#bc13fe] border-b border-white/10 pb-3 font-mono">
            📊 {lang === "id" ? "Daftar Keputusan Terfavorit" : "Choice Decision Trajectories"}
          </h4>

          {stats.popularChoices.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-10">
              {lang === "id" ? "Belum ada tindakan yang direkam." : "No decision paths logged yet."}
            </p>
          ) : (
            <div className="space-y-4">
              {stats.popularChoices.slice(0, 5).map((item, idx) => {
                const maxCount = Math.max(...stats.popularChoices.map(c => c.count));
                const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-white/80">
                      <span className="truncate max-w-[280px]">{item.choice}</span>
                      <span className="font-mono text-[10px] text-white/50">{item.count} clicks</span>
                    </div>
                    <div className="w-full bg-[#0a0b1e] h-3 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-neon-purple to-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Filterable Telemetry Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h4 className="text-sm font-black uppercase tracking-wider text-white">
            📋 {lang === "id" ? "Arsip Profil Pemain Terdaftar" : "Registered Alternate Lives Archive"}
          </h4>

          {/* Table search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "id" ? "Cari nama / karir..." : "Search name or profession..."}
              className="w-full bg-[#0a0b1e] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-neon-blue font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-neon-blue font-bold uppercase tracking-wider font-mono">
                <th className="p-4">{lang === "id" ? "Nama" : "Name"}</th>
                <th className="p-4">{lang === "id" ? "Profesi Akhir" : "Final Job"}</th>
                <th className="p-4">{lang === "id" ? "Tabungan" : "Wealth"}</th>
                <th className="p-4">{lang === "id" ? "Stres" : "Stress"}</th>
                <th className="p-4">{lang === "id" ? "Progress" : "Progress"}</th>
                <th className="p-4">{lang === "id" ? "Tanggal" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40 font-medium">
                    {lang === "id" ? "Tidak ada rekaman ditemukan." : "No records matching query."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition text-white/80">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#bc13fe]/10 border border-[#bc13fe]/20 rounded-md text-[#bc13fe] font-semibold uppercase tracking-wider text-[10px] font-mono">
                        {u.finalJob}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-400 font-bold font-mono">{formatCurrency(u.money)}</td>
                    <td className="p-4">
                      <span className={`font-bold font-mono ${u.stress >= 75 ? "text-rose-500 animate-pulse" : "text-white/70"}`}>
                        {u.stress} %
                      </span>
                    </td>
                    <td className="p-4 text-neon-blue font-bold font-mono">{u.progress} %</td>
                    <td className="p-4 text-white/40 font-mono">{u.date || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. User Feedback suggestions box */}
      <div className="glass-card p-6 space-y-4">
        <h4 className="text-sm font-black uppercase tracking-wider text-white">
          📬 {lang === "id" ? "Saran & Masukan Pemain" : "Player Suggestions & Feedback"}
        </h4>
        {feedbacks.length === 0 ? (
          <p className="text-xs text-white/40 text-center py-10 font-mono">
            {lang === "id" ? "Belum ada saran atau masukan yang masuk." : "No feedback submissions recorded yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
            {feedbacks.map((f, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-white block">{f.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Job: {f.job}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] text-white/30 font-mono">
                      {new Date(f.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <span
                          key={starIdx}
                          className={`text-[10px] ${
                            starIdx < (f.rating || 5) ? "text-yellow-400" : "text-white/10"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/80 leading-relaxed italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                  "{f.feedback}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
