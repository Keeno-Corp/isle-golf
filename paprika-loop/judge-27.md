Tee mat is paler and the golfer reads a bit better, but edge contrast is still 0.123 (was 0.122).

**Must have scores**

0a. **Flag back to a believable miniature: 8.**
- `pin_pole` is 1.15 × 0.068 units, about 1.5× the golfer. `pin_flag` is 0.04%, `pin_knob` is 0.0069%, and they read as a crisp vertical beside `way_diamond`.
- I did not see the ball near the pin on any hole. The proof on holes 1, 5 and 9 is still missing.

0. **Ground not pixelated or tiled, spread wider: 8.**
- The `grass*` ×1953 stripes and the rough are soft and painted, with no stair-stepping visible at the aim view.
- I took no close zoom.

1. **LANE GOAL: 6.**
- Only the current pin shows: `pinVisible` is `[false,true,false…]`.
- `way_diamond`, `way_post`, `way_ring` and `aimLanding` mark the dogleg, and hole 2 `needPower` is 0.883.
- `blossoms*` ×66 and the shrubs on the cliff lip look good.
- `cliffRocks` and `seaStacks` are still Never visible.
- The ducks and `pond_lily` are not in the hole 2 view.

2. **Looks as LOOK.md says: 7.**
- The brush pass, cream-green haze, teal sea and warm light are present, with brightness 53%.
- The golfer's edge contrast is 0.123, and the tee mat change did not move it.

3. **Edit only the lane files: 7.** I did not diff.

4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.

5. **Plays as DESIGN.md says: 7.**
- `clubp`, `meter`, `hinter` and the aim dots (`aimDots*` ×26) are all there.
- I played no swing this session.

6. **Camera: 5.**
- The golfer is 0.27% of the frame.
- The look lane owns this.

7. **Ball flight: 7.** I did not rerun the saved checks.

8. **Full 9 holes, sheep, hazards: 7.** `sheep*` ×2, `bushes*` ×45 and the sand pots show. The cliff dressing is hidden.

9. **Stroke play and scorecard: 6.** I did not see the card.

10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off.

11. **`window.__game`: 8.** `observe()` returns `course.waypoint`, `pinVisible`, `meter.needPower`, `pin` and `ball`.

12. **Golfer matches CHARACTERS.md: 6.** The orange shirt and cap are there, but the golfer is small.

13. **COORDINATION.md and load order: 7.** Not re-checked.

14. **`course:` events and `lanes/course.md`: 7.** Not re-read.

15. **Pictures with interact and look: 7.** I did not rerun the saved checks.

**Faults: 5.**
- The `toNonIndexed()` warning still prints at `open`. The builder says `island.js:287` is already guarded, so the source is outside the lane.
- `cliffRocks` and `seaStacks` are still Never visible.
- `perf` read 1098 ms a frame on SwiftShader, which is not a fault. It showed 557,699 triangles, 274 draw calls and 1.86 MB of assets.

**Next:**
1. **Show the cliff dressing.** (asked again)
   - In `src/island.js`, lift the `cliffRocks` and `seaStacks` above the grass or push them outward so they sit on the visible coast.
   - Shown done by `look` after `interact` `{state:{hole:1,skipIntro:true}}` with 40 frames. `cliffRocks` or `seaStacks` should list above 0.05% and drop out of Never visible.
2. **Make the golfer stand out, with a different fix from the tee mat.** (asked again)
   - The tee mat did not change the edge contrast (0.123).
   - In `src/course.js`, add a dark ring or a mowed contrast patch under the tee, or a pale fringe around the golfer. Anything that raises edge contrast needs a darker or more saturated surround, not a paler tee.
   - Shown done by `look` on hole 2 (same `interact`). The "Stands out" line should show edge contrast above 0.15.
3. **Prove the flag at the green.** (asked again)
   - Use `eval` to place the ball within 2 units of `observe().pin` on holes 0, 4 and 8, with 40 frames each, then `look` `sheet`. Hole numbers in `setState` are zero-based.
   - `pin_flag` should list above 0.06%, and the pennant should be clearly visible against the green.
   - Then move the ducks and `pond_lily` to the hole 6 pond centre. `look` on `{state:{hole:5,skipIntro:true}}` should list `pond_lily` or the duck with pixels.

SCORE: 6.9
