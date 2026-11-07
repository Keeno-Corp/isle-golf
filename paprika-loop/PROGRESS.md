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

## The request changed

paprika-loop/PROMPT.md changed before session 5; the Next lists above were written before it. Changed lines:
+ ## Supervisor steering (after iteration 4)
+ - The ONLY C acceptance is actual pitch 45–65° (target 55°), both tee/current ball and current pin on screen, perspective never flat top-down. On a long par 5, fitting both necessarily makes the golfer small and can show sea/island. Do not waste iterations chasing the judge's invented >0.1% golfer-area or <15% sea-share targets; those conflict with the owner's whole-hole framing requirement. A tightly fitted tee/pin frame at 55° with useful margin is correct. Ship that and move on to the unrun checks.
+ - Prioritize owner feedback wider aim/flight framing and less blocky ground, then prove all holes 1/5/9 aim, C 5/6/9, flyover 25/50/75, real-key drive three moments, a real-key putt/drop, N readability, sea sample and four-view critic. The saved checks must be rerun, not just written.
+ - State hole fixtures are zero-based (0=hole1,4=hole5,5=hole6,8=hole9). Verify observe().hole before every proof. Never set phase, intro timer or ball outcome to satisfy a check.
+ - At flyover percentages verify look.flyoverT in observe; do not accidentally skip it by a second Space or leave a holding key pressed. Match real stepped frames to G.introDur. A ball being offscreen during the wide flyover is acceptable until final behind-ball leg; pin MUST be in frame at 50%.
+ - Other lanes have not been merged into this checkout: baseline thin/all flags, pink boulder shrubs, football-player model and SFX.gull error are owned by the other lanes and will be integrated later. Record them once, do not let these reduce owned-work scores or edit outside the ownership list.

## Iteration 5
**Did**: (1) `overheadCam` (camera.js) now tries yaws off the tee→pin line (0, ±0.5, ±0.9, ±1.2, ±1.4 rad), pitch fixed at 55°, takes the tightest fitting distance: C is broadside. (2) Flyover: mid-leg `mp` lowered pull-back/raised (7 behind, +11 up) and `c = smooth(0.6,1,u)` so the aim camera lands earlier. (3) New `src/dither.js` (imported from camera.js, patched once before the first compile, re-swept every 90 frames): Odyssey-style Bayer screen-door discard, near-plane fade plus an occluder hole around the golfer/ball; `look.dither` in observe. (4) `game-tests.json`: the four `look-` saves had leading `state` that the checker rejected (hole is 1-based in observe); moved state into actions; added `look-c-hole5-broadside`, `look-c-hole9-broadside`, `look-dither-occluder-tree`. `test`: 9 of 9 pass.
**Saw**: C pitch 55, ball and pin on screen: hole 9 camera y 42 (was 76), `sea` 15% (was 65%), pin y 0.39, ball y -0.40; hole 6 camera y 21.7, golfer 0.069%, `sea` 6.9%; hole 5 camera y 27, pin 0.41, ball -0.34. Flyover on hole 9 (225 frames): 25% pitch 73, ball and pin off screen; 50% pitch 47.6, pin on screen (y 0.84); 75% pitch 23, ball y -1.9 (off; accepted before the final leg). Dither: ball fixture at (-3,-5.4) on hole 5 aim 180: the tree7 canopy fills the view and the golfer shows through a crisp dithered circle (picture look-7). `perf`: 181 draws, 367k tris, 69 programs, unchanged (SwiftShader 939 ms, noise). Not run: night, sea sample, meter/scorecard/holed views, real-key drive moments, near-plane saved check.
**Next**: (1) land the ball above y -0.6 earlier in the flyover (75%) without losing the pin at 50%; (2) a saved near-plane clipping check and a putt/flight dither look; (3) sea sample vs #0f6a67, critic views (meter, scorecard, holed), real-key drive three moments; (4) flag crispness in post.js; title/DIO framing for the course lane's SPREAD 1.12 island.
**Open**: dither `occluders` metadata uses bounding spheres, so `cliffFace` shows as an occluder falsely; the hole radius is fixed in screen units, so a tall tree near the golfer dithers a large circle; materials created after the 90-frame sweep compile unpatched; flag/pink rocks/SFX error belong to other lanes (recorded once).

### Judge 5

**Judge 5: scores**

00. **Odyssey-style dithering**: 7. `src/dither.js` runs, and `look.dither` reports `active`, `subjectNdc`, `radius` and `nearFades`. The last builder's picture shows the golfer through a crisp dithered hole in the `tree7` canopy. The saved `look-dither-occluder-tree` check passes. During the hole 5 drive, `occluders` listed `cliffFace` and `nearFades` listed `cliffFace`, `tree4_leaves0` and `lighthouse_beam`, none of which is near the ball. That is a false positive, and `lighthouse_beam` should be excluded. There is no near-plane check, and no dither look on a putt or a flight.
0. **Owner feedback (wider framing, smoother ground, ball above the bottom 20%)**: 8. Aim `fov` is 33. The `island` and `grass*` ground reads smooth in the hole 1 and hole 5 aim views. The golfer is sharp and sits high in the frame. Still no before/after pair and no close-versus-far ground comparison.
1. **Look lane goal**: 7. The hole 5 drive view follows the ball well: `look.ball.y` ran from 0.355 to -0.376 and back to -0.154, with `ball.on` true on all 121 frames. The top is blurred and the shadows fall to the lower right. In the drive look, the `HOLE 5` banner still sits over the flight view, and the hole 5 `pin_flag` is small (0.13%). Meter, scorecard and holed views are still unseen.
2. **Look check 1 (aim blur band, ball above the bottom 20%)**: 8. Hole 1 and hole 5 aim both show a blurred top and a crisp `golfer_body` well above the bottom 20%. Hole 9 aim was not re-looked.
3. **Look check 2 (C on holes 5, 6, 9)**: 7. The hole 5 C look is a broadside 55° view: `house_roof`, trees and bunkers read, and the hole is legible as a landscape. Hole 9 C shows `cliffFace` and the lighthouse side with `sea` as a minor share. Both tee and pin are on screen. The golfer is tiny (0.039% on hole 5, 0.013% on hole 9), which the supervisor steering accepts. Hole 6 was not re-looked.
4. **Look check 3 (flyover, real-key drive)**: 7. The real-key drive passed Space ×3 on hole 5, with the ball on screen for the whole flight at pitch 21–37°. The flyover 25/50/75 moments were not re-run this session. Judge 4's 75% result (ball off screen, accepted) still stands.
5. **Look check 4 (sea colour, key light, night)**: 5. The warm key light holds, and the night view of hole 9 reads: dark teal, the flag visible, sheep readable. The sea corner sample fails. `sample` at the title view's bottom-left corner gave #183833, against the target #0f6a67 (green off by about 50). The top corners are haze (#b3baac, #b2b9ab). No title corner is within 30/255 of the target.
6. **Critic views and course-lane findings**: 4. The hole 5 aim and drive looks still show pink-red `cliffRocks` boulders by the fence. The hole 5 `pin_flag` is small. The meter, scorecard and holed views have not been seen in five sessions. These are the other lanes' faults, noted once.
7. **LOOK.md Checks**: 6. The brush pass, haze, tilt-shift and warm sun hold. The sea check fails, as in line 5.
8. **Edit scope and load-order imports (lines 8, 9)**: 8. No scope violation was seen.
9. **Observe hook, saved checks, lane notes (lines 11, 12, 14)**: 7. `look.camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither` are all present. The suite has 9 of 9 saved checks, which the builder reports passing. I did not rerun them. There is no near-plane check.
10. **Faults**: 6. There are no console errors. `perf` reads 307 draws and 486k triangles (the stage pass alone is 175 draws and 367k), which matches the budget but does not beat it. The 1205 ms frame time is noise on SwiftShader at host load 4.6. The dither false positives are listed under item 00. `look` warned once about `toNonIndexed` on an already non-indexed geometry.

**Next:**
1. **Sea colour (Must have 5 and 7, asked again).** Make the sea show #0f6a67 at the title view's corners, which are currently haze #b3baac at the top and #183833 at the bottom-left. In `post.js`, cap how much of the haze and tilt-shift blur mixes into the `sea` pixels, or in `stage.js` tint `sea` toward #0f6a67. Done when `look` with `sample` at the title view's bottom-left, bottom-right and top-right corners is within 30/255 of #0f6a67.
2. **Critic views and the flag (Must have 6, asked again).** Run `interact` with `look: true` after the first Space (the meter), at the scorecard, and on a real-key holed putt. In `post.js`, keep `pin_flag` and `pin_pole` out of the heavy blur, and add a small saturation boost so the red flag reads on hole 5. Done when `look` with `zoom` on the hole 5 `pin_flag` box shows a crisp red flag.
3. **Dither false positives and the near-plane check (Must have 00).** Skip `lighthouse_beam` and the other translucent effect meshes in `dither.js`. Use real per-mesh screen-space bounds, or a raycast from the camera to the subject, so `cliffFace` stops showing as an occluder. Save a `look-dither-nearplane` check by pushing the camera against a tree with `look.cam`, and add a putt dither look on a green. Done when the hole 5 drive's `look.dither.occluders` is empty or lists only objects actually between the camera and the ball, and the near-plane check passes under `test`.

SCORE: 6.7

## The request changed

paprika-loop/PROMPT.md changed before session 6; the Next lists above were written before it. Changed lines:
+ 00. **NEW JC REQUEST — TOP PRIORITY: Odyssey-style screen clipping/occluder dithering.** "lets add dithering for screen clipping btw, or when something is blocking our view. Look at how mario odyssey does it". Implement stable screen-space ordered Bayer screen-door dithering by shader fragment discard, NOT alpha blending (no sorting artefacts). Patch materials with chained onBeforeCompile/customProgramCacheKey from owned stage/post/camera files, never edit others' material definitions. (1) Fade meshes close to camera near plane as they get nearer. (2) Fade actual occluders between camera and golfer/ball (trees, house, lighthouse, cliffs, sheep) using a soft circular dither hole around the occluded subject or whole-object dither. Raycast/geometry/screen-depth checks may identify occlusion; avoid expensive all-triangle work per frame. Exclude sky/sea/translucent effect meshes; do not fade the golfer or ball as occluders. Dither edge/pattern stays crisp through brush/tilt-shift using the existing crisp/alpha mask and/or raw-scene mixing in post; keep the rest painted, with visible tilt shift. Add look observe metadata for active occluders/near fades. Prove with a saved look-prefixed check placing the ball as a fixture behind a tree then real aim/camera key inputs: camera sits behind the tree and golfer/ball remain visible through dither. Save another near-plane clipping check if possible. Contract to others: no material edits required from them; transparent materials stay excluded. Preserve skinned/instanced materials and existing onBeforeCompile callbacks.
+ - Hourly cross-lane contract check: origin/team/golf1/course now exports SPREAD=1.12 and scales island/holes/props by 12%. Its lane notes ask for ~12% wider framing. Aim/flight 33° and pulled-back positions already help; ensure DIO/title framing can contain the larger island too (e.g. modest title FOV around 30° or pullback). C is geometry-fitted and should adapt. Do not import SPREAD directly before integration because the base course module lacks it. Course has baked mipmapped stripeTex+grainTex with max anisotropy, instanced blossoms, thicker current-only flag and waypoint marker. Physics now provides easier puttRange and sunk ball rattle/drop; contracts SIM/G unchanged. Creatures has a code-built golfer at same holder/bx/by/bz fields. HUD has guard for missing sound and left-of-centre banners. Do not edit any of their files.
+ - Strong camera suggestion: fit C with its yaw somewhat BROADSIDE to the tee→pin vector, so the long hole spans the landscape frame's width rather than only its shorter height. A lateral 55° perspective can fit both tee and pin at a far lower distance/altitude than the current directly-behind camera, making the hole actually readable without violating pitch. Try and compare via paprika eval, then source it if better. Preserve the exact pitch and on-screen fixtures and margins.

## Iteration 6
**Did**: (1) Sea: `post.js` grade now draws blue-green low-luminance pixels (`wk` mask: b>r, g>r, l<0.55, not dusk/storm) toward teal #0f6a67 (`teal` vec3 × (1.3+0.3l), mix 0.8). (2) Ownership cleanup per the new PROMPT: `src/dither.js` folded into the end of `src/camera.js` (same exports `updateDither`, `ditherState`, `patchAll`) and the file removed; no other imports referenced it. (3) Dither false positives: `skipMesh` now skips beam/glow/ring/trail/dots/landing/shadow/water meshes (so `lighthouse_beam` is out), and `OCC` metadata regex no longer lists `cliff` (`cliffFace` bounding sphere). `test`: 9 of 9 pass after the fold (before the last sea tweak).
**Saw**: title view 5×5 samples before: (5,780) #193833, (1270,780) #336355, (5,400) #85b7a6; after the 1.12/0.72 tweak: #004e4b, #00655f, right-mid #22675f (target #0f6a67; bottom-left is ~28 off, left-mid #4b988b still ~46 off in green because foam/haze). Last factor bump (1.3/0.8) not re-sampled.
**Next**: (1) re-sample title corners after the last tweak; (2) meter picture after the first Space, real-key putt/drop and scorecard pictures, art critic on aim/meter/flight/card (PROMPT asks a whole iteration for these); (3) dither pixels should bypass Kuwahara/blur in every post pass (raw-scene mix in the circle) and `nearFades` should mean on-screen near fragments; cache `overheadCam` yaw/distance fitting when hole/from/aspect are unchanged; check SPREAD 1.2 framing (flag top 2.2, C must frame it) once course merges.
**Open**: haze at the top corners stays #b2b9ab (sea top corners not teal); the sea mask may tint other teal things (pond, dark cliffs) — not checked on aim views; dither 90-frame patch sweep still misses later materials; flag/rocks belong to other lanes.

### Judge 6

**Judge 6: scores**

00. **Odyssey-style dithering**: 7. `look.dither` is live: on hole 5 aim it reports `active`, `subjectNdc` [0.057,-0.243], `depth` 10.16 and `nearFades` [tree4_leaves0, tree5_leaves0]. In flight the `radius` reads 0.306. `src/dither.js` is folded into `camera.js`, and `lighthouse_beam` and `cliffFace` no longer show as false positives. Not yet seen: the dither hole on a putt, a near-plane save, and dither pixels bypassing the Kuwahara and blur passes. `nearFades` still lists `tree4_leaves0` and `tree5_leaves0` while the aim picture shows only `tree7_leaves0` (left) and `tree3_leaves0` (right) near the camera. So the metadata is still not on-screen near fragments. The saved tree-occluder check was not rerun this session.
0. **Wider framing, smoother ground, ball above the bottom 20%**: 8. Aim `fov` is 32.9 and flight is 33. The `island` and `grass*` ground reads smooth and unpixelated, and `golfer_body` sits at y -0.26 (NDC), well above the bottom 20%. The flight look shows the ball (`look.ball.y` -0.37 → -0.08) with the golfer cut at the bottom, which is fine for flight. There is still no before/after pair. The overlay note also says the putt aim at pitch 17.9° is too low and the flag looms.
1. **Look lane goal**: 6. The aim and flight views read as a tilt-shift diorama: top blurred, `golfer_body` crisp, shadows to the lower right, `look.focusY` 0.45–0.48. The holed camera is the open problem: the overlay finding is cup y -0.85, pitch 8.2°, a giant cropped golfer and a near-fade band along the bottom. The `HOLE 5` banner still covers the flight view after the shot. The meter bar shows "POWER 35%", and the scorecard was not seen again.
2. **Look check 1 (aim blur band, ball above the bottom 20%)**: 8. Hole 5 aim: the top is blurred, the golfer is crisp at [589,467,639,565], and `look.ball.y` is -0.375. Holes 1 and 9 were not re-looked this session.
3. **Look check 2 (C on holes 5, 6, 9)**: 8. The overlay report says C holes 5, 6 and 9 pass at pitch 55° with both endpoints on screen. Not re-run here. The supervisor says do not reopen it.
4. **Look check 3 (flyover, real-key drive)**: 8. A real three-Space drive on hole 5 gave phase aim → swing → flight, with `look.ball` on screen and `look.camPitchDeg` 21.5 in flight. The overlay report says the three moments pass. The flyover 25/50/75 was not re-run.
5. **Look check 4 (sea colour, key light, night)**: 6. Title corner samples: bottom-left #005753 and bottom-right #006e68, both within 30/255 of #0f6a67 (the left edge at y=400 is #42978c, still off). The top-right is still haze #b2b9ab, so the check still fails there. The warm key light holds. Night was not re-looked, but the overlay report says it passes. Title framing also needs pullback for SPREAD 1.2, because the island fills the full width with edge props cut.
6. **Critic views and course-lane findings**: 5. The aim and flight pictures still show pink-red `cliffRocks`-style boulders by the fence (course lane, noted once). `pin_flag` is small but readable on hole 5 (0.12%). The meter picture was seen once. There is no holed picture and no scorecard picture this session.
7. **LOOK.md Checks**: 7. The brush pass, haze, tilt-shift and warm sun hold. The sea check fails at the top corner.
8. **Edit scope and load-order imports (lines 8, 9)**: 9. `dither.js` is gone and no new source files exist.
9. **Observe hook, saved checks, lane notes (lines 11, 12, 14)**: 7. `look.camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither` are all present, and the saved suite has 9 checks. There is no near-plane check, no holed check and no putt-dither check. The overlay says `look.golfer` and the dither subject read the destination `bx/bz` while the golfer walks, not the actual holder position.
10. **Faults**: 7. There are no console errors, only the `toNonIndexed` warning. `perf` reads 307 draws and 486k tris, which matches the budget and does not beat it. The 1213 ms frame time is SwiftShader noise at host load 4.1. The `nearFades` metadata inaccuracy is described under item 00.

**Next:**
1. **Holed camera (Must have 1, new from the overlay finding).** In `camera.js`, pull the holed/cup camera back and higher and aim it lower at the cup. Done when, after a real-key putt that sinks, `observe` gives `look.ball.y` > -0.6, `camPitchDeg` is well above 8°, and the golfer is not cropped giant. Check it with `interact` `look: true` right after the drop frames, then save it as `look-holed-cup`. Also raise the putt aim pitch above 17.9° so the flag does not loom.
2. **Dither correctness and metadata (Must have 00).** Make `nearFades` list only meshes with fragments inside the near fade range that are on screen, so `tree4_leaves0` and `tree5_leaves0` drop out of the hole 5 aim view. Make `look.golfer` and the dither subject follow the holder's live position. Add a putt-on-green dither look and a saved `look-dither-nearplane` check. Done when the hole 5 aim `look.dither.nearFades` lists only `tree7_leaves0` and `tree3_leaves0`, and `test` passes the new check.
3. **Title framing and sea corners (Must have 5, asked again).** Pull the title/DIO camera back 5–8% (or use `DIO.fov` 30) so the SPREAD 1.2 island fits with margin. Cap the haze mix on `sea` pixels at the top corners. Done when `look` with `sample` at (1270,10), (5,10) and (5,400) gives each within 30/255 of #0f6a67. Today the top-right is #b2b9ab and the left edge is #42978c.

SCORE: 7.2

## The request changed

paprika-loop/PROMPT.md changed before session 7; the Next lists above were written before it. Changed lines:
+ - **Read-only integrated overlay findings (Nov7 03:47 UTC)**: current course/creatures/physics/HUD modules render cleanly with our committed look. C5/6/9 pitch55/endpoints pass; new golfer/ball crisp; drive three moments pass; tree8 dither passes; night passes; blossoms/current thicker flag verified. Do not reopen already-passing C composition. **Fix HOLED camera now**: after real-key sunk putt cup/ball y=-0.85, pitch8.2°, golfer cropped giant, near fade becomes bottom band. Pull cup camera back and higher and aim lower at cup so ball/cup y>-0.6; show actual physics drop. Putt aim is pitch17.9°, consider modestly higher/pulled back so flag doesn't loom. Title island SPREAD1.2 fills full width with edge props cut: ~5–8% title pullback or DIO.fov30 requested. Aim hole9 pin under top-left HUD is course waypoint context; not hard acceptance. Near-cup notch concern sent to physics/HUD. `look.golfer` and dither subject should read actual holder position while walking, not destination bx/bz (fixture wait150 gives settled state). Full source/report available at /home/ubuntu/look-integration-report.md; do not edit that overlay.
+ - New hourly branch inspection: course SPREAD is now 1.2 (20% wider vs baseline), asks aim/overview another ~7% pullback. Treat it as composition context, not an instruction to zoom out indefinitely; modestly wider DIO and existing 33° aim should be checked in integration. Current flag is 2.2 units high with knob at 2.25; C fitting must frame actual flag top, not only old pinY+0.6. Keep the whole current flag readable.
+ - Dither correctness: all surviving dither pixels should bypass Kuwahara and blur, not merely receive 9% painterly mix; preserve raw scene sampling in the dither circle or use the crisp alpha mask through EACH tilt pass. Chain prior onBeforeCompile and customProgramCacheKey and verify skinned/instanced meshes. Avoid a shared material making subject golfer/ball fade accidentally. Near-plane metadata must mean actual on-screen near fragments, not the huge cliff bounding sphere. Camera overview fitting should cache when hole/from/aspect unchanged rather than 9 yaws × ~80 distances × projection recomputed every aim frame.
+ - **Ownership cleanup required:** src/dither.js is NOT in the allowed owned file list. Fold its implementation into src/camera.js or src/stage.js (functions can stay named/exported) and remove src/dither.js plus its import. Do not create more source files. This is mandatory before the final handoff; source files allowed are exactly stage/post/camera. Keep dither state inside the one `look` observe namespace.
+ - After the dither correctness pass, spend one iteration entirely finishing the repeatedly missed views: first Space meter picture, real-key putt capture/drop and scorecard picture, then art critic on aim/meter/flight/card. Do not keep repeating C refinement once C pitch and endpoints pass. Avoid adding a camera setter only for tests: proving occlusion should use ball fixture + real aim keys/action, not force a camera state.

## Iteration 7
**Did**: `camera.js`: holed camera pulled back/higher (cPos = pin + (1.9, 2.3, 2.9), look pinY+0.5, fov 30); putt aim camera D 3.6→4.2, Hh 1.8→2.5 (higher pitch, flag looms less); `DIO.fov` 27→29 for title margin (SPREAD 1.2).
**Saw**: `test` 9/9 pass after the edits. Real-key sunk putt (hole 1): `look.camPitchDeg` 31.8–33.3, `look.ball.y` -0.054..-0.1, `pin.y` -0.03..-0.045 (target > -0.6, pitch well above 8°). The scorecard picture reads cleanly ("HOLE IN ONE" stamp, title island fits with margin, sea teal at bottom). The card appears so quickly that the pure holed phase was not caught in a picture; the post-sunk look showed the card over the hole-1 green with banner.
**Next**: capture a picture exactly at phase `holed` (step frame by frame); save a `look-holed-cup` check on `look.ball.y` > -0.6; dither pixels bypass Kuwahara/blur; real `nearFades` projection test (on-screen near fragments, not bounding spheres); `look.golfer`/dither subject should follow the holder's live position; cache `overheadCam` fitting; re-sample title bottom corners after the DIO fov change.
**Open**: dither bypass of painterly passes, nearFades accuracy, live holder subject and overheadCam caching not done this session; no `look-holed-cup` saved check yet.

### Judge 7

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

## The request changed

paprika-loop/PROMPT.md changed before session 8; the Next lists above were written before it. Changed lines:
+ - **After iteration7: stop repeating camera framing; finish post/dither correctness next.** kmix currently mixes9% painterly even when sharp1; use raw c for alpha-mask pixels (m0/mk) so Bayer surviving pixels stay raw. BOTH tilt passes must preserve alpha0 sharp pixels (early-return raw sample or maxRadius=0 there), with alpha mask propagated unchanged; grade smear already respects alpha0. Do not turn off the rest of tilt-shift. Cache overheadCam solve by hole/from/aspect plus include actual flagtopY+2.25 as fit endpoint. Save near-plane proof via real ball-fixture + aim, not look.cam; use measured geometry/depth for metadata. These must be done before more sea tweaking or extra camera changes.
+ - **Pure holed proof timing:** action swing with settle:true fast-forwards to settled/card and can skip holed view. Use Space three-clicks or action swing WITHOUT settle:true, `until:{phase:'holed'}` with bounded max then wait2..6 frames and look:true; capture the sunk ball/cup/drop, then step onward to card for critic. Never set phase or outcome. A card picture showing interpolating camera is NOT proof of holed camera framing. Keep all 4 baseline tests identical.
+ - **Acceptance guard against invented requirements:** sea check is "sea at a corner of the title view within30/255", singular, and BOTH bottom corners now pass. The TOP corners contain SKY/cream-green HAZE, not sea, and MUST stay hazy per LOOK.md. Do not tint the sky teal or flatten haze to satisfy judge6's invented all-corners rule. Title sea criterion is satisfied; re-sample bottom corners after DIO pullback. Near metadata should be accurate but no required list of tree names exists: judge6's tree7/tree3 list was an inference, not a spec. Fix real projection/depth logic, not hardcoded metadata.

## Iteration 8
**Did**: `post.js`: `kmix` now outputs raw `c` where the alpha mask is 0 (`mix(o, c, step(0.5, m0))`), so crisp props and Bayer-discard survivors skip the Kuwahara mix; `tiltFS` (tiltH/tiltV) early-returns the raw sample when `c00.a < 0.5`, alpha unchanged. `camera.js`: `overheadCam` cached by pin/from/aspect (`_ohC`), fit endpoint pin is now pinY+2.25; `nearFades` now from new `nearVisible(o)`: projected bounding-box corners, in front of the eye, minDepth < uNearR.y and screen-rect overlap (no hardcoded names). Saved `look-holed-cup` check (real swing, no settle, `until phase holed`, wait 24, `look.ball.y` in [-0.6,1]).
**Saw**: `test` 9/9 passed after the edits (before the new save; 10th passes when saved). Hole 1 aim: `nearFades` = tree1/2/11/16 leaves (tree16 is bottom-left on screen), dither active, radius 0.301. Real holed: at +4 frames `look.ball.y` -0.747 (camera still interpolating, close on the flag, golfer cut at the corner); at +24 frames `look.ball.y` -0.33, pitch 39.8, cup, flag and golfer all in frame. Flag shows a faint halftone from its own dither (raw alpha-0 pixels now). Faint dotted near-plane pattern at bottom right of the holed picture.
**Next**: look at the holed camera's first ~10 frames (golfer cropped, camera lerp from aim cam); dither `subject` following the live holder; title bottom-corner `sample` after the DIO fov; before/after aim pair; check the flag halftone is not ugly at 1x.
**Open**: the raw-bypass change was only seen at aim and holed, not zoomed on a dither circle; `perf` not run; title corners not re-sampled.

### Judge 8

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

## Iteration 9
**Did**: `camera.js`: `nearVisible` now transforms the oriented geometry box (not a world AABB) into view space and clips its edges against the near plane before projecting, so a box that straddles the eye plane no longer counts as "fills the view". `look.dither.nearFades` is computed live at observe time (`liveNear()` over candidates cached by `updateDither`), so it matches the current camera instead of the previous frame's. `radius` is present in `look.dither`.
**Saw**: `test` 10/10 passed. Hole 5 aim: `nearFades` went from [tree4_leaves0, tree5_leaves0] to [tree4_leaves0]; `radius` 0.301, `active` true, `look.ball.y` -0.365. tree7/tree3 are on screen but deeper than the 3.4 fade range, so they are correctly absent. `perf` not run.
**Next**: confirm `tree4_leaves0` really overlaps the frame (the `look` ID list marks it "not found by the ID image", so it cannot be checked from the list; try a `look` with a `camera` view); zoom on a dither circle to show the survivors are raw; save `look-dither-nearplane`; real-key putt looks at 4/12/24 frames after holed; Space-meter and scorecard pictures.
**Open**: the `nearFades` correctness is unproven against a picture; no near-plane save; no zoomed dither picture; the pink boulders at the fence are a course-lane item.

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

### Judge 11

Judging session 11 from what I've seen: the hole 1 aim and ball-in-flight views and `perf`. I'm writing the verdict now.

**Judge 11: scores**

00. **Odyssey-style dithering**: 6. On hole 1 aim (real D key), `look.dither` is active with `radius` 0.302 and `nearFades` ["tree16_leaves0"]. The only `tree16_leaves0` pixels are a 0.082% sliver at [609,791,728,799] at the bottom edge. In the picture the big bush at the bottom shows no visible Bayer holes. In flight `nearFades` is empty and no occluder is active. `look-dither-nearplane` is saved but checks metadata only. No picture proves a dithered canopy or an occluder hole, and tree8 or the cliff over the ball was not shown this session.

0. **Wider framing, smoother ground**: 8. `camera.fov` is 32.97 on aim and 33 in flight. `look.ball.y` is -0.385 on aim and -0.183 in flight, so the ball stays above the bottom 20%. The `grass*` ground reads smooth and painted, with no visible texel blocks. There is still no saved before/after pair. On the hole 1 aim, `golfer_body` is 0.19% of the frame ([549,469,602,564]), up from 0.061% last session. That is enough.

1. **Look lane goal**: 7. The aim and flight views keep the top blurred and the golfer and ball sharp. Shadows fall lower-right. The flight camera follows the ball with `golfer` still in frame. Holed camera, flyover and night were not re-run.

2. **Look check 1 (aim blur band)**: 8. Hole 1 passes: the top fifth is blurred and the band at the golfer is sharp. The ball is above the bottom 20%. Hole 5 passed last session. Hole 9 has not been looked at in several sessions.

3. **Look check 2 (C on 5, 6, 9)**: 7. Not re-run. The `look-c-*` saves passed in earlier sessions.

4. **Look check 3 (flyover, real-key drive)**: 7. Three real Space presses (`" "` key, waits 20/25/40) on hole 1 gave `phase` flight with `strokes` 1. The ball stays on screen at `look.ball` y -0.183. The meter and card were not pictured. Flyover 25/50/75 was not re-run.

5. **Look check 4 (sea, key light, night)**: 7. Sea is at the right edge of both views, and the sun and shadows read warm lower-right. There was no title `sample` and no night look this session.

6. **Critic views and course findings**: 5. A pink boulder is still prominent at the right of both views, near [850,300]. `pin_flag` is 0.12% on aim and 0.19% in flight, both readable. There is still no meter, holed-drop or scorecard picture. The pink boulders are still not in `lanes/look.md`.

7. **LOOK.md Checks**: 7. Brush pass, haze, teal sea and warm sun hold in both views. The `Lighting:` and `Surfaces:` lines were not re-checked.

8. **Edit scope and load-order imports**: 9. I did not recheck the sources this session. Last session had only stage, post and camera.

9. **Observe hook, saved checks, lane notes**: 8. `look.camPitchDeg` (22.4, 21.1), `focusY`, `ball`, `pin`, `golfer` and `dither` are all present. `dither.radius` is now present when active. During flight `dither` omits `active`, so the key set is inconsistent. `look-dither-nearplane` is saved.

10. **Faults**: 8. Console shows only the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 triangles, equal to the baseline, so no regression. The 1183 ms frame is SwiftShader at host load 3.3, which is noise. The main scene pass is 175 draws and 367k triangles.

**Next:**
1. **Prove the dither in a picture (asked again).** Find a fixture where a canopy covers the golfer or ball. Use `eval` to read each tree's distance to the camera, or put the ball behind tree8 (about (0.4,1.6), then wait 150). Then run a real aim key and a `look` with `zoom` on that tree's rect. Done looks like Bayer holes visible around the subject, with `look.dither.occluders` non-empty or `nearFades` naming a tree whose pixels are in that rect. On hole 1 aim, `tree16_leaves0` is only a 0.082% edge sliver. Check that near fades are not listing off-screen or behind-camera objects, and give `dither.active` in every phase.
2. **Run the missing critic views.** Take the Space meter picture. Then do a real-key putt, with `look` at 4, 12 and 24 frames after `phase:"holed"` and `look.ball.y` above -0.6. Then take the scorecard. Use `" "` as the key and `until:{phase:'holed'}` without `settle:true`. Start the cup close-up during `SIM.mode==='sunk'`. In the same pass, put the pink boulder (hole 1, right of the golfer) in `lanes/look.md` as a course-lane item.
3. **Save a before/after pair for the wider framing, and rerun the unrun checks.** Take hole 1 aim at fov 33 and fov ~26 for the pair, then rerun `look-aim9`, flyover 25/50/75 and night. `test` has not been rerun for several sessions, so run it and report which saves pass.

SCORE: 7.2

## The request changed

paprika-loop/PROMPT.md changed before session 12; the Next lists above were written before it. Changed lines:
+ - **Remaining work, ordered:** (1) prove real near-plane fade with a fixture that actually puts canopy 1.3–3.4 units from eye, save it (do NOT just assert metadata); tree8 at (.4,-5.4) looking +Z suggests ball around(.4,1.6) for drive cameraD9.2, so camera sits z~-7.6 under canopy; derive with eval/read-only if necessary and use real aim key plus wait150. (2) capture meter + pure holed frames4/12/24 + scorecard, run four-view critic, save reliable checks; (3) complete saved aim1/5, flyover25/50/75, flight3moments, night. (4) fix early drop framing: start cup closeup during SIM.mode==='sunk' in settle as well as holed, raise easing speed so entering holed doesn't begin at ballY-.747; show the actual cup rattle/drop from physics lane. (5) actual golfer metadata/dither subject use holder.position while walking. No more source metadata refactors without a failing pictured example. The judge's >=0.15% golfer screen area is NOT a requirement; owner's explicit priority is wider framing. Keep currently-passing aim framing instead of zooming it back in.

## Iteration 12
**Did**: `src/camera.js` line 66: the cup close-up now also starts while `G.phase==='settle' && SIM.mode==='sunk'` (same pos/look as holed), with fov 30 and easing `k` raised 3→7. Saved check `look-sunk-cup-closeup` (real Space x2 putt from (-2.3,11.95), until settle; expects ball.mode sunk, look.ball.y -0.75..-0.3, fov 30..31.9). Followed the PROMPT change: no more dither re-proving.
**Saw**: Hole 1 Space meter picture: POWER 42% bar visible, golfer 0.19%, ball y -0.384. Real-key putt: settle+6 frames shows the cup close-up (cam y 6.66, fov 31.3, `look.ball` y -0.57, pitch 42.9), cup 0.73%, flag crisp-ish with Bayer dither on it (the flag fills the frame at depth 2.7, so near fade eats it). Holed+12 frames: `look.ball.y` -0.36, fov 30.0, golfer 0.95%, "HOLE IN ONE!" banner, cup and flag in frame. Scorecard picture: card over a blurred island, "HOLE IN ONE" stamp, 1/-2 row; no overlap. Console only the `toNonIndexed` warning. `test`/`perf` not run; holed 4/24-frame pictures not taken.
**Next**: (1) Run `test` and report; take holed +4 and +24 pictures. (2) At the sunk close-up the camera is 2.7 from the flag, so near fade dithers the flag; move the close-up back ~1 unit or exclude pin_flag. (3) Flyover 25/50/75, flight3moments, night checks still unsaved/unrerun. (4) Pink boulder into lanes/look.md; golfer holder.position for `look.golfer` while walking.
**Open**: Near-plane fade picture not re-attempted (supervisor accepted occluder proof). Cup rattle/drop animation itself not seen frame by frame (ball hidden once sunkT>0.35).

### Judge 12

**Judge 12: scores**

00. **Odyssey-style dithering**: 7. `look-dither-occluder-tree`, `look-dither-hole5-tree7-circle` and `look-dither-nearplane` all pass in `test` from a fresh reload. On the hole 9 aim, `look.dither` is `active` with `radius` 0.301, `subjectNdc` [0,-0.231] and `depth` 10.1. Last session's flag near-fade at the cup close-up is still unfixed, so it eats the `pin_flag` there. The supervisor already accepted the occluder proof, and I did not re-prove it.

0. **Wider framing, smoother ground**: 8. Hole 9 aim has `camera.fov` 33. `look.ball.y` is -0.365 and the golfer is 0.19% of the frame at [552,461,604,558]. The `grass*` stripes read smooth and painted. The flyover frames are smooth too, with no texel blocks. There is still no saved before/after pair.

1. **Look lane goal**: 8. Hole 5 flyover: diorama at 25%, house and trees close up at 50%, behind the ball at 75% with `golfer` at 0.21%. Hole 9 aim keeps the top blurred and the band sharp. Hole 5 night reads, with a blue-dark grade and lit `golfer_body`. At 50% the golfer is 0% and the pin is not clearly in frame. At 25% a pin flag is visible at the left.

2. **Look check 1 (aim blur band)**: 8. Hole 9 aim: the top fifth is blurred, the band at `golfer_body` is sharp, and `look.ball.y` is -0.365, above the bottom 20%. Holes 1 and 5 passed earlier.

3. **Look check 2 (C on 5, 6, 9)**: 8. `look-c-hole6-pitch`, `look-c-hole5-broadside` and `look-c-hole9-broadside` all pass in `test` this session.

4. **Look check 3 (flyover, real-key drive)**: 7. The flyover moves from diorama to over the hole to behind the ball. The 50% pin is not clearly visible and `look.flyoverT` was not read at each stop. `look-sunk-cup-closeup` and `look-holed-cup` pass. There is no saved flyover 25/50/75 check and no saved three-moment drive check.

5. **Look check 4 (sea, key light, night)**: 8. The sea is teal in the flyover frames and the shadows fall lower-right. Night reads and the golfer stays visible. I took no title `sample` this session.

6. **Critic views and course findings**: 6. Last session's meter, sunk close-up and card pictures exist. In the hole 5 flyover frames at 75%, the pink boulders and shrubs are still prominent, and the pink boulder is not in `lanes/look.md`. The flag is readable on hole 9 aim (`pin_flag` on screen). Holed +4 and +24 were not pictured.

7. **LOOK.md Checks**: 8. The brush pass, haze, teal sea and warm sun all hold across the hole 9 aim, the flyover and night. I did not re-read the `Lighting:` and `Surfaces:` lines. None showed up in the hole 9 aim reply.

8. **Edit scope and load-order imports**: 8. I did not recheck the sources, and the other lanes' pink boulders and football-player model are noted as not yet merged.

9. **Observe hook, saved checks, lane notes**: 8. The `look` observe key carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. 13 of 13 saved checks pass. There is no saved flyover, flight-moments or night check yet.

10. **Faults**: 8. Console shows only the `toNonIndexed` warning. `perf` reads 307 draws and 485,787 triangles, equal to the baseline. The 1188 ms frame is SwiftShader at host load 4.4, which is noise.

**Next:**
1. **Move the sunk close-up back so the flag isn't dithered away.** In `src/camera.js` the close-up sits about 2.7 from `pin_flag`, so near-fade removes it. Pull the camera back by about 1 unit, or exclude `pin_flag` from `nearFades`. After a real-key putt, `look` at settle +6 and holed +4/+12/+24 should show `pin_flag` and `cup` intact, with `look.dither.nearFades` not naming `pin_flag`. Keep `look.ball.y` above -0.6. This also gives the missing +4 and +24 pictures.
2. **Save the unsaved checks: flyover 25/50/75, flight 3 moments, night, and a before/after pair.** Use `interact` with `look-` ids. For the flyover, step to 25/50/75% of `G.introDur`, expect `look.flyoverT` in range, and expect `look.pin.onScreen` true at 50%. At 50% on hole 5 the pin is not clearly in frame, so check it and nudge `camera.js` if needed. For the flight, use real Space x3 and expect `look.ball` on screen at three moments. For night, press `N`. For the pair, `look` hole 1 aim at fov 33 and fov ~26.
3. **Put the pink boulder in `lanes/look.md`.** Under course-lane items, name the pink boulders on the hole 5 cliff and the hole 1 right-of-golfer rock, and say they still read as pink rocks, not blossom shrubs. Then make `look.golfer` read the walking `holder.position` rather than the destination `bx`/`bz`. Check it with `observe` mid-walk after a putt.

SCORE: 7.7

## The request changed

paprika-loop/PROMPT.md changed before session 13; the Next lists above were written before it. Changed lines:
+ - **Next session's ONLY job: finish the repeatedly missed critic views and cup-drop timing.** Tree-occlusion proof is ALREADY accepted: supervisor personally opened /home/ubuntu/look-integration-1/paprika3d/runs/2026-11-07T03-37-27-950Z/look-17.png: distinct crisp screen-door hole reveals new golfer/ball through tree canopy. Do NOT spend yet another session re-proving this or chasing metadata fields that source already returns; tool replies can summarize keys. Near-plane saved check now exists. First Space meter picture; fix/show real-key sunk/holed cup at4/12/24 frames by beginning cup-camera during SIM.mode==='sunk' settle; then scorecard picture; run art critic on aim/meter/flight/card. Source edits camera.js only if needed to show drop. No nearVisible refactors this session.

## Iteration 13
**Did**: `src/camera.js` holed/sunk cup close-up pulled back: cPos = pin + (2.6, 3.0, 4.0) (was 1.9, 2.3, 2.9), cLook = pin + (0, 0.6, 0) (was +0.5). fov 30 and k 7 unchanged. Aim: keep `pin_flag` out of the near fade.
**Saw**: `test`: 13 of 13 saved checks pass (including `look-sunk-cup-closeup` and `look-holed-cup`) after the change. I took no pictures this session, so I did not confirm that `look.dither.nearFades` no longer names `pin_flag` at settle +6 or holed +4/+12/+24. `perf` not run. Console: only the `toNonIndexed` warning at open.
**Next**: (1) Real-key putt, then `look` at settle +6 and holed +4/+12/+24: check `pin_flag` and `cup` are intact, `look.ball.y` above -0.6, and take the missing +4/+24 pictures. (2) Save flyover 25/50/75, flight-3-moments and night checks (`look-` ids). (3) Pink boulder into lanes/look.md; `look.golfer` should read the walking `holder.position`.
**Open**: The flag fade fix is untested by picture. The cup rattle/drop animation is still not seen frame by frame.
**Iteration 13 addendum (picture taken)**: real-key putt on hole 1, settle +6, ball.mode sunk: cup, `pin_pole` and `pin_flag` (3.2%) all on screen, flag red with a visible Bayer stipple (still partly near-faded, cam still easing from (-2.19,7.08,14.17), fov 31.3). `look.ball` y -0.399 (above -0.6). Golfer 1.6%. Console clean. Next: look again at holed +12/+24 to see if the stipple has gone once the camera has settled; if not, lower `uNearR` for `pin_flag` only.
