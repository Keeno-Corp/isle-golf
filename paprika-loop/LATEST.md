The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 17
**Did**: `src/pools.js`: `divots` point size 0.16 → 0.3; `landPuffs` size 1.5 → 1.8 and blending additive → normal (additive puffs wash out on bright grass/sand). No other change.
**Saw**: No look, `test` or `perf` run this session, so the effect is unconfirmed; the last known numbers are Judge 14's (20/20 `ball-physics-*` pass).
**Next**: 1) `look` right after a wedge's first bounce in a bunker to confirm `landPuffs` and `divots` are visible. 2) Re-run all `ball-physics-*` checks. 3) Redo the rollout checks with real keys, stage a too-hard putt for `ball-physics-lip`.
**Open**: Puff fade multiplies colour toward black, which with normal blending may darken puffs to dark smudges; check in a look. `toNonIndexed` warning source unknown.

### Judge 17

**Judge, session 17: ball-physics lane**

I played one real iron shot from the hole 1 tee: `swing` act at power 0.6, which is a perfect press by the act and not a real-key Space press. I took two looks and ran `perf`. I did not run `test` and did not play a putt, bunker shot, lip-out or tree/sheep/house drive. The `ball-physics-*` checks are unconfirmed this session. I did not see Iteration 17's `landPuffs` and `divots` change, because the ball landed on green and no puff was in view.

0. **Make putting easier (top priority)**: 8. I did not putt. The last known state is Judge 14's: `ball-physics-putt-mid-easy`, `-putt-sinks` and `-putt-too-hard` passed in `test`. The ball rolled 30 yd (`rollYd`) from a 132 yd iron, and the green is soft enough to hold (rest at {-1.93, 13.09}). The putt preview line still has not been seen in any look.
1. **Ball physics polished**: 8. The iron went `air` → `roll` → `rest` with `carryYd` 85, `rollYd` 30, `bounces` 2, `firstBounce` on green and `lastBounce` at {-3.35, 12.79}. The `landPreview` of {-4.445, 12.72} matched `firstBounce` {-4.418, 12.72} within 0.03 units. The bounce and roll look natural. Rollout on fairway, rough and sand is still unmeasured.
2. **Trail, landing ring, putt preview**: 8.5. `ballTrail` (0.92%) is a clear white streak. `landRingPreview` (0.92%) is a yellow ring that sits on the landing spot. A putt preview line (`aimDots`) is still hidden and unseen.
3. **Impact and landing feedback**: 6. `divots` has been "Never visible" for 4 sessions, and `landPuffs` is "Never visible" at 0 units. I saw no first-bounce puff on the green and no sand puff or splash. Iteration 17's enlarged size and normal blending is unconfirmed.
4. **Meter timing and reset**: 7. `meter` showed stage 3, `power` 0.6 and `label` "PERFECT!" against `needPower` 0.622, and the `swing` act gave that result. I did not check the meter fields resetting after the shot, and I did not use real keys.
5. **Events and observe data**: 8.5. `physics.minPinD` works: it went from 9 to 1.133 during the roll. `physics` also carries `carryYd`, `rollYd`, `bounces`, `firstBounce`, `lastBounce`, `vel` and `landPreview`. I did not watch the `ball:*` event names.
6. **Saved checks `ball-physics-*`**: 7.5. They were 20 of 20 at Judge 14, and I did not re-run them after the Iteration 17 `pools.js` change. There is still no `ball-physics-lip`, `-minpind` or real-key rollout check.
7. **Looks as LOOK.md says**: 9. Both looks show the painted grass, tilt-shift blur at top and bottom, teal sea, cream-green haze and warm light. The ball is readable at 0.2% with `ballShadow1` and the trail. The golfer is not in view during flight.
8. **Edit scope**: 9. The last change was only in `src/pools.js`.
9. **Keep as is**: 8.5. The HUD shows 4 panels with 0 overlap, 0 off-screen and 0 cut off. There are no console errors. The only warning is `toNonIndexed` on an already non-indexed geometry, source still unknown.

**Faults**: 7.5. `divots` and `landPuffs` are never visible. `cliffRocks` and `seaStacks` are never visible, which is outside this lane. `perf` read 910 ms a frame on a software renderer at host load 4.3, so it is no budget signal (182 draw calls, 368k triangles).

**Next:**
1. **Show a puff in a look (asked again).** Place the ball with `setState` in a bunker on hole 1 (the sand patch left of the fairway) and hit a real-key wedge with `interact` and `look: true` about 5 frames after the first bounce. `landPuffs` should be listed above 0.3% with a sand colour at the `sample` pixels, and `divots` should be visible. If `landPuffs` stays "Never visible", check that `flightEvents` emits it and that the camera is not behind it. Iteration 17's note says normal blending may darken puffs toward black, so also check the colour.
2. **Show the putt preview and a lip-out (asked again).** Use `setState` to put the ball 3 units from the pin on a green, then `look` after the aim. `aimDots` should be visible, thick and bright above 0.3%, and bent with `puttBreak`. Then save `ball-physics-lip`: a putter shot from 2 units at about 130% power, expecting `ball:lip` or `ball.mode` not `sunk`.
3. **Re-run all the checks and add the missing ones.** Run `test` once to confirm 20 of 20 still pass after `pools.js`. Then redo the four rollout checks with real keys (Space, wait, Space at `needPower`, wait, Space) and save `ball-physics-minpind` with `physics.minPinD` in [0, 8]. This session's iron already gave `minPinD` 1.133, so that check is straightforward.

SCORE: 8.0
