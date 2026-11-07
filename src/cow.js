import './island.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { centreFloor, cowGLB } from './assets.js';
import { angDiff, lerp, rand, smooth } from './util.js';
import { ST, on } from './shared.js';
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
export const cow = { alert: 0, state: 'graze', ox: 0, oz: 0, ox2: 0, oz2: 0, why: '', moos: 0, yaw: COW.yaw, yawTarget: COW.yaw, graze: 1, shuffle: rand(4, 8), moo: rand(9, 16), mooT: 0, pat: 0, look: 0, lookT: 0 };
cowG.position.set(COW.x, heightAt(COW.x, COW.z), COW.z);
// she reacts to the ball: a hit looks up, turns, moos and shuffles a step away; a shot landing near does the same
function cowReact(why, bx, bz, big) {
  cow.alert = big ? 3.2 : 2.2; cow.why = why; cow.yawTarget = Math.atan2(bx - COW.x - cow.ox, bz - COW.z - cow.oz) + (big ? Math.PI * 0.35 : 0);
  const dx = COW.x + cow.ox - bx, dz = COW.z + cow.oz - bz, d = Math.hypot(dx, dz) || 1, step = big ? 0.9 : 0.55;
  const nx = cow.ox2 + dx / d * step, nz = cow.oz2 + dz / d * step, r = Math.hypot(nx, nz); const k = r > 1.8 ? 1.8 / r : 1; cow.ox2 = nx * k; cow.oz2 = nz * k;   // a step away, but she stays in her meadow
  cow.mooT = 1.4; cow.moo = rand(12, 24); cow.moos++; SFX.moo(); cow.look = 0;
}
on('ball:cow', ({ ball }) => cowReact('hit', ball.pos.x, ball.pos.z, true));
on('ball:land', ({ ball }) => { if (Math.hypot(ball.pos.x - COW.x, ball.pos.z - COW.z) < 5.5 && cow.alert <= 0) cowReact('near', ball.pos.x, ball.pos.z, false); });
export const cowObs = () => ({ state: cow.alert > 0 ? 'alert' : cow.graze < 0.5 ? 'head-up' : 'graze', alert: +cow.alert.toFixed(2), why: cow.why, moos: cow.moos, x: +(COW.x + cow.ox).toFixed(2), z: +(COW.z + cow.oz).toFixed(2), yaw: +cow.yaw.toFixed(2) });
export function animateCow(dt) {
  const t = ST.gameTime, c = cow;
  c.alert = Math.max(0, c.alert - dt); c.ox += (c.ox2 - c.ox) * (1 - Math.exp(-dt * 1.6)); c.oz += (c.oz2 - c.oz) * (1 - Math.exp(-dt * 1.6));
  cowG.position.set(COW.x + c.ox, heightAt(COW.x + c.ox, COW.z + c.oz), COW.z + c.oz);
  // now and then she shifts round a little on the spot, or swings her head (her whole front) to look about
  c.shuffle -= dt; if (c.shuffle < 0 && c.alert <= 0) { c.shuffle = rand(5, 11); c.yawTarget = COW.yaw + rand(-0.5, 0.5); }
  c.lookT -= dt; if (c.lookT < 0) { c.lookT = rand(3, 7); c.look = Math.random() < 0.5 ? rand(-0.35, 0.35) : 0; }
  // she lifts her head and watches a train go by
  // she lifts her head and watches the ball on a big play
  if (ST.cowWatch > 0 && c.alert <= 0) { c.pat = 0.6; c.yawTarget = Math.atan2(ball.pos.x - COW.x, ball.pos.z - COW.z); c.look = 0; } else if (c.pat > 0) c.pat -= dt;
  if (c.alert > 0) c.yawTarget = c.yawTarget;
  c.yaw += angDiff(c.yaw, c.yawTarget) * (1 - Math.exp(-dt * 0.8));
  // grazing: head down and chewing, lifted when she moos or is patted
  c.moo -= dt; if (c.moo < 0) { c.moo = rand(12, 24); c.mooT = 1.4; SFX.moo(); }
  c.mooT = Math.max(0, c.mooT - dt);
  const up = Math.max(c.alert > 0 ? 1 : 0, smooth(0, 0.3, c.mooT) * smooth(1.4, 1.1, c.mooT), c.pat > 0 ? 1 : 0);
  c.graze = lerp(c.graze, 1 - up, 1 - Math.exp(-dt * 3));
  cowG.rotation.y = c.yaw;
  const chew = Math.sin(t * 7) * 0.006 * c.graze, breathe = Math.sin(t * 1.3) * 0.004;
  const wiggle = c.pat > 0 ? Math.sin(c.pat * 18) * 0.04 * smooth(0, 0.4, c.pat) : 0;
  cowBody.rotation.set(0.07 * c.graze - 0.05 * up + chew, c.look * (1 - c.graze * 0.5) + wiggle, Math.sin(t * 0.4) * 0.01);
  cowBody.position.y = breathe - 0.02 * c.graze;
}
