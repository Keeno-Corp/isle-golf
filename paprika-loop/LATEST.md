The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 8

**Judge, session 8: ball-physics lane**

Session 8 changed only `PHY.puttBreak`, so I checked that fix and the saved checks. I ran `test`, one iron shot from the hole 1 tee with a look at 50 frames, and `perf`. I did not play a putt on a slope, a wedge from sand or rough, a tree, a sheep or the house.

0. **Make putting easier (top priority)**: 8. `ball-physics-putt-mid-easy`, `ball-physics-putt-sinks` and `ball-physics-putt-too-hard` all pass in the 12/12 run. The meter's `needPower` is 0.622 for the iron from the tee, so the power scale follows the distance. I still have not seen `aimDots` on a green or any `ball:lip`.
1. **Ball physics polished**: 6.5. The iron went from `air` with `vel` 7.58 to a `landPreview` of {-2.287, 12.69}, the same spot as last session. The wedge roll-out order, the tree, sheep and house drives, and the 37 yd green roll-out are still unchecked.
2. **Trail, landing ring, putt preview**: 7.5. `ballTrail` is a bright cream column behind `ball1`, and `landRingPreview` is a 1.97-unit yellow ring around the pin area. Both read at a glance. `aimDots` is still hidden in the aim phase, so the putt line and its bend are unseen.
3. **Impact and landing feedback**: 5. `landPuffs` is 0 units and behind the camera in the look, as in session 7. No puff, sand puff or splash has been seen on screen yet.
4. **Meter timing and reset**: 6. The meter shows stage 3, PERFECT! and `needPower` 0.622. No saved check covers the meter reset.
5. **Events and observe data**: 7. `physics.puttBreak` is 0 after a full shot, so the stale-value fix holds. I did not confirm any `ball:*` event fired.
6. **Saved checks `ball-physics-*`**: 6.5. There are 8 lane checks and all pass: putt sinks, mid-easy and too-hard, preview-matches-bounce, wind 8 and wind 0, and driver slice and hook. The slope break, lip-out, wedge roll-out order, and tree, sheep and house drives are still missing.
7. **Looks as LOOK.md says**: 8. The painted grass, tilt-shift blur on the foreground and far trees, cream-green haze and warm light all read. The golfer is drawn by its own shader, so I could not check the silhouette in this look. Only a corner of the sea is in view.
8. **Edit scope**: 8. Session 8 changed only `src/ballfx.js`, a lane file.
9. **Keep as is**: 8. The four original checks pass, the HUD has 0 overlap and 0 off-screen, and there are no console errors. `perf` read 1217 ms a frame on SwiftShader (host load 2.9). That is software rendering, so it says nothing about a real GPU. It counted 308 draw calls and 486k triangles.

**Faults**: 7. `cliffRocks` and `seaStacks` are never visible (outside this lane). The unseen `landPuffs` is the lane fault.

**Next:**
1. **Save `ball-physics-slope-break` (asked again, and the lane lead's steering puts it first).** Place the ball on a sloped green with `setState`, then use real keys with the putter, aimed straight at the pin. `expect` `physics.puttBreak` ≥ 0.2, and `look` in the aim phase to see `aimDots` bend the same way. Done when the interact `expect` line for `physics.puttBreak` shows ✓ and the look lists `aimDots` on screen. If `aimDots` stays hidden in the aim phase, make it visible when the club is the putter.
2. **Save `ball-physics-rollout-<surface>` (asked again).** Make real-key wedge swings onto fairway, rough, sand and green. `expect` `physics.rollYd` green > fairway > rough > sand, with sand near 0. Tune the surface values (`SURF`) where a check fails, and do not loosen the check. An iron onto a green must stop within about 15 yd of its first bounce, not 37. One `interact` per surface with `trace` on `physics.rollYd` shows it.
3. **Show a landing puff on screen (asked again).** `landPuffs` has been behind the camera in three looks running. Run `interact` with `look: true` 2–3 frames after `air` → `roll`, and `sample` at the ball's pixels. Success is a look that lists `landPuffs` above 0.3% with a pale cloud beside `ball1`. If it is still not in view, place the puff at the first-bounce point and not at the origin. After that, save the tree, sheep and house drives: `ball:tree`, `ball:sheep` and `ball:wall`.

SCORE: 7.0

## The request changed

paprika-loop/PROMPT.md changed before session 9; the Next lists above were written before it. Changed lines:
+ ## Steering (lane lead, ~1h40 left)
+ Saved so far: putt sinks/mid-easy/too-hard, preview-matches-bounce, wind 8/0, slice/hook. Still unsaved, in this order, one or two per session: ball-physics-slope-break (putt straight at the pin on a sloped green breaks >= 0.2 downhill, preview bends same way), ball-physics-rollout-<surface> (real-key wedge onto fairway/rough/sand/green; tune SURF so green > fairway > rough > sand~0 holds and an iron onto a green does not roll 37 yd), ball-physics-tree / -sheep / -house-wall (real-key drives). Do each with real keys; fix physics where a check fails rather than loosening the check.

## Iteration 9
**Did**: Saved check `ball-physics-slope-break` in game-tests.json: hole 1, ball placed at (-5.7, 11.95), putter, `aim at pin`, real Space presses (waits 40/30), expects `physics.puttBreak` in [0.2, 5]. No source files changed.
**Saw**: `test` 13/13 pass. The slope check reads `physics.puttBreak` 0.204 (ball ended 0.75 from the pin at (-2.42, 12.15)), so the margin over 0.2 is thin. I did not look at `aimDots` or `slopeGrid` in the aim phase. I ran no `perf` and no looks. By the numbers in `SURF` (rules.js) the roll deceleration is green 2.4 < fairway 3.1 < rough 10 < sand 26, so the roll-out order should hold, but I did not run it.
**Next**: Save `ball-physics-rollout-<surface>` from real-key wedge swings and check the 37 yd iron roll-out on a green; then the tree, sheep and house-wall drives (`ball:tree`, `ball:sheep`, `ball:wall`); then a look of `landPuffs` and of `aimDots` bending on the slope.
**Open**: The slope-break margin is small (0.204 vs 0.2); a longer putt on a steeper spot would be sturdier. An `eval` loop that calls `act swing` repeatedly gave unreliable results (the ball stayed 'sunk'), so measure with `interact` and reloads instead. Sand puff colours are still a guess.
