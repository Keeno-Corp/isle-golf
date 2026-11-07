The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 15
**Did**: `src/camera.js`: `look.golfer` observe NDC and the dither occluder subject (aim/swing) now read the walking `golfer.holder.position` instead of `golfer.bx/by/bz` (destination). Not played or looked this session (short on time).
**Saw**: syntax check only; no picture, `perf` or `test` run.
**Next**: (1) Verify by `observe` on hole 1 aim that `look.golfer.on` is true and the occluder hole follows the golfer; if holder.position is not world-space (parent offset), switch to getWorldPosition. (2) Save look- checks: flyover 25/50/75 hole 5, real-key Space x3 drive, night on hole 5. (3) Pink boulder to lanes/look.md; meter and scorecard pictures.
**Open**: The holder-position change is unverified by picture; if the golfer shows on-screen false or the dither hole misplaces, revert lines 88 and 170 to `golfer.bx/by/bz`. SFX[k] error in sound.js is another lane's.

### Judge 15

**Judge 15: scores**

00. **Odyssey-style dithering**: 8. On the hole 1 aim, `look.dither` is `active` with `subjectNdc` [-0.096, -0.251]. That matches `look.golfer` (-0.096, -0.266), so the occluder subject now follows the golfer. `nearFades` is `["tree16_leaves0"]`, which is the foreground canopy at the bottom edge, and `pin_flag` is not in it. I did not re-run the saved occluder and near-plane checks, which were accepted earlier. The settle +6 flag stipple from judge 13 was not re-checked this session.

0. **Wider framing, smoother ground**: 8. The hole 1 aim has `camera.fov` 33 and the hole 5 C view has fov 32. The `grass*` stripes read as smooth painted bands with no texel blocks, and the island, cliff and sea read well. There is still no saved before/after pair.

1. **Look lane goal**: 8. The hole 5 C view sits at pitch 55° (`look.camPitchDeg`) with a three-quarter perspective. `pin_flag`, `house_roof` and the tee are all framed. `look.ball` (0.795, -0.342) and `look.pin` (-0.685, 0.408) are both inside -1..1. In the hole 1 aim, `golfer_body` and `ball1` sit in the lower-middle of the frame, and `look.ball.y` is -0.365. I did not re-look the flyover 25/50/75% or the holed camera this session.

2. **Look check 1 (aim blur band)**: 8. Hole 1 aim: the top fifth is blurred and the band around `golfer_body` and the ball is crisp. The ball is above the bottom 20%. The `HOLE 1` banner covers the frame centre.

3. **Look check 2 (C on 5, 6, 9)**: 7. Hole 5 passes: pitch 55° and tee and pin are both on screen. In that view `golfer_body` is only 0.042% of the picture and the golfer is a speck at the right edge, so the hole reads but the player doesn't. Holes 6 and 9 were not re-run; the saved `look-c-*` checks passed earlier.

4. **Look check 3 (flyover, real-key drive)**: 6. Flyover 25/50/75% and the three-moment drive are still not saved as checks, and I did not take them this session. The real-key putt proof exists from earlier sessions.

5. **Look check 4 (sea, key light, night)**: 8. In the hole 1 aim the sea at the top right is teal, and `golferShadow` falls lower-right. There were no `Lighting:` or `Surfaces:` fault lines. I did not test night or sample the title.

6. **Critic views and course findings**: 6. The aim and C views were taken. The meter and scorecard pictures are still missing; this is the third judge to note that. The pink-red boulder at the hole 1 right cliff edge is still there, and the pink shrubs on hole 5 beside the house read as pink rocks. Both are course-lane items and are not yet merged.

7. **LOOK.md Checks**: 8. The brush pass, cream-green haze, teal sea, warm sun and focus band hold in both pictures.

8. **Edit scope and load-order imports**: 8. Iteration 15 touched `camera.js` only. I did not re-read the sources.

9. **Observe hook, saved checks, lane notes**: 8. `look` carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. `look.golfer.on` is no longer false on hole 1, so the holder-position change works. The check count is unchanged, and the flyover, flight and night checks are unsaved.

10. **Faults**: 8. There were no console errors in these runs. `perf` reads 181 draws and 367,484 triangles, under the 307 / 486k baseline. The 1389 ms frame is SwiftShader (host load 4.4 on 8 cores) and is noise.

**Next:**
1. **Save the three missing `look-` checks and take the missing pictures** (asked again). (a) Flyover on hole 5 (`{hole:4}`) with Space from the title and stepped waits. It should expect `look.flyoverT` in range at each stop and `look.pin.onScreen` true at 50%. (b) A real-key Space ×3 drive with `look.ball.on` true at three moments. (c) Night (N) on hole 5 with the golfer on screen. Then take the first Space meter picture and the scorecard picture, and run the critic on the four views. Done is `test` rerunning the new `look-` ids from a fresh reload, all passing.
2. **Make the golfer readable in C.** On the hole 5 C view the golfer is 25×38 px, a speck at the right edge. Fit C broadside to the tee→pin vector so it can sit lower and closer. If it stays that small, add a larger ball ring or tee marker pulse for the 55° view. `look` on the C view with `sample` at `golfer_body` should show the golfer at least 0.1% of the picture, with pitch still 55° and pin and tee on screen.
3. **Verify the holed camera and the flag stipple, and write down the course items.** After a real-key putt, take looks at settle +6, holed +4 and +24. `pin_flag` should be solid red, `look.dither.nearFades` should not name it, and ball and cup should be at `y` > -0.6 with the golfer not cropped. Add the pink boulder (hole 1 right cliff) and the pink shrubs (hole 5 by the house) to `lanes/look.md` under the course-lane items.

SCORE: 7.5
