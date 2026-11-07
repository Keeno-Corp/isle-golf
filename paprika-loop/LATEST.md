The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 17

**Judge 17: scores**

Pictures this session: one hole 5 flight view, taken 25 frames after launch (`look-1`) after a real-key Space ×3 drive from `{hole:4,skipIntro:true}`. I did not look at the flyover, C, holed camera, night, title or scorecard views.

00. **Odyssey-style dithering**: 8. In the flight view `look.dither` is `active:true` with `subjectNdc` [0, -0.19], matching `look.ball.y` -0.19. `tree3_leaves0` and `tree0_leaves0` stay solid at the right, which is correct because they are not between the camera and the ball. There was no console error.

0. **Wider framing, smoother ground**: 8. `camera.fov` is 33. The `grass*` stripes are smooth bands with no texel blocks. The island, `pond_water`, `house_walls` and the trees all read. There is still no saved before/after pair.

1. **Look lane goal**: 8. The iteration 17 flight change helped. `ball1` sits at `look.ball.y` -0.19, `on-screen`, with the `ballTrail` dotted line under it, and the camera has left the golfer. Only the `club_head` and part of `golfer_body` show at the bottom edge. The ball is still small: `ball1` is 0.041% of the picture, about 23×23 px, up from 19 px but under the 0.06% target.

2. **Look check 1 (aim blur band)**: 7. I did not re-look at aim this session. The flight picture shows the top blurred and the centre crisp, and the last session's aim result still stands.

3. **Look check 2 (C on 5, 6, 9)**: 6. Not looked at this session. The golfer is still a speck from the earlier sessions.

4. **Look check 3 (flyover, real-key drive)**: 7. The real-key drive keeps `look.ball` on screen at 25 frames into flight, at y -0.19 (target: above -0.6). The three-moment drive and the flyover at 25/50/75% are still not saved as checks.

5. **Look check 4 (sea, key light, night)**: 7. In the flight picture the `sea` is teal at the top. The shadows of `tree3_trunk` and the bushes fall lower-right. There were no `Lighting:` or `Surfaces:` fault lines. I did not test night.

6. **Critic views and course findings**: 7. Aim, meter and flight are pictured; the scorecard is still missing. A pink-boulder shrub still shows at the right in the flight picture. That is the course lane's, so record it once.

7. **LOOK.md Checks**: 8. The brush pass, cream-green haze, warm sun and the focus band all hold, and there is no unblurred frame.

8. **Edit scope and load-order imports**: 8. Iteration 17 touched only `src/camera.js`. I did not re-read the sources.

9. **Observe hook, saved checks, lane notes**: 7. `look` carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. The flyover, drive and night `look-` checks are still unsaved.

10. **Faults**: 8. There were no console errors. `perf` reads 307 draws and 485,787 triangles, equal to the baseline. The 1107 ms frame is SwiftShader (Host load 3.8 on 8 cores), so it is noise.

**Next:**
1. **Save the three missing `look-` checks** (asked again, fourth time; the fixture and keys below work as I ran them). (a) Drive: `{state:{hole:4,skipIntro:true}}`, `wait 150`, Space ×3 with `wait 20` between, `until:{phase:'flight'}`, `wait 25`, `expect` `look.ball.onScreen`-style values `look.ball.y: [-0.6, 0.6]`. (b) Flyover from the title with Space, `expect` `look.flyoverT` ranges and `look.pin` in -1..1 at 50%. (c) Night (N) on hole 5. Done is `test` rerunning the new `look-` ids from a fresh reload, all passing.
2. **Make the ball larger in flight.** `ball1` is 23 px (0.041%) at 25 frames. In `src/camera.js`, pull the flight camera D from 6.2 toward ~5, or raise the ball's scale in flight (check the lane's stage code), then `look` at the same step. Done is `ball1` at 0.06% or more with `look.ball.y` still above -0.6. Do not revert the faster leave-the-golfer change.
3. **Take the scorecard picture and the real-key holed views, then fix the C golfer size.** Putt in with real keys, `until:{phase:'holed'}` with `wait 4` and `wait 24`, then `look` with `pin_flag` solid and `nearFades` not naming it, then the card. On the hole 5 C view, fit the camera broadside to the tee→pin vector so `golfer_body` is at least 0.1% of the picture at pitch 55°.

SCORE: 7.3

## Iteration 18
**Did**: Restored the `src/camera.js` non-putt flight camera to D 7.8 / H 3.9, as the changed PROMPT.md asks (the owner wants a wider flight view). I tried D 5.0 / H 2.8 for a moment and reverted it before any picture. The faster k 8 is unchanged. I saved five new `look-` checks in `game-tests.json`: `look-flyover-25`, `look-flyover-50`, `look-flyover-75`, `look-drive-mid` and `look-night-hole5`. The last two first failed a fresh reload with `state_not_realized`, because a top-level `state` of `hole:4, skipIntro:true` doesn't match `observe()`. I changed them to an empty `state` with `newRound` plus a `state` step in `actions`, the way `pond-costs-a-stroke` does it.
**Saw**: `test` from a fresh reload passes 18 of 18. The drive check, with real Space ×3, reads `look.ball.y` -0.16 and `look.ball.on` true at 25 frames into flight on hole 5. The camera was at fov 33 and pitch 21.6°. The flyover reads `look.flyoverT` 0.254, 0.504 and 0.754 at 57, 114 and 171 frames, and `look.pin.on` is true at 50%. Night on hole 5 reaches phase aim, and `look.dither.nearFades` names `tree4_leaves0`. I took no pictures and ran no `perf` this session.
**Next**: (1) Save `look-drive-early` and `look-drive-late`, and aim checks for holes 1 and 5. (2) Save the real-key holed and scorecard checks, then take the scorecard picture. (3) Make no more camera refinements until those are saved. The owner wants the wide flight view kept, so don't zoom back in on the ball.
**Open**: `look-drive-mid` and `look-night-hole5` set their hole with a `state` step, so the fixture is not checked against `observe()`. I have not looked at a picture of the restored flight camera.
