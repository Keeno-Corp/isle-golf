The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 7
**Did**: Added a `landPuffs` additive soft-point pool (`puffs`, `puff()` in src/pools.js; size 1.5, 60 points), updated each frame from src/ballfx.js via `addUpdate` (main.js is not ours). `flightEvents` in src/physics.js calls `puff` on `land` (pale sand, green or rough colour by surface) and on `sandHit`.
**Saw**: A look 3 frames after the first bounce (iron on the green) lists `landPuffs` at 0.5% of the picture, a visible pale glow around `landRing0`, bigger than `divots`. Not looked at on sand. All 12 saved checks pass. No console errors. I did not run perf.
**Next**: look at a puff on sand and on rough; save lip-out (`ball:lip`) and slope-break (`puttBreak` ≥ 0.2) checks; wedge roll-out order from real Space presses; tree, sheep and house drives.
**Open**: `puttBreak` is reset to 0 on each swing already (ballfx.js swing handler); the -0.945 the judge saw is the sideways drift of a fairway shot, which the putt-only meaning does not fit. Not changed. Sand puff colours are a guess.

### Judge 7

**Judge, session 7: ball-physics lane**

I played one real-flow iron shot from the hole 1 tee (`swing` power 0.8, accuracy 0), then switched to the putter for the putt-line look and ran `perf` once. I did not run `test`, press Space on a green, or look at sand, rough, a tree, a sheep or the house.

0. **Make putting easier (top priority)**: 7.5. Last session's judge saw `ball-physics-putt-mid-easy`, `ball-physics-putt-sinks` and `ball-physics-putt-too-hard` pass, and I did not re-run them. After the iron shot, the putter showed `needPower` 0.093 for a 2.3-unit putt, so the power scale follows distance to the pin. I did not see `aimDots` on the green or any `ball:lip`.
1. **Ball physics polished**: 6.5. The iron went tee → `air` (`vel` 7.7) → `roll` → `rest` in 85 frames. `firstBounce` was {-2.288, 12.69, green}, within 0.01 of the `landPreview` {-2.287, 12.69}. It bounced twice, with `carryYd` 111 and `rollYd` 37. That `rollYd` is large for a 118-yard hole, and the ball ended in rough/sand 2.3 units from the pin, so the green roll-out looks too long. The wedge order, tree, sheep and house are still unplayed.
2. **Trail, landing ring, putt preview**: 7.5. `ballTrail` is a bright cream column and `landRingPreview` is a 2.03-unit yellow ring around the aim spot, both readable at a glance. `aimDots` is hidden in the aim phase, so I could not see the putt line or its bend.
3. **Impact and landing feedback / ballsfx**: 5. `landPuffs` exists, but it was 0 units and behind the camera when I looked, so I did not see a puff on screen. The look at 85 frames shows only `ballTrail`, `ballShadow1` and a faint glow under the ball. Sand puffs and splashes are not seen yet.
4. **Meter timing and reset**: 6. The meter showed stage 3 with the PERFECT! label and `needPower` 0.622, and `needPower` updated for the putter. No saved check covers the meter reset.
5. **Events and observe data**: 6.5. `physics` carries `vel`, `landPreview`, `carryYd`, `rollYd`, `bounces`, `lastBounce`, `firstBounce` and `puttBreak`. `puttBreak` read 0.735 after a non-putt shot, so it still holds a stale value after a shot that isn't a putt. The builder said it resets on swing, and it did stay 0 during flight, but it is filled in again at the end of the roll. I did not confirm that any `ball:*` event fired.
6. **Saved checks `ball-physics-*`**: 6. About 8 lane checks exist, and last judge saw all pass. Still missing: the wedge roll-out order, the slope break, the lip-out, the tree/sheep/house drives, and a fixed-aim wind pair.
7. **Looks as LOOK.md says**: 8. The painted grass, tilt-shift blur on the foreground and far trees, cream-green haze, teal sea and warm light all read. The golfer is not in view, so I could not check the silhouette.
8. **Edit scope**: 8. The git status was clean at the start, and the last change was `src/pools.js` and `src/ballfx.js` (both lane files).
9. **Keep as is**: 8. The HUD has 0 overlap and 0 off-screen, there are no console errors, and the aim, club and swing flow works. `perf` read 619 ms a frame on SwiftShader (host load 4.6), which is noise, with 182 draw calls and 368k triangles.

**Faults**: 7. `cliffRocks` and `seaStacks` are never visible (outside this lane). The stale `puttBreak` and the unseen puffs are the lane issues.

**Next:**
1. **Show the landing puff on screen (asked again).** `landPuffs` is not visible in any look. Run `interact` with `look: true` 2–3 frames after the `air` → `roll` change on a real shot, and `sample` at the `landRing0` pixels. The look should list `landPuffs` above 0.3% with a pale cloud beside the ball. Also look once on sand with `setState` and a wedge.
2. **Save the putt lip-out and slope-break checks (asked again).** Place the ball on a sloped green and make a putt aimed straight at the pin. Expect `physics.puttBreak` ≥ 0.2, and check that `aimDots` bends the same way in a look. Save `ball-physics-putt-lip` with `expect` on `ball.mode` not `sunk` and a `ball:lip` event. Also make `puttBreak` read 0 unless the club is the putter.
3. **Save the wedge roll-out order and the collision drives (asked again).** Run real Space presses from fairway, rough, sand and green, and `expect` `physics.rollYd` green > fairway > rough > sand. Then save drives that fire `ball:tree`, `ball:sheep` and `ball:wall`. After that, check why a 118-yard iron rolls 37 yards on the green (`rollYd` 37). It should stop closer to the first bounce, and the new check should show it.

SCORE: 6.9
