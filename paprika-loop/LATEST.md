The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 5
**Did** Only proved hole 6's splash with real keys (state `hole` is 0-based, so hole 6 is `hole:5`; last judge used `hole:6`, which is hole 7). Held D until `aimDeg` 55-60, S for the iron/wedge, Space x3: banner 'SPLASH!', strokes 2. Saved as `course-h6-splash` in `game-tests.json` (6 checks). No source edits.
**Saw** Hole 6 pin bearing 45°, auto-aim 3° (the waypoint `[-18.59,-0.11]` is the dogleg, not the pond, by design); `ball.surface` ended 'fairway' at (-25.75,-0.5) after the penalty drop. Error `SFX[k] is not a function` in src/sound.js remains (outside lane). Not run: perf, looks, hole 9 drive.
**Next** (1) Hole 9 real-key drive, save `course-h9-drive` (use `hole:8`). (2) Pin framing: `pin_pole`/`pin_flag` cut at the frame top on hole 1's aim view; bigger flag in `src/pins.js`. (3) A carry or bunker on holes 2 and 3; check cliff trees on holes 6 and 7.
**Open** Auto-aim on hole 6 is 42° off the pin by design (waypoint); the judge's "fix the waypoint" item may be moot. `toNonIndexed` warning remains.

### Judge 5

**Judge 5.** The host is SwiftShader, so I did not run `perf` and it is not scored. I took one 3-click hole 9 drive and a four-hole `sheet` (holes 1, 2, 3 and 9). The hole 9 drive does not prove the check. I did not re-prove the hole 6 SPLASH, which iteration 5 recorded as saved in `game-tests.json` (6 checks).

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The sheet looks of holes 1, 2, 3 and 9 show smooth painted fairway stripes, rough and sand pots (the `grass*` ×1272–1726 instances). I saw no pixel blocks and no repeated tile.
   - The wider spread holds, with room around the `tree*` and `bushes*` clusters.
1. **LANE GOAL: 6.**
   - Only the current pin is visible: `course.pinVisible` is true only for hole 9. `way_post`, `way_ring`, `way_diamond` and `aimLanding` show on hole 9.
   - Holes 2 and 3 are still plain open walks with no carry. Hole 2 has only a flower patch and the cliff.
   - On hole 1 the pin and its red flag still sit cropped at the very top of the aim view [290,25,310,60 in the sheet cell]. It is not a clear accent.
   - No `course-h9-drive` check is saved.
2. **Looks as LOOK.md says: 8.** The painted pass, cream-green haze and warm sun show, with brightness 50–56% and 0% blown out.
3. **Edit only the lane files: 8.** Iteration 5 made no source edits.
4. **Tilt-shift focus band: 8.** The blur is clear at the top and bottom of every look.
5. **Plays as DESIGN.md says: 6.**
   - Real Space presses ran the 3-click meter: `meter.label` "HOOK!", `strokes` 1, and the ball rested in the rough with "IN THE ROUGH: SHORTER SHOT".
   - Club change and aim work. R replay and the scorecard are still unseen.
6. **Camera: 6.** The aim view has fov 30 high behind the ball. The flyover and flight-follow are unseen.
7. **Ball flight: 6.** I saw a hooked rough landing with a trail of `aimDots*`. The wedge splash is claimed in iteration 5's note and I did not re-prove it. Bounce and OB are unseen.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*` ×3 show on hole 9, `sign_board` shows at the tees, and the cliff and sea show on hole 2.
   - Holes 1–3 lack hazards between tee and green.
9. **Stroke play and scorecard: 5.** The HUD shows strokes and "ROUND EVEN". No card was seen.
10. **HUD: 8.** All five elements (`#holep`, `#windp`, `#clubp`, `#sub`, `#hinter`) are legible with 0 overlap.
11. **`window.__game`: 8.** `observe()` returns `course.waypoint`, `pinVisible`, `meter.needPower` and `pinBearingDeg`.
12. **Golfer matches CHARACTERS.md: 6.** `golfer_body` is 0.34% of the frame with edge contrast 0.123. The red/white kit reads a little better but is still small.
13. **COORDINATION.md and load-order: 7.** The imports were not checked.
14. **`course:` events and `lanes/course.md`: 7.** I did not re-read them this session.
15. **Pictures with interact and look: 6.** Only `course-h6-splash` is saved. The hole 9 check and the Check-4-style flag looks are not.

**Faults: 5.**
- `SFX[k] is not a function` (`src/sound.js:71`) fires on every swing. It is outside the lane.
- `toNonIndexed(): already non-indexed` warns at load.
- The hole 1 pin is cropped at the frame top.
- At hole 9's tee, the iron is auto-picked (`club` "iron", `needPower` 1.05). A driver is the better pick for 474 yd, and `needPower` above 1 means a full-power iron cannot reach the pin.

**Next:**
1. **Prove the hole 9 real-key drive** (asked again).
   - `aimDeg` was 27.5 against a `pinBearingDeg` of -24.8, so auto-aim is about 52° off the pin, via waypoint [6.3,4.4].
   - Use `{state:{hole:8,skipIntro:true}}`, press W to switch to the driver, then press Space 3 times with the third click timed on `meter.perfectAt` (use `until` on `meter.t`).
   - Save it as `course-h9-drive`; the reply should show `ball.surface` "fairway" or "green" and `strokes` of 3 or fewer.
   - If auto-aim sends drives into the rough, move the hole 9 waypoint in `src/course.js` onto the fairway line.
2. **Make the pin the one clear accent** (asked again).
   - The hole 1 `pin_pole` and `pin_flag` are cropped at the aim-view top.
   - In `src/pins.js`, make the flag larger and the pole thicker, and nudge the hole 1 tee-to-pin framing so the whole flag is inside the frame.
   - Shown done by `look` with `zoom` [250,20,350,110] on hole 1 after `{state:{hole:0,skipIntro:true}}`: flag and `pin_knob` fully inside the frame, at least 14 px wide.
3. **Add a carry or bunker on holes 2 and 3** (asked again; holes 1–3 are open walks).
   - Add a sand pot or a short water or gorse carry short of the green in `src/course.js`.
   - Check the cliff-lip trees on holes 6 and 7 at the 1.2 spread.
   - Shown done by `look` with `sheet` of `hole:1` and `hole:2`: a hazard visible between tee and green and no `tree*_leaves0` crowding the cliff edge.

SCORE: 6.4
