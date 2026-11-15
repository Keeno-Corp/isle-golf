// Made with paprika3d · https://paprika3d.com
import './sheep.js';   // load order: after the island, the colliders and the code-built sheep it replaces
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { hash } from './util.js';
import { ST, addUpdate } from './shared.js';
import { HOLES, HOUSE, LH, POND, edgeR, heightAt, inland, mownSigned, surfaceAt } from './course.js';
import { scene } from './stage.js';
import { modelCopy as copy0, sheepGLB, treeA, treeB, lhGLB, stoneGLB, benchGLB, boatGLB, cottageGLB, bushGLB, hydrangeaGLB, signGLB, cattailGLB, fenceGLB, rockGLB, flagGLB, keeperGLB } from './assets.js';
import { FLAG, flagMat, flagWhite } from './pins.js';
import { BUSHES, LH_TOP, rails, clearOf, house, lhCottage, lighthouse, pond, sea, treeObjs } from './island.js';
import { ROUND } from './physics.js';
import { chimneyTop } from './effects.js';
import { sheep } from './sheep.js';

// ---------------------------------------------------------------- models from the paprika3d library (assets/CREDITS.md) in place of the code-built stand-ins
// a model copy whose meshes carry the given name, so the look lists them and the camera's occluder dither (camera.js, by name) finds them
const modelCopy = (glb, h, name) => { const g = copy0(glb, h, name); g.traverse(o => { if (o.isMesh) o.name = name; }); return g; };
// one geometry out of a model: quantized attributes to floats, each mesh's place baked in, its material colour as a vertex colour (for an InstancedMesh)
function flat(glb, scale) {
  glb.scene.updateMatrixWorld(true); const gs = [];
  glb.scene.traverse(o => { if (!o.isMesh) return;
    const g = new THREE.BufferGeometry(), src = o.geometry;
    for (const k of ['position', 'normal']) { const a = src.attributes[k]; g.setAttribute(k, new THREE.BufferAttribute(Float32Array.from({ length: a.count * 3 }, (_, i) => a.getComponent(i / 3 | 0, i % 3)), 3)); }
    if (src.index) g.setIndex(Array.from(src.index.array));
    g.applyMatrix4(o.matrixWorld); const c = o.material.color, n = g.attributes.position.count, col = new Float32Array(n * 3); for (let i = 0; i < n; i++) c.toArray(col, i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); gs.push(g.toNonIndexed()); });
  const m = mergeGeometries(gs); m.computeBoundingBox(); const b = m.boundingBox;
  m.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2).scale(scale, scale, scale); m.computeVertexNormals(); return m;
}

// sheep: the library's sheep (its head toward +z, as the code sheep's was), 0.55 long; the flock stays one instanced draw
{ const g = flat(sheepGLB, 0.55 / 224.8); sheep.inst.geometry.dispose(); sheep.inst.geometry = g; }

// trees: two library trees by turns under each crown group (the crown still shakes when a ball hits it)
treeObjs.forEach((t, i) => {
  for (const c of [...t.crown.children]) { c.removeFromParent(); }
  const m = modelCopy(i % 3 === 1 ? treeB : treeA, (i % 3 === 1 ? 3.5 : 3.2) * t.s, t.g.name + '_leaves0'); m.rotation.y = hash(i, 7) * 6.28; t.crown.add(m);
});

// the lighthouse: the library's red and white tower over the code tower's foot; the code lamp, beams and collider stay where they were
{ for (const c of lighthouse.children) c.visible = false;
  // the model stands on a wide blue disc (its own sea): the triangles out past the tower's foot and near the ground are dropped
  lhGLB.scene.updateMatrixWorld(true); const v = new THREE.Vector3();
  lhGLB.scene.traverse(o => { if (!o.isMesh || !o.geometry.index) return; const p = o.geometry.attributes.position, ix = o.geometry.index.array, keep = [];
    const out = i => { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); return v.y < 1.2 && Math.hypot(v.x, v.z) > 4.4; };
    for (let i = 0; i < ix.length; i += 3) if (!(out(ix[i]) || out(ix[i + 1]) || out(ix[i + 2]))) keep.push(ix[i], ix[i + 1], ix[i + 2]);
    o.geometry.setIndex(keep); });
  const m = modelCopy(lhGLB, LH_TOP + 2.1, 'lighthouse_tower'); lighthouse.add(m); }

// the house on hole 5: the library cottage inside the code house's collision box
{ for (const c of house.children) c.visible = false;
  const m = modelCopy(cottageGLB, 3.6, 'house_walls'); house.add(m);
  // the chimney smoke rises from the model's highest point
  house.updateMatrixWorld(true); const v = new THREE.Vector3(); let top = -1e9;
  m.traverse(o => { if (!o.isMesh) return; const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); if (v.y > top) { top = v.y; chimneyTop.copy(v); } } }); }

// the lighthouse keeper's cottage: the library's blue-roofed house over the code cottage's footprint (its collider stays)
{ for (const c of lhCottage.children) c.visible = false;
  const m = modelCopy(keeperGLB, 4.8, 'lighthouse_cottage'); m.position.y = -0.06; lhCottage.add(m); }   // 4.8 tall: its door 1.0, above the 0.85 golfer

// standing stones in the deep rough (each a round collider), a bench by every tee, two rowing boats off the cliffs
export const stones = [];
for (let i = 0, n = 0; i < 400 && n < 16; i++) {
  const a = hash(i, 3) * 6.283, r = Math.sqrt(hash(i, 5)) * 30, x = Math.cos(a) * r * 1.25, z = Math.sin(a) * r * 0.85;
  if (inland(x, z) < 1.6 || mownSigned(x, z) < 1.6 || !clearOf(x, z) || surfaceAt(x, z) !== 'rough' || Math.hypot(x - LH.x, z - LH.z) < 3 || Math.hypot(x - HOUSE.x, z - HOUSE.z) < 4) continue;
  if (stones.some(s => Math.hypot(s.x - x, s.z - z) < 5) || treeObjs.some(t => Math.hypot(t.x - x, t.z - z) < 2)) continue;
  const s = 0.45 + hash(i, 9) * 0.4, m = modelCopy(stoneGLB, s, 'standingStone'); m.position.set(x, heightAt(x, z) - 0.04, z); m.rotation.y = hash(i, 11) * 6.28; scene.add(m);
  stones.push({ x, z }); ROUND.push({ name: 'stone', x, z, r: s * 0.5, top: heightAt(x, z) + s }); n++;
}
HOLES.forEach((H, i) => {
  const [tx, tz] = H.tee, [nx, nz] = H.path[1], d = Math.hypot(nx - tx, nz - tz), fx = (nx - tx) / d, fz = (nz - tz) / d;
  for (const side of [1, -1]) {   // behind and beside the tee, on whichever side is rough
    const x = tx - fx * 1.0 + -fz * side * 1.7, z = tz - fz * 1.0 + fx * side * 1.7;
    if (surfaceAt(x, z) !== 'rough' || inland(x, z) < 0.9) continue;
    const m = modelCopy(benchGLB, 0.42, 'teeBench'); m.position.set(x, heightAt(x, z) - 0.02, z); m.rotation.y = Math.atan2(tx - x, tz - z); scene.add(m);
    ROUND.push({ name: 'bench', x, z, r: 0.4, top: heightAt(x, z) + 0.45 }); break;
  }
});
export const boats = [1.25, 2.75].map((th, i) => { const R = edgeR(th) + 4.2 + i * 1.5, m = modelCopy(boatGLB, 0.42, 'rowingBoat'); m.position.set(Math.cos(th) * R, sea.position.y, Math.sin(th) * R); m.rotation.y = th + 1.1; scene.add(m); return m; });
addUpdate(() => boats.forEach((b, i) => { const t = ST.gameTime * 0.9 + i * 2; b.position.y = sea.position.y - 0.06 + Math.sin(t) * 0.05; b.rotation.z = Math.sin(t * 0.8) * 0.07; b.rotation.x = Math.cos(t * 0.6) * 0.05; }));

// ---------------------------------------------------------------- shrubs, hole signs and cattails from the library (session 2)
// one textured geometry out of a model, one unit wide, standing on y = 0 (for an InstancedMesh that keeps the model's own material)
function unit(glb) {
  glb.scene.updateMatrixWorld(true); const gs = []; let mat = null;
  glb.scene.traverse(o => { if (!o.isMesh) return; mat = mat || o.material; const g = new THREE.BufferGeometry(), src = o.geometry;
    for (const [k, n] of [['position', 3], ['uv', 2]]) { const a = src.attributes[k]; g.setAttribute(k, new THREE.BufferAttribute(a ? Float32Array.from({ length: a.count * n }, (_, i) => a.getComponent(i / n | 0, i % n)) : new Float32Array(src.attributes.position.count * n), n)); }   // normals are recomputed below
    if (src.index) g.setIndex(Array.from(src.index.array)); gs.push(g.applyMatrix4(o.matrixWorld)); });
  const m = gs.length > 1 ? mergeGeometries(gs) : gs[0]; m.computeBoundingBox(); const b = m.boundingBox, k = 1 / Math.max(b.max.x - b.min.x, b.max.z - b.min.z);
  m.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2).scale(k, k, k); m.computeVertexNormals(); return { geo: m, mat };
}
// the 400-odd code leaf-blobs become the library's leafy bush (same places, sizes and colliders); the shrubs that carried white petal blobs become hydrangeas
{ const bushes = scene.getObjectByName('bushes'), blossoms = scene.getObjectByName('blossoms'), B = unit(bushGLB), Hy = unit(hydrangeaGLB), white = new THREE.Color(1, 1, 1), c = new THREE.Color();
  bushes.geometry.dispose(); bushes.geometry = B.geo.scale(1.2, 1.7, 1.2).translate(0, -0.16, 0); bushes.material = B.mat;
  const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  for (let i = 0; i < bushes.count; i++) { bushes.getColorAt(i, c); bushes.setColorAt(i, c.lerp(white, 0.45).multiplyScalar(1.5));   // the instance tint now multiplies the model's own painted leaves
    bushes.getMatrixAt(i, m); m.decompose(p, q, s); if (s.x < 0.7) bushes.setMatrixAt(i, m.makeScale(0, 0, 0)); }   // the small filler blobs of each code clump go: one library bush is a whole shrub (1,600 triangles each)
  const n = Math.floor(blossoms.count / 24), spots = [];
  for (let g = 0; g < n; g++) { let x = 0, z = 0; for (let k = 0; k < 24; k++) { blossoms.getMatrixAt(g * 24 + k, m); x += m.elements[12] / 24; z += m.elements[14] / 24; }
    let bi = 0, bd = 1e9; BUSHES.forEach((b, i) => { const d = Math.hypot(b.x - x, b.z - z); if (d < bd) { bd = d; bi = i; } });
    bushes.getMatrixAt(bi, m); m.decompose(p, q, s); if (s.x < 0.01) continue; spots.push([p.x, p.z, s.x, bi]); bushes.setMatrixAt(bi, m.makeScale(0, 0, 0)); }
  const hy = new THREE.InstancedMesh(Hy.geo, Hy.mat, Math.max(1, spots.length)); hy.name = 'hydrangeas'; hy.castShadow = hy.receiveShadow = true; hy.count = spots.length;
  spots.forEach(([x, z, sc, bi], i) => { p.set(x, heightAt(x, z) - 0.03, z); q.setFromAxisAngle(s.set(0, 1, 0), hash(bi, 13) * 6.28); hy.setMatrixAt(i, m.compose(p, q, s.setScalar(sc * 0.95))); hy.setColorAt(i, c.setRGB(1.0, 1.0, 0.62)); });   // the model's teal leaves pulled toward the island's warm greens
  blossoms.visible = false; bushes.instanceMatrix.needsUpdate = true; bushes.instanceColor.needsUpdate = true; scene.add(hy); }
// hole signs: the library's arrow sign in place of the code post, the hole's number board hung under the arrow
HOLES.forEach(H => { const sg = scene.getObjectByName('holeSign' + (H.i + 1)); if (!sg) return;
  sg.getObjectByName('sign_post').visible = false; sg.getObjectByName('sign_board').position.y = 0.3;
  sg.add(modelCopy(signGLB, 0.8, 'sign_arrow')); });
// cattails: the library's plant in the code clumps' places round the pond
{ for (const n of ['pond_cattailStem', 'pond_cattail', 'pond_cattailLeaf']) { const o = pond.getObjectByName(n); if (o) o.visible = false; }
  [2.5, 3.3, 0.4, 1.3, 4.4].forEach((ca, j) => { for (let i = 0; i < 3; i++) { const a = ca + (hash(j, i + 20) - 0.5) * 0.4, d = POND.r + (hash(j, i + 30) - 0.6) * 0.35, m = modelCopy(cattailGLB, 0.75 + hash(j, i + 40) * 0.4, 'pond_cattailPlant');
    m.position.set(Math.cos(a) * d, -0.03, Math.sin(a) * d); m.rotation.y = hash(j, i + 50) * 6.28; pond.add(m); } }); }

// fences: one library fence panel per code rail span (same line, same colliders in FENCE_SEGS), in place of the code posts and rails
{ for (const n of ['fencePosts', 'fenceRails']) scene.getObjectByName(n).visible = false;
  const F = unit(fenceGLB); F.geo.computeBoundingBox(); let b = F.geo.boundingBox;
  if (b.max.z - b.min.z > b.max.x - b.min.x) { F.geo.rotateY(Math.PI / 2); F.geo.computeBoundingBox(); b = F.geo.boundingBox; }   // the panel's length along +x
  const k = 0.66 / (b.max.y - b.min.y), fi = new THREE.InstancedMesh(F.geo, F.mat, rails.length); fi.name = 'fencePanels'; fi.castShadow = fi.receiveShadow = true;
  const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  rails.forEach(([x1, z1, x2, z2], i) => { const x = (x1 + x2) / 2, z = (z1 + z2) / 2; p.set(x, Math.min(heightAt(x1, z1), heightAt(x2, z2)) - 0.03, z); q.setFromAxisAngle(up, -Math.atan2(z2 - z1, x2 - x1));
    fi.setMatrixAt(i, m.compose(p, q, s.set(Math.hypot(x2 - x1, z2 - z1) * 1.02, k, k))); });
  scene.add(fi); }

// ---------------------------------------------------------------- session 8: library rocks, tee stones and flags in place of the last code meshes
// an InstancedMesh's places and tints carried onto a library geometry; the code mesh is hidden
function swapInst(name, geo, mat, tint) {
  const old = scene.getObjectByName(name), n = new THREE.InstancedMesh(geo, mat, old.count);
  n.instanceMatrix.copy(old.instanceMatrix); const c = new THREE.Color();
  for (let i = 0; i < old.count; i++) { old.getColorAt(i, c); n.setColorAt(i, c.lerp(new THREE.Color(1, 1, 1), tint)); }
  n.name = name + 'Lib'; n.castShadow = n.receiveShadow = true; n.frustumCulled = false; old.visible = false; scene.add(n); return n;
}
// the code shapes were a radius-1 icosahedron (boulders) and a 2-tall, 2-wide column (stacks), both centred on y = 0: the unit models are fitted to those boxes
{ const S = unit(stoneGLB); S.geo.computeBoundingBox(); const h = S.geo.boundingBox.max.y; S.geo.scale(2, 2 / h, 2).translate(0, -1, 0);
  swapInst('cliffRocks', S.geo, S.mat, 0.45);
  const R = unit(rockGLB); R.geo.computeBoundingBox(); const hr = R.geo.boundingBox.max.y; R.geo.scale(2.2, 2.2 / hr, 2.2).translate(0, -1, 0);   // the sandstone's own layers read as the cliff strata
  swapInst('seaStacks', R.geo, R.mat, 0.7); }
// tee markers: two small sandstone blocks (0.09 tall, ankle height on the 0.85 golfer) where the code spheres were
scene.children.filter(o => o.name === 'teeMarker').forEach((o, i) => { o.visible = false;
  const m = modelCopy(rockGLB, 0.09, 'teeStone'); m.position.set(o.position.x, o.position.y - 0.035, o.position.z); m.rotation.y = hash(i, 61) * 6.28; scene.add(m); });
// flags: the library's triangle flag; its pole and pennant are fitted to FLAG (1.1 pole, 0.3 x 0.17 pennant), the pennant keeps the wind wave (flagMat reads x / 0.3)
{ let pole = null, pen = null; flagGLB.scene.updateMatrixWorld(true);
  flagGLB.scene.traverse(o => { if (!o.isMesh) return; const a = o.geometry.attributes.position, g = new THREE.BufferGeometry();   // quantized positions to floats before the place is baked in
    g.setAttribute('position', new THREE.BufferAttribute(Float32Array.from({ length: a.count * 3 }, (_, i) => a.getComponent(i / 3 | 0, i % 3)), 3)); if (o.geometry.index) g.setIndex(Array.from(o.geometry.index.array)); g.applyMatrix4(o.matrixWorld); g.computeBoundingBox(); if (g.boundingBox.min.y < 0.01) pole = g; else pen = g; });
  pole.computeBoundingBox(); let b = pole.boundingBox; const px = (b.min.x + b.max.x) / 2, pz = (b.min.z + b.max.z) / 2, ph = b.max.y;
  pole.translate(-px, 0, -pz).scale(FLAG.poleR * 2 / (b.max.x - b.min.x), FLAG.poleH / ph, FLAG.poleR * 2 / (b.max.x - b.min.x)); pole.computeVertexNormals();
  pen.computeBoundingBox(); b = pen.boundingBox; const cy = (b.min.y + b.max.y) / 2;
  pen.translate(-b.min.x, -cy, -pz).scale(FLAG.pennantL / (b.max.x - b.min.x), FLAG.pennantH / (b.max.y - b.min.y), 1).translate(FLAG.poleR, 0, 0); pen.computeVertexNormals();
  HOLES.forEach(H => { const op = H.pinG.getObjectByName('pin_pole'), of = H.flag; op.visible = of.visible = false;
    const p = new THREE.Mesh(pole, flagWhite); p.name = 'flagPole'; p.castShadow = true; H.pinG.add(p);
    const f = new THREE.Mesh(pen, flagMat); f.name = 'flagPennant'; f.castShadow = true; f.position.copy(of.position); f.rotation.copy(of.rotation); f.scale.copy(of.scale); H.pinG.add(f); H.flag = f; }); }
