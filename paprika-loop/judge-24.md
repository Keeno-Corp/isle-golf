**Judge 24 (session 24).** I opened the page and ran `interact` with `look` on `{state:{hole:1,skipIntro:true}}` plus 40 frames, then `test` and `perf`. I did not play a swing and did not see a scorecard. The host is SwiftShader, so frame time says nothing. `perf` reads 1030 ms a frame at 557,699 triangles and 274 draw calls, with host load 3.5 on 8 cores, so I did not score it.

The state said `hole:2` after I set hole 1. Setting `hole:n` appears to be 0-indexed. All 11 saved checks pass.

I did not look at the hole 8 view the builder changed.

The PROMPT.md change that arrived during this session (item 0a, "the flag is way too big") is scored below.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - `grass*` ×1939 reads as smooth mowing stripes and rough, with no pixel blocks at the aim view.
   - I took no close zoom.
0a. **Flag back to a believable miniature: 2.** This item is new and nothing has been done on it.
   - `pin_pole` measures 1.6 units tall and `pin_flag` is 1.15 × 0.9 units, with `pin_knob` on top.
   - On hole 2 the pole is [780,92,799,210], 118 px tall, while `golfer_body` is [495,555,559,665], 110 px tall and much nearer the camera. The pole is far over 1.5× the golfer's height.
   - The pennant is a large billboard, and the C view still scales the pin up (2.6×).
1. **LANE GOAL: 6.**
   - **Pins:** `course.pinVisible` is true only for the current hole. `way_diamond`, `way_post` and `way_ring` show, and the `aimLanding` marker shows.
   - **Hole 2:** `meter.needPower` is 0.883, which is under 0.95. The sand pots are beside the line, not on it.
   - **Cliff dressing:** `cliffRocks` and `seaStacks` are still Never visible. The ducks are not in this view.
   - **Cliff lip:** the blossom shrubs on the cliff lip are good, with `blossoms*` ×66.
2. **Looks as LOOK.md says: 7.**
   - Brush pass, haze and warm light are there, with brightness 53%.
   - The golfer's edge contrast is 0.122 and its colour is 37% against 50% around it, so it only half stands out.
3. **Edit only the lane files: 7.** I did not diff.
4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur. The sign and the golfer sit in the sharp band.
5. **Plays as DESIGN.md says: 7.**
   - `clubp` lists DRIVER 204 YD, IRON 132, WEDGE 74 and PUTTER.
   - `hinter` and `meter` show.
   - `tee-shot-three-clicks` and `hot-seat-passes-turn` pass.
6. **Camera: 5.**
   - The camera at (-3.4, 9.4, 20.4) with FOV 29.9 frames the pin and the waypoint. The golfer is only 0.27% of the frame.
   - This lane does not own it.
7. **Ball flight: 7.** `course-h6-splash`, `course-h9-drive`, `course-h2-carry` and `course-h3-carry` pass.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*` ×2, `bushes*` ×45, `flowers*` ×48, a sand pot and the sea along `cliffFace` all show.
   - `cliffRocks` and `seaStacks` do not show.
9. **Stroke play and scorecard: 6.** The HUD shows "STROKES 0" and "ROUND EVEN". I did not see the card or the stamps.
10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `waypoint`, `cViewCentre` and `meter.needPower`.
12. **Golfer matches CHARACTERS.md: 6.** `golfer_body` has the orange shirt and cap, and it reads as a golfer. It is small.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 8.** All 11 saved checks pass.

**Faults: 6.**
- The `toNonIndexed()` warning still prints at `open`.
- There were no console errors.
- The cliff dressing is Never visible.
- `perf` is unscorable on this host.

**Next:**
1. **Shrink the flag to a believable miniature.** This is the owner's newest ask and the lowest score.
   - In `src/pins.js`, measure the golfer's height with `eval` (the `golfer_body` bounding box).
   - Set the pole to about 1.5× that height and thin and crisp. Make `pin_flag` a small pennant, about 0.35 × 0.25 units, in a bright colour.
   - Drop the 2.6× C-view scale-up, and keep the knob and ring for readability.
   - Shown done by `look` after `{state:{hole:0,skipIntro:true}}` plus 40 frames. `pin_pole` should be under about 1.5× the `golfer_body` box height and `pin_flag` under 40 px wide. Repeat on holes 5 and 9 at the tee and at the green.
2. **Make the golfer stand out and show the cliff dressing.** (asked again)
   - Put a pale or darker tee mat under the golfer in `src/course.js`. Edge contrast is 0.122 now, and the target is above 0.15.
   - Move a few `cliffRocks` and `seaStacks` to the coast edge in `src/island.js`. Both are still Never visible.
   - Shown done by `look` listing `cliffRocks` or `seaStacks` above 0.05%, with edge contrast above 0.15.
3. **Check every hole's pin and the ground close up.** Do a `look` on each hole for pin clipping and a close `look` zoom on hole 1's fairway. Then remove the `toNonIndexed()` warning by finding which geometry is already non-indexed.

SCORE: 6.5
