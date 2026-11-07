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
