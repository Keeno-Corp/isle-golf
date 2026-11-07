The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 9

**Judge 9: scores**

00. **Odyssey-style dithering**: 6. The hole 1 intro look reports `look.dither` active (`subjectNdc` [0.033,0.352], `radius` 0.13), and `look-dither-occluder-tree` passes. Three things from the last verdict are still open. There is no saved near-plane check. There is no zoomed look showing the dither survivors are raw and unblurred. `nearFades` accuracy against a picture is unproven; I did not re-check it this session.

0. **Wider framing, smoother ground**: 8. The `camera.fov` reads 31.88 in the intro and 33 on the aim view in the last verdict. The `golfer_body` sits at [1132,520,1181,581] and `look.ball.y` is -0.501, so both are above the bottom 20%. The `grass*` ground reads smooth, with no blocky texels. There is still no before/after pair.

1. **Look lane goal**: 7. The intro at `camPitchDeg` 55.5 shows both `pin_pole` and `ball1`, so the pin is in frame mid-flyover. The top is blurred and the lower band is sharp. Shadows fall lower-right. The holed camera and night were not looked at this session.

2. **Look check 1 (aim blur band)**: 7. The intro frame has the top blurred and `golfer_body` crisp. I did not look at the aim view of holes 1, 5 and 9 this session.

3. **Look check 2 (C on holes 5, 6, 9)**: 8. The saves `look-c-hole5-broadside`, `look-c-hole6-pitch` and `look-c-hole9-broadside` pass on rerun.

4. **Look check 3 (flyover, real-key drive)**: 7. The flyover at `flyoverT` 0.399 has the pin on screen at NDC (-0.655, 0.497). I did not re-run the drive or the 25/50/75 looks.

5. **Look check 4 (sea, key light, night)**: 7. The sea shows at the top right of the aim view, and shadows fall lower-right. I took no title `sample` and no night look this session.

6. **Critic views and course findings**: 5. A pink boulder is still visible at the cliff edge, at about [660,60]. The `pin_flag` is only 0.0086% of the frame in this intro view, so it is nearly invisible from this camera. There is still no meter picture, scorecard picture or flight picture from this session.

7. **LOOK.md Checks**: 7. The brush pass, haze and warm sun hold in the intro look.

8. **Edit scope and load-order imports**: 9. The sources are still only stage, post and camera.

9. **Observe hook, saved checks, lane notes**: 7. `look.camPitchDeg`, `flyoverT`, `ball`, `pin`, `golfer` and `dither` are all present, and 10 of 10 saved checks pass. The near-plane save is still missing, and so is a putt-dither save.

10. **Faults**: 8. There are no console errors, only the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 triangles, which is at the baseline and not a regression. The 1251 ms frame is SwiftShader at host load 2.9, so it is noise.

**Next:**
1. **Close the dither proof (asked again).**
   - Save `look-dither-nearplane`. Use `setState` to place the ball behind `tree7` or `tree3` on hole 5 (zero-based hole 4, check `observe().hole` first). Press real A/D keys, expect `look.dither.active` true and `look.dither.nearFades` non-empty, and save.
   - Then run one `look` with `zoom` on the dither circle at `subjectNdc`. It should show the surviving pixels raw and crisp inside a blurred scene.
   - Also check that every name in `nearFades` has a rect on screen.
2. **Run the missing critic views.** Take the Space meter, the real-key putt and the scorecard.
   - For the putt, take `look` at 4, 12 and 24 frames after `phase: "holed"`, with `look.ball.y` above -0.6.
   - Then take the scorecard. Add a before/after aim pair for the wider framing.
3. **Make `pin_flag` readable on the far-pin aim and intro views.** It is 0.0086% of the frame in the intro. Either keep it in the sharp band or enlarge the flag's screen footprint through the camera pullback, not the course files. One `look` on hole 1 intro and hole 5 aim should show the flag above 0.03%.

Record the pink boulders in `lanes/look.md` once as a course-lane item. After any sea tweak, `sample` the title at (5,400), which was #218981 last time.

SCORE: 7.2

## Iteration 10
**Did**: No source edits. Saved `look-dither-hole5-tree7-circle` in game-tests.json (hole 5 fixture, ball -3,-5.4, real A key: `look.dither.active`, `occluders[0]` tree7_leaves0, `radius` in 0.2–0.4). Tried saving `look-dither-nearplane` with `nearFades.0` existing; it failed because nearFades is empty in this fixture (nothing within the 3.4 fade range), so it was not saved.
**Saw**: Hole 5 aim: the `look` picture shows tree7_leaves0 (15% of frame) with a Bayer-dither circle (radius 0.298) round the golfer. The golfer inside it is crisp and the tree outside is solid, so the survivors are raw, not blurred. Hole 1 aim: the current pin's red flag is readable at about [690,325] in the picture; `pin_flag` ×7 sums to 0.13% across all holes, and the hole 5 aim view shows its flag at about [215,170]. The pink boulders are still visible at the cliff edge (course lane). `test` and `perf` not run.
**Next**: save a near-plane check by setState-ing the ball right beside a tree (find one with nearFades non-empty); Space-meter, real-key putt (4/12/24 frames after holed) and scorecard pictures; a before/after aim pair for the wider framing; sample title (5,400) after any sea tweak.
**Open**: `nearFades` accuracy is still unproven against a picture; no near-plane save; pink boulders are a course-lane item, not yet in lanes/look.md.
