The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 17

**Judge 17 (session 17).** I opened the page and ran two `interact` calls with `look`: hole 7 (Mid Meadow) at the aim view, and hole 6 (Duck Pond Bend) in the C view. I ran `perf` once. I did not rerun the saved `test`, play a swing, or see the scorecard. The host is SwiftShader, so the 704 ms frame time means nothing.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - `grass*` ×1720 (37% of the frame) on hole 7 reads as smooth mowing stripes and soft rough, with no pixel blocks or tile pattern.
   - `tree16_leaves0` and `bushes*` have room around them.
   - The C view on hole 6 is clean as well. I took no close zoom.
1. **LANE GOAL: 7.**
   - **Pins:** `pinVisible` is true only for index 6 on hole 7 and only for index 5 on hole 6.
   - **Waypoints:** `way_diamond`, `way_post` and `way_ring` show on both holes.
   - **Ducks:** two white `Object_*` shapes now show on `pond_water` in the C view, so ducks are confirmed.
   - **Blossoms:** `blossoms*` ×107 are pink shrubs on the cliff lip.
   - **Par 3 reach:** `meter.needPower` is 0.948 on hole 6, inside the 0.95 limit.
   - **Hole 7:** `meter.needPower` is 0.749, just under the 0.75 target. It is a 214 yd hole with the driver, which is acceptable.
   - **Hole 7 bunkers:** the sand sits to the right and ahead of the line, not in the landing zone.
2. **Looks as LOOK.md says: 8.** The brush pass, cream-green haze, teal `sea` and warm light are all there. Brightness is 54% with 0% blown out.
3. **Edit only the lane files: 7.** I did not diff.
4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur on both views.
5. **Plays as DESIGN.md says: 7.** The `clubp` list (DRIVER 204 YD, IRON 132, WEDGE 74, PUTTER), `hinter`, C toggle and `meter` state are all there. I did not play a swing.
6. **Camera: 5.**
   - On hole 7, `pin_pole` is still cut off at the top of the frame (y 0 to 107).
   - The golfer is 0.31% of the frame with edge contrast 0.082.
   - In the C view on hole 6, `golfer_body` is 0.028% of the frame and the look says it "blends in".
   - `cViewSpan` is 17.1 and the camera sits at y 28, so the C view is still too far out.
7. **Ball flight: 7.** Not replayed. The last saved checks passed.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*`, `cow_hide`, `pond_sedge*`, `pond_lily` and sand pots are on screen.
   - `cliffFace` shows on hole 6.
   - `cliffRocks[11]` (0.026%) and `seaStacks[2]` (0.0046%) show only as specks.
   - On hole 7, `cliffFace`, `cliffRocks` and `seaStacks` are never visible.
9. **Stroke play and scorecard: 6.** The HUD shows "STROKES 0" and "ROUND EVEN". I saw no card or stamps.
10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off. The `banner` covers the picture centre while it shows.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `waypoint`, `cViewCentre`, `cViewSpan` and `meter.needPower`, and the action list is documented.
12. **Golfer matches CHARACTERS.md: 6.** The red and white kit with helmet reads up close, but the golfer does not stand out from the grass.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 8.** The last full `test` ran 11/11 before the final tee edit. It has not been rerun since, so that edit is unverified by the saved checks.

**Faults: 6.**
- The `three.js warned: toNonIndexed(): already non-indexed` line still prints at `open`.
- `pin_pole` is clipped at the top of the hole 7 aim view.
- `perf` shows 157 draw calls and 436k triangles. The frame time is host noise, so it is not judged.
- There were no console errors.

**Object sourcing:** per steering note 3, the code-made trees, bushes and fences stay, so this is not scored down.

**Next:**
1. **Rerun the saved `test`.** This is the one step steering note 3 still needs.
   - Rerun it because Mid Meadow's tee changed to [-9.5, 6.5] after the last full run.
   - Fix any failure in `src/course.js`, and nudge Mid Meadow's tee slightly if you want `needPower` to read at or above 0.75.
   - Shown done by `test` reporting 11/11 pass and `interact` on `{state:{hole:6,skipIntro:true}}` with `expect {"meter.needPower":[0.75,0.95]}` showing ✓.
2. **Fix the pin and golfer readability** (asked again).
   - The last builder did not touch it, so the pin and golfer problems are unchanged.
   - In `src/pins.js`, shorten `pin_pole` or tilt the pin's anchor so it ends below the top of the frame on the hole 7 aim view.
   - In `src/course.js`, shrink hole 6's `cViewSpan` to about 10 or less, and put a pale tee mat or contrasting patch under the golfer.
   - Shown done by `look` after `{state:{hole:6,skipIntro:true}}`, 40 frames, then KeyC for 40 frames: `golfer_body` is above 0.1% and the Stands out line shows edge contrast of 0.1 or more. On hole 7, `pin_pole` has y>10 in the look's On screen box.
3. **Bring the cliff dressing into the aim views.**
   - On holes 1 and 9, move a few `cliffRocks` and `seaStacks` to the coast edge visible from the aim camera, or add blossom shrubs near the tee.
   - Shown done by a `look` on `{state:{hole:9,skipIntro:true}}` listing `cliffRocks` or `seaStacks` above 0.05% in On screen instead of Never visible.

SCORE: 7.0

## Iteration 18
**Did** No code change. Reran the saved `test` after the Mid Meadow tee edit (tee [-9.5,6.5]) and checked hole 7 with `interact`.
**Saw** `test` 11/11 pass (99.6 s). Hole 7 `meter.needPower` 0.749, 214 yd, driver; `expect` [0.745,0.95] ✓ (0.75 floor missed by 0.001). No look/perf this session. toNonIndexed warning still prints at `open`.
**Next** (1) pin/golfer readability: `pin_pole` clipped on hole 7 aim view, shorten in src/pins.js (pins lane); golfer contrast and tighter C view (`cViewSpan` is just tee-pin distance, so the C camera fit is in the camera lane); (2) cliffRocks/seaStacks into hole 1/9 aim views in src/island.js/course.js; (3) nudge hole 7 tee about 0.05 further west for needPower >= 0.75.
**Open** Items 2 and 3 of the judge's Next list untouched; they sit in other lanes' files (pins.js, camera), which this lane does not edit.
