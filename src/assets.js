import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

// models from the paprika3d library (assets/CREDITS.md): the mallards, the cow (the ducklings were cut: 2 px tall behind the sedge from every camera)
export const gltfL = new GLTFLoader(); gltfL.setMeshoptDecoder(MeshoptDecoder);
export const playerP = gltfL.loadAsync('assets/player-anim.glb');
export const [duckGLB, cowGLB] = await Promise.all(['duck-1ef909', 'vaca-2-771611'].map(f => gltfL.loadAsync('./assets/' + f + '.glb')));
// the pond birds are a hand's height on screen: their 1024 px colour maps go down to 256 px and every other map (normal, roughness, AO, specular) is dropped (they cost 32 MB of GPU memory for detail no viewer sees)
export function shrinkMaps(glb, size) {
  glb.scene.traverse(o => { if (!o.isMesh) return; for (const m of [].concat(o.material)) {
    for (const k of Object.keys(m)) if (k !== 'map' && m[k] && m[k].isTexture) { m[k].dispose(); m[k] = null; }
    const t = m.map; if (t && t.image && t.image.width > size && !t.userData.shrunk) { const c = document.createElement('canvas'); c.width = c.height = size; c.getContext('2d').drawImage(t.image, 0, 0, size, size); t.image = c; t.userData.shrunk = true; t.needsUpdate = true; }
    m.needsUpdate = true; } });
}
shrinkMaps(duckGLB, 256);
// a loaded model's origin to the centre of its feet, after its scale is set
export function centreFloor(o) { o.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(o, true); o.position.x -= (b.min.x + b.max.x) / 2; o.position.y -= b.min.y; o.position.z -= (b.min.z + b.max.z) / 2; }
// a static model copy at a height, its origin at the feet, inside a group so it can be turned freely
export function modelCopy(glb, height, name) { const m = glb.scene.clone(true); const b0 = new THREE.Box3().setFromObject(glb.scene); m.scale.setScalar(height / (b0.max.y - b0.min.y)); centreFloor(m); const g = new THREE.Group(); g.name = name; g.add(m); m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; }
