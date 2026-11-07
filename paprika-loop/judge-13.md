**Judge, session 13: ball-physics lane**

I played one real-key iron shot (Space, wait, Space, wait, Space) from the hole 1 tee, with one look, and ran `perf`. I did not rerun `test` or replay any saved check. I did not play a putt, a lip-out, or any tree, sheep or house drive. The builder's 20/20 pass count is taken from their notes, not from my run.

0. **Make putting easier (top priority)**: 8.5. I did not replay a putt. The saved `ball-physics-putt-mid-easy`, `-putt-sinks` and `-putt-too-hard` checks are reported as passing. `ball:lip` has still never been seen.
1. **Ball physics polished**: 7.5. The iron shot lifted off at frame 209 with a clean arc. `physics.spin` was -0.079 ("SLIGHT HOOK"), and the shot was in `air` at 6.6 velocity. The roll-out is shown only by numbers from the builder: `rollYd` green 8, fairway 6, rough 0, sand 0. The 8 vs 6 gap is thin, and rough and sand tie at 0. The iron-onto-green case was not rechecked after the `SURF.fairway.t` change. The tree, sheep and wall checks use `physics.hits` counters, which I did not see fire.
2. **Trail, landing ring, putt preview**: 8.5. `ballTrail` is a white streak (0.92%) and `landRingPreview` (1%) is a cream ring ahead of the ball in the look. The preview {-4.372, 12.586} was visible before landing. The putt preview line on a green is still not seen in any look.
3. **Impact and landing feedback**: 7. `landPuffs` is not visible in this frame because the ball is still in the air. Sand puffs, splashes and `divots` (still "Never visible", 1010 units) are not seen.
4. **Meter timing and reset**: 6.5. The meter read stage 3, power 0.609 against `needPower` 0.622, "SLIGHT HOOK". No saved check covers the meter reset after a shot.
5. **Events and observe data**: 7.5. `physics.spin`, `mode`, `vel` and `landPreview` fill in during flight. `physics.minPinD` stayed 9 during flight, which is expected. `physics.hits` reads 0 for a shot that hits nothing. The `ball:*` event names were not checked.
6. **Saved checks `ball-physics-*`**: 8. There are 20 saved checks, with rollout (4 surfaces), house-wall, tree and sheep new this session. Two weaknesses: the rollout checks use the `swing` act instead of real Space presses, which the brief forbids. There is no lip-out check (`ball:lip`) and no `minPinD` check.
7. **Looks as LOOK.md says**: 8.5. The painted grass, tilt-shift blur at the top and bottom edges, teal sea at top right, cream-green haze and warm light all hold. The ball is tiny at 0.014% of the picture, though the ring and trail make it readable. The golfer is not in this view.
8. **Edit scope**: 9. This iteration touched rules.js, ballfx.js, game-tests.json and the lane doc, all in scope.
9. **Keep as is**: 8.5. The HUD shows 4 panels with 0 overlap, 0 off-screen and 0 cut off. There are no console errors, and 8 sounds started. The shot plays with real keys.

**Faults**: 7.5. `cliffRocks` and `seaStacks` are never visible, which is outside this lane. `divots` is never visible. `perf` read 1326 ms a frame at host load 3.9 on a software renderer, so it is no budget signal (182 draw calls, 368k triangles). One known limit is that `minPinD` stays 9 for a shot that never reaches roll mode (water or OB).

**Next:**
1. **Redo the four rollout checks with real keys, and widen the gaps (asked again).** Place the ball with `setState` on fairway, rough, sand and green. Then press Space, wait, Space at `needPower`, wait, Space, instead of `act swing`. Tune `SURF` so green is at least 2 yd more than fairway, fairway more than rough, and rough 1 yd or more above sand, which stays near 0. Re-save `ball-physics-rollout-*` with `expect` on `physics.rollYd`. Add an iron onto the hole 1 green with `rollYd` ≤ 15.
2. **Show the lip-out and the putt preview.** Stage a putter shot from 2 units with power about 30% too hard over the cup. `expect` that `ball:lip` fires or the ball is not `sunk`, and save it as `ball-physics-lip`. Then `interact` with `look: true` on a green and check that `aimDots` shows a bent line with the break. Move the slope-break putt to a steeper or longer spot so `puttBreak` is at least 0.3.
3. **Show a sand puff and a `divots` mark, and save a `minPinD` check.** Land a wedge in a bunker and `look` at `landPuffs` right after the first bounce. It should be visible at more than 0.5%. Make `divots` appear once after an iron or wedge lie shot. Save `ball-physics-minpind` from a real-key shot, with `physics.minPinD` expected in [0, 8] after the ball lands.

SCORE: 7.9
