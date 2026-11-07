Status: all 7 saved checks pass and I've taken the hole 1, 2, 3 and 7 looks. I'm writing the verdict now.

**Judge 8.** The host is SwiftShader, so I did not run `perf` and it is not scored. I did not take a cliff-lip zoom or a #5d8a3a sample, so those two items stay unproven. The load-order imports, `lanes/course.md`, the scorecard, R replay and flyover were not checked.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The hole 1 aim view shows a smooth painted fairway ribbon with soft rough.
   - The `grass*` and `bushes*` groups have room around them on holes 2, 3 and 7.
   - I saw no pixel blocks and no repeated tile on any of the four looks.
1. **LANE GOAL: 7.**
   - Holes 2 and 3 now have a sand pot on the tee-to-pin line. It sits about halfway between the tee marker and `pin_pole` on each, so the carry is in. The hazard is not covered by a saved check.
   - Only the current pin shows: `course-only-current-pin` passes.
   - On the hole 7 C view I could not find the pin on screen. The green reads as a faint pale patch among trees, with no `pin_flag` accent.
   - The hole 2 and 3 pins are still tiny from above.
   - `course-cliff-lip` and `course-h1-ribbon` are still not saved. This is asked again.
2. **Looks as LOOK.md says: 8.** The painted pass, warm haze and teal sea show, with brightness at 50–52% and 0% blown out.
3. **Edit only the lane files: 8.** Iteration 8 touched only `src/course.js`. The hole 2 club-pick defect lives in `src/hud.js` or `src/aimline.js`, outside the lane.
4. **Tilt-shift focus band: 8.** The top and bottom bands are blurred on all four looks.
5. **Plays as DESIGN.md says: 6.** `tee-shot-three-clicks`, `hot-seat-passes-turn` and `course-h9-drive` pass. The scorecard and R replay are unseen.
6. **Camera: 6.** The aim view sits high behind the ball. The C view is a clean overhead. The flyover and flight-follow are unseen.
7. **Ball flight: 6.** `pond-costs-a-stroke`, `course-h6-splash` and `course-h9-drive` pass. Wind, bounce and OB were not observed.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep[6]` shows on hole 2, along with the sea and `cliffFace`.
   - The sand pots sit at the greens and the carry pots sit on the line.
   - Hole 7 has no readable pin from above.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". No card was seen.
10. **HUD: 8.** Hole/par/strokes top left, wind top right, club panel bottom left and hints bottom right are all legible. The banner "HOLE n" overlays the middle of the picture.
11. **`window.__game`: 8.** `observe()` is full, `act()` is documented, and 7 of 7 checks pass.
12. **Golfer matches CHARACTERS.md: 6.** In the hole 1 aim view the red-kit golfer reads clearly at 0.31% of the frame. In the C views it is 0.014–0.03% and gets lost.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 6.** The checks `course-h6-splash`, `course-h9-drive` and `course-only-current-pin` are saved. The cliff-lip and ribbon checks are missing.

**Faults: 6.**
- `toNonIndexed(): already non-indexed` warns at load.
- Hole 2 still auto-picks the iron (132 yd) for 153 yd, which can't reach. That is outside the lane and needs the hud/aimline lane.
- Hole 7 C view: `pin_flag` is not readable.
- `SFX[k]` in `src/sound.js` was not seen this session.

**Next:**
1. **Save `course-cliff-lip` and `course-h1-ribbon`** (asked again).
   - Run `look` with `zoom` on the blossom shrubs at the cliff lip, then `look` with `sample` on hole 1's tee-to-green ribbon, expecting within 30/255 of #5d8a3a.
   - Save both with `interact` and `save`.
   - Shown done by `test` listing `course-cliff-lip` and `course-h1-ribbon` as ✓.
2. **Make the C-view pin read on hole 7, and on holes 2 and 3** (asked again).
   - Check hole 7's green after its move and clear any trees from it.
   - In `src/pins.js`, keep the C-view `pin_flag` and `pin_pole` large enough to read.
   - Shown done by `look` of `{state:{hole:6,skipIntro:true}}` then `KeyC` for 40 frames. It shows a pin accent on the green, and `look` lists `pin_flag` at 0.1% of the frame or more.
3. **Test the carry bunkers with a saved check** (new).
   - Add a `course-h2-carry` check using `observe()` on holes 2 and 3.
   - It should show the bunker centre within about 1 unit of the tee-to-pin line, and a perfect drive along the auto-aim carrying it to lie `green` or `fairway`.
   - Shown done by `test` listing `course-h2-carry` as ✓.
   - Note the hole 2 club-pick fix for the hud lane in `lanes/course.md`.

SCORE: 7.0
