**Judge 18: scores**

I took two pictures this session: the hole 5 aim view (`look-1`) and a real-key Space ×3 flight view 25 frames after launch (`look-2`). I ran `perf` once. I did not look at the flyover, C view, holed camera, night or scorecard views, and I did not run `test`. The scores for those views come from Iteration 18's recorded results (18 of 18 checks passing) and earlier sessions.

00. **Odyssey-style dithering**: 8. In aim, `look.dither` is `active:true` with `subjectNdc` [-0.096, -0.251], matching `look.golfer`. `nearFades` names `tree4_leaves0`. In flight it is `subjectNdc` [0, -0.193] and `nearFades` is empty. `tree3_leaves0` and `tree0_leaves0` stay solid, as they should.
0. **Wider framing, smoother ground**: 8. `camera.fov` is 33. The restored D 7.8 / H 3.9 flight view shows `pond_water`, `pin_flag` and the fairway bunkers at once. The `grass*` stripes are smooth, with no texel blocks. There is still no saved before/after pair.
1. **Look lane goal**: 7. The camera sits at pitch 21.6° in flight and the `ballTrail` dots lead the eye. `ball1` is only 0.026% of the picture (about 19 px), and `golfer_body` is gone from view. That is acceptable for the owner's wider view, but the ball is easy to lose against the grass.
2. **Look check 1 (aim blur band)**: 8. In aim on hole 5 the top fifth is blurred and `golfer_body` is crisp. `look.ball.y` is -0.365 and `focusY` is 0.455. The hole 1 and hole 9 aim views are not saved as checks.
3. **Look check 2 (C on 5, 6, 9)**: 6. I did not look at C this session. The supervisor's notes say pitch 55° and both endpoints pass. The golfer is still small, and nobody has tried a broadside fit.
4. **Look check 3 (flyover, real-key drive)**: 8. My real-key drive kept `look.ball.y` at -0.193 in flight. `look-flyover-25`, `look-flyover-50`, `look-flyover-75` and `look-drive-mid` are saved and passed in Iteration 18. `look-drive-early` and `look-drive-late` are still missing.
5. **Look check 4 (sea, key light, night)**: 7. The `sea` is teal at the top right of the aim view. Shadows fall to the lower right, for example from `tree3_trunk` and the bushes. There were no `Lighting:` or `Surfaces:` lines. `look-night-hole5` is saved but I did not look at it.
6. **Critic views and course findings**: 6. Aim and flight are pictured. The meter appears as a "POWER 33%" bar in the aim picture. There is no holed picture and no scorecard picture yet. The pink-boulder shrubs at the right of both pictures belong to the course lane, so record them once.
7. **LOOK.md Checks**: 8. The brush pass, cream-green haze, warm sun and focus band all hold, and there is no unblurred frame.
8. **Edit scope and load-order imports**: 8. Iteration 18 touched `src/camera.js` and `game-tests.json`. I did not re-read the sources.
9. **Observe hook, saved checks, lane notes**: 7. `look` carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. Five of the missing checks were saved. Aim 1/5, drive early/late, a holed check and a scorecard check are not.
10. **Faults**: 8. There was no console error beyond the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 triangles, equal to the baseline. The 1144 ms frame is SwiftShader with Host load 3.3 on 8 cores, so it is noise.

**Next:**
1. **Save the remaining `look-` checks and run `test` from a fresh reload** (asked again, fifth time). Needed: `look-aim-hole1`, `look-aim-hole5`, `look-drive-early` (about 8 frames into flight) and `look-drive-late`. Use the `newRound` action plus a `state` step, as `look-drive-mid` does, and give each a `look.ball.on:true` expect. Done is `test` passing with those ids included.
2. **Take the real-key putt and scorecard pictures** (asked again). Putt with Space ×3, then `until:{phase:'holed'}`, `wait 4` and `wait 24` with `look`, without `settle:true`. Then step to the card and `look`. Done is `ball1` or the cup at `look.ball.y` above -0.6, with `pin_flag` solid and `nearFades` not naming it. The supervisor already saw the holed camera at cup y -0.85, so fix it in `src/camera.js` by starting the cup camera during `SIM.mode==='sunk'`, pulled back and higher.
3. **Keep the ball readable in the wide flight view.** `ball1` is 0.026% of the picture. Don't zoom the camera in, because the owner wants it wide. Try a larger flight-time ball highlight or `ballRing` in `src/stage.js`, within the stage-owned code. Done is `look` with `sample` on the `ball1` box [630, 469, 649, 487], showing a brighter ring or halo of about 30 px with `look.ball.y` unchanged.

SCORE: 7.5
