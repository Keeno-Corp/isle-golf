import './pose.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, lerp, smooth } from './util.js';
import { ST } from './shared.js';
import { HOLES, heightAt } from './course.js';
import { camera } from './stage.js';
import { SIM } from './physics.js';
import { G, curClub, curH, curP } from './round.js';
import { _d0, _hp } from './pose.js';
import { golfer } from './golfer.js';
import { addObserve, addAction } from './shared.js';

// ---------------------------------------------------------------- camera: high behind the ball, narrow FOV; follows the ball in flight; pulls back to the diorama for each flyover
export const cam = { pos: new THREE.Vector3(1, 44, 68), look: new THREE.Vector3(0, 2.2, 1), fov: 26, dio: 1, focus: new THREE.Vector3(), fy: 0.5 };
export const DIO = { pos: new THREE.Vector3(1, 47, 74), look: new THREE.Vector3(0, 2.2, 1), fov: 27 };
export const cPos = new THREE.Vector3(), cLook = new THREE.Vector3();
export function aimCam(pos, look) {
  const p = curP(), putt = curClub().putt, fx = Math.cos(G.aim), fz = Math.sin(G.aim), D = putt ? 3.6 : 9.2, Hh = putt ? 1.8 : 4.7, ah = putt ? 0.9 : 2.2, src = G.phase === 'flight' || G.phase === 'settle' ? G.shotOrigin : p.pos;
  pos.set(src.x - fx * D, src.y + Hh, src.z - fz * D); pos.y = Math.max(pos.y, heightAt(pos.x, pos.z) + 1.0); look.set(src.x + fx * ah, src.y + 0.35, src.z + fz * ah);
}
const _fc = new THREE.PerspectiveCamera(32, 16 / 10, 0.1, 400), _fp = new THREE.Vector3();
export function overheadCam(pos, look, H, from) {
  const mx = (from.x + H.pinX) / 2, mz = (from.z + H.pinZ) / 2, d = Math.hypot(H.pinX - from.x, H.pinZ - from.z), dx = (H.pinX - from.x) / (d || 1), dz = (H.pinZ - from.z) / (d || 1), my = heightAt(mx, mz);
  _fc.aspect = camera.aspect || 1.6; _fc.fov = 32; _fc.updateProjectionMatrix();
  let dist = 9;   // tightest distance that keeps tee and pin inside NDC x ±0.7, y -0.55..0.75
  for (; dist < 90; dist += 1) {
    _fc.position.set(mx - dx * dist * 0.574, my + dist * 0.819, mz - dz * dist * 0.574); _fc.lookAt(mx, my, mz); _fc.updateMatrixWorld(true);
    let ok = true;
    for (const [x, y, z] of [[from.x, from.y ?? heightAt(from.x, from.z), from.z], [H.pinX, (H.pinY ?? heightAt(H.pinX, H.pinZ)) + 0.6, H.pinZ]]) { _fp.set(x, y, z).project(_fc); if (Math.abs(_fp.x) > 0.8 || _fp.y < -0.6 || _fp.y > 0.8) ok = false; }
    if (ok) break;
  }
  pos.set(mx - dx * dist * 0.574, my + dist * 0.819, mz - dz * dist * 0.574); look.set(mx, my, mz);
}
const _m1 = new THREE.Vector3(), _m2 = new THREE.Vector3(), _m3 = new THREE.Vector3();
export const look = { flyoverT: 0 };
export function updateCamera(dt) {
  let fov = 33, k = 4.5, snap = false;
  const H = G.hole < 9 ? curH() : HOLES[0];
  if (G.phase === 'title' || G.phase === 'card') {
    const t = ST.gameTime * 0.12; cPos.set(DIO.pos.x + Math.sin(t) * 7, DIO.pos.y, DIO.pos.z); cLook.copy(DIO.look); fov = DIO.fov; k = 2.5;
    if (G.phase === 'card') { cLook.set((H.tee[0] + H.pinX) / 2 * 0.5, 2.5, (H.tee[1] + H.pinZ) / 2 * 0.5 + 1); }
  } else if (G.phase === 'intro') {
    const u = clamp(G.intro / G.introDur, 0, 1), P = curP(); aimCam(_hp.set(0, 0, 0), _d0.set(0, 0, 0));
    const o1 = new THREE.Vector3(), l1 = new THREE.Vector3(); overheadCam(o1, l1, H, P.pos);
    const mid = _m1.set((P.pos.x * 0.7 + H.pinX * 0.3), 0, (P.pos.z * 0.7 + H.pinZ * 0.3)); mid.y = heightAt(mid.x, mid.z);
    const dd = Math.hypot(H.pinX - P.pos.x, H.pinZ - P.pos.z) || 1, ux = (H.pinX - P.pos.x) / dd, uz = (H.pinZ - P.pos.z) / dd;
    const mp = _m2.set(P.pos.x - ux * 9, P.pos.y + 7, P.pos.z - uz * 9); mp.y = Math.max(mp.y, heightAt(mp.x, mp.z) + 3);
    const ml = _m3.set(P.pos.x + ux * dd * 0.55, heightAt(P.pos.x + ux * dd * 0.55, P.pos.z + uz * dd * 0.55) + 0.5, P.pos.z + uz * dd * 0.55);
    const a = smooth(0, 0.35, u), b = smooth(0.35, 0.68, u), c = smooth(0.68, 1, u);
    cPos.copy(DIO.pos).lerp(o1, a).lerp(mp, b).lerp(_hp, c); cLook.copy(DIO.look).lerp(l1, a).lerp(ml, b).lerp(_d0, c);
    fov = lerp(DIO.fov, 32, a); fov = lerp(fov, 30, b); fov = lerp(fov, 33, c); snap = true; look.flyoverT = u;
    if (G.phase === 'intro' && u < 0.12 && cam.snapTitle) { }
  } else if (G.overhead && G.phase === 'aim') {
    overheadCam(cPos, cLook, H, curP().pos); fov = 32; k = 4;
  } else if (G.phase === 'aim' || G.phase === 'swing') { aimCam(cPos, cLook); k = 5; }
  else if (G.phase === 'holed') { cPos.set(H.pinX + 1.5, H.pinY + 1.0, H.pinZ + 1.9); cLook.set(H.pinX, H.pinY + 0.35, H.pinZ); fov = 24; k = 3; cPos.set(H.pinX + 0.9, H.pinY + 0.55, H.pinZ + 1.3); }
  else {   // flight and settle: behind the ball along its way, close in as it rolls
    const v = SIM.vel, hs = Math.hypot(v.x, v.z), dx = hs > 0.5 ? v.x / hs : Math.cos(G.aim), dz = hs > 0.5 ? v.z / hs : Math.sin(G.aim), putt = curClub().putt || SIM.mode === 'roll' && hs < 4;
    if (hs > 0.5) { cam.fdx = dx; cam.fdz = dz; }
    const fdx = cam.fdx ?? dx, fdz = cam.fdz ?? dz, D = putt ? 3.6 : 7.8, Hh = putt ? 1.8 : 3.9;
    cPos.set(SIM.pos.x - fdx * D, Math.max(SIM.pos.y + Hh, heightAt(SIM.pos.x - fdx * D, SIM.pos.z - fdz * D) + 1.0), SIM.pos.z - fdz * D); cLook.set(SIM.pos.x + fdx * 1.8, SIM.pos.y + 0.1, SIM.pos.z + fdz * 1.8); k = putt ? 4 : 5; const dp = Math.hypot(H.pinX - SIM.pos.x, H.pinZ - SIM.pos.z); if (!putt && dp < 9) { const w = 1 - dp / 9; cLook.x = lerp(cLook.x, H.pinX, w * 0.6); cLook.z = lerp(cLook.z, H.pinZ, w * 0.6); }
  }
  if (snap) { cam.pos.copy(cPos); cam.look.copy(cLook); cam.fov = fov; } else {
    const t = 1 - Math.exp(-dt * k); cam.pos.lerp(cPos, t); cam.look.lerp(cLook, t); cam.fov += (fov - cam.fov) * t;
  }
  camera.position.copy(cam.pos); camera.fov = cam.fov; camera.updateProjectionMatrix(); camera.lookAt(cam.look);
  cam.dio = smooth(14, 40, cam.pos.y);
}

// ---------------------------------------------------------------- look lane observe: pitch, flyover, focus band, screen NDC of ball / pin / golfer
const _p = new THREE.Vector3();
function ndc(x, y, z) { camera.updateMatrixWorld(); _p.set(x, y, z).project(camera); return { x: +_p.x.toFixed(3), y: +_p.y.toFixed(3), on: _p.z < 1 && Math.abs(_p.x) <= 1 && Math.abs(_p.y) <= 1 }; }
addObserve(() => {
  const H = G.hole < 9 ? curH() : HOLES[0], d = new THREE.Vector3(); camera.getWorldDirection(d);
  return { look: { camPitchDeg: +(Math.asin(clamp(-d.y, -1, 1)) * 180 / Math.PI).toFixed(1), flyoverT: +(G.phase === 'intro' ? look.flyoverT : 0).toFixed(3), focusY: +cam.fy.toFixed(3), ball: ndc(SIM.pos.x, SIM.pos.y, SIM.pos.z), pin: ndc(H.pinX, H.pinY + 0.6, H.pinZ), golfer: ndc(golfer.bx ?? 0, (golfer.by ?? 0) + 0.4, golfer.bz ?? 0) } };
});
