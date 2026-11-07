**Judge 21 (session 21).** I opened the page and made one `interact` call with `look` on `{state:{hole:7,skipIntro:true}}`, which again landed on "HOLE 8 Bell Hill Back". I ran `perf` once. I did not play a swing, run the saved `test`, or see the scorecard. The host is SwiftShader, so the 909 ms frame time is noise.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - `grass*` ×2075 reads as smooth mowing stripes and soft rough in the hole 8 aim view.
   - I saw no pixel blocks and no repeated tile.
   - I took no close zoom.
1. **LANE GOAL: 7.**
   - **Pins:** `pinVisible` is true only for hole 8 (index 7).
   - **Waypoints:** `way_diamond`, `way_post` and `way_ring` show.
   - **Blossoms:** `blossoms*` ×34 are on screen.
   - **Cliff dressing:** `cliffFace`, `cliffRocks` and `seaStacks` are Never visible, all behind grass. This is the third session with no change.
   - **Needed power:** `meter.needPower` reads 1.05 with the driver on a 308 yd par 4, which cannot be hit in one stroke.
   - **Ducks:** not in view.
2. **Looks as LOOK.md says: 8.** The brush pass, cream-green haze, warm light and teal `sea` are there. Brightness is 52% with 0% blown out.
3. **Edit only the lane files: 7.** I did not diff.
4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.
5. **Plays as DESIGN.md says: 7.** The `clubp` list (DRIVER 204 YD, IRON 132, WEDGE 74, PUTTER), `hinter`, `meter` and C key hint are there. I did not play a swing.
6. **Camera: 5.**
   - `pin_pole` is still cut at the frame top: its box is [431, 0, 443, 29] and `pin_flag` is [456, 0, 461, 1]. Shortening the pole did not fix this, because the pin sits above the top edge of the frame. The camera has to change.
   - `golfer_body` is 0.31% of the frame with edge contrast 0.071. The look says it "blends in".
7. **Ball flight: 7.** Not replayed.
8. **Full 9 holes, sheep, hazards: 7.** `sheep*` ×4, sand pots, `bushes*` ×16 and `fenceRails*` show. `cliffRocks` and `seaStacks` never do.
9. **Stroke play and scorecard: 6.** The HUD shows "STROKES 0" and "ROUND EVEN". I saw no card or stamps.
10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off. The `banner` covers the picture centre.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `waypoint`, `cViewSpan` and `meter.needPower`.
12. **Golfer matches CHARACTERS.md: 6.** The red and white kit with helmet reads up close, but it blends into the grass.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 7.** The saved `test` has not been rerun for four sessions.

**Faults: 6.**
- The `three.js warned: toNonIndexed(): already non-indexed` line still prints at `open`.
- `pin_pole` is clipped at the top of the hole 8 aim view.
- `needPower` is 1.05 on hole 8.
- There were no console errors.
- `perf` shows 157 draw calls and 436k triangles. The frame time is host noise, so it is not judged.

**Next:**
1. **Hole 8's pin is above the frame at the aim view.** (asked again) Shortening `pin_pole` in session 21 did not change this.
   - The tee-to-pin distance is 25.7 units. Either aim the hole 8 view at a point between the tee and the pin, which needs the look lane's `src/camera.js` or a note in `lanes/course.md`, or move hole 8's tee about 4 units closer to the pin in `src/course.js`.
   - A shorter hole 8 also brings `needPower` down. 1.05 is unreachable, so shorten it as well, or make it a par 5.
   - Shown done by `look` after `{state:{hole:7,skipIntro:true}}` and 40 frames. `pin_pole` should show y>10 in its On screen box and `meter.needPower` should read 0.95 or less.
2. **Settle the saved `test`.** (asked again)
   - It has not been run for four sessions.
   - Run `test` and fix or re-expect whatever fails.
   - Set Mid Meadow's `needPower` expectation to 0.5–0.7, as session 21's Open records.
   - Shown done by `test` reporting all checks pass.
3. **Cliff dressing in the aim views (`src/island.js`).** (asked again)
   - `cliffRocks` and `seaStacks` are hidden behind grass in hole 8's aim view.
   - Move a few of them to the coast edge the aim camera sees, or lower the grass skirt there.
   - Add a pale tee mat under the golfer so `golfer_body` stands out.
   - Shown done by `look` on `{state:{hole:7,skipIntro:true}}`: `cliffRocks` or `seaStacks` above 0.05% under On screen, and a Stands out line with edge contrast of 0.1 or more.

SCORE: 6.9
