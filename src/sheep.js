import './physics.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rand } from './util.js';
import { ST } from './shared.js';
import { BUNKERS, LH, POND, bunkerQ, heightAt, inland } from './course.js';
import { named, scene, std } from './stage.js';
import { spawnIcon } from './effects.js';
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
  homes.forEach(([x, z], i) => { const s = { x, z, hx: x, hz: z, tx: x, tz: z, yaw: rand(0, 6.28), ph: rand(0, 6), hop: 0, s: rand(0.95, 1.2), wait: rand(0.5, 5), gy: heightAt(x, z), flee: 0 }; sheep.push(s); sheepList.push(s); });
  scene.add(inst); sheep.inst = inst;
}
export const okForSheep = (x, z) => inland(x, z) > 2.4 && Math.hypot(x - POND.x, z - POND.z) > POND.r + 0.5 && !BOXES.some(b => Math.abs(x - b.x) < b.hx + 1 && Math.abs(z - b.z) < b.hz + 1) && Math.hypot(x - LH.x, z - LH.z) > 2 && !BUNKERS.some(b => bunkerQ(b, x, z) < 1.3);
export function updateSheep(dt) {
  sheep.forEach((s, i) => {
    s.hop = Math.max(0, s.hop - dt); s.flee = Math.max(0, s.flee - dt);
    const dx = s.tx - s.x, dz = s.tz - s.z, d = Math.hypot(dx, dz);
    if (s.wait > 0) s.wait -= dt;
    else if (d > 0.12) { const sp = (s.flee > 0 ? 1.4 : 0.42) * dt; s.x += dx / d * sp; s.z += dz / d * sp; const ty = Math.atan2(dx, dz); let da = ty - s.yaw; while (da > Math.PI) da -= 6.283; while (da < -Math.PI) da += 6.283; s.yaw += da * Math.min(1, dt * 4); }
    else { s.wait = rand(2.5, 7); for (let k = 0; k < 10; k++) { const a = rand(0, 6.28), r = rand(1.5, 5.5), nx = s.hx + Math.cos(a) * r, nz = s.hz + Math.sin(a) * r; if (okForSheep(nx, nz)) { s.tx = nx; s.tz = nz; break; } } }
    s.gy = heightAt(s.x, s.z);
    const graze = s.wait > 0 && Math.sin(ST.gameTime * 0.7 + s.ph) > -0.2, walk = s.wait <= 0 && d > 0.12;
    _cm.position.set(s.x, s.gy + Math.abs(Math.sin(s.hop * 12)) * 0.1 * (s.hop > 0) + (walk ? Math.abs(Math.sin(ST.gameTime * 7 + s.ph)) * 0.015 : 0), s.z);
    _cm.rotation.set(graze ? 0.18 : -0.05, s.yaw + (s.hop > 0 ? Math.sin(s.hop * 9) * 0.4 : 0), 0); _cm.scale.setScalar(s.s); _cm.updateMatrix(); sheep.inst.setMatrixAt(i, _cm.matrix);
  });
  sheep.inst.instanceMatrix.needsUpdate = true;
}

// a ball hit this sheep: it hops, flees away from the ball and shows a heart
export function sheepBonked(s, b) {
  s.hop = 0.8; s.flee = 3.5; const dx = s.x - b.pos.x, dz = s.z - b.pos.z, d = Math.hypot(dx, dz) || 1; s.tx = s.x + dx / d * 4; s.tz = s.z + dz / d * 4; if (!okForSheep(s.tx, s.tz)) { s.tx = s.hx; s.tz = s.hz; } s.wait = 0; spawnIcon('heart', s.x, s.gy + 0.8, s.z, '#fff');
}
