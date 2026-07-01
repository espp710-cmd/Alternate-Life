// Sound synthesizers using native Web Audio API (no external file dependencies)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume if suspended (browser security policies)
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Clean modern select click sound
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.13);
}

/**
 * Beautiful ascending sparkling chime for rewards/points
 */
export function playRewardSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const playNote = (freq: number, delay: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + delay);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + delay + duration);

    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.005, now + delay + duration);

    osc.start(now + delay);
    osc.stop(now + delay + duration);
  };

  // Play a beautiful, rapid pentatonic arpeggio (C Major / G Major feel)
  playNote(523.25, 0.0, 0.15);  // C5
  playNote(659.25, 0.06, 0.15); // E5
  playNote(783.99, 0.12, 0.15); // G5
  playNote(1046.50, 0.18, 0.25); // C6
}

/**
 * Dramatic warning synth sweep for crisis/random events
 */
export function playCrisisSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sound 1: Low frequency dramatic drone/sweep
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.type = "sawtooth";
  osc1.frequency.setValueAtTime(140, now);
  osc1.frequency.linearRampToValueAtTime(70, now + 0.45);

  gain1.gain.setValueAtTime(0.15, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  osc1.start(now);
  osc1.stop(now + 0.5);

  // Sound 2: High alert alarm beep
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.type = "square";
  osc2.frequency.setValueAtTime(880, now + 0.1);
  osc2.frequency.setValueAtTime(660, now + 0.25);

  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.08, now + 0.1);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.35);
  gain2.gain.exponentialRampToValueAtTime(0.002, now + 0.4);

  osc2.start(now);
  osc2.stop(now + 0.4);
}
