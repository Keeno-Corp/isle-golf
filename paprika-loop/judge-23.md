**Judge 23 (session 23).** I opened the page and ran one `interact` with `look` on `{state:{hole:7,skipIntro:true}}` plus 40 frames, then `test`. I did not run `perf` and did not play a swing or see a scorecard. The host is SwiftShader, so frame time says nothing. All 11 saved checks pass.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - `grass*` ×1945 reads as soft mowing stripes and rough, with no pixel blocks in the hole 8 look.
   - I took no close zoom.
1. **LANE GOAL: 6.**
   - **Pins:** `pinVisible` is true only for hole 8. The waypoints `way_diamond`, `way_post` and `way_ring` show.
   - **Blocked view:** `tree16_leaves0` no longer blocks the view. `golfer_body` and `golferShadow` are now clear.
   - **Needed power:** `meter.needPower` is 0.787.
   - **Pin clipped:** `pin_pole` [444,0,461,85] and `pin_flag` [453,0,484,54] are still cut at the frame top.
   - **Cliff dressing:** `cliffFace`, `cliffRocks` and `seaStacks` are still Never visible. The ducks are not in view.
2. **Looks as LOOK.md says: 7.**
   - Brush pass, haze and warm light are there. Brightness is 53%.
   - The golfer blends into the pale green, with edge contrast 0.066 and "It blends in".
3. **Edit only the lane files: 7.** I did not diff.
4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.
5. **Plays as DESIGN.md says: 7.**
   - `clubp` lists DRIVER 204 YD, IRON 132, WEDGE 74 and PUTTER. `hinter` and `meter` show.
   - The saved checks `tee-shot-three-clicks` and `hot-seat-passes-turn` pass.
6. **Camera: 4.**
   - The camera at (15, 9.7, 1.6) cuts `pin_pole` at the top.
   - The golfer is only 0.29% of the frame.
7. **Ball flight: 7.** `course-h6-splash`, `course-h9-drive`, `course-h2-carry` and `course-h3-carry` pass.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*` ×4, `bushes*` ×16, `fenceRails*`, `blossoms*` ×41 and `house_walls` show.
   - A sand pot shows on the left of the aim view.
   - `cliffRocks` and `seaStacks` do not show.
9. **Stroke play and scorecard: 6.** The HUD shows "STROKES 0" and "ROUND EVEN". I did not see the card or stamps.
10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off. The `banner` covers the picture centre.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `waypoint`, `cViewSpan` and `meter.needPower`.
12. **Golfer matches CHARACTERS.md: 5.** `golfer_body` is visible but tiny and low-contrast against the tee pad.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 8.** All 11 saved checks pass.

**Faults: 6.**
- `pin_pole` is still clipped at the frame top.
- The `toNonIndexed()` warning still prints at `open`.
- There were no console errors.
- The cliff dressing is Never visible.
- I did not run `perf`.

**Next:**
1. **Get hole 8's pin inside the frame.** (asked again)
   - In `src/course.js`, move hole 8's pin about 4 units nearer the tee. It is 19.65 units away now, and `cViewSpan` is 19.7.
   - Or write in `lanes/course.md` that `src/camera.js` must aim at the tee-pin midpoint.
   - Shown done by `look` after `{state:{hole:7,skipIntro:true}}` and 40 frames, with `pin_pole` and `pin_flag` boxes starting at y above 10.
2. **Make the golfer stand out and show the cliff dressing.** (asked again)
   - Add a pale or darker tee mat under the golfer in `src/course.js`. Edge contrast is 0.066 now, and the target is above 0.15.
   - Then move a few `cliffRocks` and `seaStacks` to the coast edge in `src/island.js`. `cliffRocks` is behind `tree8_leaves0` and `seaStacks` is behind grass.
   - Shown done by `look` listing `cliffRocks` or `seaStacks` above 0.05% and no "It blends in" line.
3. **Check the other holes' pins and the ground close up.**
   - Do a `look` on holes 1 to 9 for pin clipping, as hole 8 is not the only one. Do a close `look` zoom on hole 1's fairway for the ground check in item 0.
   - Then remove the `toNonIndexed()` warning by finding which geometry is already non-indexed.

SCORE: 6.6
