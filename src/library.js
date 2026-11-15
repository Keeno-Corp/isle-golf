// Made with paprika3d · https://paprika3d.com
import './sheep.js';   // load order: after the island, the colliders and the code-built sheep it replaces
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { hash } from './util.js';
import { ST, addUpdate } from './shared.js';
import { HOLES, HOUSE, LH, edgeR, heightAt, inland, mownSigned, surfaceAt } from './course.js';
import { scene } from './stage.js';
import { modelCopy as copy0, sheepGLB, treeA, treeB, lhGLB, stoneGLB, benchGLB, boatGLB, cottageGLB } from './assets.js';
import { LH_TOP, clearOf, house, lighthouse, sea, treeObjs } from './island.js';
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
