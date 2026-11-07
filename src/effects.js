import './cow.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { hash, rand, smooth } from './util.js';
import { ST } from './shared.js';
import { FIELD_H, HOUSE, H_HOUSE, H_POND, POND } from './course.js';
import { camera, scene, std } from './stage.js';
import { WIND } from './rules.js';

// ---------------------------------------------------------------- effects: icons, particles, ripples, smoke, butterflies, gulls, fireflies, clouds
export function canvasTex(draw, w = 64, h = 64) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
export const TEX = {
  heart: canvasTex(x => { x.fillStyle = '#ff6b86'; x.strokeStyle = '#fff3f0'; x.lineWidth = 4; x.beginPath(); x.moveTo(32, 56); x.bezierCurveTo(2, 34, 8, 4, 32, 20); x.bezierCurveTo(56, 4, 62, 34, 32, 56); x.closePath(); x.stroke(); x.fill(); }),
  note: canvasTex(x => { x.fillStyle = '#fff4cf'; x.strokeStyle = '#fff4cf'; x.beginPath(); x.ellipse(22, 48, 10, 8, -0.4, 0, 6.3); x.fill(); x.fillRect(29, 10, 5, 40); x.lineWidth = 5; x.beginPath(); x.moveTo(32, 12); x.quadraticCurveTo(50, 18, 46, 34); x.stroke(); }),
  bang: canvasTex(x => { x.fillStyle = '#fff4cf'; x.fillRect(27, 6, 10, 36); x.beginPath(); x.arc(32, 53, 6, 0, 6.3); x.fill(); }),
  zz: canvasTex(x => { x.fillStyle = '#dfe8ff'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('z', 32, 34); }),
  soft: canvasTex((x, w) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); }),
  streak: canvasTex((x, w, h) => { const g = x.createLinearGradient(0, h, 0, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.12, 'rgba(255,255,255,0.95)'); g.addColorStop(0.45, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(w / 2, h / 2, w * 0.3, h / 2, 0, 0, 6.3); x.fill(); }, 16, 128),
  dot: canvasTex((x, w) => { x.fillStyle = '#fff'; x.beginPath(); x.arc(32, 32, 26, 0, 6.3); x.fill(); }),
  fly: canvasTex(x => { x.fillStyle = '#fff'; x.beginPath(); x.ellipse(18, 24, 15, 13, 0.5, 0, 6.3); x.ellipse(46, 24, 15, 13, -0.5, 0, 6.3); x.fill(); x.beginPath(); x.ellipse(20, 44, 10, 9, -0.3, 0, 6.3); x.ellipse(44, 44, 10, 9, 0.3, 0, 6.3); x.fill(); x.fillStyle = '#3a2a20'; x.fillRect(30, 16, 4, 36); }),
  cloud: canvasTex((x, w, h) => {
    for (let i = 0; i < 26; i++) {
      const cx = w * (0.2 + 0.6 * hash(i, 1)), cy = h * (0.42 + 0.25 * (hash(i, 2) - 0.5)), r = w * (0.08 + 0.12 * hash(i, 3));
      const g = x.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r); g.addColorStop(0, 'rgba(255,244,218,0.95)'); g.addColorStop(0.5, 'rgba(226,226,206,0.75)'); g.addColorStop(1, 'rgba(160,184,174,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 6.3); x.fill();
    }
  }, 256, 128),
};
export const icons = [];
export function spawnIcon(kind, x, y, z, color) {
  const m = new THREE.SpriteMaterial({ map: TEX[kind], transparent: true, depthWrite: false, color: color || 0xffffff });
  const s = new THREE.Sprite(m); s.name = 'icon_' + kind; s.position.set(x + rand(-0.15, 0.15), y, z); s.scale.setScalar(0.5); scene.add(s);
  icons.push({ s, t: 0, life: 1.6, vx: rand(-0.2, 0.2) });
}
export const parts = [];
export function spawnParticles(x, y, z, n, color, o = {}) {
  for (let i = 0; i < n; i++) {
    const m = new THREE.SpriteMaterial({ map: TEX[o.tex || 'dot'], color, transparent: true, depthWrite: false });
    const s = new THREE.Sprite(m); s.name = 'particle'; const sz = (o.size || 0.12) * rand(0.6, 1.3); if (o.streak) s.scale.set(sz * 0.09, sz * rand(0.8, 1.2), 1); else s.scale.setScalar(sz); scene.add(s);
    const a = rand(0, 6.28), sp = (o.speed || 2) * rand(0.4, 1), rr = o.ring || 0;
    s.position.set(x + Math.cos(a) * rr, y, z + Math.sin(a) * rr);   // a ring spawn sets each jet on the pier's face, moving outward from it
    parts.push({ s, streak: !!o.streak, op: o.opacity, vx: Math.cos(a) * sp, vz: Math.sin(a) * sp, vy: (o.up || 2) * rand(0.6, 1.2), g: o.gravity ?? 6, t: 0, life: (o.life || 1.2) * rand(0.7, 1.2), drag: o.drag || 0.5, spin: o.flutter || 0 });
  }
}
export const ripples = [], _sa = new THREE.Vector3(), _sb = new THREE.Vector3();
export const ringGeo = new THREE.RingGeometry(0.8, 1, 32).rotateX(-Math.PI / 2);
export let rippleN = 0;
export function spawnRipple(x, z, delay = 0, scale = 1) {
  const m = new THREE.MeshBasicMaterial({ color: 0xe8fff6, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const r = new THREE.Mesh(ringGeo, m); r.name = 'ripple'; r.position.set(x, H_POND + 0.03 + (rippleN++ % 6) * 0.004, z); r.renderOrder = 3; r.scale.setScalar(0.01); scene.add(r);
  ripples.push({ r, t: -delay, life: 1.8, sc: scale });
}
export const smokes = [];
export const chimneyTop = new THREE.Vector3(HOUSE.x + 1.15, H_HOUSE + 3.0, HOUSE.z - 0.35);
export function spawnSmoke() {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.soft, color: 0xeef0ea, transparent: true, opacity: 0, depthWrite: false }));
  s.name = 'smoke'; s.position.copy(chimneyTop); s.scale.setScalar(0.3); scene.add(s); smokes.push({ s, t: 0, life: 4.5 });
}
export const flies = [];
export function spawnButterflies(x, z, n) {
  const cols = [0xfff1a8, 0xffffff, 0xffb3d1, 0xb9d8ff];
  for (let i = 0; i < n; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.fly, color: cols[i % cols.length], transparent: true, depthWrite: false }));
    s.name = 'butterfly'; s.scale.set(0.28, 0.24, 1); scene.add(s);
    flies.push({ s, cx: x, cz: z, a: rand(0, 6.28), r: rand(0.4, 1.8), h: rand(0.3, 1.2), sp: rand(0.8, 1.6) * (Math.random() < 0.5 ? -1 : 1), t: 0, life: rand(10, 16), ph: rand(0, 6) });
  }
}
// gulls: two thin wings each, circling the island
export const gulls = [], _gv = new THREE.Vector3();
export const gullMat = std('#e4e8e2', { side: THREE.DoubleSide });
export function makeGull(i, wild) {
  const g = new THREE.Group(); g.name = 'gull' + i;
  const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.12, 0, 0, -0.1, 0.55, 0, -0.02], 3)); wg.computeVertexNormals();
  const l = new THREE.Mesh(wg, gullMat), r = new THREE.Mesh(wg, gullMat); r.scale.x = -1; l.name = r.name = 'gull_wing';
  const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.25, 2, 5), gullMat); b.rotation.x = Math.PI / 2; b.name = 'gull_body';
  g.add(l, r, b); g.scale.setScalar(1.1); scene.add(g);   // circling out over the island's rim and the surf, where the wide shots see them, never across the play
  gulls.push({ g, l, r, a: rand(0, 6.28), R: rand(14, 18), h: FIELD_H + rand(2, 4), sp: rand(0.15, 0.3) * (i % 2 ? 1 : -1), ph: rand(0, 6), life: wild ? rand(14, 20) : 1e9, t: 0 });
}
makeGull(0, false); makeGull(1, false);
// fireflies for the night
export const FF = 40, ffGeo = new THREE.BufferGeometry(), ffPos = new Float32Array(FF * 3), ffSeed = [];
for (let i = 0; i < FF; i++) ffSeed.push([POND.x + rand(-4, 4), POND.z + rand(-3.5, 3.5), rand(0, 6.28), rand(0.3, 1.4)]);
ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
export const ffMat = new THREE.PointsMaterial({ color: 0xfff09a, size: 0.22, map: TEX.soft, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
export const fireflies = new THREE.Points(ffGeo, ffMat); fireflies.name = 'fireflies'; fireflies.frustumCulled = false; scene.add(fireflies);
// clouds drifting high over the sea (the island-1 cloud in the corner)
export const clouds = [];
for (const [x, y, z, s] of [[14, 3, -15, 18], [-18, 3.5, -22, 10], [24, 3, 10, 9]]) {
  const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.cloud, transparent: true, opacity: 0.78, depthWrite: false, fog: true }));
  c.name = 'cloud'; c.renderOrder = 6; c.position.set(x, y, z);   // drawn over the beams, so a beam passes behind a cloud instead of lighting it c.scale.set(s, s / 2, 1); scene.add(c); clouds.push({ c, x0: x });
}

export function updateEffects(dt) {
  for (let i = icons.length - 1; i >= 0; i--) {
    const c = icons[i]; c.t += dt; c.s.position.y += dt * 0.7; c.s.position.x += c.vx * dt;
    c.s.material.opacity = smooth(0, 0.15, c.t) * smooth(c.life, c.life * 0.6, c.t); c.s.scale.setScalar(0.5 * (0.6 + 0.4 * smooth(0, 0.2, c.t)));
    if (c.t > c.life) { scene.remove(c.s); c.s.material.dispose(); icons.splice(i, 1); }
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t += dt; p.vy -= p.g * dt; const dr = Math.exp(-p.drag * dt); p.vx *= dr; p.vz *= dr;
    // the gale whips steam flat and sideways; spray streaks only lean with it, they keep climbing the pier
    const wk = p.streak ? 1.2 : 6, wx = p.vx + (p.spin ? Math.sin(p.t * 6) * 0.3 : 0) + WIND.x * ST.gust * wk, wz = p.vz + WIND.y * ST.gust * wk, vy = p.vy * (p.streak ? 1 : 1 - 0.9 * Math.min(1, ST.gust * 1.6));
    p.s.position.x += wx * dt; p.s.position.y += vy * dt; p.s.position.z += wz * dt;
    p.s.material.opacity = smooth(p.life, p.life * 0.6, p.t) * (p.op ?? 1);
    if (p.streak) {   // spray streaks lie along their projected velocity (perspective included), so they read as rising jets
      _sa.copy(p.s.position).project(camera); _sb.set(wx, vy, wz).multiplyScalar(0.05).add(p.s.position).project(camera);
      p.s.material.rotation = Math.atan2(-(_sb.x - _sa.x) * camera.aspect, _sb.y - _sa.y);
    }
    if (p.t > p.life) { scene.remove(p.s); p.s.material.dispose(); parts.splice(i, 1); }
  }
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i]; r.t += dt; if (r.t < 0) continue;
    const k = r.t / r.life; r.r.scale.setScalar(0.1 + k * 1.3 * r.sc); r.r.material.opacity = 0.75 * (1 - k) * smooth(0, 0.1, r.t);
    if (r.t > r.life) { scene.remove(r.r); r.r.material.dispose(); ripples.splice(i, 1); }
  }
}
