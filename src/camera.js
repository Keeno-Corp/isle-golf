import './pose.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, lerp, smooth } from './util.js';
import { ST } from './shared.js';
import { HOLES, heightAt } from './course.js';
import { camera } from './stage.js';
import { SIM } from './physics.js';
import { G, curClub, curH, curP } from './round.js';
import { _d0, _hp } from './pose.js';

// ---------------------------------------------------------------- camera: high behind the ball, narrow FOV; follows the ball in flight; pulls back to the diorama for each flyover
export const cam = { pos: new THREE.Vector3(1, 44, 68), look: new THREE.Vector3(0, 2.2, 1), fov: 26, dio: 1, focus: new THREE.Vector3(), fy: 0.5 };
export const DIO = { pos: new THREE.Vector3(1, 47, 74), look: new THREE.Vector3(0, 2.2, 1), fov: 27 };
export const cPos = new THREE.Vector3(), cLook = new THREE.Vector3();
export function aimCam(pos, look) {
  const p = curP(), putt = curClub().putt, fx = Math.cos(G.aim), fz = Math.sin(G.aim), D = putt ? 2.9 : 7.6, Hh = putt ? 1.5 : 3.9, ah = putt ? 1.6 : 4.2, src = G.phase === 'flight' || G.phase === 'settle' ? G.shotOrigin : p.pos;
  pos.set(src.x - fx * D, src.y + Hh, src.z - fz * D); pos.y = Math.max(pos.y, heightAt(pos.x, pos.z) + 1.0); look.set(src.x + fx * ah, src.y + 0.12, src.z + fz * ah);
}
export function overheadCam(pos, look, H, from) {
  const mx = (from.x + H.pinX) / 2, mz = (from.z + H.pinZ) / 2, d = Math.hypot(H.pinX - from.x, H.pinZ - from.z), dx = (H.pinX - from.x) / (d || 1), dz = (H.pinZ - from.z) / (d || 1), dist = Math.max(14, d * 1.55 + 9);
  pos.set(mx - dx * dist * 0.5, heightAt(mx, mz) + dist * 0.72, mz - dz * dist * 0.5); look.set(mx, heightAt(mx, mz), mz);
}
export function updateCamera(dt) {
  let fov = 30, k = 4.5, snap = false;
  const H = G.hole < 9 ? curH() : HOLES[0];
  if (G.phase === 'title' || G.phase === 'card') {
    const t = ST.gameTime * 0.12; cPos.set(DIO.pos.x + Math.sin(t) * 7, DIO.pos.y, DIO.pos.z); cLook.copy(DIO.look); fov = DIO.fov; k = 2.5;
    if (G.phase === 'card') { cLook.set((H.tee[0] + H.pinX) / 2 * 0.5, 2.5, (H.tee[1] + H.pinZ) / 2 * 0.5 + 1); }
  } else if (G.phase === 'intro') {
    const u = clamp(G.intro / G.introDur, 0, 1), P = curP(); aimCam(_hp.set(0, 0, 0), _d0.set(0, 0, 0));
    const o1 = new THREE.Vector3(), l1 = new THREE.Vector3(); overheadCam(o1, l1, H, P.pos);
    const a = smooth(0, 0.5, u), b = smooth(0.5, 1, u);
    cPos.copy(DIO.pos).lerp(o1, a).lerp(_hp, b); cLook.copy(DIO.look).lerp(l1, a).lerp(_d0, b); fov = lerp(DIO.fov, 32, a); fov = lerp(fov, 30, b); snap = true;
    if (G.phase === 'intro' && u < 0.12 && cam.snapTitle) { }
  } else if (G.overhead && G.phase === 'aim') {
    overheadCam(cPos, cLook, H, curP().pos); fov = 32; k = 4;
  } else if (G.phase === 'aim' || G.phase === 'swing') { aimCam(cPos, cLook); k = 5; }
  else if (G.phase === 'holed') { cPos.set(H.pinX + 1.5, H.pinY + 1.0, H.pinZ + 1.9); cLook.set(H.pinX, H.pinY + 0.35, H.pinZ); fov = 28; k = 3; }
  else {   // flight and settle: behind the ball along its way, close in as it rolls
    const v = SIM.vel, hs = Math.hypot(v.x, v.z), dx = hs > 0.5 ? v.x / hs : Math.cos(G.aim), dz = hs > 0.5 ? v.z / hs : Math.sin(G.aim), putt = curClub().putt || SIM.mode === 'roll' && hs < 4;
    if (hs > 0.5) { cam.fdx = dx; cam.fdz = dz; }
    const fdx = cam.fdx ?? dx, fdz = cam.fdz ?? dz, D = putt ? 3.0 : 6.4, Hh = putt ? 1.5 : 3.2;
    cPos.set(SIM.pos.x - fdx * D, Math.max(SIM.pos.y + Hh, heightAt(SIM.pos.x - fdx * D, SIM.pos.z - fdz * D) + 1.0), SIM.pos.z - fdz * D); cLook.set(SIM.pos.x + fdx * 1.8, SIM.pos.y + 0.1, SIM.pos.z + fdz * 1.8); k = putt ? 4 : 3.2;
  }
  if (snap) { cam.pos.copy(cPos); cam.look.copy(cLook); cam.fov = fov; } else {
    const t = 1 - Math.exp(-dt * k); cam.pos.lerp(cPos, t); cam.look.lerp(cLook, t); cam.fov += (fov - cam.fov) * t;
  }
  camera.position.copy(cam.pos); camera.fov = cam.fov; camera.updateProjectionMatrix(); camera.lookAt(cam.look);
  cam.dio = smooth(14, 40, cam.pos.y);
}
