import './sound.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { clamp, lerp, smooth } from './util.js';
import { ST } from './shared.js';
import { H_LH, LH } from './course.js';
import { PR, camera, renderer, scene } from './stage.js';
import { LH_TOP, grassU, lighthouse } from './island.js';
import { tmpV } from './rules.js';
import { golfer, kitU } from './golfer.js';
import { SIM } from './physics.js';
import { G } from './round.js';
import { cam } from './camera.js';
// ---------------------------------------------------------------- post: painterly strokes, tilt-shift, grade (after the lighthouse scenes)
// the scene is drawn once into its own MSAA target; the post chain runs on plain (non-MSAA) targets, so no pass pays a multisample resolve
export const sceneRT = new THREE.WebGLRenderTarget(innerWidth * PR, innerHeight * PR, { type: THREE.HalfFloatType, samples: +(new URLSearchParams(location.search).get('msaa') ?? 0) });   // no MSAA: the painterly pass softens the edges, and 4× on this half-float target cost ~6 ms of GPU a frame (?msaa=4 brings it back)
export const rt = new THREE.WebGLRenderTarget(innerWidth * PR, innerHeight * PR, { type: THREE.HalfFloatType });
export const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(PR); composer.setSize(innerWidth, innerHeight);
export const quadVS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';
// generalized Kuwahara (opus-1 post.js): four overlapping 4x4 quadrants, weighted by their own spread, so flat patches with soft edges
// it runs on a half-resolution target with twice the reach in source pixels, so the patches read as brush strokes at 1x; kmix brings it back up
export const kuwaRT = new THREE.WebGLRenderTarget(innerWidth * PR / 2, innerHeight * PR / 2, { type: THREE.HalfFloatType });
export const kuwa = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, res: { value: new THREE.Vector2(1, 1) } },
  vertexShader: quadVS,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; varying vec2 vUv;
    float kh(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
    float kn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(kh(i), kh(i+vec2(1,0)), f.x), mix(kh(i+vec2(0,1)), kh(i+vec2(1,1)), f.x), f.y); }
    float wt(vec3 m, vec3 s){ vec3 v = max(s / 9.0 - (m / 9.0) * (m / 9.0), 0.0); return 1.0 / (1.0 + pow(255.0 * sqrt(v.r + v.g + v.b), 8.0)); }
    void main(){
      vec3 m0 = vec3(0.0), m1 = vec3(0.0), m2 = vec3(0.0), m3 = vec3(0.0), s0 = vec3(0.0), s1 = vec3(0.0), s2 = vec3(0.0), s3 = vec3(0.0);
      vec2 st = 4.0 * max(1.0, res.y / 1100.0) / res;   // 3x3 taps per quadrant, in full-resolution pixels
      // each pixel's stroke direction follows a slow noise field; the grid is stretched along it, so the patches are brush strokes
      float ang = kn(vUv * res / 90.0) * 6.2832 + 0.6 * kn(vUv * res / 23.0 + 7.0);
      vec2 ax = vec2(cos(ang), sin(ang)), ay = vec2(-ax.y, ax.x);
      mat2 R = mat2(ax * 1.45, ay * 0.6);
      // the four quadrants share their axis rows and centre: read the 5x5 grid once (25 reads, not 36) and add each tap to the quadrants it is in
      for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
        vec3 c = max(texture2D(tDiffuse, vUv + (R * vec2(float(i), float(j))) * st).rgb, 0.0), q = sqrt(c);
        if (i <= 0 && j <= 0) { m0 += q; s0 += c; }
        if (i >= 0 && j <= 0) { m1 += q; s1 += c; }
        if (i <= 0 && j >= 0) { m2 += q; s2 += c; }
        if (i >= 0 && j >= 0) { m3 += q; s3 += c; }
      }
      float w0 = wt(m0, s0), w1 = wt(m1, s1), w2 = wt(m2, s2), w3 = wt(m3, s3);
      vec3 k = (m0 * w0 + m1 * w1 + m2 * w2 + m3 * w3) / (9.0 * (w0 + w1 + w2 + w3) + 1e-30);
      gl_FragColor = vec4(k * k, 1.0);
    }`,
}, 'tScene');   // reads sceneRT, not the composer's read buffer
kuwa.uniforms.tDiffuse.value = sceneRT.texture;
kuwa.needsSwap = false;
kuwa.render = (r) => { r.setRenderTarget(kuwaRT); (kuwa.fsQuad ?? kuwa._fsQuad).render(r); };
composer.addPass(kuwa);
export const kmix = new ShaderPass({
  uniforms: { tK: { value: null }, tS: { value: null }, res: { value: new THREE.Vector2(1, 1) }, amt: { value: 0.9 }, focus: { value: 0.5 }, band: { value: 0.16 }, lamp: { value: new THREE.Vector3(-9, -9, 0.05) }, keepB: { value: new THREE.Vector3(-9, -9, 0.03) } },
  vertexShader: quadVS,
  fragmentShader: `uniform sampler2D tK, tS; uniform vec2 res; uniform float amt, focus, band; uniform vec3 lamp, keepB; varying vec2 vUv;
    void main(){
      vec2 h = 1.5 / res;   // a 4-tap tent of about one half-resolution texel, so block edges read as soft strokes, not steps
      vec3 c = texture2D(tS, vUv).rgb, k = 0.25 * (texture2D(tK, vUv + vec2(h.x, h.y * 0.4)).rgb + texture2D(tK, vUv - vec2(h.x, h.y * 0.4)).rgb + texture2D(tK, vUv + vec2(-h.x * 0.4, h.y)).rgb + texture2D(tK, vUv + vec2(h.x * 0.4, -h.y)).rgb);
      float sharp = smoothstep(lamp.z, lamp.z * 0.55, length((vUv - lamp.xy) * vec2(res.x / res.y, 1.0)));   // the lantern room keeps its posts and glass
      vec2 mh = 1.5 / res; float m0 = 1.0 - texture2D(tS, vUv).a;
      float mk = max(max(m0, 1.0 - texture2D(tS, vUv + vec2(mh.x, 0.0)).a), max(1.0 - texture2D(tS, vUv - vec2(mh.x, 0.0)).a, max(1.0 - texture2D(tS, vUv + vec2(0.0, mh.y)).a, 1.0 - texture2D(tS, vUv - vec2(0.0, mh.y)).a)));
      sharp = max(sharp, 0.6 * smoothstep(band * 0.7, band * 0.35, abs(vUv.y - focus)));   // the miniature's focus band keeps its chalk crisp
      sharp = max(sharp, mk);   // the boy's own pixels (his silhouette mask) keep their detail
      gl_FragColor = vec4(mix(c, k, amt * (1.0 - 0.9 * sharp)), 1.0 - m0);   // alpha carries the boy's mask on to the grade
    }`,
}, 'tNone');
kmix.uniforms.tK.value = kuwaRT.texture; kmix.uniforms.tS.value = sceneRT.texture;
composer.addPass(kmix);
export const tiltFS = `uniform sampler2D tDiffuse; uniform vec2 res, dir; uniform float focus, band, maxR; uniform vec3 spot; varying vec2 vUv;
  // a miniature's lens: a sharp band through the subject, the blur growing smoothly and strongly away from it, stronger toward
  // the far top of the frame than the near bottom (refs: tilt-shift photographs of a street seen from above)
  void main(){ float dy = vUv.y - focus; float off = max(0.0, abs(dy) - band * 0.62) / 0.55;
    float k = clamp(off * off * 1.6 + off * 0.35, 0.0, 1.0) * (dy > 0.0 ? 1.0 : 0.82);
    vec2 sd = (vUv - spot.xy) * vec2(res.x / res.y, 1.0); k *= smoothstep(spot.z, spot.z * 1.8, length(sd));   // a second, round focus on the lighthouse
    float r = k * maxR;
    if (r < 0.35) { gl_FragColor = texture2D(tDiffuse, vUv); return; }
    vec4 s = vec4(0.0); float w = 0.0;
    for (int i = -9; i <= 9; i++) { float t = float(i) / 9.0; float g = exp(-t * t * 2.0); s += texture2D(tDiffuse, vUv + dir * t * r / res) * g; w += g; }
    gl_FragColor = s / w; }`;
export const tiltU = () => ({ tDiffuse: { value: null }, res: { value: new THREE.Vector2(1, 1) }, dir: { value: new THREE.Vector2(1, 0) }, focus: { value: 0.5 }, band: { value: 0.16 }, maxR: { value: 7 }, spot: { value: new THREE.Vector3(-9, -9, 0.1) } });
export const tiltH = new ShaderPass({ uniforms: tiltU(), vertexShader: quadVS, fragmentShader: tiltFS });
export const tiltV = new ShaderPass({ uniforms: tiltU(), vertexShader: quadVS, fragmentShader: tiltFS }); tiltV.uniforms.dir.value.set(0, 1);
composer.addPass(tiltH); composer.addPass(tiltV);
export const grade = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, res: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uDusk: { value: 0 }, uFlash: { value: 0 }, uStorm: { value: 0 }, uBolt: { value: 0 }, spot: { value: new THREE.Vector3(-9, -9, 0.1) }, lamp: { value: new THREE.Vector3(-9, -9, 0.05) }, keepB: { value: null } },
  vertexShader: quadVS,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res, uMist; uniform float uTime, uDusk, uFlash, uStorm, uBolt, uHz0; uniform vec3 spot, lamp, keepB; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
    float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
    void main(){
      vec2 px = vUv * res;
      vec2 d = (vec2(n(px/14.0), n(px/14.0 + 17.0)) - 0.5) * 3.2 / res;   // brush-like smear along a slow noise field
      d *= 1.0 - smoothstep(lamp.z, lamp.z * 0.55, length((vUv - lamp.xy) * vec2(res.x / res.y, 1.0)));
      float boyK = 1.0 - texture2D(tDiffuse, vUv).a;   // the boy's pixels (kmix passes his mask on in alpha) skip the smear and keep a little more of their own colour
      d *= 1.0 - boyK;
      vec3 c = texture2D(tDiffuse, vUv + d).rgb, c0 = c;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      // misty haze toward the top of the frame, teal shadows and warm light (the lighthouse grade)
      vec3 haze = mix(mix(vec3(0.62, 0.68, 0.58), vec3(0.33, 0.38, 0.39), uStorm), vec3(0.12, 0.07, 0.04), uDusk);   // 01.jpg's cream-green distance (slate grey in the storm)
      float clearLH = 1.0 - 0.7 * smoothstep(spot.z * 1.6, spot.z * 0.6, length((vUv - spot.xy) * vec2(res.x / res.y, 1.0)));   // the lighthouse stands clear of the haze
      // the mist: lighter than a flat band, in soft patches that drift on the wind and stay with the island as the camera pans
      vec2 mp = vUv * vec2(res.x / res.y, 1.0) + uMist;
      float mist = 0.65 * n(mp * 2.6 + vec2(uTime * 0.012, 0.0)) + 0.35 * n(mp * 6.3 - vec2(0.0, uTime * 0.009) + 11.0);
      float hz = smoothstep(uHz0, 1.1, vUv.y) * (0.07 + 0.13 * smoothstep(0.32, 0.78, mist)) + 0.045 * smoothstep(0.55, 0.85, mist) * (1.0 - boyK);
      c = mix(c, haze, hz * clearLH * (1.0 - 0.85 * uDusk));   // the night keeps no grey mist over the floodlit field
      c *= mix(vec3(0.9, 1.03, 1.03), vec3(1.04, 1.0, 0.93), smoothstep(0.03, 0.5, l));
      c = mix(c, vec3(0.96, 0.93, 0.80) * max(l * 1.1, 0.6), smoothstep(0.45, 0.85, l) * 0.18 * (1.0 - uDusk));   // cream highlights
      c *= mix(vec3(1.0), vec3(1.04, 1.02, 0.88), smoothstep(0.02, 0.1, c.r - c.b) * smoothstep(0.05, 0.18, l) * (1.0 - uDusk));   // lit grass stays warm ochre through the haze
      c = max(mix(vec3(l), c, 0.97), 0.0);
      c = mix(c, vec3(l) * vec3(0.8, 0.92, 1.0), uStorm * 0.55) * (1.0 - 0.3 * uStorm);   // the storm: cold, dark, drained of colour
      c *= 1.0 - uStorm * 0.38 * smoothstep(0.55, 1.0, vUv.y);   // and heavier overhead: the top of the frame darkens under the cloud
      c += vec3(0.75, 0.82, 1.0) * uBolt * 0.35 * (0.4 + l);
      c = mix(c, c0 * mix(vec3(1.0), vec3(0.75, 0.8, 1.1), uDusk), boyK * 0.5);
      c += vec3(0.010, 0.018, 0.017);
      float lf = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = max(mix(vec3(lf), c, 1.0 + uFlash * 0.7), 0.0) * (1.0 + uFlash * 0.3) + vec3(0.07, 0.035, 0.0) * uFlash;   // a big hit's flash: an additive warm pop that brightens and keeps (even boosts) the colour
      c *= 1.0 + ((n(px / 3.0) - 0.5) * 0.08 + (h(px + fract(uTime) * 91.0) - 0.5) * 0.06);
      c = mix(c, c * vec3(0.55, 0.8, 1.35), uDusk * (1.0 - smoothstep(0.06, 0.24, lf)));   // night shadows go blue: only the floodlit turf keeps its warmth
      vec2 q = vUv - 0.5; c *= max(1.0 - dot(q, q) * mix(0.55, 2.2, uDusk), 0.12);   // at night the frame falls off to dark at its edges, as refs/07
      gl_FragColor = vec4(c, 1.0);
    }`,
});
grade.uniforms.keepB.value = kmix.uniforms.keepB.value;   // the same Vector3, set each frame
grade.uniforms.uMist = { value: new THREE.Vector2() };
grade.uniforms.uHz0 = { value: 0.42 };   // where the top haze starts: higher in the far diorama view, which has the field up there
composer.addPass(grade);
composer.addPass(new OutputPass());
window.__composer = composer;   // for perf variants
export function sizePasses() {
  const w = innerWidth * PR, h = innerHeight * PR;
  sceneRT.setSize(w, h); kuwaRT.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
  for (const p of [kuwa, kmix, tiltH, tiltV, grade]) p.uniforms.res.value.set(w, h);
  tiltH.uniforms.maxR.value = tiltV.uniforms.maxR.value = Math.max(8, h * 0.02);
}
sizePasses();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); sizePasses(); });

// the post pass follows the play each frame: focus band on the ball, lamp glare, mist, grade
export function updatePost(dt) {
  // the tilt-shift band rides on the ball (a little ahead of it while aiming, so the target stays readable)
  if (G.phase === 'title' || G.phase === 'card') tmpV.set(0, 3, 4); else if (G.phase === 'intro') tmpV.copy(cam.look); else if (G.phase === 'aim' || G.phase === 'swing') tmpV.set(golfer.bx + golfer.fx * 2.2, golfer.by, golfer.bz + golfer.fz * 2.2); else tmpV.copy(SIM.pos);
  tmpV.project(camera); cam.fy += (clamp(tmpV.y * 0.5 + 0.5, 0.3, 0.68) - cam.fy) * Math.min(1, dt * 6);
  const fy = cam.fy; tiltH.uniforms.focus.value = tiltV.uniforms.focus.value = kmix.uniforms.focus.value = fy;
  tiltH.uniforms.spot.value.set(-9, -9, 0.01); tiltV.uniforms.spot.value.copy(tiltH.uniforms.spot.value); grade.uniforms.spot.value.copy(tiltH.uniforms.spot.value);
  { tmpV.set(LH.x, H_LH + LH_TOP + 0.9, LH.z).project(camera); const z = 1.6 / Math.max(4, camera.position.distanceTo(lighthouse.position)) * 2.2; kmix.uniforms.lamp.value.set(tmpV.x * 0.5 + 0.5, tmpV.y * 0.5 + 0.5, z); grade.uniforms.lamp.value.copy(kmix.uniforms.lamp.value); }
  const band = lerp(0.16, 0.2, cam.dio); tiltH.uniforms.band.value = tiltV.uniforms.band.value = kmix.uniforms.band.value = band;
  grassU.uTime.value = ST.gameTime; grassU.uDusk.value = smooth(0, 1, ST.dusk); kitU.uNight.value = smooth(0.2, 0.8, ST.dusk);
  grassU.uBoy.value.set(golfer.holder.position.x, golfer.holder.position.y, golfer.holder.position.z);
  grade.uniforms.uMist.value.set(cam.look.x * 0.028, -cam.look.z * 0.022); grade.uniforms.uHz0.value = lerp(0.42, 0.66, cam.dio);
  grade.uniforms.uTime.value = ST.gameTime; grade.uniforms.uDusk.value = smooth(0, 1, ST.dusk); grade.uniforms.uFlash.value = ST.flash;
}
export function renderFrame(dt) {
  renderer.setRenderTarget(sceneRT); renderer.render(scene, camera);
  composer.render(dt);
}

// ---------------------------------------------------------------- crisp materials: alpha 0 keeps the painterly pass off the small things (ball, pole, flag, club)
export let crispN = 0;
export function crisp(m) { const o = m.onBeforeCompile, id = 'crisp' + (crispN++); m.onBeforeCompile = (sh, r) => { if (o) o.call(m, sh, r); sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.a = 0.0;'); }; m.customProgramCacheKey = () => id; return m; }
