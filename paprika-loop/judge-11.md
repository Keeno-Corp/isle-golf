What changed since Judge 10: the hole-5 aim camera no longer sits in the house, the lighthouse tower now stands well above its cottage, and a shot from sand was played for the first time.

1. **Looks as LOOK.md says: 8.** "h9 aim", "h9 approach" and "h1 putt" sit at 45–46% saturation with the focus band on `player`, a teal `sea` and warm rough. No `Lighting:` or `Surfaces:` lines. The "h1 intro" cell at frame 90 came back pale (12% saturation), the known capture effect.
2. **Plays as DESIGN.md says: 8.** Real keys: D aimed, W changed club, Space ×3 ran the meter, and phases went aim → swing (frame 85) → flight (97) → settle (258) → aim (301). C toggled `overhead`.
3. **Camera: 8.** "h5 house aim" no longer lists `house_walls`, and the golfer is 3.4% of the frame. The pin is off the top of that frame. "h1 flight" follows `ballTrail`, and `camera.fov` goes 28.75 → 33.69 on the strike.
4. **Ball flight by surface: 9.** Sand lie played: from (−24, −12.5) the banner reads BUNKER and an iron at 0.8 power carries 72 yd, against 111 yd from the fairway at (−30, −5). The roll-out, wind, slope and pond checks pass.
5. **Nine playable holes: 8.** "h6 C cam" shows the dogleg round `pond_water`. "h9 aim" shows par 5, 474 yd, Lighthouse Home. `sheep` are on the hole-1 green surround, and the sheep bonk checks pass.
6. **Stroke play and hot seat: 8.** "h1 card" shows the Pebble Step scorecard with a HOLE IN ONE stamp and −2. With 2 players the "FINN TO PLAY" banner showed after ISLA's shot.
7. **HUD: 8.** Hole, par and strokes are top left, wind top right, the club list bottom left, key hints bottom right. Nothing overlaps in nine cells.
8. **`window.__game` and 60 fps: 8.** `act`, `setState` and `observe` drove everything. `perf` measured a 7 ms median frame (79 fps), 180 draw calls and a 2.0 s load. The 40.2 ms p95 was taken at host load 6.3 on 8 cores, so it is noise. Assets are still 5.37 MB against the 5 MB budget.
9. **Golfer matches CHARACTERS.md: 8.** Teal `footballer_helmetShell` and orange kit in every aim cell. No brands on screen.
10. **Game feel: 8.** On the strike `feelBits` went 0 → 15 at frame 85, a `smoke` puff fired on each meter click (frames 34, 68, 102), `divots` 0 → 21, `ballTrail` 0 → 77, and 19 sounds. No flashes. `feel` found no shake or out-and-back camera move on the strike: the camera "did not come back".
11. **Richer look: 8.** "lighthouse far" now reads as a proper landmark: striped tower over the blue-roofed cottage against the sea.
12. **Course and play: 8.** `slopeGridLines` shows in "h1 putt". `hud-round-full-round` and `ball-physics-slope-break` pass.
13. **Better assets: 9.** 19 library GLBs load, and no code-built object appears in any of the 15 views.
14. **The golfer looks its best: 8.** 0.86% in "h9 aim" and "h9 approach", 0.68% in "h1 putt" and clear of the putt line. In "h5 house aim" it is 3.4%, large but readable, standing in tall `grass`.
15. **Everything scaled against the golfer: 8.** The visible `lighthouse_tower` is 8.5 tall against `lighthouse_cottage` at 5.09, a ratio of 1.67. `flagPole` is 1.1 and `teeBench` 0.42. The cottage is still 6 golfers tall against the hole-5 `house_walls` at 3.6, and bunker and green sizes are still not written next to refs/02–03.
16. **Smooth edges: 9.** "green1 top" and "green1 low edge" show soft green-to-fringe-to-rough blends with no stair steps. The hole-9 bunker edge in "bunker h9" is soft too.

**Faults: 7.**
- No console errors; the only warning is the known `toNonIndexed` one.
- 70 of 70 saved checks pass, run after the physics.js collider edit.
- Assets are 5.37 MB against 5 MB, for the third verdict running.
- Hidden code stand-ins still share the names `lighthouse_tower` and `house_walls` with the library models.
- The `house_walls` z-fight is still inside the model, just out of view.

Next:
1. **(asked again) Faults and item 8: bring assets under 5 MB and remove the hidden stand-ins.**
   - Run `model_audit` on `assets/player-anim.glb` (1.44 MB) with textures shrunk to 1024, and on `bench-stylized-ee9269.glb` (0.43 MB for a 0.42-tall bench) at 512. Load the `-opt` files.
   - Delete the hidden code `lighthouse_tower` and `house_walls` meshes so `find` returns the library models.
   - The call that shows it done: `perf` reports assets under 5 MB with no "over budget" line.
2. **(asked again) Items 4 and 15: save the sand-lie check and record the sizes.**
   - Save an `interact` check named `sand-lie`: hole 1, `{state: {ball: {x: -24, z: -12.5}}}`, then `{action: "swing", power: 0.8, accuracy: 0, club: "iron", aimDegrees: 0, settle: true}`. Expect `lie: "sand"` before the swing and `physics.carryYd` in [50, 95]. This session it gave 72, against 111 from the fairway.
   - Measure the bunker and green widths in "green1 top" and "h6 C cam" in golfer heights and write them beside refs/02–03 in CHARACTERS.md. While there, bring `lighthouse_cottage` down to about 4 tall, with the door kept at 1.01.
   - The call that shows it done: `interact` with `save: "sand-lie"` returns ✓ on both entries, and `test` lists 71 of 71.
3. **Items 3 and 10: keep the pin in the pulled-in hole-5 view and give the strike a kick.**
   - In `clearHouse` in src/camera.js, keep the look point farther out, or widen the fov by about 6° while it is active, so the pin comes back into frame and the golfer drops to 1–2%.
   - On the strike, add a 3–4 frame hit-stop and a small camera shake that returns.
   - The calls that show it done: the "h5 house aim" sheet cell has `look.pin.y` at or below 1 with the golfer between 1% and 2%, and `feel` on Space ×3 reports a shake or an out-and-back camera move near frame 85.

Not checked this session: a full 4-player round, the evening light (N), mouse drag aim, and the hole-9 tee and green clearance from the taller tower beyond the two hole-9 aim cells.

SCORE: 8.1
