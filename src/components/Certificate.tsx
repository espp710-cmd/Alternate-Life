import React, { useRef, useState } from "react";
import { Download, Award, Calendar, Fingerprint, ShieldCheck, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";

interface CertificateProps {
  lang: "id" | "en";
  playerName: string;
  finalJob: string;
  money: number;
  stress: number;
  progress: number;
  uniqueId: string;
  date: string;
  commentary: string;
}

export default function Certificate({
  lang,
  playerName,
  finalJob,
  money,
  stress,
  progress,
  uniqueId,
  date,
  commentary
}: CertificateProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatCurrency = (val: number) => {
    if (lang === "id") {
      return `Rp ${(val * 1000).toLocaleString()}`;
    } else {
      return `$ ${val.toLocaleString()}`;
    }
  };

  // Helper to parse percentage or floats from CSS color arguments
  const parsePercentOrFloat = (val: string): number => {
    if (val.endsWith("%")) {
      return parseFloat(val) / 100;
    }
    return parseFloat(val);
  };

  // Convert OKLab color components to standard RGB values
  const oklabToRgb = (L_in: number, a_in: number, b_in: number) => {
    // Convert from OKLab to LMS
    const l_ = L_in + 0.3963377774 * a_in + 0.2158037573 * b_in;
    const m_ = L_in - 0.1055613458 * a_in - 0.0638541728 * b_in;
    const s_ = L_in - 0.0894841775 * a_in - 1.2914855480 * b_in;

    // Cube LMS to get linear LMS
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    // Linear LMS to linear sRGB
    let r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    // Clip linear colors to valid [0, 1] bounds
    r_lin = Math.max(0, Math.min(1, r_lin));
    g_lin = Math.max(0, Math.min(1, g_lin));
    b_lin = Math.max(0, Math.min(1, b_lin));

    // Gamma correction to sRGB
    const gamma = (x: number) => (x > 0.0031308 ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055 : 12.92 * x);

    const r = Math.round(gamma(r_lin) * 255);
    const g = Math.round(gamma(g_lin) * 255);
    const b = Math.round(gamma(b_lin) * 255);

    return { r, g, b };
  };

  // Convert OKLCH cylindrical color components to standard RGB values
  const oklchToRgb = (L: number, C: number, H: number) => {
    const hueRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hueRad);
    const b = C * Math.sin(hueRad);
    return oklabToRgb(L, a, b);
  };

  // Finds oklch(...) and oklab(...) patterns and maps them into safe rgba(...) colors
  const cleanColorString = (val: string): string => {
    if (!val) return val;
    const oklchRegex = /oklch\(([^)]+)\)/g;
    const oklabRegex = /oklab\(([^)]+)\)/g;

    let cleaned = val.replace(oklchRegex, (match, content) => {
      try {
        const parts = content.trim().replace(/,/g, " ").replace(/\//g, " ").split(/\s+/);
        if (parts.length < 3) return match;
        
        const L = parsePercentOrFloat(parts[0]);
        const C = parsePercentOrFloat(parts[1]);
        let H = parseFloat(parts[2]);
        if (parts[2].endsWith("deg")) H = parseFloat(parts[2]);
        else if (parts[2].endsWith("rad")) H = parseFloat(parts[2]) * (180 / Math.PI);
        else if (parts[2].endsWith("grad")) H = parseFloat(parts[2]) * 0.9;
        else if (parts[2].endsWith("turn")) H = parseFloat(parts[2]) * 360;
        
        let alpha = 1;
        if (parts.length >= 4) {
          alpha = parsePercentOrFloat(parts[3]);
        }
        
        const rgb = oklchToRgb(L, C, H);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      } catch (e) {
        console.warn("Failed to parse oklch color:", match, e);
        return "rgba(128, 128, 128, 0.5)";
      }
    });

    cleaned = cleaned.replace(oklabRegex, (match, content) => {
      try {
        const parts = content.trim().replace(/,/g, " ").replace(/\//g, " ").split(/\s+/);
        if (parts.length < 3) return match;
        
        const L = parsePercentOrFloat(parts[0]);
        const a = parsePercentOrFloat(parts[1]);
        const b = parsePercentOrFloat(parts[2]);
        
        let alpha = 1;
        if (parts.length >= 4) {
          alpha = parsePercentOrFloat(parts[3]);
        }
        
        const rgb = oklabToRgb(L, a, b);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      } catch (e) {
        console.warn("Failed to parse oklab color:", match, e);
        return "rgba(128, 128, 128, 0.5)";
      }
    });

    return cleaned;
  };

  const handleDownloadPNG = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);

    const originalGetComputedStyle = window.getComputedStyle;

    try {
      // Intercept window.getComputedStyle to translate modern oklab/oklch colors to standard rgb/rgba
      window.getComputedStyle = function (elt, pseudoElt) {
        const style = originalGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            if (prop === "getPropertyValue") {
              return function (propertyName: string) {
                const innerVal = target.getPropertyValue(propertyName);
                if (typeof innerVal === "string" && (innerVal.includes("oklab") || innerVal.includes("oklch"))) {
                  return cleanColorString(innerVal);
                }
                return innerVal;
              };
            }
            const val = Reflect.get(target, prop);
            if (typeof val === "string") {
              if (val.includes("oklab") || val.includes("oklch")) {
                return cleanColorString(val);
              }
            }
            if (typeof val === "function") {
              return val.bind(target);
            }
            return val;
          }
        });
      };

      const element = printRef.current;
      
      // Use html2canvas to render high DPI PNG
      const canvas = await html2canvas(element, {
        backgroundColor: "#060713",
        scale: 2, // 2x scale for premium sharpness
        useCORS: true,
        logging: false,
        allowTaint: true
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Sertifikat_AlternateLife_${playerName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating PNG certificate:", err);
    } finally {
      // Always restore original window.getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Preview Accredit Panel */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Background grid accent */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6 mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-tighter">
              {lang === "id" ? "🎖️ Sertifikat Formal Kelayakan Karir" : "🎖️ Professional Career Accreditation"}
            </h3>
            <p className="text-xs text-white/50">
              {lang === "id" 
                ? "Sertifikat berstandar formal yang membuktikan validasi keputusan akhir karir simulasi AlternateLife." 
                : "Official high-fidelity certificate seal verifying your simulated life decisions."}
            </p>
          </div>

          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:opacity-90 disabled:opacity-50 text-white font-extrabold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-amber-500/10 hover:scale-[1.03] cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{lang === "id" ? "Sedang Mengunduh..." : "Downloading..."}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>{lang === "id" ? "Unduh PNG" : "Download PNG"}</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Visual Certificate Rendered on screen */}
        <div className="border-4 border-dashed border-[#c5a059]/20 p-2 rounded-2xl bg-black/40">
          <div
            ref={printRef}
            className="bg-gradient-to-b from-[#0a0c16] to-[#04050b] border-2 border-[#c5a059]/40 p-6 md:p-12 rounded-xl text-center relative space-y-6 overflow-hidden"
            style={{ minHeight: "580px" }}
          >
            {/* Corner Ornaments */}
            <div className="corner-ornament corner-tl" style={{ position: "absolute", width: "40px", height: "40px", border: "2px solid #c5a059", top: "15px", left: "15px", borderRight: "none", borderBottom: "none" }} />
            <div className="corner-ornament corner-tr" style={{ position: "absolute", width: "40px", height: "40px", border: "2px solid #c5a059", top: "15px", right: "15px", borderLeft: "none", borderBottom: "none" }} />
            <div className="corner-ornament corner-bl" style={{ position: "absolute", width: "40px", height: "40px", border: "2px solid #c5a059", bottom: "15px", left: "15px", borderRight: "none", borderTop: "none" }} />
            <div className="corner-ornament corner-br" style={{ position: "absolute", width: "40px", height: "40px", border: "2px solid #c5a059", bottom: "15px", right: "15px", borderLeft: "none", borderTop: "none" }} />

            {/* Seal Watermark background */}
            <div className="seal-watermark" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "280px", color: "rgba(197, 160, 89, 0.03)", fontWeight: "bold", zIndex: 0, pointerEvents: "none" }}>
              ★
            </div>

            <div className="header-crown text-[#c5a059] text-xs font-black tracking-[0.3em] uppercase">
              REPUBLIK ALTERNATIF • SIMULASI TAKDIR MANDIRI
            </div>

            <div className="header-org text-gray-400 text-xs font-bold tracking-[0.15em] uppercase">
              DEPARTEMEN AKREDITASI MULTIVERSE & KARIR DIGITAL
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sertifikat Kelayakan
            </h1>

            <div className="text-xs text-gray-400 max-w-md mx-auto italic">
              {lang === "id"
                ? "Dengan ini secara resmi menganugerahkan pengakuan sertifikasi karir digital simulasi kepada:"
                : "This officially certifies and documents the verified simulation performance of:"}
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-[#c5a059] font-extrabold tracking-widest uppercase">
                {lang === "id" ? "Nama Penerima" : "Accredited Recipient"}
              </div>
              <div className="text-3xl md:text-5xl font-serif font-bold text-white border-b border-[#c5a059]/40 pb-2 inline-block px-8 max-w-full truncate">
                {playerName}
              </div>
            </div>

            <div className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
              {lang === "id"
                ? "Telah menyelesaikan simulasi AlternateLife dan mencapai garis akhir dengan kualifikasi profesional terakreditasi sebagai:"
                : "Has successfully completed the AlternateLife reality simulation and graduated with the accredited profession of:"}
            </div>

            <div className="job-badge" style={{ background: "linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.03) 100%)", border: "2px solid #c5a059", padding: "12px 32px", borderRadius: "4px", display: "inline-block", fontWeight: 800, fontSize: "22px", color: "#ffffff", letterSpacing: "1px", textTransform: "uppercase" }}>
              🏆 {finalJob} 🏆
            </div>

            {/* Metrics display */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4">
              <div className="metric-box" style={{ backgroundColor: "rgba(6, 7, 19, 0.6)", border: "1px solid rgba(197, 160, 89, 0.2)", padding: "12px", borderRadius: "6px" }}>
                <div className="metric-val text-emerald-400 font-bold">{formatCurrency(money)}</div>
                <div className="metric-lbl text-[10px] text-gray-400 uppercase tracking-wider mt-1">{lang === "id" ? "Tabungan" : "Net Worth"}</div>
              </div>
              <div className="metric-box" style={{ backgroundColor: "rgba(6, 7, 19, 0.6)", border: "1px solid rgba(197, 160, 89, 0.2)", padding: "12px", borderRadius: "6px" }}>
                <div className="metric-val text-rose-400 font-bold">{stress} %</div>
                <div className="metric-lbl text-[10px] text-gray-400 uppercase tracking-wider mt-1">{lang === "id" ? "Stres Akhir" : "Final Stress"}</div>
              </div>
              <div className="metric-box" style={{ backgroundColor: "rgba(6, 7, 19, 0.6)", border: "1px solid rgba(197, 160, 89, 0.2)", padding: "12px", borderRadius: "6px" }}>
                <div className="metric-val text-neon-blue font-bold">{progress} %</div>
                <div className="metric-lbl text-[10px] text-gray-400 uppercase tracking-wider mt-1">{lang === "id" ? "Fase Hidup" : "Timeline"}</div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="footer-grid" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "680px", margin: "45px auto 0 auto", borderTop: "1px solid rgba(197, 160, 89, 0.2)", paddingTop: "25px" }}>
              <div className="date-box" style={{ textAlign: "left" }}>
                <div className="date-lbl text-[9px] text-gray-400 uppercase tracking-wider">
                  {lang === "id" ? "Tanggal Penerbitan" : "Date of Calibration"}
                </div>
                <div className="date-val text-xs text-white font-mono">{date}</div>
              </div>

              {/* Holographic Seal */}
              <div className="seal" style={{ width: "72px", height: "72px", border: "2px dashed #c5a059", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5a059", fontWeight: 900, fontSize: "10px", backgroundColor: "rgba(197, 160, 89, 0.05)" }}>
                <div className="flex flex-col items-center">
                  <span className="text-[14px]">★</span>
                  <span className="scale-75 text-[8px] font-black tracking-widest">OFFICIAL</span>
                  <span className="text-[14px]">★</span>
                </div>
              </div>

              <div className="sig-box" style={{ textAlign: "right" }}>
                <div className="sig-title text-[9px] text-gray-400 uppercase tracking-wider mb-1">
                  {lang === "id" ? "Tanda Tangan" : "Auth Signature"}
                </div>
                <div className="sig-line font-serif italic text-lg text-white border-b border-[#c5a059]/30 pb-0.5 mb-1 inline-block" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Dinar Maulidan
                </div>
                <div className="text-[9px] text-gray-500">AlternateLife Lead Architect</div>
              </div>
            </div>

            {/* Unique Accreditation Hash */}
            <div className="pt-2 text-center text-[10px] text-gray-500 font-mono flex items-center justify-center gap-1">
              <Fingerprint className="w-3 h-3 text-[#c5a059]" />
              <span>ACCREDITATION ID: {uniqueId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Separate AI Commentary Box */}
      {commentary && (
        <div className="glass-card p-6 md:p-8 space-y-4 max-w-4xl mx-auto border border-neon-purple/20 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc13fe11] blur-2xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-extrabold text-white uppercase tracking-tighter flex items-center gap-2">
            <span>🧠</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
              {lang === "id" ? "Analisis Kepribadian AI" : "AI Persona Analysis"}
            </span>
          </h3>
          <p className="text-xs text-white/50 leading-relaxed">
            {lang === "id" 
              ? "Ulasan kecerdasan buatan terhadap alur keputusan takdir karir yang telah Anda jalani selama simulasi." 
              : "Generative intelligence commentary mapping your dynamic trajectory of chosen paths."}
          </p>
          <div className="border-l-4 border-neon-purple pl-4 py-3 bg-black/40 rounded-r-xl border border-white/5 shadow-inner">
            <p className="text-sm text-white/90 leading-relaxed italic font-medium">
              "{commentary}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
