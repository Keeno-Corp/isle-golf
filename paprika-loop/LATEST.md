The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 25
**Did** `src/pins.js`: flag shrunk to a miniature. `pin_pole` 1.3 tall (golfer is 0.85 via `PS`, so about 1.5x), radius 0.028-0.034; `pin_flag` cloth 0.75 x 0.3 at y 1.13 (red `flagMat`, wind still scales x); `pin_knob` radius 0.06 at y 1.32. Removed the 2.6x C-view scale (`big` is always 1); `pin_ring` now shows by `G.overhead` in aim/swing instead.
**Saw** `look` sheet of holes 1, 5 and 9 at the tee with `skipIntro`: page renders, brightness 51-55%, no console errors, golfer 0.3% of the frame. The pin is out of frame at the tee on all three, so I did not see the new flag at the tee; no green close-up taken. `toNonIndexed` warning still prints. `test` and `perf` not run.
**Next** (1) `look` with the ball near the pin on holes 1, 5 and 9 and check that the pennant is still readable (if not, widen it a little or brighten its colour, not the pole). (2) Tee mat under the golfer, cliff dressing in `src/island.js`. (3) Run `test`; check the `pin_ring` in C view.
**Open** The flag is unverified on screen; the 0.3 unit pennant might be too small at the aim view's distance.

### Judge 25

**Judge 25 (session 25).** I opened the page and ran `interact` with `look` on hole 1 at the aim view. I measured the flag with `eval`, ran `test`, and took a `look` sheet of the hole 5 tee, the hole 9 tee and the hole 9 C view. I did not run `perf` because this is a SwiftShader host, so frame time says nothing here. I did not play a swing and did not see a scorecard. I did not take the green close-ups the brief asks for, and my zoom of the hole 1 pin missed it and landed on the title text, so the flag was never seen up close.

**Must have scores**

0a. **Flag back to a believable miniature: 6.**
- `eval` gives `pin_pole` 1.3 tall and `golfer_body` 0.776 tall, so the pole is 1.67× the golfer, not the 1.5× asked for.
- `pin_flag` is 0.56 × 0.3 units, 23 × 30 px on hole 1, and `pin_knob` is 8 px wide. The 2.6× C-view scale-up is gone.
- It no longer reads as a billboard. At the aim view the pole is a thin 7 px line and the red pennant is small against the green, so it is now weakly readable.
- On holes 5 and 9 the pin is out of frame at the tee, and I took no green close-up on any hole, so only hole 1 is proven.

0. **Ground not pixelated or tiled, spread wider: 8.**
- `grass*` ×1746 shows smooth mowing stripes and rough, and `course-h1-ribbon` passes.
- I took no close zoom.

1. **LANE GOAL: 6.**
- **Pin and markers:** `way_diamond`, `way_post`, `way_ring` and `aimLanding` show. Hole 1 `meter.needPower` is 0.705. `course-only-current-pin` passes.
- **Hole 9 C view:** it shows a clean overview with the house roof and the greens.
- **Cliff dressing:** `cliffRocks` and `seaStacks` are still Never visible.
- **Ducks:** `pond_lily` and the other pond dressing are in view but have no pixels.
- **Blossoms:** `blossoms*` ×22 look good, and `course-cliff-lip` passes.

2. **Looks as LOOK.md says: 7.**
- Brush pass, haze and warm light are there, with brightness 52%.
- The golfer's edge contrast is 0.103 and its colour is 37% against 50% around it, so it barely stands out.

3. **Edit only the lane files: 7.** I did not diff.

4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.

5. **Plays as DESIGN.md says: 7.** `clubp` lists DRIVER 204 YD, IRON 132, WEDGE 74 and PUTTER. `meter`, `hinter` and the C view all work.

6. **Camera: 5.** The golfer is 0.32% of the frame, and the look lane owns this.

7. **Ball flight: 7.** `course-h6-splash`, `course-h9-drive`, `course-h2-carry` and `course-h3-carry` pass.

8. **Full 9 holes, sheep, hazards: 7.** `sheep*` ×2 and `bushes*` ×26 show. The cliff dressing is hidden.

9. **Stroke play and scorecard: 6.** I did not see the card or the stamps.

10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off.

11. **`window.__game`: 8.** `observe()` returns `course.waypoint`, `meter.needPower`, `pin` and `ball`.

12. **Golfer matches CHARACTERS.md: 6.** `golfer_body` has the orange shirt and cap, and it is small.

13. **COORDINATION.md and load-order: 7.** Not re-checked.

14. **`course:` events and `lanes/course.md`: 7.** Not re-read.

15. **Pictures with interact and look: 8.** All 11 saved checks pass.

**Faults: 6.**
- The `toNonIndexed()` warning still prints at `open`.
- There were no console errors.
- `cliffRocks` and `seaStacks` are Never visible.
- I did not run `perf`.

**Next:**
1. **Tune the flag and prove it on holes 1, 5 and 9.**
   - In `src/pins.js`, cut `pin_pole` from 1.3 to about 1.15, which is 1.5× the 0.776 golfer, so it is not 1.67×.
   - Widen `pin_flag` a little, to about 0.65 × 0.32, in a brighter colour. A saturated orange-red or white-and-red would stand out more against the green.
   - Keep the pole thin, and keep the knob and ring.
   - Shown done by `interact` with `look`, using `{state:{hole:4,skipIntro:true}}`, a ball placed within 2 units of the pin, and 40 frames. Do this for holes 1, 5 and 9. `pin_flag` should list above 0.06% with the pole under 1.5× the `golfer_body` box height.
   - For the aim view at the tee, the pin is out of frame on holes 5 and 9, so check it with a `look` camera at the green too.
2. **Make the golfer stand out and show the cliff dressing.** (asked again)
   - Put a pale tee mat under the golfer in `src/course.js`. Edge contrast is 0.103 now, and the target is above 0.15.
   - Move a few `cliffRocks` and `seaStacks` onto the coast edge in `src/island.js`. Both are still Never visible.
   - Shown done by `look` on hole 1 at the aim view listing `cliffRocks` or `seaStacks` above 0.05%, with edge contrast above 0.15.
3. **Check the pin in the C view and remove the warning.**
   - Take a `look` after KeyC on holes 1, 5 and 9 and check that the small `pin_ring` and pennant still mark the current pin.
   - Then find which geometry calls `toNonIndexed()` on an already non-indexed geometry and remove the call, so `open` no longer prints the warning.

SCORE: 6.9
