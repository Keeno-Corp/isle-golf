import './hud.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, lerp, smooth } from './util.js';
import { heightAt } from './course.js';
import { crisp } from './post.js';
import { flagMat, flagWhite } from './pins.js';
import { clubG, clubHeadMat, clubMat, golfer, golferShadow } from './golfer.js';
import { balls } from './balls.js';
import { G, curP } from './round.js';
[flagMat, flagWhite, clubMat, clubHeadMat, ...balls.map(b => b.m.material)].forEach(crisp);

// ---------------------------------------------------------------- the golfer's pose: address, backswing, through; bones are nudged after the clip's own pose each frame
export const POSE = { lean: 0.42, twist: 0.9, armR: [0, 0, 0], armL: [0, 0, 0], foreR: [0, 0, 0], foreL: [0, 0, 0] }; window.POSE = POSE;
export const _q = new THREE.Quaternion(), _ax = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
export function rotBone(name, axis, a) { const b = golfer.bones[name]; if (!b || !a) return; b.quaternion.multiply(_q.setFromAxisAngle(_ax[axis], a)); }
export function showGolfer(on) { golfer.holder.visible = on; clubG.visible = on; golferShadow.visible = on; }
export function hideGolfer() { showGolfer(false); }
export function swingParam() {
  if (G.phase === 'swing') { const t = G.swingT; const back = -(0.45 + 0.55 * G.pend.power); return t < 0.2 ? back * (1 - (t / 0.2) ** 2) : Math.min(1, (t - 0.2) / 0.3) * 0.9 * (0.5 + 0.5 * G.pend.power); }
  if (G.phase === 'flight' || G.phase === 'settle') { const t = G.flightT; return 0.9 * (0.5 + 0.5 * (G.pend ? G.pend.power : 1)) * (1 - smooth(1.0, 1.8, t)); }
  if (G.phase === 'aim') return -golfer.pose.back * (0.45 + 0.55 * G.m.power) * 0.9 + 0 * 1;
  return 0;
}
export function placeGolfer() {
  if (G.phase === 'title' || G.phase === 'card') return;
  const p = curP(), fx = Math.cos(G.aim), fz = Math.sin(G.aim), rx = -fz, rz = fx, ox = G.phase === 'flight' || G.phase === 'settle' ? G.shotOrigin : p.pos;
  const gx = ox.x - rx * 0.46 - fx * 0.02, gz = ox.z - rz * 0.46 - fz * 0.02;
  golfer.holder.position.set(gx, heightAt(gx, gz), gz); golfer.holder.rotation.y = Math.atan2(rx, rz);
  golferShadow.position.set(gx + 0.05, golfer.holder.position.y + 0.02, gz + 0.05);
  golfer.fx = fx; golfer.fz = fz; golfer.bx = ox.x; golfer.bz = ox.z; golfer.by = ox.y;
}
export const _hp = new THREE.Vector3(), _d0 = new THREE.Vector3(), _dB = new THREE.Vector3(), _dF = new THREE.Vector3(), _dir = new THREE.Vector3(), _f = new THREE.Vector3(), _u = new THREE.Vector3(0, 1, 0), _r = new THREE.Vector3(), _q2 = new THREE.Quaternion(), _xv = new THREE.Vector3();
export function updateGolfer(dt) {
  if (!golfer.holder.visible) return;
  if (!golfer.rest) { golfer.rest = {}; for (const n of ['DEF-hips', 'DEF-spine001', 'DEF-spine002', 'DEF-upper_armR', 'DEF-upper_armL', 'DEF-forearmR', 'DEF-forearmL']) golfer.rest[n] = golfer.bones[n].quaternion.clone(); }
  for (const n in golfer.rest) golfer.bones[n].quaternion.copy(golfer.rest[n]);   // the clip rewrites what it animates; the rest are put back before the nudges
  golfer.mixer.update(dt);
  const s = swingParam(), B = golfer.bones;
  // lean over the ball, hands together; the body winds back and unwinds with the swing
  rotBone('DEF-hips', 'y', -s * 0.35); rotBone('DEF-spine001', 'x', POSE.lean * 0.5); rotBone('DEF-spine002', 'x', POSE.lean * 0.5); rotBone('DEF-spine001', 'y', -s * POSE.twist * 0.5); rotBone('DEF-spine002', 'y', -s * POSE.twist * 0.6);
  for (const [n, v] of [['DEF-upper_armR', POSE.armR], ['DEF-upper_armL', POSE.armL], ['DEF-forearmR', POSE.foreR], ['DEF-forearmL', POSE.foreL]]) { rotBone(n, 'x', v[0]); rotBone(n, 'y', v[1]); rotBone(n, 'z', v[2]); }
  golfer.holder.updateMatrixWorld(true);
  if (!B['DEF-handR']) return;
  B['DEF-handR'].getWorldPosition(_hp);
  _f.set(golfer.fx, 0, golfer.fz); _r.set(-golfer.fz, 0, golfer.fx);
  _d0.set(golfer.bx, golfer.by + 0.02, golfer.bz).sub(_hp); const toBall = _d0.length(); _d0.normalize();
  _dB.copy(_f).multiplyScalar(-0.7).addScaledVector(_u, 0.8).addScaledVector(_r, -0.25).normalize();
  _dF.copy(_f).multiplyScalar(0.65).addScaledVector(_u, 0.7).addScaledVector(_r, 0.2).normalize();
  const a = Math.abs(s); _dir.copy(_d0); const tgt = s < 0 ? _dB : _dF;
  _dir.lerp(tgt, Math.min(1, a)).normalize();
  const L = clubG.userData.len * 0.55; const Lc = lerp(L, clamp(toBall, 0.3, 0.9), 1 - Math.min(1, a * 1.4));
  clubG.position.copy(_hp); clubG.scale.setScalar(1);
  clubG.quaternion.setFromUnitVectors(_ax.y.clone().negate(), _dir);
  clubG.userData.shaft.scale.y = Lc; clubG.userData.head.position.y = -Lc - 0.02;
  _xv.set(1, 0, 0).applyQuaternion(clubG.quaternion); const want = _f.clone().addScaledVector(_dir, -_f.dot(_dir)).normalize();
  const ang = Math.atan2(_xv.clone().cross(want).dot(_dir), _xv.dot(want)); clubG.rotateOnWorldAxis(_dir, ang);
}
