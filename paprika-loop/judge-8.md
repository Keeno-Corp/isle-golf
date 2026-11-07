**Judge 8: scores**

00. **Odyssey-style dithering**: 6. On the hole 5 aim view `look.dither` is active (`subjectNdc` [0.032,-0.239], `depth` 10.13, no `radius` key). `nearFades` still reads `tree4_leaves0` and `tree5_leaves0`, which the look puts at the top edge and off to the right. The near trees in that look are `tree7_leaves0` [0,220,272,459] and `tree3_leaves0` [836,87,1062,267], and neither is listed. On the hole 1 settle view (ball on the green, flag close) `nearFades` is `tree7_leaves0`, `bell_body` and `bell_roof`, and none of those are in that look's on-screen list. So `nearVisible` is not yet filtering correctly. The raw-alpha bypass is in `post.js` but I did not zoom on a dither circle. There is no near-plane save and no putt-dither picture.

0. **Wider framing, smoother ground**: 8. Aim `fov` is 32.97 and `look.ball.y` is -0.371. `golfer_body` is at [572,466,624,562], well above the bottom 20%. The `grass*` ground reads smooth. The title view is contained: `island` [122,207,1221,648] has margin on every side. There is still no before/after pair.

1. **Look lane goal**: 7. The aim view reads as a tilt-shift diorama: the top is blurred, `golfer_body` is crisp, shadows fall lower-right, and the `pin_flag` is visible. The hole 1 settle look shows `ball1`, `cup`, `pin_pole` and `pin_flag` sharp in the band and the top blurred. The holed camera was not caught this session.

2. **Look check 1 (aim blur band)**: 8. On hole 5 the top fifth is blurred and the golfer band is sharp. Holes 1 and 9 were not re-looked.

3. **Look check 2 (C on holes 5, 6, 9)**: 7. I did not re-run it this session; `look.camPitchDeg` is 22.1 at aim, and C was not exercised.

4. **Look check 3 (flyover, real-key drive)**: 7. A real three-Space drive on hole 1 settled with `look.ball.y` going -0.22 → -0.505 → peak -0.067 → -0.431, so the ball stayed on screen the whole flight. The flyover 25/50/75 was not re-run.

5. **Look check 4 (sea, key light, night)**: 8. Title `sample` at (5,790) is #2c6963 and at (1270,790) is #205d55, both within 30/255 of #0f6a67. The left-middle point (5,400) is #218981, so it is further off. Shadows fall lower-right. Night was not re-looked.

6. **Critic views and course findings**: 5. The aim view still shows pink boulders at the fence (course lane, noted once). `pin_flag` is small at 0.091% on aim but large on the putt view. There is still no meter picture, holed picture or scorecard picture.

7. **LOOK.md Checks**: 7. The brush pass, haze, band and warm sun hold in all the looks.

8. **Edit scope and load-order imports**: 9. No new source files.

9. **Observe hook, saved checks, lane notes**: 7. `look.*` keys are present. The `look-holed-cup` save exists but the near-plane and putt-dither saves are still missing.

10. **Faults**: 7. There are no console errors, only the `toNonIndexed` warning. `perf` reads 181 draws and 367k triangles on the title, under the 307 / 486k baseline. The 881 ms frame is SwiftShader at host load 3.6, so it is noise.

**Next:**
1. **`nearFades` accuracy (asked again).** In `camera.js` `nearVisible`, require the candidate's projected rect to overlap the viewport and its nearest depth to be inside the fade range. Compute the depth per mesh from the actual world corners, not the group's bounding sphere. Skip meshes behind the eye or off screen. `bell_body` and `bell_roof` on the hole 1 green are wrong, and so are `tree4` and `tree5` on the hole 5 aim view. One `observe` shows it done: on hole 5 aim, `look.dither.nearFades` lists only trees that `look` places inside the frame (`tree7_leaves0` and `tree3_leaves0`). Add the missing `radius` key to the dither object on the aim view as well. Then run a `look` with `zoom` on the dither circle to show the survivors are raw and unblurred.
2. **Missing proofs.** (a) Save a `look-dither-nearplane` check: place the ball as a fixture behind `tree7` or `tree3`, use real A/D keys, and expect `look.dither.active` plus a non-empty `nearFades`. (b) Take the real-key putt `look` at 4, 12 and 24 frames after `phase: "holed"`, and confirm `look.ball.y` > -0.6 at the early frames too. (c) Take a before/after aim pair, then the Space-meter picture and the scorecard picture.
3. **Course-lane notes and flag.** Keep the `pin_flag` out of the heaviest blur on far holes; at 0.091% on the hole 5 aim view it is almost invisible. Record the pink boulders in `lanes/look.md` once, then run `look` `sample` on the title at (5,400) (#218981) after any sea tweak, so the left edge stays near teal.

SCORE: 7.1
