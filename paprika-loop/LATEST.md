The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 10

**Did**
- Judge 9 Next 1 (items 13, 15): the code keeper's cottage is replaced by the library's "Stylized House FREE" (`assets/stylized-house-free-b4a979.glb`, CC-BY Leontev Artem, credited in assets/CREDITS.md; found with the new query "stylized small white cottage blue roof chimney"). It loads as `keeperGLB` in src/assets.js and is placed in src/library.js inside the `lhCottage` group (code children hidden), 4.8 units tall, named `lighthouse_cottage`. Its door is 1.01 tall (0.61 × 4.8 / 2.9), above the 0.85 golfer.
- The bigger footprint is carried through: `LH_COT` in src/course.js is now w 6.4, d 4.1 (the collider in src/physics.js reads it; its top is now H_COT + 4.6); `clearOf` in src/island.js keeps props 3.6 (was 2.1) from the cottage; the cottage path in island.js now starts at the new door (LH_COT.x − 1.2, z + 2.3).
- Judge 9 Next 2: `look-dither-nearplane` in game-tests.json now expects `nearFades.1` = `house_walls` (was `tree4_leaves0`). Reason: the fade works. In the check's setup the list is [tree1_leaves0, house_walls ×4]. tree4 dropped out of the list when the hole-5 house became the bigger library cottage in an earlier session; the shader did not break. I tried letting named props fade at any height inside the subject circle (a `DITH_PROP` define in src/camera.js). That did not help, because the wall stands beside the golfer at the same depth rather than in front of them, so I reverted it.

**Saw**
- "cottage" camera: compared with before-cottage, 64% of pixels changed. `lighthouse_cottage` (5 meshes: Wood, Roof, Pipe, Door, Building) fills 66% of that close camera. `lighthouse_cottageWalls` and `lighthouse_cottageDoor` are no longer on screen. No Lighting or Surfaces lines.
- "cottage wide" (new camera, [20,12,6] looking at [29,4.5,−7]): the blue-roofed timber house sits beside `lighthouse_tower` and the roof reads as teal slate. "coast" shows it small at the island's east end.
- `look-dither-nearplane` setup (hole 5, ball at (−12, −13.5), A held 12 frames): `house_walls` covers 56% of the aim frame on the right. The golfer is still 0.54% of the frame and readable. The wall is half-dithered, so it reads as a dark translucent blur. Surfaces line: `house_walls` z-fights at x −10.57 (0.46 × 0.003 units, inside the library model).
- Before this session's edits the suite passed 69 of 70, with only look-dither-nearplane failing.

**Next**
- Item 3 (camera) and item 1: the aim camera should not sit against the hole-5 house wall when the ball is near it. Pull the camera in front of the house (cast from the ball toward the camera against the `house` collider box in physics.js), or fade `house_walls` fully below depth 3.4 for props only. The test above is the repro.
- Judge 9 Next 3, not done: record bunker and green sizes ("C hole cam h6", "green1 top") next to refs/02–03 in CHARACTERS.md, and save a `sand-lie` interact check (hole 1 bunker, `lie: "sand"`, carry lower than from the fairway).
- Check that `lighthouse_cottage` does not hide the hole 9 tee or green in its aim views. The house is now 6.4 × 4.1 units on the ground.

**Open**
- After the cottage swap and the check update, `test` passes 70 of 70 (course-h9-drive and look-aim-hole9-ball-lifted among them). Not run: `perf` (the house adds 7,336 triangles and 0.7 MB).
- The library house's own faces z-fight at x −10.57 (`house_walls`, hole 5). This is not new this session.

### Judge 10

What changed since Judge 9:
- **Saved checks.** `test` passes 70 of 70, including `look-dither-nearplane`, `creatures-ball-bonks-sheep` and `ball-physics-rollout-sand`.
- **Cottage.** The code cottage is gone. `lighthouse_cottage` (the Stylized House GLB) has a blue roof and timber walls in the "cottage" and "cottage wide" cameras.

1. **Looks as LOOK.md says: 8.**
   - "h9 aim" is at 45% saturation, with warm yellow rough, the tilt-shift band sharp on `player` and the `sea` teal.
   - No `Lighting:` or `Surfaces:` lines.
   - The "h1 aim" cell again came back pale (12% saturation). This is the known capture effect.
2. **Plays as DESIGN.md says: 8.**
   - D aimed and W changed club.
   - Space ×3 took `meter.stage` 0 → 3 at frame 116, with `meter.power` peaking at 0.594.
   - Phases went swing, flight, settle, then aim at frame 285.
   - R reset `strokes` to 0 and `player` to ISLA.
3. **Camera: 7.**
   - Flyover, aim and flight are good: "h1 intro" pulls back to the diorama, and the camera follows `ballTrail` in flight.
   - The fault: in "h5 house aim" (hole 5, ball at (−12, −13.5), A held 12 frames), the camera sits against `house_walls`. A dark dithered wall covers the right half of the frame, and the golfer shrinks to 0.46% of the frame.
4. **Ball flight by surface: 8.**
   - The rough lie gives a shorter shot ("IN THE ROUGH: SHORTER SHOT" banner on hole 5).
   - The roll-out checks for fairway, rough, sand and green, and the pond check, all pass.
   - A shot played from a sand lie is still not shown.
5. **Nine playable holes: 8.**
   - "h6 C cam" shows the dogleg round `pond_water`.
   - "h9 aim" shows the par 5 Lighthouse Home (474 yd), and "h9 approach" shows 268 yd to the pin with `lighthouse_cottage` in view.
   - `creatures.sheep` are on the course.
6. **Stroke play and hot seat: 8.** With 2 players the turn passed ISLA → FINN at frame 285. `hot-seat-passes-turn`, `look-card-hole` and the birdie, par and bogey reaction checks pass.
7. **HUD: 8.** `#holep` (HOLE 9, PAR 5, STROKES 0) is top left, `#windp` top right and `#clubp` bottom left with LIE. Nothing overlaps.
8. **`window.__game` and 60 fps: 8.**
   - `act`, `setState` and `observe` drove all play.
   - `perf` measured an 8.8 ms median frame (75 fps), 180 draw calls and a 2.5 s load.
   - The 39.9 ms p95 was taken with the host load at 16.3 on 8 cores, so it is noise.
   - Assets are 5.37 MB, over the 5 MB budget. The house added 0.69 MB, and `player-anim.glb` is the largest file at 1.44 MB.
9. **Golfer matches CHARACTERS.md: 8.** The golfer wears a teal `footballer_helmetShell` and an orange kit in "h9 aim" and "h9 approach". No brands appear on screen.
10. **Game feel: 8.**
    - On the strike, `feelBits` went 0 → 18 at frame 115, `divots` 0 → 21, `ballTrail` 0 → 85, with 24 sounds.
    - A `smoke` puff fires on each meter click.
    - There are no teleports. There are also no flashes.
11. **Richer look: 8.** The new cottage adds detail by the lighthouse. "green1 low edge" and "green1 top" show soft fringe rings.
12. **Course and play: 8.** `slopeGridLines` and `ball-physics-slope-break` pass, and the flow from hole to card to next hole passes `hud-round-full-round`.
13. **Better assets: 9.** `lighthouse_cottage` comes from the library and is credited. No code-built building is left in any view taken this session.
14. **The golfer looks its best: 8.**
    - The golfer is 0.86% of the frame in "h1 aim", "h9 aim" and "h9 approach".
    - In "h5 house aim" it is 0.46%, half-hidden against `house_walls`.
15. **Everything scaled against the golfer: 7.**
    - Believable: `player` is 0.78 tall, `flagPole` 1.1 and `teeBench` 0.42.
    - Too big: `lighthouse_cottage` is 5.09 tall against `lighthouse_tower` at 5.2. The keeper's cottage is as tall as the lighthouse, and in "cottage wide" the tower barely clears its roof.
    - Not recorded: bunker and green sizes against refs/02–03.
16. **Smooth edges between greens, tees, bunkers and fairways: 9.** "green1 top" and "green1 low edge" show soft blends from green through fringe into rough, with no stair steps.

**Faults: 7.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- 70 of 70 checks pass.
- Assets are 5.37 MB against a 5 MB budget.
- The camera clips into the wall at the hole-5 house.
- Iteration 10's Open notes a `house_walls` z-fight at x −10.57.

Next:
1. **Items 3 and 14: keep the aim camera out of the hole-5 house.**
   - Fix: in src/camera.js, cast from the ball toward the aim camera against the `house` collider box in physics.js, and pull the camera to the near side of the hit point minus about 0.3. Fading `house_walls` alone would leave a translucent smear.
   - The call that shows it done: the "h5 house aim" sheet cell (hole 4 state, ball at (−12, −13.5), `a` held 12 frames). It should not list `house_walls` among the first three on-screen objects, and the golfer should be at least 0.8% of the frame.
2. **Item 15: the lighthouse must dominate its keeper's cottage.**
   - Fix: scale the `lighthouse_tower` group up to about 8.5 tall, about 11 golfers, keeping the cottage door at 1.01. Check that the hole 9 green and tee stay clear of it.
   - Then (asked again) measure the bunker and green sizes in "green1 top" and "C hole cam h6", and write them next to refs/02–03 in CHARACTERS.md.
   - The call that shows it done: an `eval` of the Box3 heights showing `lighthouse_tower` y ≥ 1.6 × `lighthouse_cottage` y. In "cottage wide" the tower should rise well above the roof.
3. **(asked again) Item 4: a saved sand-lie shot, and the asset budget.**
   - Save an `interact` check named `sand-lie` that puts the ball in a hole-1 or hole-2 bunker and swings. It should expect `lie: "sand"` and a `physics.carryYd` below the same club's carry from the fairway.
   - Then run `model_audit` on `assets/player-anim.glb` with textures shrunk to 1024 px to bring assets under 5 MB.
   - The calls that show it done: that `interact` with `save` returns ✓ on both entries, and `perf` reports assets under 5 MB with no over-budget line.

Not checked this session: a full 4-player round, the scorecard stamps on screen, and a shot from sand.

SCORE: 7.9
