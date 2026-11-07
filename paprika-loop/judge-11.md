Judging session 11 from what I've seen: the hole 1 aim and ball-in-flight views and `perf`. I'm writing the verdict now.

**Judge 11: scores**

00. **Odyssey-style dithering**: 6. On hole 1 aim (real D key), `look.dither` is active with `radius` 0.302 and `nearFades` ["tree16_leaves0"]. The only `tree16_leaves0` pixels are a 0.082% sliver at [609,791,728,799] at the bottom edge. In the picture the big bush at the bottom shows no visible Bayer holes. In flight `nearFades` is empty and no occluder is active. `look-dither-nearplane` is saved but checks metadata only. No picture proves a dithered canopy or an occluder hole, and tree8 or the cliff over the ball was not shown this session.

0. **Wider framing, smoother ground**: 8. `camera.fov` is 32.97 on aim and 33 in flight. `look.ball.y` is -0.385 on aim and -0.183 in flight, so the ball stays above the bottom 20%. The `grass*` ground reads smooth and painted, with no visible texel blocks. There is still no saved before/after pair. On the hole 1 aim, `golfer_body` is 0.19% of the frame ([549,469,602,564]), up from 0.061% last session. That is enough.

1. **Look lane goal**: 7. The aim and flight views keep the top blurred and the golfer and ball sharp. Shadows fall lower-right. The flight camera follows the ball with `golfer` still in frame. Holed camera, flyover and night were not re-run.

2. **Look check 1 (aim blur band)**: 8. Hole 1 passes: the top fifth is blurred and the band at the golfer is sharp. The ball is above the bottom 20%. Hole 5 passed last session. Hole 9 has not been looked at in several sessions.

3. **Look check 2 (C on 5, 6, 9)**: 7. Not re-run. The `look-c-*` saves passed in earlier sessions.

4. **Look check 3 (flyover, real-key drive)**: 7. Three real Space presses (`" "` key, waits 20/25/40) on hole 1 gave `phase` flight with `strokes` 1. The ball stays on screen at `look.ball` y -0.183. The meter and card were not pictured. Flyover 25/50/75 was not re-run.

5. **Look check 4 (sea, key light, night)**: 7. Sea is at the right edge of both views, and the sun and shadows read warm lower-right. There was no title `sample` and no night look this session.

6. **Critic views and course findings**: 5. A pink boulder is still prominent at the right of both views, near [850,300]. `pin_flag` is 0.12% on aim and 0.19% in flight, both readable. There is still no meter, holed-drop or scorecard picture. The pink boulders are still not in `lanes/look.md`.

7. **LOOK.md Checks**: 7. Brush pass, haze, teal sea and warm sun hold in both views. The `Lighting:` and `Surfaces:` lines were not re-checked.

8. **Edit scope and load-order imports**: 9. I did not recheck the sources this session. Last session had only stage, post and camera.

9. **Observe hook, saved checks, lane notes**: 8. `look.camPitchDeg` (22.4, 21.1), `focusY`, `ball`, `pin`, `golfer` and `dither` are all present. `dither.radius` is now present when active. During flight `dither` omits `active`, so the key set is inconsistent. `look-dither-nearplane` is saved.

10. **Faults**: 8. Console shows only the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 triangles, equal to the baseline, so no regression. The 1183 ms frame is SwiftShader at host load 3.3, which is noise. The main scene pass is 175 draws and 367k triangles.

**Next:**
1. **Prove the dither in a picture (asked again).** Find a fixture where a canopy covers the golfer or ball. Use `eval` to read each tree's distance to the camera, or put the ball behind tree8 (about (0.4,1.6), then wait 150). Then run a real aim key and a `look` with `zoom` on that tree's rect. Done looks like Bayer holes visible around the subject, with `look.dither.occluders` non-empty or `nearFades` naming a tree whose pixels are in that rect. On hole 1 aim, `tree16_leaves0` is only a 0.082% edge sliver. Check that near fades are not listing off-screen or behind-camera objects, and give `dither.active` in every phase.
2. **Run the missing critic views.** Take the Space meter picture. Then do a real-key putt, with `look` at 4, 12 and 24 frames after `phase:"holed"` and `look.ball.y` above -0.6. Then take the scorecard. Use `" "` as the key and `until:{phase:'holed'}` without `settle:true`. Start the cup close-up during `SIM.mode==='sunk'`. In the same pass, put the pink boulder (hole 1, right of the golfer) in `lanes/look.md` as a course-lane item.
3. **Save a before/after pair for the wider framing, and rerun the unrun checks.** Take hole 1 aim at fov 33 and fov ~26 for the pair, then rerun `look-aim9`, flyover 25/50/75 and night. `test` has not been rerun for several sessions, so run it and report which saves pass.

SCORE: 7.2
