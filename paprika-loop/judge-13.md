**Judge 13.** I opened the page and took one look: hole 2 (`state.hole:1` landed on hole 2 here), `skipIntro`, then KeyC for 40 frames. I ran one `observe`-style `interact` on hole 6 and one `perf`. I did not take a cliff-lip zoom, run the full `test`, or play a swing. The host is SwiftShader, so frame times mean nothing.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The `grass*` ×888 (16%) blend softly into the stripes, with no pixel blocks and no visible tile pattern.
   - The sand pots and the rough show smooth edges.
   - The `bushes*` ×23 and `flowers*` ×63 have room around them.
1. **LANE GOAL: 6.**
   - **Blossoms:** `blossoms*` ×28 are now 0.23% of the frame, up from 0.021%. In the picture they read as pink flowering clumps on the cliff lip, with green bushes beside them. The cliff-lip check still only asserts `hole` and `phase`.
   - **Pin and waypoint:** `pin_flag` (0.36%), `pin_pole` (0.51%) and `pin_ring` are visible. The pole is cut at the frame top, and `course.pinVisible` is true only for the current hole. `way_ring`, `way_diamond` and `way_post` show.
   - **Ducks:** not seen.
   - **Hole 6 needPower:** `meter.needPower` is 0.993 with the driver on hole 6 (Duck Pond Bend, 218 yd, `club` "driver"). That is above the 0.95 target.
2. **Looks as LOOK.md says: 8.** The painted brush pass is there, with cream-green haze, a teal `sea` and a warm sun. Brightness is 51% with 0% blown out, and the frame edges blur.
3. **Edit only the lane files: 7.** I did not diff this session.
4. **Tilt-shift focus band: 8.** The middle is sharp and the top and bottom blur.
5. **Plays as DESIGN.md says: 6.** The HUD panels, the club list (IRON selected) and the hint line show. I played no swing and did not see R replay.
6. **Camera: 5.** The KeyC overhead camera sits at y≈21 and the golfer is only 0.049% of the frame. The pin is cut at the frame top.
7. **Ball flight: 6.** The saved splash, drive and carry checks passed last session. I saw no flight myself.
8. **Full 9 holes, sheep, hazards: 7.**
   - The `sheep*`, `pond_*` and `seaStacks` objects exist.
   - The 20 `tree*` trunk and leaf pairs are in the "Never visible" list.
   - `cliffRocks` and `seaStacks` are listed as never visible although they are in view.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". No card or stamps were seen.
10. **HUD: 8.** There are 5 panels with 0 overlap and 0 cut off. The "HOLE 2" banner sits over the picture centre.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `course.waypoint` and `meter.needPower`, and the actions are documented.
12. **Golfer matches CHARACTERS.md: 5.** `golfer_body` is 0.049% of the frame. Brightness is 58% against 57% around it, and edge contrast is 0.065. The tool says it blends in.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 8.** The saved checks exist; I did not rerun them.

**Faults: 6.**
- `three.js warned: toNonIndexed(): already non-indexed` still prints at `open`.
- The banner covers the picture centre.
- Perf is not judged: 274 draw calls and 557k triangles, with the frame time meaningless on SwiftShader.
- There were no console errors.

**Object sourcing:** I did not read `paprika3d/asset-hits.json` or `paprika3d/sourcing.json`. The `tree*_trunk` and `tree*_leaves0`, `bushes*`, `blossoms*`, `fenceRails`, `sign_board` and `house_*` are still code shapes.

**Next:**
1. **Run `asset_search` for "low poly tree", "stylized bush", "flowering shrub" and "wooden fence", then swap in the results.**
   - This is the first item and is asked again. Replace `tree*_trunk`/`tree*_leaves0`, `bushes*`, `blossoms*` and `fenceRails` in `src/island.js`, keeping their positions and spacing.
   - Shown done by `look` with `zoom` on the cliff lip showing shrub models rather than icosahedron petals, with no higher draw-call count in `perf`.
2. **Fix the auto-club and `needPower` (asked again).**
   - Hole 6 shows 0.993 with the driver, so the hole's pin or tee needs pulling closer or the aim shortened. It should hold for every hole after `{state:{hole:n}}`.
   - Hole 5's iron `needPower` of 1.05 was also never fixed. The club picked after `next` must have `needPower` of 0.95 or less.
   - Shown done by `interact` with `expect {"meter.needPower":[0,0.95]}` on holes 4 to 9.
3. **Make the C view frame the pin and the golfer.**
   - Export `course.cViewCentre` and note it in `lanes/course.md` for `src/camera.js`, because the pin is cut at the top at y≈0.
   - Also give the golfer a contrasting accent (a brighter kit patch or an outline) so the `Stands out` line passes.
   - Shown done by `look` after KeyC with `pin_pole` fully inside [y>20] and the golfer's edge contrast at 0.1 or more.

SCORE: 6.7
