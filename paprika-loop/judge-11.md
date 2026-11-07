**Judge 11.** I took one look (hole 1 aim view after `start`, `next` and 40 frames) and ran the whole `test`: 10 of 10 pass, including `course-h1-ribbon`. I did not take the C view, the cliff-lip zoom or a swing, and I ran no `perf`, because SwiftShader's frame times say nothing about a real GPU.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The hole 1 aim view shows smooth mowing stripes and soft-edged `grass*` ×1719 blending into the rough, with no pixel blocks or visible tile pattern.
   - The `tree*` and `bushes*` ×25 have room around them.
1. **LANE GOAL: 7.**
   - On hole 1, `pin_pole` (0.33%), `pin_flag` (0.27%) and `pin_knob` are fully on screen, with the pole thick against the haze.
   - `way_diamond`, `way_post` and `way_ring` mark the waypoint.
   - `course-only-current-pin` passes. `pin_ring` is hidden by the game on hole 1.
   - `course-cliff-lip` is still not saved, now asked five times.
   - The `blossoms*` ×25 are only 0.06% of the aim view, so they are unproven as shrubs.
2. **Looks as LOOK.md says: 8.**
   - The painted brush pass, warm haze and focus band on the golfer are there, and the edges blur. Brightness is 52% with 0% blown out.
   - The fairway is lighter and yellower than #5d8a3a. The `course-h1-ribbon` check passes, so I scored it as acceptable.
3. **Edit only the lane files: 8.** The recent commits touch lane files only. I did not diff this session.
4. **Tilt-shift focus band: 8.** Sharp in the middle, blurred at the top and bottom.
5. **Plays as DESIGN.md says: 6.**
   - The hole panel, club panel (IRON selected), aim dots and `aimLanding` show.
   - `tee-shot-three-clicks` and `hot-seat-passes-turn` pass.
   - I did not play a swing myself, and the R replay is unseen.
6. **Camera: 6.**
   - The aim camera is high and narrow (fov 29.9) and sits behind the golfer.
   - The C view and the flyover are unseen this session. The hole 8 pin sat at the frame top last session.
7. **Ball flight: 6.** `course-h6-splash`, `course-h9-drive` and the carry checks on holes 2 and 3 pass. I saw no flight myself.
8. **Full 9 holes, sheep, hazards: 7.** `sheep*` ×2 and the `trees` show on hole 1, and the `flowers*` ×38 and `blossoms*` ×25 are on the cliff lip. The par 3 is 129 yd with an iron `needPower` of 0.705. The pond dressing (`pond_lily`, `pond_cattail`) is out of view on this hole.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". No card was seen.
10. **HUD: 8.** There are 5 panels with 0 overlap and 0 cut off. The big "HOLE 1" banner sits over the picture's centre for at least 40 frames.
11. **`window.__game`: 8.** `observe()` is full, with `course.waypoint`, `meter.needPower` and `pin`.
12. **Golfer matches CHARACTERS.md: 7.** `golfer_body` (0.31%) shows a red-and-white kit with a helmet and club, and it reads against the grass. The standout contrast is weak: colour 37% against 50% around it.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 7.** 10 saved checks, all passing. The cliff-lip check is still missing.

**Faults: 6.**
- `three.js warned: toNonIndexed(): already non-indexed` still prints at `open`. The `island.js` guard did not remove it, so the source is elsewhere (the builder blamed `src/sheep.js:16`).
- The banner lingers over the aim view.
- I did not re-check the C-view pin cut at the top edge on hole 8.
- No console errors.

**Object sourcing:** I did not check `paprika3d/asset-hits.json` or `paprika3d/sourcing.json`. The `trees` (`tree*_leaves0` and `tree*_trunk` ×20), `bushes*`, `blossoms*`, `flowers*`, `sign_board` and `fenceRails` look like code shapes. Run a library search first for "low poly tree", "stylized bush" and "flowering shrub".

**Next:**
1. **Save `course-cliff-lip`** (asked again, fifth time).
   - Use `interact` with `start`, `next`, `next` and `expect` `hole: 2`. Then run `look` with `zoom` on the cliff lip, where the `blossoms*` sit, for example [980, 40, 1200, 250] on hole 1 or the matching box on hole 2.
   - Use `save` named `course-cliff-lip`, with `expect` on `hole` and `phase: aim`.
   - Shown done by `test` listing 11 ✓, and the zoom showing blossom shrubs rather than pink rocks.
   - If `blossoms*` stay at 0.06%, enlarge and cluster them into shrub-sized clumps in `src/island.js`.
2. **Search for stylized trees and bushes, then replace the code `trees` and `bushes*`.**
   - Use `asset_search` for "low poly tree" and "stylized bush", and place the models with the current `tree*` and `bushes*` positions, keeping the spacing.
   - Shown done by `look` on the hole 1 aim view with `tree18_leaves0` replaced by a loaded model name and the draw-call count not higher.
3. **Pull the C-view pin off the top edge, and find the `toNonIndexed` source.**
   - Press `KeyC` for 40 frames on hole 8 and run `look`. `pin_flag` should be 0.1% or more, with its box top greater than 0 and `pin_ring` visible.
   - Export a `course.cViewCentre` for `src/camera.js` and note it in `lanes/course.md`.
   - Run `grep -rn toNonIndexed src` and report the file to the owning lane. Shown done by `open` printing no `three.js warned` line.

SCORE: 7.1
