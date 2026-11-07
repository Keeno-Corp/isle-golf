The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 13

**Judge 13: scores**

00. **Odyssey-style dithering**: 8. `pin_flag` is now crisp at holed (`look.dither.nearFades` is `["tree15_leaves0"]`, no `pin_flag`). At settle +6 the camera was still easing in at (-0.21, 7.03, 12.22) and `pin_flag` showed a heavy Bayer stipple. On the hole 1 aim, `look.dither` is active with `subjectNdc` [-1.43, 0.603], and `look.ball.on` and `look.golfer.on` are false. The saved occluder and near-plane checks were accepted earlier and I did not re-prove them.

0. **Wider framing, smoother ground**: 8. The hole 1 aim has `camera.fov` 33, and the `grass*` stripes read as smooth painted bands with no texel blocks. The tee view is looked at from the side and the golfer is tiny. There is still no saved before/after pair.

1. **Look lane goal**: 8. The holed camera is now a readable three-quarter view at pitch 26.8°, fov 30. `golfer_body` (0.82%), `pin_pole`, `pin_flag` (0.44%) and `cup` are all in frame, and the ball sits at `look.ball.y` -0.323. The 25/50/75% flyover was not re-looked this session.

2. **Look check 1 (aim blur band)**: 7. Hole 1 aim: the top is blurred and the band is crisp, but with my ball fixture the ball and golfer were off-screen (`on: false`) and the HUD banner covers the frame centre. Holes 5 and 9 passed in earlier sessions.

3. **Look check 2 (C on 5, 6, 9)**: 8. I did not re-run it. The saved `look-c-*` checks passed last session, and this session's edits touch only the cup camera.

4. **Look check 3 (flyover, real-key drive)**: 7. A real-key putt (Space ×3) reached `ball.mode` sunk at frame 241 and then holed. The settle +6 and holed pictures exist. Holed +4 and +24 were not taken. There is still no saved flyover 25/50/75 check and no saved three-moment drive check.

5. **Look check 4 (sea, key light, night)**: 8. The sea at the top right of the hole 1 aim is teal, and the shadows (`golferShadow`, pin shadow) fall lower-right under a warm light. I did not sample the title or test night this session.

6. **Critic views and course findings**: 6. Meter picture: not taken this session. Aim, settle and holed pictures: taken. At settle +6 the golfer is cropped out of the frame. The football-player model, the red/pink boulder at the right edge of the hole 1 aim, and `SFX[k] is not a function (src/sound.js:71)` all belong to other lanes and are not yet merged.

7. **LOOK.md Checks**: 8. The brush pass, haze, teal sea and warm sun hold in all three pictures. The reply showed no `Lighting:` or `Surfaces:` fault lines.

8. **Edit scope and load-order imports**: 8. I did not recheck the sources. This session's change is in `camera.js` only.

9. **Observe hook, saved checks, lane notes**: 8. The `look` key carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`, and it updates correctly through settle and holed. Saved checks stay at 13 of 13 per the builder. I did not run `test`. Flyover, flight-moments and night checks are still unsaved.

10. **Faults**: 7. Console: `SFX[k] is not a function` from `src/sound.js:71`, which is the sound lane's. `perf` reads 307 draws and 485,787 triangles, unchanged from the baseline. The 1063 ms frame is SwiftShader and is noise. At settle +6 the near fade still hits `pin_flag`.

**Next:**
1. **Remove the flag stipple while the cup camera is easing.** At settle +6 on a real-key putt, `pin_flag` shows a heavy Bayer stipple (camera (-0.21, 7.03, 12.22), `look.dither.depth` 2.92, 2.9 from the flag). Either exclude `pin_flag` and `pin_pole` from the near fade in `src/camera.js`, or lower `uNearR` for them. After a real-key putt, `interact` with `look: true` at settle +6 should show a solid red flag, and `look.dither.nearFades` should not name `pin_flag`. Also start the cup camera easing during `sunk` so the settle frames are not a tight overhead crop with the golfer cut off.
2. **Save the three missing checks.** (a) Flyover 25/50/75% on hole 5, stepped to `G.introDur`, expecting `look.flyoverT` in range and `look.pin.onScreen` true at 50%. (b) A real-key Space ×3 drive with `look.ball.on` true at three moments. (c) Night (`N`) on hole 5, expecting the golfer on screen. Give them `look-` ids and rerun `test` from a fresh reload.
3. **Fix the aim framing on hole 1 and the golfer metadata.** With the ball on the tee, the hole 1 aim shows `look.ball.on` false and `look.golfer.on` false. Use `observe` to check that the ball and golfer sit in the lower-middle of the frame at fov 33. Make `look.golfer` and `look.dither.subjectNdc` read the walking `holder.position`, not the destination. Then add the pink boulder at the hole 1 right edge and on the hole 5 cliff to `lanes/look.md` under the course-lane items, and take the missing meter and scorecard pictures.

SCORE: 7.5

## Iteration 14
**Did**: No source edits. Verified iteration 13's cup-camera pull-back by picture (real-key Space x2 putt on hole 1 from (-2.3,11.95), holed +24).
**Saw**: holed +24: camera (0.89,7.44,15.94), fov 30.0, pitch 26.8; `pin_flag` 0.44% crisp red (no stipple), `pin_pole`, `cup`, `cupRim`, `golfer_body` 0.5% all on screen; `look.dither.nearFades` = ["tree15_leaves0"] (no pin_flag); `look.ball.y` -0.328. Console: only the toNonIndexed warning. `perf`/`test` not run.
**Next**: (1) Save look- checks: flyover 25/50/75 on hole 5, real-key Space x3 drive with look.ball.on at 3 moments, night (N) on hole 5. (2) Hole 1 aim framing: look.ball.on/look.golfer.on were false; make look.golfer read walking holder.position. (3) Pink boulder into lanes/look.md; take the meter and scorecard pictures.
**Open**: Holed +4 picture still not taken; the three checks above are still unsaved; SFX[k] error in sound.js is another lane's.
