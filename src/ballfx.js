// Made with paprika3d · https://paprika3d.com
// ball-physics lane: ball sounds, landing rings, shot tracking for the `physics` observe key, meter reset
import * as THREE from 'three';
import { on, addObserve, addUpdate } from './shared.js';
import { YD, heightAt } from './course.js';
import { scene } from './stage.js';
import { SFX, tone, noise, play } from './sound.js';
import { r3, CLUBS, LIE } from './rules.js';
import { SIM, previewShot } from './physics.js';
import { aimRing } from './aimline.js';
import { G, curH, curP } from './round.js';
import { puffs, updatePool } from './pools.js';
addUpdate(dt => updatePool(puffs, dt));

// ---------------------------------------------------------------- sounds (replace the ball ones; built on tone/noise)
Object.assign(SFX, {
  hit: (p = 1) => { noise({ dur: 0.07, g: 0.4, f: 3200, q: 1.2 }); tone({ f: 260, f2: 80, dur: 0.12, type: 'triangle', g: 0.3 }); tone({ f: 1400, f2: 700, dur: 0.05, type: 'square', g: 0.05 }); noise({ dur: 0.45 * (0.5 + p), g: 0.07 * p, f: 4200, q: 0.6, at: 0.05 }); },
  thud: (k = 1) => { tone({ f: 130, f2: 55, dur: 0.14, g: 0.2 * k, type: 'sine' }); noise({ dur: 0.07, g: 0.07 * k, f: 600 }); },
  land: (surf = 'fairway', k = 1) => {
    if (surf === 'green') { tone({ f: 190, f2: 110, dur: 0.1, g: 0.14 * k }); noise({ dur: 0.05, g: 0.05 * k, f: 1800 }); }
    else if (surf === 'rough') { noise({ dur: 0.25, g: 0.16 * k, f: 1500, q: 0.4 }); tone({ f: 100, f2: 60, dur: 0.1, g: 0.12 * k }); }
    else if (surf === 'sand') { noise({ dur: 0.4, g: 0.22 * k, f: 1500, q: 0.35 }); tone({ f: 80, f2: 50, dur: 0.12, g: 0.1 * k }); }
    else SFX.thud(k);
  },
  sand: () => { noise({ dur: 0.45, g: 0.22, f: 1700, q: 0.35 }); noise({ dur: 0.2, g: 0.1, f: 700, q: 0.6, at: 0.03 }); },
  rustle: () => { noise({ dur: 0.7, g: 0.25, f: 3200, q: 0.5 }); noise({ dur: 0.4, g: 0.12, f: 5200, q: 0.8, at: 0.08 }); tone({ f: 150, f2: 90, dur: 0.1, g: 0.1 }); },
  clank: () => { tone({ f: 300, f2: 200, dur: 0.18, type: 'square', g: 0.05, bp: 900 }); noise({ dur: 0.12, g: 0.12, f: 900 }); tone({ f: 640, dur: 0.4, g: 0.04, attack: 0.002 }); },
  splash: () => { noise({ dur: 0.55, g: 0.35, f: 900, q: 0.6 }); noise({ dur: 0.3, g: 0.2, f: 2800, q: 1, at: 0.04 }); tone({ f: 420, f2: 160, dur: 0.25, g: 0.1, at: 0.02 }); },
  lip: () => { tone({ f: 1100, f2: 900, dur: 0.07, g: 0.08, type: 'triangle' }); tone({ f: 1300, f2: 1000, dur: 0.06, g: 0.06, type: 'triangle', at: 0.07 }); },
  cup: () => { for (let i = 0; i < 4; i++) tone({ f: 1500 - i * 140, f2: 1100 - i * 120, dur: 0.05, g: 0.07, type: 'triangle', at: i * 0.055 }); tone({ f: 260, f2: 130, dur: 0.18, g: 0.2, type: 'triangle', at: 0.2 }); noise({ dur: 0.1, g: 0.08, f: 500, at: 0.2 }); tone({ f: 1760, dur: 0.6, g: 0.05, at: 0.24 }); },
});

// main.js plays 'gull' on a timer; no lane defines it, so a missing key threw in sound.js play(). Fallback only if absent.
if (!SFX.gull) SFX.gull = () => { tone({ f: 1500, f2: 1000, dur: 0.22, g: 0.04, type: 'triangle', vib: 40, vibF: 18 }); tone({ f: 1300, f2: 900, dur: 0.3, g: 0.035, type: 'triangle', at: 0.25 }); };

// ---------------------------------------------------------------- landing rings: a flat ring that expands where the ball first lands
const RINGS = Array.from({ length: 6 }, (_, i) => {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fff6d0', transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.name = 'landRing' + i; m.renderOrder = 4; m.visible = false; scene.add(m); return { m, t: 9, dur: 0.6, r: 0.5 };
});
let ringK = 0;
export function landRing(x, z, r = 0.55, color = '#fff6d0', dur = 0.6) {
  const o = RINGS[ringK++ % RINGS.length]; o.t = 0; o.dur = dur; o.r = r; o.m.material.color.set(color); o.m.position.set(x, heightAt(x, z) + 0.04, z); o.m.visible = true;
}

// ---------------------------------------------------------------- shot tracking
// preview ring that stays on the ground from launch until the first bounce
const flightRing = new THREE.Mesh(new THREE.RingGeometry(0.62, 1, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#f2d43a', transparent: true, opacity: 0.9, depthWrite: false, depthTest: false, side: THREE.DoubleSide }));
flightRing.name = 'landRingPreview'; flightRing.renderOrder = 5; flightRing.visible = false; flightRing.frustumCulled = false; scene.add(flightRing);
export const PHY = { spin: 0, carryYd: 0, rollYd: 0, lastBounce: null, firstBounce: null, puttBreak: 0, origin: null, aim: 0, bounces: 0, lips: 0, club: '' };
on('swing', e => { const c = CLUBS.find(k => k.id === e.club); if (c && !c.putt) { const pw = e.power * (G.m.label === 'MISS-HIT!' ? 0.6 : 1), end = previewShot(c, G.aim, pw, curH(), G.shotOrigin || SIM.pos, LIE[curP().surf] ?? 1, [], e.acc); flightRing.position.set(end.x, heightAt(end.x, end.z) + 0.06, end.z); flightRing.visible = true; PHY.landPreview = { x: r3(end.x), z: r3(end.z) }; } else { flightRing.visible = false; PHY.landPreview = null; } PHY.origin = SIM.pos.clone(); PHY.aim = G.aim; PHY.spin = e.acc; PHY.carryYd = PHY.rollYd = PHY.puttBreak = 0; PHY.lastBounce = PHY.firstBounce = null; PHY.bounces = PHY.lips = 0; PHY.club = e.club; });
on('ball:land', e => { flightRing.visible = false; const b = e.ball; PHY.firstBounce = { x: r3(b.pos.x), z: r3(b.pos.z), surf: b.surf }; if (PHY.origin) PHY.carryYd = Math.round(Math.hypot(b.pos.x - PHY.origin.x, b.pos.z - PHY.origin.z) * YD); landRing(b.pos.x, b.pos.z, b.surf === 'sand' ? 0.75 : 0.55, b.surf === 'sand' ? '#f1dca0' : '#fff6d0'); });
on('ball:bounce', e => { PHY.bounces++; PHY.lastBounce = { x: r3(e.ball.pos.x), z: r3(e.ball.pos.z) }; });
on('ball:lip', () => { PHY.lips++; play('lip'); });
on('ball:sunk', e => { landRing(e.ball.pos.x, e.ball.pos.z, 0.5, '#ffe27a', 0.8); });
addUpdate(dt => {
  for (const o of RINGS) { if (!o.m.visible) continue; o.t += dt; const k = o.t / o.dur; if (k >= 1) { o.m.visible = false; continue; } o.m.scale.setScalar(0.1 + o.r * (1 - (1 - k) ** 2)); o.m.material.opacity = 0.85 * (1 - k); }
  if (flightRing.visible) { flightRing.scale.setScalar(1.1 + 0.12 * Math.sin(performance.now() / 120)); if (G.phase === 'aim') flightRing.visible = false; }
  aimRing.scale.setScalar(1 + 0.08 * Math.sin(performance.now() / 160));
  // meter fields are cleared once the next aim phase begins
  const m = G.m; if (G.phase === 'aim' && m.stage === 0 && (m.power || m.t || m.t2 || m.tp || m.acc || m.label)) { m.power = m.t = m.t2 = m.tp = m.acc = 0; m.label = ''; }
  if (PHY.origin && (SIM.mode === 'roll' || SIM.mode === 'rest' || SIM.mode === 'sunk') && G.phase !== 'aim') {
    const dx = SIM.pos.x - PHY.origin.x, dz = SIM.pos.z - PHY.origin.z, ca = Math.cos(PHY.aim), sa = Math.sin(PHY.aim);
    PHY.puttBreak = r3(-dx * sa + dz * ca);   // signed sideways distance from the aim line (+ = right of the aim)
    const fb = PHY.firstBounce; if (fb) PHY.rollYd = Math.round(Math.hypot(SIM.pos.x - fb.x, SIM.pos.z - fb.z) * YD);
  }
});
addObserve(() => ({ physics: { spin: r3(PHY.spin), carryYd: PHY.carryYd, rollYd: PHY.rollYd, bounces: PHY.bounces, lastBounce: PHY.lastBounce, firstBounce: PHY.firstBounce, puttBreak: PHY.puttBreak, lips: PHY.lips, mode: SIM.mode, vel: r3(Math.hypot(SIM.vel.x, SIM.vel.z)), landPreview: aimRing.visible ? { x: r3(aimRing.position.x), z: r3(aimRing.position.z) } : (flightRing.visible ? PHY.landPreview : null) } }));
