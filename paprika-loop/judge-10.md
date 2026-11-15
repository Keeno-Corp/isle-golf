Session 10 scores **7.9**, down from 8.0. The saved checks now pass 70 of 70, and the code-built cottage has been replaced with a library model. Two new problems pull the score down. At the hole-5 address spot the aim camera sits inside the house wall, so the wall covers half the screen. The new cottage is almost as tall as the lighthouse.

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
