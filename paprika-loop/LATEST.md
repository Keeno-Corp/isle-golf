The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 24

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

## The request changed

paprika-loop/PROMPT.md changed before session 25; the Next lists above were written before it. Changed lines:
+ 0a. NEWEST OWNER FEEDBACK, do this now before anything else: "the flag is way too big". In src/pins.js scale the current hole's flag and pole back to a believable miniature: total height about 1.5x the golfer's height (measure golfer height with eval), a small pennant, a thin crisp pole. Readability comes from a bright pennant colour (and the knob/ring), not size. Remove the 2.6x C-view scale-up. Prove with a look at the tee (aim view) and at the green (ball near the pin) on holes 1, 5 and 9.
+ 1. LANE GOAL: Make 9 distinct, fun, readable holes on Shepherd Isle: layout, surfaces, hazards (sand pots by the greens, the pond on 6, the house dogleg on 5, the lighthouse finish on 9, the sea as OB) and island set-dressing. Only the current hole's flag stands out; other pins are hidden or dimmed (hole 7's flag sits in front of hole 9's pin now). Each dogleg gets a visible waypoint or aim marker the auto-aim uses (auto-aim is 11-26 deg off now). No bunker in a perfect drive's landing zone. Ducks show on the pond. Critic findings 3 (the pink cliff blobs become proper blossom shrubs) and 4 (the flag is a vertical accent, not a billboard). Keep the LOOK.md style.
- 1. LANE GOAL: Make 9 distinct, fun, readable holes on Shepherd Isle: layout, surfaces, hazards (sand pots by the greens, the pond on 6, the house dogleg on 5, the lighthouse finish on 9, the sea as OB) and island set-dressing. Only the current hole's flag stands out; other pins are hidden or dimmed (hole 7's flag sits in front of hole 9's pin now). Each dogleg gets a visible waypoint or aim marker the auto-aim uses (auto-aim is 11-26 deg off now). No bunker in a perfect drive's landing zone. Ducks show on the pond. Critic findings 3 (the pink cliff blobs become proper blossom shrubs) and 4 (the flag reads as the one vertical accent on every hole: a thicker pole). Keep the LOOK.md style.

## Iteration 25
**Did** `src/pins.js`: flag shrunk to a miniature. `pin_pole` 1.3 tall (golfer is 0.85 via `PS`, so about 1.5x), radius 0.028-0.034; `pin_flag` cloth 0.75 x 0.3 at y 1.13 (red `flagMat`, wind still scales x); `pin_knob` radius 0.06 at y 1.32. Removed the 2.6x C-view scale (`big` is always 1); `pin_ring` now shows by `G.overhead` in aim/swing instead.
**Saw** `look` sheet of holes 1, 5 and 9 at the tee with `skipIntro`: page renders, brightness 51-55%, no console errors, golfer 0.3% of the frame. The pin is out of frame at the tee on all three, so I did not see the new flag at the tee; no green close-up taken. `toNonIndexed` warning still prints. `test` and `perf` not run.
**Next** (1) `look` with the ball near the pin on holes 1, 5 and 9 and check that the pennant is still readable (if not, widen it a little or brighten its colour, not the pole). (2) Tee mat under the golfer, cliff dressing in `src/island.js`. (3) Run `test`; check the `pin_ring` in C view.
**Open** The flag is unverified on screen; the 0.3 unit pennant might be too small at the aim view's distance.
