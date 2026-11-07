import './rules.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { playerP } from './assets.js';
import { HOLES, heightAt } from './course.js';
import { named, scene, std } from './stage.js';
import { canvasTex } from './effects.js';

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
  const pole = named(new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.25, 6), flagWhite), 'pin_pole'); pole.position.y = 0.62; g.add(pole);
  const cloth = new THREE.PlaneGeometry(0.62, 0.38, 10, 2).translate(0.31, 0, 0);
  const flag = named(new THREE.Mesh(cloth, flagMat), 'pin_flag'); flag.position.y = 1.1; flag.castShadow = true; g.add(flag);
  const w = H.wind, ang = w[1] * Math.PI / 180; H.wv = new THREE.Vector2(Math.cos(ang) * w[0], Math.sin(ang) * w[0]);
  flag.rotation.y = -Math.atan2(H.wv.y, H.wv.x); flag.scale.x = 0.55 + 0.1 * w[0];
  const cup = new THREE.Mesh(new THREE.CircleGeometry(0.115, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#16120e', polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); cup.name = 'cup'; cup.position.y = 0.012; g.add(cup);
  const rim = new THREE.Mesh(new THREE.RingGeometry(0.115, 0.15, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#f1ecdc', polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); rim.name = 'cupRim'; rim.position.y = 0.011; g.add(rim);
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
