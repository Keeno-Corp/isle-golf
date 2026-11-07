**Judge 6.** The host is SwiftShader, so I did not run `perf` and it is not scored. I took one hole 9 real-key attempt and a four-hole `sheet` (holes 1, 2, 3 and 6). The hole 9 attempt did not prove the check: W moved the club the wrong way, to "PUTTER", so the drive was a putter "MISS-HIT!". I did not look at hole 1's pin zoom, and the sheet cells show the diorama view. I did not re-prove the hole 6 SPLASH.

**Must have scores**

0. **Ground not pixelated or tiled, spread wider: 8.**
   - The `grass*` ×1328 field shows smooth painted fairway stripes. The yellow rough on the hole 9 look has no pixel blocks and no repeated tile.
   - The `tree*` and `bushes*` clusters have room around them in the h1, h2, h3 and h6 sheet cells.
1. **LANE GOAL: 6.**
   - Only the current pin is on: `course.pinVisible` is true only for hole 9 (index 8).
   - Holes 2 and 3 do show sand pots between tee and green in the sheet, so hazards exist. They read small and flat, with no real carry.
   - The hole 9 `aimDeg` is now 13.2 against a `pinBearingDeg` of -14.8, so auto-aim is still 28° off the pin, via the waypoint.
   - The `way_*` markers are hidden in the aim phase on this look.
   - No `course-h9-drive` check is saved.
2. **Looks as LOOK.md says: 8.** The painted pass, cream-green haze and warm sun show. Brightness is 50–55%, with 0% blown out.
3. **Edit only the lane files: 8.** Iteration 6 touched only `src/pins.js`.
4. **Tilt-shift focus band: 8.** The blur is strong at the top and bottom of every look.
5. **Plays as DESIGN.md says: 5.**
   - Real Space presses started the meter (`meter.stage` 3, `label` "MISS-HIT!").
   - W/S club stepping goes from iron toward putter, not toward driver. On hole 9 the auto-pick was already wrong.
   - R replay and the scorecard are still unseen.
6. **Camera: 6.** The aim view has fov 30, high behind the ball. The flyover and flight-follow are unseen.
7. **Ball flight: 5.** I saw a `ballTrail` roll along the fairway. Wind, bounce, the wedge splash and OB are unseen this session.
8. **Full 9 holes, sheep, hazards: 7.**
   - `sheep*` ×4 show on hole 9, along with `sign_board` ×3.
   - The sheet shows the pond, cliff, sea, house and lighthouse.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 1" and "ROUND EVEN". No card was seen.
10. **HUD: 8.** The four elements (`#holep`, `#windp`, `#clubp`, `#hinter`) are legible, with 0 overlap.
11. **`window.__game`: 8.** `observe()` returns `course.pinVisible`, `meter.perfectAt`, `meter.needPower` and `pinBearingDeg`.
12. **Golfer matches CHARACTERS.md: 5.**
    - `golfer_body` is drawn by its own shader, so the ID image cannot measure it, and the aim view shows no golfer at all.
    - The sheet shows 0.005–0.007% of the frame, which is invisible.
13. **COORDINATION.md and load-order: 7.** I did not check the imports.
14. **`course:` events and `lanes/course.md`: 7.** I did not re-read them.
15. **Pictures with interact and look: 5.** Only `course-h6-splash` is saved, with no hole 9 check.

**Faults: 5.**
- `toNonIndexed(): already non-indexed` warns at load.
- `SFX[k] is not a function` in `src/sound.js` was fixed outside the lane in earlier sessions and did not show in this session's replies.
- On hole 9 the auto-picked club is wrong for the 474 yd distance. `needPower` is 1.05 for the iron, so a full-power iron cannot reach the pin. The page treats W as moving toward the putter.

**Next:**
1. **Prove the hole 9 real-key drive** (asked again).
   - Use `{state:{hole:8,skipIntro:true}}`, then `{action:"club",name:"driver"}` or press S. Check `club` is "driver" before the first Space.
   - Press Space 3 times, with the third click timed on `meter.perfectAt` (use `until` on `meter.t`).
   - Save it as `course-h9-drive`. The reply should show `ball.surface` "fairway" or "green" and `strokes` of 3 or fewer.
   - Make `src/course.js` auto-pick the driver on hole 9 at the tee, since `needPower` above 1 is unreachable.
   - If auto-aim sends drives into the rough, move the hole 9 waypoint onto the fairway line.
2. **Show the golfer and the pin in the aim view** (golfer: new; pin: asked again).
   - The aim view of hole 9 shows only the ball and no `golfer_body` or pin, and the hole 1 `pin_knob` was still cropped at the frame top in iteration 6.
   - Nudge the hole 1 framing, or the pin position in `src/pins.js`, so the whole flag and `pin_knob` fit the frame.
   - Shown done by `look` with `zoom` [250,20,350,110] on hole 1 after `{state:{hole:0,skipIntro:true},wait:30}`: flag, pole and knob fully inside the frame.
3. **Give holes 2 and 3 a carry** (asked again).
   - The sand pots are flat and scattered. Add a gorse or short water carry directly on the tee-to-pin line of hole 2 in `src/course.js`.
   - Shown done by a `sheet` of `hole:1` and `hole:2` with `KeyC` and 40 frames: a hazard on the ribbon between tee and green, and no `tree*_leaves0` crowding the cliff edge.

SCORE: 6.3
