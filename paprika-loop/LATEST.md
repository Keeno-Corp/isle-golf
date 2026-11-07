The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 14
**Did**: `SURF.rough.t` 0.32 → 0.4 in src/rules.js so rough rolls a little more than sand. Re-ran all saved checks: 20/20 pass. Did not edit checks or ballfx.js.
**Saw**: Numbers only; no looks, no `perf`. Did not re-measure `rollYd` for rough (check only asserts its old bounds) so the rough-vs-sand gap is unconfirmed.
**Next**: 1) Read `physics.rollYd` after a rough rollout to confirm > 0 and sand stays near 0. 2) Per the 04:15 PROMPT note: polish feel with looks of trail, landing ring, first-bounce puff, cup drop/rattle; play real-key holes 1-3 and confirm the round finishes. 3) Real-key rollout checks, a `ball:lip` check, `minPinD` check (still open from Judge 13).
**Open**: Rollout checks still use `swing` act. `divots` never visible. The 04:15 note arrived after the change; none of its polish was done.

### Judge 14

**Judge, session 14: ball-physics lane**

I ran `test`, played one real-key iron shot from the hole 1 tee with one look, and ran `perf`. I did not play a putt, a lip-out, a sand puff or any tree, sheep or house drive. Those checks count only as `test` passes. `ball-physics-lip`, a real-key rollout check and a `minPinD` check still don't exist.

0. **Make putting easier (top priority)**: 8.5. `ball-physics-putt-mid-easy`, `-putt-sinks` and `-putt-too-hard` all pass in `test`. I did not feel a putt myself. The putt preview line on a green is still not seen in any look, and `ball:lip` is still never seen.
1. **Ball physics polished**: 7.5. The iron flew in an arc with `physics.spin` -0.464, shown as "HOOK!" at `meter.power` 0.899. That is far from `needPower` 0.622, so my presses were not at the notch. The shot was in `air` at 7.8 velocity. Rollout is still unseen. Iteration 14's `SURF.rough.t` change is unconfirmed, and the rough and sand gap is unmeasured.
2. **Trail, landing ring, putt preview**: 8.5. `ballTrail` (1%) is a clear white streak behind the ball. `landRingPreview` (0.61%) is a yellow ring around the pin. `landPreview` {-1.80, 11.63} sits near the pin at {-1.7, 11.95}. A putt preview line was not seen.
3. **Impact and landing feedback**: 7. `landPuffs` is behind the camera, and the ball was still in `air`. `divots` has been "Never visible" for 3 sessions (1010 units). No sand puff or splash was seen.
4. **Meter timing and reset**: 6.5. My three presses gave stage 3 and a HOOK result. No saved check covers the meter fields resetting after a shot, and no new look shows it.
5. **Events and observe data**: 7.5. `physics` holds `spin`, `mode`, `vel` and `landPreview`. `minPinD` isn't in the keys during flight, so I couldn't confirm it. The `ball:*` event names were not watched.
6. **Saved checks `ball-physics-*`**: 8. All 20 of 20 pass in 241 s. The four rollout checks still use the `swing` act, not real keys. There are no `ball:lip` or `minPinD` checks.
7. **Looks as LOOK.md says**: 8.5. The painted grass, tilt-shift blur at the top and bottom, teal sea at top right, cream-green haze and warm sun all hold. The ball is tiny (0.012%) but the trail and ring make it readable. The golfer is not in this view.
8. **Edit scope**: 9. The last change was one value in `src/rules.js`, which is in scope.
9. **Keep as is**: 8.5. The HUD has 4 panels with 0 overlap, 0 off-screen and 0 cut off. There are no console errors. 8 sounds started on the shot. The round was played with real keys and no new fault.

**Faults**: 7.5. `cliffRocks` and `seaStacks` are never visible, which is outside this lane. `divots` is never visible. `perf` read 618 ms a frame at host load 5.9 on a software renderer, so it is no budget signal (182 draw calls, 368k triangles). There is a three.js warning about `toNonIndexed` on an already non-indexed geometry. This session was only a replay with no code change.

**Next:**
1. **Redo the four rollout checks with real keys and read `physics.rollYd` (asked again).** Place the ball with `setState` on fairway, rough, sand and green. Use Space, wait, Space at `needPower`, wait, Space instead of `act swing`. Tune `SURF` so green > fairway > rough > sand, with sand near 0. Re-save `ball-physics-rollout-*` with `expect` on `physics.rollYd`. `interact` shows it done when its reply carries four different `rollYd` values in that order.
2. **Show the putt preview and a lip-out (asked again).** Stage a putter shot from 2 units with power about 30% too hard. Save `ball-physics-lip` expecting `ball:lip` or `ball.mode` not `sunk`. Then `interact` with `look: true` on a green and check `aimDots` is visible, bent with `puttBreak`, and thick and bright at more than 0.3%.
3. **Make `divots` and `landPuffs` visible.** Land a wedge in a bunker and `look` right after the first bounce. `landPuffs` should be above 0.5%, with a sand colour at the `sample` pixels. Make a `divots` mark appear after an iron lie shot. Then save `ball-physics-minpind` from a real-key shot, with `physics.minPinD` in [0, 8] after landing.

SCORE: 7.9
