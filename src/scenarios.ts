import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "s1_setup",
    titleId: "Awal Perjalanan",
    titleEn: "The Beginning",
    textId: "Kamu baru saja lulus dan berdiri di persimpangan jalan kehidupan. Masa depan membentang di depanmu, berkilau dengan peluang. Bagaimana kamu ingin memulai lembaran hidup barumu?",
    textEn: "You have just graduated and stand at the crossroads of life. The future stretches before you, shimmering with possibilities. How do you want to start this new chapter?",
    illustration: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "s1_c1",
        textId: "💼 Lamar pekerjaan korporat stabil di MegaCorp",
        textEn: "💼 Apply for a stable corporate job at MegaCorp",
        type: "safe",
        impact: { money: 4000, stress: 15, progress: 10 },
        nextScenarioId: "s2_first_step",
        professionTrigger: "Office Worker"
      },
      {
        id: "s1_c2",
        textId: "💻 Bergabung dengan startup AI berisiko tinggi sebagai programmer magang",
        textEn: "💻 Join a high-risk AI startup as an apprentice programmer",
        type: "risky",
        impact: { money: 2500, stress: 30, progress: 25 },
        nextScenarioId: "s2_first_step",
        professionTrigger: "AI Engineer"
      },
      {
        id: "s1_c3",
        textId: "🎨 Mulai karier freelancer independen & content creator dari kamar",
        textEn: "🎨 Launch an independent freelancing & content creation career from home",
        type: "high_reward",
        impact: { money: 1500, stress: 20, progress: 15 },
        nextScenarioId: "s2_first_step",
        professionTrigger: "Freelancer"
      },
      {
        id: "s1_c4",
        textId: "🚜 Kembali ke desa, membangun usaha tani organik modern",
        textEn: "🚜 Return to the village and build a modern organic farming business",
        type: "chaotic",
        impact: { money: 1000, stress: -10, progress: 5 },
        nextScenarioId: "s2_first_step",
        professionTrigger: "Farmer"
      }
    ]
  },
  {
    id: "s2_first_step",
    titleId: "Langkah Pertama",
    titleEn: "First Steps",
    textId: "Bulan-bulan berlalu dan pekerjaan barumu mulai terasa nyata. Atasanmu mendadak memintamu memimpin proyek besar yang sangat mendesak malam ini, atau kamu bisa menolaknya demi waktu pribadi. Apa keputusanmu?",
    textEn: "Months pass and your new work begins to feel real. Your manager suddenly asks you to lead a high-priority emergency project tonight, or you can decline to protect your personal time. What is your choice?",
    illustration: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "s2_c1",
        textId: "☕ Ambil tantangan! Lembur semalaman demi promosi cepat",
        textEn: "☕ Take the challenge! Pull an all-nighter for a rapid promotion",
        type: "high_reward",
        impact: { money: 8000, stress: 35, progress: 30 },
        nextScenarioId: "s3_dilemma"
      },
      {
        id: "s2_c2",
        textId: "⚖️ Tolak dengan sopan. Keseimbangan hidup (work-life balance) lebih penting",
        textEn: "⚖️ Decline politely. Work-life balance is more important",
        type: "safe",
        impact: { money: 0, stress: -20, progress: 5 },
        nextScenarioId: "s3_dilemma"
      },
      {
        id: "s2_c3",
        textId: "🤖 Delegasikan pekerjaan ini ke AI secara rahasia untuk jalan pintas",
        textEn: "🤖 Secretly delegate the entire project to an AI for a quick shortcut",
        type: "chaotic",
        impact: { money: 4000, stress: -5, progress: 15 },
        nextScenarioId: "s3_dilemma"
      }
    ]
  },
  {
    id: "s3_dilemma",
    titleId: "Dilema Karir",
    titleEn: "Career Dilemma",
    textId: "Tiba-tiba, seorang mantan rekan kerja datang menawarkan peluang kolaborasi membuat proyek sampingan (side hustle) revolusioner berbasis Web3/AI. Namun, ini membutuhkan modal tabunganmu dan komitmen waktu ekstra.",
    textEn: "Suddenly, a former colleague approaches you to co-found a revolutionary side hustle based on Web3 and AI. However, this requires your hard-earned savings and extra hours.",
    illustration: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "s3_c1",
        textId: "💰 All-In! Investasikan sebagian besar uangmu & jadilah Co-Founder",
        textEn: "💰 Go All-In! Invest most of your savings & become a Co-Founder",
        type: "risky",
        impact: { money: -5000, stress: 25, progress: 40 },
        nextScenarioId: "s4_the_pivot",
        professionTrigger: "Startup Founder"
      },
      {
        id: "s3_c2",
        textId: "🔒 Tolak tawaran tersebut, fokus tabung uang di instrumen aman",
        textEn: "🔒 Reject the offer and focus on saving in low-risk instruments",
        type: "safe",
        impact: { money: 3000, stress: -10, progress: 10 },
        nextScenarioId: "s4_the_pivot"
      },
      {
        id: "s3_c3",
        textId: "🎰 Taruh semua uang di koin kripto meme karena iseng",
        textEn: "🎰 Yolo your entire net worth into a meme coin just for fun",
        type: "chaotic",
        impact: { money: -3000, stress: 45, progress: 0 },
        nextScenarioId: "s4_the_pivot",
        professionTrigger: "Crypto Trader"
      }
    ]
  },
  {
    id: "s4_the_pivot",
    titleId: "Titik Balik",
    titleEn: "The Pivot Point",
    textId: "Tekanan kerja atau kegagalan investasi mulai menguras energimu. Kamu merasa berada di ambang kejenuhan (burnout). Apa tindakan pemulihan yang kamu pilih?",
    textEn: "Work pressure or investment fluctuations are draining your energy. You feel yourself standing on the edge of burnout. What healing path do you choose?",
    illustration: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "s4_c1",
        textId: "🧘 Ambil cuti panjang berbayar untuk meditasi & detoks digital",
        textEn: "🧘 Take a paid sabbatical for meditation & digital detox",
        type: "safe",
        impact: { money: -1500, stress: -35, progress: 5 },
        nextScenarioId: "s5_crisis",
        professionTrigger: "Burnout Survivor"
      },
      {
        id: "s4_c2",
        textId: "🍺 Abaikan rasa lelah, teruskan bekerja dengan asupan kafein dobel",
        textEn: "🍺 Ignore the exhaustion, push through with double caffeine intake",
        type: "risky",
        impact: { money: 6000, stress: 30, progress: 20 },
        nextScenarioId: "s5_crisis",
        professionTrigger: "Overthinking Specialist"
      },
      {
        id: "s4_c3",
        textId: "🎒 Resign mendadak dan mulailah keliling dunia sebagai Digital Nomad",
        textEn: "🎒 Quit instantly and travel the world as a Digital Nomad",
        type: "high_reward",
        impact: { money: -4000, stress: -20, progress: 15 },
        nextScenarioId: "s5_crisis",
        professionTrigger: "Digital Nomad"
      }
    ]
  },
  {
    id: "s5_crisis",
    titleId: "Ujian Terakhir",
    titleEn: "The Ultimate Test",
    textId: "Krisis ekonomi global melanda! Sektor industri berguncang keras. Perusahaanmu mengumumkan restrukturisasi besar-besaran, atau bisnismu mengalami kemacetan rantai pasok. Bagaimana kamu menghadapinya?",
    textEn: "A global financial crisis hits! Industries are shaking to their core. Your employer announces massive layoffs, or your venture experiences supply chain shock. How do you respond?",
    illustration: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "s5_c1",
        textId: "🤝 Cari aliansi! Lakukan kolaborasi bisnis & perkuat networking",
        textEn: "🤝 Form alliances! Collaborate with competitors & expand your network",
        type: "safe",
        impact: { money: 2000, stress: 10, progress: 25 },
        nextScenarioId: "s6_summit"
      },
      {
        id: "s5_c2",
        textId: "🚀 Pivot radikal! Luncurkan produk baru yang memanfaatkan kecerdasan buatan",
        textEn: "🚀 Radical pivot! Launch a fully automated AI service to cut all costs",
        type: "high_reward",
        impact: { money: 12000, stress: 25, progress: 35 },
        nextScenarioId: "s6_summit"
      },
      {
        id: "s5_c3",
        textId: "🛌 Menyerah pada keadaan, tidur seharian sambil berharap keajaiban",
        textEn: "🛌 Give up entirely, sleep all day and hope for a miracle",
        type: "chaotic",
        impact: { money: -2000, stress: -15, progress: -10 },
        nextScenarioId: "s6_summit",
        professionTrigger: "Professional Procrastinator"
      }
    ]
  },
  {
    id: "s6_summit",
    titleId: "Puncak Pencapaian",
    titleEn: "The Summit",
    textId: "Kamu telah sampai pada keputusan akhir dalam simulasi kehidupan ini. Sebuah keputusan investasi mega-proyek jangka panjang disodorkan ke mejamu. Ini akan menentukan warisan (legacy) hidupmu.",
    textEn: "You have arrived at the ultimate milestone of this life simulation. A massive long-term legacy investment is presented on your desk. This will cement your legacy.",
    illustration: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "s6_c1",
        textId: "🌟 Donasikan kekayaanmu untuk membangun akademi riset AI gratis",
        textEn: "🌟 Donate your wealth to build a free AI & tech research academy",
        type: "high_reward",
        impact: { money: -8000, stress: -20, progress: 50 },
        professionTrigger: "Indie Hacker"
      },
      {
        id: "s6_c2",
        textId: "🏢 Investasikan kembali untuk mendirikan konglomerasi multinasional",
        textEn: "🏢 Reinvest to establish a global multi-industry conglomerate",
        type: "risky",
        impact: { money: 25000, stress: 30, progress: 40 },
        professionTrigger: "Investor"
      },
      {
        id: "s6_c3",
        textId: "🏖️ Jual semua aset, cairkan dana, dan pensiun dini di Bali",
        textEn: "🏖️ Liquidate all assets, cash out, and retire early in Bali",
        type: "safe",
        impact: { money: 15000, stress: -40, progress: 10 }
      }
    ]
  }
];

export const RANDOM_EVENTS: Scenario[] = [
  {
    id: "re_scam",
    titleId: "🚨 Skema Investasi Bodong!",
    titleEn: "🚨 Fake Investment Scam!",
    textId: "Seseorang yang mengaku pakar finansial membujukmu berinvestasi di robot trading emas otomatis. Kamu tergiur keuntungan instan dan kehilangan tabungan secara tragis!",
    textEn: "An online 'guru' sweet-talks you into investing in an automated gold trading bot. You fall for the fast profit promise and lose hard-earned money!",
    illustration: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "re_scam_c1",
        textId: "💸 Ikhlaskan saja, jadikan ini pelajaran hidup berharga",
        textEn: "💸 Let it go, accept it as a costly but valuable life lesson",
        type: "safe",
        impact: { money: -3000, stress: 15, progress: 5 }
      },
      {
        id: "re_scam_c2",
        textId: "🕵️ Sewa detektif siber & hacker bayaran untuk melacak sang pelaku",
        textEn: "🕵️ Hire a cyber investigator & private hacker to track them down",
        type: "risky",
        impact: { money: -1500, stress: 25, progress: 10 }
      }
    ]
  },
  {
    id: "re_opportunity",
    titleId: "🚀 Kesempatan Emas Mendadak!",
    titleEn: "🚀 Unexpected Golden Opportunity!",
    textId: "Sebuah agensi digital global menawarimu posisi Konsultan Ahli paruh waktu untuk mengisi webinar internasional malam ini. Bayarannya menggiurkan namun persiapannya sangat mepet!",
    textEn: "A global digital agency suddenly offers you a part-time Guest Consultant role for an international webinar tonight. Huge payout but preparation time is extremely short!",
    illustration: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "re_opp_c1",
        textId: "🎤 Hajar saja! Presentasikan pengetahuanmu secara spontan",
        textEn: "🎤 Just do it! Freely present your knowledge spontaneously",
        type: "high_reward",
        impact: { money: 5000, stress: 20, progress: 15 }
      },
      {
        id: "re_opp_c2",
        textId: "💤 Tolak tawaran, tidur lebih awal untuk menjaga kesehatan",
        textEn: "💤 Reject the offer and sleep early to preserve wellness",
        type: "safe",
        impact: { money: 0, stress: -15, progress: 2 }
      }
    ]
  },
  {
    id: "re_burnout",
    titleId: "⚡ Krisis Mental & Fisik (Burnout)!",
    titleEn: "⚡ Severe Burnout Crisis!",
    textId: "Tubuhmu berontak! Kamu jatuh sakit karena kelelahan kronis bekerja tanpa henti. Atasan dan dokter mendesakmu beristirahat total.",
    textEn: "Your body screams! You collapse from chronic overwork and stress. Your doctor and team urge you to take immediate absolute rest.",
    illustration: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: "re_burn_c1",
        textId: "🛏️ Istirahat total (Bed Rest) & habiskan uang untuk biaya berobat",
        textEn: "🛏️ Take complete bed rest & pay for immediate high-quality medical care",
        type: "safe",
        impact: { money: -2000, stress: -30, progress: -5 }
      },
      {
        id: "re_burn_c2",
        textId: "💊 Minum obat penenang & tetap kerja diam-diam dari rumah sakit",
        textEn: "💊 Pop painkillers & secretly code/work from the hospital bed",
        type: "risky",
        impact: { money: 1000, stress: 30, progress: 15 }
      }
    ]
  }
];
