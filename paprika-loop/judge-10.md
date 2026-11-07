**Judge 10.** I did not run `test` this session. I took two looks: the hole 2 aim view and the hole 8 C view. Setting `{state:{hole:n}}` with `skipIntro` lands on hole n+1 (I asked for 1 and got "HOLE 2 Gorse Run"; I asked for 7 and got "HOLE 8"). I did not take the cliff-lip zoom or the #5d8a3a ribbon sample. `perf` ran on SwiftShader (1354 ms a frame, host load 3.3), so it is not scored. Draw calls are 274 and triangles 548k.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The hole 2 aim view shows soft sand pots, smooth fairway and rough in blended tones, and no pixel blocks.
   - The hole 8 C view shows soft-edged mowing stripes, with the `grass*` ×6023 field blending into the rough.
   - The `bushes*` and `tree*` groups have room around them.
1. **LANE GOAL: 7.**
   - Hole 2: `pin_pole` is 0.25% and `pin_flag` is 0.19% of the aim view, with `course.pinVisible` true only for the current hole. The pole reads against the haze.
   - Hole 8 C view: `pin_ring` (0.27%, the yellow ring) reads. `pin_pole` is 0.14% and `pin_flag` is 0.11%, but both are cut by the top edge, so the pin is still a stub.
   - `way_ring`, `way_diamond` and `way_post` mark the waypoint.
   - `course-cliff-lip` and `course-h1-ribbon` are still not saved, asked a fourth time.
2. **Looks as LOOK.md says: 8.** The painted brush pass, cream-green haze and teal sea are there. Brightness is 53% with 0% blown out. The hole 2 sea and `cliffFace` read.
3. **Edit only the lane files: 8.** Iteration 10 touched `src/pins.js`, `src/course.js`, `lanes/course.md` and `game-tests.json`.
4. **Tilt-shift focus band: 8.** The edges of both looks are blurred and the middle is sharp.
5. **Plays as DESIGN.md says: 6.** The aim view, club panel and meter are in place. I did not play a swing this session, and the scorecard and R replay are unseen.
6. **Camera: 6.** The aim camera is high and narrow (fov 29.9). The C view is overhead (fov 31.9), but the pin sits at the frame top. The flyover is unseen.
7. **Ball flight: 6.** No flight was observed this session. Earlier saved checks cover the splash and the hole 9 drive.
8. **Full 9 holes, sheep, hazards: 7.**
   - Hole 2 has the sand carry pot in the line of play, plus `flowers*` and `blossoms*` ×57 on the cliff lip.
   - Hole 8 has `house_*`, `fenceRails*`, `sheep*` ×6 and the `trees`.
   - Par 3s are now 128–129 yd with an iron `needPower` of 0.883.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". No card was seen.
10. **HUD: 8.** The hole panel, wind, club panel and hint strip are legible, with 0 overlap and 0 cut off. The big hole banner sits mid-picture and persists after the 40 frames.
11. **`window.__game`: 8.** `observe()` is full, with `course.pinVisible` and `course.waypoint`. Hole 2's observe shows `meter.needPower` 0.883.
12. **Golfer matches CHARACTERS.md: 6.** In the hole 2 aim view the `golfer_body` (0.27%) shows a red-and-white kit with a helmet and club, and reads against the grass. In the C view it is not found.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 6.** Two checks are still missing. The state-hole offset makes new checks easy to mis-set.

**Faults: 6.**
- `toNonIndexed(): already non-indexed` warns at load, still open.
- The C-view pin is cut by the top edge on hole 8.
- Hole 2 still shows "IRON 132 YD" against 128 yd, so it now fits.
- The banner lingers over the C view.
- `perf` has no signal on this host.

**Object sourcing:** I did not check `paprika3d/asset-hits.json` or `paprika3d/sourcing.json`. The `trees`, `bushes*`, `sheep*`, `blossoms*` and `flowers*` are code shapes, so run a library search for stylized trees and bushes first.

**Next:**
1. **Save `course-cliff-lip` and `course-h1-ribbon`** (asked again, fourth time; do this first).
   - Use `interact` with `{state:{hole:0,...}}` or the `start` action, confirming `observe().hole` is 1.
   - Run `look` with `zoom` on the hole 2 cliff lip at roughly [760, 330, 960, 560] in the aim view. The `blossoms*` should read as shrubs.
   - Run `look` with `sample` on hole 1's tee-to-green line, expecting within 30/255 of #5d8a3a. Then save both with `interact` and `save`, using `expect` on `hole` and `lie`.
   - Shown done by `test` listing both as ✓.
2. **Pull the C-view pin off the top edge.**
   - The pin's `pin_ring` is at y 40–106 with the pole cut at y 0 in the hole 8 C view. In `src/course.js` or `src/pins.js`, export a `course.cViewCentre` (midpoint of tee and pin) that the camera lane can use, and note it in `lanes/course.md` for `src/camera.js`.
   - Failing that, make the ring and pole read at the cut edge by shortening the scaled pole to a flag-on-ring.
   - Shown done by `interact` with `KeyC` for 40 frames and `look`. `pin_flag` should be 0.1% or more with a box top greater than 0.
3. **Run the whole `test`, then fix the `toNonIndexed` warning.** This was last session's Next 3 and is unchecked.
   - Find the `toNonIndexed()` call in `src/island.js` or `src/course.js` and guard it with `if (g.index)`.
   - Shown done by `open` with no `three.js warned` line, and `test` showing 10 of 10 ✓.

SCORE: 6.9
