import './pools.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp } from './util.js';
import { greenOf, heightAt } from './course.js';
import { scene } from './stage.js';
import { play } from './sound.js';
import { CLUBS, LIE, _cm } from './rules.js';
import { setClubLook } from './golfer.js';
import { previewShot } from './physics.js';
import { G, curClub, curH, curP, pinDist } from './round.js';

// ---------------------------------------------------------------- the aim line and the putting grid
export const aimDots = new THREE.InstancedMesh(new THREE.CircleGeometry(0.055, 8).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fff6c8', transparent: true, opacity: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }), 40);
aimDots.name = 'aimDots'; aimDots.frustumCulled = false; aimDots.renderOrder = 3; scene.add(aimDots);
export const aimRing = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.28, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#f2d43a', transparent: true, opacity: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
aimRing.name = 'aimLanding'; aimRing.renderOrder = 3; scene.add(aimRing);
export const arrowShape = new THREE.Shape(); arrowShape.moveTo(0.2, 0); arrowShape.lineTo(-0.05, 0.12); arrowShape.lineTo(-0.05, 0.04); arrowShape.lineTo(-0.2, 0.04); arrowShape.lineTo(-0.2, -0.04); arrowShape.lineTo(-0.05, -0.04); arrowShape.lineTo(-0.05, -0.12); arrowShape.closePath();
export const slopeGrid = new THREE.InstancedMesh(new THREE.ShapeGeometry(arrowShape).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.6, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }), 120);
slopeGrid.name = 'slopeGrid'; slopeGrid.frustumCulled = false; slopeGrid.renderOrder = 3; slopeGrid.visible = false; scene.add(slopeGrid);
export const gridLines = (() => {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 2 * 12 * 12 * 3), 3));
  const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#f3f0d0', transparent: true, opacity: 0.3, depthWrite: false })); l.name = 'slopeGridLines'; l.frustumCulled = false; l.renderOrder = 3; l.visible = false; scene.add(l); return l; })();
export function autoClub() {
  const p = curP(), H = curH(), d = pinDist(p.pos, H), surf = p.surf;
  if (surf === 'green' || d < 2.3) return 3;
  if (surf === 'sand') return d > 9 ? 1 : 2;
  if (d > 13.4 && (surf === 'tee' || surf === 'fairway')) return 0;
  if (d > 7.0) return 1;
  return 2;
}
export function autoAim() {
  const p = curP(), H = curH(), d = pinDist(p.pos, H), c = CLUBS[G.club];
  if (c.putt || d < Math.max(c.carry * 0.78, 5)) return Math.atan2(H.pinZ - p.pos.z, H.pinX - p.pos.x);
  // a long way out: follow the fairway round its corner, as far along it as the club carries
  let bi = 0, bd = 1e9; H.samp.forEach((s, i) => { const q = (s[0] - p.pos.x) ** 2 + (s[1] - p.pos.z) ** 2; if (q < bd) { bd = q; bi = i; } });
  let tx = H.pinX, tz = H.pinZ, run = 0;
  for (let i = bi + 1; i < H.samp.length; i++) { run += Math.hypot(H.samp[i][0] - H.samp[i - 1][0], H.samp[i][1] - H.samp[i - 1][1]); if (run > c.carry * 0.8) { tx = H.samp[i][0]; tz = H.samp[i][1]; break; } }
  return Math.atan2(tz - p.pos.z, tx - p.pos.x);
}
export function onClubChanged() {
  const c = curClub(); setClubLook(c); slopeGrid.visible = gridLines.visible = c.putt && (G.phase === 'aim' || G.phase === 'intro'); if (c.putt) buildSlopeGrid(); updateAimLine();
}
export function cycleClub(d) { if (G.phase !== 'aim' || G.m.stage) return; G.club = (G.club + d + CLUBS.length) % CLUBS.length; onClubChanged(); play('tick'); }
export function lieMul() { const s = curP().surf; return LIE[s] ?? 1; }
// A/D or arrows held: turn the aim (Shift for fine)
export function holdAim(dt) {
  if (G.m.stage) return;
  const kk = G.keysHeld, d = ((kk.KeyD || kk.ArrowRight) ? 1 : 0) - ((kk.KeyA || kk.ArrowLeft) ? 1 : 0);
  if (d) { G.aim += d * dt * ((kk.ShiftLeft || kk.ShiftRight) ? 0.18 : 0.75); updateAimLine(); if (curClub().putt) buildSlopeGrid(); }
}
export function updateAimLine() {
  const p = curP(), H = curH(), c = curClub(), track = [];
  if (c.putt) {
    const n = 16; for (let i = 0; i < 40; i++) { if (i >= n) { _cm.position.set(0, -50, 0); _cm.scale.setScalar(0.001); _cm.updateMatrix(); aimDots.setMatrixAt(i, _cm.matrix); continue; }
      const d = 0.35 + i * 0.3, x = p.pos.x + Math.cos(G.aim) * d, z = p.pos.z + Math.sin(G.aim) * d; _cm.position.set(x, heightAt(x, z) + 0.03, z); _cm.rotation.set(0, 0, 0); _cm.scale.setScalar(1 - i / n * 0.5); _cm.updateMatrix(); aimDots.setMatrixAt(i, _cm.matrix); }
    aimRing.visible = false;
  } else {
    const end = previewShot(c, G.aim, 1, H, p.pos, lieMul(), track), N = Math.min(40, track.length + 1);
    for (let i = 0; i < 40; i++) {
      if (i >= track.length) { _cm.position.set(0, -50, 0); _cm.scale.setScalar(0.001); } else { const [x, z] = track[i]; _cm.position.set(x, heightAt(x, z) + 0.035, z); _cm.scale.setScalar(0.9); }
      _cm.rotation.set(0, 0, 0); _cm.updateMatrix(); aimDots.setMatrixAt(i, _cm.matrix);
    }
    aimRing.visible = true; aimRing.position.set(end.x, heightAt(end.x, end.z) + 0.04, end.z);
  }
  aimDots.instanceMatrix.needsUpdate = true; aimDots.visible = G.phase === 'aim' || G.phase === 'intro';
}
export function buildSlopeGrid() {
  const p = curP(), H = curH(), cx = (p.pos.x + H.pinX) / 2, cz = (p.pos.z + H.pinZ) / 2; let k = 0;
  const half = Math.min(3.0, Math.max(1.4, pinDist(p.pos, H) / 2 + 0.8)), step = 0.6, mat = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pp = new THREE.Vector3(), col = new THREE.Color();
  const lp = gridLines.geometry.attributes.position; let li = 0;
  for (let gx = -half; gx <= half + 1e-3; gx += step) for (let gz = -half; gz <= half + 1e-3; gz += step) {
    const x = cx + gx, z = cz + gz; if (k >= 120) break; if (!greenOf(x, z)) continue;
    const e = 0.1, h0 = heightAt(x, z), sx = (heightAt(x + e, z) - h0) / e, sz = (heightAt(x, z + e) - h0) / e, m = Math.hypot(sx, sz);
    const ang = Math.atan2(-sz, -sx);   // downhill
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -ang); s.setScalar(0.32 + Math.min(0.5, m * 8)); pp.set(x, h0 + 0.035, z); slopeGrid.setMatrixAt(k, mat.compose(pp, q, s));
    col.set('#f6f0cf').lerp(new THREE.Color('#ff9a3a'), clamp(m * 12, 0, 1)); slopeGrid.setColorAt(k, col); k++;
    if (li < 12 * 12 * 2 * 2 * 3 - 12) { const hx = step / 2; const a = [[x - hx, z - hx, x + hx, z - hx], [x - hx, z - hx, x - hx, z + hx]]; for (const [x0, z0, x1, z1] of a) { lp.setXYZ(li++, x0, heightAt(x0, z0) + 0.03, z0); lp.setXYZ(li++, x1, heightAt(x1, z1) + 0.03, z1); } }
  }
  for (; k < 120; k++) { s.setScalar(0.0001); slopeGrid.setMatrixAt(k, mat.compose(pp.set(0, -50, 0), q.identity(), s)); }
  for (; li < lp.count; li++) lp.setXYZ(li, 0, -50, 0);
  slopeGrid.instanceMatrix.needsUpdate = true; if (slopeGrid.instanceColor) slopeGrid.instanceColor.needsUpdate = true; lp.needsUpdate = true;
}
