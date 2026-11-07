import './effects.js';   // load order: each file runs after the one before it (COORDINATION.md)
import { G } from './round.js';
import { addUpdate } from './shared.js';
// ---------------------------------------------------------------- sound (WebAudio, synthesized, starts on the first tap)
export let AC = null, master = null;
export function audio() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0.5; master.connect(AC.destination);
      const len = AC.sampleRate * 3, buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0); let b = 0;
      for (let i = 0; i < len; i++) { b = (b + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = b * 3.5; }
      const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
      const g = AC.createGain(); g.gain.value = 0.22; const lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = 0.09; lg.gain.value = 0.12; lfo.connect(lg); lg.connect(g.gain); lfo.start();
      src.connect(lp); lp.connect(g); g.connect(master); src.start();
    } catch (e) { AC = null; }
  }
  if (AC && AC.state === 'suspended') AC.resume();
}
export function tone({ f = 440, f2 = 0, dur = 0.3, type = 'sine', g = 0.2, at = 0, vib = 0, vibF = 6, attack = 0.01, bp = 0 }) {
  if (!AC) return;
  const t0 = AC.currentTime + at, o = AC.createOscillator(), gn = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(g, t0 + attack); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  if (vib) { const l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = vibF; lg.gain.value = vib; l.connect(lg); lg.connect(o.frequency); l.start(t0); l.stop(t0 + dur + 0.05); }
  if (bp) { const f0 = AC.createBiquadFilter(); f0.type = 'bandpass'; f0.frequency.value = bp; f0.Q.value = 1.2; o.connect(f0); f0.connect(gn); } else o.connect(gn);
  gn.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
}
export function noise({ dur = 0.4, g = 0.2, at = 0, f = 1200, q = 0.8 }) {
  if (!AC) return;
  const t0 = AC.currentTime + at, len = Math.ceil(AC.sampleRate * dur), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const s = AC.createBufferSource(); s.buffer = buf; const bq = AC.createBiquadFilter(); bq.type = 'bandpass'; bq.frequency.value = f; bq.Q.value = q;
  const gn = AC.createGain(); gn.gain.value = g; s.connect(bq); bq.connect(gn); gn.connect(master); s.start(t0);
}
export const SFX = {
  moo: () => { tone({ f: 118, f2: 96, dur: 1.3, type: 'sawtooth', g: 0.11, vib: 3, vibF: 4, bp: 420, attack: 0.15 }); tone({ f: 236, f2: 190, dur: 1.2, type: 'sawtooth', g: 0.04, bp: 700, attack: 0.2 }); },
  baa: (p = 1) => { tone({ f: 330 * p, f2: 280 * p, dur: 0.6, type: 'sawtooth', g: 0.12, vib: 28, vibF: 11, bp: 1100, attack: 0.04 }); tone({ f: 660 * p, f2: 560 * p, dur: 0.55, type: 'sawtooth', g: 0.04, vib: 40, vibF: 11, bp: 2400, attack: 0.05 }); },
  bark: () => { for (const at of [0, 0.18]) { tone({ f: 560, f2: 300, dur: 0.11, type: 'square', g: 0.09, bp: 1200, at }); noise({ dur: 0.08, g: 0.08, f: 900, at }); } },
  flute: () => { [587, 659, 740, 880, 740, 659, 587, 880, 988].forEach((f, i) => tone({ f, dur: 0.34, type: 'sine', g: 0.12, vib: 5, vibF: 5.5, attack: 0.06, at: i * 0.3 })); },
  bell: () => { for (const [f, g, d] of [[392, 0.18, 3.5], [784, 0.08, 2.5], [1176, 0.05, 1.8], [940, 0.04, 2.2]]) tone({ f, dur: d, g, attack: 0.005 }); },
  croak: () => { tone({ f: 190, f2: 120, dur: 0.16, type: 'square', g: 0.05, bp: 600 }); tone({ f: 170, f2: 110, dur: 0.2, type: 'square', g: 0.05, at: 0.22, bp: 600 }); },
  splash: () => { noise({ dur: 0.5, g: 0.35, f: 900, q: 0.6 }); noise({ dur: 0.25, g: 0.2, f: 2600, q: 1, at: 0.05 }); },
  creak: () => tone({ f: 110, f2: 170, dur: 0.6, type: 'sawtooth', g: 0.05, bp: 700, vib: 12, vibF: 23 }),
  pop: () => tone({ f: 700, f2: 1100, dur: 0.12, g: 0.12 }),
  rustle: () => noise({ dur: 0.7, g: 0.25, f: 3200, q: 0.5 }),
  rooster: () => { tone({ f: 520, f2: 780, dur: 0.25, type: 'sawtooth', g: 0.07, bp: 1500 }); tone({ f: 800, f2: 600, dur: 0.6, type: 'sawtooth', g: 0.07, bp: 1500, vib: 20, vibF: 14, at: 0.25 }); },
  lamp: () => { [392, 494, 587, 784].forEach((f, i) => tone({ f, dur: 2.2, g: 0.07, type: 'sine', at: i * 0.09, attack: 0.02 })); noise({ dur: 0.5, g: 0.05, f: 2400 }); },
  door: () => { tone({ f: 140, f2: 90, dur: 0.25, type: 'triangle', g: 0.15 }); noise({ dur: 0.1, g: 0.15, f: 500, at: 0.2 }); },
  jingle: () => { [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone({ f, dur: 0.5, g: 0.1, type: 'triangle', at: i * 0.12 })); },
  step: () => noise({ dur: 0.06, g: 0.03, f: 700 }),
  // the railway: a steam whistle (two reedy tones), a chuff of steam, the clack of a rail dropping in, a pluck as one comes up, a station bell, a stopped train's clank
  whistle: () => { for (const [f, g] of [[740, 0.07], [932, 0.05], [1480, 0.02]]) { tone({ f, f2: f * 0.985, dur: 0.55, type: 'triangle', g, attack: 0.04, vib: 4, vibF: 7, bp: f * 1.4 }); tone({ f, dur: 0.9, type: 'triangle', g: g * 0.8, attack: 0.05, at: 0.62, vib: 5, vibF: 7, bp: f * 1.4 }); } noise({ dur: 1.5, g: 0.05, f: 3000, q: 0.6 }); },
  chuff: () => { for (let i = 0; i < 4; i++) noise({ dur: 0.18, g: 0.12 - i * 0.02, f: 900, q: 0.7, at: i * 0.22 }); },
  clack: () => { tone({ f: 1400, f2: 900, dur: 0.06, type: 'square', g: 0.035, bp: 2200 }); noise({ dur: 0.12, g: 0.1, f: 500, q: 0.9, at: 0.02 }); },
  pluck: () => { tone({ f: 320, f2: 200, dur: 0.12, type: 'triangle', g: 0.08 }); noise({ dur: 0.1, g: 0.06, f: 1800 }); },
  ding: () => { tone({ f: 1046, dur: 1.1, g: 0.08, attack: 0.004 }); tone({ f: 1568, dur: 0.8, g: 0.04, attack: 0.004, at: 0.02 }); },
  joint: (g = 1) => { for (const at of [0, 0.075]) { noise({ dur: 0.035, g: 0.035 * g, f: 2600, q: 1.4, at }); tone({ f: 520, f2: 380, dur: 0.03, type: 'square', g: 0.012 * g, bp: 1600, at }); } },   // the faint double click of two axles over a rail joint
  whoosh: () => { noise({ dur: 0.9, g: 0.16, f: 1400, q: 0.5 }); noise({ dur: 0.5, g: 0.1, f: 4200, q: 0.7, at: 0.05 }); },
  clank: () => { tone({ f: 180, f2: 120, dur: 0.25, type: 'square', g: 0.05, bp: 500 }); noise({ dur: 0.2, g: 0.1, f: 800 }); },
};

// ---------------------------------------------------------------- sound
Object.assign(SFX, {
  hit: (p = 1) => { noise({ dur: 0.12, g: 0.35, f: 2400, q: 0.9 }); tone({ f: 190, f2: 90, dur: 0.14, type: 'triangle', g: 0.25 }); tone({ f: 900, f2: 500, dur: 0.05, type: 'square', g: 0.05 }); noise({ dur: 0.5, g: 0.08 * p, f: 3000, q: 0.5, at: 0.05 }); },
  tick: () => tone({ f: 880, f2: 1180, dur: 0.07, g: 0.1, type: 'triangle' }),
  thud: (k = 1) => { tone({ f: 120, f2: 60, dur: 0.12, g: 0.18 * k, type: 'sine' }); noise({ dur: 0.08, g: 0.07 * k, f: 500 }); },
  sand: () => noise({ dur: 0.35, g: 0.2, f: 1800, q: 0.4 }),
  cup: () => { tone({ f: 300, f2: 180, dur: 0.12, g: 0.15, type: 'triangle' }); tone({ f: 1500, dur: 0.5, g: 0.06, at: 0.06 }); },
  ding: () => { tone({ f: 1046, dur: 1.1, g: 0.08, attack: 0.004 }); tone({ f: 1568, dur: 0.8, g: 0.04, attack: 0.004, at: 0.02 }); },
});
Object.assign(SFX, {
  gull: () => { for (const [at, f] of [[0, 1500], [0.28, 1350], [0.5, 1650]]) { tone({ f, f2: f * 0.62, dur: 0.26, type: 'triangle', g: 0.05, at, bp: 2200, attack: 0.03, vib: 40, vibF: 18 }); } },
  surf: () => { noise({ dur: 2.2, g: 0.07, f: 700, q: 0.3 }); noise({ dur: 1.6, g: 0.04, f: 1800, q: 0.3, at: 0.3 }); },
  birdie: () => { [659, 784, 988, 1318, 988, 1318, 1568].forEach((f, i) => tone({ f, dur: 0.45, g: 0.1, type: 'triangle', at: i * 0.1 })); tone({ f: 330, dur: 1.2, g: 0.06, at: 0.1 }); },
  meterTick: (p = 0.5) => tone({ f: 600 + p * 700, dur: 0.035, g: 0.06, type: 'square', bp: 2400 }),
  perfect: () => { tone({ f: 1318, dur: 0.5, g: 0.09, attack: 0.004 }); tone({ f: 1976, dur: 0.6, g: 0.05, attack: 0.004, at: 0.07 }); },
  nice: () => tone({ f: 988, f2: 1318, dur: 0.25, g: 0.08, type: 'triangle' }),
  pin: () => { tone({ f: 523, dur: 0.18, g: 0.06, type: 'triangle' }); tone({ f: 784, dur: 0.25, g: 0.06, type: 'triangle', at: 0.09 }); },
});
export const play = (k, ...a) => { if (!G.sound || !AC) return; const f = SFX[k]; if (typeof f !== 'function') return; try { f(...a); } catch (e) { } };
// ambience: surf washes in now and then, gulls from main.js
let surfT = 3; addUpdate(dt => { if (G.phase === 'title') return; surfT -= dt; if (surfT < 0) { surfT = 5 + Math.random() * 4; play('surf'); } });
// meter tick: a bright tick every few percent while the power bar rises
let lastTick = -1; addUpdate(() => { const m = G.m; if (G.phase === 'aim' && m.stage === 1) { const k = Math.floor(m.power * 16); if (k !== lastTick) { lastTick = k; if (k > 0) play('meterTick', m.power); } } else lastTick = -1; });
addEventListener('pointerdown', () => audio()); addEventListener('keydown', () => audio());
