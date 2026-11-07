import './stage.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { duckGLB, modelCopy } from './assets.js';
import { clamp, fbm, hash, lerp, rand, smooth, vnoise } from './util.js';
import { ST } from './shared.js';
import { BELL, FLOWERS, HOUSE, H_COT, H_HOUSE, H_LH, H_POND, LH, LH_COT, POND, TREES, courseColour, edgeR, heightAt, inland, outFlat } from './course.js';
import { camera, mergeChildren, named, scene, std } from './stage.js';
import { FF, _gv, canvasTex, clouds, ffGeo, ffMat, ffSeed, flies, gulls, smokes, spawnSmoke } from './effects.js';

// ---------------------------------------------------------------- sea
export const STACKS = [];
for (const [th, out, rad] of [[2.5, 2.0, 0.75], [0.35, 2.4, 0.9], [-0.9, 3.6, 0.7], [1.45, 4.2, 1.0], [-2.6, 2.6, 0.8], [3.9, 5.5, 0.6]]) {
  const R = edgeR(th) + out; STACKS.push({ x: Math.cos(th) * R, z: Math.sin(th) * R, r: rad });
}
export const seaMat = new THREE.ShaderMaterial({
  fog: false,
  uniforms: {
    uTime: { value: 0 }, uDusk: { value: 0 }, uFog: { value: new THREE.Color() }, uFogNear: { value: 62 }, uFogFar: { value: 175 },
    uStacks: { value: STACKS.map(s => new THREE.Vector3(s.x, s.z, s.r)) }, uBeam: { value: new THREE.Vector4() },
    uStorm: { value: 0 },
  },
  vertexShader: `varying vec3 vW; varying float vDepth;
    void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vec4 mv = viewMatrix * w; vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `
    uniform float uTime, uDusk, uFogNear, uFogFar, uStorm; uniform vec3 uFog; uniform vec3 uStacks[6]; uniform vec4 uBeam;
    varying vec3 vW; varying float vDepth;
    float edgeR(float th){ float e = 541.5/length(vec2(19.0*cos(th), 28.5*sin(th))); return e*(1.0 + 0.5/14.0*(1.6*sin(2.0*th+1.8) + 0.9*sin(3.0*th+2.1) + 0.5*sin(5.0*th+0.3) + 0.3*sin(9.0*th+1.3) + 0.9*sin(4.0*th+0.6) + 0.6*sin(7.0*th+2.4))); }
    float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a*vn(p); p = p*2.03 + vec2(1.7,9.2); a *= 0.5; } return s; }
    vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
    void main(){
      vec2 p = vW.xz; float r = length(p);
      float d = r - edgeR(atan(p.y, p.x));
      float ds = 1e3; for (int i = 0; i < 6; i++) ds = min(ds, length(p - uStacks[i].xy) - uStacks[i].z);
      float t = uTime;
      vec2 q = p + 1.6*vec2(fbm(p*0.08 + t*0.02), fbm(p*0.08 + 4.0 - t*0.015));
      float n = fbm(q*0.22 + vec2(t*0.03, t*0.02));
      float n2 = fbm(q*1.1 - vec2(t*0.16, -t*0.09));
      float n3 = fbm(p*2.6 + vec2(t*0.25, t*0.1));
      vec3 deep = lin(vec3(0.14,0.46,0.43)), mid = lin(vec3(0.28,0.60,0.56)), shal = lin(vec3(0.42,0.76,0.70)), sur = lin(vec3(0.56,0.86,0.80));
      float shore = exp(-max(d,0.0)*0.28);
      vec3 col = mix(deep, mid, smoothstep(0.25, 0.75, n));
      col = mix(col, shal, shore*0.85);
      col = mix(col, sur, exp(-max(d,0.0)*0.9)*0.6);
      // big slow patches of deep and light teal across the open sea (opus-1 seacol.js), so it reads as painted water, not a flat fill
      float big = smoothstep(0.36, 0.62, fbm(p*0.05 + vec2(-t*0.006, t*0.004)) + 0.35*(fbm(p*0.13 + 7.0 + vec2(t*0.01, 0.0)) - 0.5));
      col = mix(col, mix(lin(vec3(0.04,0.27,0.31)), lin(vec3(0.44,0.77,0.66)), big), 0.72*(1.0 - shore));
      // long swell stripes, painterly darker troughs
      float swell = sin(dot(p, vec2(0.18,0.55))*1.6 - t*0.9 + n*5.0);
      col *= 0.9 + 0.12*swell;
      // out in the open water the sea turns heavy and grey-green: tall rolling swells, the light gone out of it
      float sw = max(smoothstep(4.0, 20.0, d), uStorm * smoothstep(2.0, 9.0, d)), roll = 0.62*sin(dot(p, vec2(0.31, 0.12))*1.05 - t*1.8 + n*6.0) + 0.38*sin(dot(p, vec2(-0.1, 0.36))*1.37 - t*1.3 + n2*5.0);
      col = mix(col, mix(lin(vec3(0.12,0.15,0.13)), lin(vec3(0.29,0.33,0.28)), smoothstep(0.2, 0.8, n) * 0.6 + 0.4*(roll*0.5+0.5)), sw * 0.96);
      col *= 1.0 + sw * 0.25 * roll;
      // foam: the surf line, bands pushed out from the cliffs, and scattered whitecaps
      // the cliffs' shadow side (away from the sun, low on the screen's back/right) keeps a deep teal; the sunlit foot gets the big crashes
      float th = atan(p.y, p.x);
      float lit = max(0.0, dot(normalize(p), normalize(vec2(-22.0, 14.0))));
      float patchy = smoothstep(0.3, 0.72, fbm(vec2(th*2.6 + 3.0, t*0.04)) + 0.25*sin(th*5.0 - t*0.3));
      float shade = exp(-max(d,0.0)*0.2) * smoothstep(0.75, 0.0, lit) * 0.85 + exp(-max(d,0.0)*1.1) * 0.3;
      col = mix(col, lin(vec3(0.01,0.36,0.31)), clamp(shade, 0.0, 0.9));
      float zone = exp(-max(d,0.0)*mix(1.1, 0.45, patchy));
      float band = sin(d*2.4 - t*1.6 + n*7.0)*0.5 + 0.5;
      float foam = smoothstep(0.62, 0.95, band*zone + (n2-0.5)*0.9*zone) * mix(0.25, 1.0, patchy);
      foam = max(foam, smoothstep(0.9, 0.0, min(d, ds + 0.3)) * smoothstep(0.3, 0.6, n2 + 0.1));
      float crash = patchy * smoothstep(0.2, 0.8, lit);
      foam = max(foam, smoothstep(3.2, 0.0, d) * crash * smoothstep(0.25, 0.55, n2 + 0.15*sin(t*1.3 + th*4.0)));
      foam = max(foam, smoothstep(1.6, 0.2, ds) * smoothstep(0.55, 0.75, n3) * 0.7);
      foam = max(foam, smoothstep(3.0, 0.3, d) * smoothstep(0.58, 0.75, n3) * 0.7 * mix(0.35, 1.0, lit));
      // whitecaps: thin broken streaks riding the swell crests, thinning out away from the island
      float crest = smoothstep(0.86, 0.99, swell);
      float brk = smoothstep(0.55, 0.75, fbm(vec2(dot(p, vec2(0.95,-0.31))*0.35, dot(p, vec2(0.31,0.95))*1.6) + vec2(t*0.05, 0.0)));
      float caps = crest * brk * smoothstep(40.0, 6.0, d) * (1.0 - zone);
      foam = clamp(max(foam, caps*0.55), 0.0, 1.0);
      // storm whitecaps: broken crests on the big rollers, and spume blown in streaks down the wind
      float scap = smoothstep(0.72, 0.97, roll*0.5 + 0.5 + (n2 - 0.5)*0.7) * smoothstep(0.45, 0.65, n3 + 0.2*n2);
      float spume = smoothstep(0.6, 0.78, fbm(vec2(dot(p, vec2(0.94,0.33))*0.16 - t*0.5, dot(p, vec2(-0.33,0.94))*1.3)));
      foam = clamp(max(foam, (scap*0.85*smoothstep(0.3, 0.62, n + 0.25*uStorm)*mix(1.0, 0.0, smoothstep(50.0, 120.0, vDepth)) + spume*0.35) * sw), 0.0, 1.0);   // caps in drifting fields, thinning far off so they never tile
      vec3 white = lin(vec3(0.93,0.97,0.93));
      col = mix(col, white, foam);
      // a little sun sparkle
      col += lin(vec3(1.0,0.95,0.8)) * pow(max(n3*n2*2.2 - 0.6, 0.0), 2.0) * 0.6 * (1.0 - uDusk);
      col *= mix(vec3(1.0), vec3(0.3,0.36,0.55), uDusk);
      // the lighthouse beams sweeping the water (beam direction (cos a, -sin a) in xz, and its opposite)
      vec2 dv = p - uBeam.xy; float bl = length(dv), ba = atan(-dv.y, dv.x) - uBeam.z;
      float bd = abs(mod(ba + 3.14159, 6.28318) - 3.14159); bd = min(bd, 3.14159 - bd);
      col += lin(vec3(1.0,0.88,0.6)) * uBeam.w * smoothstep(0.16, 0.02, bd) * smoothstep(34.0, 6.0, bl) * smoothstep(3.0, 6.0, bl) * 0.55;
      float f = smoothstep(uFogNear, uFogFar, vDepth);
      gl_FragColor = vec4(mix(col, uFog, f), 1.0);
    }`,
});
export const sea = new THREE.Mesh(new THREE.PlaneGeometry(900, 900).rotateX(-Math.PI / 2), seaMat);
sea.name = 'sea'; sea.receiveShadow = false; scene.add(sea);

// ---------------------------------------------------------------- the path (dirt, drawn into the terrain colours)
export const pathCurves = [
  [[-9.5, -11.9], [-8.4, -10.9], [-6.4, -10.4], [-3.2, -10.6]],                             // from the house door out to the lane
  [[-3.2, -10.6], [-0.4, -11.8], [1.4, -12.8], [2.6, -14.2]],                               // up the hill to the bell
  [[19.2, -8.9], [20.2, -9.3], [LH.x - 0.9, LH.z + 0.7]],                                    // the last green to the lighthouse door
  [[LH_COT.x - 0.4, LH_COT.z + 1.0], [LH_COT.x - 2.6, LH_COT.z + 2.2], [LH_COT.x - 4.0, LH_COT.z + 3.6]],   // from the cottage
];
export const pathPts = [];
for (const c of pathCurves) {
  const curve = new THREE.CatmullRomCurve3(c.map(([x, z]) => new THREE.Vector3(x, 0, z)));
  for (const p of curve.getSpacedPoints(80)) pathPts.push([p.x, p.z]);
}
export function pathDist(x, z) { let m = 1e9; for (const [px, pz] of pathPts) { const d = (px - x) ** 2 + (pz - z) ** 2; if (d < m) m = d; } return Math.sqrt(m); }

// ---------------------------------------------------------------- terrain
export const TW = 68, TD = 48, TSX = 340, TSZ = 240;
export const terrainGeo = new THREE.PlaneGeometry(TW, TD, TSX, TSZ).rotateX(-Math.PI / 2);
{
  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  terrainGeo.computeVertexNormals();
  const nrm = terrainGeo.attributes.normal, col = new Float32Array(pos.count * 3);
  const C = s => new THREE.Color(s);
  const gA = C('#2a6230'), gB = C('#4a7e40'), gSun = C('#b8a45a'), gShade = C('#173f2c'), gDark = C('#1f5228'), gWorn = C('#66894a'), moss = C('#22442e'), rock = C('#5a5a44'),
    rockL = C('#7c7a62'), gOchre = C('#b8a64a'), gTeal = C('#0f5a46'), gMid = C('#3d7a44'), wet = C('#2c302a'), dirt = C('#b79560'), dirtD = C('#8d7048'), pondBed = C('#3b5a3a'), fieldG = C('#56683a');
  const c = new THREE.Color(), t = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), ny = nrm.getY(i), e = inland(x, z);
    const pn = fbm(x * 0.21 + 11, z * 0.21), pn2 = fbm(x * 0.9, z * 0.9 + 5);
    c.copy(gA).lerp(gB, smooth(0.35, 0.7, pn) * 0.75 + (pn2 - 0.5) * 0.3);
    // 01.jpg's broad patches (3-6 m): warm yellow-ochre fields beside deep blue-green ones
    const patch = fbm(x * 0.17 - 4.2, z * 0.17 + 8.6), patchB = fbm(x * 0.33 + 2.7, z * 0.33 - 1.9);
    c.lerp(gOchre, smooth(0.42, 0.58, patch) * 0.9 * smooth(1.5, 3.5, e));
    c.lerp(gTeal, smooth(0.46, 0.3, patch) * 0.6);
    c.lerp(gMid, smooth(0.55, 0.7, patchB) * 0.4);
    c.lerp(gDark, smooth(4.5, 1.6, e) * 0.55);
    // sun-facing slopes go yellow-green, the shade under trees goes dark and blue-green
    const sunF = nrm.getX(i) * -0.55 + nrm.getZ(i) * 0.35 + ny * 0.1;
    c.lerp(gSun, clamp(sunF * 2.2, 0, 0.6) * smooth(1.5, 3, e));
    c.lerp(gTeal, clamp(-sunF * 2.5, 0, 0.6));
    let shadeT = 0; for (const tr of TREES) shadeT = Math.max(shadeT, smooth(2.6 * tr.s, 0.8 * tr.s, Math.hypot(x - tr.x + 0.8, z - tr.z - 0.5)));
    c.lerp(gShade, shadeT * 0.55);
    // rock where it is steep or low
    const rk = Math.max(1 - smooth(0.55, 0.82, ny), smooth(2.4, 1.0, y));
    t.copy(moss).lerp(rock, smooth(0.4, 0.62, fbm(x * 0.6 + 3, z * 0.6 + y * 0.5)));
    t.lerp(rockL, smooth(0.6, 0.75, pn2) * 0.5);
    t.lerp(wet, smooth(1.4, -0.6, y) * 0.7);
    c.lerp(t, rk);
    if (e > 1.5) {
      const pd = pathDist(x, z), pw = 0.42 + 0.12 * (pn2 - 0.5);
      const k = smooth(pw + 0.2, pw - 0.1, pd) * (1 - rk);
      c.lerp(dirt.clone().lerp(dirtD, pn2 * 0.6), k * 0.95);
      c.lerp(gWorn, smooth(pw + 0.8, pw + 0.15, pd) * (1 - k) * 0.35);
    }
    courseColour(x, z, c);   // the course: fairways, greens, tees and sand over the island's paint
    const dp = Math.hypot(x - POND.x, z - POND.z);
    c.lerp(pondBed, smooth(POND.r + 0.1, POND.r - 0.4, dp));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  // the flat seabed under the opaque sea is never seen: keep only triangles with a vertex above it
  const idx = terrainGeo.index.array, keep = [];
  for (let i = 0; i < idx.length; i += 3) if (Math.max(pos.getY(idx[i]), pos.getY(idx[i + 1]), pos.getY(idx[i + 2])) > -1.6) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  terrainGeo.setIndex(keep);
}
export const terrain = named(new THREE.Mesh(terrainGeo, std(0xffffff, { vertexColors: true, roughness: 1 })), 'island', false);
scene.add(terrain);

// ---------------------------------------------------------------- the cliff face: one ring of layered rock, vertical clefts, warm sunlit faces, moss in the shadows
// (one per island: centre cx, cz, its edge radius by angle)
export function cliffRing(name, cx, cz, edge, NT) {
  const NY = 30, Y0 = -1.9, edgeR = edge;
  const pos = new Float32Array((NT + 1) * (NY + 1) * 3), col = new Float32Array((NT + 1) * (NY + 1) * 3), idx = [];
  const C = s => new THREE.Color(s);
  const ochre = C('#6f7a4c'), ochreL = C('#a39a66'), grey = C('#1d5546'), dark = C('#082a22'), moss = C('#0d4a36'), mossL = C('#3f7a40'), wetC = C('#0a221c');
  const c = new THREE.Color(), sunXZ = new THREE.Vector2(-22, 14).normalize();
  for (let i = 0; i <= NT; i++) {
    const th = i / NT * Math.PI * 2, er = edgeR(th), ca = Math.cos(th), sa = Math.sin(th);
    const topY = heightAt(cx + ca * (er - 0.75), cz + sa * (er - 0.75)) - 0.15;
    const lit = Math.max(0, ca * sunXZ.x + sa * sunXZ.y);               // faces that look toward the sun
    for (let j = 0; j <= NY; j++) {
      const t = j / NY, y = lerp(topY, Y0, t);                          // t: 0 at the lip, 1 under the sea
      // columns: vertical clefts that change slowly with height; ledges: steps in the strata
      const colN = fbm(th * 46, y * 0.22 + 3.1), colN2 = fbm(th * 130 + 7, y * 0.5);
      const strata = Math.floor(y * 1.35 + fbm(th * 9, 1.7) * 2.2);
      const ledge = (fbm(strata * 3.7, th * 14) - 0.5) * 1.0;
      const cleft = smooth(0.42, 0.3, colN);                            // deep cracks between columns
      const buttress = (fbm(th * 6 + 1.3, 0.5) - 0.45) * 2.4 * t;       // big spurs that widen toward the sea
      const out = -0.8 + smooth(0, 0.14, t) * (0.55 + 1.5 * Math.pow(t, 1.8) + ledge + buttress + (colN - 0.5) * 1.1 + (colN2 - 0.5) * 0.35 - cleft * 0.5);
      const R = er + out, k = (i * (NY + 1) + j) * 3;
      pos[k] = cx + ca * R; pos[k + 1] = y + (j === 0 ? 0 : (colN2 - 0.5) * 0.25); pos[k + 2] = cz + sa * R;
      // colour: warm rock on lit faces, grey in the shade, moss on ledges near the top and in the clefts, dark and wet at the foot
      c.copy(grey).lerp(ochre, smooth(0.3, 0.85, lit) * 0.85).lerp(ochreL, smooth(0.6, 0.95, lit) * smooth(0.55, 0.7, colN) * 0.7);
      c.lerp(grey, Math.max(0, fbm(strata * 5.1, 0.3) - 0.3) * 0.7);              // each stratum its own tone
      c.lerp(dark, cleft * 0.85);
      c.lerp(dark, smooth(0.3, 1.0, 1 - lit) * 0.35);
      const mossy = smooth(0.32, 0.0, t) * 0.8 + smooth(0.55, 0.7, fbm(th * 70 + 2, y * 0.12)) * 0.75 * smooth(0.95, 0.3, t);   // vertical moss streaks
      c.lerp(lit > 0.4 ? mossL : moss, clamp(mossy, 0, 0.9));
      c.lerp(wetC, smooth(0.55, 0.85, t) * 0.8);
      col[k] = c.r; col[k + 1] = c.g; col[k + 2] = c.b;
    }
  }
  for (let i = 0; i < NT; i++) for (let j = 0; j < NY; j++) {
    const a = i * (NY + 1) + j, b = (i + 1) * (NY + 1) + j;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const face = named(new THREE.Mesh(g, std(0xffffff, { vertexColors: true, roughness: 0.95, flatShading: true, side: THREE.DoubleSide })), name);
  scene.add(face);
}
cliffRing('cliffFace', 0, 0, edgeR, 900);
// ---------------------------------------------------------------- boulders at the waterline, sea stacks
{
  const geo = new THREE.IcosahedronGeometry(1, 0);
  {   // moss on the tops, dark wet clefts below (instance colour tints the rock part)
    const p = geo.attributes.position, vc = new Float32Array(p.count * 3), mo = new THREE.Color('#3f6a30'), c = new THREE.Color();
    for (let i = 0; i < p.count; i += 3) {
      const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
      c.setRGB(1, 1, 1).lerp(mo, smooth(0.35, 0.75, y)).multiplyScalar(lerp(0.55, 1, smooth(-0.8, 0.1, y)));
      for (let j = 0; j < 3; j++) { vc[(i + j) * 3] = c.r; vc[(i + j) * 3 + 1] = c.g; vc[(i + j) * 3 + 2] = c.b; }
    }
    geo.setAttribute('color', new THREE.BufferAttribute(vc, 3));
  }
  const mat = std(0xffffff, { flatShading: true, roughness: 0.95, vertexColors: true });
  const N = 70, rocks = new THREE.InstancedMesh(geo, mat, N + STACKS.length * 4);
  rocks.name = 'cliffRocks'; rocks.castShadow = true; rocks.receiveShadow = true;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), e3 = new THREE.Euler();
  const cols = ['#5a5442', '#7a6a4e', '#3a3e30', '#66604a', '#8a7656', '#3f4a36'].map(x => new THREE.Color(x));
  const stackCols = ['#9a8460', '#b09468', '#7e7052', '#5f6a48'].map(x => new THREE.Color(x));
  let k = 0;
  for (let i = 0; i < N; i++) {
    const th = rand(0, Math.PI * 2), out = rand(-2.4, -1.2), R = edgeR(th) - out;
    const x = Math.cos(th) * R, z = Math.sin(th) * R, sc = rand(0.3, 0.75);
    p.set(x, Math.max(heightAt(x, z), -0.8) + rand(-0.25, 0.1), z);
    s.set(sc * rand(0.8, 1.3), sc * rand(1.0, 1.9), sc * rand(0.8, 1.3));
    q.setFromEuler(e3.set(rand(0, 3), rand(0, 6), rand(0, 3)));
    rocks.setMatrixAt(k, m.compose(p, q, s)); rocks.setColorAt(k++, cols[(Math.random() * cols.length) | 0]);
  }
  // sea stacks: stacked, tapering seven-sided columns banded like the cliff strata, with a moss cap (not round boulders)
  let sg = new THREE.CylinderGeometry(0.5, 1, 2, 7, 6);
  {
    const sp = sg.attributes.position;
    for (let i = 0; i < sp.count; i++) {   // a jitter keyed on the vertex position, so shared corners stay together and no Math.random is spent
      const x = sp.getX(i), y = sp.getY(i), z = sp.getZ(i), hj = Math.sin(x * 12.9 + y * 78.2 + z * 37.7) * 43758.5;
      const j = hj - Math.floor(hj), band = 1 + 0.09 * Math.sin(y * 9.0) + (j - 0.5) * 0.16;
      sp.setXYZ(i, x * band, y + (j - 0.5) * 0.12, z * band);
    }
    sg = sg.toNonIndexed(); sg.computeVertexNormals();
    const q2 = sg.attributes.position, nn = sg.attributes.normal, vc = new Float32Array(q2.count * 3), c = new THREE.Color();
    const strata = ['#c9b48a', '#9c8762', '#b8a077', '#7d6c4f', '#a8926a'].map(x => new THREE.Color(x)), moss = new THREE.Color('#4f7a36');
    for (let i = 0; i < q2.count; i += 3) {
      const y = (q2.getY(i) + q2.getY(i + 1) + q2.getY(i + 2)) / 3, up = nn.getY(i);
      c.copy(strata[Math.min(4, Math.max(0, Math.floor((y + 1) * 2.4)))]).multiplyScalar(lerp(0.65, 1.1, smooth(-1, 0.6, y)));
      if (up > 0.8) c.copy(moss);
      for (let j = 0; j < 3; j++) { vc[(i + j) * 3] = c.r; vc[(i + j) * 3 + 1] = c.g; vc[(i + j) * 3 + 2] = c.b; }
    }
    sg.setAttribute('color', new THREE.BufferAttribute(vc, 3));
  }
  const stacks = new THREE.InstancedMesh(sg, mat, STACKS.length * 4);
  stacks.name = 'seaStacks'; stacks.castShadow = true; stacks.receiveShadow = true;
  let ks = 0;
  for (const st of STACKS) for (let j = 0; j < 4; j++) {
    p.set(st.x + rand(-0.35, 0.35) * st.r, -1.0 + j * 0.3 * st.r, st.z + rand(-0.35, 0.35) * st.r);   // footed below the surf, so no column floats
    const sc = st.r * (1.1 - j * 0.2);
    s.set(sc * rand(0.7, 0.95), sc * rand(1.7, 2.4), sc * rand(0.7, 0.95));   // upright columns, like the cliff strata
    q.setFromEuler(e3.set(rand(-0.09, 0.09), rand(0, 6), rand(-0.09, 0.09)));
    stacks.setMatrixAt(ks, m.compose(p, q, s)); stacks.setColorAt(ks++, stackCols[(Math.random() * stackCols.length) | 0].clone().lerp(new THREE.Color(1, 1, 1), 0.6));
  }
  rocks.count = k;
  scene.add(rocks, stacks);
}

// ---------------------------------------------------------------- bushes along the cliff lip, flowers
export const nearPath = (x, z, d) => pathDist(x, z) < d;
export const clearOf = (x, z) => outFlat(x, z) > 0.8 && Math.hypot(x - HOUSE.x, z - HOUSE.z) > 2.8 && Math.hypot(x - POND.x, z - POND.z) > POND.r + 0.8 && Math.hypot(x - BELL.x, z - BELL.z) > 1.6
  && Math.hypot(x - LH.x, z - LH.z) > 1.9 && Math.hypot(x - LH_COT.x, z - LH_COT.z) > 2.1;
export const BUSHES = [];
{
  // a lumpy leaf-mass: noise-displaced, flat-bottomed, dark underneath and sun-lit on top (instance colour multiplies this)
  const geo = new THREE.IcosahedronGeometry(0.5, 1);
  {
    const p = geo.attributes.position, v = new THREE.Vector3(), vc = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      const lump = 0.78 + 0.42 * fbm(v.x * 2.6 + v.y * 1.3 + 4, v.z * 2.6 - v.y * 1.7) + 0.12 * vnoise(v.x * 7 + 2, v.z * 7 + v.y * 5);
      v.multiplyScalar(0.5 * lump);
      if (v.y < -0.12) v.y = -0.12 + (v.y + 0.12) * 0.3;
      p.setXYZ(i, v.x, v.y, v.z);
      const up = clamp(v.y / 0.5 * 0.5 + 0.5, 0, 1), b = 0.5 + 0.6 * Math.pow(up, 1.4);
      vc[i * 3] = b * 1.06; vc[i * 3 + 1] = b; vc[i * 3 + 2] = b * 0.82;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(vc, 3));
    geo.computeVertexNormals();
  }
  const mat = std(0xffffff, { roughness: 1, vertexColors: true, flatShading: false });
  const cols = ['#2f6b2c', '#3d7a33', '#4a7e36', '#5f8a38', '#2a5a2a', '#507e36'].map(x => new THREE.Color(x));
  const pink = ['#b8687c', '#c98a98', '#a85468'].map(x => new THREE.Color(x));
  const list = [], blossomAt = [];
  // clumps, not a string of beads: a big core with smaller blobs around it, some leaning out over the cliff lip
  for (let i = 0; i < 3000 && list.length < 380; i++) {
    const th = rand(0, Math.PI * 2), lip = Math.random() < 0.35, R = edgeR(th) - (lip ? rand(0.35, 0.9) : rand(1.2, 4.6));
    const cx = Math.cos(th) * R, cz = Math.sin(th) * R;
    if (!clearOf(cx, cz) || nearPath(cx, cz, 1.0)) continue;
    const core = rand(0.8, 1.45), n = 1 + ((Math.random() * 4) | 0);
    list.push([cx, cz, core]);
    for (let j = 0; j < n; j++) {
      const a = rand(0, 6.28), d = core * rand(0.55, 0.95), x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
      if (clearOf(x, z) && !nearPath(x, z, 0.7)) list.push([x, z, core * rand(0.4, 0.75)]);
    }
  }
  for (const t of TREES) for (let j = 0; j < 5; j++) { const a = rand(0, 6.28), d = rand(0.9, 2.2) * t.s; list.push([t.x + Math.cos(a) * d, t.z + Math.sin(a) * d, rand(0.5, 0.9)]); }
  const inst = new THREE.InstancedMesh(geo, mat, list.length);
  inst.name = 'bushes'; inst.castShadow = true; inst.receiveShadow = true;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  list.forEach(([x, z, sc], i) => {
    const lipOut = inland(x, z) < 1.1;                                          // over the lip: sink and lean out toward the sea
    p.set(x, heightAt(x, z) + sc * (lipOut ? -0.05 : 0.12), z); s.set(sc * rand(0.9, 1.5), sc * rand(0.55, 0.95), sc * rand(0.9, 1.5));
    q.setFromEuler(new THREE.Euler(rand(-0.25, 0.25), rand(0, 6), rand(-0.25, 0.25)));
    inst.setMatrixAt(i, m.compose(p, q, s));
    const near = FLOWERS.some(f => Math.hypot(f.x - x, f.z - z) < f.r + 1.5);
    const bloom = Math.random() < (near ? 0.4 : 0.1);                            // blossom shrub: green leaf-mass dotted with petals
    const base = cols[(Math.random() * cols.length) | 0];
    inst.setColorAt(i, base.clone().multiplyScalar(rand(0.85, 1.12)));
    if (bloom) for (let k = 0; k < 16; k++) { const a = rand(0, 6.28), e = rand(0.15, 1.2), rr = 0.5 * sc * 1.05; blossomAt.push([x + Math.cos(a) * Math.cos(e) * rr * s.x / sc * 0.95, p.y + Math.sin(e) * rr * s.y / sc * 0.9, z + Math.sin(a) * Math.cos(e) * rr * s.z / sc * 0.95, k]); }
    BUSHES.push({ x, z, r: sc * 0.55 });
  });
  scene.add(inst);
  const bg = new THREE.IcosahedronGeometry(0.075, 0), bi = new THREE.InstancedMesh(bg, std(0xffffff, { roughness: 0.8 }), Math.max(1, blossomAt.length)), bm = new THREE.Matrix4();
  const petals = ['#f6d3df', '#fff3e4', '#ee8fae', '#f9e0ea'].map(x => new THREE.Color(x));
  blossomAt.forEach(([x, y, z, k], i) => { bm.makeScale(1, 1, 1).setPosition(x, y, z); bi.setMatrixAt(i, bm); bi.setColorAt(i, petals[(Math.random() * 4) | 0]); });
  bi.name = 'blossoms'; scene.add(bi);
}
{
  const geo = new THREE.SphereGeometry(0.07, 6, 4);
  const cols = ['#f3d3e0', '#e46a8f', '#fff6e0', '#f2cf4a', '#b48ad8'].map(x => new THREE.Color(x));
  const pts = [];
  for (const f of FLOWERS) for (let i = 0; i < 90; i++) { const a = rand(0, 6.28), d = Math.sqrt(Math.random()) * f.r; pts.push([f.x + Math.cos(a) * d, f.z + Math.sin(a) * d]); }
  for (let i = 0; i < 600; i++) { const x = rand(-28, 28), z = rand(-19, 19); if (inland(x, z) > 2.2 && clearOf(x, z) && !nearPath(x, z, 0.6)) pts.push([x, z]); }
  const inst = new THREE.InstancedMesh(geo, std(0xffffff, { roughness: 0.8 }), pts.length);
  inst.name = 'flowers';
  const m = new THREE.Matrix4();
  pts.forEach(([x, z], i) => { m.makeTranslation(x, heightAt(x, z) + 0.08, z); inst.setMatrixAt(i, m); inst.setColorAt(i, cols[(Math.random() * cols.length) | 0]); });
  scene.add(inst);
}
// grass: "fluffy" alpha cards after the Codrops/Elysium technique (thebenezer/FluffyGrass, MIT): each clump is three crossed
// cards cut from a painted blade texture, their normals point straight up so they light exactly like the ground they grow
// from, the colour comes from the island's own paint under each clump and runs dark at the root to a warm tip, and the
// wind is done in the vertex shader: slow gust fronts that roll across the island, a quick flutter at the tips, and the
// blades part round the train as it passes.
export const grassU = { uTime: { value: 0 }, uBoy: { value: new THREE.Vector3(0, -99, 0) }, uDusk: { value: 0 } };
export const grassMat = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#fff';
  for (let i = 0; i < 15; i++) {   // tapered blades, each leaning a little and curving at the tip
    const bx = 10 + hash(i, 4) * 108, w = 5 + hash(i, 5) * 5, h = 70 + hash(i, 6) * 56, lean = (hash(i, 7) - 0.5) * 46;
    x.beginPath(); x.moveTo(bx - w, 128); x.quadraticCurveTo(bx - w * 0.4 + lean * 0.3, 128 - h * 0.6, bx + lean, 128 - h); x.quadraticCurveTo(bx + w * 0.4 + lean * 0.35, 128 - h * 0.55, bx + w, 128); x.fill();
  }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.NoColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, alphaMap: tex, alphaTest: 0.42, side: THREE.DoubleSide, alphaToCoverage: true });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, grassU);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime, uDusk; uniform vec3 uBoy; varying float vH; varying float vTip;
        float gh(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
        float gn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(gh(i), gh(i+vec2(1,0)), f.x), mix(gh(i+vec2(0,1)), gh(i+vec2(1,1)), f.x), f.y); }`)
      .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3(0.0, 1.0, 0.0);')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vH = uv.y;
        vec3 root = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float bend = uv.y * uv.y;
        // gust fronts rolling across the island from the west, plus a quick flutter at the tips
        float gust = gn(root.xz * 0.16 + vec2(-uTime * 0.55, uTime * 0.12));
        float wave = sin(dot(root.xz, vec2(0.9, 0.35)) - uTime * 2.4) * 0.5 + 0.5;
        vec2 wind = vec2(0.85, 0.3) * (0.05 + 0.2 * gust * gust + 0.06 * wave) + vec2(sin(uTime * 7.0 + root.x * 3.1), cos(uTime * 6.3 + root.z * 2.7)) * 0.018;
        // the grass parts round the passing train
        vec2 away = root.xz - uBoy.xz; float bd = length(away);
        vec2 push = bd > 1e-3 ? away / bd * smoothstep(0.75, 0.15, bd) * 0.32 : vec2(0.0);
        vec3 off = vec3(wind + push, 0.0).xzy * bend; off.y = -(length(wind + push) * 0.45 + smoothstep(0.6, 0.1, bd) * 0.12) * bend;
        transformed += inverse(mat3(instanceMatrix)) * off;
        vTip = gust;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uDusk; varying float vH; varying float vTip;')
      .replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n normal = normalize( vNormal ); nonPerturbedNormal = normal;')   // both faces of a card light as the ground does
      .replace('#include <color_fragment>', `#include <color_fragment>
        // slightly shaded roots to sunlit tips that catch warm ochre where the gusts lift them
        diffuseColor.rgb *= mix(0.84, 1.06, smoothstep(0.0, 0.85, vH));
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.18, 1.1, 0.78), smoothstep(0.55, 1.0, vH) * (0.35 + 0.4 * vTip) * (1.0 - uDusk));`);
  };
  return m;
})();
{
  // three crossed cards, 0.5 m wide and 0.34 m tall, rooted at y = 0 (uv.y 0 at the root)
  const cards = [0, 1, 2].map(i => new THREE.PlaneGeometry(0.5, 0.34).translate(0, 0.17, 0).rotateY(i * Math.PI / 3));
  const geo = mergeGeometries(cards);
  const tc = terrainGeo.attributes.color;
  const groundCol = (x, z) => { const ix = clamp(Math.round((x + TW / 2) / TW * TSX), 0, TSX), iz = clamp(Math.round((z + TD / 2) / TD * TSZ), 0, TSZ), k = iz * (TSX + 1) + ix; return new THREE.Color(tc.getX(k), tc.getY(k), tc.getZ(k)); };
  const pts = [];
  for (let i = 0; i < 160000 && pts.length < 17000; i++) {
    const x = rand(-30, 30), z = rand(-21, 21), e = inland(x, z);
    if (e < 0.9 || nearPath(x, z, 0.48 + 0.1 * hash(x, z)) || outFlat(x, z) < 0.6) continue;
    if (Math.hypot(x - HOUSE.x, z - HOUSE.z) < 2.3 || Math.hypot(x - POND.x, z - POND.z) < POND.r + 0.05 || Math.hypot(x - LH.x, z - LH.z) < 1.3 || Math.hypot(x - LH_COT.x, z - LH_COT.z) < 1.8) continue;
    const inPenArea = false;
    // clumps gather in drifts: thick in some patches, thin in others
    if (fbm(x * 0.45 + 3.3, z * 0.45 - 1.7) < 0.36 && Math.random() < 0.7) continue;
    pts.push([x, z, inPenArea]);
  }
  const inst = new THREE.InstancedMesh(geo, grassMat, pts.length);
  inst.name = 'grass'; inst.receiveShadow = true; inst.castShadow = false;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), ccol = new THREE.Color();
  pts.forEach(([x, z, pen], i) => {
    const e = inland(x, z), tall = (pen ? 0.55 : 1) * lerp(0.7, 1.35, fbm(x * 0.3 - 5, z * 0.3 + 2)) * smooth(0.9, 2.2, e) * rand(0.8, 1.2);
    p.set(x, heightAt(x, z) - 0.03, z); s.set(rand(0.8, 1.2), Math.max(0.25, tall), rand(0.8, 1.2)); q.setFromAxisAngle(up, rand(0, 6.28));
    inst.setMatrixAt(i, m.compose(p, q, s));
    // the ground's own paint, a touch lifted and varied clump to clump
    ccol.copy(groundCol(x, z)).multiplyScalar(rand(0.92, 1.12)); ccol.offsetHSL(rand(-0.012, 0.012), 0.04, 0.02);
    inst.setColorAt(i, ccol);
  });
  inst.computeBoundingSphere();
  scene.add(inst);
}

// ---------------------------------------------------------------- trees
// the four leaf greens ride in a colour attribute on one material, so each crown's leaves merge into a single draw
export const leafCols = ['#2c6329', '#3a7a2f', '#4a8a35', '#2a5627'].map(x => new THREE.Color(x)), leafMat = std('#ffffff', { roughness: 1, vertexColors: true });
export const trunkMat = std('#5a3f2a'), appleMat = std('#c8322a', { roughness: 0.5 });
export const blobGeo = new THREE.IcosahedronGeometry(1, 1), trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 1.6, 7);
export const treeObjs = [];
TREES.forEach((t, i) => {
  const g = new THREE.Group(); g.name = t.apple ? 'appleTree' : 'tree' + i;
  g.position.set(t.x, heightAt(t.x, t.z) - 0.05, t.z);
  const crown = new THREE.Group(); crown.name = g.name + '_crown'; crown.position.y = 0; g.add(crown);
  const tr = named(new THREE.Mesh(trunkGeo, trunkMat), g.name + '_trunk'); tr.position.y = 0.8 * t.s; tr.scale.setScalar(t.s); crown.add(tr);
  const n = 5 + (i % 3);
  for (let j = 0; j < n; j++) {
    const a = j / n * 6.28 + i, d = j === 0 ? 0 : rand(0.4, 0.8) * t.s;
    const lg = blobGeo.clone(), lc = leafCols[(i + j) % 4]; lg.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: lg.attributes.position.count * 3 }, (_, k) => lc.toArray()[k % 3]), 3));
    const b = named(new THREE.Mesh(lg, leafMat), g.name + '_leaves' + j);
    b.position.set(Math.cos(a) * d, (1.9 + rand(-0.2, 0.5) + (j === 0 ? 0.4 : 0)) * t.s, Math.sin(a) * d);
    b.scale.setScalar((j === 0 ? 0.95 : rand(0.55, 0.8)) * t.s); b.rotation.set(rand(0, 3), rand(0, 3), 0);
    crown.add(b);
  }
  const apples = [];   // the apples were never in sight from the game's cameras (inside the crown at this scale): none are made
  if (t.apple) for (let j = 0; j < 14; j++) rand();   // draw what the apples drew, so the seeded island after them stays as it was
  mergeChildren(crown, apples);
  if (i === 11) crown.getObjectByName('tree11_trunk')?.removeFromParent();   // tree 11's trunk sits wholly under its crown from every camera: not drawn
  scene.add(g);
  treeObjs.push({ ...t, g, crown, apples, shake: 0 });
});

// ---------------------------------------------------------------- house
export const house = new THREE.Group(); house.name = 'house'; house.position.set(HOUSE.x, H_HOUSE, HOUSE.z); scene.add(house);
export const windowMat = std('#2c3a44', { emissive: new THREE.Color('#ffb15a'), emissiveIntensity: 0, roughness: 0.4 });
{
  const white = std('#f1ece1', { roughness: 0.85 }), red = std('#b5372b', { roughness: 0.8 }), stone = std('#8f8a7c');
  const walls = named(new THREE.Mesh(new THREE.BoxGeometry(HOUSE.w, 1.9, HOUSE.d), white), 'house_walls'); walls.position.y = 0.6; house.add(walls);
  const base = named(new THREE.Mesh(new THREE.BoxGeometry(HOUSE.w + 0.12, 0.3, HOUSE.d + 0.12), stone), 'house_plinth'); base.position.y = 0.0; house.add(base);
  const sh = new THREE.Shape(); sh.moveTo(-1.28, 0); sh.lineTo(1.28, 0); sh.lineTo(0, 1.0); sh.closePath();
  const rg = new THREE.ExtrudeGeometry(sh, { depth: 3.4, bevelEnabled: false }); rg.translate(0, 0, -1.7); rg.rotateY(Math.PI / 2);
  const roof = named(new THREE.Mesh(rg, red), 'house_roof'); roof.position.y = 1.55; house.add(roof);
  const ch = named(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.9, 0.34), white), 'house_chimney'); ch.position.set(1.15, 2.4, -0.35); house.add(ch);
  const chc = named(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), stone), 'house_chimneyCap'); chc.position.set(1.15, 2.88, -0.35); house.add(chc);
  const door = named(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.9, 0.06), std('#8a3324')), 'house_door'); door.position.set(0, 0.1, HOUSE.d / 2 + 0.02); house.add(door);
  for (const [x, z, ry] of [[-0.85, HOUSE.d / 2 + 0.02, 0], [0.85, HOUSE.d / 2 + 0.02, 0], [-HOUSE.w / 2 - 0.02, 0, Math.PI / 2], [HOUSE.w / 2 + 0.02, 0.2, Math.PI / 2]]) {
    const w = named(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.05), windowMat), 'house_window'); w.position.set(x, 0.75, z); w.rotation.y = ry; house.add(w);
    const sill = named(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.1), white), 'house_sill'); sill.position.set(x, 0.52, z); sill.rotation.y = ry; house.add(sill);
  }
  const step = named(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.4), stone), 'house_step'); step.position.set(0, 0.0, HOUSE.d / 2 + 0.26); house.add(step);
  // a water butt and a woodpile by the side
  const butt = named(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.5, 10), std('#6b4a30')), 'house_waterButt'); butt.position.set(1.75, -0.1, 0.6); house.add(butt);
  for (let j = 0; j < 6; j++) { const l = named(new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.56 + j * 0.017, 7), std('#7a5a3a')), 'house_log'); l.rotation.set(Math.PI / 2, j * 0.7, 0); l.position.set(-1.75 + (j % 2) * 0.023, 0.07 + Math.floor(j / 3) * 0.13, -0.5 + (j % 3) * 0.15); house.add(l); }
}
mergeChildren(house);
export const houseLamp = new THREE.PointLight('#ffb15a', 0, 3.2, 1.6); houseLamp.position.set(HOUSE.x, H_HOUSE + 0.35, HOUSE.z + 2.1); houseLamp.name = 'houseLamp'; scene.add(houseLamp);

// ---------------------------------------------------------------- fences: the fold, a field fence across the back
export const wood = std('#8a6845', { roughness: 0.95 });
export const FENCE_SEGS = [];
export const postGeo = new THREE.BoxGeometry(0.09, 0.62, 0.09), railGeo = new THREE.BoxGeometry(0.065, 0.065, 1);
export const posts = [], rails = [];
export function fenceLine(pts, collide = true) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, z1] = pts[i], [x2, z2] = pts[i + 1], len = Math.hypot(x2 - x1, z2 - z1), n = Math.max(1, Math.round(len / 1.15));
    if (collide) FENCE_SEGS.push([x1, z1, x2, z2]);
    for (let j = 0; j <= n; j++) { if (j === n && i < pts.length - 2) continue; posts.push([lerp(x1, x2, j / n), lerp(z1, z2, j / n)]); }
    for (let j = 0; j < n; j++) rails.push([lerp(x1, x2, j / n), lerp(z1, z2, j / n), lerp(x1, x2, (j + 1) / n), lerp(z1, z2, (j + 1) / n)]);
  }
}
fenceLine([[-8.0, -10.6], [-6.4, -11.6], [-4.4, -11.9]]);                                        // the farmyard fence by the house
fenceLine([[-1.4, -13.0], [1.8, -12.6], [5.6, -13.0], [8.4, -12.4]]);                          // along the foot of the bell hill
{
  const pi = new THREE.InstancedMesh(postGeo, wood, posts.length), ri = new THREE.InstancedMesh(railGeo, wood, rails.length * 2);
  pi.name = 'fencePosts'; ri.name = 'fenceRails'; for (const o of [pi, ri]) { o.castShadow = true; o.receiveShadow = true; }
  const m = new THREE.Matrix4(), d = new THREE.Object3D();
  posts.forEach(([x, z], i) => { m.makeTranslation(x, heightAt(x, z) + 0.26, z); pi.setMatrixAt(i, m); });
  rails.forEach(([x1, z1, x2, z2], i) => {
    for (let k = 0; k < 2; k++) {
      const y1 = heightAt(x1, z1) + 0.22 + k * 0.24, y2 = heightAt(x2, z2) + 0.22 + k * 0.24;
      d.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2); d.lookAt(x2, y2, z2); d.scale.set(1, 1, Math.hypot(x2 - x1, y2 - y1, z2 - z1)); d.updateMatrix();
      ri.setMatrixAt(i * 2 + k, d.matrix);
    }
  });
  scene.add(pi, ri);
}

// ---------------------------------------------------------------- the bell on the hill
export const bellG = new THREE.Group(); bellG.name = 'bell'; bellG.position.set(BELL.x, heightAt(BELL.x, BELL.z) - 0.05, BELL.z); scene.add(bellG);
export const bellPivot = new THREE.Group(); bellPivot.position.y = 1.55; bellG.add(bellPivot);
{
  for (const x of [-0.45, 0.45]) { const p = named(new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), wood), 'bell_post'); p.position.set(x, 0.85, 0); bellG.add(p); }
  const roofG = new THREE.ConeGeometry(0.9, 0.45, 4); roofG.rotateY(Math.PI / 4);
  const rf = named(new THREE.Mesh(roofG, std('#9c3a2c')), 'bell_roof'); rf.position.y = 2.0; rf.scale.set(1, 1, 0.55); bellG.add(rf);
  const prof = [[0.0, 0], [0.26, 0], [0.24, 0.06], [0.18, 0.2], [0.15, 0.36], [0.08, 0.42], [0, 0.43]].map(([x, y]) => new THREE.Vector2(x, y - 0.43));
  const bell = named(new THREE.Mesh(new THREE.LatheGeometry(prof, 18), std('#b48a3c', { metalness: 0, roughness: 0.35 })), 'bell_body'); bellPivot.add(bell);
}

// ---------------------------------------------------------------- the lighthouse (after refs/lighthouse/opus-1 buildings.js): white round tower, dark red lantern and gallery, keeper's cottage
export const LH_TOP = 5.4;                     // the gallery deck, metres above the tower's foot
export const lighthouse = new THREE.Group(); lighthouse.name = 'lighthouse'; lighthouse.position.set(LH.x, H_LH - 0.05, LH.z); scene.add(lighthouse);
export const LH_DOOR = -2.05;                  // the door's azimuth (from +z toward +x): it looks west-south-west, toward the island
export const lampGlass = std('#3d7d66', { emissive: new THREE.Color('#ffc46a'), emissiveIntensity: 0.12, roughness: 0.25, transparent: true, opacity: 0.5, depthWrite: false });
export const lampCoreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#8a6a3a') });   // the lamp itself, seen through the glass: dull brass by day, bright when lit
{
  const white = std('#efebe2', { roughness: 0.85 }), maroon = std('#7a2a2c', { roughness: 0.7 }), railRed = std('#4a1618', { roughness: 0.7 }), roofRed = std('#a23a30', { roughness: 0.7 }),
    dark = std('#1f3a32'), stone = std('#8f8a7c');
  const add = (m, name, x, y, z) => { named(m, name); m.position.set(x, y, z); lighthouse.add(m); return m; };
  add(new THREE.Mesh(new THREE.CylinderGeometry(LH.r + 0.12, LH.r + 0.16, 0.5, 28), stone), 'lighthouse_plinth', 0, 0.05, 0);
  const prof = [[0, 0.2], [LH.r, 0.2], [LH.r * 0.86, LH_TOP - 0.25], [LH.r * 0.9, LH_TOP - 0.1], [LH.r * 0.96, LH_TOP], [0, LH_TOP]].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.Mesh(new THREE.LatheGeometry(prof, 32), white), 'lighthouse_tower', 0, 0, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.92, 0.12, 28), stone), 'lighthouse_gallery', 0, LH_TOP + 0.06, 0);
  const rail = add(new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.055, 5, 32), railRed), 'lighthouse_rail', 0, LH_TOP + 0.5, 0); rail.rotation.x = Math.PI / 2;
  const postG = new THREE.CylinderGeometry(0.06, 0.06, 0.44, 5);
  for (let i = 0; i < 10; i++) { const a = (i + 0.5) / 10 * Math.PI * 2; add(new THREE.Mesh(postG, railRed), 'lighthouse_railPost', Math.sin(a) * 0.98, LH_TOP + 0.3, Math.cos(a) * 0.98); }
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.62, 0.45, 20), maroon), 'lighthouse_lanternBase', 0, LH_TOP + 0.34, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.72, 12), lampGlass), 'lighthouse_lantern', 0, LH_TOP + 0.92, 0).renderOrder = 2;
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.74, 0.07), railRed), 'lighthouse_mullion', Math.sin(a) * 0.53, LH_TOP + 0.92, Math.cos(a) * 0.53); }
  add(new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.55, 12), roofRed), 'lighthouse_roof', 0, LH_TOP + 1.55, 0);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), maroon), 'lighthouse_vent', 0, LH_TOP + 1.86, 0);
  // the door and two small windows up the shaft, on the side facing the island
  const onShaft = (m, name, az, y, r) => { add(m, name, Math.sin(az) * r, y, Math.cos(az) * r); m.rotation.y = az; return m; };
  onShaft(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.85, 0.08), std('#a8261c')), 'lighthouse_door', LH_DOOR, 0.62, LH.r - 0.01);
  for (const y of [2.4, 4.0]) onShaft(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.06), dark), 'lighthouse_window', LH_DOOR + 0.35, y, LH.r * (1 - 0.14 * y / LH_TOP) + 0.01);
}
mergeChildren(lighthouse);
// the keeper's cottage: white walls, a dark teal slate roof (refs/lighthouse/opus-1 refs/01.jpg), a chimney at each gable
export const lhCottage = new THREE.Group(); lhCottage.name = 'lighthouse_cottage'; lhCottage.position.set(LH_COT.x, H_COT, LH_COT.z); scene.add(lhCottage);
{
  const white = std('#f2eee4', { roughness: 0.85 }), slate = std('#1f5e58', { roughness: 0.75 });
  const { w, d } = LH_COT;
  const walls = named(new THREE.Mesh(new THREE.BoxGeometry(w, 1.6, d), white), 'lighthouse_cottageWalls'); walls.position.y = 0.45; lhCottage.add(walls);
  // the roof: two slate slopes meeting at the ridge, overhanging the walls a little; under each end a white gable wall
  // carries the walls up to the ridge (one extruded wedge left its end caps flat black)
  const run = d / 2 + 0.12, rise = 0.75, slope = Math.hypot(run, rise), pitch = Math.atan2(rise, run);
  for (const sgn of [-1, 1]) {
    const side = named(new THREE.Mesh(new THREE.BoxGeometry(w + 0.24 - (sgn > 0 ? 0.01 : 0), 0.06, slope + 0.04), slate), 'lighthouse_cottageRoof');   // one a hair narrower: their ends meet at the ridge
    side.position.set(0, 1.25 + rise / 2, sgn * run / 2); side.rotation.x = sgn * pitch; lhCottage.add(side);
  }
  const gs = new THREE.Shape(); gs.moveTo(-d / 2, 0); gs.lineTo(d / 2, 0); gs.lineTo(0, rise * (d / 2) / run); gs.closePath();
  for (const sgn of [-1, 1]) { const g = named(new THREE.Mesh(new THREE.ShapeGeometry(gs), std('#f2eee4', { roughness: 0.85, side: THREE.DoubleSide })), 'lighthouse_cottageWalls'); g.rotation.y = Math.PI / 2; g.position.set(sgn * w / 2, 1.25, 0); lhCottage.add(g); }
  for (const x of [-w / 2 + 0.2, w / 2 - 0.2]) { const ch = named(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.3), white), 'lighthouse_cottageChimney'); ch.position.set(x, 1.95, 0); lhCottage.add(ch); }
  // door and windows stand on the ground (the walls run 0.35 m below it, into the slope), the windows well inside the corners
  // the end windows keep the same margin to their corners however wide the cottage is, the door near the seaward end, and a
  // third window fills the middle of the longer wall
  const door = named(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.72, 0.05), std('#a8261c')), 'lighthouse_cottageDoor'); door.position.set(w / 2 - 0.7, 0.36, d / 2 + 0.02); lhCottage.add(door);
  for (const x of [-w / 2 + 0.5, (-w / 2 + 0.5 + w / 2 - 0.7) / 2, w / 2 - 0.28]) { const wi = named(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.05), windowMat), 'lighthouse_cottageWindow'); wi.position.set(x, 0.78, d / 2 + 0.02); lhCottage.add(wi); }
}
// the lamp's light and its two sweeping beams (additive cones that fade with distance; the sea brightens under them too)
mergeChildren(lhCottage);
export const lampLight = new THREE.PointLight('#ffd08a', 0, 14, 1.4); lampLight.name = 'lighthouse_lampLight'; lampLight.position.set(LH.x, H_LH + LH_TOP + 0.9, LH.z); scene.add(lampLight);
export const beamMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  // uR: the island's edge radius at 48 angles, so the beam fades out wherever it crosses land (except right at the lamp)
  uniforms: { uI: { value: 0 }, uR: { value: Array.from({ length: 48 }, (_, i) => edgeR(i / 48 * Math.PI * 2)) }, uLamp: { value: new THREE.Vector2(LH.x, LH.z) } },
  vertexShader: `varying float vT; varying vec3 vN, vV, vW;
    void main(){ vT = uv.y; vW = (modelMatrix * vec4(position, 1.0)).xyz; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float uI; uniform float uR[48]; uniform vec2 uLamp; varying float vT; varying vec3 vN, vV, vW;
    void main(){ float edge = pow(clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0), 1.6);
      float t = clamp(vT, 0.0, 1.0);   // the far rim interpolates a hair past 1, and pow of a negative base is NaN (a black blob after the blur)
      float ang = atan(vW.z, vW.x); if (ang < 0.0) ang += 6.2831853; float f = ang / 6.2831853 * 48.0; int i0 = int(floor(f)) % 48;
      float er = mix(uR[i0], uR[(i0 + 1) % 48], fract(f));
      float sea = max(smoothstep(er - 0.5, er + 2.5, length(vW.xz)), 1.0 - smoothstep(0.6, 2.2, distance(vW.xz, uLamp)));
      float a = clamp(uI * sea * pow(1.0 - t, 1.6) * edge * smoothstep(0.0, 0.03, t) * (1.0 - 0.75 * smoothstep(0.45, 0.85, t)), 0.0, 1.0);
      gl_FragColor = vec4(vec3(1.0, 0.86, 0.58) * a, a); }`,
});
export const lampBeams = new THREE.Group(); lampBeams.name = 'lighthouse_beams'; lampBeams.position.copy(lampLight.position); scene.add(lampBeams);
{
  const g = new THREE.CylinderGeometry(2.3, 0.18, 26, 20, 1, true); g.translate(0, 13, 0); g.rotateZ(-Math.PI / 2);   // narrow at the lamp, along +x
  for (const ry of [0, Math.PI]) {
    const arm = new THREE.Group(); arm.rotation.y = ry; lampBeams.add(arm);
    const m = new THREE.Mesh(g, beamMat); m.name = 'lighthouse_beam'; m.rotation.z = -0.1; m.renderOrder = 5; m.frustumCulled = false; arm.add(m);
  }
  lampBeams.visible = false;
}

// ---------------------------------------------------------------- pond: water, lilies, cattails, rushes, shore plants, pebbles, ducks and ducklings
export const pond = new THREE.Group(); pond.name = 'pond'; pond.position.set(POND.x, H_POND, POND.z); scene.add(pond);
// the pond's water: wind ripples that catch the light, a soft reflection of the sky (stronger toward the far side, where
// the eye meets the water at a low angle) with the green banks mirrored dark along the far edge, slow cloud reflections,
// sparkling sun glints, rings spreading round the bobbing ducks, and a shallow, soft edge instead of a hard circle
export const pondU = { uTime: { value: 0 }, uDusk: { value: 0 }, uSky: { value: new THREE.Color('#bccabd') }, uDucks: { value: [new THREE.Vector2(), new THREE.Vector2()] }, uR: { value: POND.r + 0.1 } };
export const pondWaterMat = new THREE.ShaderMaterial({
  uniforms: pondU, transparent: true, depthWrite: false, fog: false,
  vertexShader: `varying vec2 vP; varying vec3 vW; void main(){ vP = position.xz; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float uTime, uDusk, uR; uniform vec3 uSky; uniform vec2 uDucks[2]; varying vec2 vP; varying vec3 vW;
    float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
    float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
    float waves(vec2 p){
      float w = n(p * 3.1 + vec2(uTime * 0.35, uTime * 0.12)) * 0.6 + n(p * 7.3 - vec2(uTime * 0.22, -uTime * 0.31)) * 0.3 + n(p * 17.0 + vec2(uTime * 0.6, 0.0)) * 0.1;
      for (int i = 0; i < 2; i++) { float d = length(p - uDucks[i]); w += sin(d * 38.0 - uTime * 5.0) * smoothstep(0.6, 0.1, d) * smoothstep(0.05, 0.13, d) * 0.32; }
      return w; }
    void main(){
      float r = length(vP) / uR;
      // ripple normal from the height field
      float e = 0.02, w0 = waves(vP); vec3 N = normalize(vec3((w0 - waves(vP + vec2(e, 0.0))) * 0.55 / e * 0.06, 1.0, (w0 - waves(vP + vec2(0.0, e))) * 0.55 / e * 0.06));
      vec3 V = normalize(cameraPosition - vW);
      vec3 deep = pow(vec3(0.10, 0.36, 0.35), vec3(2.2)), shal = pow(vec3(0.38, 0.62, 0.52), vec3(2.2)), sand = pow(vec3(0.55, 0.56, 0.40), vec3(2.2));   // picked in sRGB, the scene target is linear
      vec3 col = mix(deep, shal, smoothstep(0.35, 0.97, r));
      col *= 0.9 + 0.2 * n(vP * 1.7 + 3.0);                                   // patches of darker weed and lighter silt below
      // the sky, mirrored more where the water is seen at a lower angle, with soft clouds drifting through it
      float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
      vec3 sky = mix(uSky, pow(vec3(0.94, 0.92, 0.82), vec3(2.2)), smoothstep(0.45, 0.8, n(vP * 0.9 + vec2(uTime * 0.03, 0.0))) * 0.5);
      col = mix(col, sky, clamp(0.05 + fres * 0.7, 0.0, 0.38));
      // the far bank's grass and reeds mirrored dark along the far edge
      vec2 vd = normalize(V.xz); float far = smoothstep(0.1, 0.8, dot(normalize(vP + 1e-4), -vd));
      col = mix(col, pow(vec3(0.16, 0.27, 0.15), vec3(2.2)), smoothstep(0.72, 0.97, r) * far * 0.55 * (0.8 + 0.4 * n(vec2(atan(vP.y, vP.x) * 6.0, 1.0))));
      // light catching the ripple crests, and glints where the sun's reflection meets the eye
      col += vec3(0.8, 0.82, 0.7) * smoothstep(0.6, 0.95, w0) * 0.1;
      vec3 L = normalize(vec3(-0.6, 0.8, 0.35));
      float spec = pow(max(dot(reflect(-L, N), V), 0.0), 140.0) * step(0.55, h(floor(vP * 26.0 + floor(uTime * 3.0))));
      col += vec3(1.0, 0.96, 0.84) * spec * 1.6 * (1.0 - uDusk);
      // shallow sandy rim and a soft edge
      col = mix(col, sand, smoothstep(0.9, 1.0, r) * 0.45);
      col *= mix(vec3(1.0), vec3(0.16, 0.2, 0.34), uDusk);   // unlit, so it dims with the evening itself
      gl_FragColor = vec4(col, smoothstep(1.0, 0.94, r) * 0.95);
    }`,
});
export const LILIES = [];
{
  const stoneM = std('#9a9384', { flatShading: true }), mossStoneM = std('#6f7a52', { flatShading: true });
  const reedA = std('#5b7f34'), reedB = std('#7b6a3a'), lilyM = std('#4c8a35'), lilyM2 = std('#6a9a3c'), catHeadM = std('#5a3a22', { roughness: 1 }), leafM = std('#4f7a32', { side: THREE.DoubleSide });
  // the water (its look is all in pondWaterMat's shader)
  const wg = new THREE.CircleGeometry(POND.r + 0.1, 48, 0, Math.PI * 2).rotateX(-Math.PI / 2);
  const water = named(new THREE.Mesh(wg, pondWaterMat), 'pond_water', false); water.renderOrder = 1; pond.add(water);
  // lily pads with their notch, some with a water lily open on them (five petals round a yellow heart)
  const petalM = [std('#f6e0ec'), std('#fbf6ee'), std('#e9a6c0')], heartM = std('#f2cf4a');
  for (let i = 0; i < 11; i++) {
    const a = rand(0, 6.28), d = rand(0.35, POND.r - 0.3), r = rand(0.13, 0.24);
    const pad = named(new THREE.Mesh(new THREE.CircleGeometry(r, 12, 0.35, 5.6).rotateX(-Math.PI / 2), i % 3 ? lilyM : lilyM2), 'pond_lily', false);
    pad.position.set(Math.cos(a) * d, 0.02 + i * 0.003, Math.sin(a) * d); pad.rotation.y = rand(0, 6); pond.add(pad); LILIES.push({ x: pad.position.x, z: pad.position.z, r });
    if (i % 3 === 0) {
      const pm = petalM[i % 3];
      for (let k = 0; k < 5; k++) { const pt = named(new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 4), pm), 'pond_lilyFlower', false); const pa = k / 5 * 6.28; pt.position.set(pad.position.x + Math.cos(pa) * 0.04, 0.07, pad.position.z + Math.sin(pa) * 0.04); pt.rotation.set(Math.sin(pa) * 0.9, 0, -Math.cos(pa) * 0.9); pond.add(pt); }
      const ht = named(new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 4), heartM), 'pond_lilyHeart', false); ht.position.set(pad.position.x, 0.07, pad.position.z); pond.add(ht);
    }
  }
  // cattails in three clumps: a stem, a brown velvet head, and long leaves that arch out
  const stemG = new THREE.CylinderGeometry(0.008, 0.012, 1.0, 4).translate(0, 0.5, 0), headG = new THREE.CapsuleGeometry(0.028, 0.14, 2, 6), leafG = new THREE.PlaneGeometry(0.04, 0.85, 1, 4).translate(0, 0.42, 0);
  { const p = leafG.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setZ(i, (y / 0.85) ** 2 * 0.28); p.setX(i, p.getX(i) * (1 - y / 0.95)); } leafG.computeVertexNormals(); }
  for (const [ca, n] of [[2.5, 8], [3.3, 7], [0.4, 6], [1.3, 5], [4.4, 5]]) {
    for (let i = 0; i < n; i++) {
      const a = ca + rand(-0.22, 0.22), d = POND.r + rand(-0.25, 0.15), x = Math.cos(a) * d, z = Math.sin(a) * d, h = rand(0.75, 1.15);
      const st = named(new THREE.Mesh(stemG, reedA), 'pond_cattailStem', false); st.position.set(x, 0, z); st.scale.y = h; st.rotation.set(rand(-0.12, 0.12), 0, rand(-0.12, 0.12)); pond.add(st);
      const hd = named(new THREE.Mesh(headG, catHeadM), 'pond_cattail', false); hd.position.set(x + st.rotation.z * -0.85 * h, 0.86 * h, z + st.rotation.x * 0.85 * h); pond.add(hd);
      for (let k = 0; k < 2; k++) { const lf = named(new THREE.Mesh(leafG, leafM), 'pond_cattailLeaf', false); lf.position.set(x, 0, z); lf.rotation.y = rand(0, 6.28); lf.scale.setScalar(rand(0.7, 1.05)); pond.add(lf); }
    }
  }
  // rushes: thin reeds in tufts along the far bank
  const reedGeo = new THREE.CylinderGeometry(0.009, 0.016, 0.8, 4); reedGeo.translate(0, 0.4, 0);
  for (let i = 0; i < 46; i++) {
    const a = rand(1.9, 4.0), d = POND.r + rand(-0.15, 0.3);
    const r = named(new THREE.Mesh(reedGeo, i % 4 ? reedA : reedB), 'pond_reed', false);
    r.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); r.rotation.set(rand(-0.25, 0.25), 0, rand(-0.25, 0.25)); r.scale.y = rand(0.5, 1.15); pond.add(r);
  }
  // (the pebbles here were never in sight; their random draws stay, so the seeded layout after them is unchanged)
  for (let i = 0; i < 34; i++) { const a = i / 34 * 6.28 + rand(-0.08, 0.08); rand(); if (a > 5.2 && a < 5.9) continue; rand(); rand(); }
}
// ferny shore plants and yellow marsh marigolds: one instanced draw each, round the bank
{
  const fern = new THREE.InstancedMesh(scene.getObjectByName('grass').geometry, grassMat, 70);   // the grass cards, tall and lush at the water's edge
  fern.name = 'pond_sedge'; fern.receiveShadow = true;
  const sedgeCol = [new THREE.Color('#4f7a34'), new THREE.Color('#5e8a3a'), new THREE.Color('#6f8f42')];
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 70; i++) { const a = rand(0, 6.28); if (a > 5.2 && a < 5.9) { i--; continue; } const d = POND.r + rand(-0.05, 0.55), x = POND.x + Math.cos(a) * d, z = POND.z + Math.sin(a) * d; const k = rand(0.7, 1.1); fern.setMatrixAt(i, m.compose(p.set(x, Math.max(heightAt(x, z), H_POND) - 0.03, z), q.setFromAxisAngle(up, rand(0, 6)), sc.set(k, k * rand(1.6, 2.6), k))); fern.setColorAt(i, sedgeCol[i % 3]); }
  for (let i = 0; i < 34 * 3; i++) rand();   // the marigolds sat behind the water from every camera and are gone; their draws stay so the seeded layout is unchanged
  scene.add(fern);
}
export function makeDuck(i) {
  const g = new THREE.Group(); g.name = 'duck' + i;
  const b = modelCopy(duckGLB, 0.46, 'duck_body'); b.children[0].rotation.y = DUCK_YAW; b.traverse(o => o.castShadow = false); g.add(b);   // b bobs and dabbles
  b.position.y = -0.07;   // sits in the water up to its breast, legs hidden below the surface
  pond.add(g); return { g, b, a: i * 3.1, r: 0.9 + i * 0.35, sp: 0.25 + i * 0.08, dab: 0, nextDab: rand(3, 7), trail: [] };
}
export const DUCK_YAW = 0, KOI_YAW = -Math.PI / 2;   // each model's own facing, turned to +z
export const ducks = [makeDuck(0), makeDuck(1)];
// (the frog and the two dragonflies were never in sight from any camera and are gone; their random draws stay)
for (let i = 0; i < 7; i++) rand();
mergeChildren(pond);
export function updatePond(dt) {
  const t = ST.gameTime;
  // ducks: drifting round, bobbing on the water, and now and then tipping up to dabble, tail in the air
  for (const d of ducks) {
    d.a += d.sp * dt;
    d.g.position.set(Math.cos(d.a) * d.r, Math.sin(t * 2.1 + d.r * 3) * 0.012, Math.sin(d.a) * d.r * 0.8); d.g.rotation.y = Math.atan2(-Math.sin(d.a), 0.8 * Math.cos(d.a));   // face along the way it swims (the model's head is +z)
    d.nextDab -= dt; if (d.nextDab < 0) { d.dab = 1.6; d.nextDab = rand(4, 9); }
    d.dab = Math.max(0, d.dab - dt); const dk = Math.sin(Math.min(1, (1.6 - d.dab) / 1.6) * Math.PI) * (d.dab > 0 ? 1 : 0);
    d.b.rotation.x = Math.sin(t * 2.1 + d.r * 3 + 0.8) * 0.06 + dk * 1.1; d.b.rotation.z = Math.sin(t * 1.7 + d.r) * 0.05; d.b.position.y = -dk * 0.04;
  }
}

// a soft round shadow (a gradient, so it has no hard edge)
export const TEX_SOFT_SHADOW = canvasTex(x => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.55, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
// the island's ambience: chimney smoke, butterflies, gulls, shaken trees, the pond, fireflies, clouds, the lighthouse lamp
export function updateIsland(dt) {
  ST.smokeT -= dt; if (ST.smokeT <= 0) { ST.smokeT = 0.55; spawnSmoke(); }
  for (let i = smokes.length - 1; i >= 0; i--) {
    const s = smokes[i]; s.t += dt; s.s.position.y += dt * 0.55; s.s.position.x += dt * 0.35; s.s.scale.setScalar(0.3 + s.t * 0.3);
    s.s.material.opacity = 0.55 * smooth(0, 0.6, s.t) * smooth(s.life, 1.0, s.t);
    s.s.material.color.setRGB(lerp(0.93, 0.5, ST.dusk), lerp(0.94, 0.52, ST.dusk), lerp(0.92, 0.6, ST.dusk));
    if (s.t > s.life) { scene.remove(s.s); s.s.material.dispose(); smokes.splice(i, 1); }
  }
  for (let i = flies.length - 1; i >= 0; i--) {
    const f = flies[i]; f.t += dt; f.a += f.sp * dt;
    const x = f.cx + Math.cos(f.a) * f.r + Math.sin(f.t * 1.7 + f.ph) * 0.3, z = f.cz + Math.sin(f.a) * f.r;
    f.s.position.set(x, heightAt(f.cx, f.cz) + f.h + Math.sin(f.t * 3 + f.ph) * 0.25 + f.t * 0.05, z);
    f.s.scale.x = 0.28 * (0.3 + 0.7 * Math.abs(Math.sin(f.t * 16 + f.ph)));
    f.s.material.opacity = smooth(0, 0.5, f.t) * smooth(f.life, f.life - 1.5, f.t);
    if (f.t > f.life) { scene.remove(f.s); f.s.material.dispose(); flies.splice(i, 1); }
  }
  for (let i = gulls.length - 1; i >= 0; i--) {
    const g = gulls[i]; g.t += dt; g.a += g.sp * dt;
    const R = g.R + Math.sin(g.t * 0.3 + g.ph) * 2;
    g.g.position.set(Math.cos(g.a) * R, g.h + Math.sin(g.t * 0.5 + g.ph) * 0.6 + (g.life < 1e8 ? smooth(g.life - 3, g.life, g.t) * 20 : 0), Math.sin(g.a) * R);
    // a gull never comes within 9 m of the lens: pushed straight out along the line from the camera
    _gv.subVectors(g.g.position, camera.position); const gd = _gv.length(); if (gd < 9) g.g.position.copy(camera.position).addScaledVector(_gv, 9 / Math.max(gd, 1e-3));
    g.g.rotation.y = -g.a + (g.sp > 0 ? Math.PI : 0); g.g.rotation.z = (g.sp > 0 ? 0.25 : -0.25);
    const flap = Math.sin(g.t * 7 + g.ph) * 0.5 * (0.5 + 0.5 * Math.sin(g.t * 0.7 + g.ph));
    g.l.rotation.z = flap; g.r.rotation.z = -flap;
    if (g.t > g.life) { scene.remove(g.g); gulls.splice(i, 1); }
  }
  for (const t of treeObjs) { if (t.shake > 0) { t.shake = Math.max(0, t.shake - dt); t.crown.rotation.z = Math.sin(t.shake * 30) * 0.06 * t.shake; t.crown.rotation.x = Math.cos(t.shake * 26) * 0.04 * t.shake; } }
  updatePond(dt);
  pondU.uTime.value = ST.gameTime; pondU.uDusk.value = smooth(0, 1, ST.dusk); pondU.uSky.value.copy(scene.fog.color); ducks.forEach((d, i) => pondU.uDucks.value[i].set(d.g.position.x, d.g.position.z));
  // fireflies
  const pa = ffGeo.attributes.position;
  for (let i = 0; i < FF; i++) { const [x, z, ph, h] = ffSeed[i]; pa.setXYZ(i, x + Math.sin(ST.gameTime * 0.4 + ph) * 0.8, heightAt(x, z) + h + Math.sin(ST.gameTime * 1.3 + ph * 2) * 0.25, z + Math.cos(ST.gameTime * 0.35 + ph) * 0.8); }
  pa.needsUpdate = true; ffMat.opacity = smooth(0.4, 0.9, ST.dusk) * (0.7 + 0.3 * Math.sin(ST.gameTime * 3));
  for (const c of clouds) c.c.position.x = c.x0 + Math.sin(ST.gameTime * 0.02) * 4;
  // the lighthouse lamp: glass glows, the beams sweep (faint by day, bright at night), the sea lights under them
  ST.lampOn = lerp(ST.lampOn, ST.lampLit ? 1 : 0, Math.min(1, dt * 2.5));
  const night = smooth(0, 1, ST.dusk);
  ST.beamAngle += dt * 0.7 * ST.lampOn;
  lampBeams.rotation.y = ST.beamAngle; lampBeams.visible = ST.lampOn > 0.01;
  beamMat.uniforms.uI.value = ST.lampOn * lerp(0.22, 0.75, night);
  lampCoreMat.color.setRGB(lerp(0.54, 1.6, ST.lampOn), lerp(0.42, 1.3, ST.lampOn), lerp(0.23, 0.75, ST.lampOn));
  lampGlass.emissiveIntensity = 0.12 + ST.lampOn * (1.6 + 2.4 * night) * (0.92 + 0.08 * Math.sin(ST.gameTime * 9));
  lampLight.intensity = ST.lampOn * lerp(1.5, 10, night);
  seaMat.uniforms.uBeam.value.set(LH.x, LH.z, ST.beamAngle, ST.lampOn * lerp(0.25, 1, night));
}
