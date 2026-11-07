import './island.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { centreFloor, cowGLB } from './assets.js';
import { angDiff, lerp, rand, smooth } from './util.js';
import { ST } from './shared.js';
import { COW, heightAt } from './course.js';
import { scene } from './stage.js';
import { TEX_SOFT_SHADOW } from './island.js';
import { SFX } from './sound.js';
import { ball } from './physics.js';

// the cow: the library's "Vaca 2" (assets/CREDITS.md), a static model, so she stays put in her meadow and lives on body
// language alone: she grazes head down and chewing, shifts her stance now and then, swings her head round to look, and moos
export const cowG = new THREE.Group(); cowG.name = 'cow'; scene.add(cowG);
export const cowBody = new THREE.Group(); cowBody.name = 'cow_body'; cowG.add(cowBody);
{
  const w = new THREE.Group(), m = cowGLB.scene; w.add(m); w.rotation.y = Math.PI / 2;   // the model faces -x
  w.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(w, true); w.scale.setScalar(1.25 / (b.max.y - b.min.y)); centreFloor(w);
  w.position.z -= 0.15; cowBody.add(w);   // pivot nearer her shoulders than her middle
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.name = 'cow_hide'; for (const mt of [].concat(o.material)) { mt.metalness = 0; mt.roughness = 0.9; } } });   // a hide, not metal: with no environment to reflect, metal draws dark
  const sd = new THREE.Mesh(new THREE.CircleGeometry(0.5, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: TEX_SOFT_SHADOW, color: 0, transparent: true, opacity: 0.32, depthWrite: false }));
  sd.name = 'cow_contactShadow'; sd.scale.set(1.1, 1, 2.2); sd.position.y = 0.03; cowG.add(sd);
}
export const cow = { yaw: COW.yaw, yawTarget: COW.yaw, graze: 1, shuffle: rand(4, 8), moo: rand(9, 16), mooT: 0, pat: 0, look: 0, lookT: 0 };
cowG.position.set(COW.x, heightAt(COW.x, COW.z), COW.z);
export function animateCow(dt) {
  const t = ST.gameTime, c = cow;
  // now and then she shifts round a little on the spot, or swings her head (her whole front) to look about
  c.shuffle -= dt; if (c.shuffle < 0) { c.shuffle = rand(5, 11); c.yawTarget = COW.yaw + rand(-0.5, 0.5); }
  c.lookT -= dt; if (c.lookT < 0) { c.lookT = rand(3, 7); c.look = Math.random() < 0.5 ? rand(-0.35, 0.35) : 0; }
  // she lifts her head and watches a train go by
  // she lifts her head and watches the ball on a big play
  if (ST.cowWatch > 0) { c.pat = 0.6; c.yawTarget = Math.atan2(ball.pos.x - COW.x, ball.pos.z - COW.z); c.look = 0; } else if (c.pat > 0) c.pat -= dt;
  c.yaw += angDiff(c.yaw, c.yawTarget) * (1 - Math.exp(-dt * 0.8));
  // grazing: head down and chewing, lifted when she moos or is patted
  c.moo -= dt; if (c.moo < 0) { c.moo = rand(12, 24); c.mooT = 1.4; SFX.moo(); }
  c.mooT = Math.max(0, c.mooT - dt);
  const up = Math.max(smooth(0, 0.3, c.mooT) * smooth(1.4, 1.1, c.mooT), c.pat > 0 ? 1 : 0);
  c.graze = lerp(c.graze, 1 - up, 1 - Math.exp(-dt * 3));
  cowG.rotation.y = c.yaw;
  const chew = Math.sin(t * 7) * 0.006 * c.graze, breathe = Math.sin(t * 1.3) * 0.004;
  const wiggle = c.pat > 0 ? Math.sin(c.pat * 18) * 0.04 * smooth(0, 0.4, c.pat) : 0;
  cowBody.rotation.set(0.07 * c.graze - 0.05 * up + chew, c.look * (1 - c.graze * 0.5) + wiggle, Math.sin(t * 0.4) * 0.01);
  cowBody.position.y = breathe - 0.02 * c.graze;
}
