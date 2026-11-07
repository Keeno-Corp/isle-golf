# ball-physics lane notes
Owns src/physics.js, balls.js, rules.js, aimline.js, meter.js, pools.js (see COORDINATION.md).
## Provides
- Events: swing, ball:<land|bounce|sandHit|tree|wall|sheep|cow|water|ob|sunk|lip> (data { ball: SIM, player }).
- observe key: `physics` (incl. `minPinD`: closest ball-to-pin x/z distance while rolling this shot, 9 if none; also `SIM.minPinD`).
## Needs from others
(none yet)

## Iteration 1 (ball-physics)
- New file src/ballfx.js (imported from meter.js): ball SFX (hit, land(surf), thud, sand, rustle, clank, splash, lip, cup rattle), landing rings (`landRing(x,z)`), `physics` observe key { spin, carryYd, rollYd, bounces, lastBounce, firstBounce, puttBreak, lips, mode, vel, landPreview }, meter fields reset on return to aim.
- physics.js: cup capture by speed and distance (slow drops, quicker lips out with `ball:lip`, fast runs over), spin side-kick on first bounce, per-surface land puffs/sounds, preview sim at 120 Hz, denser interpolated trail.
- aimline.js: `puttTrack` — putt preview dots come from a ghost roll on the real slopes, so they bend with the break.
- balls.js: sunk ball rattles round the cup then drops.
- Events: swing, ball:<land|bounce|sandHit|tree|wall|sheep|cow|water|ob|sunk|lip>. Needs from others: none.

## Iteration 4 (ball-physics)
- Easier putting: `puttRange(d)` in physics.js (full meter a bit past the pin), forgiving power near the notch, larger cup capture, green roll 2.4, thicker `aimDots`.
- `landRingPreview` is recomputed at `swing` from the real power/spin/wind; `previewShot(..., acc)`.
- Saved checks: ball-physics-putt-sinks, -putt-mid-easy, -putt-too-hard, -preview-matches-bounce.

## Added session 13
- observe `physics.hits` = { wall, tree, sheep, cow } counts since the last swing (ballfx.js).
