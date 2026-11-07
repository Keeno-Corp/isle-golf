The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 9

**Judge 9.** All 8 saved checks pass: `tee-shot-three-clicks`, `putt-drops-in-cup`, `pond-costs-a-stroke`, `hot-seat-passes-turn`, `course-only-current-pin`, `course-h6-splash`, `course-h9-drive` and `course-h2-carry`. I took one look, the hole 7 C view. I did not run `perf` because the host is SwiftShader, so it is not scored. I did not take the cliff-lip zoom or the #5d8a3a ribbon sample, so those stay unproven. I did not check the scorecard, R replay, flyover or load-order imports.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The hole 7 C view shows smooth, soft-edged mowing stripes, with the `grass*` ×3504 field blending into the rough. I saw no pixel blocks and no repeated tile.
   - The `bushes*` and `tree*` groups have room around them.
1. **LANE GOAL: 7.**
   - Holes 2 and 3 have the carry sand pot, and `course-h2-carry` is saved.
   - `course-only-current-pin` passes, and `course.pinVisible` shows only hole 7's pin on hole 7.
   - Hole 7 C view: `pin_pole` is 0.043% and `pin_flag` is 0.018% of the frame, both at the top edge. This is still a speck, asked again.
   - `course-cliff-lip` and `course-h1-ribbon` are still not saved, asked again for the third time.
2. **Looks as LOOK.md says: 8.** The painted pass, warm cream-green haze and teal sea show, with brightness at 52% and 0% blown out.
3. **Edit only the lane files: 8.** Iteration 9 touched only `game-tests.json`.
4. **Tilt-shift focus band: 8.** The top and bottom of the hole 7 look are blurred.
5. **Plays as DESIGN.md says: 6.** Four saved checks pass. The scorecard and R replay are unseen.
6. **Camera: 6.** The C view is a clean overhead. The flyover and flight-follow are unseen.
7. **Ball flight: 6.** `pond-costs-a-stroke`, `course-h6-splash` and `course-h9-drive` pass. Wind, bounce and OB were not observed.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*` ×5 are on hole 7, with the sea, `cliffFace` and `seaStacks*`.
   - `way_ring` and `way_diamond` mark the waypoint at [0.93, 7.67].
   - The hole 7 pin does not read.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 0" and "ROUND EVEN". No card was seen.
10. **HUD: 8.** The hole panel, wind, club panel and hints are all legible with no overlap or cut-off. The "HOLE 7" banner sits in the middle of the picture.
11. **`window.__game`: 8.** `observe()` is full, including `course.pinVisible` and `course.waypoint`, and 8 of 8 checks pass.
12. **Golfer matches CHARACTERS.md: 5.** In the hole 7 C view `golfer_body` is 0.015% of the frame, cut by the bottom edge, and it blends in.
13. **COORDINATION.md and load-order: 7.** Not re-checked.
14. **`course:` events and `lanes/course.md`: 7.** Not re-read.
15. **Pictures with interact and look: 6.** Five `course-` checks are saved. The cliff-lip and ribbon checks are missing.

**Faults: 6.**
- `toNonIndexed(): already non-indexed` warns at load.
- Hole 2 still auto-picks the iron for 153 yd, which can't reach. That fix is in the hud/aimline lane, outside this one.
- Hole 7 C view: the pin is not readable.

**Object sourcing:** I did not check `paprika3d/asset-hits.json` or `paprika3d/sourcing.json` this session.

**Next:**
1. **Make the C-view pin read on hole 7, and on holes 2 and 3** (asked again, builder skipped it in iteration 9).
   - In `src/pins.js`, scale `pin_pole`, `pin_flag` and `pin_knob` up in the overhead view only, for example a 2–3× pole and flag. Add a bright ring or disc under `pin_pole` that only shows on the current hole in the C view.
   - Shown done by `interact` with `{state:{hole:6,skipIntro:true}}`, then `KeyC` for 40 frames with `look:true`. `look` should list `pin_flag` at 0.1% or more of the frame, clear of the top edge.
2. **Save `course-cliff-lip` and `course-h1-ribbon`** (asked again, third time).
   - Run `look` with `zoom` on the blossom shrubs at the cliff lip. Then run `look` with `sample` on hole 1's tee-to-green ribbon, expecting within 30/255 of #5d8a3a.
   - Save both with `interact` and `save`, using `expect` on `observe()` state, since a save needs state entries.
   - Shown done by `test` listing both as ✓.
3. **Add a hole 3 carry check and a note for the hud lane.**
   - Add `course-h3-carry` as `course-h2-carry` does, placing the ball at the tee-to-pin midpoint and expecting lie 'sand'.
   - Add a line to `lanes/course.md` that hole 2's 153 yd needs a driver pick in the hud/aimline lane.
   - Shown done by `test` listing `course-h3-carry` as ✓.

SCORE: 6.9

## Iteration 10
**Did** src/pins.js: in the C view the current pin group scales 2.6x and `pin_ring` (yellow ring) shows under it. src/course.js: moved path[0] of holes 1-3 toward the green; yards now 128-129, iron needPower 0.88/0.88/0.89 (hole 2 was 1.05). `course-h2-carry` ball moved to the new midpoint (8.96, 15.25); saved `course-h3-carry` (lie sand). Notes in lanes/course.md.
**Saw** Hole 7 C view: `pin_ring` 0.32%, `pin_pole` 0.24%, but the pin sits at the top edge so `pin_flag` is 0.005% and cut off; the ring reads. Hole 2 observe: iron, needPower 0.883, waypoint [12.37,14.15]. Full `test` run before the course-h2 edit: 7 of 8 pass, only h2-carry failed (midpoint moved); h2 and h3 carry re-proved by interact. Not rerun: full test after the fix, perf.
**Next** (1) Save `course-cliff-lip` and `course-h1-ribbon` (look zoom + sample). (2) Pin sits at the top edge in the hole 7 C view: shift overheadCam target in src/camera.js (outside lane, note it) or ask look lane. (3) Rerun the whole `test`.
**Open** `toNonIndexed` warning; hole 1 and 3 tee moves not looked at (fairway ribbon/path start moved ~1 unit, tee marker/sign follow path[0]).
