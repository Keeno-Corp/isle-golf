The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 2

Judge 2 is written from what I saw. I did not prove the hole 6 SPLASH. My one real-key attempt landed on the rough with strokes 1, and the pin on the hole 6 C view was too small to read. I also did not run the hole 9 drive or the colour sample.

**Judged on session 2. Perf was not scored: it ran on SwiftShader at 1391 ms a frame, with 415k triangles and 159 draw calls.**

**Must have scores**

0. **Ground not pixelated or tiled, and spread 15–25% wider: 8.**
   - The zoom on hole 1's fairway and rough shows no pixel blocks or repeated tile. The stripe edge from `stripeTex` is smooth, with a soft macro blotch from `grainTex`.
   - Hole 6's C view shows the course more open (`pond_water`, sea on the right, bunker-free fairway), and `SPREAD = 1.12` is applied.
   - Missing: the 15–25% spread is only 12%. I saw no rough zoom at a different aim view. The hole 1 aim look shows `island` filling the frame edge to edge, so the look lane's camera was not pulled back.
1. **LANE GOAL (9 holes, current pin only, waypoint marker, ducks, blossom shrubs, thick pole): 6.**
   - `course.pinVisible` is `[false,…,true,…]` on hole 6, so only the current pin shows.
   - `way_post`, `way_diamond` and `way_ring` show on hole 1 and hole 6.
   - Ducks and `pond_lily` show on the pond. The hole 1 look shows `blossoms*` shrubs.
   - On hole 1, `pin_pole` and `pin_flag` cover 0.08% of the frame (the pole is 9 px wide), so the flag is not the one vertical accent.
   - On hole 6's C view the pin is at the frame top, about 20 px, and blurred.
   - The hole 6 SPLASH check was not proven (see the top). The hole 9 drive and lighthouse-in-frame were not run.
2. **Looks as LOOK.md says: 7.** The painted pass, cream-green haze, teal `sea` and warm sun all show. Brightness is 49–55% with 0% blown out. The `golfer_body` is only 0.28–0.34% of the picture and its edge contrast is 0.03–0.14, so the C view says it "blends in".
3. **Edit only the lane files: 8.** The session's changes were in `src/course.js` and `src/island.js` plus notes.
4. **Looks as LOOK.md says (tilt-shift and haze): 8.** The blur band at the frame top and bottom is present and no frame is unblurred.
5. **Plays as DESIGN.md says: 6.**
   - Real keys worked: S×3 changed the club, D held changed `aimDeg`, and three Space presses gave strokes 1 and a "PERFECT!" meter label.
   - The ball went to rough at 181 yd with the sub "IN THE ROUGH: SHORTER SHOT".
   - I did not exercise R replay or the scorecard.
6. **Camera: 6.** The aim view is high behind the ball with a narrow fov of 30, and the C view pulls back (fov 31.87, y 27.8). I did not see the flight-follow or flyover. The wider spread is not reflected in the framing.
7. **Ball flight: 6.** A swing ended in `ball.surface` "rough" with a lie change at frame 153. I saw no bounce or water drop.
8. **Full 9 holes, sheep, hazards: 6.** `sheep*` ×9 are present and the layout reads. The builder's sweep has every hole done in 3 strokes or fewer, so holes 2 and 3 are still too easy. The hole 5 bunker was not re-verified.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 1" and "ROUND EVEN", but no card was seen.
10. **HUD: 8.** The hole, par, strokes and yards panel is top left. Wind is top right, the club list is bottom left and the hint is bottom right. All are legible, with 0 overlap.
11. **`window.__game` with `observe()` and `act()`: 8.** `state`, the actions and the `course` block (`waypoint`, `pinVisible`) all work.
12. **Golfer matches CHARACTERS.md: 6.** I saw a red-and-white golfer with a helmet at 0.3% of the frame. I did not check it against CHARACTERS.md.
13. **COORDINATION.md and load-order: 7.** I did not check the imports.
14. **Events named `course:<thing>` and `lanes/course.md`: 7.** `course.waypoint` and `pinVisible` are exposed in the state. The pull-back note for the look lane is recorded.
15. **Pictures taken with interact and look: 6.** The looks come from stepped real-key play, but I did not save a `course-*` check.

**Faults: 6.**
- The console shows one error, `SFX[k] is not a function (src/sound.js:71:61)`, on the swing. It is not a lane file but it is a real fault.
- The warning `toNonIndexed(): already non-indexed` is still there.
- The hole 1 tree blobs (`appleTree_leaves0` 6.4%, `tree19_leaves0` 5.7%) crowd the aim view.

**Next:**
1. **Make the flag the one vertical accent** (asked again). In `pins.js`, make `pin_pole` taller and thicker and add a bright cap or ring at the top, so it reads in the hole 1 aim view and the hole 6 C view. Shown done by `look` with `zoom` on the pin at [690,80,780,220] on hole 1: a pole at least 20 px wide with a bright flag, with `pin_pole` above 0.3%. In the hole 6 C view, move the pin from the top edge (y≈55) inward.
2. **Prove the hole 6 SPLASH and the hole 9 drive with real keys, and save them as `course-h6-splash` and `course-h9-drive`** (asked again). The first try drifted to the rough, because D held 25 frames only turned `aimDeg` to 10°. The pond is at bearing ≈46–60°, so hold D until `aimDeg` is above 40 (use `until`), pick the wedge, then Space×3. This shows `banner` 'SPLASH!' and `strokes` 2. For hole 9, read `ball.surface` 'green' within 3 strokes and the lighthouse in `look`. If it is not in frame, shift the hole 9 aim or tee.
3. **Widen the spread and fix the easy holes.**
   - Raise `SPREAD` from 1.12 to about 1.2 and record in `lanes/course.md` that the look lane must pull the camera back. The hole 1 aim look currently clips the island on the left and right.
   - Move the pin or add a bunker or carry so holes 2 and 3 are not 3-stroke walks.
   - Re-verify bunkers against the cliff lip and the fairway after scaling, with a `look` zoom on hole 5 and a `sample` on hole 1's ribbon against #5d8a3a.

SCORE: 6.7

## Iteration 3
**Did** Only Next item 1 (flag as the vertical accent), in `src/pins.js`: `pin_pole` 2.2 m tall and 0.17-0.19 m wide (was 1.35 m, 0.1 m), `pin_flag` cloth 1.05x0.7 at y 1.85, `pin_knob` is now a 0.15 yellow (#ffd23a) MeshBasicMaterial sphere at y 2.25 as a bright cap.
**Saw** Hole 2 aim look (state {hole:1} loads "HOLE 2"): `pin_pole` 0.19% [674,62,688,226] (was 0.08% on hole 1), `pin_flag` 0.13%, `pin_knob` 0.039%. Pole is ~14 px wide, still softened by the tilt-shift blur at the frame top. 0 console errors from the change; the `toNonIndexed` warning is still there. Brightness 50%, 0% blown out. Not run: perf, hole 6 C-view pin position, the splash and hole 9 real-key checks, the SPREAD raise, holes 2/3 difficulty, and the saved `course-*` checks.
**Next** (1) Real-key hole 6 splash (hold D until aimDeg > 40, wedge, Space x3) and hole 9 drive; save as `course-h6-splash`, `course-h9-drive`. (2) Raise `SPREAD` toward 1.2 in `src/course.js` and note the camera pull-back in `lanes/course.md`; add a carry or bunker on holes 2 and 3 (still 3-stroke walks). (3) Check the pin on the hole 6 C view is inside the frame, not at the top edge.
**Open** Pole and flag may now look oversized on the C view; unchecked. `SFX[k] is not a function` (`src/sound.js`) is outside this lane.
