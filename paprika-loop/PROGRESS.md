# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1
**Did** (camera.js, stage.js only; post.js untouched): `sun.position` → (-22,28,-16), shadows now fall lower right. `aimCam` look-ahead 4.2→2.2 (putt 0.9) and look y +0.35 so the ball sits lower-middle. `overheadCam` offsets set to exactly 55° pitch. Flyover in `updateCamera` is now three legs: DIO → overhead `o1` (u 0–.35) → low point `mp` behind the tee looking 55% down the hole (.35–.68) → aimCam (.68–1). Flight cam k 3.2→5 and its look target eases toward the pin within 9 units. Holed cam closer (fov 24, pin+0.9,+0.55,+1.3). New exported `look` {flyoverT} and `addObserve` → `look{camPitchDeg,flyoverT,focusY,ball,pin,golfer}` (NDC x,y,on). Saved `look-c-hole6-pitch`, `look-aim-hole9-ball-lifted`; wrote lanes/look.md.
**Saw**: aim hole 9 ball NDC y -0.48 (about 74% down, above the bottom 20%), hole 1 earlier ball at 90% before the edit. C holes 5, 6: pitch 54.8–54.9°, ball y -0.73..-0.80, pin y 0.69, both inside the frame. Flyover at 25%: pitch 53°, pin on screen. A real-key drive on hole 1 kept the ball on (y -0.7..-0.06). Aim pitch is about 20° (LOOK says about 25). Console error `SFX[k] is not a function` is hud-round's. Other holes' flags show in the aim view. Not run: perf, night mode, critic on the meter and scorecard, `test` rerun of all checks, sea/fairway colour samples.
**Next**: (1) post.js: confirm the aim-view top fifth is blurred and the band is crisp (look zoom); check the flag stays out of the heavy blur; (2) flyover looks at 50% and 75%, then the holed camera with a real putt; (3) night mode N, the scorecard and the meter pictures, `test` and `perf` (307 draws / 486k tris budget); maybe raise the aim pitch to about 25°.
**Open**: the C view puts the tee at NDC y -0.73..-0.8, close to the bottom edge. The `on` boolean only prints when true. The `test` tool was not rerun after the last edit.

### Judge 1

Status: I've seen the aim view, C view, flyover, night and perf, and I'm writing the verdict now.

**Scores**

1. **Look lane goal (camera, tilt-shift, shadows, critic)**: 6. `look.focusY` 0.441 on hole 6 is sound: the top is blurred and the golfer and ball are crisp. In the hole 9 flyover frames (looks at about 25, 50 and 75%), `pin_flag` is on screen, big, and sits in the crisp area. The light is moved. The flyover still looks like three near-identical low aim-style frames, with no visible diorama → over-the-hole → behind-ball progression. The night frame is not readable (see line 5).
2. **Look check 1 (aim view blur and ball position)**: 8. On hole 6, `look.ball.y` is -0.48 (74% down, above the bottom 20%). The top fifth is blurred (`sign_board`/`pin_flag` far away) and `golfer_body` with `ball1` are sharp. The check was run on hole 6 only, so holes 1, 5 and 9 are not yet proved.
3. **Look check 2 (C view on holes 5, 6, 9)**: 5. On hole 9, C shows the whole island from above (`house_roof`, `cliffFace` visible). The golfer is 0.005% of the picture, so the tee and pin are specks and it does not frame the hole. The pitch of about 55° is met, but the framing is not. The last builder said the tee sits at NDC y -0.73 to -0.8, close to the bottom edge. This session I did not read `look.camPitchDeg` or the NDC values on holes 5, 6 and 9, so I cannot confirm them.
4. **Look check 3 (flyover and flight)**: 5. The title is a diorama with `lighthouse_tower`. The 25, 50 and 75% looks all sit near the tee with `pin_flag` in view, so the overhead leg is not seen. I did not play a real-key drive this session.
5. **Look check 4 (sea colour, key light, Lighting notes, night)**: 4. Night (N) gives 9% brightness, 24% near black, and the golfer is barely visible: "Dark: a viewer sees little". I sampled 90 frames after N, so this may be a dusk fade still running. Either way the brief needs N to read. I took no sea sample or `Lighting:` note this session.
6. **Critic on four views and course-lane findings**: 4. I saw the aim view only. The meter, scorecard and ball in flight were not looked at. The cliff-shrub blossom is not checked.
7. **LOOK.md Checks**: 6. Painted brush look, haze, teal sea on the title and warm sun are mostly there. Aim pitch is 20° against LOOK's about 25°. Night fails.
8. **Faults**: 6. This is a software renderer (host load 4.2), so the 1708 ms frame is noise. Draw calls are 181 to 219 and triangles 367k to 500k, which is not above the 307 draws / 486k budget. One frame hit 500,569 triangles in the aim view; the budget says 486k. The `SFX[k]` console error is the hud-round lane's. I did not check the saved `look-` tests. `look.ball.on` is only printed when true.

**Next:**
1. **Night mode (asked for in Must have 1 and 5).** In `post.js`/`stage.js`, lift the dusk grade (ambient/hemisphere fill, moon key and a warm glow on the golfer, ball and flag) so N reads at brightness of about 25% or more. Check with `interact` N, then `look` after more than 120 stepped frames on hole 1. It should show the golfer and fairway clearly, and `Lighting:` should stay clean.
2. **Flyover legs and C framing.**
   - Flyover: make the overhead leg actually show. At `look.flyoverT` of 0.25 the camera should be at 50° or more with the whole hole in frame, at 0.5 low over the hole with the pin on screen, and at 0.75 behind the ball. Check with a `look` sheet of hole 9 at 25, 50 and 75%.
   - C view: on hole 9 it frames the whole island. Fit the camera to the tee and pin bounding box instead, at 55° pitch, with the ball at NDC y of about -0.5 or higher. Check with `observe` `look.ball`/`look.pin` on holes 5, 6 and 9.
3. **Unrun checks, then raise aim pitch.**
   - Not yet run: the critic pictures (meter, scorecard, a drive with real Space ×3), the holed camera, the `test` rerun and a sea colour sample (`look` with `sample` at a title-view corner). Then raise the aim pitch from 20° to about 25° and re-check that the ball stays above NDC y -0.6.
   - Save `look-` tests for flyover, night and C on holes 5 and 9.

SCORE: 5.7

## Iteration 2
**Did** (stage.js, camera.js): Night: `updateWorld` night sun 0.22→2.5 (colour #a9b8f0), `hemi` night 0.32→1.75 (#8fa0d8), so N reads. New `filterTextures()` in stage.js (runs once on frame 2): every map on scene materials gets LinearFilter mag, mipmapped min, anisotropy up to 8, against the pixelated ground tiling. Owner's wider-framing request: `aimCam` D 7.6→9.2, Hh 3.9→4.7 (putt 2.9/1.5→3.6/1.8); default fov 30→33 (flyover end 33, mid 30); flight cam D 6.4→7.8, Hh 3.2→3.9 (putt 3.6/1.8).
**Saw**: night on hole 1 (N, 40 frames): brightness 27% (was 9%, 24% near black → 2%), golfer, ball, fairway and flag readable. Aim hole 5 after widening: fov 32.8, pitch 27.1°, `look.ball.y` -0.365, pin y 0.95 (top edge, still on), golfer y -0.256; wider island reads, ground looks smooth. Not run: perf, `test` rerun (the two look- saves fail only because setState `hole` is 0-based vs the saved values — re-record them), C view, flyover, flight and holed looks after the widening, close-up ground check.
**Next**: (1) re-record `look-c-hole6-pitch` and `look-aim-hole9-ball-lifted`, add look- saves for night, flyover and C holes 5/9; (2) check the wider flight and putt cameras (ball stays above bottom 20%), C fit-to-tee/pin box, and the flyover overhead leg; (3) `perf` against 307 draws / 486k tris, the critic on the meter, scorecard and a flight.
**Open**: pin NDC y 0.95 on hole 5 aim (close to the top edge). A big tree can block the aim view on hole 2 at night (course lane). The anisotropy pass only covers textures set at load time on `map`/bump/normal/roughness; shader-made grass is not touched.
