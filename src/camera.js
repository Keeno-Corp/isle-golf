import './pose.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, lerp, smooth } from './util.js';
import { ST } from './shared.js';
import { HOLES, heightAt } from './course.js';
import { camera, scene } from './stage.js';
import { SIM } from './physics.js';
import { G, curClub, curH, curP } from './round.js';
import { _d0, _hp } from './pose.js';
import { golfer, clubG } from './golfer.js';
import { addObserve, addAction } from './shared.js';
import { PR } from './stage.js';

// ---------------------------------------------------------------- camera: high behind the ball, narrow FOV; follows the ball in flight; pulls back to the diorama for each flyover
export const cam = { pos: new THREE.Vector3(1, 44, 68), look: new THREE.Vector3(0, 2.2, 1), fov: 26, dio: 1, focus: new THREE.Vector3(), fy: 0.5 };
export const DIO = { pos: new THREE.Vector3(1, 47, 74), look: new THREE.Vector3(0, 2.2, 1), fov: 29 };
export const cPos = new THREE.Vector3(), cLook = new THREE.Vector3();
export function aimCam(pos, look) {
  const p = curP(), putt = curClub().putt, fx = Math.cos(G.aim), fz = Math.sin(G.aim), D = putt ? 4.2 : 9.2, Hh = putt ? 2.5 : 4.7, ah = putt ? 0.9 : 2.2, src = G.phase === 'flight' || G.phase === 'settle' ? G.shotOrigin : p.pos;
  pos.set(src.x - fx * D, src.y + Hh, src.z - fz * D); pos.y = Math.max(pos.y, heightAt(pos.x, pos.z) + 1.0); look.set(src.x + fx * ah, src.y + 0.35, src.z + fz * ah);
}
const _fc = new THREE.PerspectiveCamera(32, 16 / 10, 0.1, 400), _fp = new THREE.Vector3();
const _ohC = new Map();
export function overheadCam(pos, look, H, from) {
  const ck = (H.pinX | 0) + ',' + (H.pinZ | 0) + ',' + from.x.toFixed(1) + ',' + from.z.toFixed(1) + ',' + (camera.aspect || 1.6).toFixed(2), hit = _ohC.get(ck);
  if (hit) { pos.copy(hit.p); look.copy(hit.l); return; }
  const mx = (from.x + H.pinX) / 2, mz = (from.z + H.pinZ) / 2, d = Math.hypot(H.pinX - from.x, H.pinZ - from.z), dx = (H.pinX - from.x) / (d || 1), dz = (H.pinZ - from.z) / (d || 1), my = heightAt(mx, mz);
  _fc.aspect = camera.aspect || 1.6; _fc.fov = 32; _fc.updateProjectionMatrix();
  // broadside: try yaws off the tee->pin line (both sides), keep the pitch at 55 deg, take the tightest fit
  let best = null;
  for (const yaw of [0, 0.5, -0.5, 0.9, -0.9, 1.2, -1.2, 1.4, -1.4]) {
    const c = Math.cos(yaw), sn = Math.sin(yaw), bx = dx * c - dz * sn, bz = dx * sn + dz * c;
    for (let dist = 9; dist < 90; dist += 1) {
      _fc.position.set(mx - bx * dist * 0.574, my + dist * 0.819, mz - bz * dist * 0.574); _fc.lookAt(mx, my, mz); _fc.updateMatrixWorld(true);
      let ok = true;
      for (const [x, y, z] of [[from.x, from.y ?? heightAt(from.x, from.z), from.z], [H.pinX, (H.pinY ?? heightAt(H.pinX, H.pinZ)) + 2.25, H.pinZ]]) { _fp.set(x, y, z).project(_fc); if (Math.abs(_fp.x) > 0.8 || _fp.y < -0.6 || _fp.y > 0.8) ok = false; }
      if (ok) { if (!best || dist < best.dist - 0.5) best = { dist, bx, bz }; break; }
    }
  }
  const dist = best ? best.dist : 60, bx = best ? best.bx : dx, bz = best ? best.bz : dz;
  pos.set(mx - bx * dist * 0.574, my + dist * 0.819, mz - bz * dist * 0.574); look.set(mx, my, mz);
  _ohC.set(ck, { p: pos.clone(), l: look.clone() });
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
    const mp = _m2.set(P.pos.x - ux * 7, P.pos.y + 11, P.pos.z - uz * 7); mp.y = Math.max(mp.y, heightAt(mp.x, mp.z) + 3);
    const ml = _m3.set(P.pos.x + ux * dd * 0.55, heightAt(P.pos.x + ux * dd * 0.55, P.pos.z + uz * dd * 0.55) + 0.5, P.pos.z + uz * dd * 0.55);
    const a = smooth(0, 0.35, u), b = smooth(0.35, 0.68, u), c = smooth(0.6, 1, u);
    cPos.copy(DIO.pos).lerp(o1, a).lerp(mp, b).lerp(_hp, c); cLook.copy(DIO.look).lerp(l1, a).lerp(ml, b).lerp(_d0, c);
    fov = lerp(DIO.fov, 32, a); fov = lerp(fov, 30, b); fov = lerp(fov, 33, c); snap = true; look.flyoverT = u;
    if (G.phase === 'intro' && u < 0.12 && cam.snapTitle) { }
  } else if (G.overhead && G.phase === 'aim') {
    overheadCam(cPos, cLook, H, curP().pos); fov = 32; k = 4;
  } else if (G.phase === 'aim' || G.phase === 'swing') { aimCam(cPos, cLook); k = 5; }
  else if (G.phase === 'holed' || G.phase === 'settle' && SIM.mode === 'sunk') { fov = 30; k = 7; cPos.set(H.pinX + 2.6, H.pinY + 3.0, H.pinZ + 4.0); cLook.set(H.pinX, H.pinY + 0.6, H.pinZ); }
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
  if (!ditherInit) { ditherInit = true; patchAll(); }
  updateDither(Math.round(innerWidth * PR), Math.round(innerHeight * PR));
}
let ditherInit = false;

// ---------------------------------------------------------------- look lane observe: pitch, flyover, focus band, screen NDC of ball / pin / golfer
const _p = new THREE.Vector3();
function ndc(x, y, z) { camera.updateMatrixWorld(); _p.set(x, y, z).project(camera); return { x: +_p.x.toFixed(3), y: +_p.y.toFixed(3), on: _p.z < 1 && Math.abs(_p.x) <= 1 && Math.abs(_p.y) <= 1 }; }
addObserve(() => {
  const H = G.hole < 9 ? curH() : HOLES[0], d = new THREE.Vector3(); camera.getWorldDirection(d);
  return { look: { camPitchDeg: +(Math.asin(clamp(-d.y, -1, 1)) * 180 / Math.PI).toFixed(1), flyoverT: +(G.phase === 'intro' ? look.flyoverT : 0).toFixed(3), focusY: +cam.fy.toFixed(3), ball: ndc(SIM.pos.x, SIM.pos.y, SIM.pos.z), pin: ndc(H.pinX, H.pinY + 0.6, H.pinZ), golfer: ndc(golfer.holder.position.x, golfer.holder.position.y + 0.4, golfer.holder.position.z), dither: ditherState() } };
});

// ---------------------------------------------------------------- Odyssey-style screen-door dithering (was src/dither.js)
// look lane: Odyssey-style screen-door dithering. Opaque materials get a Bayer discard (no alpha blending, no sorting):
//  1. near fade: fragments closer than NEAR1 to the camera dissolve toward the near plane;
//  2. occluder hole: fragments that sit in front of the golfer/ball (by more than MARGIN, above it) inside a soft screen circle around it dissolve.
// Materials are patched once (chained onBeforeCompile + program key), shared uniforms are written by updateDither().

const U = {
  uDS: { value: new THREE.Vector4(0, 0, -9, 0.3) },      // subject ndc x, y, view depth (negative = off), circle radius (ndc y units)
  uDR: { value: new THREE.Vector4(1280, 800, 0, 1.6) },   // render target w, h, subject world y, aspect
  uNearR: { value: new THREE.Vector2(1.3, 3.4) },         // near fade: gone below x, whole above y (view depth)
  uCamW: { value: new THREE.Matrix4() },
};
const MARGIN = 1.3, ABOVE = 0.5;
const VS_DECL = 'varying vec3 vDvp;';
const FS_DECL = `varying vec3 vDvp; uniform vec4 uDS, uDR; uniform vec2 uNearR; uniform mat4 uCamW;
float dBay2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float dBay4(vec2 a){ return dBay2(0.5 * a) * 0.25 + dBay2(a); }`;
const FS_MAIN = `
  float dK = 1.0;
  { float fd = -vDvp.z;
    float nf = smoothstep(uNearR.x, uNearR.y, fd);
    vec2 nd = gl_FragCoord.xy / uDR.xy * 2.0 - 1.0;
    float rr = length((nd - uDS.xy) * vec2(uDR.w, 1.0));
    float wy = (uCamW * vec4(vDvp, 1.0)).y;
    float oc = 1.0;
    if (fd < uDS.z - ${MARGIN.toFixed(2)} && wy > uDR.z + ${ABOVE.toFixed(2)}) oc = smoothstep(uDS.w * 0.55, uDS.w, rr);
    dK = min(nf, oc);
    if (dK < 0.999 && dK <= dBay4(gl_FragCoord.xy)) discard;
  }`;

let patched = 0;
const skipMesh = o => { if (o.name === 'sky' || o.name === 'sea' || /beam|glow|ray|ring|trail|dots|landing|shadow|water/i.test(o.name) || o.isSkinnedMesh && false) return true; if (/^(ball|club|golfer)/i.test(o.name)) return true; for (let p = o; p; p = p.parent) if (p === golfer.holder || p === clubG) return true; return false; };
function patch(m) {
  if (m.userData.__dith || !m.isMaterial || m.transparent || m.depthWrite === false || m.isShaderMaterial && !m.isMeshStandardMaterial) return false;
  m.userData.__dith = true;
  const orig = m.onBeforeCompile, key0 = m.customProgramCacheKey ? m.customProgramCacheKey() : '', crispOK = !m.alphaToCoverage;
  m.onBeforeCompile = (sh, r) => {
    if (orig) orig.call(m, sh, r);
    if (!sh.vertexShader.includes('#include <project_vertex>') || !sh.fragmentShader.includes('void main()') || !sh.vertexShader.includes('#include <common>')) return;
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + VS_DECL).replace('#include <project_vertex>', '#include <project_vertex>\n vDvp = mvPosition.xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + FS_DECL).replace(/void main\(\)\s*\{/, m2 => m2 + FS_MAIN);
    if (crispOK) sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n if (dK < 0.999) gl_FragColor.a = 0.0;');
  };
  m.customProgramCacheKey = () => key0 + '|dither';
  m.needsUpdate = true; patched++; return true;
}
export function patchAll() {
  scene.traverse(o => { if (!o.isMesh || skipMesh(o)) return; for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m) patch(m); });
}

const _s = new THREE.Vector3(), _v = new THREE.Vector3(), _c = new THREE.Vector3(), _sp = new THREE.Sphere();
const info = { occluders: [], nearFades: [], active: false };
let tick = 0;
const OCC = /tree|house|lighthouse|sheep|bell|fence|cow|bush|rock/i;   // cliffFace is one huge mesh: its bounding sphere says nothing about what hides the ball
const _q = new THREE.Vector3(), _mm = new THREE.Matrix4();
let nearCand = [];
const _cv = Array.from({ length: 8 }, () => new THREE.Vector3()), _cp = new THREE.Vector3();
const EDGES = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
function nearVisible(o) {   // oriented box clipped to the near plane: some of it within the fade range and its projected rect overlaps the screen
  if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
  const bb = o.geometry.boundingBox; _mm.multiplyMatrices(camera.matrixWorldInverse, o.matrixWorld);
  let minD = 1e9, maxD = -1e9;
  for (let i = 0; i < 8; i++) { _cv[i].set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(_mm); const d = -_cv[i].z; minD = Math.min(minD, d); maxD = Math.max(maxD, d); }
  if (maxD <= 0.05 || minD >= U.uNearR.value.y) return false;
  let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
  const add = v => { _q.copy(v).applyMatrix4(camera.projectionMatrix); x0 = Math.min(x0, _q.x); x1 = Math.max(x1, _q.x); y0 = Math.min(y0, _q.y); y1 = Math.max(y1, _q.y); };
  for (let i = 0; i < 8; i++) if (-_cv[i].z > 0.05) add(_cv[i]);
  for (const [i, j] of EDGES) { const da = -_cv[i].z - 0.05, db = -_cv[j].z - 0.05; if (da * db < 0) { _cp.lerpVectors(_cv[i], _cv[j], da / (da - db)); add(_cp); } }
  return x1 > -1 && x0 < 1 && y1 > -1 && y0 < 1;
}
function liveNear() { camera.updateMatrixWorld(); const r = []; for (const o of nearCand) { if (o.visible && r.length < 8 && nearVisible(o)) r.push(o.name); } return r; }
export function updateDither(sceneW, sceneH) {
  if (tick++ % 90 === 0) patchAll();
  camera.updateMatrixWorld();
  U.uCamW.value.copy(camera.matrixWorld); U.uDR.value.x = sceneW; U.uDR.value.y = sceneH; U.uDR.value.w = camera.aspect;
  const live = (G.phase === 'aim' || G.phase === 'swing' || G.phase === 'flight' || G.phase === 'settle' || G.phase === 'holed') && !G.overhead;
  info.occluders.length = 0; info.nearFades.length = 0; nearCand = []; info.active = live;
  if (!live) { U.uDS.value.z = -9; return; }
  if (G.phase === 'aim' || G.phase === 'swing') _s.set(golfer.holder.position.x, golfer.holder.position.y + 0.45, golfer.holder.position.z); else _s.copy(SIM.pos);
  _v.copy(_s).applyMatrix4(camera.matrixWorldInverse);
  const depth = -_v.z; _v.copy(_s).project(camera);
  U.uDR.value.z = _s.y - 0.2;
  const th = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  U.uDS.value.set(_v.x, _v.y, depth, THREE.MathUtils.clamp(0.9 / (Math.max(depth, 1) * th), 0.13, 0.4));
  // metadata: which non-instanced props sit on the camera->subject segment (bounding spheres, no triangles) or inside the near fade
  const cp = camera.position, seg = _c.copy(_s).sub(cp), L = seg.length() || 1; seg.multiplyScalar(1 / L);
  scene.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.visible || !OCC.test(o.name) || skipMesh(o)) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    _sp.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld);
    const d = _v.copy(_sp.center).sub(cp), t = d.dot(seg);
    nearCand.push(o);
    if (t > 0 && t < L - MARGIN && d.addScaledVector(seg, -t).length() < _sp.radius && _sp.center.y + _sp.radius > _s.y + ABOVE && info.occluders.length < 8) info.occluders.push(o.name);
  });
}
export const ditherState = () => ({ patched, active: info.active, subjectNdc: [+U.uDS.value.x.toFixed(3), +U.uDS.value.y.toFixed(3)], depth: +U.uDS.value.z.toFixed(2), radius: +U.uDS.value.w.toFixed(3), occluders: info.occluders.slice(), nearFades: info.active ? liveNear() : [] });

