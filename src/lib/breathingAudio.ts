// Singing bowl / chime tones using Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

type ToneType = "bowl" | "chime" | "soft" | "deep";

const toneConfigs: Record<ToneType, { freq: number; harmonics: number[]; duration: number; gain: number }> = {
  bowl: {
    freq: 396, // Solfeggio frequency — liberation
    harmonics: [1, 2.76, 4.72],
    duration: 2.5,
    gain: 0.15,
  },
  chime: {
    freq: 528, // Solfeggio frequency — transformation
    harmonics: [1, 3, 5],
    duration: 1.8,
    gain: 0.12,
  },
  soft: {
    freq: 285, // Solfeggio frequency — healing
    harmonics: [1, 2],
    duration: 1.5,
    gain: 0.08,
  },
  deep: {
    freq: 174, // Solfeggio frequency — foundation
    harmonics: [1, 2, 3.5],
    duration: 3,
    gain: 0.12,
  },
};

// Phase-to-tone mapping
const phaseTones: Record<string, ToneType> = {
  inhale: "bowl",
  hold1: "soft",
  exhale: "chime",
  hold2: "deep",
};

export function playPhaseTone(phase: string, volume: number = 1) {
  try {
    const toneType = phaseTones[phase];
    if (!toneType) return;
    const config = toneConfigs[toneType];
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(config.gain * volume, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
    masterGain.connect(ctx.destination);

    config.harmonics.forEach((harmonic, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(config.freq * harmonic, now);
      // Slight detuning for richness
      osc.detune.setValueAtTime(Math.random() * 6 - 3, now);

      // Higher harmonics are quieter
      const harmonicGain = 1 / (1 + i * 0.8);
      oscGain.gain.setValueAtTime(harmonicGain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + config.duration);
    });
  } catch (e) {
    // Silently fail — audio is enhancement, not critical
    console.warn("Audio tone failed:", e);
  }
}

export function playCompletionTone(volume: number = 1) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Play a rising arpeggio of bowl tones
    const notes = [396, 528, 639]; // Solfeggio triad
    notes.forEach((freq, i) => {
      const delay = i * 0.4;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now + delay);
      masterGain.gain.linearRampToValueAtTime(0.12 * volume, now + delay + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 3);
      masterGain.connect(ctx.destination);

      [1, 2.76].forEach((harmonic, j) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * harmonic, now + delay);
        oscGain.gain.setValueAtTime(1 / (1 + j), now + delay);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 3);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(now + delay);
        osc.stop(now + delay + 3);
      });
    });
  } catch (e) {
    console.warn("Completion tone failed:", e);
  }
}
