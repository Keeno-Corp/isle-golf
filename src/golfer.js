import './pins.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { named, scene, std } from './stage.js';
import { TEX_SOFT_SHADOW } from './island.js';
import { crisp } from './post.js';
import { addUpdate } from './shared.js';
import { curP } from './round.js';
import { playerGLB } from './pins.js';

// A lightweight pose rig drives the footballer's skin and the two-hand club IK.
export const PS = 1;
export const PCLIPS = {};
export const kitU = { uJersey: { value: new THREE.Color('#d8503a') }, uCap: { value: new THREE.Color('#f0e6c6') }, uPants: { value: new THREE.Color('#e6dcc0') }, uTrim: { value: new THREE.Color('#2b3a2f') }, uNight: { value: 0 } };
export const golfer = { holder: new THREE.Group(), pose: { back: 0, through: 0 }, J: {}, cur: '', t: 0, walk: 0, ph: 0, state: 'address', lock: 0 };
export const HIP_Y = 0.36, TH = 0.17, SH = 0.165, UA = 0.16, FA = 0.15, SHOULDER = { x: 0.105, y: 0.205 };
{
  const g = golfer.holder; g.name = 'golfer'; scene.add(g);
  const body = golfer.body = new THREE.Group(); body.name = 'golfer_body'; g.add(body);
  // legs hang from the body group at the hip height; the foot sits flat
  golfer.legs = [-1, 1].map(side => {
    const th = new THREE.Group(); th.name = 'golfer_thigh'; th.position.set(side * 0.065, HIP_Y, 0); body.add(th);
    const kn = new THREE.Group(); kn.position.y = -TH; th.add(kn);
    const ft = new THREE.Group(); ft.position.y = -SH; kn.add(ft);
    return { th, kn, ft, side };
  });
  const hips = golfer.hips = new THREE.Group(); hips.name = 'golfer_hips'; hips.position.y = HIP_Y; body.add(hips);
  const spine = golfer.spine = new THREE.Group(); spine.position.y = 0.04; hips.add(spine);
  golfer.arms = [-1, 1].map(side => {   // side -1 = the golfer's right (the club hand), +1 = left
    const A = new THREE.Group(); A.name = 'golfer_arm'; A.position.set(side * SHOULDER.x, SHOULDER.y, 0); spine.add(A);
    const E = new THREE.Group(); E.position.y = -UA; A.add(E);
    return { A, E, side };
  });
  const neck = new THREE.Group(); neck.position.y = 0.285; spine.add(neck);
  const head = golfer.head = new THREE.Group(); head.name = 'golfer_head'; head.position.y = 0.1; neck.add(head);
  g.traverse(o => { if (o.isMesh) o.receiveShadow = true; });
}
// animation names kept from the old figure (round.js, meter.js and the checks use them): Idle_Loop (address), Celebration, Dance_Loop, plus Dismay, Walk
export const CLIPS = ['Idle_Loop', 'Celebration', 'Dance_Loop', 'Dismay', 'Walk'];
export function golferClip(n, fade = 0.2) { if (golfer.cur === n || !CLIPS.includes(n)) return; golfer.cur = n; golfer.t = 0; golfer.fade = fade; }
golferClip('Idle_Loop', 0);

const player = playerGLB.scene;
player.name = 'footballer';
player.scale.setScalar(0.46);
golfer.holder.add(player);
player.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.frustumCulled = false; } });
player.traverse(o => {
  if (!o.isMesh) return;
  for (const mat of [].concat(o.material)) {
    mat.onBeforeCompile = shader => {
      shader.uniforms.uJersey = kitU.uJersey;
      shader.fragmentShader = 'uniform vec3 uJersey;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n if (diffuseColor.r > diffuseColor.g * 1.3 && diffuseColor.r > diffuseColor.b * 1.3) diffuseColor.rgb = uJersey * (0.55 + diffuseColor.r * 0.7);');
    };
    mat.needsUpdate = true;
  }
});
player.updateMatrixWorld(true);
const bindings = [];
function bind(name, target, down = false) {
  const bone = player.getObjectByName(name), rest = bone.getWorldQuaternion(new THREE.Quaternion());
  if (down) rest.premultiply(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0).applyQuaternion(rest), new THREE.Vector3(0, -1, 0)));
  bindings.push({ bone, target, rest });
}
bind('DEF-hips', golfer.hips);
bind('DEF-spine001', golfer.spine);
bind('DEF-head', golfer.head);
for (let i = 0; i < 2; i++) {
  const side = i === 0 ? 'R' : 'L', a = golfer.arms[i], l = golfer.legs[i];
  bind('DEF-upper_arm' + side, a.A, true); bind('DEF-forearm' + side, a.E, true);
  const hand = new THREE.Group(); hand.position.y = -FA - 0.012; a.E.add(hand);
  bind('DEF-hand' + side, hand, true);
  bind('DEF-thigh' + side, l.th, true); bind('DEF-shin' + side, l.kn, true); bind('DEF-foot' + side, l.ft);
}
const wp = new THREE.Vector3(), wq = new THREE.Quaternion(), pq = new THREE.Quaternion();
export function retargetPlayer() {
  golfer.holder.updateMatrixWorld(true);
  for (const { bone, target, rest } of bindings) {
    target.getWorldPosition(wp); target.getWorldQuaternion(wq);
    wq.multiply(rest);
    bone.parent.updateWorldMatrix(true, false);
    bone.position.copy(bone.parent.worldToLocal(wp));
    bone.parent.getWorldQuaternion(pq).invert(); bone.quaternion.copy(pq.multiply(wq));
    bone.updateMatrixWorld(true);
  }
}
const headBone = player.getObjectByName('DEF-head');
const helmet = new THREE.Group(); helmet.name = 'footballer_helmet'; headBone.add(helmet);
helmet.scale.setScalar(1 / 0.46); helmet.position.set(0, 0.032 / 0.46, 0.012 / 0.46);
const shell = new THREE.MeshStandardMaterial({ color: '#2d63c8', roughness: 0.3 }); crisp(shell);
const white = new THREE.MeshStandardMaterial({ color: '#f6f2e8', roughness: 0.35 }); crisp(white);
const R = 0.072;
const helmetShell = new THREE.Mesh(new THREE.SphereGeometry(R, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.68), shell); helmetShell.name = 'footballer_helmetShell'; helmet.add(helmetShell);
const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.018, R * 0.2, R * 2.05), white); stripe.position.y = R * 0.9; helmet.add(stripe);
for (const y of [-0.03, -0.012, 0.008]) { const bar = new THREE.Mesh(new THREE.TorusGeometry(R * 0.6, 0.0065, 6, 16, Math.PI), white); bar.position.set(0, y, R * 0.7); bar.rotation.z = Math.PI; helmet.add(bar); }
// the club: a shaft and a head, hung from the right hand; its look follows the club picked
export const clubG = new THREE.Group(); clubG.name = 'club';
export const clubMat = std('#c9c3b0', { roughness: 0.5, metalness: 0 }), clubHeadMat = std('#3a3430', { roughness: 0.5 });
{
  const shaft = named(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 1, 6).translate(0, -0.5, 0), clubMat), 'club_shaft'); shaft.castShadow = true; clubG.add(shaft); clubG.userData.shaft = shaft;
  const head = named(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), clubHeadMat), 'club_head'); clubG.add(head); clubG.userData.head = head;
  const grip = named(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.02, 0.22, 6).translate(0, -0.11, 0), std('#2b2622', { roughness: 0.9 })), 'club_grip'); clubG.add(grip); clubG.userData.grip = grip; crisp(grip.material);
  scene.add(clubG);
}
// club heads: the face looks along the club's local +x (pose.js turns +x toward the target), the toe-heel line runs along z
export const HEADS = {
  driver: () => { const g = new THREE.SphereGeometry(0.06, 14, 10).scale(1.0, 0.7, 0.95); return g.translate(0.01, 0, 0.0); },
  iron: () => new THREE.BoxGeometry(0.022, 0.05, 0.1).translate(0.011, -0.012, 0.04),
  wedge: () => new THREE.BoxGeometry(0.026, 0.055, 0.09).translate(0.013, -0.012, 0.03),
  putter: () => new THREE.BoxGeometry(0.05, 0.04, 0.16).translate(0.02, -0.005, 0.06),
};
export function setClubLook(c) {
  const id = c.id, L = { driver: 1.0, iron: 0.9, wedge: 0.86, putter: 0.8 }[id], head = clubG.userData.head, shaft = clubG.userData.shaft;
  clubG.userData.len = L; shaft.scale.y = L;
  if (head.userData.id !== id) { head.geometry.dispose(); head.geometry = HEADS[id](); head.userData.id = id; }
  head.rotation.set(0, 0, id === 'driver' ? 0.12 : id === 'putter' ? 0.05 : id === 'wedge' ? 0.5 : 0.32);   // loft
  head.material.color.set(id === 'driver' ? '#3a2a20' : id === 'putter' ? '#d2ab4a' : '#b9b6aa'); head.position.y = -L - 0.02;
  clubG.userData.grip.visible = true;
}
export const blobMat = () => new THREE.MeshBasicMaterial({ map: TEX_SOFT_SHADOW, color: 0, transparent: true, opacity: 0.55, depthWrite: false });
export const golferShadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16).rotateX(-Math.PI / 2), blobMat()); golferShadow.name = 'golferShadow'; golferShadow.renderOrder = 1; scene.add(golferShadow);


// The textured jersey follows the player's kit through its shader uniform.
export const SHIRT_BOOST = 0.6;
export function applyKit(p) {
  if (!p || !p.kit) return;
  kitU.uJersey.value.set(p.kit.col); kitU.uCap.value.set(p.kit.cap); kitU.uPants.value.set(p.kit.pants);
}
addUpdate(() => { try { applyKit(curP()); } catch (e) { } });
