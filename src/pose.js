import './hud.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, lerp, smooth, angDiff } from './util.js';
import { heightAt, surfaceAt } from './course.js';
import { crisp } from './post.js';
import { flagMat, flagWhite } from './pins.js';
import { addObserve, addAction, addUpdate, on, ST } from './shared.js';
import { scene, named } from './stage.js';
import { sheepObs, crt } from './sheep.js';
import { cowObs } from './cow.js';
import { kitU, clubG, clubHeadMat, clubMat, golfer, golferShadow, golferClip, retargetPlayer, boneLengthDeviation, UA, FA } from './golfer.js';
import { balls } from './balls.js';
import { G, curP } from './round.js';
[flagMat, flagWhite, clubMat, clubHeadMat, ...balls.map(b => b.m.material)].forEach(crisp);

// ---------------------------------------------------------------- the golfer's pose: the joint hierarchy of golfer.js is posed by hand each frame (no mixer, no bones)
// swing param s: -1 top of the backswing, 0 impact, +0.9 follow-through. The two hands are placed with two-bone IK in the chest's own frame, the club hangs from them.
export const POSE = { lean: 0.55 }; window.POSE = POSE;
export function showGolfer(on) { golfer.holder.visible = on; clubG.visible = on; golferShadow.visible = on; }
export function hideGolfer() { showGolfer(false); }
export function swingParam() {
  if (G.phase === 'swing') { const t = G.swingT; const back = -(0.45 + 0.55 * G.pend.power); return t < 0.2 ? back * (1 - (t / 0.2) ** 2) : Math.min(1, (t - 0.2) / 0.3) * 0.9 * (0.5 + 0.5 * G.pend.power); }
  if (G.phase === 'flight' || G.phase === 'settle') { const t = G.flightT; return 0.9 * (0.5 + 0.5 * (G.pend ? G.pend.power : 1)) * (1 - smooth(1.0, 1.8, t)); }
  if (G.phase === 'aim') return G.m.stage >= 1 ? -(0.7 + 0.3 * Math.sqrt(G.m.power)) * Math.min(1, 0.15 + entryT / 7) : -golfer.pose.back * 0.4;
  return 0;
}
let entryT = 0;   // frames since the meter started, eases the backswing in
const GS = 1.9;   // the golfer's size on screen (holder scale; the club follows)
const STANCE = 0.66;   // how far the golfer stands from the ball (a touch wider than before)
const WALK_SPEED = 3.2;
export function placeGolfer() {
  entryT = G.phase === 'aim' && G.m && G.m.stage >= 1 ? entryT + 1 : 0;
  if (G.phase === 'title' || G.phase === 'card') return;
  const p = curP(), fx = Math.cos(G.aim), fz = Math.sin(G.aim), rx = -fz, rz = fx, ox = G.phase === 'flight' || G.phase === 'settle' ? G.shotOrigin : p.pos;
  const tx = ox.x - rx * STANCE - fx * 0.02, tz = ox.z - rz * STANCE - fz * 0.02, h = golfer.holder;
  let gx = h.position.x, gz = h.position.z; const dx = tx - gx, dz = tz - gz, d = Math.hypot(dx, dz);
  const striking = G.phase !== 'aim' || (G.m && G.m.stage > 0);
  if (golfer.init !== true || d > 25 || striking || (!golfer.walking && d < 1.2)) { gx = tx; gz = tz; golfer.walking = false; golfer.init = true; golfer.yaw = Math.atan2(rx, rz); }
  else if (d < 0.05) { gx = tx; gz = tz; golfer.walking = false; }
  else { golfer.walking = true; const sp = Math.min(d, Math.max(WALK_SPEED, d / 1.8) / 60); gx += dx / d * sp; gz += dz / d * sp; golfer.wdir = Math.atan2(dx, dz); }
  const want = golfer.walking ? golfer.wdir : Math.atan2(rx, rz); golfer.yaw += angDiff(golfer.yaw, want) * (1 - Math.exp(-(golfer.walking ? 14 : 9) / 60));
  h.position.set(gx, heightAt(gx, gz), gz); h.rotation.y = golfer.yaw; h.scale.setScalar(GS);
  golferShadow.position.set(gx + 0.05, h.position.y + 0.02, gz + 0.05);
  golfer.fx = fx; golfer.fz = fz; golfer.bx = ox.x; golfer.bz = ox.z; golfer.by = ox.y;
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const _hp = V(0, 0, 0), _d0 = V(0, 0, 0), _dB = V(0, 0, 0), _dF = V(0, 0, 0), _dir = V(0, 0, 0), _f = V(0, 0, 0), _u = V(0, 1, 0), _r = V(0, 0, 0), _xv = V(0, 0, 0), _t = V(0, 0, 0);
const _ny = V(0, -1, 0), _qa = new THREE.Quaternion(), _p = V(0, 0, 0), _n = V(0, 0, 0), _up = V(0, 0, 0), _fd = V(0, 0, 0), _el = V(0, 0, 0);
// two-bone IK in the chest frame: put the hand at tgt, the elbow bent toward pole
function ik(arm, tgt, pole) {
  const L1 = UA, L2 = FA + 0.012, A = arm.A, E = arm.E; _p.copy(A.position); _t.copy(tgt).sub(_p);
  const d = clamp(_t.length(), 0.06, (L1 + L2) * 0.995); _t.normalize();
  const ca = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
  _n.copy(pole).addScaledVector(_t, -pole.dot(_t)); if (_n.lengthSq() < 1e-6) _n.set(0, 0, -1); _n.normalize();
  _up.copy(_t).multiplyScalar(ca).addScaledVector(_n, sa);
  _el.copy(_p).addScaledVector(_up, L1); _fd.copy(_p).addScaledVector(_t, d).sub(_el).normalize();
  A.quaternion.setFromUnitVectors(_ny, _up);
  _qa.copy(A.quaternion).invert(); _fd.applyQuaternion(_qa); E.quaternion.setFromUnitVectors(_ny, _fd);
}
const lerpV = (a, b, k) => a.clone().lerp(b, k);
const ADDR = V(0, -0.03, 0.2), TOP = V(-0.09, 0.6, -0.02), FOLLOW = V(0.1, 0.4, 0.05);
const POLE_R = V(-0.6, -0.5, -0.5), POLE_L = V(0.6, -0.5, -0.5);
const hold = new Set();
export function updateGolfer(dt) {
  if (!golfer.holder.visible) return;
  golfer.t += dt; const G_ = golfer, id = clubG.userData.head.userData.id, putt = id === 'putter';
  const clip = golfer.cur, w = clamp(golfer.t / Math.max(0.01, golfer.fade || 0.2), 0, 1), we = w * w * (3 - 2 * w), tt = ST.gameTime;
  const walking = !!golfer.walking && clip === 'Idle_Loop'; golfer.walk += ((walking ? 1 : 0) - golfer.walk) * (1 - Math.exp(-dt * 8)); if (walking) golfer.ph += dt * 8.5;
  let s = swingParam() * (putt ? 0.28 : 1);
  // the swing pose (also the address and the waggle)
  const wag = (G.phase === 'aim' && (!G.m || G.m.stage === 0) ? Math.sin(tt * 2.2) * 0.012 : 0);
  let P = { lean: (putt ? POSE.lean + 0.2 : POSE.lean) + 0.05 * Math.abs(s), hipY: s * 0.5, spY: s * 1.0, headY: -s * 0.6, headX: 0.38, drop: putt ? 0.01 : 0.03, bend: putt ? 0.28 : 0.4, bodyY: 0, bodyZ: 0, sway: s * 0.02 };
  const k = s < 0 ? clamp(-s * 1.35, 0, 1) : clamp(s / 0.9, 0, 1), tgt = s < 0 ? TOP : FOLLOW, sc = putt ? 0.3 : 1;
  const hand = ADDR.clone().lerp(tgt, k * (putt ? 0.3 : 1)); hand.z += wag;
  let hR = hand.clone().add(V(-0.025, 0, 0)), hL = hand.clone().add(V(0.03, 0.01, 0)), mode = 'swing', polR = POLE_R, polL = POLE_L, hang = 0, hipSway = 0;
  // other moods layered over it: the celebration, the dance, the dismay, the walk
  const Q = { lean: P.lean, hipY: P.hipY, spY: P.spY, headX: P.headX, headY: P.headY, drop: P.drop, bend: P.bend, bodyY: 0, bodyZ: 0, sway: 0, hR, hL, mode: 'swing', spZ: 0 };
  if (clip === 'Celebration') {
    const j = Math.abs(Math.sin(tt * 7)); Object.assign(Q, { lean: -0.12, hipY: Math.sin(tt * 7) * 0.2, spY: Math.sin(tt * 7) * 0.3, headX: -0.25, headY: 0, drop: 0, bend: 0.15 + 0.2 * (1 - j), bodyY: j * 0.1, sway: 0, mode: 'up', spZ: Math.sin(tt * 3.5) * 0.08,
      hR: V(-0.16, 0.5 + Math.sin(tt * 14) * 0.03, 0.04), hL: V(0.16, 0.5 + Math.sin(tt * 14 + 1) * 0.03, 0.04) });
  } else if (clip === 'Dance_Loop') {
    const b = Math.sin(tt * 6), c = Math.cos(tt * 6);
    Object.assign(Q, { lean: 0.05, hipY: b * 0.35, spY: -b * 0.3, headX: 0.05, headY: c * 0.2, drop: 0, bend: 0.3 + 0.12 * Math.abs(b), bodyY: Math.abs(c) * 0.025, sway: b * 0.05, mode: 'up', spZ: c * 0.1,
      hR: V(-0.2, 0.14 + Math.max(0, b) * 0.3, 0.08), hL: V(0.2, 0.14 + Math.max(0, -b) * 0.3, 0.08) });
  } else if (clip === 'Dismay') {
    const sh = Math.sin(tt * 3) * 0.04;
    Object.assign(Q, { lean: 0.7, hipY: 0, spY: sh, headX: 0.7, headY: Math.sin(tt * 2.2) * 0.35, drop: 0.04, bend: 0.2, bodyY: 0, sway: 0, mode: 'hang', spZ: 0,
      hR: V(-0.115, -0.08, 0.04), hL: V(0.115, -0.08, 0.04) });
  } else if (golfer.walk > 0.02) {
    const sw = Math.sin(golfer.ph), a = golfer.walk;
    Object.assign(Q, { lean: lerp(P.lean, 0.08, a), hipY: lerp(P.hipY, sw * 0.18, a), spY: lerp(P.spY, -sw * 0.25, a), headX: lerp(P.headX, 0.05, a), headY: lerp(P.headY, 0, a), drop: lerp(P.drop, 0, a), bend: lerp(P.bend, 0.12, a), bodyY: Math.abs(Math.cos(golfer.ph)) * 0.02 * a, mode: a > 0.5 ? 'carry' : 'swing',
      hR: lerpV(hR, V(-0.11, -0.09, 0.02 + Math.cos(golfer.ph) * 0.07), a), hL: lerpV(hL, V(0.11, -0.09, 0.02 - Math.cos(golfer.ph) * 0.07), a) });
  }
  // blend clip moods in
  const mixed = (clip === 'Celebration' || clip === 'Dance_Loop' || clip === 'Dismay');
  const m = mixed ? we : 1, R = {};
  for (const n of ['lean', 'hipY', 'spY', 'headX', 'headY', 'drop', 'bend', 'bodyY', 'sway', 'spZ']) R[n] = lerp(P[n] ?? 0, Q[n] ?? 0, m);
  const tR = lerpV(hR, Q.hR, m), tL = lerpV(hL, Q.hL, m);
  // joints
  const g = golfer, hips = g.hips, spine = g.spine, body = g.body;
  body.position.set(R.sway, -R.drop + R.bodyY, 0); hips.rotation.set(0, R.hipY, 0); spine.rotation.set(R.lean, R.spY, R.spZ); g.head.rotation.set(R.headX - R.lean * 0.7, R.headY, 0);
  const sw2 = Math.sin(golfer.ph) * golfer.walk;
  for (const L of g.legs) {
    const sd = L.side, ph = sw2 * sd, lift = Math.max(0, Math.cos(golfer.ph + (sd > 0 ? 0 : Math.PI))) * golfer.walk;
    const a = R.bend * 0.5 + ph * 0.55, spread = 0.12 * (1 - golfer.walk * 0.7);
    L.th.rotation.set(-a, 0, sd * spread); L.kn.rotation.set(R.bend + lift * 0.55 + Math.max(0, -ph) * 0.3 - (a - R.bend * 0.5) * 0.2, 0, -sd * spread); L.ft.rotation.set(-(L.th.rotation.x + L.kn.rotation.x), 0, 0);
  }
  if (!clip.startsWith('Idle') || !walking) { /* feet stay planted in the stance */ }
  body.updateMatrixWorld(true);
  // arms: hands to the club, elbows out and down
  const R_ = g.arms[0], L_ = g.arms[1]; ik(R_, tR, polR); ik(L_, tL, polL);
  spine.updateMatrixWorld(true);
  _hp.copy(retargetPlayer(tR, tL));
  // the club: from the hands to the ball at address, back and up, then through
  _f.set(g.fx, 0, g.fz); _r.set(-g.fz, 0, g.fx);
  const L0 = clubG.userData.len * 0.55;
  if (mode === 'swing' && (Q.mode === 'swing')) {
    _d0.set(g.bx, g.by + 0.02, g.bz).sub(_hp); const toBall = _d0.length(); _d0.normalize();
    _dB.copy(_f).multiplyScalar(-0.7).addScaledVector(_u, 0.8).addScaledVector(_r, -0.25).normalize();
    _dF.copy(_f).multiplyScalar(0.65).addScaledVector(_u, 0.7).addScaledVector(_r, 0.2).normalize();
    const a = Math.abs(s) * (putt ? 2.2 : 1); _dir.copy(_d0).lerp(s < 0 ? _dB : _dF, Math.min(1, a)).normalize();
    var Lc = lerp(L0, clamp(toBall, 0.3, 0.9), 1 - Math.min(1, a * 1.4));
  } else {
    // up: the club held aloft; hang: dropped, trailing toward the ground; carry: down at the side
    if (Q.mode === 'up') _dir.copy(_u).multiplyScalar(0.9).addScaledVector(_r, Math.sin(tt * 6) * 0.35).addScaledVector(_f, 0.2).normalize();
    else if (Q.mode === 'hang') _dir.set(0, -1, 0).addScaledVector(_f, 0.35).normalize();
    else _dir.set(0, -0.8, 0).addScaledVector(_f, 0.5).addScaledVector(_r, -0.1).normalize();
    var Lc = L0;
    if (mixed && we < 1) { _d0.set(g.bx, g.by + 0.02, g.bz).sub(_hp).normalize(); _dir.lerpVectors(_d0, _dir, we).normalize(); }
  }
  clubG.position.copy(_hp); clubG.scale.setScalar(GS);
  clubG.quaternion.setFromUnitVectors(_ny, _dir);
  Lc /= GS; clubG.userData.shaft.scale.y = Lc; clubG.userData.head.position.y = -Lc - 0.02;
  _xv.set(1, 0, 0).applyQuaternion(clubG.quaternion); const want = _f.clone().addScaledVector(_dir, -_f.dot(_dir)).normalize();
  const ang = Math.atan2(_xv.clone().cross(want).dot(_dir), _xv.dot(want)); clubG.rotateOnWorldAxis(_dir, ang);
}
// the reactions after a hole-out and a ball in the water or out of bounds: a dismay clip (the celebration and the dance are round.js's)
on('holed', e => { if (/BOGEY|^\+/.test(e.result || '')) golferClip('Dismay', 0.3); });
on('ball:water', () => golferClip('Dismay', 0.35));
on('ball:ob', () => golferClip('Dismay', 0.35));

// ---------------------------------------------------------------- the one observe key of this lane (COORDINATION.md): creatures
const poseNm = () => { const s = swingParam(); return G.phase === 'swing' ? (G.swingT < 0.2 ? 'downswing' : 'follow') : (G.phase === 'meter' || G.phase === 'aim') && G.m.stage >= 1 && G.m.stage < 3 ? 'backswing' : G.phase === 'flight' || G.phase === 'settle' ? 'follow' : 'address'; };
addObserve(() => ({ creatures: { golferClip: ['Celebration', 'Dance_Loop', 'Dismay', 'Walk'].includes(golfer.cur) ? golfer.cur : ['aim', 'meter', 'swing', 'flight', 'settle'].includes(G.phase) ? poseNm() : golfer.cur, poseName: poseNm(), shirt: '#' + kitU.uJersey.value.getHexString(), shirtColour: '#' + kitU.uJersey.value.getHexString(), swingT: +(G.swingT || 0).toFixed(2), pose: +swingParam().toFixed(2), clubHead: clubG.userData.head.userData.id || '', footballer: { x: +golfer.holder.position.x.toFixed(2), z: +golfer.holder.position.z.toFixed(2), clip: golfer.cur, visible: golfer.holder.visible, ready: true, maxBoneLengthDeviation: boneLengthDeviation() }, cow: cowObs(), ...sheepObs() } }));

// The footballer's bones follow the same pose rig as the club's hand IK.
export const foot = { g: golfer.holder, ready: true };
// the two ball shadows share a face plane (z-fighting): give the second its own material, pulled toward the camera
{ let fixed = false; addUpdate(() => { if (fixed) return; const s = scene.getObjectByName('ballShadow2'); if (!s) return; s.material = s.material.clone(); s.material.polygonOffset = true; s.material.polygonOffsetFactor = -1; s.material.polygonOffsetUnits = -1; fixed = true; }); }
