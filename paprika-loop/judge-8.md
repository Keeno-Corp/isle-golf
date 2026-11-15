Iteration 8's section in PROGRESS.md is only a placeholder ("running the full test suite now"). It has no Did, Saw or Open, so this verdict is based on the page alone.

Three of Judge 7's asks are done:
- **Code meshes replaced.** `seaStacks`, `cliffRocks`, `teeMarker`, `pin_flag`, `pin_pole` and `way_post` are hidden. In their place are `seaStacksLib`, `cliffRocksLib`, `teeStone` and a library `flagPole` with `flagPennant`. The "pin1 close" camera shows a red triangle pennant on a 1.1 pole over a 0.23 `cup`.
- **Golfer polish started.** `footballer_outline` exists. On the aim views the golfer now takes 0.54% of the frame, up from 0.36%. The walk is quick: after the putt's aim began, the golfer covered 1.9 units and stopped at frame 11, at the ball.
- **Waypoint marker.** `way_diamond` is 0.25 tall.

Not done: the strike punch and the `aimLanding` teleport are unchanged.

The pale haze frames (`#b5c8bc`, 12% saturation) are a capture effect. The same moment came back at 47% saturation once the step drew (`draw: true`), so they are not a game fault.

1. **Looks as LOOK.md says: 7.** On "h1 aim" saturation is 46%. The tilt-shift band is sharp on `player` and blurred above and below. The `sea` is teal past `cliffFace` in "stacks low". There are no `Lighting:` or `Surfaces:` lines. The title cell is still pale, at 12% saturation.
2. **Plays as DESIGN.md says: 8.** D aimed and W changed club. Space ×3 took `meter.stage` 0 → 3 at frame 215, with `meter.power` peaking at 0.449. Phases went swing, flight, settle, then aim at frame 405. The banner read "IN THE ROUGH: SHORTER SHOT".
3. **Camera: 8.** The aim view is high behind the ball (pitch 21.2° on the putt). "h1 flight" follows the `ballTrail`. "h1 intro" pulls back with the "PAR 3 · 129 YD · PEBBLE STEP" card. "C hole cam h6" shows the hole from above, round `pond_water`.
4. **Ball flight by surface: 8.** The ball went from fairway to green, and the rough lie gives a shorter shot. A sand lie is still not shown.
5. **Nine playable holes: 8.** Holes 1, 6 (Duck Pond Bend, par 4, 206 yd) and 9 (Lighthouse Home, par 5, 474 yd) each look different. There are 10 sheep walking in `creatures.sheep`.
6. **Stroke play and hot seat: 8.** Hot seat is checked for the first time. With 2 players, `hudRound.turn` went ISLA → FINN at frame 330, then back to "ISLA TO PLAY" because Isla was farther from the pin. Both balls show on the green.
7. **HUD: 8.** `#holep` is top left with the player's colour dot. `#windp` ("2 MPH CROSS →") is top right. `#clubp` is bottom left and `#hinter` bottom right. There is no overlap.
8. **`window.__game` and 60 fps: 9.** `act`, `setState` and `observe` all drove play. `perf` measured a 7.7 ms median frame, 4.67 MB of assets and a 1.9 s load. The 40.1 ms p95 was taken with the host load at 11.5 on 8 cores, so it is noise.
9. **Golfer matches CHARACTERS.md: 8.** `footballer_helmetShell` is teal, the jersey is in the kit colour with dark panels, and `footballer_outline` is present. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 10 sounds.
    - Camera: "moved up to 67.215 … at frame 134 and did not come back", so there is still no punch.
    - Teleport: `aimLanding` still jumps 0.58 units at frame 151.
11. **Richer look: 7.** The new `flagPennant` and library rocks help. Otherwise it is the same set of library trees, `bushes`, `hydrangeas`, `teeBench` and `slopeGridLines` as last time.
12. **Course and play: 8.** In "putt address" the golfer is now at the ball, which Judge 7 asked for. The `slopeGridLines` arrows make the green slope readable, and the putt view stays clear.
13. **Better assets: 8.** The four code meshes are replaced by library models. `lighthouse_cottageWalls`, `lighthouse_cottageRoof` and `lighthouse_cottageDoor` are still code: a plain white box with a teal roof in the "cottage" camera.
14. **The golfer looks its best: 6.**
    - Size: 0.54% of the frame on "h1 aim", "h6 aim" and "h9 aim", under the 0.6% asked for. It is 1.3% on the putt and never blocks the view.
    - Outline: `footballer_outline` covers only a box of about [470, 441, 542, 491] on a golfer whose box is [439, 382, 565, 636], so it is not a full silhouette.
    - Idle: not checked.
    - On the aim views the golfer is still a small orange figure.
15. **Everything scaled against the golfer: 7.**
    - Believable: the golfer is 0.78 tall, the pin 1.1, `way_diamond` 0.25, `sign_board` 0.46 × 0.23 and `teeBench` 0.42.
    - Larger by design: the `cup` (0.23) and the ball are drawn about 4–5× real size.
    - Not checked against refs/02–03: bunker and green sizes are still not recorded.

**Faults: 8.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- The `aimLanding` teleport remains.
- PROGRESS.md's Iteration 8 is a one-line placeholder, so its Did and Open are missing.
- The sheep-bounce and sand-lie checks are still not saved.

Next:
1. **Item 14, the golfer reading clearly on the aim views.** This is the lowest score.
   - Aim camera: in `src/camera.js`, bring the full-shot aim camera's D in until the golfer covers at least 0.8% of the frame, keeping the ball's y between −0.6 and 0.6.
   - Outline: make `footballer_outline` an inverted hull over the whole skinned mesh (helmet, arms and legs, not only the torso).
   - Idle: add a slow breathing idle at address.
   - Check it: the "h1 aim" sheet cell (state `{hole:0, skipIntro:true}`, frames 150) should show the golfer at ≥0.8%, and `look` `zoom` on its box should show a dark edge all round.
2. **(asked again) The strike camera punch and the `aimLanding` teleport.** Judges 6 and 7 asked for this, and Iteration 8 left it untouched.
   - Punch: at the swing → flight frame, push the camera 0.3 units along the view direction and ease it back over 0.15 s.
   - Teleport: fade or hide `aimLanding` at the swing instead of moving it.
   - The call that shows it done: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, {action:"swing",power:0.75,accuracy:0}` and `frames:40`. Its Camera line should end "… and came back", and Teleports should be 0.
3. **Item 15 and item 13: the scale record and the last code-built building.**
   - Cottage: replace `lighthouse_cottage*` with a library cottage. Reuse the already loaded `fantasy-cottage-gart130-56175c.glb` at about 2.6 wide, or `pick` from the sourcing.json "stylized stone cottage" searches. Then hide the code meshes. Check it with the saved "cottage" camera.
   - Bunkers and greens: measure them in the "C hole cam h6" cell and write the numbers next to refs/02–03 in CHARACTERS.md.
   - Saved checks: save a sand-lie check with `interact` `save`, expecting `lie: "sand"` and a shorter carry.

Not checked this session: a sand lie, a full 4-player round, and the golfer's idle.

SCORE: 7.7
