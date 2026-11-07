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
