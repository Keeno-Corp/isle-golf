import './aimline.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, rand } from './util.js';
import { ST, fire } from './shared.js';
import { BELL, COW, HOUSE, H_COT, H_HOUSE, H_LH, H_POND, LH, LH_COT, POND, heightAt, surfaceAt } from './course.js';
import { treeObjs } from './island.js';
import { spawnParticles, spawnRipple } from './effects.js';
import { play } from './sound.js';
import { BR, GR, SURF, pick, tmpV } from './rules.js';
import { burst, dust, emit, trail } from './pools.js';
import { sheepBonked } from './sheep.js';
import { G, curP } from './round.js';
import { setSub, showBanner } from './hud.js';

// ---------------------------------------------------------------- obstacles in the ball's way
export const treeBlockers = treeObjs.map(t => ({ t, x: t.x, z: t.z, cy: heightAt(t.x, t.z) + 2.05 * t.s, R: 1.0 * t.s, trunk: 0.22 * t.s, top: 1.6 * t.s }));
export const BOXES = [
  { name: 'house', x: HOUSE.x, z: HOUSE.z, hx: HOUSE.w / 2 + 0.05, hz: HOUSE.d / 2 + 0.05, top: H_HOUSE + 3.0 },
  { name: 'cottage', x: LH_COT.x, z: LH_COT.z, hx: LH_COT.w / 2 + 0.05, hz: LH_COT.d / 2 + 0.05, top: H_COT + 2.2 },
];
export const ROUND = [{ name: 'lighthouse', x: LH.x, z: LH.z, r: LH.r + 0.12, top: H_LH + 7 }, { name: 'bell', x: BELL.x, z: BELL.z, r: 0.3, top: 6 }];

// ---------------------------------------------------------------- the ball's physics: arc with wind and side spin, bounce and roll by surface, hazards
export const waterY = () => H_POND + 0.06;
export function newSim() { return { pos: new THREE.Vector3(), vel: new THREE.Vector3(), mode: 'rest', bounces: 0, landT: 0.7, wx: 0, wz: 0, curve: 0, fx: 1, fz: 0, t: 0, surf: 'fairway', ev: [], hasLanded: false, entry: new THREE.Vector3(), live: true, sunkT: 0 }; }
export const SIM = newSim();
export const ball = { pos: SIM.pos };          // the island's cow watches this
export const sheepList = [];
export function normalAt(x, z, out) { const e = 0.12, h0 = heightAt(x, z), gx = (heightAt(x + e, z) - h0) / e, gz = (heightAt(x, z + e) - h0) / e; return out.set(-gx, 1, -gz).normalize(); }
export function reflectOff(b, nx, ny, nz, e, damp) {
  const v = b.vel, d = v.x * nx + v.y * ny + v.z * nz; if (d >= 0) return;
  v.x -= (1 + e) * d * nx; v.y -= (1 + e) * d * ny; v.z -= (1 + e) * d * nz; v.multiplyScalar(damp);
}
export function collideWorld(b, gy) {
  const p = b.pos, v = b.vel;
  for (const t of treeBlockers) {
    const dx = p.x - t.x, dz = p.z - t.z, h2 = dx * dx + dz * dz; if (h2 > (t.R + 0.4) ** 2) continue;
    const dy = p.y - t.cy, d = Math.hypot(dx, dy, dz);
    if (d < t.R + BR && p.y > t.cy - t.R * 0.85) {
      const k = (t.R + BR + 0.01) / Math.max(d, 1e-3); reflectOff(b, dx / d, dy / d, dz / d, 0.35, 0.62);
      p.set(t.x + dx * k, t.cy + dy * k, t.z + dz * k); if (b.mode === 'roll') b.mode = 'air'; b.ev.push('tree'); t.t.shake = 0.6; b.treeHit = t; return;
    }
    if (Math.sqrt(h2) < t.trunk + BR && p.y < gy + t.top) { const d2 = Math.sqrt(h2) || 1e-3; reflectOff(b, dx / d2, 0, dz / d2, 0.3, 0.7); p.x = t.x + dx / d2 * (t.trunk + BR + 0.01); p.z = t.z + dz / d2 * (t.trunk + BR + 0.01); b.ev.push('tree'); t.t.shake = 0.35; return; }
  }
  for (const bx of BOXES) {
    const dx = p.x - bx.x, dz = p.z - bx.z; if (Math.abs(dx) < bx.hx + BR && Math.abs(dz) < bx.hz + BR && p.y < bx.top) {
      if ((bx.hx + BR - Math.abs(dx)) < (bx.hz + BR - Math.abs(dz))) { reflectOff(b, Math.sign(dx), 0, 0, 0.4, 0.7); p.x = bx.x + Math.sign(dx) * (bx.hx + BR + 0.01); } else { reflectOff(b, 0, 0, Math.sign(dz), 0.4, 0.7); p.z = bx.z + Math.sign(dz) * (bx.hz + BR + 0.01); }
      b.ev.push('wall'); return;
    }
  }
  for (const r of ROUND) { const dx = p.x - r.x, dz = p.z - r.z, d = Math.hypot(dx, dz); if (d < r.r + BR && p.y < r.top) { reflectOff(b, dx / d, 0, dz / d, 0.4, 0.7); p.x = r.x + dx / d * (r.r + BR + 0.01); p.z = r.z + dz / d * (r.r + BR + 0.01); b.ev.push('wall'); return; } }
  for (const s of sheepList) {   // a sheep: the ball bounces off it with a baa
    const dx = p.x - s.x, dz = p.z - s.z, d = Math.hypot(dx, dz); if (d < 0.34 * s.s + BR && p.y < s.gy + 0.48 * s.s) {
      const sp = Math.max(2.4, Math.hypot(v.x, v.z) * 0.6); v.set(dx / (d || 1) * sp, 2.1 + Math.min(1.5, sp * 0.15), dz / (d || 1) * sp); p.x = s.x + dx / (d || 1) * (0.34 * s.s + BR + 0.02); p.z = s.z + dz / (d || 1) * (0.34 * s.s + BR + 0.02);
      b.mode = 'air'; b.ev.push('sheep'); b.sheep = s; return;
    }
  }
  { const dx = p.x - COW.x, dz = p.z - COW.z, d = Math.hypot(dx, dz); if (d < 0.62 + BR && p.y < heightAt(COW.x, COW.z) + 1.05) { const sp = Math.max(2, Math.hypot(v.x, v.z) * 0.5); v.set(dx / d * sp, 1.8, dz / d * sp); p.x = COW.x + dx / d * (0.62 + BR + 0.02); p.z = COW.z + dz / d * (0.62 + BR + 0.02); b.mode = 'air'; b.ev.push('cow'); } }
}
export const _n = new THREE.Vector3();
export function stepSim(b, dt) {
  b.t += dt; const p = b.pos, v = b.vel;
  if (b.mode === 'air') {
    const hv = Math.hypot(v.x, v.z) || 1;
    v.x += (b.wx + (-v.z / hv) * b.curve) * dt; v.z += (b.wz + (v.x / hv) * b.curve) * dt; v.y -= GR * dt;
    p.addScaledVector(v, dt);
    if (b.live) collideWorld(b, heightAt(p.x, p.z));
    const gy = heightAt(p.x, p.z) + BR * 0.8;
    if (Math.hypot(p.x - POND.x, p.z - POND.z) < POND.r - 0.05 && p.y <= waterY() + BR && v.y < 0) { b.entry.copy(p); b.mode = 'water'; b.ev.push('water'); return; }
    if (p.y <= gy && v.y < 0) {
      p.y = gy; const surf = surfaceAt(p.x, p.z); b.surf = surf;
      if (surf === 'ob') { b.mode = 'ob'; b.ev.push('ob'); return; }
      if (!b.hasLanded) { b.hasLanded = true; b.ev.push('land'); b.landPos = p.clone(); }
      const S = SURF[surf] || SURF.fairway; normalAt(p.x, p.z, _n); const vn = v.dot(_n);
      if (surf === 'sand') { v.multiplyScalar(0.1); v.y = 0; b.mode = 'roll'; b.ev.push('sandHit'); return; }
      const ret = b.bounces === 0 ? b.landT * S.t / 0.8 : S.t;
      tmpV.copy(v).addScaledVector(_n, -vn).multiplyScalar(ret);
      v.copy(tmpV).addScaledVector(_n, -vn * S.e); if (b.bounces === 0 && b.curve) { const hv2 = Math.hypot(v.x, v.z) || 1; v.x += (-v.z / hv2) * b.curve * 0.22; v.z += (v.x / hv2) * b.curve * 0.22; } b.bounces++; b.ev.push('bounce');
      if (-vn * S.e < 0.75 || b.bounces > 5) { v.y = 0; b.mode = 'roll'; }
    }
  } else if (b.mode === 'roll') {
    const surf = surfaceAt(p.x, p.z); b.surf = surf;
    if (surf === 'water') { b.entry.copy(p); b.mode = 'water'; b.ev.push('water'); return; }
    if (surf === 'ob') { b.mode = 'ob'; b.ev.push('ob'); return; }
    const S = SURF[surf] || SURF.fairway, e = 0.1, h0 = heightAt(p.x, p.z), gx = (heightAt(p.x + e, p.z) - h0) / e, gz = (heightAt(p.x, p.z + e) - h0) / e;
    v.x -= GR * S.ks * gx * dt; v.z -= GR * S.ks * gz * dt;
    let sp = Math.hypot(v.x, v.z);
    const roll = S.roll * (surf === 'rough' ? 1 : 1) + (surf === 'sand' ? 0 : 0);
    if (sp > 1e-4) { const ns = Math.max(0, sp - roll * dt); v.x *= ns / sp; v.z *= ns / sp; sp = ns; }
    // the cup: a slow ball over it drops, a quick one lips out (bends round the rim) or runs over; one just off it is pulled in a little
    if (surf === 'green' && b.pin) {
      const dx = b.pin.x - p.x, dz = b.pin.z - p.z, d = Math.hypot(dx, dz) || 1e-4;
      if (d < 0.23) {
        const vcap = 1.6 * (1 - d / 0.23) + 0.18;
        if (sp < vcap) { b.mode = 'sunk'; b.ev.push('sunk'); p.x = b.pin.x; p.z = b.pin.z; v.set(0, 0, 0); return; }
        if (d < 0.2 && sp > 1.5 && sp < 3.6 && !b.lipped) {   // caught the rim: swerve off to the far side
          b.lipped = true; b.ev.push('lip'); const side = (v.x * dz - v.z * dx) > 0 ? -1 : 1, an = side * (0.55 + 0.5 * (d / 0.2)), c = Math.cos(an), sn = Math.sin(an);
          const vx = v.x * c - v.z * sn, vz = v.x * sn + v.z * c; v.x = vx * 0.82; v.z = vz * 0.82;
        }
      } else if (d < 0.5 && sp < 1.5) { v.x += dx / d * 4.5 * dt; v.z += dz / d * 4.5 * dt; }
    }
    p.x += v.x * dt; p.z += v.z * dt; p.y = heightAt(p.x, p.z) + BR * 0.8;
    if (b.live) collideWorld(b, p.y);
    if (sp < 0.09 && (Math.abs(gx) + Math.abs(gz)) * GR * S.ks < roll * 0.95) { v.set(0, 0, 0); b.mode = 'rest'; b.ev.push('rest'); }
  } else if (b.mode === 'sunk') { b.sunkT += dt; }
}
// where the aim line takes a full-power shot: the ground track of a free flight (wind and spin included), used for the dotted preview
export function previewShot(club, aimYaw, power, H, startPos, lie, out, acc = 0) {
  const s = newSim(); s.live = false; s.pos.copy(startPos); launchOn(s, club, power, acc, aimYaw, H, lie);
  let n = 0; out.length = 0;
  while (s.mode === 'air' && n++ < 800) { stepSim(s, 1 / 120); if (n % 6 === 0) out.push([s.pos.x, s.pos.z, s.pos.y]); if (s.hasLanded) break; }
  out.push([s.pos.x, s.pos.z, s.pos.y]); return s.pos;
}
// putter reach at full meter: a little past the pin, so the cyan notch sits near 0.8 for any putt length
export const puttRange = d => Math.max(1.6, d * 1.22 + 0.5);
export function launchOn(s, club, power, acc, aimYaw, H, lie) {
  const wv = H.wv, f = aimYaw + acc * (club.putt ? 0.05 : 0.04);
  s.fx = Math.cos(f); s.fz = Math.sin(f); s.bounces = 0; s.hasLanded = false; s.t = 0; s.ev = []; s.lipped = false; s.sheep = null; s.treeHit = null;
  s.pin = { x: H.pinX, z: H.pinZ }; s.wx = wv.x * 0.26; s.wz = wv.y * 0.26; s.landT = club.land;
  if (club.putt) {
    // forgiving putts: a power within 0.2 of the flat-ground notch counts half, so a press near the cyan line still drops
    const dp = Math.hypot(s.pin.x - s.pos.x, s.pin.z - s.pos.z), rg = puttRange(dp), pf = Math.min(1, dp / rg), x = power - pf, ax = Math.abs(x);
    const pe = dp < 0.3 ? power : Math.max(0.02, pf + Math.sign(x) * (x < 0 ? (ax < 0.2 ? ax * 0.3 : 0.06 + (ax - 0.2)) : (ax < 0.06 ? ax * 0.5 : 0.03 + (ax - 0.06))));
    const v = Math.sqrt(2 * (SURF[surfaceAt(s.pos.x, s.pos.z)]?.roll ?? SURF.green.roll) * rg * pe);; s.vel.set(s.fx * v, 0, s.fz * v); s.mode = 'roll'; s.curve = 0; s.wx = s.wz = 0; return;
  }
  const carry = Math.max(0.5, club.carry * power * lie * (1 - 0.1 * Math.abs(acc))), th = club.loft;
  const v = Math.sqrt(carry * GR / Math.sin(2 * th));
  s.vel.set(s.fx * v * Math.cos(th), v * Math.sin(th), s.fz * v * Math.cos(th)); s.mode = 'air'; s.curve = acc * 2.4; s.pos.y += 0.02;
}
// one step of a ball in flight: the sim at 240 Hz, its events, the trail, then settle when it stops
let _lastTrail = null;
export function stepFlight(dt) {
  G.flightT += dt; ST.cowWatch = 0.3; const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
  for (let i = 0; i < n; i++) { stepSim(SIM, h); if (SIM.ev.length) flightEvents(); if (SIM.mode === 'rest' || SIM.mode === 'sunk' || SIM.mode === 'water' || SIM.mode === 'ob') break; }
  if (SIM.mode === 'air' || (SIM.mode === 'roll' && Math.hypot(SIM.vel.x, SIM.vel.z) > 1.2)) { const L = _lastTrail; const nn = L ? Math.min(4, Math.ceil(L.distanceTo(SIM.pos) / 0.12)) : 1; for (let i = 1; i <= nn; i++) { const k = i / nn; emit(trail, L ? L.x + (SIM.pos.x - L.x) * k : SIM.pos.x, L ? L.y + (SIM.pos.y - L.y) * k : SIM.pos.y, L ? L.z + (SIM.pos.z - L.z) * k : SIM.pos.z, { life: 0.75, sp: 0.02, up: 0.03, g: 0, color: SIM.mode === 'air' ? '#fff3c0' : '#ffe9a0' }); } _lastTrail = SIM.pos.clone(); } else _lastTrail = null;
  if (G.flightT > 22 && SIM.mode !== 'rest') { SIM.mode = 'rest'; SIM.vel.set(0, 0, 0); }
  if (SIM.mode === 'rest' || SIM.mode === 'sunk' || SIM.mode === 'water' || SIM.mode === 'ob') { G.phase = 'settle'; G.resolveT = SIM.mode === 'rest' ? 0.7 : SIM.mode === 'sunk' ? 0.5 : 1.7; }
}
// ---------------------------------------------------------------- what happens to a ball as it flies
export function flightEvents() {
  const b = SIM, p = curP();
  for (const e of b.ev) {
    fire('ball:' + e, { ball: b, player: p });
    if (e === 'land') {
      const sf = b.surf, sp = Math.hypot(b.vel.x, b.vel.z);
      if (sf === 'sand') burst(b.pos.x, b.pos.z, 26, '#e3cf94', 1.6, 2.8); else if (sf === 'green') burst(b.pos.x, b.pos.z, 7, '#b9e08a', 0.9, 1.6); else if (sf === 'rough') burst(b.pos.x, b.pos.z, 12, '#5f8a3d', 1.0, 2.0); else burst(b.pos.x, b.pos.z, 10, '#8fb860', 1.2, 2.2);
      play('land', sf, clamp(0.6 + sp * 0.05, 0.6, 1.3));
    }
    else if (e === 'bounce') { burst(b.pos.x, b.pos.z, 3, b.surf === 'green' ? '#b9e08a' : '#8fb860', 0.6, 1.2); play('land', b.surf, 0.45); }
    else if (e === 'sandHit') { burst(b.pos.x, b.pos.z, 22, '#e3cf94', 1.6, 2.6); play('sand'); setSub('PLUGGED IN THE SAND'); }
    else if (e === 'tree') { play('rustle'); if (b.treeHit) { const t = b.treeHit.t; for (let i = 0; i < 8; i++) emit(dust, b.pos.x, b.pos.y, b.pos.z, { life: 0.9, sp: 1, up: 1.4, g: 4, color: pick(['#3a7a2f', '#4a8a35', '#7aa845']) }); } setSub(pick(['INTO THE BRANCHES!', 'LEAVES EVERYWHERE!', 'A TREE GETS IN THE WAY'])); }
    else if (e === 'wall') { play('clank'); burst(b.pos.x, b.pos.z, 6, '#e8dcc0', 0.8, 1.4); setSub('OFF THE WALL'); }
    else if (e === 'sheep') {
      const s = b.sheep; if (s) sheepBonked(s, b);
      G.sheepHits++; play('baa', rand(0.9, 1.2)); showBanner('BAA!', 'BOUNCED OFF A SHEEP', 1.6); G.hitStop = 0.1; ST.flash = 0.4; ST.flashHold = 0.05;
    }
    else if (e === 'cow') { play('moo'); showBanner('MOO!', 'THE COW SENDS IT BACK', 1.6); }
    else if (e === 'water') { play('splash'); spawnParticles(b.entry.x, waterY() + 0.05, b.entry.z, 14, 0xdff6ff, { up: 2.6, speed: 1.4, size: 0.1, gravity: 8 }); spawnRipple(b.entry.x, b.entry.z); spawnRipple(b.entry.x, b.entry.z, 0.25, 0.7); showBanner('SPLASH!', 'THE DUCKS ARE UNIMPRESSED', 1.8); }
    else if (e === 'ob') { play('splash'); spawnParticles(b.pos.x, b.pos.y, b.pos.z, 12, 0xdff6ff, { up: 2.4, speed: 1.4, size: 0.1, gravity: 8 }); showBanner('OUT OF BOUNDS', 'OVER THE CLIFF AND INTO THE SEA', 2.0); }
    else if (e === 'sunk') { play('cup'); ST.flash = 0.5; ST.flashHold = 0.08; }
    else if (e === 'lip') { setSub('LIPPED THE CUP!'); }
  }
  b.ev.length = 0;
}
