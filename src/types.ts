export interface Impact {
  money: number;
  stress: number;
  progress: number;
}

export interface Choice {
  id: string;
  textId: string; // Key for Bahasa Indonesia
  textEn: string; // Key for English
  type: "safe" | "risky" | "high_reward" | "chaotic";
  impact: Impact;
  nextScenarioId?: string;
  professionTrigger?: string; // Set dynamic profession
}

export interface Scenario {
  id: string;
  titleId: string;
  titleEn: string;
  textId: string;
  textEn: string;
  illustration: string; // Unsplash blurred/dimmed or relevant graphics
  choices: Choice[];
  isRandomEvent?: boolean;
}

export interface PlayerStats {
  money: number;
  stress: number;
  progress: number;
  education: string;
  lifestyle: string;
  vibe: string;
  gender: string;
}

export interface SavedUser {
  id: string;
  name: string;
  date: string;
  gender: string;
  education: string;
  vibe: string;
  decisions: {
    scenarioId: string;
    scenarioTitle: string;
    choiceText: string;
    impact: Impact;
  }[];
  finalJob: string;
  money: number;
  stress: number;
  progress: number;
  rating: number;
  commentary?: string;
}
