import './physics.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rand } from './util.js';
import { ST, addUpdate, addSetState, fire } from './shared.js';
import { G } from './round.js';
import { surfaceAt } from './course.js';
import { BUNKERS, LH, POND, bunkerQ, heightAt, inland } from './course.js';
import { named, scene, std } from './stage.js';
import { spawnParticles, TEX } from './effects.js';
import { _cm } from './rules.js';
import { BOXES, sheepList } from './physics.js';
// ---------------------------------------------------------------- sheep that wander across the fairways
export const sheep = [];
{
  const fleece = new THREE.IcosahedronGeometry(0.2, 1); { const p = fleece.attributes.position; for (let i = 0; i < p.count; i++) { const k = 1 + 0.12 * Math.sin(p.getX(i) * 40 + p.getY(i) * 31 + p.getZ(i) * 23); p.setXYZ(i, p.getX(i) * k * 0.85, p.getY(i) * k * 0.8, p.getZ(i) * k * 1.25); } fleece.computeVertexNormals(); }
  const face = new THREE.SphereGeometry(0.075, 8, 6).scale(0.8, 0.9, 1.3).translate(0, 0.32, 0.27), legs = [-1, 1].flatMap(a => [-1, 1].map(b => new THREE.CylinderGeometry(0.022, 0.02, 0.18, 5).translate(a * 0.08, 0.09, b * 0.12)));
  const col = (g, c) => { const n = g.attributes.position.count, a = new Float32Array(n * 3), cc = new THREE.Color(c); for (let i = 0; i < n; i++) cc.toArray(a, i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g.toNonIndexed(); };
  const geo = mergeGeometries([col(fleece.translate(0, 0.27, 0), '#efe8da'), col(face, '#2a2420'), ...legs.map(l => col(l, '#2a2420'))].map(g => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; }));
  const homes = [[-16.5, 4.2], [-3.5, -4.6], [6.0, -3.8], [-6.5, 9.8], [14.0, 4.2], [-21.5, -7.0], [5.0, 9.5], [19.8, 9.0], [-9, 2.2], [11.5, -10]];
  const inst = named(new THREE.InstancedMesh(geo, std('#ffffff', { vertexColors: true, roughness: 1 }), homes.length), 'sheep');
  homes.forEach(([x, z], i) => { const s = { x, z, hx: x, hz: z, ox: x, oz: z, tx: x, tz: z, tumble: 0, state: 'graze', dizzy: 0, yaw: rand(0, 6.28), ph: rand(0, 6), hop: 0, s: rand(0.95, 1.2), wait: i % 3 === 0 ? 0 : rand(0.5, 5), gy: heightAt(x, z), flee: 0 }; sheep.push(s); sheepList.push(s); });
  scene.add(inst); sheep.inst = inst;
}
export const okForSheep = (x, z) => inland(x, z) > 2.4 && Math.hypot(x - POND.x, z - POND.z) > POND.r + 0.5 && !BOXES.some(b => Math.abs(x - b.x) < b.hx + 1 && Math.abs(z - b.z) < b.hz + 1) && Math.hypot(x - LH.x, z - LH.z) > 2 && !BUNKERS.some(b => bunkerQ(b, x, z) < 1.3);
// where a sheep strolls next: mostly across the mown ribbon of the course (into play), within a loose range of its origin
export function pickSheepTarget(s) {
  let best = null;
  for (let k = 0; k < 14; k++) {
    const a = rand(0, 6.28), r = rand(3.5, 10), nx = s.x + Math.cos(a) * r, nz = s.z + Math.sin(a) * r;
    if (!okForSheep(nx, nz) || Math.hypot(nx - s.ox, nz - s.oz) > 13) continue;
    const sf = surfaceAt(nx, nz), sc = (sf === 'fairway' ? 2 : sf === 'tee' ? 1.2 : sf === 'rough' ? 0.6 : 0) + Math.random();
    if (!best || sc > best.sc) best = { nx, nz, sc };
  }
  return best;
}
export function updateSheep(dt) {
  sheep.forEach((s, i) => {
    s.hop = Math.max(0, s.hop - dt); s.flee = Math.max(0, s.flee - dt); s.tumble = Math.max(0, s.tumble - dt);
    const dx = s.tx - s.x, dz = s.tz - s.z, d = Math.hypot(dx, dz);
    if (s.wait > 0) s.wait -= dt;
    else if (d > 0.12 && s.tumble <= 0) { const sp = (s.flee > 0 ? 1.5 : 0.62) * dt; s.x += dx / d * sp; s.z += dz / d * sp; const ty = Math.atan2(dx, dz); let da = ty - s.yaw; while (da > Math.PI) da -= 6.283; while (da < -Math.PI) da += 6.283; s.yaw += da * Math.min(1, dt * 4); }
    else if (d <= 0.12) { s.wait = rand(1.5, 5); const t = pickSheepTarget(s); if (t) { s.tx = t.nx; s.tz = t.nz; } }
    s.gy = heightAt(s.x, s.z);
    const graze = s.wait > 0 && Math.sin(ST.gameTime * 0.7 + s.ph) > -0.2, walk = s.wait <= 0 && d > 0.12;
    s.state = s.tumble > 0 ? 'tumble' : s.hop > 0 ? 'hop' : s.flee > 0 ? 'flee' : walk ? 'walk' : 'graze';
    let lift = Math.abs(Math.sin(s.hop * 12)) * 0.1 * (s.hop > 0) + (walk ? Math.abs(Math.sin(ST.gameTime * 7 + s.ph)) * 0.015 : 0), roll = 0;
    if (s.tumble > 0) { const p = 1 - s.tumble / 1.2; roll = p * Math.PI * 4 * (1 - 0.3 * p); lift = Math.sin(Math.min(1, p * 1.6) * Math.PI) * 0.45 + 0.08; }
    _cm.position.set(s.x, s.gy + lift, s.z);
    _cm.rotation.set(graze ? 0.18 : -0.05, s.yaw + (s.hop > 0 && s.tumble <= 0 ? Math.sin(s.hop * 9) * 0.4 : 0), roll); _cm.scale.setScalar(s.s); _cm.updateMatrix(); sheep.inst.setMatrixAt(i, _cm.matrix);
  });
  sheep.inst.instanceMatrix.needsUpdate = true;
}
// the hit's icons: a big heart that pops, wobbles and floats up slowly over the sheep (stays in frame for the clip), with a note and a bang
export const pops = [];
export function popIcon(kind, s, ox, oy, size, life) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX[kind], transparent: true, depthWrite: false, depthTest: false })); sp.name = 'creatures_' + kind; sp.renderOrder = 9; scene.add(sp);
  pops.push({ sp, s, ox, oy, size, life, t: 0 });
}
function updatePops(dt) {
  for (let i = pops.length - 1; i >= 0; i--) {
    const p = pops[i]; p.t += dt; const k = p.t / p.life, pop = Math.min(1, p.t / 0.18), ov = 1 + 0.35 * Math.sin(pop * Math.PI);
    p.sp.position.set(p.s.x + p.ox, p.s.gy + p.oy + 0.35 * k + Math.abs(Math.sin(p.t * 5)) * 0.04, p.s.z); p.sp.scale.setScalar(p.size * pop * ov * (k > 0.8 ? 1 - (k - 0.8) * 5 : 1)); p.sp.material.rotation = Math.sin(p.t * 7) * 0.12;
    if (k >= 1) { scene.remove(p.sp); p.sp.material.dispose(); pops.splice(i, 1); }
  }
}
export const crt = { freeze: 0, lastHit: null, hits: 0 };
addUpdate(dt => { updatePops(dt); if (crt.freeze > 0) { G.hitStop = Math.max(G.hitStop || 0, crt.freeze); crt.freeze = 0; } });
export const sheepObs = () => ({ sheep: sheep.map(s => ({ x: +s.x.toFixed(2), z: +s.z.toFixed(2), state: s.state, tx: +s.tx.toFixed(1), tz: +s.tz.toFixed(1) })), sheepHits: G.sheepHits, lastSheepHit: crt.lastHit, hitStop: G.hitStop > 0 });
// setState {creatures:{sheep:{i, x, z}}} puts a sheep somewhere (for checks)
addSetState(p => { const c = p.creatures; if (c && c.sheep) { const s = sheep[c.sheep.i || 0]; if (s) { s.x = s.tx = s.hx = s.ox = c.sheep.x; s.z = s.tz = s.hz = s.oz = c.sheep.z; s.wait = c.sheep.wait ?? 60; } } });

// a ball hit this sheep: it hops, flees away from the ball and shows a heart
export function sheepBonked(s, b) {
  const sp = Math.hypot(b.vel.x, b.vel.z), big = sp > 3.6 || G.sheepHits % 2 === 1;
  s.hop = 0.8; s.flee = 4; if (big) s.tumble = 1.2; s.wait = 0;
  const dx = s.x - b.pos.x, dz = s.z - b.pos.z, d = Math.hypot(dx, dz) || 1; s.tx = s.x + dx / d * 4; s.tz = s.z + dz / d * 4; if (!okForSheep(s.tx, s.tz)) { s.tx = s.hx; s.tz = s.hz; }
  s.state = big ? 'tumble' : 'hop';
  popIcon('heart', s, 0, 0.62, 0.7, 2.6); popIcon('note', s, 0.35, 0.5, 0.6, 2.0); popIcon('bang', s, -0.35, 0.55, 0.6, 2.0);
  spawnParticles(s.x, s.gy + 0.35, s.z, 14, 0xf6f0e2, { up: 2.4, speed: 1.5, size: 0.14, gravity: 5, life: 1.0 });
  crt.freeze = 0.17; crt.lastHit = { x: +s.x.toFixed(2), z: +s.z.toFixed(2), tumble: big, t: ST.gameTime };
  fire('creatures:sheep-hit', { sheep: s, tumble: big });
  if (big) fire('creatures:sheep-tumble', { sheep: s });
}
