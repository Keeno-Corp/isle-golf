import './rules.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { playerP } from './assets.js';
import { HOLES, heightAt, inland, surfaceAt, BUNKERS } from './course.js';
import { named, scene, std } from './stage.js';
import { canvasTex } from './effects.js';
import { on, addUpdate, addObserve } from './shared.js';
import { CLUBS } from './rules.js';

// ---------------------------------------------------------------- course furniture: flags, cups, tee markers, hole signs
export const playerGLB = await playerP;
export const flagU = { uTime: { value: 0 } };
export const flagMat = std('#d9392b', { roughness: 0.8, side: THREE.DoubleSide });
flagMat.onBeforeCompile = sh => {
  Object.assign(sh.uniforms, flagU);
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\n float fx = position.x / 0.6; transformed.z += sin(uTime * 9.0 - fx * 7.0) * 0.045 * fx; transformed.y += sin(uTime * 7.0 - fx * 5.0 + 1.0) * 0.018 * fx;');
};
export const flagWhite = std('#f6f0de', { roughness: 0.8, side: THREE.DoubleSide });
export const pins = HOLES.map((H) => {
  const g = new THREE.Group(); g.name = 'pin' + (H.i + 1);
  const gy = heightAt(H.pinX, H.pinZ);
  g.position.set(H.pinX, gy, H.pinZ);
  const pole = named(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 1.3, 8), flagWhite), 'pin_pole'); pole.position.y = 0.65; g.add(pole);
  const cloth = new THREE.PlaneGeometry(0.75, 0.3, 10, 2).translate(0.37, 0, 0);
  const flag = named(new THREE.Mesh(cloth, flagMat), 'pin_flag'); flag.position.y = 1.13; flag.castShadow = true; g.add(flag);
  const w = H.wind, ang = w[1] * Math.PI / 180; H.wv = new THREE.Vector2(Math.cos(ang) * w[0], Math.sin(ang) * w[0]);
  flag.rotation.y = -Math.atan2(H.wv.y, H.wv.x); flag.scale.x = 0.55 + 0.1 * w[0];
  const cup = new THREE.Mesh(new THREE.CircleGeometry(0.115, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#16120e', polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); cup.name = 'cup'; cup.position.y = 0.012; g.add(cup);
  const rim = new THREE.Mesh(new THREE.RingGeometry(0.115, 0.15, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#f1ecdc', polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); rim.name = 'cupRim'; rim.position.y = 0.011; g.add(rim);
  const knob = named(new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffd23a' })), 'pin_knob'); knob.position.y = 1.32; g.add(knob);
  g.visible = H.i === 0;
  scene.add(g); H.pinG = g; H.flag = flag; H.pinY = gy;
  return g;
});
{
  const markMat = [std('#f1ecdc'), std('#f1ecdc')];
  const signTex = (n, par) => canvasTex((x, w, h) => { x.fillStyle = '#2f4a3a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#e9d9a0'; x.lineWidth = 5; x.strokeRect(5, 5, w - 10, h - 10); x.fillStyle = '#f2e7b0'; x.font = 'italic 900 70px Impact, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), w * 0.3, h * 0.52); x.font = 'italic 900 26px Impact, sans-serif'; x.fillText('PAR ' + par, w * 0.72, h * 0.52); }, 160, 80);
  for (const H of HOLES) {
    const c = Math.cos(H.teeYaw), s = Math.sin(H.teeYaw);
    for (const k of [-1, 1]) { const px = H.tee[0] - s * 0.72 * k - c * 0.3, pz = H.tee[1] + c * 0.72 * k - s * 0.3; const m = named(new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), std(k < 0 ? '#e8e2cf' : '#e8e2cf')), 'teeMarker'); m.position.set(px, heightAt(px, pz) + 0.06, pz); scene.add(m); }
    const sg = new THREE.Group(); sg.name = 'holeSign' + (H.i + 1);
    const sx = H.tee[0] + s * 1.15 - c * 0.7, sz = H.tee[1] - c * 1.15 - s * 0.7;
    sg.position.set(sx, heightAt(sx, sz), sz); sg.rotation.y = -H.teeYaw + Math.PI / 2 + 0.3;
    const post = named(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.55, 6), std('#6b4a30')), 'sign_post'); post.position.y = 0.27; sg.add(post);
    const board = named(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.23, 0.03), new THREE.MeshStandardMaterial({ map: signTex(H.i + 1, H.par), roughness: 0.85 })), 'sign_board'); board.position.y = 0.6; sg.add(board);
    scene.add(sg);
  }
}

// ---------------------------------------------------------------- only the current hole's pin stands out; dogleg waypoint marker
// Course API (lanes/course.md): aimTarget(H, pos, club) -> {x,z,pin} is the point autoAim() aims at (same rule), the marker stands there when it is not the pin.
export function aimTarget(H, pos, club) {
  const c = CLUBS[club], d = Math.hypot(H.pinX - pos.x, H.pinZ - pos.z);
  if (c.putt || d < Math.max(c.carry * 0.78, 5)) return { x: H.pinX, z: H.pinZ, pin: true };
  let bi = 0, bd = 1e9; H.samp.forEach((s, i) => { const q = (s[0] - pos.x) ** 2 + (s[1] - pos.z) ** 2; if (q < bd) { bd = q; bi = i; } });
  let run = 0;
  for (let i = bi + 1; i < H.samp.length; i++) { run += Math.hypot(H.samp[i][0] - H.samp[i - 1][0], H.samp[i][1] - H.samp[i - 1][1]); if (run > c.carry * 0.8) return { x: H.samp[i][0], z: H.samp[i][1], pin: false }; }
  return { x: H.pinX, z: H.pinZ, pin: true };
}
export const wayMark = new THREE.Group(); wayMark.name = 'waypointMarker'; wayMark.visible = false;
{
  const post = named(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.0, 6), std('#f2e7b0')), 'way_post'); post.position.y = 0.5; wayMark.add(post);
  const dia = named(new THREE.Mesh(new THREE.OctahedronGeometry(0.2), std('#f2c43a', { roughness: 0.6 })), 'way_diamond'); dia.position.y = 1.2; dia.scale.set(1, 1.4, 0.35); wayMark.add(dia);
  const ring = named(new THREE.Mesh(new THREE.RingGeometry(0.3, 0.38, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#f2d43a', transparent: true, opacity: 0.8, depthWrite: false })), 'way_ring'); ring.position.y = 0.04; wayMark.add(ring);
  scene.add(wayMark);
}
// C view: the current pin is drawn 2.6x (pole, flag, knob) with a bright disc under it, so it reads from overhead
const pinRing = named(new THREE.Mesh(new THREE.RingGeometry(1.0, 1.7, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffe04a', transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })), 'pin_ring'); pinRing.visible = false; scene.add(pinRing);
let pinBig = 1;
let curHole = 0, RM = null, wayInfo = null;
const showPin = h => { curHole = h; pinBig = 0; HOLES.forEach(H => { H.pinG.visible = H.i === h; }); };
on('hole:start', ({ hole }) => showPin(hole));
addUpdate(dt => {
  if (!RM) { import('./round.js').then(m => { RM = m; }); return; }
  const G = RM.G, H = HOLES[G.hole]; if (G.hole !== curHole) showPin(G.hole);
  const big = G.overhead && (G.phase === 'aim' || G.phase === 'swing') ? 1 : 1;
  if (big !== pinBig) { pinBig = big; H.pinG.scale.set(big, big, big); }
  pinRing.visible = !!(G.overhead && (G.phase === 'aim' || G.phase === 'swing')); if (pinRing.visible) pinRing.position.set(H.pinX, H.pinY + 0.05, H.pinZ);
  const p = G.players[G.turn];
  if (!p || G.phase === 'title' || G.phase === 'card' || G.phase === 'holed') { wayMark.visible = false; return; }
  const t = aimTarget(H, p.pos, G.club); wayInfo = t;
  const far = Math.hypot(t.x - p.pos.x, t.z - p.pos.z) > 2.5;
  wayMark.visible = !t.pin && far && (G.phase === 'aim' || G.phase === 'intro' || G.phase === 'swing');
  if (wayMark.visible) { wayMark.position.set(t.x, heightAt(t.x, t.z), t.z); wayMark.getObjectByName('way_diamond').rotation.y += dt * 1.6; }
});
addObserve(() => {
  const G = RM && RM.G; const H = HOLES[G ? G.hole : 0]; const pl = G && G.players && G.players[G.turn]; const bp = pl && pl.pos;
  const tx = bp && isFinite(bp.x) ? bp.x : H.tee[0], tz = bp && isFinite(bp.z) ? bp.z : H.tee[1];
  return { course: { cViewCentre: [+((tx + H.pinX) / 2).toFixed(2), +((tz + H.pinZ) / 2).toFixed(2)], cViewSpan: +Math.hypot(H.pinX - tx, H.pinZ - tz).toFixed(1), pinVisible: HOLES.map(h => h.pinG.visible), waypoint: wayInfo && !wayInfo.pin ? [+wayInfo.x.toFixed(2), +wayInfo.z.toFixed(2)] : null } };
});
window.__course = { HOLES, BUNKERS, inland, surfaceAt, heightAt };   // debug handle for the tools
