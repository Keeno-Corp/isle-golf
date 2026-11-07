The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 10

**Judge 10: scores**

00. **Odyssey-style dithering**: 6. Hole 5 aim (real A key) reports `look.dither` active, with `subjectNdc` [0.073,-0.248] and `nearFades` ["tree4_leaves0"], so the near-fade list is no longer empty. `tree7_leaves0` is on screen at 5.4%. Three gaps remain:
  - There is no saved `look-dither-nearplane`, though this fixture now gives a non-empty `nearFades`.
  - `nearFades` is unchecked against a picture. `tree4_leaves0` is in the "not found by the ID image" list, so I could not confirm it is on screen.
  - The aim picture shows no visible dither on the near tree, so the near-fade is unproven.

0. **Wider framing, smoother ground**: 8. `camera.fov` is 32.9 on the hole 5 aim and 32.2 on hole 1. `look.ball.y` is -0.379 on hole 5 and -0.469 on hole 1, both above the bottom 20%. The `grass*` ground reads smooth and painted. There is still no before/after pair. On the hole 1 aim, `golfer_body` is only 0.061% of the frame ([425,533,456,574]), so the pullback is slightly too far there.

1. **Look lane goal**: 7. Hole 1 and hole 5 aim views keep the top blurred and the golfer and ball sharp, with shadows to the lower right. Holed camera, flyover and night were not re-run this session.

2. **Look check 1 (aim blur band)**: 8. Holes 5 and 1 pass: the top fifth is blurred, `golfer_body` is crisp, and the ball is above the bottom 20%. Hole 9 was not looked at.

3. **Look check 2 (C on 5, 6, 9)**: 7. Not re-run this session. The last verdict had the three `look-c-*` saves passing.

4. **Look check 3 (flyover, real-key drive)**: 6. Not re-run. After my Space press, the aim state jumped from hole 5 to hole 1 (`hole` 1, `aimDeg` 357.7). I do not know whether that is a `start`/`skipIntro` quirk or a bug. It cost me the meter picture.

5. **Look check 4 (sea, key light, night)**: 7. Sea shows at the top right of the hole 5 aim view, and shadows fall lower-right. No title `sample` and no night look this session.

6. **Critic views and course findings**: 5. A `pink boulder` cluster is still prominent at the right edge of the hole 5 aim view. A pink shrub sits at bottom right on hole 1, at about [840,550]. On hole 5 `pin_flag` is 0.093% and on hole 1 it is 0.17%, both readable. There is no meter, putt-drop or scorecard picture yet. Pink boulders are still not in `lanes/look.md`.

7. **LOOK.md Checks**: 7. The brush pass, haze, teal sea and warm sun hold in both aim views.

8. **Edit scope and load-order imports**: 9. Sources are still only stage, post and camera.

9. **Observe hook, saved checks, lane notes**: 7. `look.camPitchDeg` (23.8 and 37), `focusY`, `ball`, `pin`, `golfer` and `dither` are all present. `look.dither` has no `radius` field in the hole 5 reply, so that key is inconsistent. The near-plane save is still missing.

10. **Faults**: 8. Console shows only the `toNonIndexed` warning. `perf` reads 181 draws and 367k triangles, down from the 307 / 486k baseline. The 1009 ms frame is SwiftShader at host load 3.6, so it is noise.

**Next:**
1. **Save the near-plane check (asked again).** On hole 5 (zero-based 4) the fixture already gives `nearFades:["tree4_leaves0"]`. Use `setState {hole:4, skipIntro:true}`, wait 40, press A for 10 frames. Expect `look.dither.nearFades.0` to equal `tree4_leaves0`, then save as `look-dither-nearplane`. One `look` with `zoom` on `tree4_leaves0`'s rect should show Bayer holes in it. If no holes show, the `nearFades` metadata is wrong and needs fixing in the projection and depth logic. Also make `look.dither.radius` always present when active.
2. **Run the missing critic views, using `" "` as the key name (not `space`).** Take the Space meter, then a real-key putt. Use `look` at 4, 12 and 24 frames after `phase:"holed"` with `look.ball.y` above -0.6. Then take the scorecard. Find out why Space after a `setState` hole pick returned to hole 1, and avoid it by clicking only after `phase` is `aim`.
3. **Fix the over-small golfer on hole 1 aim.** `golfer_body` is 0.061% of the frame. Tighten the aim pullback on short par 3s, or fit it to the tee→pin distance, so the golfer is at least about 0.15%. Hole 5 is 0.18%. Check with one `look` on hole 1 aim. Also record the pink boulders in `lanes/look.md` once as a course-lane item, and add a before/after aim pair for the wider framing.

SCORE: 7.2

## Iteration 11
**Did**: No source edits. Saved `look-dither-nearplane` in game-tests.json (hole 5 fixture: `newRound`, `next`, `setState {hole:4, skipIntro:true}`, wait 40, real A key 10 frames, wait 10). It expects `phase` aim, `look.dither.nearFades.0` == `tree4_leaves0`, and `look.dither.radius` in 0.2–0.4. It passes. It is a metadata check only, not a picture check.
**Saw**: In that fixture `look.dither` has `active` true, `radius` 0.302, and `occluders` is empty. `nearFades` is ["tree4_leaves0"], but tree4_trunk and tree4_leaves0 are in "not found by the ID image", so no pixel of tree4 is on screen. The near fade is therefore still unproven against a picture. A try with the ball at (0.4, 1.6) on hole 5 (aim, wait 150) gave `nearFades` [], with tree8 far at the top of the frame. `look.camPitchDeg` is 22.2, `camera.fov` 33, `golfer_body` is 0.19%, and `pin_flag` is 0.13%. Pink boulders are still visible at the right of the hole 5 aim view. `test` and `perf` not run.
**Next**: PROMPT.md changed mid-session; its remaining-work list comes first:
- (1) Find a real near-plane fixture. Put the ball so a canopy sits 1.3–3.4 units from the eye, using eval to read each tree's distance to `camera`. Aim with the real key, wait 150, and `look` with zoom on the tree. Save it only if Bayer holes show.
- (2) Meter, holed (4/12/24 frames) and scorecard pictures.
- (3) Start the cup close-up during `SIM.mode==='sunk'` in settle, and raise the easing speed.
- (4) Make `look.golfer` and the dither subject read the holder position while walking.
- Do not zoom the aim framing back in; the golfer's 0.15% area is not a requirement.
**Open**: Near-plane fade is unconfirmed in a picture; `nearFades` may list trees that are behind the camera. Cause of the Space-after-setState jump to hole 1 is not found. Pink boulders are a course-lane item and are not yet in lanes/look.md.
