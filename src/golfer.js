import './pins.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { named, scene, std } from './stage.js';
import { TEX_SOFT_SHADOW } from './island.js';
import { crisp } from './post.js';
import { addUpdate } from './shared.js';
import { curP } from './round.js';

// ---------------------------------------------------------------- the golfer: a toy figure built in code (the football figure is gone): cap, polo shirt, slacks, golf shoes, a glove,
// on a hierarchy of joints (hips > spine > shoulders > elbows, hips > thighs > knees) that pose.js drives with hand IK. Local axes: +x is the target line, +z the ball, +y up.
export const PS = 1;
export const PCLIPS = {};
export const kitU = { uJersey: { value: new THREE.Color('#d8503a') }, uCap: { value: new THREE.Color('#f0e6c6') }, uPants: { value: new THREE.Color('#e6dcc0') }, uTrim: { value: new THREE.Color('#2b3a2f') }, uNight: { value: 0 } };
export const SKINS = ['#e8b48c', '#c98f66', '#f1c6a0', '#9a6340'];
const mk = (c, o = {}) => crisp(new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, ...o }));
export const GM = { shirt: mk('#d8503a'), shirtTrim: mk('#f0e6c6'), pants: mk('#e6dcc0'), skin: mk('#e8b48c'), cap: mk('#f0e6c6'), shoe: mk('#f4f0e4'), shoeTip: mk('#3a2f28'), sole: mk('#3a2f28'), glove: mk('#fbf8ef'), hair: mk('#5a3a25'), belt: mk('#2f3a2f'), ink: crisp(new THREE.MeshBasicMaterial({ color: '#2a1d18' })), cheek: crisp(new THREE.MeshBasicMaterial({ color: '#e8806a' })) };
export const golfer = { holder: new THREE.Group(), pose: { back: 0, through: 0 }, J: {}, cur: '', t: 0, walk: 0, ph: 0, state: 'address', lock: 0 };
export const HIP_Y = 0.36, TH = 0.17, SH = 0.165, UA = 0.16, FA = 0.15, SHOULDER = { x: 0.105, y: 0.205 };
{
  const g = golfer.holder; g.name = 'golfer'; scene.add(g);
  const body = golfer.body = new THREE.Group(); body.name = 'golfer_body'; g.add(body);
  const add = (parent, geo, mat, name, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, mat); o.name = name; o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
  const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 4, 10);
  // legs hang from the body group at the hip height; the foot sits flat
  golfer.legs = [-1, 1].map(side => {
    const th = new THREE.Group(); th.name = 'golfer_thigh'; th.position.set(side * 0.065, HIP_Y, 0); body.add(th);
    add(th, cap(0.058, 0.1), GM.pants, 'golfer_slack', 0, -TH * 0.5, 0);
    const kn = new THREE.Group(); kn.position.y = -TH; th.add(kn);
    add(kn, cap(0.05, 0.1), GM.pants, 'golfer_shin', 0, -SH * 0.5, 0);
    const ft = new THREE.Group(); ft.position.y = -SH; kn.add(ft);
    add(ft, new THREE.BoxGeometry(0.085, 0.05, 0.15).translate(0, -0.015, 0.04), GM.shoe, 'golfer_shoe');
    add(ft, new THREE.BoxGeometry(0.087, 0.025, 0.06).translate(0, -0.004, 0.09), GM.shoeTip, 'golfer_toecap');
    add(ft, new THREE.BoxGeometry(0.09, 0.012, 0.155).translate(0, -0.044, 0.04), GM.sole, 'golfer_sole');
    return { th, kn, ft, side };
  });
  const hips = golfer.hips = new THREE.Group(); hips.name = 'golfer_hips'; hips.position.y = HIP_Y; body.add(hips);
  add(hips, cap(0.095, 0.03).rotateZ(Math.PI / 2).scale(1, 1, 0.85), GM.pants, 'golfer_pelvis', 0, 0.0, 0);
  add(hips, new THREE.CylinderGeometry(0.1, 0.1, 0.022, 14).scale(1, 1, 0.85), GM.belt, 'golfer_belt', 0, 0.045, 0);
  const spine = golfer.spine = new THREE.Group(); spine.position.y = 0.04; hips.add(spine);
  add(spine, new THREE.CapsuleGeometry(0.098, 0.12, 5, 12).scale(1, 1, 0.82), GM.shirt, 'golfer_shirt', 0, 0.12, 0);
  add(spine, new THREE.TorusGeometry(0.058, 0.02, 6, 12), GM.shirtTrim, 'golfer_collar', 0, 0.26, 0.0).rotation.x = Math.PI / 2;
  add(spine, new THREE.BoxGeometry(0.03, 0.08, 0.01), GM.shirtTrim, 'golfer_placket', 0, 0.2, 0.082);
  golfer.arms = [-1, 1].map(side => {   // side -1 = the golfer's right (the club hand), +1 = left
    const A = new THREE.Group(); A.name = 'golfer_arm'; A.position.set(side * SHOULDER.x, SHOULDER.y, 0); spine.add(A);
    add(A, cap(0.05, 0.05), GM.shirt, 'golfer_sleeve', 0, -0.045, 0);
    add(A, cap(0.038, 0.05), GM.skin, 'golfer_upperArm', 0, -0.115, 0);
    const E = new THREE.Group(); E.position.y = -UA; A.add(E);
    add(E, cap(0.036, 0.07), GM.skin, 'golfer_forearm', 0, -FA * 0.5, 0);
    add(E, new THREE.SphereGeometry(side > 0 ? 0.046 : 0.042, 10, 8), side > 0 ? GM.glove : GM.skin, side > 0 ? 'golfer_glove' : 'golfer_hand', 0, -FA - 0.012, 0);
    return { A, E, side };
  });
  const neck = new THREE.Group(); neck.position.y = 0.285; spine.add(neck);
  add(neck, new THREE.CylinderGeometry(0.035, 0.04, 0.06, 8), GM.skin, 'golfer_neck', 0, 0.0, 0);
  const head = golfer.head = new THREE.Group(); head.name = 'golfer_head'; head.position.y = 0.1; neck.add(head);
  add(head, new THREE.SphereGeometry(0.105, 16, 12), GM.skin, 'golfer_face');
  add(head, new THREE.SphereGeometry(0.113, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), GM.cap, 'golfer_cap', 0, 0.01, -0.006);
  add(head, new THREE.CylinderGeometry(0.108, 0.108, 0.01, 16, 1, false, -Math.PI * 0.55, Math.PI * 1.1), GM.cap, 'golfer_brim', 0, 0.022, 0.055).rotation.x = 0.16;
  add(head, new THREE.SphereGeometry(0.016, 8, 6), GM.cap, 'golfer_capButton', 0, 0.113, -0.006);
  add(head, new THREE.SphereGeometry(0.09, 10, 8, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.2).translate(0, 0, -0.03), GM.hair, 'golfer_hair', 0, -0.0, -0.01);
  for (const sx of [-1, 1]) { add(head, new THREE.SphereGeometry(0.013, 8, 6), GM.ink, 'golfer_eye', sx * 0.04, 0.0, 0.096); add(head, new THREE.SphereGeometry(0.015, 8, 6).scale(1.4, 0.8, 0.5), GM.cheek, 'golfer_cheek', sx * 0.065, -0.03, 0.085); add(head, new THREE.SphereGeometry(0.022, 8, 6), GM.skin, 'golfer_ear', sx * 0.104, -0.008, 0); }
  add(head, new THREE.SphereGeometry(0.018, 8, 6), GM.skin, 'golfer_nose', 0, -0.015, 0.108);
  add(head, new THREE.TorusGeometry(0.022, 0.004, 5, 10, Math.PI), GM.ink, 'golfer_smile', 0, -0.04, 0.094).rotation.z = Math.PI;
  g.traverse(o => { if (o.isMesh) o.receiveShadow = true; });
}
// animation names kept from the old figure (round.js, meter.js and the checks use them): Idle_Loop (address), Celebration, Dance_Loop, plus Dismay, Walk
export const CLIPS = ['Idle_Loop', 'Celebration', 'Dance_Loop', 'Dismay', 'Walk'];
export function golferClip(n, fade = 0.2) { if (golfer.cur === n || !CLIPS.includes(n)) return; golfer.cur = n; golfer.t = 0; golfer.fade = fade; }
golferClip('Idle_Loop', 0);
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


// the kit: shirt, cap, slacks and skin take the player's colours (KITS in rules.js)
export const SHIRT_BOOST = 0.6;
export function applyKit(p) {
  if (!p || !p.kit) return;
  kitU.uJersey.value.set(p.kit.col); kitU.uCap.value.set(p.kit.cap); kitU.uPants.value.set(p.kit.pants);
  const j = new THREE.Color(p.kit.col), gr = (j.r + j.g + j.b) / 3; j.setRGB(Math.min(1, Math.max(0, j.r + (j.r - gr) * 0.25)), Math.min(1, Math.max(0, j.g + (j.g - gr) * 0.25)), Math.min(1, Math.max(0, j.b + (j.b - gr) * 0.25)));
  GM.shirt.color.copy(j); GM.shirt.emissive.copy(j).multiplyScalar(0.3); GM.cap.color.set(p.kit.cap); GM.shirtTrim.color.set(p.kit.cap); GM.pants.color.set(p.kit.pants); GM.skin.color.set(SKINS[p.i % SKINS.length] || SKINS[0]);
  const k = 1 - 0.5 * kitU.uNight.value; for (const m of Object.values(GM)) if (m.color && m.isMeshStandardMaterial) { /* night darkening is the post grade's */ }
}
addUpdate(() => { try { applyKit(curP()); } catch (e) { } });
