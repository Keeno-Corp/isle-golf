The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 2

**Judge, session 2: ball-physics lane**

1. **Ball physics polished**: 6. In a real-key iron swing on hole 1, `ball.mode` went rest → air, then `physics.bounces` stayed 0 for the 140 frames I watched. The meter read "PERFECT!" (`perfectAt` 0.377). I did not play hook/slice, wind, tree, sheep or house, and no saved check covers them. The roll-out order across surfaces is still unverified.
2. **Trail, landing ring, putt preview**: 6. `ballTrail` is now a bright cream column behind the ball. It is clearly readable and takes 0.48% of the picture. `landPreview` is an object in flight, but `landRing*` ×6 and `aimLanding` are listed as hidden by the game during flight, so no ring was visible. `slopeGrid` and `aimDots` are also hidden in flight. The ring-versus-first-bounce check is not possible until the ring shows.
3. **Impact and landing feedback / ballsfx**: 6. The console showed no errors and the Sound line reported 8 started. I did not see a puff or splash in this look, which was mid-flight.
4. **Meter timing and reset**: 6. Real Space presses gave stage 3 with label PERFECT!. The `src/meter.js` timing is unchanged and no check measures it.
5. **Events and observe data**: 6. The `physics` key is present (mode, vel, landPreview, bounces). I did not confirm any `ball:*` event fired.
6. **Saved checks `ball-physics-*`**: 2. `game-tests.json` still holds only `ball-physics-putt-sinks`. Six of the seven required checks are missing: late vs early snap, wind, ring vs bounce, roll-out order, lip-out/break, and tree/sheep/house.
7. **Looks as LOOK.md says**: 8. The tilt-shift blur band, painted grass, cream-green haze, teal sea and low sun all read in the look. The golfer stands out only weakly (56% brightness against 59% around it, edge contrast 0.091), and the golfer is small at 0.54% of the picture.
8. **Edit scope**: 8. The changes sit in `src/ballfx.js`, `src/pools.js` and `game-tests.json`, which are lane files.
9. **Keep as is**: 8. The HUD, the start/next/swing flow and the 5 HUD panels all work, with no overlap or cut-off. `perf` ran at 877 ms a frame on SwiftShader (host load 4.5), so frame time is noise. There are 181 draw calls and 367k triangles.

**Faults**: 6. There are no console errors now. `cliffRocks` and `seaStacks` are never visible, but they are outside this lane. The landing ring and the slope grid are hidden in flight.

**Next:**
1. Save the missing checks as `ball-physics-*` with `interact`'s `save` (asked again). Do late vs early snap with the driver first (right of the aim line vs left), then wind 8 vs 0 (at least 0.5 units downwind), then the wedge roll-out order. One `interact` with `expect` and `save` per check should show a ✓ line for each entry. Then `game-tests.json` should list the new ids.
2. Make the landing ring show in flight (asked again). Make `landRing*` and `aimLanding` visible from launch until the first bounce, at `physics.landPreview`. They are `visible:false` during flight now. Check with `look` mid-flight: the ring should appear in the On screen list, and `physics.landPreview` should sit within 1.5 units of `physics.firstBounce`.
3. Show the landing effect. Take `interact` with `look: true` about 5 frames after the first bounce, once on fairway and once on sand. It should show a dust or sand puff from `flightEvents`, and `physics.bounces` should read 1 or more. Then add the tree/sheep/house events (`ball:tree|sheep|wall`) with real-key drives, and the sloped-green break with its preview bend.

SCORE: 6.2

## Iteration 3
**Did**: src/ballfx.js: added `landRingPreview` (yellow pulsing ring, depthTest off, renderOrder 5). On `swing` it copies `aimLanding`'s last position, stays on the ground until `ball:land` (or aim phase); `physics.landPreview` now reads from it in flight. Not done: saved checks (snap, wind, ring vs bounce, roll-out, tree/sheep/house, break) and landing-puff look.
**Saw**: real-key iron swing mid-flight: `landRingPreview` is in the On screen list (0.35%, [591,192,784,231]), `physics.landPreview` {x -0.146, z 12.661} (pin at -1.7, 11.95). The ring sits under the HOLE 1 banner area, so it is hard to see in the picture. No console errors. Swing was HOOK (spin -0.643), preview is the perfect-shot spot, not the hooked one.
**Next**: save the missing `ball-physics-*` checks with interact `save` (one per check); compare landPreview with `physics.firstBounce` on a perfect swing; puff look 5 frames after first bounce on fairway and sand; tree/sheep/house events; sloped-green break.
**Open**: landing-puff visuals and roll-out order unverified; no perf run.
