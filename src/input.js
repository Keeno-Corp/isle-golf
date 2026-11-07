import './camera.js';   // load order: each file runs after the one before it (COORDINATION.md)
import { ST, hooks } from './shared.js';
import { renderer } from './stage.js';
import { buildSlopeGrid, cycleClub, updateAimLine } from './aimline.js';
import { G, curClub } from './round.js';
import { meterClick } from './meter.js';
import { advanceCard, hud, replayHole, setPlayersSel, setSub, startFromTitle } from './hud.js';

// ---------------------------------------------------------------- input
export const keys = new Set();
addEventListener('keydown', e => {
  G.keysHeld[e.code] = true; if (e.repeat) { if (['Space', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault(); return; }
  if (['Space', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.code)) e.preventDefault();
  onKey(e.code);
});
addEventListener('keyup', e => { G.keysHeld[e.code] = false; });
export function onKey(code) {
  for (const f of hooks.keys) if (f(code)) return;
  if (G.phase === 'title') { if (/^Digit[1-4]$/.test(code)) setPlayersSel(+code[5]); else if (code === 'ArrowRight' || code === 'ArrowUp') setPlayersSel(Math.min(4, G.nPlayers + 1)); else if (code === 'ArrowLeft' || code === 'ArrowDown') setPlayersSel(Math.max(1, G.nPlayers - 1)); else if (code === 'Space' || code === 'Enter') startFromTitle(); return; }
  if (code === 'Space' || code === 'Enter') meterClick();
  else if (code === 'KeyW' || code === 'KeyQ' || code === 'ArrowUp') cycleClub(-1);
  else if (code === 'KeyS' || code === 'KeyE' || code === 'ArrowDown') cycleClub(1);
  else if (code === 'KeyR') replayHole();
  else if (code === 'KeyC') { G.overhead = !G.overhead; }
  else if (code === 'KeyM') { G.sound = !G.sound; setSub(G.sound ? 'SOUND ON' : 'SOUND OFF'); }
  else if (code === 'KeyN') { ST.duskTarget = ST.duskTarget > 0.5 ? 0 : 1; ST.lampLit = ST.duskTarget > 0.5; }
  else if (code === 'KeyH') { hud.help.style.opacity = hud.help.style.opacity == 0 ? 0.7 : 0; }
}
{
  const cv = renderer.domElement; let down = null;
  cv.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, moved: false, lx: e.clientX }; });
  addEventListener('pointermove', e => { if (!down) return; if (Math.abs(e.clientX - down.x) > 6) down.moved = true; if (down.moved && G.phase === 'aim' && !G.m.stage) { G.aim += (e.clientX - down.lx) * 0.004; updateAimLine(); if (curClub().putt) buildSlopeGrid(); } down.lx = e.clientX; });
  addEventListener('pointerup', e => { if (down && !down.moved) { if (G.phase === 'title') startFromTitle(); else meterClick(); } down = null; });
  cv.addEventListener('wheel', e => { e.preventDefault(); cycleClub(e.deltaY > 0 ? 1 : -1); }, { passive: false });
  hud.card.style.pointerEvents = 'auto'; hud.card.addEventListener('click', () => { if (G.phase === 'card') advanceCard(); });
}
