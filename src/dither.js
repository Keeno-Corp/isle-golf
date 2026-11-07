// Made with paprika3d · https://paprika3d.com
// look lane: Odyssey-style screen-door dithering. Opaque materials get a Bayer discard (no alpha blending, no sorting):
//  1. near fade: fragments closer than NEAR1 to the camera dissolve toward the near plane;
//  2. occluder hole: fragments that sit in front of the golfer/ball (by more than MARGIN, above it) inside a soft screen circle around it dissolve.
// Materials are patched once (chained onBeforeCompile + program key), shared uniforms are written by updateDither().
import * as THREE from 'three';
import { scene, camera } from './stage.js';
import { SIM } from './physics.js';
import { G } from './round.js';
import { golfer, clubG } from './golfer.js';

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
const skipMesh = o => { if (o.name === 'sky' || o.name === 'sea' || o.isSkinnedMesh && false) return true; if (/^(ball|club|golfer)/i.test(o.name)) return true; for (let p = o; p; p = p.parent) if (p === golfer.holder || p === clubG) return true; return false; };
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
const OCC = /tree|house|lighthouse|cliff|sheep|bell|fence|cow|bush|rock/i;
export function updateDither(sceneW, sceneH) {
  if (tick++ % 90 === 0) patchAll();
  camera.updateMatrixWorld();
  U.uCamW.value.copy(camera.matrixWorld); U.uDR.value.x = sceneW; U.uDR.value.y = sceneH; U.uDR.value.w = camera.aspect;
  const live = (G.phase === 'aim' || G.phase === 'swing' || G.phase === 'flight' || G.phase === 'settle' || G.phase === 'holed') && !G.overhead;
  info.occluders.length = 0; info.nearFades.length = 0; info.active = live;
  if (!live) { U.uDS.value.z = -9; return; }
  if (G.phase === 'aim' || G.phase === 'swing') _s.set(golfer.bx ?? 0, (golfer.by ?? 0) + 0.45, golfer.bz ?? 0); else _s.copy(SIM.pos);
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
    if (_sp.center.distanceTo(cp) - _sp.radius < U.uNearR.value.y && info.nearFades.length < 8) info.nearFades.push(o.name);
    if (t > 0 && t < L - MARGIN && d.addScaledVector(seg, -t).length() < _sp.radius && _sp.center.y + _sp.radius > _s.y + ABOVE && info.occluders.length < 8) info.occluders.push(o.name);
  });
}
export const ditherState = () => ({ patched, active: info.active, subjectNdc: [+U.uDS.value.x.toFixed(3), +U.uDS.value.y.toFixed(3)], depth: +U.uDS.value.z.toFixed(2), radius: +U.uDS.value.w.toFixed(3), occluders: info.occluders.slice(), nearFades: info.nearFades.slice() });
