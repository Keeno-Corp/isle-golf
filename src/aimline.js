import './pools.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp } from './util.js';
import { greenOf, heightAt } from './course.js';
import { scene } from './stage.js';
import { play } from './sound.js';
import { CLUBS, LIE, _cm } from './rules.js';
import { setClubLook } from './golfer.js';
import { launchOn, newSim, previewShot, puttRange, stepSim } from './physics.js';
import { G, curClub, curH, curP, pinDist } from './round.js';
import { aimTarget } from './pins.js';
import { needPower } from './hud.js';

// ---------------------------------------------------------------- the aim line and the putting grid
export const aimDots = new THREE.InstancedMesh(new THREE.CircleGeometry(0.085, 10).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fffbe0', transparent: true, opacity: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }), 40);
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
  let club = surf === 'green' || d < 2.3 ? 3 : surf === 'sand' ? (d > 9 ? 1 : 2) : d > 13.4 && (surf === 'tee' || surf === 'fairway') ? 0 : d > 7.0 ? 1 : 2;
  const t = aimTarget(H, p.pos, club), aim = Math.atan2(t.z - p.pos.z, t.x - p.pos.x);
  if (needPower(club, aim) > 1) club = 0;
  return club;
}
export function autoAim() {
  const p = curP(), t = aimTarget(curH(), p.pos, G.club);
  return Math.atan2(t.z - p.pos.z, t.x - p.pos.x);
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
    // the putt preview: roll a ghost ball along the aim at the power that stops it at the cup, so the dots bend with the break
    const pts = puttTrack(p, H, c), n = pts.length;
    for (let i = 0; i < 40; i++) { if (i >= n) { _cm.position.set(0, -50, 0); _cm.scale.setScalar(0.001); } else { _cm.position.set(pts[i][0], heightAt(pts[i][0], pts[i][1]) + 0.03, pts[i][1]); _cm.scale.setScalar(2.4 * (1 - i / n * 0.4)); } _cm.rotation.set(0, 0, 0); _cm.updateMatrix(); aimDots.setMatrixAt(i, _cm.matrix); }
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
export function puttTrack(p, H, c) {
  const d = Math.max(0.5, Math.hypot(H.pinX - p.pos.x, H.pinZ - p.pos.z)), out = [];
  // power for a dead-straight stop at the pin distance, found on the flat-friction formula, then a ghost roll on the real slopes
  const pw = Math.min(1.3, d / puttRange(d) * 1.04), s = newSim(); s.live = false; s.pos.copy(p.pos); launchOn(s, c, pw, 0, G.aim, H, 1); s.pin = { x: 1e9, z: 1e9 };
  let acc = 0, last = [p.pos.x, p.pos.z], n = 0;
  while (s.mode === 'roll' && n++ < 2400 && out.length < 40) { stepSim(s, 1 / 120); acc += Math.hypot(s.pos.x - last[0], s.pos.z - last[1]); last = [s.pos.x, s.pos.z]; if (acc >= 0.3) { acc = 0; out.push([s.pos.x, s.pos.z]); } }
  return out;
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
