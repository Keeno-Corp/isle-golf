The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 7

**Judge 7.** The host is SwiftShader, so I did not run `perf` and it is not scored. I looked at hole 1 (aim view) and hole 2 (C view), and I reran all saved checks. I did not take a hole 7 look, a cliff-lip zoom or a #5d8a3a sample, so those items are unproven.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The hole 1 aim view shows a smooth painted fairway ribbon and soft rough. I saw no pixel blocks and no repeated tile.
   - The `tree18_leaves0` and `bushes*` groups have room around them.
1. **LANE GOAL: 6.**
   - Only the current pin is on. `course.pinVisible` is true only for hole 2 on that look, and only for hole 1 on the hole 1 look.
   - `pin_knob` on hole 1 is now fully in frame, at [571,29,601,58], with `pin_pole` and `pin_flag` whole.
   - Hole 2's tee-to-pin line is clean grass. The sand pots sit to the side, and the pond is not on the line, so there is no carry. This is asked again.
   - `course-cliff-lip` and `course-h1-ribbon` are not saved.
2. **Looks as LOOK.md says: 8.** The painted pass, warm haze and teal sea show. Brightness is 51%, with 0% blown out.
3. **Edit only the lane files: 8.** Iteration 7 touched only `src/course.js` and `game-tests.json`.
4. **Tilt-shift focus band: 8.** The top and bottom of both looks are blurred.
5. **Plays as DESIGN.md says: 6.**
   - The `course-h9-drive` real-key check passes, using real Space clicks timed on `meter.perfectAt`.
   - Aim, club and the meter work. R replay and the scorecard are unseen.
6. **Camera: 6.** The aim view has fov 30 and sits high behind the ball. The C view is a top-down overhead at fov 31.8. The flyover and flight-follow are unseen.
7. **Ball flight: 6.** The `course-h9-drive` and `course-h6-splash` checks pass. Wind, bounce and OB are unseen this session.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*`, `sign_board`, `way_ring` and `way_diamond` are present.
   - The hole 2 C view shows the sea, cliff and `blossoms*`.
   - Holes 2 and 3 still have no carry.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". No card was seen.
10. **HUD: 8.** All five elements are legible, with 0 overlap and 0 cut off.
11. **`window.__game`: 8.** The `observe()` state is full, and all 7 saved checks pass.
12. **Golfer matches CHARACTERS.md: 6.**
    - On hole 1 the `golfer_body` is clear and readable, with a red kit, at 0.36% of the frame, though cut by the frame bottom.
    - On the hole 2 C view it is 0.039% and blends in (subject 58% against 57% around it).
13. **COORDINATION.md and load-order: 7.** I did not check the imports.
14. **`course:` events and `lanes/course.md`: 7.** I did not re-read them.
15. **Pictures with interact and look: 6.** Three course- checks are saved. The cliff-lip and ribbon checks are missing.

**Faults: 6.**
- `toNonIndexed(): already non-indexed` warns at load.
- `SFX[k]` in `src/sound.js` was not seen this session.
- On the hole 2 C view, the C-view `pin_flag` is only about 0.075% of the frame, so the pin barely reads from above.
- On hole 2 the auto-pick is the iron, with `needPower` 1.05 at 153 yd. That is not reachable with the 132 yd iron, so the pick is wrong and a driver is needed.
- `Never visible`: `cliffRocks` and `seaStacks` are hidden behind `tree17_leaves0` on hole 1, and not drawn on hole 2.

**Next:**
1. **Hole 2 and 3 carry, then the club pick** (asked again).
   - Put a gorse patch or a small pond on the tee-to-pin line of hole 2 in `src/course.js`, and the same on hole 3.
   - Fix the auto-pick so `needPower` is at most 1 (hole 2 at 153 yd picks the iron with `needPower` 1.05).
   - Shown done by a `look` of `{state:{hole:1,skipIntro:true}}` then `KeyC` for 40 frames. It shows a hazard on the ribbon between `teeMarker` and `pin_pole`, and `meter.needPower` at or below 1.
2. **Save `course-cliff-lip` and `course-h1-ribbon`** (asked again).
   - Use a `look` zoom on the cliff lip blossom shrubs. Take a `sample` on hole 1's tee-to-green ribbon, expecting within 30/255 of #5d8a3a.
   - Shown done by `test` listing both ids as ✓.
3. **Make the C-view pin and golfer read** (new).
   - Enlarge `pin_flag` in the C view in `src/pins.js`, since `pin_flag` is 0.075% there.
   - Check hole 7's green after its move, with `{state:{hole:6}}` and KeyC. The pin should be on screen with no trees on the green.

SCORE: 6.8

## The request changed

paprika-loop/PROMPT.md changed before session 8; the Next lists above were written before it. Changed lines:
+ Steering note (lane lead): the aim-view camera framing and whether the golfer shows in it belong to the look lane (src/camera.js); don't chase those here. If the pin is cut at the frame top, keep the pole thick but not taller than needed. Priorities left, in order: hole 9 real-key drive saved as course-h9-drive; the holes 1-9 C-view pin check saved as course-only-current-pin (already saved, keep it passing); a carry on holes 2 and 3; look zoom on the cliff lip (blossom shrubs) and the #5d8a3a ribbon sample on hole 1, both saved as course- checks.

## Iteration 8
**Did** `src/course.js` HOLES.forEach: holes 2 and 3 (index 1, 2) get a carry bunker pushed after the rayClear passes, at 50% along the tee-to-pin line (rx 1.05, rz 0.75, turned across the line), so it stays on the line. All 7 saved checks pass.
**Saw** Look sheet (KeyC) holes 2 and 3: a sand pot sits on the ribbon between tee and pin on each; brightness 50-51%, 0% blown out. Hole 2 auto-pick is still the iron with needPower 1.05 at 153 yd (the pick is in src/hud.js / src/aimline.js, outside the lane). Not run: perf, cliff-lip zoom, ribbon sample.
**Next** (1) Save `course-cliff-lip` (look zoom on the blossom shrubs) and `course-h1-ribbon` (#5d8a3a sample). (2) Ask the look/hud lane to fix the hole 2 club pick (iron needPower 1.05 at 153 yd, a driver is needed). (3) C-view pin and hole 7 green check.
**Open** `toNonIndexed` warning; `SFX[k]` in src/sound.js (outside lane). Carry bunker is not tested by a saved check.
