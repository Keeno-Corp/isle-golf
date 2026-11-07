**Judge 7: scores**

00. **Odyssey-style dithering**: 7. On hole 5 aim `look.dither` is `active` with `subjectNdc` [0,-0.231], `radius` 0.301 and `depth` 10.1, and `patched` is 103 materials. `occluders` is `[]`. `nearFades` still lists `tree4_leaves0` and `tree5_leaves0`. The `look` on-screen list puts `tree7_leaves0` [0,220,251,461] and `tree3_leaves0` [815,94,1039,272] near the camera, and tree4/tree5 appear only under "Not found by the ID image". Nothing changed on this item in iteration 7. I did not see the dither bypass of the Kuwahara and blur passes, a putt dither picture, or a near-plane save.

0. **Wider framing, smoother ground, ball above the bottom 20%**: 8. Aim `fov` is 33 and `look.ball.y` is -0.366. `golfer_body` is at [551,459,604,556], well above the bottom 20%, and the `grass*` and `island` ground reads smooth. There is still no before/after pair.

1. **Look lane goal**: 6. The aim view reads as a tilt-shift diorama: the top is blurred, `golfer_body` is crisp, shadows fall lower-right, `focusY` is 0.455, and the `pin_flag` is red and visible top-left. C on hole 9 shows a tilted whole-hole view with the pin and tee. The holed camera was not caught at phase `holed`, so it is still unproven. My attempt to drive a real-key putt failed on a key-name error (I sent "space" instead of " "), so the putt picture is missing.

2. **Look check 1 (aim blur band, ball above the bottom 20%)**: 8. Hole 5: the top fifth is blurred, the band around `golfer_body` is sharp, and `look.ball.y` is -0.366. Holes 1 and 9 were not re-looked.

3. **Look check 2 (C on holes 5, 6, 9)**: 8. The hole 9 C look shows a perspective tilt with the tee and pin region on screen. Pitch was not read by `observe`. The earlier overlay report says holes 5, 6 and 9 pass.

4. **Look check 3 (flyover, real-key drive)**: 7. The flyover 25/50/75 and the three-moment drive were not re-run this session. They stand on earlier passes.

5. **Look check 4 (sea colour, key light, night)**: 7. The title look shows the island fully inside the frame with margin after `DIO.fov` 29, and teal sea along the bottom. I did not `sample` the corners, because the sheet mode does not allow it. The top corners are hazy sky, which is correct per the supervisor. Night is readable: dark, with the `golfer_body` and the aim line still visible.

6. **Critic views and course-lane findings**: 5. The aim view still shows pink-red boulders by the fence (course lane, noted once). `pin_flag` is small but readable at 0.092%. This session had no meter, holed or scorecard picture.

7. **LOOK.md Checks**: 7. The brush pass, haze, tilt-shift, warm sun and night all hold.

8. **Edit scope and load-order imports**: 9. No `dither.js` and no new source files.

9. **Observe hook, saved checks, lane notes**: 7. The `look.*` keys are all present. There is still no `look-holed-cup`, near-plane or putt-dither saved check.

10. **Faults**: 7. There are no console errors, only the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 tris, no regression. The 1181 ms frame time is SwiftShader at host load 3.6, so it is noise. The `nearFades` inaccuracy is described under item 00.

**Next:**
1. **Dither correctness and metadata (Must have 00, asked again).** In `camera.js`, make `nearFades` list only meshes that have visible fragments inside the near fade range. Project each candidate's bounding box or sample points, and skip anything off screen or farther than the fade range. Make the dither `subject` follow the holder's live position. Add a saved `look-dither-nearplane` check and a putt-on-green dither look. One `observe` shows it done: on the hole 5 aim view, `look.dither.nearFades` is only `tree7_leaves0` and `tree3_leaves0`. Then confirm the dither pixels bypass the Kuwahara and blur passes with `look` `zoom` on the dither circle.
2. **Holed camera proof (asked again).** Run a real-key putt on hole 1 and step frame by frame to `phase: "holed"`. Use `" "` as the space key, not "space". Take `interact` with `look: true` and `expect` `look.ball.y` > -0.6. Save it as `look-holed-cup`. Done when the saved check passes in `test`, and the picture shows the cup and ball with the golfer not cropped.
3. **Missed critic views and title samples.** Capture the meter picture (the first Space click), the scorecard, and the in-flight ball. Run `look` with `sample` alone at (1270,10), (5,10), (5,400) and (5,790) on the title. Add a before/after aim pair for the wider framing.

SCORE: 7.0
