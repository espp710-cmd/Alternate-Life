import React, { useState } from "react";
import { BookOpen, User, Shield, Briefcase, Mail, Send, CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";

interface ExtraPagesProps {
  currentTab: string;
  lang: "id" | "en";
  onBack: () => void;
}

export default function ExtraPages({ currentTab, lang, onBack }: ExtraPagesProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setFormSubmitted(false);
      }, 3000);
    }
  };

  let childContent = null;

  if (currentTab === "guide") {
    childContent = (
      <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase mb-6 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-neon-blue" />
          {lang === "id" ? "📖 Panduan Bermain" : "📖 Game Guide"}
        </h2>
        <div className="space-y-6 text-white/70">
          <div>
            <h3 className="text-xl font-bold text-neon-blue mb-2 font-mono">
              {lang === "id" ? "1. Memahami Statistik Utama" : "1. Understanding Core Stats"}
            </h3>
            <p className="mb-3">
              {lang === "id" 
                ? "Kehidupan di AlternateLife diatur oleh tiga indikator utama:" 
                : "Your existence in AlternateLife is guided by three vital stats:"}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-emerald-400">{lang === "id" ? "Uang 💰" : "Money 💰"}</strong>:{" "}
                {lang === "id" 
                  ? "Kekayaan finansialmu. Dibutuhkan untuk bertahan hidup dan modal investasi." 
                  : "Your total bank roll. Essential for major investments and survival."}
              </li>
              <li>
                <strong className="text-rose-400">{lang === "id" ? "Stres ⚡" : "Stress ⚡"}</strong>:{" "}
                {lang === "id" 
                  ? "Tingkat tekanan batin. Jika melampaui 80%, kamu berisiko tinggi mengalami burnout!" 
                  : "Your psychological toll. Exceeding 80% triggers heavy burnout crises!"}
              </li>
              <li>
                <strong className="text-cyan-400">{lang === "id" ? "Progress 📊" : "Progress 📊"}</strong>:{" "}
                {lang === "id" 
                  ? "Kemajuan karir dan reputasi dalam simulasi kehidupan." 
                  : "Your professional reputation, capability growth, and simulator timeline."}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-neon-blue mb-2 font-mono">
              {lang === "id" ? "2. Tipe Keputusan" : "2. Choice Modifiers"}
            </h3>
            <p className="mb-3">
              {lang === "id" 
                ? "Setiap pilihan diwarnai berdasarkan tipe risiko dan keuntungannya:" 
                : "Every choice corresponds to a distinct path of rewards and consequences:"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-white/10 bg-black/40 p-4 rounded-xl hover:border-emerald-500/30 transition-all duration-300">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded mb-2">
                  {lang === "id" ? "Aman (Safe)" : "Safe"}
                </span>
                <p className="text-sm text-white/70">
                  {lang === "id" 
                    ? "Mengurangi stres, stabil, namun progressnya cenderung lebih lambat." 
                    : "Lowers your stress, highly stable, but yield slower progress."}
                </p>
              </div>
              <div className="border border-white/10 bg-black/40 p-4 rounded-xl hover:border-[#00f2ff]/30 transition-all duration-300">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-[#00f2ff]/20 text-[#00f2ff] rounded mb-2 font-mono">
                  {lang === "id" ? "Berisiko (Risky)" : "Risky"}
                </span>
                <p className="text-sm text-white/70">
                  {lang === "id" 
                    ? "Peluang karir cepat dengan konsekuensi fluktuatif atau stres bertambah." 
                    : "Fast tracks growth, but carries stress multipliers or penalty slips."}
                </p>
              </div>
              <div className="border border-white/10 bg-black/40 p-4 rounded-xl hover:border-[#bc13fe]/30 transition-all duration-300">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-[#bc13fe]/20 text-[#bc13fe] rounded mb-2 font-mono">
                  {lang === "id" ? "Keuntungan Tinggi (High Reward)" : "High Reward"}
                </span>
                <p className="text-sm text-white/70">
                  {lang === "id" 
                    ? "Kemungkinan melompatkan kekayaan dalam jumlah besar, tapi stres melesat." 
                    : "Catapults stats and unlocks premium titles with intense mental tax."}
                </p>
              </div>
              <div className="border border-white/10 bg-black/40 p-4 rounded-xl hover:border-pink-500/30 transition-all duration-300">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-pink-500/20 text-pink-400 rounded mb-2">
                  {lang === "id" ? "Kacau/Lucu (Chaotic/Funny)" : "Chaotic/Funny"}
                </span>
                <p className="text-sm text-white/70">
                  {lang === "id" 
                    ? "Keputusan tak terduga yang membuka karir unik seperti Crypto Trader atau Procrastinator." 
                    : "Wildcards that unlock hybrid careers and humorous life endings."}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-neon-blue mb-2 font-mono">
              {lang === "id" ? "3. Sistem Kejadian Acak & Akhir Hidup" : "3. Random Crises & Final Outcome"}
            </h3>
            <p>
              {lang === "id" 
                ? "Setiap saat krisis tak terduga dapat terjadi, bergantung pada tingkat stres dan saldo uangmu. Di akhir simulasi, kamu akan mendapatkan akreditasi profesi berdasarkan perolehan keputusanmu." 
                : "At any moment, high stress or low cash can trigger emergency events. Your dynamic choices calibrate your final accredited career certificate."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === "about") {
    childContent = (
      <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase mb-6 flex items-center justify-center gap-3">
          <User className="w-8 h-8 text-neon-purple" />
          {lang === "id" ? "👤 Tentang Kami" : "👤 About Us"}
        </h2>
        <div className="max-w-2xl mx-auto space-y-6 text-white/70">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#bc13fe] to-[#00f2ff] rounded-full blur-md opacity-70"></div>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
              alt="Dinar Maulidan" 
              className="relative w-32 h-32 rounded-full border-2 border-neon-blue object-cover mx-auto"
            />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Dinar Maulidan</h3>
          <p className="text-neon-blue font-semibold font-mono">{lang === "id" ? "Kreator & Pengembang Utama" : "Creator & Lead Developer"}</p>
          <p className="leading-relaxed">
            {lang === "id" 
              ? "AlternateLife adalah simulator karir modern yang dirancang untuk membantumu mengeksplorasi berbagai persimpangan keputusan hidup secara interaktif. Game ini memadukan visual retro-modern, alur bercabang cerdas, serta teknologi AI untuk mengulas perjalanan hidupmu."
              : "AlternateLife is a modern high-fidelity career simulator architected to guide you through complex intersections of life choices. This experience blends cyber retro-modern graphics, rich branching decisions, and smart generative feedback."}
          </p>
          <div className="pt-2">
            <a 
              href="https://instagram.com/dinar_maulidan" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white font-extrabold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-purple-500/20 hover:scale-105"
            >
              <span>Follow Dinar on Instagram</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === "privacy") {
    childContent = (
      <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          {lang === "id" ? "🔒 Kebijakan Privasi" : "🔒 Privacy Policy"}
        </h2>
        <div className="space-y-4 text-white/70 text-sm leading-relaxed">
          <p className="text-white/40 font-mono">
            {lang === "id" ? "Terakhir Diperbarui: Juni 2026" : "Last Updated: June 2026"}
          </p>
          <p>
            {lang === "id" 
              ? "Di AlternateLife, kami menghargai data privasi para peserta simulasi. Kebijakan ini menjelaskan bagaimana data gameplay kamu diamankan dalam pangkalan data kami."
              : "At AlternateLife, we deeply respect the privacy of our simulation participants. This policy outlines how we handle, store, and utilize database records safely within our Upstash Redis stack."}
          </p>
          
          <h3 className="text-lg font-bold text-neon-blue font-mono mt-6">
            {lang === "id" ? "1. Informasi yang Kami Kumpulkan" : "1. Information We Collect"}
          </h3>
          <p>
            {lang === "id" 
              ? "Kami mengumpulkan informasi nama panggilan (nickname), hasil statistik akhir hidup, profils keputusan pilihan, serta logs telemetri untuk menyajikan papan peringkat."
              : "We only collect gameplay data you explicitly provide during character creation, including your chosen Nickname, pathway selections, end-game stats, and transaction logs."}
          </p>

          <h3 className="text-lg font-bold text-neon-blue font-mono mt-6">
            {lang === "id" ? "2. Penggunaan Data" : "2. How We Use This Data"}
          </h3>
          <p>
            {lang === "id" 
              ? "Penyimpanan dilakukan sepenuhnya secara cloud guna menggerakkan dashboard analisis statistik. Kami tidak menjual data ini ke pihak periklanan manapun."
              : "All records are securely stored on our cloud database to feed the analytics dashboard (for displaying top careers and dynamic ranking charts). We do not monetize or sell records to marketing platforms."}
          </p>

          <h3 className="text-lg font-bold text-neon-blue font-mono mt-6">
            {lang === "id" ? "3. Kontak Kami" : "3. Contacting Us"}
          </h3>
          <p>
            {lang === "id" 
              ? "Apabila ada pertanyaan lebih lanjut tentang pengelolaan data, silakan layangkan pesan melalui kontak pengembang resmi kami."
              : "For direct technical queries regarding simulation clearing or server ledger adjustments, feel free to submit feedback via the Contact form."}
          </p>
        </div>
      </div>
    );
  }

  if (currentTab === "services") {
    childContent = (
      <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase mb-6 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-neon-blue" />
          {lang === "id" ? "💼 Layanan Kami" : "💼 Services"}
        </h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          {lang === "id" 
            ? "Butuh aplikasi kustom interaktif, situs startup berkelas premium, atau landing page dengan performa tinggi seperti AlternateLife? Dinar Maulidan menawarkan jasa pengembangan profesional:"
            : "Looking for customized high-fidelity interactive web apps, stunning startup landing pages, or high-performance simulations like AlternateLife? Dinar Maulidan offers premier development services:"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-white/10 bg-black/40 p-6 rounded-xl hover:border-[#bc13fe]/40 hover:glow-purple transition duration-300">
            <h3 className="text-xl font-bold text-white mb-2 font-mono">🌐 Web Development</h3>
            <p className="text-white/50 text-sm">
              {lang === "id" 
                ? "Pembuatan website full-stack tangguh menggunakan React, Next.js, Express, dan Tailwind CSS." 
                : "Full-stack web application development using high-speed React, Next.js, Express, and Tailwind CSS."}
            </p>
          </div>
          <div className="border border-white/10 bg-black/40 p-6 rounded-xl hover:border-[#00f2ff]/40 hover:glow-blue transition duration-300">
            <h3 className="text-xl font-bold text-white mb-2 font-mono">🎨 UI/UX Design</h3>
            <p className="text-white/50 text-sm">
              {lang === "id" 
                ? "Desain interaktif bertema modern, neon retro, minimalis, lengkap dengan transisi ultra halus." 
                : "Fusing clean futuristic modernism with glowing cyber details, premium glassmorphic layouts, and smooth animations."}
            </p>
          </div>
          <div className="border border-white/10 bg-black/40 p-6 rounded-xl hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition duration-300">
            <h3 className="text-xl font-bold text-white mb-2 font-mono">🕹️ Interactive Apps</h3>
            <p className="text-white/50 text-sm">
              {lang === "id" 
                ? "Simulasi visual yang imersif, kalkulator finansial kustom, hingga portal game pendidikan terpadu." 
                : "Immersive virtual gamified dashboards, interactive tools, and customizable assessment engines with rich analytics."}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#bc13fe]/10 to-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-xl p-6 text-center">
          <h4 className="text-lg font-bold text-white mb-3">
            {lang === "id" ? "Tertarik Berkolaborasi?" : "Interested in Collaborating?"}
          </h4>
          <p className="text-sm text-white/70 mb-4 max-w-xl mx-auto">
            {lang === "id" 
              ? "Hubungi saya langsung untuk mendiskusikan visi proyek hebatmu berikutnya. Saya siap membantu merealisasikannya."
              : "Let's shape your business idea into a living, breathing software reality. Direct message me via Instagram for an instant project review."}
          </p>
          <a 
            href="https://instagram.com/dinar_maulidan" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white font-extrabold py-3 px-6 rounded-xl transition duration-300 hover:scale-105"
          >
            <span>DM Dinar Maulidan</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (currentTab === "contact") {
    childContent = (
      <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase mb-6 flex items-center justify-center gap-3">
          <Mail className="w-8 h-8 text-neon-blue" />
          {lang === "id" ? "📬 Kontak Hubungi" : "📬 Contact Us"}
        </h2>
        <p className="text-white/70 text-center mb-6 text-sm">
          {lang === "id" 
            ? "Punya saran game, laporan bug, atau proposal kerja sama? Kirimkan pesanmu di bawah ini atau DM saya di Instagram."
            : "Have a brilliant simulation idea, feedback, or business proposal? Drop your details below or message me on Instagram."}
        </p>

        {formSubmitted ? (
          <div className="text-center p-8 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl space-y-3 animate-fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">{lang === "id" ? "Pesan Terkirim!" : "Message Transmitted!"}</h4>
            <p className="text-sm text-white/60">
              {lang === "id" 
                ? "Pesanmu telah masuk ke pusat kendali. Terima kasih banyak!" 
                : "Your thoughts have successfully crossed the gateway. Dinar will reach out shortly."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neon-blue mb-1">
                {lang === "id" ? "Nama Lengkap" : "Full Name"}
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-[#0a0b1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-mono text-sm"
                placeholder={lang === "id" ? "Contoh: Alex Wijaya" : "e.g. Alex Henderson"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neon-blue mb-1">
                {lang === "id" ? "Alamat Email" : "Email Address"}
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-[#0a0b1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-mono text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neon-blue mb-1">
                {lang === "id" ? "Isi Pesan" : "Your Message"}
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-[#0a0b1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue text-sm"
                placeholder={lang === "id" ? "Tulis pesanmu di sini..." : "Write your cosmic thoughts here..."}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white font-extrabold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>{lang === "id" ? "Kirim Pesan" : "Transmit Message"}</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 mb-2">{lang === "id" ? "Atau hubungi via akun sosial resmi:" : "Or connect via official socials:"}</p>
          <a 
            href="https://instagram.com/dinar_maulidan" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 text-xs text-neon-blue font-bold hover:underline"
          >
            <span>@dinar_maulidan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upper Back Navigation Bar */}
      <div className="flex justify-between items-center bg-black/40 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue hover:border-neon-purple text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:scale-[1.03]"
        >
          <ArrowLeft className="w-4 h-4 text-neon-blue animate-pulse" />
          <span>{lang === "id" ? "👈 Kembali ke Game / Utama" : "👈 Back to Game / Home"}</span>
        </button>
        <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest hidden sm:inline-block">
          AlternateLife Auxiliary Panel
        </span>
      </div>

      {childContent}

      {/* Bottom Back Navigation Bar */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple hover:border-neon-blue text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(188,19,254,0.2)] hover:scale-105"
        >
          <ArrowLeft className="w-4.5 h-4.5 text-neon-purple animate-pulse" />
          <span>{lang === "id" ? "Kembali ke Simulasi Utama" : "Return to Main Simulation"}</span>
        </button>
      </div>
    </div>
  );
}
