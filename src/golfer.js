import './pins.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clone as skelClone } from 'three/addons/utils/SkeletonUtils.js';
import { named, scene, std } from './stage.js';
import { TEX_SOFT_SHADOW } from './island.js';
import { playerGLB } from './pins.js';

// ---------------------------------------------------------------- the golfer: the library figure on the island's animation clips, in a player's kit colours
export const PS = 0.5;   // 1.7 m figure to 0.85 on the course
export let pMap = null; playerGLB.scene.traverse(o => { if (o.isSkinnedMesh && !pMap) pMap = o.material.map; });
export const PCLIPS = Object.fromEntries(playerGLB.animations.map(c => [c.name, c]));
export const kitU = { uJersey: { value: new THREE.Color('#d8503a') }, uCap: { value: new THREE.Color('#f0e6c6') }, uPants: { value: new THREE.Color('#e6dcc0') }, uTrim: { value: new THREE.Color('#2b3a2f') }, uNight: { value: 0 } };
export function kitMaterial() {
  const m = new THREE.MeshStandardMaterial({ map: pMap, roughness: 0.85, metalness: 0 });
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, kitU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vY;').replace('#include <begin_vertex>', '#include <begin_vertex>\n vY = position.y;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uJersey, uCap, uPants, uTrim; uniform float uNight; varying float vY;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        { vec3 t = diffuseColor.rgb; float L = dot(t, vec3(0.2126, 0.7152, 0.0722));
          float orange = smoothstep(0.42, 0.28, t.g / max(t.r, 1e-3)) * smoothstep(0.1, 0.3, t.r);
          vec3 c = mix(t, uJersey * clamp(L / 0.22, 0.55, 1.25), orange);
          float dark = smoothstep(0.07, 0.025, L) * (1.0 - orange);
          vec3 dc = vY > 1.39 ? uCap : (vY < 0.97 && vY > 0.45 ? uPants : uTrim);
          c = mix(c, dc * (0.75 + 5.0 * L), dark);
          diffuseColor.rgb = c; }`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vY > 1.39 ? 0.45 : 0.85;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * vec3(1.0, 0.95, 0.85) * 0.42;')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.rgb *= 1.0 - 0.7 * smoothstep(0.45, 0.85, 1.0 - abs(dot(normal, normalize(vViewPosition))));\n gl_FragColor.a = 0.0;');   // alpha 0: the painterly pass leaves the golfer crisp
  };
  m.customProgramCacheKey = () => 'golferKit';
  return m;
}
export const golfer = { holder: new THREE.Group(), pose: { back: 0, through: 0 }, bones: {}, acts: {}, cur: '', lock: 0 };
{
  const root = skelClone(playerGLB.scene);
  golfer.holder.name = 'golfer'; golfer.holder.add(root); scene.add(golfer.holder);
  root.traverse(o => { if (o.isSkinnedMesh) golfer.mesh = o; if (o.isBone) golfer.bones[o.name] = o; });
  golfer.mesh.name = 'golfer_body'; golfer.mesh.frustumCulled = false; golfer.mesh.castShadow = true; golfer.mesh.receiveShadow = true; golfer.mesh.material = kitMaterial();
  golfer.holder.scale.setScalar(PS);
  golfer.mixer = new THREE.AnimationMixer(root);
  for (const n of ['Idle_Loop', 'Celebration', 'Dance_Loop', 'Hit_Chest', 'Jog_Fwd_Loop', 'Crouch_Idle_Loop']) golfer.acts[n] = golfer.mixer.clipAction(PCLIPS[n]);
}
export function golferClip(n, fade = 0.2) {
  if (golfer.cur === n) return; const a = golfer.acts[n], o = golfer.acts[golfer.cur];
  a.reset().setEffectiveWeight(1).fadeIn(fade).play(); if (o) o.fadeOut(fade); golfer.cur = n;
}
golferClip('Idle_Loop', 0);
// the club: a shaft and a head, hung from the right hand; its look follows the club picked
export const clubG = new THREE.Group(); clubG.name = 'club';
export const clubMat = std('#c9c3b0', { roughness: 0.5, metalness: 0 }), clubHeadMat = std('#3a3430', { roughness: 0.5 });
{
  const shaft = named(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 1, 6).translate(0, -0.5, 0), clubMat), 'club_shaft'); shaft.castShadow = true; clubG.add(shaft); clubG.userData.shaft = shaft;
  const head = named(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.09, 0.07), clubHeadMat), 'club_head'); clubG.add(head); clubG.userData.head = head;
  scene.add(clubG);
}
export function setClubLook(c) {
  const L = { driver: 1.0, iron: 0.9, wedge: 0.86, putter: 0.8 }[c.id], head = clubG.userData.head, shaft = clubG.userData.shaft;
  clubG.userData.len = L; shaft.scale.y = L;
  head.scale.set(c.id === 'driver' ? 1.5 : c.id === 'putter' ? 1.4 : 1, c.id === 'driver' ? 1.3 : c.id === 'putter' ? 0.8 : 0.8, c.id === 'driver' ? 1.3 : 1);
  head.material.color.set(c.id === 'driver' ? '#2a2420' : c.id === 'putter' ? '#c9a24a' : '#8d8a80'); head.position.y = -L - 0.02;
}
export const blobMat = () => new THREE.MeshBasicMaterial({ map: TEX_SOFT_SHADOW, color: 0, transparent: true, opacity: 0.55, depthWrite: false });
export const golferShadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16).rotateX(-Math.PI / 2), blobMat()); golferShadow.name = 'golferShadow'; golferShadow.renderOrder = 1; scene.add(golferShadow);
