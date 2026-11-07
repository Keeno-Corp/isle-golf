import './input.js';   // load order: each file runs after the one before it (COORDINATION.md)
import { clamp } from './util.js';
import { ST, hooks } from './shared.js';
import { HOLES, YD, heightAt, surfaceAt } from './course.js';
import { camera } from './stage.js';
import { BR, CLUBS, WIND, r3 } from './rules.js';
import { autoAim, buildSlopeGrid, onClubChanged, updateAimLine } from './aimline.js';
import { SIM } from './physics.js';
import { G, beginHole, beginShot, curClub, curH, curP, pinDist, startRound } from './round.js';
import { meterClick } from './meter.js';
import { advanceCard, needPower, replayHole, setPlayersSel, showTitle, startFromTitle, windInfo } from './hud.js';
import { stepGame } from './main.js';

// ---------------------------------------------------------------- window.__game
export function summary() {
  const p = G.players[G.turn], H = G.hole < 9 ? curH() : null; if (!p || !H) return { phase: G.phase };
  const w = windInfo();
  return {
    phase: G.phase, round: G.round, hole: G.hole + 1, holeName: H.name, par: H.par, yards: H.yards, player: p.name, players: G.players.length, strokes: p.strokes, club: curClub().id, clubIndex: G.club,
    aimDeg: r3(((G.aim * 180 / Math.PI) % 360 + 360) % 360), pinBearingDeg: r3(Math.atan2(H.pinZ - p.pos.z, H.pinX - p.pos.x) * 180 / Math.PI), lie: p.surf, distToPin: r3(pinDist(p.pos, H)), yardsToPin: Math.round(pinDist(p.pos, H) * YD),
    ball: { x: r3(SIM.pos.x), y: r3(SIM.pos.y), z: r3(SIM.pos.z), mode: SIM.mode, surface: SIM.surf }, pin: { x: r3(H.pinX), z: r3(H.pinZ) },
    meter: { stage: G.m.stage, power: r3(G.m.power), t: r3(G.m.stage === 2 ? G.m.t2 : G.m.t), perfectAt: r3(G.m.tp), label: G.m.label, needPower: r3(needPower()) },
    wind: w, banner: G.banner, sub: G.sub, lastResult: G.lastResult, sheepHits: G.sheepHits, overhead: G.overhead, sound: G.sound,
  };
}
export function actFn(input) {
  const a = input.action;
  if (hooks.actions[a]) { hooks.actions[a](input); return summary(); }
  const skipTo = () => { if (G.phase === 'title') startFromTitle(); if (G.phase === 'intro') { G.intro = G.introDur; stepGame(0.001); } };
  if (a === 'start') { setPlayersSel(clamp(input.players | 0 || 1, 1, 4)); if (G.phase === 'title') startFromTitle(); else { showTitle(false); startRound(G.nPlayers); } }
  else if (a === 'newRound') { showTitle(false); startRound(input.players | 0 || G.nPlayers); }
  else if (a === 'aim') {
    if (G.phase !== 'aim') skipTo();
    const H = curH(), p = curP();
    if ('degrees' in input) G.aim = input.degrees * Math.PI / 180; else if ('delta' in input) G.aim += input.delta * Math.PI / 180; else if (input.at === 'pin') G.aim = Math.atan2(H.pinZ - p.pos.z, H.pinX - p.pos.x);
    if (input.at === 'auto') G.aim = autoAim();
    updateAimLine(); if (curClub().putt) buildSlopeGrid();
  }
  else if (a === 'club') {
    if (G.phase !== 'aim') skipTo(); const i = typeof input.name === 'string' ? CLUBS.findIndex(c => c.id === input.name.toLowerCase()) : 'index' in input ? input.index : G.club + (input.delta || 0);
    if (i >= 0) { G.club = clamp(i, 0, CLUBS.length - 1); onClubChanged(); }
  }
  else if (a === 'click') meterClick();
  else if (a === 'swing') {
    if (G.phase !== 'aim') skipTo();
    if (G.phase === 'aim' && !G.m.stage) {
      if (typeof input.club === 'string') { G.club = Math.max(0, CLUBS.findIndex(c => c.id === input.club)); onClubChanged(); }
      if ('aimDegrees' in input) { G.aim = input.aimDegrees * Math.PI / 180; }
      G.m.stage = 3; G.m.power = clamp(input.power ?? 0.8, 0.03, 1); G.m.acc = clamp(input.accuracy ?? 0, -1, 1); G.m.label = Math.abs(G.m.acc) < 0.001 ? 'PERFECT!' : G.m.acc < 0 ? 'HOOK' : 'SLICE';
      G.pend = { power: G.m.power, acc: G.m.acc, club: G.club }; G.phase = 'swing'; G.swingT = 0;
    }
    if (input.settle) { let n = 0; while ((G.phase === 'swing' || G.phase === 'flight' || G.phase === 'settle' || G.phase === 'holed') && n++ < 3000) stepGame(1 / 60); }
  }
  else if (a === 'next') { if (G.phase === 'card') advanceCard(); else if (G.phase === 'intro') skipTo(); else if (G.phase === 'title') startFromTitle(); }
  else if (a === 'replay') replayHole();
  else if (a === 'overhead') G.overhead = input.on ?? !G.overhead;
  else if (a === 'sound') G.sound = input.on ?? !G.sound;
  return summary();
}
window.__game = {
  describe: () => ({
    name: 'Isle Golf', units: `world units (1 unit = ${YD} yards in the HUD); +x east, +z south (toward the diorama camera), +y up; aim angles are degrees clockwise from +x seen from above (0 = east, 90 = south)`,
    controls: 'Title: 1-4 players, Space to tee off. Aim: A/D or arrows (or drag). Club: W/S or Q/E (or wheel); auto-picked by distance. Swing: Space or click three times (start, set power, snap the needle onto the line). C = hole view, R = replay hole, M = sound, N = evening light.',
    actions: ['{action:"start", players:1-4}', '{action:"aim", degrees|delta|at:"pin"|"auto"}', '{action:"club", name:"driver|iron|wedge|putter"|delta}', '{action:"click"} (the meter click)', '{action:"swing", power:0-1, accuracy:-1..1 (hook..slice), club?, aimDegrees?, settle?:true}', '{action:"next"} (skip flyover / next hole)', '{action:"replay"}', '{action:"overhead", on}', '{action:"newRound", players}'],
    phases: 'title → intro (flyover) → aim → swing → flight → settle → (aim | holed → card) → … → final card',
  }),
  observe: () => Object.assign({ ...summary(), scores: G.players.map(p => ({ name: p.name, strokes: p.strokes, holed: p.holed, scores: p.scores.slice() })), holes: HOLES.map(H => ({ n: H.i + 1, par: H.par, yards: H.yards, tee: H.tee.map(r3), pin: [r3(H.pinX), r3(H.pinZ)] })), camera: { x: r3(camera.position.x), y: r3(camera.position.y), z: r3(camera.position.z), fov: r3(camera.fov) }  }, ...hooks.observe.map(f => f())),
  act: actFn,
  setState(s) {
    if (s.hole !== undefined) { if (G.phase === 'title') startFromTitle(); beginHole(clamp(s.hole | 0, 0, 8)); }
    if (s.skipIntro && G.phase === 'intro') { G.intro = G.introDur; stepGame(0.001); }
    if (s.ball) { const p = curP(); p.pos.set(s.ball.x, heightAt(s.ball.x, s.ball.z) + BR * 0.8, s.ball.z); p.prev.copy(p.pos); p.surf = surfaceAt(p.pos.x, p.pos.z); if (G.phase === 'aim') beginShot(); }
    if ('night' in s) { ST.dusk = ST.duskTarget = s.night ? 1 : 0; ST.lampLit = !!s.night; ST.lampOn = ST.lampLit ? 1 : 0; }
    if (s.wind) { const H = curH(); H.wind[0] = s.wind.speed ?? H.wind[0]; H.wind[1] = s.wind.degrees ?? H.wind[1]; const a = H.wind[1] * Math.PI / 180; H.wv.set(Math.cos(a) * H.wind[0], Math.sin(a) * H.wind[0]); H.flag.rotation.y = -a; WIND.copy(H.wv).normalize(); updateAimLine(); }
    for (const f of hooks.setState) f(s);
  },
  subject: 'golfer',
  intentional: 'the golfer, ball, flag and club write alpha 0 so the painterly pass leaves them crisp; the course above and below the tilt-shift focus band is blurred on purpose',
};
