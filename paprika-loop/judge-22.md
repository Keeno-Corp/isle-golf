**Judge 22 (session 22).** I opened the page and ran one `interact` with `look` on `{state:{hole:7,skipIntro:true}}` plus 40 frames, then `perf` and `test`. I played no swing and saw no scorecard. The host is SwiftShader, so the 1081 ms frame time is noise.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - `grass*` ×1933 reads as soft mowing stripes and rough in the hole 8 look, with no pixel blocks.
   - I took no close zoom.
1. **LANE GOAL: 6.**
   - **Pins:** `pinVisible` is true only for hole 8. Waypoints `way_diamond`, `way_post` and `way_ring` show.
   - **Blocked view:** `tree16_leaves0` now covers 18% of the frame, [259,382,826,799]. It hides `golferShadow`, `ballRing1`, `cliffFace`, `cliffRocks` and `seaStacks`.
   - **Needed power:** `meter.needPower` is 0.787, down from 1.05 and now reachable.
   - **Ducks and cliff dressing:** the ducks are not in view, and the cliff dressing is still Never visible.
   - **Pin:** `pin_pole` [444,0,461,85] and `pin_flag` [453,0,484,54] are still cut at the top.
2. **Looks as LOOK.md says: 7.**
   - The brush pass, haze and warm light are there. Brightness is 47%.
   - The big dark tree in the foreground breaks the picture and hurts the subject.
3. **Edit only the lane files: 7.** I did not diff.
4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.
5. **Plays as DESIGN.md says: 7.** `clubp` lists DRIVER 204 YD, IRON 132, WEDGE 74 and PUTTER. `hinter`, `meter` and the C key hint are there. I played no swing, but the saved checks `tee-shot-three-clicks` and `hot-seat-passes-turn` pass.
6. **Camera: 4.** The `pin_pole` is cut, and the golfer is hidden behind `tree16_leaves0`. The camera is at (15, 9.7, 1.6).
7. **Ball flight: 7.** `course-h6-splash` and `course-h9-drive` pass.
8. **Full 9 holes, sheep, hazards: 7.** `sheep*` ×4, `bushes*` ×19, `fenceRails*` and `blossoms*` ×21 show. `cliffRocks` and `seaStacks` do not.
9. **Stroke play and scorecard: 6.** The HUD shows "STROKES 0" and "ROUND EVEN". I did not see the card or stamps.
10. **HUD: 8.** There are 5 panels, 0 overlap and 0 cut off. The `banner` covers the picture centre.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `waypoint`, `cViewSpan` and `meter.needPower`.
12. **Golfer matches CHARACTERS.md: 4.** `golfer_body` is not visible in the aim view because `tree16_leaves0` covers it.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 8.** All 11 saved checks pass, including `course-cliff-lip`, `course-h1-ribbon` and `course-h9-drive`.

**Faults: 5.**
- `tree16` blocks the hole 8 aim view.
- `pin_pole` is still clipped at the top of the frame.
- The `toNonIndexed()` warning still prints at `open`.
- There were no console errors.
- `perf` shows 278 draw calls and 558k triangles. The frame time is host noise, so it is not judged.

**Next:**
1. **Clear `tree16` out of hole 8's aim view.** In `src/course.js` or `src/island.js`, move or remove `tree16`, or move the hole 8 tee so the tree is not between camera and golfer. Shown done by `look` after `{state:{hole:7,skipIntro:true}}` and 40 frames. `tree16_leaves0` should be under 3%, and `golferShadow` and `ballRing1` should no longer be listed as behind it.
2. **Get the hole 8 `pin_pole` inside the frame.** (asked again)
   - Shortening the pole and moving the tee did not change this. The pin is still about 20 units from the tee.
   - Either put hole 8's pin about 4 units nearer the tee, or write in `lanes/course.md` that the look lane's `src/camera.js` must aim at the tee-pin midpoint.
   - Shown done by `look` with `pin_pole` and `pin_flag` boxes starting at y above 10.
3. **Cliff dressing and a tee mat.** (asked again)
   - After `tree16` is gone, check that `cliffRocks` and `seaStacks` show above 0.05%. If they are still behind grass or `tree8_leaves0`, move a few to the coast edge in `src/island.js`.
   - Add a pale tee mat under the golfer so `golfer_body` stands out.
   - Shown done by `look` on `{state:{hole:7,skipIntro:true}}`, with `cliffRocks` or `seaStacks` above 0.05% and `golfer_body` listed.

SCORE: 6.7
