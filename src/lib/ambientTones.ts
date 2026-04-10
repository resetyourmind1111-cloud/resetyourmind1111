// Ambient healing tones using Web Audio API
// Generates a layered drone of Solfeggio frequencies for meditation

let audioCtx: AudioContext | null = null;
let activeNodes: { oscs: OscillatorNode[]; gains: GainNode[]; master: GainNode } | null = null;

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Solfeggio frequencies layered for a warm, releasing drone
const LAYERS = [
  { freq: 396, gain: 0.08, detune: 0 },     // Liberation
  { freq: 285, gain: 0.06, detune: 3 },      // Healing
  { freq: 174, gain: 0.05, detune: -2 },     // Foundation
  { freq: 528, gain: 0.04, detune: 1 },      // Transformation (subtle)
];

export function startAmbientTone(volume: number = 1): void {
  if (activeNodes) return; // already playing

  const ctx = getCtx();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(volume, now + 3); // 3s fade-in
  master.connect(ctx.destination);

  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  LAYERS.forEach((layer) => {
    // Main tone
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(layer.freq, now);
    osc.detune.setValueAtTime(layer.detune, now);
    g.gain.setValueAtTime(layer.gain, now);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    oscs.push(osc);
    gains.push(g);

    // Subtle beating pair (slightly detuned for shimmer)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(layer.freq + 1.5, now); // binaural-like beat
    osc2.detune.setValueAtTime(layer.detune + 5, now);
    g2.gain.setValueAtTime(layer.gain * 0.5, now);
    osc2.connect(g2);
    g2.connect(master);
    osc2.start(now);
    oscs.push(osc2);
    gains.push(g2);
  });

  activeNodes = { oscs, gains, master };
}

export function stopAmbientTone(): void {
  if (!activeNodes || !audioCtx) return;

  const now = audioCtx.currentTime;
  // 2s fade-out
  activeNodes.master.gain.linearRampToValueAtTime(0, now + 2);

  const nodes = activeNodes;
  activeNodes = null;

  setTimeout(() => {
    nodes.oscs.forEach((o) => {
      try { o.stop(); } catch (_) { /* already stopped */ }
    });
    nodes.oscs.forEach((o) => o.disconnect());
    nodes.gains.forEach((g) => g.disconnect());
    nodes.master.disconnect();
  }, 2200);
}

export function isAmbientPlaying(): boolean {
  return activeNodes !== null;
}
