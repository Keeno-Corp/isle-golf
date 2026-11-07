import './util.js';   // load order: each file runs after the one before it (COORDINATION.md)

// ---------------------------------------------------------------- hooks: how one part of the game plugs into another without editing it (COORDINATION.md)
export const hooks = { update: [], keys: [], actions: {}, observe: [], setState: [] };
export const addUpdate = fn => hooks.update.push(fn);                   // fn(dt) once a frame, after the HUD and before the post pass
export const addKey = fn => hooks.keys.push(fn);                        // fn(code) on a fresh keydown; return true to eat the key
export const addAction = (name, fn) => { hooks.actions[name] = fn; };   // __game.act({ action: name, ... }) calls fn(input)
export const addObserve = fn => hooks.observe.push(fn);                 // fn() returns keys merged into __game.observe()
export const addSetState = fn => hooks.setState.push(fn);               // fn(partial) on __game.setState
export const bus = {};
export const on = (evt, fn) => (bus[evt] ||= []).push(fn);
export const fire = (evt, data) => { const l = bus[evt]; if (l) for (const fn of l) fn(data); };
// the few world values more than one file writes (the day/night fade, the hit flash, the wind gust, banner timers, the lighthouse lamp)
export const ST = { gameTime: 0, dusk: 0, duskTarget: 0, flash: 0, flashHold: 0, cowWatch: 0, gust: 0, lampLit: false, lampOn: 0, beamAngle: 0.6, smokeT: 0, bannerT: 0, subT: 0 };
