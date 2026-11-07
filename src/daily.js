// Made with paprika3d · https://paprika3d.com
import './api.js';
import * as THREE from 'three';
import { clamp } from './util.js';
import { ST, addAction, addObserve, addUpdate, addKey, addSetState, on, fire } from './shared.js';
import { HOLES, heightAt, surfaceAt, bunkerQ, BUNKERS, YD } from './course.js';
import { G, beginHole, curH, curP, scoreName, startRound } from './round.js';
import { BR, WIND } from './rules.js';
import { hud, showBanner, setSub, showTitle } from './hud.js';
import { SIM } from './physics.js';

// ---------------------------------------------------------------- Daily Hole state
let _cardTimer = null;
export const DAILY = {
  on: false,
  date: '',
  holeIndex: 0,
  pin: [0, 0],
  wind: { speed: 3, degrees: 0 },
  teeNudge: [0, 0],
  shots: [],
  strokes: 0,
  result: '',
  shareText: '',
  cardShown: false,
  firstPlay: false,
  todaysFirst: 0,
  _savedFirst: false,
  _orig: null,
  teePos: null,
};

// ---------------------------------------------------------------- FNV-1a hash — better distribution than djb2 for adjacent date strings
function dateHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h ^ s.charCodeAt(i), 0x01000193)) >>> 0;
  return h === 0 ? 1 : h;
}

// ---------------------------------------------------------------- XorShift32 PRNG — deterministic, never touches Math.random
class DatePRNG {
  constructor(seed) { this.s = (seed === 0 ? 0xdeadbeef : seed) >>> 0; }
  next() { let x = this.s; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.s = x >>> 0; return this.s / 0x100000000; }
  range(a, b) { return a + this.next() * (b - a); }
  int(a, b) { return Math.floor(a + this.next() * (b - a + 1)); }  // inclusive both ends, never reaches b+1
}

// ---------------------------------------------------------------- Deterministic challenge from UTC date string
function generateDaily(dateStr) {
  const rng = new DatePRNG(dateHash(dateStr));
  const holeIndex = rng.int(0, 8);
  const H = HOLES[holeIndex];
  const teeNudge = [rng.range(-0.4, 0.4), rng.range(-0.4, 0.4)];
  // Pin inside 60% green radius, not in a bunker — try up to 120 times
  let pinX, pinZ, valid = false;
  const maxR = H.green.r * 0.6;
  for (let attempt = 0; attempt < 120; attempt++) {
    const ang = rng.range(0, Math.PI * 2);
    const r = rng.range(0.25, maxR);
    pinX = H.green.x + Math.cos(ang) * r;
    pinZ = H.green.z + Math.sin(ang) * r;
    valid = true;
    for (const b of BUNKERS) {
      if (b.hole === holeIndex && bunkerQ(b, pinX, pinZ) < 1.2) { valid = false; break; }
    }
    if (valid) break;
  }
  if (!valid) { pinX = H.green.x; pinZ = H.green.z; }
  const pin = [+(pinX - H.green.x).toFixed(4), +(pinZ - H.green.z).toFixed(4)];
  const windSpeed = rng.range(1, 7);
  const windDegrees = rng.range(0, 360);
  return { holeIndex, teeNudge, pin, wind: { speed: windSpeed, degrees: windDegrees } };
}

// ---------------------------------------------------------------- Validate YYYY-MM-DD (rejects 2026-99-99 etc.)
function isValidDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

// ---------------------------------------------------------------- Restore original hole state
export function exitDaily() {
  if (!DAILY.on) return;
  const o = DAILY._orig;
  if (o) {
    const H = HOLES[DAILY.holeIndex];
    H.pin = o.pin; H.pinX = o.pinX; H.pinZ = o.pinZ; H.pinY = o.pinY;
    H.wind = o.wind; H.wv = o.wv;
    if (H.pinG) H.pinG.position.set(o.pinX, o.pinY, o.pinZ);
    if (H.flag) { H.flag.rotation.y = o.flagRotY; H.flag.scale.x = o.flagScaleX; }
    // Do NOT reset WIND/ST.gust here — the next beginHole sets them correctly from the restored H.wv
  }
  if (_cardTimer) { clearTimeout(_cardTimer); _cardTimer = null; }
  const card = document.getElementById('daily-card');
  if (card) card.remove();
  DAILY.on = false;
  G.dailyOn = false;
  DAILY._orig = null;
  DAILY.cardShown = false;
  DAILY.teePos = null;
}

// ---------------------------------------------------------------- Start daily challenge
export function startDaily(dateStr) {
  if (DAILY.on) exitDaily();

  if (!isValidDate(dateStr)) dateStr = new Date().toISOString().split('T')[0];

  const cfg = generateDaily(dateStr);
  const H = HOLES[cfg.holeIndex];

  // Save originals BEFORE mutating H
  DAILY._orig = {
    pin: [...H.pin], pinX: H.pinX, pinZ: H.pinZ, pinY: H.pinY,
    wind: [...H.wind], wv: H.wv.clone(),
    flagRotY: H.flag ? H.flag.rotation.y : 0,
    flagScaleX: H.flag ? H.flag.scale.x : 1,
  };

  // Apply daily overrides BEFORE beginHole so autoAim, WIND, ST.gust use daily values
  H.pin = cfg.pin;
  H.pinX = H.green.x + cfg.pin[0];
  H.pinZ = H.green.z + cfg.pin[1];
  H.pinY = heightAt(H.pinX, H.pinZ);
  H.wind = [cfg.wind.speed, cfg.wind.degrees];
  const windRad = cfg.wind.degrees * Math.PI / 180;
  H.wv = new THREE.Vector2(Math.cos(windRad) * cfg.wind.speed, Math.sin(windRad) * cfg.wind.speed);
  if (H.pinG) H.pinG.position.set(H.pinX, H.pinY, H.pinZ);
  if (H.flag) { H.flag.rotation.y = -windRad; H.flag.scale.x = 0.8 + 0.04 * cfg.wind.speed; }

  Object.assign(DAILY, {
    date: dateStr, holeIndex: cfg.holeIndex, pin: cfg.pin,
    wind: { speed: +cfg.wind.speed.toFixed(4), degrees: +cfg.wind.degrees.toFixed(4) },
    teeNudge: cfg.teeNudge, shots: [], strokes: 0,
    result: '', shareText: '', cardShown: false, _savedFirst: false,
  });

  // localStorage: check for prior result today
  try {
    const saved = localStorage.getItem('isleGolfDaily_' + dateStr);
    if (saved) {
      const d = JSON.parse(saved);
      DAILY.firstPlay = false; DAILY.todaysFirst = d.strokes || 0;
    } else { DAILY.firstPlay = true; DAILY.todaysFirst = 0; }
  } catch (e) { DAILY.firstPlay = true; }

  // Hide title / existing scorecard
  showTitle(false);
  hud.card.style.display = 'none';
  const existingCard = document.getElementById('daily-card');
  if (existingCard) existingCard.remove();

  // Set up single-player round (round:start fires here, but DAILY.on still false → handler skips)
  startRound(1);

  DAILY.on = true;    // enable AFTER startRound so round:start handler doesn't fire exitDaily
  G.dailyOn = true;   // signal to HUD

  // Begin the actual daily hole — uses overridden H values
  beginHole(cfg.holeIndex);

  // Nudge tee position after beginHole placed the player
  const p = curP();
  p.pos.x += cfg.teeNudge[0];
  p.pos.z += cfg.teeNudge[1];
  p.pos.y = heightAt(p.pos.x, p.pos.z) + BR * 0.8;
  p.prev.copy(p.pos);
  SIM.pos.copy(p.pos);

  // Initial tee position (after nudge)
  DAILY.shots = [[+p.pos.x.toFixed(3), +p.pos.z.toFixed(3)]];
  DAILY.teePos = { x: p.pos.x, z: p.pos.z };

  // Override beginHole banner with daily header
  showBanner('DAILY HOLE · ' + dateStr, `PAR ${H.par} · ${H.yards} YD · ${H.name.toUpperCase()}`, 3.2);
}

// ---------------------------------------------------------------- Shot tracking — authoritative events from round.js

// shot:rest fires AFTER p.pos is finalized in resolveShot, before nextTurnOrCard
// sunk and pickup both return early in resolveShot, so they don't fire this event
on('shot:rest', ({ x, z }) => {
  if (!DAILY.on) return;
  DAILY.shots.push([+x.toFixed(3), +z.toFixed(3)]);
});

// round:start fires at the top of startRound, before beginHole(0)
// DAILY.on is false during startDaily's own startRound call, so this only fires for external rounds
on('round:start', () => {
  if (DAILY.on) exitDaily();
});

// hole:replay fires in replayHole (hud.js) after it resets p.pos to unnudged tee, before beginShot
on('hole:replay', ({ hole }) => {
  if (!DAILY.on || hole !== DAILY.holeIndex) return;
  if (_cardTimer) { clearTimeout(_cardTimer); _cardTimer = null; }
  const existingCard = document.getElementById('daily-card');
  if (existingCard) existingCard.remove();
  const p = curP();
  // Re-apply nudge to the unnudged tee position that replayHole just set
  p.pos.x += DAILY.teeNudge[0];
  p.pos.z += DAILY.teeNudge[1];
  p.prev.copy(p.pos);
  SIM.pos.copy(p.pos);
  // Record the nudged position
  DAILY.teePos = { x: p.pos.x, z: p.pos.z };
  DAILY.shots = [[+p.pos.x.toFixed(3), +p.pos.z.toFixed(3)]];
  DAILY.strokes = 0;
  DAILY.cardShown = false;
  DAILY.result = '';
  DAILY.shareText = '';
});

// hud-round:tee-surf fired by beginShot after normal classification — override p.surf for nudged daily tee
on('hud-round:tee-surf', ({ p, H }) => {
  if (!DAILY.on || H.i !== DAILY.holeIndex || p.strokes !== 0 || !DAILY.teePos) return;
  if (Math.hypot(p.pos.x - DAILY.teePos.x, p.pos.z - DAILY.teePos.z) < 0.5) p.surf = 'tee';
});

// ---------------------------------------------------------------- Hole end: cup AND pickup both reach here via openCard → hole:end
on('hole:end', () => {
  if (!DAILY.on) return;

  G.phase = 'daily-card';            // use unique phase so click/next naturally no-op
  hud.card.style.display = 'none';   // hide regular scorecard immediately

  const H = curH();
  const p = curP();
  DAILY.strokes = p.scores[G.hole] || p.strokes;
  DAILY.result = p.pickedUp ? 'PICKED UP' : scoreName(DAILY.strokes, H.par);

  // Record final position (cup or pickup point)
  const finalPt = p.pickedUp ? [+p.pos.x.toFixed(3), +p.pos.z.toFixed(3)] : [+H.pinX.toFixed(3), +H.pinZ.toFixed(3)];
  DAILY.shots.push(finalPt);

  // Save first play to localStorage; snapshot for showDailyCard badge
  DAILY._savedFirst = DAILY.firstPlay;
  if (DAILY.firstPlay) {
    try {
      localStorage.setItem('isleGolfDaily_' + DAILY.date, JSON.stringify({
        strokes: DAILY.strokes, result: DAILY.result, date: DAILY.date
      }));
      DAILY.todaysFirst = DAILY.strokes;
    } catch (e) {}
    DAILY.firstPlay = false;
  }

  _buildShareText(H);

  _cardTimer = setTimeout(() => {
    _cardTimer = null;
    if (DAILY.on && !DAILY.cardShown) showDailyCard();
  }, 1200);
});

// Live stroke count (addUpdate is safe here: only reads, never affects result)
addUpdate(() => { if (DAILY.on) DAILY.strokes = curP()?.strokes || 0; });

// ---------------------------------------------------------------- Share text
function _strokeRow(strokes, par) {
  const v = strokes - par;
  const sym = v <= -2 ? '\u{1F7E8}' : v === -1 ? '\u{1F7E9}' : v === 0 ? '⬜' : v === 1 ? '\u{1F7E5}' : '⬛';
  return sym.repeat(Math.min(strokes, 8));
}
function _buildShareText(H) {
  const vsParNum = DAILY.strokes - H.par;
  const vsParStr = vsParNum === 0 ? 'EVEN' : vsParNum > 0 ? '+' + vsParNum : String(vsParNum);
  const resultClean = DAILY.result.replace(/!/g, '').trim();
  const row = DAILY.result === 'PICKED UP'
    ? '⬛'.repeat(H.par + 3)
    : _strokeRow(DAILY.strokes, H.par);
  DAILY.shareText = `Isle Golf Daily ${DAILY.date} · ${H.name} (par ${H.par}) · ${DAILY.strokes} ${DAILY.strokes === 1 ? 'stroke' : 'strokes'}, ${vsParStr} ${resultClean}\n${row}\nhttps://isle-golf.pages.dev/?daily=${DAILY.date}`;
}

// ---------------------------------------------------------------- Daily stamp card UI
function showDailyCard() {
  DAILY.cardShown = true;

  const H = HOLES[DAILY.holeIndex];
  const vsParNum = DAILY.strokes - H.par;
  const vsParStr = vsParNum === 0 ? 'EVEN' : vsParNum > 0 ? '+' + vsParNum : String(vsParNum);
  const resultClean = DAILY.result.replace(/!/g, '').trim();
  const scoreColor = vsParNum <= -2 ? '#f7e27a' : vsParNum === -1 ? '#7fe0d4' : vsParNum === 0 ? '#f4e39a' : '#ff9a6a';
  const stampClass = vsParNum <= -2 ? 'eagle' : vsParNum === -1 ? 'birdie' : vsParNum === 0 ? 'par' : 'bogey';

  const firstBadge = !DAILY._savedFirst && DAILY.todaysFirst
    ? `<div style="text-align:center;font-size:17px;color:#a8f0d8;margin-top:6px">TODAY'S FIRST: ${DAILY.todaysFirst}</div>`
    : '';

  const style = `
    position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    padding:14px 18px;width:min(500px,94vw);max-height:92vh;overflow-y:auto;
    font-family:Impact,Haettenschweiler,'Arial Narrow Bold','Arial Black',sans-serif;
    font-style:italic;text-transform:uppercase;color:#f4e39a;letter-spacing:.5px;
    user-select:none;z-index:200;pointer-events:auto`;

  const html = `<div id="daily-card" class="steel" style="${style}">
  <div style="text-align:center;font-size:36px;color:#f7e27a;line-height:1">DAILY HOLE</div>
  <div style="text-align:center;font-size:18px;color:#a8f0d8;margin:2px 0 10px">${DAILY.date}</div>
  <canvas id="daily-canvas" width="440" height="260" style="display:block;margin:0 auto 10px;border-radius:4px;border:1px solid #4d6f5e;max-width:100%"></canvas>
  <div class="stamp ${stampClass}" style="display:block;margin:0 auto 8px;width:fit-content;min-width:160px;text-align:center;--rot:0deg">
    <em>${H.name}</em>${resultClean}
  </div>
  <div style="text-align:center;font-size:22px;color:#fff6c8">${DAILY.strokes} ${DAILY.strokes===1?'STROKE':'STROKES'} · PAR ${H.par}</div>
  <div style="text-align:center;font-size:28px;color:${scoreColor};margin:2px 0">${vsParStr}</div>
  ${firstBadge}
  <div style="display:flex;gap:10px;justify-content:center;margin-top:12px">
    <button id="daily-share" class="steel" style="cursor:pointer;padding:8px 20px;font-size:22px;color:#fff6c8;border:2px solid #7ba08a;border-radius:5px;background:linear-gradient(180deg,#4a6a5c,#122219);font-family:inherit;font-style:italic;text-transform:uppercase;letter-spacing:.5px">SHARE</button>
    <button id="daily-menu" class="steel" style="cursor:pointer;padding:8px 20px;font-size:22px;color:#9fc4b2;border:2px solid #4d6f5e;border-radius:5px;background:linear-gradient(180deg,#2a3f35,#0c160f);font-family:inherit;font-style:italic;text-transform:uppercase;letter-spacing:.5px">MENU</button>
  </div>
  <div id="daily-copied" style="text-align:center;font-size:19px;color:#7fe0d4;margin-top:8px;min-height:24px;opacity:0;transition:opacity .3s">COPIED!</div>
</div>`;

  const existing = document.getElementById('daily-card');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);

  paintDailyCanvas();

  document.getElementById('daily-share').addEventListener('click', shareDailyCard);
  document.getElementById('daily-menu').addEventListener('click', () => {
    exitDaily();
    showTitle(true);
  });
}

// ---------------------------------------------------------------- Miniature path canvas — LOOK palette
function paintDailyCanvas() {
  const canvas = document.getElementById('daily-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CW = canvas.width, CH = canvas.height;
  const H = HOLES[DAILY.holeIndex];

  // Compute world bounds including all shots and hole path
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  const addPt = (x, z) => { x0=Math.min(x0,x); x1=Math.max(x1,x); z0=Math.min(z0,z); z1=Math.max(z1,z); };
  DAILY.shots.forEach(([x, z]) => addPt(x, z));
  H.path.forEach(([x, z]) => addPt(x, z));
  addPt(H.pinX, H.pinZ); addPt(H.tee[0], H.tee[1]);

  const pad = Math.max(x1-x0, z1-z0) * 0.18 + H.green.r + 1.5;
  x0 -= pad; x1 += pad; z0 -= pad; z1 += pad;
  const sc = Math.min(CW / (x1-x0), CH / (z1-z0)) * 0.90;
  const ox = CW/2 - (x0+x1)/2 * sc;
  const oz = CH/2 - (z0+z1)/2 * sc;
  const pt = (x, z) => [ox + x * sc, oz + z * sc];

  // Sea background
  ctx.fillStyle = '#0f6a67';
  ctx.fillRect(0, 0, CW, CH);

  // Rough blob around hole path
  ctx.save();
  ctx.strokeStyle = '#b8a64a';
  ctx.lineWidth = H.hw * 3.8 * sc;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  H.path.forEach(([x, z], i) => { const [sx,sz]=pt(x,z); i===0?ctx.moveTo(sx,sz):ctx.lineTo(sx,sz); });
  ctx.stroke();
  const [gx, gz] = pt(H.green.x, H.green.z);
  ctx.fillStyle = '#b8a64a';
  ctx.beginPath(); ctx.arc(gx, gz, (H.green.r + 2.0) * sc, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // Fairway dark base
  ctx.save();
  ctx.strokeStyle = '#5d8a3a';
  ctx.lineWidth = H.hw * 1.75 * sc;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  H.path.forEach(([x, z], i) => { const [sx,sz]=pt(x,z); i===0?ctx.moveTo(sx,sz):ctx.lineTo(sx,sz); });
  ctx.stroke();
  // Stripe overlay
  ctx.strokeStyle = '#6b9743';
  ctx.lineWidth = H.hw * 0.7 * sc;
  ctx.setLineDash([2.5*sc, 2.5*sc]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Green
  ctx.fillStyle = '#76a64a';
  ctx.beginPath(); ctx.arc(gx, gz, H.green.r * sc, 0, Math.PI*2); ctx.fill();

  // Bunkers
  for (const b of BUNKERS) {
    if (b.hole !== H.i) continue;
    const [bsx, bsz] = pt(b.x, b.z);
    ctx.save();
    ctx.translate(bsx, bsz); ctx.rotate(b.rot);
    ctx.fillStyle = '#dcc78d';
    ctx.beginPath(); ctx.ellipse(0, 0, b.rx*sc, b.rz*sc, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // Shot path lines
  if (DAILY.shots.length > 1) {
    ctx.strokeStyle = '#f4e39a';
    ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.globalAlpha = 0.9;
    ctx.beginPath();
    DAILY.shots.forEach(([x, z], i) => { const [sx,sz]=pt(x,z); i===0?ctx.moveTo(sx,sz):ctx.lineTo(sx,sz); });
    ctx.stroke(); ctx.globalAlpha = 1;
  }

  // Flag at daily pin
  const [fps, fpz] = pt(H.pinX, H.pinZ);
  ctx.fillStyle = '#d9392b';
  ctx.beginPath(); ctx.arc(fps, fpz, 5, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#d9392b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(fps, fpz); ctx.lineTo(fps, fpz - 11); ctx.stroke();
  ctx.fillRect(fps + 1, fpz - 11, 7, 5);

  // Numbered shot dots
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  DAILY.shots.forEach(([x, z], i) => {
    const [sx, sz] = pt(x, z);
    const isLast = i === DAILY.shots.length - 1;
    ctx.fillStyle = isLast ? '#d9392b' : '#f4e39a';
    ctx.strokeStyle = '#122219'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(sx, sz, 9, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#122219';
    ctx.fillText(String(i + 1), sx, sz);
  });
}

// ---------------------------------------------------------------- Share
async function shareDailyCard() {
  const canvas = document.getElementById('daily-canvas');
  if (!canvas) return;

  let blob;
  try { blob = await new Promise(res => canvas.toBlob(res, 'image/png')); } catch (e) { blob = null; }

  if (blob && navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], 'isle-golf-daily.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ text: DAILY.shareText, files: [file] });
        return;
      }
    } catch (e) { /* fall through */ }
  }

  let copied = false;
  try { await navigator.clipboard.writeText(DAILY.shareText); copied = true; } catch (e) {}

  if (blob) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `isle-golf-daily-${DAILY.date}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {}
  }

  if (copied) {
    const el = document.getElementById('daily-copied');
    if (el) { el.style.opacity = '1'; setTimeout(() => { el.style.opacity = '0'; }, 2200); }
  }
}

// ---------------------------------------------------------------- action: __game.act({action:'daily', date?})
addAction('daily', input => {
  startDaily(input.date || new Date().toISOString().split('T')[0]);
});

// ---------------------------------------------------------------- Keyboard shortcut D on title screen; eat Space/Enter during daily card
addKey(code => {
  if (code === 'KeyD' && G.phase === 'title') {
    startDaily(new Date().toISOString().split('T')[0]);
    return true;
  }
  if (DAILY.on && DAILY.cardShown && (code === 'Space' || code === 'Enter')) return true;
});

// ---------------------------------------------------------------- Title screen: inject "D · DAILY HOLE" button after PRESS SPACE
{
  const goBtn = hud.title.querySelector('.go');
  const dailyBtn = document.createElement('div');
  dailyBtn.className = 'go steel';
  dailyBtn.style.cssText = 'margin-top:8px;font-size:26px;cursor:pointer';
  dailyBtn.textContent = 'D · DAILY HOLE';
  dailyBtn.addEventListener('click', e => {
    e.stopPropagation();
    startDaily(new Date().toISOString().split('T')[0]);
  });
  goBtn.after(dailyBtn);
}

// ---------------------------------------------------------------- observable state — always present
addObserve(() => ({
  daily: {
    on: DAILY.on,
    date: DAILY.date,
    holeIndex: DAILY.holeIndex,
    pin: DAILY.pin,
    wind: { speed: +DAILY.wind.speed.toFixed(4), degrees: +DAILY.wind.degrees.toFixed(4) },
    shots: DAILY.shots.map(([x, z]) => [+x.toFixed(3), +z.toFixed(3)]),
    shotsCount: DAILY.shots.length,
    strokes: DAILY.strokes,
    result: DAILY.result,
    shareText: DAILY.shareText,
    shareUrl: DAILY.shareText ? DAILY.shareText.split('\n').pop() : '',
    firstPlay: DAILY.firstPlay,
    todaysFirst: DAILY.todaysFirst,
  }
}));

// ---------------------------------------------------------------- setState hook — allows check steps to seed localStorage for test isolation
addSetState(s => {
  if (s.localStorage) {
    for (const [k, v] of Object.entries(s.localStorage)) {
      try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, String(v)); } catch (e) {}
    }
  }
});

// ---------------------------------------------------------------- URL ?daily / ?daily=YYYY-MM-DD auto-start
{
  const qs = new URLSearchParams(location.search);
  if (qs.has('daily')) {
    const raw = qs.get('daily') || '';
    const dateStr = isValidDate(raw) ? raw : new Date().toISOString().split('T')[0];
    setTimeout(() => startDaily(dateStr), 300);
  }
}
