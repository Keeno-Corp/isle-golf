import './post.js';   // load order: each file runs after the one before it (COORDINATION.md)
import * as THREE from 'three';
import { ST } from './shared.js';
// ================================================================ ISLE GOLF
// ---------------------------------------------------------------- world state shared with the island's own effects
export const WIND = new THREE.Vector2(1, 0.35).normalize();
export const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpV3 = new THREE.Vector3();
export const _cm = new THREE.Object3D();
export const pick = a => a[(Math.random() * a.length) | 0];
export const r3 = v => +(+v).toFixed(3);
export const KITS = [
  { name: 'ISLA', col: '#d8503a', cap: '#f0e6c6', pants: '#e6dcc0', ball: '#ffffff' },
  { name: 'FINN', col: '#3b78c9', cap: '#f0e6c6', pants: '#e6dcc0', ball: '#ffffff' },
  { name: 'MOSS', col: '#e5b72c', cap: '#2f4a3a', pants: '#e6dcc0', ball: '#ffffff' },
  { name: 'WREN', col: '#c75a9a', cap: '#f0e6c6', pants: '#e6dcc0', ball: '#ffffff' },
];
export const CLUBS = [
  { id: 'driver', name: 'DRIVER', carry: 17, loft: 0.36, land: 0.6, power: 1 },
  { id: 'iron', name: 'IRON', carry: 11, loft: 0.52, land: 0.38, power: 1 },
  { id: 'wedge', name: 'WEDGE', carry: 6.2, loft: 0.82, land: 0.3, power: 1 },
  { id: 'putter', name: 'PUTTER', carry: 0, loft: 0, land: 1, power: 1, putt: 9.5 },
];
export const GR = 7.0, BR = 0.07;
export const SURF = {
  fairway: { e: 0.42, t: 0.62, roll: 3.1, ks: 0.5 }, rough: { e: 0.14, t: 0.4, roll: 10, ks: 0.3 }, sand: { e: 0.0, t: 0.08, roll: 26, ks: 0.15 },
  green: { e: 0.3, t: 0.95, roll: 2.4, ks: 2.4 },
};
SURF.tee = SURF.fairway;
export const kindOf = s => s === 'sand' ? 'sand' : s;
export const LIE = { fairway: 1, tee: 1, green: 1, rough: 0.78, sand: 0.6, ob: 1, water: 1 };
