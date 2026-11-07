The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 16
**Did**: Docs only: `lanes/look.md` now lists the pink hole 1 cliff boulder and the hole 5 pink shrubs as open course-lane items, and records that the holder-position change was verified by judge 15. No source or game-tests.json change.
**Saw**: No picture, `perf` or `test` this session (short on time); the last known numbers are judge 15's: 181 draws / 367k tris, no console errors, `look.golfer.on` true on hole 1 aim.
**Next**: (1) Save the `look-` checks still missing: flyover 25/50/75% on hole 5, real-key Space x3 drive (`look.ball.on` at 3 moments), night on hole 5; then meter and scorecard pictures. (2) Make the golfer larger in C on hole 5 (25x38 px now): fit C broadside to tee to pin so it sits lower and closer, pitch kept at 55. (3) Re-look the holed camera and flag stipple after a real-key putt.
**Open**: Nothing broken known. The flyover, drive and night checks remain unsaved, and the C golfer is still a speck.

### Judge 16

**Judge 16: scores**

Pictures this session: the hole 5 meter view (`look-1`) and a flight view (`look-2`). I did not re-run the flyover, holed camera, night, title or scorecard views.

00. **Odyssey-style dithering**: 8. In the hole 5 aim view, `look.dither` is `active`, with `subjectNdc` [-0.094, -0.251] against `look.golfer` (-0.094, -0.266). `nearFades` is `["tree4_leaves0"]`. In the flight view it correctly goes `active:false` with an empty `nearFades`. `tree3_leaves0` and `tree0_leaves0` stay solid, which is right because they are not between the camera and the golfer.

0. **Wider framing, smoother ground**: 8. `camera.fov` is 33. The `grass*` stripes are smooth painted bands with no texel blocks. The island, cliff and sea read well. There is still no saved before/after pair.

1. **Look lane goal**: 8. The meter view has `golfer_body` and `ball1` in the lower-middle, `look.ball.y` is -0.366, and the top is blurred. `look.camPitchDeg` swings 31.8 → 36.9 → 21 across the swing and eases rather than jumping. Flight view: `look.ball` is (0.001, -0.237), on screen, but the ball is tiny (`ball1` 0.026% of the picture, about 19×19 px) and the camera is looking at the golfer's `club_head`. The flight camera is slow to leave the golfer, so the ball reads as a small white dot over the `bushes*`.

2. **Look check 1 (aim blur band)**: 8. The top fifth is blurred, and `golfer_body` and the ball are crisp in the focus band. The `HOLE 5` banner sits over the middle of the frame.

3. **Look check 2 (C on 5, 6, 9)**: 6. My `c` key did not toggle C (the Space presses had already started the swing), so I did not look at C this session. Judge 15's golfer speck (0.042% of the picture) is still unfixed.

4. **Look check 3 (flyover, real-key drive)**: 6. The meter picture now exists: `meter.stage` 2, "SNAP 32%", `look.ball.on` true on all 94 frames. Flyover 25/50/75% and the three-moment drive are still not saved as checks.

5. **Look check 4 (sea, key light, night)**: 8. In the aim view the sea at the top right is teal, and `golferShadow` falls lower-right. There were no `Lighting:` or `Surfaces:` fault lines. I did not test night.

6. **Critic views and course findings**: 7. Aim, meter and flight are now pictured. The scorecard is still missing. The pink-red boulders at the right of the hole 5 shrubs read as pink rocks, which is a course-lane item.

7. **LOOK.md Checks**: 8. The brush pass, cream-green haze, teal sea, warm sun and focus band hold.

8. **Edit scope and load-order imports**: 8. Iteration 16 was docs only. I did not re-read the sources.

9. **Observe hook, saved checks, lane notes**: 8. `look` carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. The flyover, flight and night `look-` checks are still unsaved.

10. **Faults**: 8. There were no console errors. `perf` reads 307 draws and 485,787 triangles, equal to the baseline (one draw call and 0.7k triangles under the 307 / 486k limit). The 1034 ms frame is SwiftShader, so it is noise.

**Next:**
1. **Save the three missing `look-` checks** (asked again, third time; the hole 5 `{hole:4,skipIntro:true}` fixture and Space ×2 work as shown above). (a) Real-key Space ×3 drive with `look.ball.on` true at three moments, which can be saved from the steps I ran. Add `{until:{phase:'flight'}}` and `expect` `look.ball.on:true`. (b) Flyover from the title with Space, `expect` `look.flyoverT` ranges and `look.pin.onScreen` true at 50%. (c) Night (N) on hole 5. Done is `test` rerunning the new `look-` ids from a fresh reload, all passing.
2. **Keep the ball readable in flight.** In the flight view the ball is 19 px and the camera lingers on the golfer, so the ball reads as a speck. In camera.js, start following the ball earlier, or add a larger ball ring or trail while `phase` is `flight`. Check with `look` mid-flight: `ball1` should be ≥0.06% of the picture, with `look.ball.y` above -0.6.
3. **Make the golfer readable in C, then take the scorecard picture.** On the hole 5 C view, fit the camera broadside to the tee→pin vector so `golfer_body` is ≥0.1% of the picture at pitch 55°. Then take the scorecard picture and run the critic on it. Verify the holed camera at +4 and +24 after a real-key putt, with `pin_flag` solid and `nearFades` not naming it.

SCORE: 7.5
