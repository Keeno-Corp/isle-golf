**Judge, session 6: ball-physics lane**

Looks and play are strong. The weak scores are the missing proofs: lip-out, slope break, collisions and surface roll-out. I did not run the full set of checks beyond what `test` covers. I played one real-key iron shot on hole 1 and did not press the meter on a green.

0. **Make putting easier (top priority)**: 8. `test` passed `ball-physics-putt-mid-easy`, `ball-physics-putt-sinks` and `ball-physics-putt-too-hard`. I did not re-look at the putt dots or the cyan notch this session. `ball:lip` has still not been observed.
1. **Ball physics polished**: 6.5. A real-key iron shot went rest → air with `physics.spin` -0.607 (HOOK!) and `vel` 6.32. `ballTrail` ran from the ball down the fairway, and the shot landed at `firstBounce` {-5.17, 11.82, fairway} on the `landPreview` spot. It bounced twice (`bounces` 2), with `carryYd` 77 and `rollYd` 9. The two new `swing` accuracy checks (`ball-physics-driver-slice-right`, `ball-physics-driver-hook-left`) pass, but use accuracy values, not real Space presses. The wedge roll-out order, tree, sheep and house are still unplayed.
2. **Trail, landing ring, putt preview**: 7.5. `ballTrail` is a clear cream column and `landRingPreview` (1.97 units) is a yellow ring around the aim spot. After landing, the trail curls into a white arc around the ball. The putt-line bend on a slope is still unseen.
3. **Impact and landing feedback / ballsfx**: 4.5. Three frames after the first bounce, the look shows a white arc and `divots` (0.03% of the picture) but no dust puff. No sand puff or splash has been seen in five sessions. The Sound line reports 6 started.
4. **Meter timing and reset**: 6. The meter reached stage 3 with `perfectAt` 0.594, `needPower` 0.622 and label HOOK!, and the shot fired. No saved check covers the field reset after a shot.
5. **Events and observe data**: 7. `physics` now carries `spin`, `mode`, `vel`, `carryYd`, `rollYd`, `bounces`, `lastBounce`, `firstBounce`, `puttBreak` and `landPreview`. `puttBreak` read -0.945 after a fairway shot, which looks like stale or meaningless data. I did not confirm any `ball:*` event fired.
6. **Saved checks `ball-physics-*`**: 6. All 12 saved checks pass, 8 of them with the lane prefix. Still missing: the wedge roll-out order, the slope break, the lip-out, the tree, sheep and house drives, and a fixed-aim wind pair.
7. **Looks as LOOK.md says**: 8. Painted grass, tilt-shift blur on the foreground, cream-green haze, teal sea at top right and warm light all read. The golfer is not in view, so I could not check the silhouette. `cliffRocks` and `seaStacks` are never visible, and they are outside this lane.
8. **Edit scope**: 8. Git status was clean at the start. Last session changed only game-tests.json.
9. **Keep as is**: 8. HUD panels have 0 overlap and 0 off-screen, and there are no console errors. `perf` read 935 ms a frame with host load 4.4 on SwiftShader, which is noise. It counted 181 draw calls and 367k triangles. The aim, club and meter flow works with real keys.

**Faults**: 7. `cliffRocks` and `seaStacks` are never visible (outside this lane). The stale-looking `puttBreak` of -0.945 and the unproven landing puffs are the only lane issues.

**Next:**
1. Show a landing puff (asked again). Check `flightEvents` in `src/physics.js` and the spawn code for the puff. Then run `interact` with `look: true` 2–4 frames after the first bounce, once on fairway and once on sand. The look should show a visible dust or sand cloud at `firstBounce`, bigger than `divots`.
2. Save the lip-out and slope-break checks (asked again). Place the ball by `setState` on a visibly sloped green and read `physics.puttBreak`. Expect `|puttBreak|` ≥ 0.2, and confirm `aimDots` curve the same way. Save `ball-physics-putt-lip` as a slow putt just over the cup, with `expect` on `ball.mode` not 'sunk' and a `ball:lip` event. Also reset `puttBreak` when a non-putt shot starts.
3. Save the wedge roll-out order and the collision drives (asked again). For the wedge, run real Space presses from fairway, rough, sand and green and `expect` `physics.rollYd` green > fairway > rough > sand. Then save drives into a tree, a sheep and the hole 5 house. Each should fire `ball:tree`, `ball:sheep` or `ball:wall`, and the check should `expect` the changed direction or a drop near the trunk.

SCORE: 6.9
