import './balls.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { rand } from './util.js';
import { heightAt } from './course.js';
import { scene } from './stage.js';
import { TEX } from './effects.js';
// ---------------------------------------------------------------- small point pools: divots, sand, sparkles
export function pointPool(n, size, name, additive) {
  const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3).fill(-999), col = new Float32Array(n * 3);
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ size, map: TEX.soft, vertexColors: true, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true });
  const pts = new THREE.Points(g, m); pts.name = name; pts.frustumCulled = false; pts.renderOrder = 7; scene.add(pts);
  return { pts, pos, col, n, k: 0, p: Array.from({ length: n }, () => ({ life: 0, t: 1, vx: 0, vy: 0, vz: 0, g: 0, c: new THREE.Color() })) };
}
export const dust = pointPool(160, 0.16, 'divots', false), trail = pointPool(140, 0.4, 'ballTrail', true);
export const puffs = pointPool(60, 1.5, 'landPuffs', true);
export const puff = (x, z, n, color, r = 0.5) => { const y = heightAt(x, z) + 0.12; for (let i = 0; i < n; i++) emit(puffs, x, y, z, { life: rand(0.5, 0.9), sp: r, up: 0.5, g: -0.3, color }); };
export function emit(pool, x, y, z, o) {
  const p = pool.p[pool.k++ % pool.n]; p.t = 0; p.life = o.life; p.g = o.g ?? 9; p.c.set(o.color);
  const a = rand(0, 6.28), s = (o.sp ?? 1) * rand(0.3, 1); p.vx = Math.cos(a) * s + (o.vx || 0); p.vz = Math.sin(a) * s + (o.vz || 0); p.vy = (o.up ?? 2) * rand(0.5, 1);
  const i = (pool.k - 1) % pool.n; pool.pos[i * 3] = x; pool.pos[i * 3 + 1] = y; pool.pos[i * 3 + 2] = z;
}
export function updatePool(pool, dt) {
  for (let i = 0; i < pool.n; i++) { const p = pool.p[i]; if (p.t >= p.life) { pool.pos[i * 3 + 1] = -999; continue; }
    p.t += dt; p.vy -= p.g * dt; pool.pos[i * 3] += p.vx * dt; pool.pos[i * 3 + 1] += p.vy * dt; pool.pos[i * 3 + 2] += p.vz * dt;
    const k = 1 - p.t / p.life; pool.col[i * 3] = p.c.r * k; pool.col[i * 3 + 1] = p.c.g * k; pool.col[i * 3 + 2] = p.c.b * k; }
  pool.pts.geometry.attributes.position.needsUpdate = true; pool.pts.geometry.attributes.color.needsUpdate = true;
}
export const burst = (x, z, n, color, sp = 1.4, up = 2.2) => { const y = heightAt(x, z) + 0.05; for (let i = 0; i < n; i++) emit(dust, x, y, z, { life: rand(0.4, 0.9), sp, up, color }); };
