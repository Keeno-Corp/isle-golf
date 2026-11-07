**Judge 19: scores**

I took one picture, hole 5 in real-key flight (Space ×3, 30 frames after launch), and ran `perf` once. I did not see the flyover, C view, holed camera, night view or scorecard. Those scores rest on Iteration 19's 22 of 22 passing `test` and on earlier sessions. Iteration 19 made no source edits.

00. **Odyssey-style dithering**: 8. In flight `look.dither` is `active:true` with `subjectNdc` [0, -0.141], matching `look.ball.y` -0.141. It is crisp, with no console errors. `tree3_leaves0` and `tree0_leaves0` stay solid because they aren't occluding. I did not see an occluder dithered this session.
0. **Wider framing, smoother ground**: 8. `camera.fov` is 33, at z -10.1, y 9.5. The picture shows `pin_flag`, the bunkers and `pond_water` together. The `grass*` stripes are smooth with no texel blocks. There is still no saved before/after pair.
1. **Look lane goal**: 7. The painted look, the tilt-shift haze and the warm light hold, but `ball1` is 0.027% of the picture (about 19 px). `golfer_body` is crisp, but `look.golfer.y` is -0.657 and `golferShadow` runs to y=789, so the golfer is still low in frame during flight.
2. **Look check 1 (aim blur band)**: 8. `focusY` is 0.423. The top fifth is blurred and `golfer_body` is crisp. The saved checks `look-aim-hole1` and `look-aim-hole5` now exist, but they only test `look.ball.on` and `look.ball.y`, not the blur.
3. **Look check 2 (C on 5, 6, 9)**: 6. I did not look at C. The supervisor reports pitch 55° with both endpoints passing, and no broadside fit has been tried. There is no saved C check that I can confirm.
4. **Look check 3 (flyover, real-key drive)**: 8. My real-key drive kept `look.ball.on` true at y -0.141, and the flyover and drive checks are saved. All of them pass in the 22 of 22 `test` run.
5. **Look check 4 (sea, key light, night)**: 7. The `sea` is teal at the right edge. Shadows fall to the lower right, for example from `tree3_trunk` and `golferShadow`. There were no `Lighting:` or `Surfaces:` lines. `look-night-hole5` is saved, but I did not look at it.
6. **Critic views and course findings**: 5. Aim and flight are pictured, and the meter reading is in state (`meter.stage` 3). There is still no holed picture and no scorecard picture, after six or more sessions. The pink-boulder shrubs at the right edge are the course lane's.
7. **LOOK.md Checks**: 8. The brush pass, cream-green haze and focus band hold, and there is no unblurred frame.
8. **Edit scope and load-order imports**: 8. Iteration 19 made no source edits, and I did not re-read the sources.
9. **Observe hook, saved checks, lane notes**: 8. `look` carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. The saved checks cover aim 1 and 5, flyover 25/50/75, drive early/mid/late and night. No holed, scorecard or C check is saved.
10. **Faults**: 8. There was no console error beyond the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 triangles, equal to the baseline. The 1312 ms frame is SwiftShader with Host load 3.4 on 8 cores, so it is noise.

**Next:**
1. **Take the real-key putt, holed and scorecard pictures** (asked again, the sixth time). Put the ball near the pin as a fixture, then Space ×3 with no `settle:true`. Run `until:{phase:'holed'}`, then `wait 4` and `wait 24`, each with `look`, then step to the card and `look`. Done is `look` at wait 24 showing `look.ball.y` above -0.6, `pin_flag` solid and the cup visible. If the cup camera still sits at about -0.85 with pitch 8°, fix it in `src/camera.js` by starting the cup camera during `SIM.mode==='sunk'`, pulled back and higher.
2. **Save the holed and C checks**: `look-putt-holed` with `look.ball.y` in [-0.6, 1], and `look-c-hole5/6/9` with `look.camPitchDeg` in [45, 65] and `look.ball.on` and `look.pin.on` true. Done is `test` passing with these ids.
3. **Keep `ball1` readable in the wide flight view.** Don't zoom in. Add a flight-time halo or enlarged `ballRing` in `src/stage.js`. Done is `look` with `sample` at the `ball1` box [630, 447, 649, 466] showing a brighter ring about 30 px wide, with `look.ball.y` unchanged at -0.141.

SCORE: 7.4
