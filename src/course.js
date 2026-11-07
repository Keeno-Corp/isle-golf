import './shared.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { fbm, lerp, smooth } from './util.js';
// ---------------------------------------------------------------- island layout (metres; +z toward the diorama camera, -z is the hill at the back)
// The island is regrown as a nine-hole links course: tees, mown fairways, greens with a gentle tilt, sand pots, the pond as the
// water hazard, the cliff lip as out of bounds. 1 world unit = 12 yards in the HUD.
export const YD = 12;
export const SPREAD = 1.2;    // owner: more room between holes and props. Every hand-placed x/z below is scaled by this; sizes are not
const SP = v => v * SPREAD;
export const FIELD_H = 4.4;
export const ISLE_A = 28.5 * SPREAD, ISLE_B = 19 * SPREAD;
export const ellR = th => ISLE_A * ISLE_B / Math.hypot(ISLE_B * Math.cos(th), ISLE_A * Math.sin(th));
export const edgeR = th => ellR(th) * (1 + 0.5 / 14 * (1.6 * Math.sin(2 * th + 1.8) + 0.9 * Math.sin(3 * th + 2.1) + 0.5 * Math.sin(5 * th + 0.3) + 0.3 * Math.sin(9 * th + 1.3)
  + 0.9 * Math.sin(4 * th + 0.6) + 0.6 * Math.sin(7 * th + 2.4)));   // bays and headlands
export const inland = (x, z) => edgeR(Math.atan2(z, x)) - Math.hypot(x, z);   // metres inside the cliff edge (negative: out at sea)
export const landIn = inland;
export const HOUSE = { x: SP(-9.5), z: SP(-13.2), w: 3.0, d: 2.0 };
export const POND = { x: SP(-20.4), z: SP(2.4), r: 2.6 };
export const COW = { x: SP(-19.0), z: SP(10.6), yaw: 2.3 };   // the cow grazes south of the pond, watching the play
export const BELL = { x: SP(3.0), z: SP(-15.4) };
export const HILL = { x: SP(2.6), z: SP(-15.0) };
export const LH_TH = -0.42, LH_R = edgeR(LH_TH) - 2.3;
export const LH = { x: Math.cos(LH_TH) * LH_R, z: Math.sin(LH_TH) * LH_R, r: 0.72 }, LH_COT = { x: SP(25.4), z: SP(-4.6), w: 2.6, d: 1.3 };
// the nine holes: tee, the fairway's centre line (tee to green), its half width, the green (radius, tilt as rise per metre), the pin's offset on the green, sand pots [x, z, rx, rz, turn]
export const HOLES = [
  { name: 'Pebble Step', par: 3, hw: 1.3, path: [[-10.7, 12.8], [-7, 13.0], [-2.2, 12.4]], green: { r: 2.1, sx: 0.035, sz: -0.03 }, pin: [0.5, -0.45], bunkers: [[-3.9, 11.0, 0.9, 0.6, 0.3], [-0.1, 14.0, 0.85, 0.55, -0.2]], wind: [2.0, 40] },
  { name: 'Gorse Run', par: 3, hw: 1.3, path: [[3.15, 13.8], [7, 12.8], [12.2, 11.2]], green: { r: 2.2, sx: -0.04, sz: 0.02 }, pin: [-0.5, 0.5], bunkers: [[10.0, 12.9, 0.9, 0.6, 0.0], [13.9, 10.0, 0.8, 0.6, 0.5]], wind: [3.5, 200] },
  { name: 'Bluff Edge', par: 3, hw: 1.25, path: [[17.1, 7.7], [19.6, 4.9], [22.6, 0.8]], green: { r: 2.1, sx: 0.05, sz: 0.01 }, pin: [-0.4, -0.5], bunkers: [[24.6, 2.1, 0.8, 0.6, 0.8], [20.6, -0.8, 0.75, 0.55, 0.2]], wind: [6.0, 90] },
  { name: 'Lantern Road', par: 4, hw: 1.5, path: [[21.4, -2.4], [16.0, -4.4], [10.2, -6.4], [4.8, -9.0]], green: { r: 2.3, sx: -0.03, sz: 0.04 }, pin: [0.6, 0.4], bunkers: [[11.6, -8.5, 1.1, 0.7, 0.4], [3.0, -7.3, 0.9, 0.6, 0.2], [6.9, -10.5, 0.8, 0.55, 0.0]], wind: [4.0, 300] },
  { name: 'Chimney Turn', par: 4, hw: 1.5, path: [[0.8, -9.6], [-6.0, -8.9], [-12.7, -8.35], [-16.8, -7.8], [-18.2, -8.2], [-17.6, -11.3]], green: { r: 2.3, sx: 0.04, sz: 0.03 }, pin: [-0.5, 0.5], bunkers: [[-12.3, -6.4, 1.1, 0.7, 0.2], [-16.6, -13.6, 0.9, 0.6, 0.5], [-19.9, -10.3, 0.8, 0.55, 0.0]], wind: [5.0, 20] },
  { name: 'Duck Pond Bend', par: 4, hw: 1.5, path: [[-24.2, -3.6], [-18.4, -3.2], [-15.2, 0.5], [-14.6, 4.4], [-14.3, 6.6]], green: { r: 2.2, sx: -0.05, sz: 0.02 }, pin: [0.5, -0.4], bunkers: [[-12.0, 6.2, 0.9, 0.6, 0.0], [-16.6, 9.1, 0.85, 0.55, 0.3]], wind: [3.0, 150] },
  { name: 'Mid Meadow', par: 4, hw: 1.5, path: [[-9.55, 6.5], [-4.0, 6.9], [2.8, 6.5], [4.9, 7.9]], green: { r: 2.2, sx: 0.03, sz: -0.05 }, pin: [0.4, 0.5], bunkers: [[-1.0, 8.7, 1.2, 0.7, 0.2], [5.6, 8.5, 1.0, 0.6, 0.4], [9.0, 10.3, 0.8, 0.6, 0.0]], wind: [4.5, 260] },
  { name: 'Bell Hill Back', par: 4, hw: 1.5, path: [[6.6, -1.4], [2.0, -1.9], [-2.0, -2.3], [-5.9, -2.8]], green: { r: 2.2, sx: -0.04, sz: -0.03 }, pin: [-0.4, 0.5], bunkers: [[2.0, -0.2, 1.0, 0.6, 0.1], [-4.4, -4.6, 0.9, 0.6, 0.4], [-8.0, -1.6, 0.8, 0.55, 0.0]], wind: [6.5, 120] },
  { name: 'Lighthouse Home', par: 5, hw: 1.6, path: [[-14.0, -0.6], [-5.5, 1.5], [3.5, 3.2], [14.3, 5.7], [17.0, 1.8], [17.3, -4.2], [17.3, -8.6]], green: { r: 2.4, sx: 0.045, sz: 0.035 }, pin: [0.6, -0.5], bunkers: [[3.9, 6.3, 1.1, 0.65, 0.2], [11.6, 8.0, 1.0, 0.6, 0.5], [15.2, -6.5, 0.9, 0.6, 0.3], [19.4, -7.1, 0.8, 0.6, 0.0]], wind: [5.5, 70] },
];
for (const H of HOLES) { H.path = H.path.map(([x, z]) => [SP(x), SP(z)]); H.bunkers = H.bunkers.map(b => [SP(b[0]), SP(b[1]), ...b.slice(2)]); }
export const BUNKERS = [];
// no sand in a perfect drive's landing zone: the drive aims at the fairway point 13.6 along (the auto-aim rule) and runs out to about 26 along that ray,
// the approach is the straight tee-to-pin line; any pot within its radius + 1 of those rays is slid sideways, away from the ray
const rayClear = (H, ax, az) => {
  const rays = [[H.tee[0], H.tee[1], ax, az, 9, Math.min(27, H.len + 1)], [H.tee[0], H.tee[1], H.pinX - H.tee[0], H.pinZ - H.tee[1], 9, H.len - 1.2]];
  for (const b of H.bunkers) for (const [ox, oz, dx, dz, a0, a1] of rays) {
    const L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L; let t = (b[0] - ox) * ux + (b[1] - oz) * uz; if (t < a0 - 1 || t > a1 + 1) continue;
    let px = (b[0] - ox) - t * ux, pz = (b[1] - oz) - t * uz, d = Math.hypot(px, pz), need = b[2] + 1.15; if (d >= need) continue;
    const sg = d < 0.05 ? 1 : 1 / d; let nx = -uz * (px * -uz + pz * ux >= 0 ? 1 : -1), nz = ux * (px * -uz + pz * ux >= 0 ? 1 : -1);
    b[0] = ox + t * ux + nx * need; b[1] = oz + t * uz + nz * need;
  }
};
HOLES.forEach((H, i) => {
  H.i = i; H.tee = H.path[0]; H.green.x = H.path[H.path.length - 1][0]; H.green.z = H.path[H.path.length - 1][1];
  H.pinX = H.green.x + H.pin[0]; H.pinZ = H.green.z + H.pin[1];
  const curve = new THREE.CatmullRomCurve3(H.path.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
  const sp = curve.getSpacedPoints(Math.ceil(curve.getLength() / 0.3));
  H.samp = sp.map((p, k) => [p.x, p.z, k / (sp.length - 1)]);
  H.len = Math.hypot(H.pinX - H.tee[0], H.pinZ - H.tee[1]); H.yards = Math.round(H.len * YD);
  const f = H.path[1]; H.teeYaw = Math.atan2(f[1] - H.tee[1], f[0] - H.tee[0]);
  // each hole's breeze runs mostly along the line of play (tail on odd holes, head on even) with a light cross-wind, so a perfect drive stays on the fairway
  H.wind = [[2, 3, 3.5, 3, 3, 2.5, 3, 3.5, 3][i], ((H.teeYaw * 180 / Math.PI) + (i % 2 ? 180 : 0) + (i % 3 === 0 ? 22 : -22) + 360) % 360];
  let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9; for (const [x, z] of H.samp) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  { let ax = H.pinX - H.tee[0], az = H.pinZ - H.tee[1]; if (H.len > 13.3) { let run = 0; for (let k = 1; k < H.samp.length; k++) { run += Math.hypot(H.samp[k][0] - H.samp[k - 1][0], H.samp[k][1] - H.samp[k - 1][1]); if (run > 13.6) { ax = H.samp[k][0] - H.tee[0]; az = H.samp[k][1] - H.tee[1]; break; } } } for (let pass = 0; pass < 3; pass++) { rayClear(H, ax, az); for (const b of H.bunkers) { const gx = b[0] - H.green.x, gz = b[1] - H.green.z, gd = Math.hypot(gx, gz), want = H.green.r + b[2] + 0.45; if (gd < want) { b[0] = H.green.x + gx / gd * want; b[1] = H.green.z + gz / gd * want; } } } }
  // holes 2 and 3 (Gorse Run, Bluff Edge): a sand carry on the tee-to-pin line, added after the clearing above so it stays on the line (a flown ball clears it, a short one is in it)
  if (i === 1 || i === 2) { const L = H.len, ux = (H.pinX - H.tee[0]) / L, uz = (H.pinZ - H.tee[1]) / L; H.bunkers.push([H.tee[0] + ux * L * 0.5, H.tee[1] + uz * L * 0.5, 1.05, 0.75, Math.atan2(uz, ux) + 1.57]); }
  H.bb = [x0 - H.hw * 1.8 - 1, z0 - H.hw * 1.8 - 1, x1 + H.hw * 1.8 + 1, z1 + H.hw * 1.8 + 1];
  H.bunkers.forEach(b => { for (let k = 0; k < 20 && inland(b[0], b[1]) < 3.2; k++) { b[0] *= 0.985; b[1] *= 0.985; } });   // keep sand off the cliff lip
  H.bunkers.forEach(b => BUNKERS.push({ x: b[0], z: b[1], rx: b[2], rz: b[3], rot: b[4], hole: i }));
});
// signed metres outside the mown ground of the holes (negative inside); `kind` says which part is nearest
export function mownSigned(x, z) {
  let m = 99;
  for (const H of HOLES) {
    if (x < H.bb[0] || x > H.bb[2] || z < H.bb[1] || z > H.bb[3]) continue;
    let d = 1e9, tt = 0; for (const s of H.samp) { const q = (s[0] - x) ** 2 + (s[1] - z) ** 2; if (q < d) { d = q; tt = s[2]; } }
    const edge = H.hw * (0.9 + 0.3 * Math.sin(tt * Math.PI) + 0.22 * (fbm(x * 0.7 + H.i * 5, z * 0.7) - 0.5) * 2);
    m = Math.min(m, Math.sqrt(d) - edge);
    const g = H.green, ga = Math.atan2(z - g.z, x - g.x), gr = g.r * (1 + 0.09 * Math.sin(3 * ga + H.i) + 0.05 * Math.sin(5 * ga + 2 * H.i));
    m = Math.min(m, Math.hypot(x - g.x, z - g.z) - gr - 0.55);
    const c = Math.cos(H.teeYaw), s2 = Math.sin(H.teeYaw), u = (x - H.tee[0]) * c + (z - H.tee[1]) * s2, v = -(x - H.tee[0]) * s2 + (z - H.tee[1]) * c;
    m = Math.min(m, Math.max(Math.abs(u) - 0.95, Math.abs(v) - 0.65));
  }
  return m;
}
export const outFlat = (x, z) => Math.max(0, mownSigned(x, z));   // metres outside the mown ground (0 inside it)
export function greenOf(x, z) {
  for (const H of HOLES) { const g = H.green; if (Math.abs(x - g.x) > g.r + 0.6 || Math.abs(z - g.z) > g.r + 0.6) continue;
    const ga = Math.atan2(z - g.z, x - g.x), gr = g.r * (1 + 0.09 * Math.sin(3 * ga + H.i) + 0.05 * Math.sin(5 * ga + 2 * H.i)); if (Math.hypot(x - g.x, z - g.z) < gr) return H; }
  return null;
}
export function bunkerQ(b, x, z) { const c = Math.cos(b.rot), s = Math.sin(b.rot), dx = x - b.x, dz = z - b.z; return Math.hypot((dx * c + dz * s) / b.rx, (-dx * s + dz * c) / b.rz); }
export function surfaceAt(x, z) {
  if (Math.hypot(x - POND.x, z - POND.z) < POND.r - 0.05) return 'water';
  if (inland(x, z) < 0.35) return 'ob';
  for (const b of BUNKERS) if (Math.abs(x - b.x) < b.rx + 0.3 && Math.abs(z - b.z) < b.rx + 0.3 && bunkerQ(b, x, z) < 1) return 'sand';
  if (greenOf(x, z)) return 'green';
  return mownSigned(x, z) < 0 ? 'fairway' : 'rough';
}
export const TREES0 = [
  { x: -13.4, z: -11.0, s: 1.1 }, { x: -6.5, z: -12.0, s: 1.0 }, { x: -21.0, z: -8.0, s: 1.1 }, { x: -24.6, z: -9.0, s: 0.9 }, { x: -4.6, z: -12.6, s: 1.05 },
  { x: 7.8, z: -12.6, s: 1.0 }, { x: 12.8, z: -11.4, s: 1.1 }, { x: 13.4, z: -9.6, s: 0.85 }, { x: 0.4, z: -5.4, s: 0.9 }, { x: -15.0, z: -6.0, s: 0.95 },
  { x: -26.4, z: 2.0, s: 0.9 }, { x: -25.0, z: 8.0, s: 0.85 }, { x: -22.0, z: 9.4, s: 0.9 }, { x: -11.0, z: 9.8, s: 0.95, apple: true }, { x: 3.6, z: 9.8, s: 1.0 },
  { x: 24.8, z: 7.0, s: 0.85 }, { x: 25.8, z: -0.8, s: 0.8 }, { x: 19.4, z: 11.2, s: 0.9 }, { x: -6.0, z: 4.4, s: 0.9 },
  { x: 20.0, z: -5.2, s: 0.8 }, { x: -2.0, z: 16.0, s: 0.85 }, { x: -9.0, z: 15.4, s: 0.8 }, { x: -17.5, z: 13.0, s: 0.8 }, { x: 13.0, z: 14.6, s: 0.8 },
];
TREES0.forEach(t => { t.x = SP(t.x); t.z = SP(t.z); });
export const TREES = TREES0.filter(t => mownSigned(t.x, t.z) > 1.0 && inland(t.x, t.z) > 1.4 && Math.hypot(t.x - POND.x, t.z - POND.z) > POND.r + 0.9);
export const FLOWERS = [{ x: SP(4.8), z: SP(15.0), r: 1.4 }, { x: SP(-22.8), z: SP(-5.8), r: 1.3 }, { x: SP(-1.6), z: SP(-12.4), r: 1.3 }];
export const flatHouse = { x: HOUSE.x, z: HOUSE.z, r: 2.6 };

export function topH(x, z) {
  return 4.4 + 2.1 * Math.exp(-((x - HILL.x) ** 2 + (z - HILL.z) ** 2) / 30) + 0.9 * Math.exp(-((x + SP(20)) ** 2 + (z + SP(8)) ** 2) / 18)
    - 0.4 * Math.exp(-((x - SP(8)) ** 2 + (z - SP(13)) ** 2) / 40) + 0.5 * (fbm(x * 0.17 + 4, z * 0.17) - 0.45)
    + 1.3 * Math.exp(-((x - LH.x) ** 2 + (z - LH.z) ** 2) / 16);   // the lighthouse headland
}
HOLES.forEach(H => { H.green.h = topH(H.green.x, H.green.z) + 0.02; H.teeH = topH(H.tee[0], H.tee[1]) + 0.03; });
export const H_HOUSE = topH(HOUSE.x, HOUSE.z), H_POND = topH(POND.x, POND.z) - 0.18, H_LH = topH(LH.x, LH.z), H_COT = topH(LH_COT.x, LH_COT.z);
// greens: flat plates with a planar tilt (the putting break), tees: level boxes, bunkers: shallow dips
export function courseH(x, z, h) {
  for (const H of HOLES) {
    const g = H.green, dx = x - g.x, dz = z - g.z, R = g.r + 1.4;
    if (Math.abs(dx) < R && Math.abs(dz) < R) { const d = Math.hypot(dx, dz); if (d < R) h = lerp(h, g.h + g.sx * dx + g.sz * dz, smooth(R, g.r + 0.15, d)); }
    const tx = x - H.tee[0], tz = z - H.tee[1]; if (Math.abs(tx) < 2.1 && Math.abs(tz) < 2.1) h = lerp(h, H.teeH, smooth(2.0, 0.9, Math.hypot(tx, tz)));
  }
  for (const b of BUNKERS) { if (Math.abs(x - b.x) > b.rx + 0.8 || Math.abs(z - b.z) > b.rx + 0.8) continue; h -= 0.12 * smooth(1.2, 0.55, bunkerQ(b, x, z)); }
  return h;
}
export function heightAt(x, z) {
  if (x * x + z * z > 40 * 40) return -2.4;
  const e = inland(x, z);
  let h = topH(x, z);
  h = lerp(h, H_HOUSE, smooth(flatHouse.r + 1.2, flatHouse.r, Math.hypot(x - flatHouse.x, z - flatHouse.z)));
  h = lerp(h, H_LH, smooth(2.0, 1.1, Math.hypot(x - LH.x, z - LH.z)));
  h = lerp(h, H_COT, smooth(2.4, 1.5, Math.hypot(x - LH_COT.x, z - LH_COT.z)));
  const dp = Math.hypot(x - POND.x, z - POND.z);
  h = lerp(h, H_POND + 0.15, smooth(POND.r + 1.4, POND.r + 0.2, dp)) - 0.6 * smooth(POND.r + 0.15, POND.r - 0.9, dp);
  h = courseH(x, z, h);
  const k = smooth(-0.4, 0.95, e);                                                     // steep: the cliffFace mesh stands just outside
  const lip = 0.6 * smooth(3.0, 1.2, e) * k;                                          // the grass rolls over the cliff lip
  const rough = (fbm(x * 0.8 + 7.3, z * 0.8 - 2.1) - 0.47) * 0.5 * (1 - Math.abs(k * 2 - 1)) + (fbm(x * 2.3, z * 2.3) - 0.47) * 1.2 * (1 - k) * smooth(-3, -0.5, e);
  return lerp(-2.4, h - lip, k) + rough;
}
// the course painted into the island's vertex colours: mown stripes on the fairways, fine greens, pale sand with a darker lip
export const COURSE_C = { fair: new THREE.Color('#5d8a3a'), fairB: new THREE.Color('#6b9743'), fringe: new THREE.Color('#5c8838'), green: new THREE.Color('#76a64a'), greenB: new THREE.Color('#82b052'), tee: new THREE.Color('#86ae56'), sand: new THREE.Color('#dcc78d'), sandD: new THREE.Color('#c4aa6e'), lip: new THREE.Color('#4f6f31') };
// smooth mowing term for the ground shader: [stripe 0..1, mown weight, 1 on a green]
export function stripeAt(x, z) {
  const m = mownSigned(x, z); if (m >= 0.5) return [0.5, 0, 0];
  let H = null, dBest = 1e9; for (const h of HOLES) { if (x < h.bb[0] || x > h.bb[2] || z < h.bb[1] || z > h.bb[3]) continue; const d = Math.hypot(x - h.green.x, z - h.green.z); if (d < dBest) { dBest = d; H = h; } }
  const ang = H ? H.teeYaw : 0, n = fbm(x * 1.3 + 2, z * 1.3), w = smooth(0.5, -0.12, m);
  if (greenOf(x, z)) return [0.5 + 0.5 * Math.sin((x + z * 0.4) * 5.2), w, 1];
  return [0.5 + 0.5 * Math.sin((x * -Math.sin(ang) + z * Math.cos(ang)) * 3.1 + (n - 0.5) * 0.6), w, 0];
}
export function courseColour(x, z, c) {
  const m = mownSigned(x, z), n = fbm(x * 1.3 + 2, z * 1.3);
  if (m < 0.5) {
    let H = null, dBest = 1e9; for (const h of HOLES) { if (x < h.bb[0] || x > h.bb[2] || z < h.bb[1] || z > h.bb[3]) continue; const d = Math.hypot(x - h.green.x, z - h.green.z); if (d < dBest) { dBest = d; H = h; } }
    const ang = H ? H.teeYaw : 0, stripe = 0.5;   // the mowing stripes are baked into a smooth texture (island.js), not vertex colours
    const col = COURSE_C.fair.clone().lerp(COURSE_C.fairB, 0.45);
    const gH = greenOf(x, z), teeNear = HOLES.some(h => { const cc = Math.cos(h.teeYaw), s2 = Math.sin(h.teeYaw), u = (x - h.tee[0]) * cc + (z - h.tee[1]) * s2, v = -(x - h.tee[0]) * s2 + (z - h.tee[1]) * cc; return Math.abs(u) < 0.95 && Math.abs(v) < 0.65; });
    if (H && dBest < H.green.r + 0.62) col.lerp(COURSE_C.fringe, 0.7);
    if (gH) col.copy(COURSE_C.green).lerp(COURSE_C.greenB, 0.3);
    if (teeNear) col.copy(COURSE_C.tee).lerp(COURSE_C.greenB, 0.3 + 0.2 * n);
    col.multiplyScalar(0.94 + 0.12 * n);
    c.lerp(col, smooth(0.5, -0.12, m) * 0.97);
  }
  for (const b of BUNKERS) { if (Math.abs(x - b.x) > b.rx + 0.9 || Math.abs(z - b.z) > b.rx + 0.9) continue; const q = bunkerQ(b, x, z);
    if (q < 1.45) { const sand = COURSE_C.sand.clone().lerp(COURSE_C.sandD, smooth(0.5, 1.0, q) * 0.7 + (n - 0.5) * 0.3); c.lerp(COURSE_C.lip, smooth(1.45, 1.1, q) * smooth(0.95, 1.15, q) * 0.5); c.lerp(sand, smooth(1.08, 0.92, q)); } }
}
