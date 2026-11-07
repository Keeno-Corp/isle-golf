The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 3

Brief changed: top priority is now a "SO CLOSE!" lip-out call and a cup-drop sound with an "IN!" call. I'm finishing hole 9 first so I can save the round check, then I'll do that.

### Judge 3

**Judge verdict, session 3**

1. **TOP PRIORITY: HUD readable at the wider view, plus "SO CLOSE!" / lip-out and "IN!" calls with sound: 3.**
   - The HUD itself holds up. `#holep`, `#windp`, `#clubp` and `#hinter` don't overlap and none is cut off. `#banner` ("26 YD TO PIN") sits left of the pin_flag.
   - I saw no wider camera. `camera.fov` reads 29.98 and the golfer is 2.2% of the frame.
   - Grepping `src/` for "SO CLOSE", lipout, cupDrop, rattle and groan finds nothing, and `hudRound` has only `order`, `turn` and `lastCall`.
   - There is no lip-out call, no cup-drop sound and no "IN!" call, and no putt was proven. Iteration 3's note says only that the builder planned to do this.
2. **HUD in the Isle Blitz type: 8.**
   - `#holep` shows HOLE 1, PAR 3, STROKES 1, 26 YD and ROUND EVEN.
   - `#windp` shows "2 MPH CROSS →".
   - `#clubp` shows DRIVER 204, IRON 132, WEDGE 74 and PUTTER GREEN, with "LIE · GREEN".
   - `#meterp` was not seen at stage 1 or 2 this session, and the drop in yardage for rough or sand was still not looked at.
3. **Banners never cover the target: 7.** "26 YD TO PIN" is left of the pin and clear of the ball. It is still very large. `sub` is empty and the banner clear timing is still unproven.
4. **Stamped scorecard and final card: 5.** No card, birdie or bogey stamp, or ROUND COMPLETE look was taken this session. Earlier only a par stamp was seen.
5. **Title and hot-seat: 6.** One player ran from Space to aim with `phase` aim and `player` ISLA. The 2-player order, `hudRound.order`, and the title picture were not rechecked. The game-tests.json grep shows hud-round-hotseat at lines 281–282, so it exists but may be doubled like hud-round-hud.
6. **Sound: 6.** "18 started" after the swing, with no errors. The cup, lip-out and groan sounds are missing, and there is no saved hud-round-sound check.
7. **Juice: 6.** "26 YD TO PIN" appeared at rest, and `meter.label` reads "PERFECT!". The PERFECT banner and bunker hint were not seen on screen.
8. **R replay and full 9-hole round: 4.** There is no saved hud-round-full-round check (the grep found none), and Iteration 3's note says it was only intended.
9. **No console errors: 8.** None in this session's `interact`. The page logs a three.js `toNonIndexed` warning.
10. **Saved checks: 4.** hud-round-hud and hud-round-hotseat each appear twice. hud-round-full-round and hud-round-sound are missing.
11. **Looks as LOOK.md says: 7.** The tilt-shift diorama, cream-on-green panels, 72% green and 21% yellow all fit. The golfer is only 2.2% of the frame, and the ballShadow z-fight was not rechecked.
12. **Edit only the allowed files and COORDINATION.md rules: 7.** `hudRound` is present with its event keys. I did not audit the files changed this session.
13. **Keep what other lanes own: 8.** The golfer, aim dots, sheep, signs, pin and the narrow FOV are intact.

**Faults: 6.** There are no console errors. `perf` gave 2607 ms a frame, 180 draw calls and 367k triangles on SwiftShader with host load 3.2 on 8 cores. That says nothing about a real GPU. The `look` output lists no `Lighting:` or `Surfaces:` fault lines this session. The `Never visible` list is trees, fence and cliffs that are mostly outside the view.

**Next:**
1. **Build the top priority, which is still not there.**
   - In `src/round.js` and `src/sound.js`, detect a putt that stops within about 1.5 cup radii, or one that crosses the cup too fast. Raise `hudRound.lastCall` "SO CLOSE!" with a groan sound and emit `hud-round:lipout`.
   - On a drop, play a cup rattle-drop sound with an "IN!" call, or a birdie/par call.
   - Keep the banner away from `pin_flag` and the ball at the wider camera.
   - The one call that shows it done is `interact` with `look: true`: `swing` putter with a power that misses the cup narrowly (use `meter.needPower` 0.272), then trace `hudRound.lastCall`, and a second putt that drops. The look shows the banner clear of the pin, and the `Sound` line lists the new sounds.
2. **Save the missing and doubled checks.** Save hud-round-sound (lip-out and drop) and hud-round-full-round with real keys only (Space, arrows, waits). Dedupe hud-round-hud and hud-round-hotseat. The one `test` call that shows it done lists every hud-round-* once and the 4 originals passing.
3. **Take the pictures never taken.** These are the ROUND COMPLETE card (winner, best round, new best, Space back to the title), a 2-player stamped card, a PERFECT banner on screen, and the meter at stage 1 and 2 in `#meterp`. Also make the "n YD TO PIN" banner smaller, since it is the largest object near the pin.

SCORE: 6.0
