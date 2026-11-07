The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 12
**Did** Saved `course-cliff-lip` (newRound, `state {hole:2}` = hole 3 "Bluff Edge" since setState hole is 0-based, 40 frames, expect hole 3 + phase aim). 11 checks now. No source edits.
**Saw** Hole 3 aim view: brightness 52%, 0% blown out, `blossoms*` x13 only 0.021% of frame (box [461,121,837,156]) so still unproven as shrubs; `bushes*` x27 2.1%. pin_pole 0.29%, pin_flag 0.14%. toNonIndexed warning still prints at open (src/sheep.js:16 and stage.js:40 are the candidates; island.js is guarded). Not run: full `test`, perf, C view, zoom of blossoms (banner covers the zoom box for 40+ frames).
**Next** (1) Enlarge/cluster `blossoms` in src/island.js (~line 360) so they read as shrubs. (2) Pull hole 8 C-view pin off the top edge (camera.js: tell look lane / note in lanes/course.md). (3) Asset search for tree/bush models; tell sheep lane to guard toNonIndexed in sheep.js:16.
**Open** `hole` in setState is 0-based but observe().hole is 1-based. Blossom zoom picture not taken. Fairway lighter than #5d8a3a (check passes).

### Judge 12

**Judge 12.** I opened the page and ran the full `test`: 11 of 11 pass, including the new `course-cliff-lip`. I took one look, hole 5 after `newRound`, `next` and 40 frames of KeyC. The page was still in the intro phase with `overhead: true`, so the C view was caught in the flyover. I took no swing, no zoom of the cliff lip and no `perf` run. This host is SwiftShader, so frame times mean nothing.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The `grass*` ×5036 (26%) blend softly into the mowing stripes and the rough, with no pixel blocks or tile pattern.
   - The `tree*`, `bushes*` ×88 and `fenceRails*` have room around them.
   - The `fenceRails*` run as long, clear diagonals.
1. **LANE GOAL: 6.**
   - `pin_flag` (0.056%) and `pin_pole` (0.034%) sit at the frame top, pole box [448, 34, 461, 84], so the pin is small but not cut.
   - `way_ring` and `way_post` are visible.
   - `course.pinVisible` is true only for hole 5.
   - The `blossoms*` shrubs are still unproven. No zoom has ever shown them, and the cliff-lip check only asserts `hole` and `phase`.
   - `pond_water` and `pond_lily` show at the left edge, but the ducks are not visible here.
2. **Looks as LOOK.md says: 8.**
   - The painted brush pass, warm cream-green haze and teal `sea` are there.
   - Brightness is 52% with 0% blown out.
   - The focus band blurs the top and bottom.
   - The fairway reads lighter and yellower than #5d8a3a, but `course-h1-ribbon` passes.
3. **Edit only the lane files: 8.** Recent commits touch lane files only; I did not diff this session.
4. **Tilt-shift focus band: 8.** The middle is sharp and the edges blur.
5. **Plays as DESIGN.md says: 6.** The HUD panels, club panel (IRON selected) and hint line show. `tee-shot-three-clicks` and `hot-seat-passes-turn` pass. I played no swing, and the R replay is unseen.
6. **Camera: 5.**
   - The overhead camera at y 38 pulls back well, and the golfer's `golfer_body` is only 0.011% of the frame.
   - The tool reports "little of the subject shown".
   - The hole 5 pin is at the top-left edge, 24 px from the top.
   - The C view was not reached.
7. **Ball flight: 6.** `course-h6-splash`, `course-h9-drive`, `course-h2-carry` and `course-h3-carry` pass. I saw no flight myself.
8. **Full 9 holes, sheep, hazards: 7.**
   - The `house_*` dogleg, `pond_water`, `sheep*` ×4, `bell_*` and `seaStacks*` are on screen.
   - The `lighthouse` is out of view on this hole, which is expected.
   - The `fenceRails*`, `sign_board` ×4 and `flowers` dress the island.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". I saw no card or stamps.
10. **HUD: 8.** There are 5 panels with 0 overlap and 0 cut off. The big "HOLE 5" banner covers the picture centre during the intro.
11. **`window.__game`: 8.** `observe()` is full, with `course.pinVisible`, `course.waypoint`, `meter.needPower` and `pin`. One wrinkle: `needPower` is 1.05 for the iron on this 272 yd par 4. That is above 1, which means the iron cannot reach, so the auto-club should be the driver.
12. **Golfer matches CHARACTERS.md: 6.** The kit is visible but tiny at this camera (0.011%). Colour is 38% against 52% around it, and edge contrast is 0.084, so it hardly stands out.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 8.** There are 11 saved checks, all passing, and the cliff-lip check is now saved.

**Faults: 6.**
- `three.js warned: toNonIndexed(): already non-indexed` still prints at `open`.
- The banner covers the centre of the frame.
- `cliffFace` and `cliffRocks` are listed as "Never visible" even though they are in view. They look occluded by `island`.
- No console errors.

**Object sourcing:** I did not read `paprika3d/asset-hits.json` or `paprika3d/sourcing.json`. The `tree*_leaves0` and `tree*_trunk` ×20, `bushes*` ×88, `blossoms*`, `fenceRails*`, `sign_board` and `house_*` are still code shapes. Run a library search first.

**Next:**
1. **Run `asset_search` for "low poly tree", "stylized bush" and "flowering shrub", then swap the code objects.**
   - Replace `tree*_leaves0`/`tree*_trunk`, `bushes*` and `blossoms*` in `src/island.js`, keeping their positions and spacing.
   - Cluster the blossoms into shrub-sized clumps while you are there. Their 0.021% of the frame is too small to read.
   - Shown done by `look` with `zoom` on the cliff lip showing shrubs rather than pink rocks, at least 0.1% of the frame, and no higher draw-call count.
   - Then re-save `course-cliff-lip` with a `sample` or `expect` that tests the blossoms.
2. **Check `meter.needPower` on holes 4 to 9 and fix the pin framing.**
   - Hole 5's iron `needPower` of 1.05 is over 1. Make the auto-club pick the driver wherever the iron's `needPower` exceeds 0.95. This holds in the iron-selected state after `next` on hole 5.
   - Export `course.cViewCentre` so `src/camera.js` can centre the pin, or note the request in `lanes/course.md`. The hole 5 pin sits at y≈24 px.
   - Shown done by `observe` giving `club: "driver"` and `needPower` of 0.95 or less on hole 5. Then a C-view `look` (KeyC after the intro, 40 frames) with `pin_flag` at 0.1% or more and its box top above 40 px.
3. **Find the `toNonIndexed` source and save a scorecard check.**
   - Run `grep -rn toNonIndexed src` and report the file to the owning lane, as `src/sheep.js:16` or `stage.js:40`.
   - Shown done by `open` printing no `three.js warned` line.
   - Add a `course-` check that plays a hole to `holed` and shows the card with its stamp, so the stroke-play score of 5 has evidence.

SCORE: 6.9
