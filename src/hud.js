import './meter.js';   // load order: each file runs after the one before it (COORDINATION.md)
import { clamp } from './util.js';
import { ST, fire } from './shared.js';
import { HOLES, YD } from './course.js';
import { CLUBS, r3 } from './rules.js';
import { lieMul } from './aimline.js';
import { launchOn, newSim, stepSim } from './physics.js';
import { G, beginHole, beginShot, curClub, curH, curP, pinDist, scoreName, startRound, teeVec, vsPar } from './round.js';
import { METER } from './meter.js';
import { hideGolfer } from './pose.js';
// ---------------------------------------------------------------- the scorecard
export function openCard() {
  G.phase = 'card'; G.cardHole = G.hole; hideGolfer(); buildCard(G.hole >= 8); hud.card.style.display = 'block'; hud.help.style.opacity = 0;
  fire('hole:end', { hole: G.hole });
}
export function cellClass(s, par) { const d = s - par; return s === 1 || d <= -2 ? 'eagle' : d === -1 ? 'birdie' : d === 0 ? 'par' : d === 1 ? 'bogey' : 'dbl'; }
export function buildCard(final) {
  const upto = G.hole; let h = `<h2>${final ? 'ROUND COMPLETE' : 'HOLE ' + (G.hole + 1) + ' · ' + HOLES[G.hole].name.toUpperCase()}</h2><table><tr><th></th>` + HOLES.map((H, i) => `<th class="${i === G.hole ? 'cur' : ''}">${i + 1}</th>`).join('') + '<th>TOT</th><th>+/-</th></tr>';
  h += '<tr class="parrow"><td>PAR</td>' + HOLES.map(H => `<td>${H.par}</td>`).join('') + `<td>${HOLES.reduce((a, H) => a + H.par, 0)}</td><td></td></tr>`;
  for (const p of G.players) {
    let tot = 0, par = 0; const cells = HOLES.map((H, i) => { const s = p.scores[i]; if (s === undefined) return '<td></td>'; tot += s; par += H.par; return `<td><span class="sc ${cellClass(s, H.par)}">${s}</span></td>`; }).join('');
    p.total = tot; p.vs = tot - par;
    h += `<tr><td class="nm"><i style="background:${p.kit.col}"></i>${p.name}</td>${cells}<td><b>${tot}</b></td><td><b>${vsPar(tot - par)}</b></td></tr>`;
  }
  h += '</table>';
  const stamps = G.players.map(p => { const s = p.scores[G.hole]; if (s === undefined) return ''; const n = p.pickedUp ? 'PICK UP' : scoreName(s, HOLES[G.hole].par).replace('!', ''); return `<div class="stamp ${cellClass(s, HOLES[G.hole].par)}" style="--rot:${(p.i * 7 - 8)}deg"><em>${G.players.length > 1 ? p.name : 'HOLE ' + (G.hole + 1)}</em>${n}</div>`; }).join('');
  h += `<div class="stamps">${stamps}</div>`;
  if (final) {
    const best = [...G.players].sort((a, b) => a.total - b.total)[0];
    let rec = ''; try { const k = 'isleGolfBest' + G.nPlayers; const old = +localStorage.getItem(k) || 999; if (best.total < old) { localStorage.setItem(k, best.total); rec = ' · NEW BEST'; } else rec = ' · BEST ' + old; } catch (e) { }
    h += `<div class="fin">${G.players.length > 1 ? best.name + ' WINS WITH ' + best.total : 'YOU FINISHED ON ' + best.total}  (${vsPar(best.vs)})${rec}</div>`;
  }
  h += `<div class="go">${final ? 'SPACE · BACK TO THE FIRST TEE' : 'SPACE · NEXT HOLE'}</div>`;
  hud.card.innerHTML = h; if (final) G.phase = 'card';
}
export function advanceCard() {
  hud.card.style.display = 'none';
  if (G.hole >= 8) { G.phase = 'title'; showTitle(true); return; }
  beginHole(G.hole + 1);
}
export function replayHole() {
  if (G.phase === 'title' || G.phase === 'card') return;
  const H = curH(); for (const p of G.players) { p.strokes = 0; p.holed = false; p.pos.copy(teeVec(H)); p.prev.copy(p.pos); p.surf = 'tee'; p.scores[G.hole] = undefined; p.pickedUp = false; }
  G.turn = G.order[0]; showBanner('REPLAY', `HOLE ${G.hole + 1}`, 1.4); beginShot();
}

// ---------------------------------------------------------------- the HUD: steel panels in bevelled green, cream-yellow italic capitals
export const style = document.createElement('style');
style.textContent = `
#hud{position:fixed;inset:0;pointer-events:none;font-family:Impact,Haettenschweiler,"Arial Narrow Bold","Arial Black",sans-serif;font-style:italic;text-transform:uppercase;color:#f4e39a;letter-spacing:.5px;user-select:none}
.steel{background:linear-gradient(180deg,#4a6a5c 0%,#233c33 42%,#122219 100%);border:2px solid #7ba08a;border-radius:6px;box-shadow:0 0 10px rgba(255,214,120,.45),inset 0 1px 0 rgba(255,255,255,.3),inset 0 -2px 0 rgba(0,0,0,.5);text-shadow:2px 2px 0 #000,0 0 6px rgba(124,113,18,.9)}
#holep{position:absolute;left:16px;top:14px;padding:6px 12px 8px 12px;min-width:210px}
#holep .h{font-size:34px;line-height:1.05;color:#fff6c8}#holep .h small{font-size:18px;color:#f4e39a;margin-left:6px}
#holep .r{display:flex;justify-content:space-between;gap:14px;font-size:20px;border-top:1px solid #6b8f7c;margin-top:3px;padding-top:3px;color:#a8f0d8}
#holep .who{display:flex;align-items:center;gap:7px;font-size:18px;color:#fff6c8}#holep .who i{display:inline-block;width:13px;height:13px;border-radius:50%;border:2px solid #fff6c8}
#windp{position:absolute;right:16px;top:14px;padding:6px 12px;min-width:150px;display:flex;align-items:center;gap:12px}
#windp .arr{width:46px;height:46px;transition:transform .2s}#windp .t{font-size:30px;line-height:1;color:#fff6c8}#windp .t small{display:block;font-size:15px;color:#a8f0d8}
#banner{position:absolute;left:max(26%,200px);top:26%;transform:translateX(-50%);text-align:center;white-space:nowrap}
#banner b{display:block;font-size:46px;line-height:1;color:#f7e27a;text-shadow:3px 3px 0 #000,-2px -2px 0 #000,0 0 18px rgba(255,214,120,.8);-webkit-text-stroke:1.5px #3a3408}
#banner i{display:inline-block;margin-top:6px;font-size:22px;padding:3px 16px;color:#fff6c8;background:linear-gradient(180deg,#4a6a5c,#233c33 45%,#122219);border:2px solid #7ba08a;border-radius:4px;box-shadow:0 0 8px rgba(255,214,120,.45)}
#banner i:empty{display:none}#banner{opacity:0;transition:opacity .35s}#banner.on{opacity:1}
#banner.on b{animation:slam .45s cubic-bezier(.2,1.6,.4,1)}@keyframes slam{0%{transform:scale(2.4) skewX(-12deg);opacity:0}100%{transform:scale(1);opacity:1}}
#sub{position:absolute;left:27%;top:calc(26% + 112px);transform:translateX(-50%);font-size:22px;padding:4px 16px;color:#fff6c8;opacity:0;transition:opacity .4s;white-space:nowrap}#sub.on{opacity:1}
#clubp{position:absolute;left:16px;bottom:16px;padding:8px 12px;min-width:200px}
#clubp div{display:flex;justify-content:space-between;gap:18px;font-size:20px;padding:2px 8px;color:#9fc4b2;border-radius:4px}#clubp div.on{background:rgba(247,226,122,.22);color:#fff6c8;box-shadow:inset 0 0 0 1px #f7e27a}
#clubp div span{color:#f4e39a;font-size:16px}#clubp .lie{margin-top:4px;border-top:1px solid #6b8f7c;padding-top:4px;font-size:16px;color:#a8f0d8}
#meterp{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:480px;padding:8px 14px 10px;opacity:.0;transition:opacity .2s}#meterp.on{opacity:1}
#meterp .lab{display:flex;justify-content:space-between;font-size:20px;color:#fff6c8}
#meterp .bar{position:relative;height:30px;margin-top:4px;border-radius:15px;background:#0c1712;border:2px solid #7ba08a;overflow:hidden}
#meterp .fill{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#6fd36a,#e9e24a 60%,#ff7a3a)}
#meterp .snap{position:absolute;left:0;top:0;bottom:0;width:4.5%;background:rgba(255,246,200,.28);border-right:3px solid #fff6c8}
#meterp .needle{position:absolute;top:-2px;bottom:-2px;width:5px;margin-left:-2px;background:#fff;box-shadow:0 0 8px #fff;display:none}
#meterp .notch{position:absolute;top:0;bottom:0;width:3px;background:#4ad8e8;box-shadow:0 0 6px #4ad8e8}
#hinter{position:absolute;right:16px;bottom:14px;padding:4px 10px;background:rgba(18,34,25,.72);border-radius:5px;font-size:14px;line-height:1.5;text-align:right;color:#f4e39a;opacity:.7;text-shadow:1px 1px 0 #000}#hinter b{color:#fff6c8}
#title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:9%;pointer-events:none}
#title h1{margin:0;font-size:120px;line-height:.95;color:#f7e27a;text-shadow:5px 5px 0 #000,-3px -3px 0 #000,0 0 30px rgba(255,214,120,.8);-webkit-text-stroke:2px #3a3408;letter-spacing:2px}
#title .sub{font-size:26px;color:#fff6c8;margin:10px 0 26px;padding:4px 20px}
#title .pl{display:flex;gap:12px;align-items:center;font-size:26px;color:#fff6c8;pointer-events:auto}
#title .pl b{display:inline-block;width:62px;height:50px;line-height:50px;text-align:center;cursor:pointer;border-radius:6px;font-size:30px;border:2px solid #7ba08a;background:linear-gradient(180deg,#4a6a5c,#122219);color:#9fc4b2}#title .pl b.on{color:#122219;background:linear-gradient(180deg,#fff17a,#e5b72c);border-color:#fff6c8;box-shadow:0 0 14px rgba(255,214,120,.9)}
#title .go{margin-top:22px;font-size:34px;color:#fff6c8;animation:blink 1.2s infinite;pointer-events:auto;cursor:pointer;padding:6px 20px}@keyframes blink{50%{opacity:.45}}
#card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:16px 22px;display:none;min-width:720px}
#card h2{margin:0 0 8px;text-align:center;font-size:40px;color:#f7e27a}
#card table{border-collapse:collapse;width:100%;font-size:22px}#card th,#card td{padding:5px 8px;text-align:center;border-bottom:1px solid #4d6f5e}#card th{color:#a8f0d8;font-size:18px}#card th.cur{color:#f7e27a}
#card td.nm{text-align:left;color:#fff6c8}#card td.nm i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:7px;border:2px solid #fff6c8}
#card .parrow td{color:#a8f0d8;font-size:18px}
.sc{display:inline-block;min-width:30px;height:30px;line-height:30px;color:#fff6c8}.sc.birdie{border:2px solid #7fe0d4;border-radius:50%;color:#7fe0d4}.sc.eagle{border:2px solid #f7e27a;border-radius:50%;box-shadow:0 0 0 3px #122219,0 0 0 5px #f7e27a;color:#f7e27a}.sc.bogey{border:2px solid #ff9a6a;color:#ff9a6a}.sc.dbl{border:2px solid #ff7a5a;box-shadow:0 0 0 3px #122219,0 0 0 5px #ff7a5a;color:#ff7a5a}
#card .stamps{display:flex;gap:26px;justify-content:center;margin:14px 0 4px;min-height:74px}
.stamp{transform:rotate(var(--rot));border:4px solid;border-radius:10px;padding:2px 16px 4px;text-align:center;font-size:36px;line-height:1.05;opacity:.92;background:rgba(0,0,0,.18)}.stamp em{display:block;font-size:14px;font-style:italic}
.stamp.birdie,.stamp.eagle{color:#7fe0d4;border-color:#7fe0d4}.stamp.par{color:#f4e39a;border-color:#f4e39a}.stamp.bogey{color:#ff9a6a;border-color:#ff9a6a}.stamp.dbl{color:#ff7a5a;border-color:#ff7a5a}.stamp.eagle{color:#f7e27a;border-color:#f7e27a}
#card .fin{text-align:center;font-size:30px;color:#fff6c8;margin-top:6px}#card .go{text-align:center;font-size:20px;color:#a8f0d8;margin-top:8px}
#hitPop{position:absolute;inset:0;mix-blend-mode:plus-lighter;opacity:0}
`;
document.head.appendChild(style);
export const hudEl = document.createElement('div'); hudEl.id = 'hud';
hudEl.innerHTML = `<div id="holep" class="steel"></div>
<div id="windp" class="steel"><svg class="arr" viewBox="-30 -30 60 60"><g id="windArrow"><path d="M0 -24 L12 -4 L4 -4 L4 22 L-4 22 L-4 -4 L-12 -4 Z" fill="#f4e39a" stroke="#000" stroke-width="2"/></g></svg><div class="t"></div></div>
<div id="banner"><b></b><i></i></div><div id="sub" class="steel"></div>
<div id="clubp" class="steel"></div>
<div id="meterp" class="steel"><div class="lab"><span class="l1">POWER</span><span class="l2"></span></div><div class="bar"><div class="fill"></div><div class="snap"></div><div class="notch"></div><div class="needle"></div></div></div>
<div id="hinter"></div>
<div id="title"><h1>ISLE GOLF</h1><div class="sub steel">TILT-SHIFT ARCADE GOLF ON SHEPHERD ISLE</div><div class="pl"><span>PLAYERS</span><b data-n="1" class="on">1</b><b data-n="2">2</b><b data-n="3">3</b><b data-n="4">4</b></div><div class="go steel">PRESS SPACE TO TEE OFF</div></div>
<div id="card" class="steel"></div><div id="hitPop"></div>`;
document.body.appendChild(hudEl);
export const $ = s => hudEl.querySelector(s);
export const hud = { holep: $('#holep'), windp: $('#windp'), arrow: $('#windArrow'), wt: $('#windp .t'), banner: $('#banner'), sub: $('#sub'), clubp: $('#clubp'), meter: $('#meterp'), fill: $('#meterp .fill'), needle: $('#meterp .needle'), notch: $('#meterp .notch'), l1: $('#meterp .l1'), l2: $('#meterp .l2'), help: $('#hinter'), title: $('#title'), card: $('#card'), pop: $('#hitPop') };
hud.help.innerHTML = '<b>A/D</b> aim · <b>W/S</b> club · <b>SPACE</b> swing (3 clicks)<br><b>C</b> hole view · <b>R</b> replay hole · <b>M</b> sound';
export function showTitle(on) { hud.title.style.display = on ? 'flex' : 'none'; if (on) { G.phase = 'title'; hud.card.style.display = 'none'; hideGolfer(); hud.help.style.opacity = .0; } else hud.help.style.opacity = .7; }
export function setPlayersSel(n) { G.nPlayers = n; hud.title.querySelectorAll('.pl b').forEach(b => b.classList.toggle('on', +b.dataset.n === n)); }
hud.title.querySelectorAll('.pl b').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); setPlayersSel(+b.dataset.n); }));
hud.title.querySelector('.go').addEventListener('click', e => { e.stopPropagation(); startFromTitle(); });
export function startFromTitle() { showTitle(false); startRound(G.nPlayers); }
export function showBanner(text, small, secs = 2) { G.banner = text; hud.banner.querySelector('b').textContent = text; hud.banner.querySelector('i').textContent = small || ''; hud.banner.classList.remove('on'); void hud.banner.offsetWidth; hud.banner.classList.add('on'); ST.bannerT = secs; }
export function setSub(t) { G.sub = t; hud.sub.textContent = t; hud.sub.classList.toggle('on', !!t); ST.subT = t ? 4 : 0; }
export let _hudKey = '';
export function windInfo() {
  const H = curH(), a = Math.atan2(H.wv.y, H.wv.x), s = H.wind[0], rel = a - G.aim;
  const tail = Math.cos(rel) * s, cross = Math.sin(rel) * s;
  return { speed: s, dir: Math.round(a * 180 / Math.PI), rel: Math.round(rel * 180 / Math.PI), tail: r3(tail), cross: r3(cross), text: Math.abs(tail) > Math.abs(cross) ? (tail > 0 ? 'TAILWIND' : 'HEADWIND') : (cross > 0 ? 'CROSS →' : '← CROSS') };
}
// the power that brings a straight shot to rest nearest the pin: a bisection on the real physics (wind and roll included), cached per aim
export let _needKey = '', _needVal = 0.5;
export function runDist(club, power, H, p, aim) {
  const s = newSim(); s.live = false; s.pos.copy(p.pos); launchOn(s, club, power, 0, aim, H, lieMul()); let n = 0;
  while ((s.mode === 'air' || s.mode === 'roll') && n++ < 900) stepSim(s, 1 / 40);
  return (s.pos.x - p.pos.x) * Math.cos(aim) + (s.pos.z - p.pos.z) * Math.sin(aim);
}
export function needPower() {
  const p = curP(), H = curH(), c = curClub(), key = [G.hole, G.club, p.pos.x.toFixed(2), p.pos.z.toFixed(2), (G.aim).toFixed(2)].join();
  if (key === _needKey) return _needVal; _needKey = key;
  const d = (H.pinX - p.pos.x) * Math.cos(G.aim) + (H.pinZ - p.pos.z) * Math.sin(G.aim);
  let lo = 0.03, hi = 1.0; if (runDist(c, hi, H, p, G.aim) < d) { _needVal = 1.05; return _needVal; }
  for (let i = 0; i < 9; i++) { const mid = (lo + hi) / 2; if (runDist(c, mid, H, p, G.aim) < d) lo = mid; else hi = mid; }
  _needVal = (lo + hi) / 2; return _needVal;
}
export function updateHUD() {
  if (G.phase === 'title' || G.phase === 'card') { hud.holep.style.display = hud.windp.style.display = hud.clubp.style.display = 'none'; hud.meter.classList.remove('on'); if (G.phase === 'card') { hud.banner.classList.remove('on'); hud.sub.classList.remove('on'); } return; }
  hud.holep.style.display = hud.windp.style.display = hud.clubp.style.display = 'block'; hud.windp.style.display = 'flex';
  const p = curP(), H = curH(), d = pinDist(p.pos, H), w = windInfo(), c = curClub();
  const tot = G.players.reduce((a, q) => a, 0); let run = 0, parRun = 0; for (let i = 0; i < G.hole; i++) if (p.scores[i] !== undefined) { run += p.scores[i]; parRun += HOLES[i].par; }
  const key = [G.hole, p.i, p.strokes, Math.round(d * 12), G.club, w.speed, w.rel, p.surf, run].join('|');
  if (key !== _hudKey) {
    _hudKey = key;
    hud.holep.innerHTML = `<div class="h">HOLE ${G.hole + 1}<small>PAR ${H.par}</small></div><div class="r"><span>STROKES ${p.strokes}</span><span>${Math.round(d * YD)} YD</span></div><div class="r"><span>ROUND ${vsPar(run - parRun)}</span><span>${H.name}</span></div>` + (G.players.length > 1 ? `<div class="who"><i style="background:${p.kit.col}"></i>${p.name}</div>` : '');
    hud.clubp.innerHTML = CLUBS.map((k, i) => `<div class="${i === G.club ? 'on' : ''}">${k.name}<span>${k.putt ? 'GREEN' : Math.round(k.carry * YD * (i === G.club ? lieMul() : 1)) + ' YD'}</span></div>`).join('') + `<div class="lie">LIE · ${p.surf === 'tee' ? 'TEE' : p.surf.toUpperCase()}</div>`;
    hud.wt.innerHTML = `${Math.round(w.speed)} MPH<small>${w.text}</small>`;
    hud.arrow.setAttribute('transform', `rotate(${w.rel})`);
  }
  const m = G.m;
  hud.meter.classList.toggle('on', G.phase === 'aim' && m.stage > 0 || G.phase === 'swing');
  if (G.phase === 'aim' || G.phase === 'swing') {
    hud.fill.style.width = (m.power * 100).toFixed(1) + '%';
    hud.needle.style.display = m.stage >= 2 ? 'block' : 'none';
    if (m.stage >= 2) { const pos = Math.max(0, m.power - m.t2 / METER.down); hud.needle.style.left = (Math.max(0, pos) * 100).toFixed(1) + '%'; }
    hud.l1.textContent = m.label || 'POWER'; hud.l2.textContent = `${Math.round(m.power * 100)}%`;
    const np = needPower(); hud.notch.style.left = (clamp(np, 0, 1) * 100).toFixed(1) + '%'; hud.notch.style.background = np > 1.02 ? '#ff6a4a' : '#4ad8e8';
  }
}
