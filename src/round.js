import './sheep.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp, lerp } from './util.js';
import { ST, fire, on, addObserve, addUpdate } from './shared.js';
import { HOLES, POND, YD, heightAt, surfaceAt } from './course.js';
import { play } from './sound.js';
import { BR, CLUBS, KITS, WIND, pick } from './rules.js';
import { golfer, golferClip } from './golfer.js';
import { updateBalls } from './balls.js';
import { dust, emit } from './pools.js';
import { autoAim, autoClub, onClubChanged } from './aimline.js';
import { SIM } from './physics.js';
import { hud, openCard, setSub, showBanner } from './hud.js';
import { placeGolfer, showGolfer } from './pose.js';
// ---------------------------------------------------------------- the round: players, holes, shots, scores
export const G = { phase: 'title', sound: true, paused: false, hole: 0, nPlayers: 1, players: [], turn: 0, order: [], club: 1, aim: 0, intro: 0, introDur: 3.8, m: { stage: 0, t: 0, t2: 0, power: 0, tp: 0, acc: 0, label: '' }, pend: null, swingT: 0, shotT: 0, overhead: false, banner: '', sub: '', resolveT: 0, sheepHits: 0, round: 0, shotNo: 0, lastResult: '', nextAt: 0, fireworks: 0, keysHeld: {}, drag: null, sunkSlow: 0, cardHole: -1 };
export const curP = () => G.players[G.turn], curH = () => HOLES[G.hole], curClub = () => CLUBS[G.club];
export const teeVec = H => new THREE.Vector3(H.tee[0], heightAt(H.tee[0], H.tee[1]) + BR * 0.8, H.tee[1]);
export const pinDist = (p, H) => Math.hypot(H.pinX - p.x, H.pinZ - p.z);
export const scoreName = (s, par) => s === 1 ? 'HOLE IN ONE!' : s - par <= -3 ? 'ALBATROSS!' : s - par === -2 ? 'EAGLE!' : s - par === -1 ? 'BIRDIE!' : s - par === 0 ? 'PAR' : s - par === 1 ? 'BOGEY' : s - par === 2 ? 'DOUBLE BOGEY' : '+' + (s - par);
export const vsPar = n => n === 0 ? 'EVEN' : n > 0 ? '+' + n : String(n);
export function startRound(n) {
  G.nPlayers = clamp(n | 0 || 1, 1, 4); G.round++;
  G.players = KITS.slice(0, G.nPlayers).map((k, i) => ({ i, kit: k, name: k.name, scores: [], strokes: 0, holed: false, pos: new THREE.Vector3(), prev: new THREE.Vector3(), surf: 'tee', pickedUp: false }));
  G.order = G.players.map(p => p.i);
  beginHole(0);
}
export function beginHole(h) {
  G.hole = h; G.lastCall = ''; G.lastLip = false; const H = HOLES[h]; G.cardHole = -1; hud.card.style.display = 'none';
  if (h > 0) G.order = [...G.players].sort((a, b) => ((a.scores[h - 1] - HOLES[h - 1].par) - (b.scores[h - 1] - HOLES[h - 1].par)) || (G.order.indexOf(a.i) - G.order.indexOf(b.i))).map(p => p.i);
  for (const p of G.players) { p.strokes = 0; p.holed = false; p.pos.copy(teeVec(H)); p.prev.copy(p.pos); p.surf = 'tee'; p.pickedUp = false; }
  WIND.set(H.wv.x, H.wv.y).normalize(); ST.gust = clamp(H.wind[0] / 8, 0.1, 1);
  G.turn = G.order[0]; G.phase = 'intro'; G.intro = 0; G.m.stage = 0; G.overhead = false; G.pend = null;
  SIM.mode = 'rest'; SIM.pos.copy(G.players[G.turn].pos); showGolfer(true); placeGolfer(); updateBalls();
  showBanner('HOLE ' + (h + 1), `PAR ${H.par} · ${H.yards} YD · ${H.name.toUpperCase()}`, 3.2);
  G.aim = autoAim(); setSub('');
  fire('hole:start', { hole: h });
}
export function beginShot() {
  const p = curP(), H = curH(); G.phase = 'aim'; G.m.stage = 0; G.pend = null; G.shotT = 0;
  p.surf = surfaceAt(p.pos.x, p.pos.z); if (p.strokes === 0 && p.pos.distanceTo(teeVec(H)) < 0.5) p.surf = 'tee';
  SIM.pos.copy(p.pos); SIM.vel.set(0, 0, 0); SIM.mode = 'rest';
  G.club = autoClub(); G.aim = autoAim(); onClubChanged(); showGolfer(true); placeGolfer(); updateBalls();
  golferClip('Idle_Loop'); golfer.pose.back = 0; golfer.pose.through = 0; setSub(G.players.length > 1 ? `${p.name} TO PLAY` : '');
  if (p.surf === 'sand') showBanner('BUNKER', G.club === 0 ? 'TAKE THE WEDGE TO DIG IT OUT' : curClub().putt ? 'A PUTTER WILL CRAWL OUT' : curClub().id === 'wedge' ? 'THE WEDGE DIGS IT OUT' : 'A WEDGE DIGS IT OUT BEST', 1.6); else if (p.surf === 'rough') setSub((G.players.length > 1 ? p.name + ' · ' : '') + 'IN THE ROUGH: SHORTER SHOT');
}
export function resolveShot() {
  const p = curP(), H = curH(), b = SIM; let msg = '';
  G.lastLip = false;
  if (b.mode === 'rest' && curClub().putt && G.minPinD < 0.6 && pinDist(b.pos, H) < 3) { fire('hud-round:lipout', { dist: G.minPinD }); play('groan'); showBanner('SO CLOSE!', 'LIPPED OUT BY A HAIR', 1.6); G.lastLip = true; G.lastCall = 'SO CLOSE!'; }
  else if (b.mode === 'rest') { const yd = Math.round(pinDist(b.pos, H) * YD); if (yd > 0) { G.lastCall = yd + ' YD TO PIN'; fire('hud-round:rest', { yards: yd }); if (yd >= 3) { showBanner(yd + ' YD TO PIN', '', 1.4); play('pin'); } } }
  if (b.mode === 'sunk') {
    p.holed = true; p.scores[G.hole] = p.strokes; p.pos.set(H.pinX, H.pinY, H.pinZ); const nm = scoreName(p.strokes, H.par);
    if (curClub().putt && p.strokes > H.par - 1) { play('rattle'); showBanner('IN!', `${nm} · ${p.name} · ${p.strokes} ${p.strokes === 1 ? 'STROKE' : 'STROKES'}`, 2.4); } else showBanner(nm, `${p.name} · ${p.strokes} ${p.strokes === 1 ? 'STROKE' : 'STROKES'}`, 2.4); G.lastResult = nm; fire('holed', { player: p.name, strokes: p.strokes, result: nm }); play(p.strokes <= H.par - 1 ? 'birdie' : 'ding');
    if (p.strokes <= H.par) { golferClip(p.strokes < H.par ? 'Celebration' : 'Dance_Loop', 0.3); for (let i = 0; i < 24; i++) emit(dust, H.pinX, H.pinY + 0.2, H.pinZ, { life: 1.1, sp: 1.2, up: 3.4, g: 6, color: pick(['#f2d43a', '#ffffff', '#ff7a5a', '#7fe0d4']) }); }
    G.phase = 'holed'; G.resolveT = 2.6; return;
  }
  if (b.mode === 'water') {
    p.strokes++; let drop = p.prev.clone(); const E = b.entry;
    for (let t = 0; t <= 1.001; t += 0.04) { const x = lerp(E.x, p.prev.x, t), z = lerp(E.z, p.prev.z, t), sf = surfaceAt(x, z); if ((sf === 'fairway' || sf === 'rough' || sf === 'tee') && Math.hypot(x - POND.x, z - POND.z) > POND.r + 0.8) { drop.set(x, heightAt(x, z) + BR * 0.8, z); break; } }
    p.pos.copy(drop); p.surf = surfaceAt(drop.x, drop.z); setSub((G.players.length > 1 ? p.name + ' · ' : '') + 'DROP BESIDE THE POND, +1 STROKE'); p.pickedUp = false;
  } else if (b.mode === 'ob') {
    p.strokes++; p.pos.copy(p.prev); p.surf = p.strokes <= 2 && p.prev.distanceTo(teeVec(H)) < 0.1 ? 'tee' : surfaceAt(p.prev.x, p.prev.z); setSub((G.players.length > 1 ? p.name + ' · ' : '') + 'PLAY AGAIN FROM THE SAME SPOT, +1 STROKE');
  } else { p.pos.copy(b.pos); p.pos.y = heightAt(p.pos.x, p.pos.z) + BR * 0.8; p.surf = b.surf === 'water' ? 'rough' : surfaceAt(p.pos.x, p.pos.z); }
  if (p.strokes >= 9 && !p.holed) { p.holed = true; p.pickedUp = true; p.scores[G.hole] = Math.max(9, p.strokes); showBanner('PICK UP', 'NINE STROKES IS PLENTY', 2); G.phase = 'holed'; G.resolveT = 2; return; }
  nextTurnOrCard();
}
export function nextTurnOrCard() {
  const live = G.players.filter(p => !p.holed);
  if (!live.length) { openCard(); return; }
  let nxt = null;
  for (const i of G.order) { const p = G.players[i]; if (!p.holed && p.strokes === 0) { nxt = p; break; } }
  if (!nxt) { let bd = -1; for (const p of live) { const d = pinDist(p.pos, curH()); if (d > bd) { bd = d; nxt = p; } } }
  if (G.players.length > 1 && nxt.i !== G.turn) { hud.banner.classList.remove('on'); ST.bannerT = 0; }
  G.turn = nxt.i; beginShot();
}

// ---------------------------------------------------------------- hud-round extras
on('swing', ({ acc }) => { const a = Math.abs(acc); if (a < 0.001) { showBanner('PERFECT!', '', 0.9); play('perfect'); fire('hud-round:call', { call: 'PERFECT' }); } else if (a < 0.2) { showBanner('NICE!', '', 0.9); play('nice'); fire('hud-round:call', { call: 'NICE' }); } });
addObserve(() => ({ hudRound: { order: G.order.map(i => G.players[i]?.name), turn: curP()?.name, lastCall: G.banner || G.lastCall || '', lipOut: !!G.lastLip, minPinD: +(G.minPinD || 0).toFixed(2), cardOpen: G.phase === 'card', final: G.phase === 'card' && G.hole >= 8, best: (() => { try { return +localStorage.getItem('isleGolfBest' + G.nPlayers) || null; } catch (e) { return null; } })() } }));

// clear the hole intro banner once the swing meter starts (hud-round lane)
let _introCleared = false; addUpdate(() => { if (G.phase === 'aim' && G.m.stage === 1) { if (!_introCleared && ST.bannerT > 0) { hud.banner.classList.remove('on'); hud.sub.classList.remove('on'); ST.bannerT = 0; ST.subT = 0; } _introCleared = true; } else _introCleared = false; });
