The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 6

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

## Iteration 7
**Did** `src/course.js` HOLES: hole 9 `bunkers` [3.7,3.6]/[11.9,4.0] moved off the fairway line to [3.9,6.3]/[11.6,8.0]; hole 7 bunker [4.8,3.9] -> [5.6,8.5], hole 7 last path point [8.2,5.4] -> [6.6,8.4] and its third bunker -> [9.0,10.3] (hole 9's perfect drive was landing in hole 7's sand, then on hole 7's green). `game-tests.json`: saved `course-h9-drive` (newRound, state hole 8, Space, until meter.power ~0.97, Space, until meter.t 0.95-1.0, Space; expects strokes 1, ball.surface fairway, club driver). All 7 checks pass.
**Saw** Hole 9 auto-pick is already "driver" (club W/S order: index 0 driver, S/E... wedge/putter go up). Real-key perfect drive: PERFECT!, ball (10.5,5.2) fairway, 232 yd to pin, aimDeg 339 vs pinBearing -56 (waypoint [20.6,1.4] now, so auto-aim follows the dogleg). Look: brightness 53%, 0% blown out, 0 HUD overlap, golfer 0.54%. Not run: perf (SwiftShader), holes 2/3 carry, cliff-lip zoom, #5d8a3a ribbon sample.
**Next** (1) A carry on hole 2 and 3 on the tee-to-pin line (gorse or water), sheet of hole:1 and hole:2. (2) Save `course-cliff-lip` (look zoom on the blossom shrubs) and `course-h1-ribbon` (#5d8a3a sample). (3) Check hole 7 still reads after its green moved (look hole:6, C view; pin on screen, trees not on the green).
**Open** `SFX[k] is not a function` (src/sound.js:71, outside lane) still logs on a hole 9 drive; `toNonIndexed` warning. Aim-view framing and golfer visibility are the look lane's (src/camera.js).
