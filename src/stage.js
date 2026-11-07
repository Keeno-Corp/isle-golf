import './course.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { clamp, lerp, smooth } from './util.js';
import { ST } from './shared.js';
import { houseLamp, seaMat, windowMat } from './island.js';

// ---------------------------------------------------------------- renderer, scene, camera
export const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
export const PR = Math.min(devicePixelRatio || 1, 1.5);
renderer.setPixelRatio(PR); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;   // the 4096 sun map is redrawn every 4th frame (frame()): what casts moves slowly (cow, sheep, crowd); every frame cost ~5 ms of GPU
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);
export const scene = new THREE.Scene();
export const FOG_DAY = new THREE.Color('#bccabd'), FOG_NIGHT = new THREE.Color('#3a2a20');
scene.fog = new THREE.Fog(FOG_DAY.clone(), 62, 175);
scene.background = FOG_DAY.clone();
export const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 700);

export const hemi = new THREE.HemisphereLight('#d9ecdf', '#3f6a3a', 1.25); hemi.name = 'skyLight'; scene.add(hemi);
export const sun = new THREE.DirectionalLight('#fff0d6', 2.9); sun.name = 'sun';
sun.position.set(-22, 30, 14); sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 5, far: 110 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.035;
scene.add(sun, sun.target);
export const SUN_DAY = new THREE.Color('#fff0d6'), SUN_NIGHT = new THREE.Color('#6d7ab0');

export const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...o });
export function named(mesh, name, shadow = true) { mesh.name = name; mesh.castShadow = shadow; mesh.receiveShadow = true; return mesh; }
// fewer draw calls: the static leaf meshes directly under `parent` that share a material become one mesh (named after the first)
export function mergeChildren(parent, keep = []) {
  const byMat = new Map();
  for (const c of parent.children) if (c.isMesh && !c.children.length && c.visible && !keep.includes(c)) { if (!byMat.has(c.material)) byMat.set(c.material, []); byMat.get(c.material).push(c); }
  for (const [mat, ms] of byMat) {
    if (ms.length < 2) continue;
    const flat = ms.some(m => !m.geometry.index);
    const gs = ms.map(m => { m.updateMatrix(); const g = (flat && m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrix); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', ...(mat.vertexColors ? ['color'] : [])].includes(k)) g.deleteAttribute(k); return g; });
    const merged = mergeGeometries(gs); if (!merged) continue;
    const m = named(new THREE.Mesh(merged, mat), ms[0].name, ms.some(x => x.castShadow)); m.renderOrder = ms[0].renderOrder;
    ms.forEach(x => parent.remove(x)); parent.add(m);
  }
}

// ---------------------------------------------------------------- sky dome
export const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { uDusk: { value: 0 } },
  vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform float uDusk; varying vec3 vD;
    void main(){ float h = clamp(vD.y, 0.0, 1.0);
      vec3 day = mix(vec3(0.45,0.56,0.50), vec3(0.30,0.48,0.47), smoothstep(0.0,0.5,h));
      vec3 night = mix(vec3(0.03,0.045,0.09), vec3(0.01,0.02,0.05), smoothstep(0.0,0.5,h));
      gl_FragColor = vec4(mix(day, night, uDusk), 1.0); }`,
});
export const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 24, 12), skyMat); sky.name = 'sky'; scene.add(sky);

export function updateWorld(dt) {
  ST.dusk += clamp(ST.duskTarget - ST.dusk, -dt / 0.15, dt / 0.15);   // the floodlights snap up in a few frames, so N reads at once
  const dk = smooth(0, 1, ST.dusk);
  sun.intensity = lerp(2.9, 0.22, dk); sun.color.copy(SUN_DAY).lerp(SUN_NIGHT, dk);
  hemi.intensity = lerp(1.25, 0.32, dk); hemi.color.set('#d9ecdf').lerp(new THREE.Color('#845635'), dk);
  scene.fog.color.copy(FOG_DAY).lerp(FOG_NIGHT, dk); scene.background.copy(scene.fog.color);
  seaMat.uniforms.uFog.value.copy(scene.fog.color); seaMat.uniforms.uDusk.value = dk; seaMat.uniforms.uTime.value = ST.gameTime;
  skyMat.uniforms.uDusk.value = dk;
  windowMat.emissiveIntensity = smooth(0.2, 0.8, ST.dusk) * 3.5; houseLamp.intensity = smooth(0.2, 0.8, ST.dusk) * 1.1;   // a porch glow on the ground: the walls stay dark so the windows read as lit squares
  if (ST.flashHold > 0) ST.flashHold = Math.max(0, ST.flashHold - dt); else ST.flash = Math.max(0, ST.flash - dt * 14);   // a hit's flash: held 3 frames at its peak, gone 4 frames later
}
