import './golfer.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { clamp } from './util.js';
import { ST } from './shared.js';
import { heightAt } from './course.js';
import { named, scene } from './stage.js';
import { BR, KITS } from './rules.js';
import { blobMat } from './golfer.js';
import { SIM } from './physics.js';
import { G, curH } from './round.js';

// ---------------------------------------------------------------- the balls (one a player), their shadows and the active ring
export const balls = KITS.map((k, i) => {
  const m = named(new THREE.Mesh(new THREE.SphereGeometry(BR, 14, 10), new THREE.MeshBasicMaterial({ color: '#fffdf4' })), 'ball' + (i + 1), true);
  m.material.toneMapped = false; m.visible = false; scene.add(m);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.17, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: k.col, transparent: true, opacity: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  ring.name = 'ballRing' + (i + 1); ring.renderOrder = 2; ring.visible = false; scene.add(ring);
  const sh = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12).rotateX(-Math.PI / 2), blobMat()); sh.name = 'ballShadow' + (i + 1); sh.renderOrder = 1; sh.visible = false; scene.add(sh);
  return { m, ring, sh };
});
export function updateBalls() {
  const act = G.players[G.turn];
  G.players.forEach((p, i) => {
    const b = balls[i], isAct = p === act, live = isAct && (G.phase === 'flight' || G.phase === 'settle'), src = live ? SIM.pos : p.pos;
    b.m.visible = G.phase !== 'title' && G.phase !== 'card' && !(p.holed && !live) && !(live && SIM.mode === 'sunk' && SIM.sunkT > 0.35);
    b.m.position.copy(src); if (!live && p.strokes === 0 && p.surf === 'tee') b.m.position.y += 0.035;
    if (live && SIM.mode === 'sunk') b.m.position.set(SIM.pos.x, curH().pinY - SIM.sunkT * 1.2 + BR, SIM.pos.z);
    const gy = heightAt(src.x, src.z); const h = Math.max(0, src.y - gy);
    b.sh.visible = b.m.visible && SIM.mode !== 'sunk'; b.sh.position.set(src.x + h * 0.15, gy + 0.025, src.z + h * 0.1); b.sh.scale.setScalar(clamp(1 - h * 0.12, 0.4, 1) * 0.9);
    b.ring.visible = b.m.visible && (G.players.length > 1 || (isAct && G.phase === 'aim')); b.ring.position.set(src.x, gy + 0.03, src.z);
    b.ring.scale.setScalar(isAct ? 1 + 0.12 * Math.sin(ST.gameTime * 6) : 0.75); b.ring.material.opacity = isAct ? 0.95 : 0.55;
  });
}
