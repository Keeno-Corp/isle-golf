**Judge verdict, session 5**

I ran the title start, the flyover skip, two shots on hole 1, a look at each and `perf`. I did not see a drop, a lip-out, a card or a final card. The putter can't be reached from the tee, because `club` is overridden to iron or wedge and the shot goes about 20 yd. The `state` step I tried to place the ball near the cup errored with "Cannot read properties of undefined (reading 'pos')". The steer added to PROMPT.md mid-session is now the first job for the next builder.

1. **TOP PRIORITY: HUD readable at the wider view, "SO CLOSE!" and "IN!" calls with sound: 5.**
   - `hudRound.lastCall` went HOLE 1, then "94 YD TO PIN", then "110 YD TO PIN", and `lipOut` stayed false in both plays.
   - This is the third session in which "SO CLOSE!" and "IN!" have not been shown working on a real putt.
   - The camera is still not wider. `camera.fov` reads 30 and the golfer is 0.34% of the frame.
   - `#holep`, `#windp`, `#clubp` and `#hinter` have 0 overlap and 0 cut off.
2. **HUD in the Isle Blitz type: 8.**
   - `#holep` shows HOLE 1, PAR 3, STROKES 1, 94 YD, ROUND EVEN and PEBBLE STEP.
   - `#windp` shows "2 MPH CROSS →".
   - `#clubp` shows DRIVER 204, IRON 132, WEDGE 74, PUTTER GREEN and LIE · FAIRWAY.
   - `#meterp` was not looked at in this session at stage 1 or 2, and I did not see the yardage drop for rough or sand.
3. **Banners never cover the target: 6.**
   - The "n YD TO PIN" banner did not show in either look. `banner` only changes in the state, and the clear timing is still unproven.
   - The `#banner` shrink from the last Iteration is unchecked in a picture.
4. **Stamped scorecard and final card: 4.** No card, stamp, ROUND COMPLETE or new-best look was taken.
5. **Title and hot-seat: 5.** One player started and the flyover skipped with Space (`player` ISLA). The 2-player order was not checked. `hud-round-hotseat` is saved but has not been shown to pass.
6. **Sound: 6.** 12 sounds started during the swing steps and there were no console errors. The groan, rattle, jingle and tick are unheard.
7. **Juice: 6.** "94 YD TO PIN" shows on `banner`. PERFECT and NICE, and the bunker hint, were not seen on screen.
8. **R replay and full 9-hole round: 2.** There is still no `hud-round-full-round` in game-tests.json. The grep finds only hud, hotseat and sound, each twice (lines 235/236, 281/282, 321/322).
9. **No console errors: 8.** Only the three.js `toNonIndexed` warning.
10. **Saved checks: 4.**
    - hud-round-hud, hud-round-hotseat and hud-round-sound are there.
    - hud-round-full-round and an "IN!" check are missing.
    - I did not run `test`.
11. **Looks as LOOK.md says: 7.**
    - Tilt-shift blur and cream-on-green panels fit.
    - The golfer is small, at 0.34% of the frame.
    - Green is 65%, yellow 24% and grey 10%.
12. **Edit only the allowed files and COORDINATION.md rules: 7.** The `hudRound` key has `order`, `turn`, `lastCall`, `minPinD` and `lipOut`. I did not audit the files the last verdict flagged (`meter.js` and `physics.js`).
13. **Keep what other lanes own: 8.** The golfer, aim dots, sheep, signs, pin flag and narrow FOV are intact.

**Faults: 5.**
- `perf` gave 1119 ms a frame, 307 draw calls and 486k triangles. The host load line reads 3.4 on 8 cores and the renderer is SwiftShader, so this is not a budget signal.
- `look` shows no `Lighting:` or `Surfaces:` fault lines.
- The `Never visible` list is trees, fence and cliffs outside the view, plus `divots` and `ballTrail`.
- The one real fault is that the "IN!" and "SO CLOSE!" paths are still unproven.

**Next:**
1. **Save `hud-round-full-round` and `hud-round-hotseat` first (asked again, and the lane lead's steer).**
   - Use real keys only: Space to start, Space to skip each flyover, Space x3 per shot with waits, and arrows to aim. No `next`, `swing` or `state` steps.
   - Run `interact` with `expect` on `scores.length` 9, the total, and `phase` at the final card, then `save`. `test` lists the check passing.
   - In the same session, take the `look: true` pictures of the ROUND COMPLETE card with winner, best round and new best, and of a 2-player stamped card.
2. **Make a putt reachable and prove "IN!" and "SO CLOSE!" (asked again).**
   - Use real keys to reach the green, or find a state shape that works (`ball` with `pos`, as the error suggests). Then putt with arrows and Space.
   - `interact` with `trace: ["hudRound.lastCall", "hudRound.lipOut", "banner"]` shows "IN!" on a hole-out, and "SO CLOSE!" when the ball rests under 3 units from the cup. Save a check for "IN!".
3. **Take the pictures never taken.**
   - A `#banner` on screen, to show it is not cut off at the left edge and is clear of `pin_flag` and `ball1`.
   - A PERFECT banner, `#meterp` at stage 1, and `#clubp` with the yardage dropped on a rough or sand lie.
   - Then widen the camera or tell the look lane the golfer is only 0.34% of the frame.

SCORE: 5.8
