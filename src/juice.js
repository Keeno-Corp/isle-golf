// Made with paprika3d · https://paprika3d.com
// game feel: each event a player causes (meter click, strike, landing by surface, hazard, hole-out) answers with a camera shake,
// a short hit-stop, a flash, a burst of bits and a HUD pulse. It changes no rule and spends no Math.random (the seeded world stays as it was).
import './meter.js';   // load order: after the game it reacts to
import * as THREE from 'three';
import { ST, addObserve, addUpdate, on } from './shared.js';
import { heightAt } from './course.js';
import { camera, hemi, scene, sun } from './stage.js';
import { CLUBS } from './rules.js';
import { SIM } from './physics.js';
import { G } from './round.js';
import { hud } from './hud.js';

// ---------------------------------------------------------------- knobs
export const FEEL = { strikeShake: 0.16, strikeStop: 0.05, strikeFov: 1.6, landShake: { fairway: 0.05, tee: 0.05, green: 0.03, rough: 0.045, sand: 0.09 }, sunkShake: 0.1, sunkStop: 0.09, decay: 9 };

// ---------------------------------------------------------------- bits: one instanced draw of small tumbling chips; its count is the number alive
const MAX = 160, bits = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX);
bits.name = 'feelBits'; bits.count = 0; bits.frustumCulled = false; bits.setColorAt(0, new THREE.Color()); scene.add(bits);
const live = [], _m = new THREE.Object3D(), _c = new THREE.Color();
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;   // its own generator, so the page's seeded Math.random is left alone
export function spray(x, y, z, n, cols, o = {}) {
  for (let i = 0; i < n && live.length < MAX; i++) {
    const a = rnd() * 6.283, sp = (o.speed ?? 1.6) * (0.35 + rnd() * 0.65);
    live.push({ x, y, z, vx: Math.cos(a) * sp + (o.vx || 0), vz: Math.sin(a) * sp + (o.vz || 0), vy: (o.up ?? 2.6) * (0.5 + rnd() * 0.6), g: o.g ?? 8, t: 0, life: (o.life ?? 0.7) * (0.7 + rnd() * 0.5), s: (o.size ?? 0.06) * (0.6 + rnd() * 0.8), c: cols[(rnd() * cols.length) | 0], r: rnd() * 6 });
  }
}
// ---------------------------------------------------------------- shake, hit-stop, flash, fov kick
const S = { amp: 0, fov: 0, events: 0, last: '' };
export const shake = a => { S.amp = Math.max(S.amp, a); };
const stop = t => { G.hitStop = Math.max(G.hitStop || 0, t); };
const flash = (v, hold = 0.03) => { ST.flash = Math.max(ST.flash, v); ST.flashHold = Math.max(ST.flashHold, hold); };
const note = k => { S.events++; S.last = k; };
const GRASS = ['#8fb860', '#6b9743', '#a9c27a'], STRAW = ['#b8a64a', '#d2c268', '#8a8a3a'], SAND = ['#e3cf94', '#f1dca0', '#c4aa6e'], FINE = ['#b9e08a', '#9ec27a'], WATER = ['#dff6ff', '#a8e4e0', '#ffffff'], LEAF = ['#3a7a2f', '#4a8a35', '#7aa845'],
  CONFETTI = ['#d9392b', '#f4e39a', '#3d7fd9', '#f08ab0', '#ffffff', '#76a64a'], GOLD = ['#ffe27a', '#fff6d0'];
const BY_SURF = { fairway: GRASS, tee: GRASS, green: FINE, rough: STRAW, sand: SAND };

on('swing', e => {
  const c = CLUBS.find(k => k.id === e.club), putt = c && c.putt, p = e.power, b = SIM.pos, ca = Math.cos(G.aim), sa = Math.sin(G.aim);
  shake(putt ? 0.012 + 0.02 * p : 0.04 + FEEL.strikeShake * p); if (!putt) { stop(FEEL.strikeStop * (0.4 + 0.6 * p)); flash(0.12 + 0.2 * p); S.fov = FEEL.strikeFov * p; }
  const surf = SIM.surf === 'sand' ? SAND : SIM.surf === 'rough' ? STRAW : GRASS;
  spray(b.x, b.y + 0.02, b.z, putt ? 3 : Math.round(8 + 16 * p), surf, { speed: 0.9, up: 1.6 + 1.8 * p, vx: ca * (0.8 + 2 * p), vz: sa * (0.8 + 2 * p), size: putt ? 0.035 : 0.055 });
  if (Math.abs(e.acc) < 0.001 && !putt) spray(b.x, b.y + 0.15, b.z, 10, GOLD, { speed: 1.4, up: 2.4, g: 3, life: 0.55, size: 0.045 });
  note('strike');
});
on('ball:land', e => { const b = e.ball, sf = b.surf; shake(FEEL.landShake[sf] ?? 0.05); spray(b.pos.x, b.pos.y + 0.03, b.pos.z, sf === 'sand' ? 22 : sf === 'rough' ? 14 : sf === 'green' ? 7 : 10, BY_SURF[sf] || GRASS, { speed: sf === 'sand' ? 2.0 : 1.4, up: sf === 'sand' ? 3.0 : 2.2, vx: b.vel.x * 0.15, vz: b.vel.z * 0.15, size: sf === 'green' ? 0.04 : 0.055 }); note('land:' + sf); });
on('ball:bounce', e => { const b = e.ball; shake(0.015); spray(b.pos.x, b.pos.y + 0.02, b.pos.z, 3, BY_SURF[b.surf] || GRASS, { speed: 0.8, up: 1.4, size: 0.04 }); });
on('ball:sandHit', e => { shake(0.09); spray(e.ball.pos.x, e.ball.pos.y + 0.03, e.ball.pos.z, 20, SAND, { speed: 2, up: 3 }); note('land:sand'); });
on('ball:water', e => { const b = e.ball, w = b.entry || b.pos; shake(0.07); flash(0.18); spray(w.x, heightAt(w.x, w.z) + 0.25, w.z, 26, WATER, { speed: 1.5, up: 4.2, g: 9, life: 0.9, size: 0.06 }); note('water'); });
on('ball:ob', e => { shake(0.06); spray(e.ball.pos.x, e.ball.pos.y + 0.1, e.ball.pos.z, 18, WATER, { speed: 1.4, up: 3.6, g: 9, life: 0.9 }); note('ob'); });
on('ball:tree', e => { shake(0.05); spray(e.ball.pos.x, e.ball.pos.y, e.ball.pos.z, 14, LEAF, { speed: 1.5, up: 1.2, g: 3.5, life: 1.1, size: 0.07 }); note('tree'); });
on('ball:wall', e => { shake(0.08); stop(0.04); spray(e.ball.pos.x, e.ball.pos.y, e.ball.pos.z, 8, ['#e8dcc0', '#b9ac90'], { speed: 1.4, up: 1.6 }); note('wall'); });
on('ball:sheep', () => { shake(0.1); note('sheep'); });
on('ball:cow', () => { shake(0.1); stop(0.08); flash(0.3); note('cow'); });
on('ball:lip', e => { shake(0.03); spray(e.ball.pos.x, e.ball.pos.y + 0.05, e.ball.pos.z, 5, GOLD, { speed: 1, up: 1.6, size: 0.035 }); });
on('ball:sunk', e => { const b = e.ball.pos; shake(FEEL.sunkShake); stop(FEEL.sunkStop); S.fov = -1.2;
  spray(b.x, b.y + 0.15, b.z, 54, CONFETTI, { speed: 1.5, up: 4.6, g: 5.5, life: 1.5, size: 0.06 }); spray(b.x, b.y + 0.1, b.z, 12, GOLD, { speed: 0.7, up: 2.2, g: 2, life: 1.0, size: 0.04 }); note('sunk'); });

// the meter panel pops on each of the three clicks (and harder on a perfect snap)
let stage = 0;
const pulse = (el, k) => el.animate?.([{ scale: String(k) }, { scale: '1' }], { duration: 160, easing: 'cubic-bezier(.2,.9,.3,1.4)' });
addUpdate(dt => {
  const st = G.m.stage; if (st !== stage) { if (st > stage && st > 0) { pulse(hud.meter, st === 3 && G.m.label === 'PERFECT!' ? 1.14 : 1.07); note('meter' + st); } stage = st; }
  // bits
  let n = 0;
  for (let i = live.length - 1; i >= 0; i--) { const p = live[i]; p.t += dt; if (p.t >= p.life) { live.splice(i, 1); continue; }
    p.vy -= p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; const gy = heightAt(p.x, p.z) + 0.01; if (p.y < gy && p.vy < 0) { p.y = gy; p.vy *= -0.3; p.vx *= 0.5; p.vz *= 0.5; } }
  for (const p of live) { const k = p.t / p.life; _m.position.set(p.x, p.y, p.z); _m.rotation.set(p.r + p.t * 9, p.r * 2 + p.t * 7, 0); _m.scale.setScalar(p.s * (k > 0.7 ? (1 - k) / 0.3 : 1)); _m.updateMatrix(); bits.setMatrixAt(n, _m.matrix); bits.setColorAt(n++, _c.set(p.c)); }
  bits.count = n; bits.instanceMatrix.needsUpdate = true; if (bits.instanceColor) bits.instanceColor.needsUpdate = true;
  // the shake rides on top of the camera the game placed this frame (camera.js writes it afresh every frame)
  if (S.amp > 0.0005) { const t = ST.gameTime; camera.translateX(S.amp * Math.sin(t * 97)); camera.translateY(S.amp * Math.cos(t * 123)); camera.rotateZ(S.amp * 0.035 * Math.sin(t * 71)); S.amp *= Math.exp(-dt * FEEL.decay); } else S.amp = 0;
  if (ST.flash > 0.01) { sun.intensity += ST.flash * 2.5; hemi.color.offsetHSL(0, 0, ST.flash * 0.25); }   // the flash also lifts the lights (stage.js sets both afresh each frame)
  if (Math.abs(S.fov) > 0.01) { camera.fov += S.fov; camera.updateProjectionMatrix(); S.fov *= Math.exp(-dt * 7); } else S.fov = 0;
});
addObserve(() => ({ feel: { shake: +S.amp.toFixed(3), bits: bits.count, events: S.events, last: S.last } }));
