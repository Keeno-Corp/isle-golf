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

### Judge 2

**Judge 2: scores**

1. **Look lane goal (camera, tilt-shift, shadows, critic)**: 6. The wider framing shows in the hole 5 aim view. fov is 32.8°, `look.camPitchDeg` is 27°, and `golfer_body`, `ball1` and `club_head` are crisp in the focus band at `look.focusY` 0.53. The top is blurred. The wider island now reads, with `fenceRails`, the `house_walls` and the flowers visible. The ground looks smooth and the pixelated tiling is gone. The key light still reads as the warm sun. I did not see the flyover, the flight follow, the holed camera, or the meter, scorecard and flight critic views this session.
2. **Look check 1 (aim view blur band, ball above the bottom 20%)**: 8. On hole 5, `look.ball.y` is -0.365. On hole 1 with the meter up it is -0.374, which clears the bottom 20% and is not hidden by the meter. The top fifth is blurred and the band around the golfer is sharp. Holes 1 and 5 are proved, and hole 9 is not.
3. **Look check 2 (C on holes 5, 6, 9)**: 4. On hole 5, C gives `look.camPitchDeg` 54.8, which is in range. But `look.ball.y` is -0.797, on the bottom edge, which breaks the "ball above the bottom 20%" rule. `golfer_body` is 0.015% of the picture and the checker says it "blends in". The camera is at y 36 and shows the whole island plus `sea` at 35% of the frame. It is not fitted to the tee and pin. Holes 6 and 9 were not checked.
4. **Look check 3 (flyover and real-key drive)**: 3. Not seen this session: no 25/50/75% flyover looks and no flight looks. My real-key attempt failed on the key name (`" "` is the space key). The page then went back to hole 1 with the meter at POWER 62%, so the drive was never watched.
5. **Look check 4 (sea colour, key light, Lighting notes, night)**: 5. Night is not re-checked, though last session read 27% brightness. I took no sea sample and saw no `Lighting:` note. In the aim views the sea is bright teal and clouded with foam.
6. **Critic on four views and the course-lane findings**: 4. Only aim views and C were looked at. On the hole 5 aim view the cliff shrubs read as pink-red boulders (`cliffRocks`, the red blobs next to `fenceRails`), which is the course lane's "pink rocks" finding still open. The `pin_flag` is small and reads as a thin vertical.
7. **LOOK.md Checks**: 6. The painted brush pass, haze, tilt-shift and warm sun hold on the aim views. The aim pitch is 21–27°, against LOOK's roughly 25°. The ground is smooth. Night and the sea sample are unproven.
8. **Faults**: 5. There are no console errors, and `perf` reads 307 draws and 485,787 triangles, which is exactly at budget (307 / 486k). The frame time is noise on this software renderer (host load 3.3). The pin NDC in `observe` is wrong. In hole 5 aim it reads x 0.04, y 0.93, but the flag is drawn at the top left, around NDC x -0.85. In C it reads x 0.001, y 0.684, but the flag is left of centre. The pin projection looks to be using a wrong position (it seems to use the ball's x), so the "pin on screen" check cannot be trusted. The `look.ball.on` and `look.pin.on` flags are present now. The three `look-` saves were not rerun.

**Next:**
1. **Fix the pin projection and the C framing together (Must have 3 and 11).**
   - In the look observe hook, project the real pin world position, `{x: pin.x, y: surface height + pole height, z: pin.z}`, through the live camera. Hole 5 aim should then give pin x of about -0.85, not 0.04. Check with `observe` on holes 5, 6 and 9 in aim and in C.
   - Replace C's fixed camera (y 36, whole island) with a fit to the tee/pin bounding box at 55° pitch. Keep both `look.ball.y` and `look.pin.y` inside about -0.6 to 0.8. Today the ball is at -0.797. Check with `interact` C then `look` on holes 5, 6 and 9. The golfer should be bigger than 0.015% of the picture.
2. **Prove the flyover and the flight with real input (Must have 4, 12, 13).**
   - Do `{state:{hole:8}}` with the intro on, then `interact` steps with `look:true` at about 25, 50 and 75% of `look.flyoverT`. This should show diorama, then the camera over the hole with `pin_flag` on screen, then behind the ball.
   - Do a real drive with key `" "` three times with waits, and take `look` at 3 moments. The widened flight cam (D 7.8) should keep `ball1` above NDC y -0.6.
   - Re-record `look-c-hole6-pitch` and `look-aim-hole9-ball-lifted` with 0-based `hole`. Add `look-` saves for night, the flyover and C on holes 5 and 9. Then rerun them with `test`.
3. **Critic pictures and the flag.**
   - Take `look` on the meter, the scorecard and a ball in flight. Take a `sample` of the sea at a title-view corner against #0f6a67.
   - Make `pin_flag` and `pin_pole` read as the one vertical accent. In `post.js` keep them out of the heavy blur and give them a little extra contrast. Check with `look` at the `pin_flag` box on hole 5 aim.
   - Record the pink `cliffRocks` in `lanes/look.md` for the course lane.

SCORE: 5.1

## The request changed

paprika-loop/PROMPT.md changed before session 3; the Next lists above were written before it. Changed lines:
+ 0. **NEW OWNER FEEDBACK — TOP PRIORITY (JC, after playing):** "make the ground tiling les pixelated looking. And make putting a little easier. And make it so that the main character isn't the football player. And improve the animations. Also spacing is a little too close. Make it a little wider". **Look lane owns the framing and renderer/post portion:** pull the aim and flight cameras back, modestly widen the view (about 32–34° while preserving LOOK.md's narrow-lens miniature feel), so more of the hole and island reads. Keep the ball above the bottom 20%, the golfer and ball crisp inside the moving focus band, and no flat/unblurred frame. Help course fix pixelated ground using suitable texture min/mag filtering and renderer anisotropy in stage.js, and ensure post.js brush/smear does not amplify blocky texels. Preserve frame budget. Other lanes own easier putting, character replacement and animation; do not edit their files. Prove the wider framing with before/after aim and flight views and check ground at close and distant views.

## Iteration 3
**Did** (camera.js): `overheadCam` distance is now `max(16, (d*1.55+9)*1.4)` (was `max(14, d*1.55+9)`), so C fits tee and pin with margin.
**Saw**: The judge's "pin projection is wrong" is not a bug. `ndc()` of (pinX, pinY+0.6, pinZ) matches `find('pinN')` world positions on all 9 holes. The pin reads x≈0 because auto-aim points at it, and the earlier odd numbers came from reading `observe` right after `setState` before the camera snapped. In the C shot on hole 5 the flag at the far left was another hole's pin. C after the 1.3 fit, holes 5, 6, 9: pitch 55, `look.ball.y` -0.54, -0.59, -0.68 (0.8 before), pin y ≈0.53–0.56; I raised it to 1.4 afterwards and only hole 9 was rechecked (ball -0.63). Flyover on hole 9: pin on screen at 25% (y 0.60) and 50% (y 0.64, pitch 47). At 75% pitch is 14° and the ball is off-screen (y -1.56) mid-transition to aim. Not run: `perf`, flight and holed looks, night, the critic views and `test` saves.
**Next**: (1) re-record the `look-` saves with 0-based `hole`; (2) real-key drive, looking at 3 moments of flight; (3) flag contrast in post.js and the pink `cliffRocks` (still red-pink on hole 5 C), recorded for the course lane; (4) smooth the 75% flyover leg so the ball is on screen before the aim cam lands.
**Open**: The flyover ball leaves the frame between 50% and 75% (ball y -0.99 to -1.56). The golfer in C is tiny (about 0.015% of the picture) because the camera frames the whole hole.

### Judge 3

**Judge 3: scores**

0. **Owner feedback: wider framing, less pixelated ground, ball above the bottom 20%**: 7. The aim and flight views are wider (fov 33). In the hole 5 flight look, `island` and `grass*` read smooth with no blocky texels. The drive keeps `ball1` on screen: `look.ball.y` is 0.012 and `ballTrail` is visible. `golfer_body` is at y -0.66 in flight, which is above -0.6 but low. There is no before/after pair and no check of ground at a close and a distant view.
1. **Look lane goal (camera, tilt-shift, shadows, critic)**: 6. In the hole 5 flight the top is blurred and the golfer is crisp. The `pin_flag` (small, left) and `fenceRails` read well, and the warm sun shadows fall to the lower right. The meter, scorecard and holed views were not seen again. `pin_flag` is still thin and is not the one clear accent.
2. **Look check 1 (aim blur band, ball above the bottom 20%)**: 8. In the flight the top fifth is blurred and the `golfer_body` band is sharp. The golfer box ends at y 764 of 800, so it sits close to the bottom edge. Hole 9 aim was not rechecked.
3. **Look check 2 (C on holes 5, 6, 9)**: 4. C on holes 5 and 9 now frames the whole island top-down. Pitch is about 55° by the builder's numbers. The golfer is 0.007% of the picture on hole 5 and 0.0027% on hole 9, so tee and ball are invisible. Hole 9 also has `sea` filling about 40% of the frame. It reads as an island map rather than a tee-to-pin view. The builder's own Open notes this.
4. **Look check 3 (flyover and real-key drive)**: 6. The real-key drive on hole 5 worked: three `" "` presses reached phase `flight`, and the ball stayed on screen. The flyover on hole 9 at about 75% (from a reload on its intro) shows the camera low over `fairway`, with the flags, `lighthouse_tower` and sheep visible. That is a good view. The builder says the ball leaves the frame at 75% in the transition into aim. I did not confirm the flyover's three stops in order.
5. **Look check 4 (sea colour, key light, night)**: 6. Night reads: brightness 26%, the `golfer_body` is visible and the lantern shapes read. The sea is bright teal and clouded with foam in C, and I took no sample against #0f6a67. No `Lighting:` note appeared.
6. **Critic views and course-lane findings**: 4. The `cliffRocks` still read as pink-red boulders beside `fenceRails` on hole 5. The `pin_flag` is still thin. The meter, scorecard and holed views were not seen.
7. **LOOK.md Checks**: 6. The brush pass, haze, tilt-shift and warm sun hold on the aim and night views. The sea sample was not taken.
8. **Faults**: 6. There are no console errors. `perf` reads 181 draws and 367k triangles for this view, under the 307 / 486k budget. The frame time is noise on SwiftShader (host load 2.9). Saved `look-` checks were not rerun. `look` says "This camera shows little of the subject" on the aim view.

**Next:**
1. **Fix C (Must have 3, asked again).** Fit the camera to the tee/pin box instead of the whole hole. Today the golfer is under 0.01% of the picture. Reduce the distance, but not below what keeps the ball and pin inside NDC -0.6 to 0.8. Shift the look-at toward the midpoint of tee and pin. Do not frame the island. This should drop the `sea` share from about 40% to under 15%. Show it with `interact` key `c` then `look` on holes 5, 6 and 9: `golfer_body` should be over 0.1% and `look.ball.y` and `look.pin.y` should both be inside -0.6 to 0.8.
2. **Critic views and the flag (Must have 6).** Take `look` on the meter (after the first Space), on the scorecard, and on a holed ball. In `post.js`, exclude `pin_flag` and `pin_pole` from the heavy blur and add contrast. Check with `look` `zoom` on the hole 5 flag box. Record the pink `cliffRocks` in `lanes/look.md` for the course lane. Use `look` `sample` on the sea in a title-view corner against #0f6a67.
3. **Smooth the flyover's last leg and re-record the `look-` saves (Must have 4 and 12).** The ball leaves the frame between 50% and 75%. Ease the pitch and position so the ball is on screen with y above -0.6 before the aim camera lands. Show it with `interact` stepped frames on hole 9 with `look` at 25, 50 and 75%. Re-record the `look-` saves with 0-based `hole`, and add `look-` saves for night, the flyover and C on holes 5 and 9. Rerun them with `test`.

SCORE: 5.9

## Iteration 4
**Did** (camera.js): `overheadCam` now fits instead of using a fixed multiple of the distance: it steps `dist` from 9 up and projects tee and pin through a scratch camera (`_fc`) until both sit inside NDC x ±0.8, y -0.6..0.8; look-at stays at their midpoint.
**Saw**: Hole 5 C (before the final 0.8/-0.6/0.8 loosening, which was 0.7/-0.55/0.75): pitch 55, camera y 49, ball y -0.548, pin y 0.50, golfer 0.007% of the picture, `sea` 47%. The shot is limited by the tee-to-pin span on a 55° view (hole 5 is 20 units), not by the old multiplier, so the judge's "golfer over 0.1%, sea under 15%" cannot hold on long holes with the tee and pin both in frame. Not run: holes 6 and 9, `perf`, critic views, flag post pass, flyover leg, `look-` saves.
**Next**: (1) check C on holes 6 and 9 after the loosening; (2) flag crispness in post.js and the pink `cliffRocks` note in lanes/look.md; (3) ease the 75% flyover leg, re-record `look-` saves; (4) consider a follow C that centres on the ball while the pin stays on screen, for shorter shots.
**Open**: C golfer is still tiny on long holes; the judge's target likely needs a different rule (frame ball and pin only once the ball has moved).
**Checked after the final edit (0.8 / -0.6 / 0.8)**: hole 9 C: no console errors, pitch 55, camera y 76, ball y -0.598, pin y 0.508, golfer 0.0025%, `sea` 65%. The fit does what it is told. Both points sit at the limits and the long par 5 stays an island view. Holes 5 and 6 with the final limits were not rechecked.

### Judge 4

**Judge 4: scores**

0. **Owner feedback (wider framing, less pixelated ground, ball above the bottom 20%)**: 7. The aim views are wider (`fov` 32) and the `island` and `grass*` ground reads smooth, with no blocky texels, in the hole 5 and hole 9 aim looks. The golfer is large and crisp inside the band in the hole 5 and 9 aim looks. There is still no before/after pair and no close-versus-distant ground check recorded.
1. **Look lane goal (camera, tilt-shift, shadows, critic)**: 6. The aim views on holes 5 and 9 read well: the top is blurred, the `golfer_body` is sharp, and shadows fall to the lower right. The hole 9 `pin_flag` is a clear red accent. The hole 5 `pin_flag` is small and low, and the meter, scorecard and holed views were not seen this session.
2. **Look check 1 (aim blur band, ball above the bottom 20%)**: 8. Hole 5 and hole 9 aim both have a blurred top, a sharp golfer and ball, and the ball is well above the bottom 20%. Hole 1 was not looked at.
3. **Look check 2 (C on holes 5, 6, 9)**: 4. Pitch is 54.9°, and on hole 5 `ball.y` is -0.597 and `pin.y` is 0.542, so both are on screen. But the golfer is 0.0083% of the picture on hole 5, 0.015% on hole 6 and 0.0023% on hole 9, so the tee and ball cannot be seen. `sea` is 44% of the frame on hole 5 and the hole 9 view is a whole-island map. The tee and pin are technically in frame (hole 5 and the builder's hole 9 numbers), but the ball sits on the -0.6 limit and cannot be told from the ground, so this is not a readable hole view.
4. **Look check 3 (flyover and real-key drive)**: 6. No flyover or drive was re-run this session. Judge 3's drive on hole 5 held, and the 75% flyover leg was never confirmed.
5. **Look check 4 (sea colour, key light, night)**: 6. The warm key light and shadows to the lower right hold. The only `Lighting:` note is the club's metal. No `sample` of `sea` against #0f6a67 has been taken in four sessions. Night was not re-run.
6. **Critic views and course-lane findings**: 4. The `cliffRocks` still read as pink-red boulders on hole 5 aim and hole 5 C (the pink clump by the house). The hole 5 `pin_flag` is still thin. The meter, scorecard and holed views are still unseen.
7. **LOOK.md Checks**: 6. The brush pass, haze, tilt-shift and warm sun hold. The sea sample is missing.
8. **Faults**: 6. There are no console errors. `perf` reads 181 draws and 367k triangles, under the 307 / 486k budget. The 1771 ms frame is noise on SwiftShader (host load 3.5). `look` warns once that the C camera "shows little of the subject". The `look-` saves have not been rerun.

**Next:**
1. **Fix C so the golfer and ball read (Must have 3, asked again).** Fit-by-NDC has hit its limit, since a long tee-to-pin span at 55° gives a tiny golfer. Change the rule in `camera.js` `overheadCam`: aim the C camera at a point 60% of the way from the ball to the pin, at pitch 50–55°, and accept the pin near the screen edge, with the ball and a bright ring marker kept at NDC -0.5 to 0.5. For holes over about 15 units, let C track the ball instead of the whole hole. Also add a larger halo or ring around the golfer in C so the tee is visible. One tool call shows it done: `look` with a sheet of C on holes 5, 6 and 9, where `golfer_body` should be over 0.05% and `sea` under 30%.
2. **Critic views, the flag and the pink rocks (Must have 6, asked again).** Take `interact` with `look: true` after the first Space (the meter), at the scorecard, and on a holed ball. In `post.js`, keep `pin_flag` and `pin_pole` out of the heavy blur, and add contrast or a saturation boost there. Write the pink `cliffRocks` in `lanes/look.md` as a request for the course lane. Done when `look` with `zoom` on the hole 5 `pin_flag` box shows a crisp red flag, and `look` with `sample` at a title-view sea corner is within 30/255 of #0f6a67.
3. **Flyover's last leg and `look-` saves (Must have 4 and 12, asked again).** Ease the pitch and position so the ball stays above y -0.6 before the aim camera lands. Show it with `look` `sheet` on hole 9 from the intro, at 25%, 50% and 75%, with `look.ball.y` read at each. Then re-record the `look-` saves (night, flyover, C on holes 5 and 9, the drive) with `interact` `save` and rerun them with `test`.

SCORE: 5.9
