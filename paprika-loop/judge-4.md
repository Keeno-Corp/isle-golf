**Judge, session 4: ball-physics lane**

0. **Make putting easier (top priority)**: 8. `test` ran all 8 saved checks and they passed. That includes `ball-physics-putt-mid-easy` (6.3 units, -9% power, sunk), `ball-physics-putt-too-hard` and `ball-physics-putt-sinks`. The preview dots are now white and about 0.1 units wide, so they read on the fairway. `aimDots` ×29 ran the length of a 10-unit line. I put the putter on a tee-box lie, so I did not see the dots bend on a real slope or the cyan notch on a green. The builder's own Open note says the mid putt sinks "only because of the pull-in radius". The lip-out is not proven: the +30% check passes as "not sunk", not as a `ball:lip`.
1. **Ball physics polished**: 6. A real-key iron swing went rest → air, with `physics.spin` -0.6 (HOOK!) and `vel` 6.4. I did not play the driver late/early snap, wind 8 vs 0, the surface roll-out order, tree, sheep or house, and no saved check covers any of them.
2. **Trail, landing ring, putt preview**: 7. In flight the yellow `landRingPreview` ring is a clear 2-unit ring on the fairway near the pin, and `ballTrail` is a cream column. `landPreview` was {-4.98, 11.8} on this swing. The builder measured a 0.004 gap to `firstBounce`, and `ball-physics-preview-matches-bounce` passes. The preview-line bend on a slope is still unseen.
3. **Impact and landing feedback / ballsfx**: 5. The Sound line said 8 started. I did not look at a dust puff, sand puff or splash, and no look has caught one in three sessions.
4. **Meter timing and reset**: 6. Space, Space, Space gave stage 3, power 0.609, `perfectAt` 0.609 and label HOOK!. No saved check measures timing or the field reset.
5. **Events and observe data**: 6. `physics` carries `spin`, `mode`, `vel` and `landPreview`. I did not confirm any `ball:*` event fired. `landPreview` is null at aim, which is fine.
6. **Saved checks `ball-physics-*`**: 4. There are 4 of 7 groups: putt sinks, mid-easy, too-hard and preview-matches. Driver late/early snap, wind 8 vs 0, the wedge roll-out order, the slope break and the tree, sheep and house checks are still missing. It is the fourth session with these absent.
7. **Looks as LOOK.md says**: 8. The painted grass, tilt-shift blur, cream-green haze, teal sea and low sun all read. `golfer_body` is 0.36% of the picture and cut by the edge on the flight camera, so it does not stand out there. The look reports `cliffRocks` and `seaStacks` as never visible, and they are outside this lane.
8. **Edit scope**: 8. `git status` was clean at the start and the work is in lane files.
9. **Keep as is**: 8. The HUD panels have 0 overlap. `perf` read 820 ms a frame on SwiftShader (host load 4.4), so it is noise. It counted 181 draw calls and 367k triangles. There were no console errors, but my `setState` ball placement threw "Cannot read properties of undefined (reading 'pos')".

**Faults**: 6. `cliffRocks` and `seaStacks` are never visible (outside this lane). `setState` with a `ball` object throws, so the placement the brief asks for may not work as the checks expect. The builder should confirm what shape `setState` takes for the ball.

**Next:**
1. Save the missing checks as `ball-physics-*` with `interact`'s `save` (asked again, fourth time). Start with the driver late vs early snap using real Space presses, with `expect` on `ball.z` relative to the aim line. Then wind 8 vs 0 and the wedge roll-out order. `test` should then list the new ids; right now it lists 8, of which 4 are ours.
2. Prove the cup lip-out, and look at the break on a slope. Place the ball on the sloped green by a way that does not throw, then `interact` with `look: true`. Expect `aimDots` to bend downhill, and a `ball:lip` event on a putt just over the cup. Check that `ball.mode` changes to 'sunk' on a gentle putt.
3. Show landing puffs and collisions (asked again). Take `interact` with `look: true` about 5 frames after the first bounce, once on fairway (dust) and once in sand. Then add real-key drives into a tree, a sheep and the hole 5 house to fire `ball:tree|sheep|wall`. A puff should show at the `landRingPreview` spot.

SCORE: 6.5
