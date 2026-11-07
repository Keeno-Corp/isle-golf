import './api.js';   // load order: each file runs after the one before it (COORDINATION.md)
import './daily.js';  // Daily Hole mode
import { rand } from './util.js';
import { ST, hooks } from './shared.js';
import { HOLES } from './course.js';
import { camera, renderer, scene, updateWorld } from './stage.js';
import { updateIsland } from './island.js';
import { animateCow } from './cow.js';
import { updateEffects } from './effects.js';
import { play } from './sound.js';
import { renderFrame, updatePost } from './post.js';
import { flagU } from './pins.js';
import { updateBalls } from './balls.js';
import { dust, trail, updatePool } from './pools.js';
import { holdAim } from './aimline.js';
import { SIM, stepFlight } from './physics.js';
import { updateSheep } from './sheep.js';
import { G, beginShot, nextTurnOrCard, resolveShot } from './round.js';
import { doSwing, updateMeter } from './meter.js';
import { hud, showTitle, updateHUD } from './hud.js';
import { hideGolfer, placeGolfer, updateGolfer } from './pose.js';
import { cLook, cPos, cam, updateCamera } from './camera.js';

// ---------------------------------------------------------------- one step of the game
export function stepGame(dt) {
  if (ST.bannerT > 0 && (ST.bannerT -= dt) <= 0) hud.banner.classList.remove('on');
  if (ST.subT > 0 && (ST.subT -= dt) <= 0) { hud.sub.classList.remove('on'); G.sub = ''; }
  const ph = G.phase;
  if (ph === 'intro') { G.intro += dt; if (G.intro >= G.introDur) { beginShot(); } }
  else if (ph === 'aim') {
    G.shotT += dt;
    holdAim(dt);
    updateMeter(dt); placeGolfer();
  }
  else if (ph === 'swing') {
    G.swingT += dt; placeGolfer();
    if (G.swingT >= 0.2 && !G.pend.done) { G.pend.done = true; doSwing(G.pend.power, G.pend.acc, G.pend.club); }
  }
  else if (ph === 'flight') { stepFlight(dt); placeGolfer(); }
  else if (ph === 'settle') { G.flightT += dt; if (SIM.mode === 'sunk') SIM.sunkT += dt; placeGolfer(); if ((G.resolveT -= dt) <= 0) resolveShot(); }
  else if (ph === 'holed') { G.flightT += dt; SIM.sunkT += dt; if ((G.resolveT -= dt) <= 0) nextTurnOrCard(); }
}

// ---------------------------------------------------------------- loop
export let last = null, gullT = 6, shadowTick = 0;
export const QS = new URLSearchParams(location.search);
export function frame(now) {
  requestAnimationFrame(frame);
  const dt = last === null ? 1 / 60 : Math.min((now - last) / 1000, 0.1); last = now;
  ST.gameTime += dt; if ((++shadowTick & 3) === 0) renderer.shadowMap.needsUpdate = true;
  if (!G.paused) { if (G.hitStop > 0) G.hitStop = Math.max(0, G.hitStop - dt); else { const n = Math.ceil(dt / (1 / 60) - 1e-6); for (let i = 0; i < n; i++) stepGame(dt / n); } }
  ST.cowWatch = Math.max(0, ST.cowWatch - dt);
  gullT -= dt; if (gullT < 0) { gullT = rand(7, 14); play('gull'); }
  updateWorld(dt); animateCow(dt); updateEffects(dt); updateIsland(dt); updateSheep(dt);
  updatePool(dust, dt); updatePool(trail, dt);
  updateGolfer(dt); updateBalls(); updateCamera(dt); updateHUD();
  for (const f of hooks.update) f(dt);
  flagU.uTime.value = ST.gameTime;
  updatePost(dt);
  hud.pop.style.opacity = '0';
  renderFrame(dt);
}
showTitle(true); hideGolfer();
HOLES.forEach(H => { const wv = H.wv; });
updateCamera(1); cam.pos.copy(cPos); cam.look.copy(cLook);
{ const hid = []; scene.traverse(o => { if (!o.visible) { hid.push(o); o.visible = true; } }); renderer.compile(scene, camera); hid.forEach(o => o.visible = false); }
requestAnimationFrame(frame);
