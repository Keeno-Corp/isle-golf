import './round.js';   // load order: each file runs after the one before it (COORDINATION.md)
import { clamp } from './util.js';
import { ST, fire } from './shared.js';
import { play } from './sound.js';
import { CLUBS, LIE } from './rules.js';
import { golfer, golferClip } from './golfer.js';
import { burst, trail } from './pools.js';
import { aimDots, aimRing, gridLines, slopeGrid } from './aimline.js';
import { SIM, launchOn } from './physics.js';
import { G, curClub, curH, curP, startRound } from './round.js';
import { advanceCard, showTitle } from './hud.js';
import './ballfx.js';
// ---------------------------------------------------------------- the meter: click 1 starts the power bar, click 2 sets power, click 3 snaps the accuracy needle back to the line
export const METER = { up: 1.15, upPutt: 1.6, down: 1.0, snapEq: 0.05, window: 0.32 };
export function meterClick() {
  const m = G.m;
  if (G.phase === 'title') { startRound(G.nPlayers); return; }
  if (G.phase === 'intro') { G.intro = G.introDur; return; }
  if (G.phase === 'card') { advanceCard(); return; }
  if (G.phase === 'final') { G.phase = 'title'; showTitle(true); return; }
  if (G.phase !== 'aim') return;
  if (m.stage === 0) { m.stage = 1; m.t = 0; m.power = 0; m.label = 'POWER'; play('tick'); golferClip('Idle_Loop'); }
  else if (m.stage === 1) { m.stage = 2; m.t2 = 0; m.tp = m.power * METER.down; m.label = 'SNAP'; play('tick'); }
  else if (m.stage === 2) {
    const e = m.t2 - m.tp, ae = Math.abs(e); m.acc = ae < METER.snapEq ? 0 : Math.sign(e) * clamp((ae - METER.snapEq) / METER.window, 0, 1);
    finishMeter();
  }
}
export function finishMeter(auto) {
  const m = G.m; m.stage = 3; G.pend = { power: Math.max(0.03, m.power), acc: m.acc, club: G.club }; G.phase = 'swing'; G.swingT = 0;
  const a = Math.abs(m.acc); m.label = a < 0.001 ? 'PERFECT!' : a < 0.35 ? (m.acc < 0 ? 'SLIGHT HOOK' : 'SLIGHT SLICE') : (m.acc < 0 ? 'HOOK!' : 'SLICE!');
  if (auto) m.label = 'MISS-HIT!';
}
export function updateMeter(dt) {
  const m = G.m, c = curClub();
  if (m.stage === 1) { m.t += dt; m.power = Math.min(1, m.t / (c.putt ? METER.upPutt : METER.up)); golfer.pose.back = m.power; if (m.power >= 1) { m.stage = 2; m.t2 = 0; m.tp = METER.down; m.label = 'SNAP'; } }
  else if (m.stage === 2) { m.t2 += dt; golfer.pose.back = m.power; if (m.t2 > m.tp + METER.window * 0.9) { m.acc = 1; finishMeter(true); } }
}
export function doSwing(power, acc, clubIdx) {
  const p = curP(), H = curH(), c = CLUBS[clubIdx ?? G.club];
  p.prev.copy(p.pos); p.strokes++; G.shotNo++;
  SIM.pos.copy(p.pos); SIM.vel.set(0, 0, 0); SIM.bounces = 0; SIM.sunkT = 0; SIM.live = true;
  let pw = power, ac = acc; if (G.m.label === 'MISS-HIT!') pw *= 0.6;
  launchOn(SIM, c, pw, ac, G.aim, H, LIE[p.surf] ?? 1);
  G.phase = 'flight'; G.flightT = 0; G.shotOrigin = p.pos.clone(); slopeGrid.visible = gridLines.visible = aimDots.visible = aimRing.visible = false;
  play('hit', power); trail.p.forEach(q => q.t = q.life);
  if (p.surf === 'sand') { burst(p.pos.x, p.pos.z, 26, '#e3cf94', 2.2, 3.2); play('sand'); } else burst(p.pos.x, p.pos.z, c.putt ? 2 : 8, '#8fb860', 1.0, 1.8);
  ST.cowWatch = 1.5;
  fire('swing', { power, acc, club: c.id, player: p.name });
}
