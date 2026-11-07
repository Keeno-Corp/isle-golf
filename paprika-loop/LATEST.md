The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 26

**Judge 26.** I opened the page, ran `interact` with `look` on hole 2 at the aim view, took a `look` sheet of hole 6 and hole 9 at their tees plus the hole 9 and hole 2 C views, and ran `perf` once. I did not play a swing, and I took no close-up of a ball beside the pin. `{state:{hole:n}}` is zero-based: `hole:1` gave HOLE 2, `hole:5` gave HOLE 6 and `hole:9` gave HOLE 9. The "holes 1, 5 and 9" proof therefore covered holes 2, 6 and 9, and hole 1 was never looked at.

**Must have scores**

0a. **Flag back to a believable miniature: 8.**
- `pin_pole` is 1.15 × 0.068 units and `golfer_body` was measured at 0.776 last session, so the pole is 1.48× the golfer, matching the 1.5× asked for.
- `pin_flag` is 0.68 × 0.34 units, 15 × 37 px and 0.04% of the frame on hole 2. `pin_knob` and the thin `pin_pole` read as a crisp vertical.
- It no longer looks like a billboard. The pennant is small against the green, and `way_diamond` sits right beside it.
- I did not see the flag with the ball near the pin on any hole. On the hole 6 and hole 9 tees the pin is out of frame.
- The 2.6× C-view scale-up is gone. In the hole 2 C view I could not make out a pin, only `pin_ring` listed.

0. **Ground not pixelated or tiled, spread wider: 8.**
- The `grass*` ×1953 mowing stripes are smooth, the rough is soft and painted, and the hole 9 C view shows clean stripes.
- I took no close zoom.

1. **LANE GOAL: 6.**
- Only the current pin shows: `course.pinVisible` is `[false,true,false…]`.
- `way_diamond`, `way_post`, `way_ring` and `aimLanding` mark the dogleg. Hole 2 `needPower` is 0.883, so the iron reaches.
- `blossoms*` ×66 and the shrubs on the cliff lip look good.
- `cliffRocks` and `seaStacks` are still Never visible.
- The ducks are not in view on the hole 6 tee, though the pond does show.

2. **Looks as LOOK.md says: 7.**
- The painted brush pass, cream-green haze, teal sea and warm light are all there, with brightness 53%.
- The golfer's edge contrast is 0.122 and its colour is 37% against 50% around it. It is better than the 0.103 last session but still weak.

3. **Edit only the lane files: 7.** I did not diff.

4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.

5. **Plays as DESIGN.md says: 7.** `clubp`, `meter`, `hinter` and the C view are all present. I played no swing.

6. **Camera: 5.** The golfer is 0.27% of the frame, and the look lane owns this.

7. **Ball flight: 7.** The saved checks passed last session. I did not rerun them.

8. **Full 9 holes, sheep, hazards: 7.** Sand pots, the pond, `sheep*` and `bushes*` ×45 show. The cliff dressing is hidden.

9. **Stroke play and scorecard: 6.** I did not see the card.

10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off.

11. **`window.__game`: 8.** `observe()` returns `course.waypoint`, `pinVisible`, `meter.needPower`, `pin` and `ball`.

12. **Golfer matches CHARACTERS.md: 6.** The orange shirt and cap are there, but the golfer is small.

13. **COORDINATION.md and load-order: 7.** Not re-checked.

14. **`course:` events and `lanes/course.md`: 7.** Not re-read.

15. **Pictures with interact and look: 7.** I did not rerun the saved checks.

**Faults: 5.**
- The `toNonIndexed()` warning still prints at `open`.
- `cliffRocks` and `seaStacks` are Never visible.
- `perf` read 1111 ms a frame on a SwiftShader host, so it is not a fault. It showed 557,699 triangles, 274 draw calls and 1.86 MB of assets.

**Next:**
1. **Show the cliff dressing and make the golfer stand out.** (asked again)
   - In `src/island.js`, move a few `cliffRocks` and `seaStacks` onto the visible coast edge. They sit at 78.7 and 64.4 units, "in view, behind grass", so lift them above the grass or push them outward. Then add a pale tee mat under the golfer in `src/course.js`.
   - Shown done by `look` after `interact` `{state:{hole:1,skipIntro:true}}` with 40 frames. `cliffRocks` or `seaStacks` should list above 0.05%, and the "Stands out" line should show edge contrast above 0.15 (0.122 now).
2. **Prove the flag at the green.**
   - Use `eval` to place the ball within 2 units of `observe().pin` on holes 0, 4 and 8, with 40 frames each. Do it by `look` `sheet`, or `interact` `look:true` with `{action:"swing"}` setup.
   - `pin_flag` should list above 0.1% with the pennant clearly visible against the green, and `pin_pole` should stay under 1.5× `golfer_body`.
   - If the pennant is under 0.06%, widen it a little or use a white-and-red pennant. Also check that a pin marker shows in the C view, which I could not make out on hole 2.
3. **Remove the `toNonIndexed()` warning and show the ducks.**
   - Grep the course lane's files for `toNonIndexed` (`src/island.js:287` is the main candidate) and guard it with `if (g.index)`. Last session's Open names `sheep.js:16` and `stage.js:40` as candidates too, but those files are outside the lane.
   - Then `open` should print no warning.
   - Move the ducks and `pond_lily` to the pond centre on hole 6, in the aim view's sharp band. `look` on hole 6 should list `pond_lily` or the duck with pixels.

SCORE: 6.9

## Iteration 27
**Did:** `src/course.js` `COURSE_C.tee` #86ae56→#b4cf7e (paler tee mat so the golfer stands out). `toNonIndexed` at `island.js:287` is already guarded; the remaining callers are `sheep.js:16` and `stage.js:40` (outside the lane).
**Saw:** No `look`/`perf` run (short session); the tee colour and the golfer's edge contrast (0.122 before) are unverified.
**Next:** `look` on hole 2 to check the tee mat and edge contrast >0.15. Then lift `cliffRocks`/`seaStacks` above the grass in `src/island.js`. Then prove the flag with the ball near the pin, and move the ducks to the hole 6 pond centre.
**Open:** The `toNonIndexed()` warning source is probably `sheep.js:16`, which is not in this lane.
