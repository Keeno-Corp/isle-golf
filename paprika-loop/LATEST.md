The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 1

**Judge verdict, session 1**

1. **HUD in the Isle Blitz type: 8.** `#holep` (top left) shows hole, par, strokes, yards and the player dot, and `#windp` (top right) shows "2 MPH TAILWIND". `#clubp` (bottom left) lists DRIVER 204, IRON 132, WEDGE 74 and PUTTER GREEN. `#meterp` shows "POWER 33%" at stage 1 and "MISS-HIT! 65%" at stage 2. The HUD is cream on dark green and no panel overlaps another. The yardage dropping in rough or sand was not looked at. The meter fades out in the stage-2 look and is hard to read there.
2. **Banners never cover the target: 7.** `#banner` and `#sub` sit at left 27% / top 26% and clear the pin in both the aim view and the swing view. The "HOLE 1 / PAR 3 · 118 YD · PEBBLE STEP" banner was still up at stage 1, stage 2 and the start of flight, so it clears late. The "67 YD TO PIN" banner did appear at rest, but FINN's "TO PLAY" showed beside it.
3. **Stamped scorecard and final card: 4.** Not looked at this session. The builder's notes say the final card and the Space return to title work, but no card picture has been taken.
4. **Title and hot-seat: 6.** `start` with 2 players gave `hudRound.order` ISLA, FINN, and the player dot changes colour (red ISLA, blue FINN). Order on hole 2 by last score was not checked. The title picture was not taken.
5. **Sound: 7.** `interact` reported "Sound: 10 started" for the swing, and there were no console errors. The new `SFX` entries (gull, surf, birdie, meterTick, perfect, nice, pin) are in `sound.js`. A saved check named hud-round-sound would prove it, and none exists.
6. **Juice: 7.** The "67 YD TO PIN" banner and `hudRound.lastCall` both updated when the ball came to rest. PERFECT/NICE was not seen, because my click gave MISS-HIT. The bunker hint was not seen.
7. **R replay and full 9-hole round: 5.** The builder's bot reached ROUND COMPLETE with 9 scores, but no saved check exists (hud-round-full-round is missing). I did not replay it.
8. **No console errors: 8.** None came up in about 6 calls from title to rest. The ballShadow1/ballShadow2 z-fight at y = 4.49 is still flagged by `look`'s Surfaces: line.
9. **Saved checks: 3.** `game-tests.json` holds only hud-round-hud, and its name appears twice. The full-round, hotseat and sound checks are not there. Whether the 4 original checks are intact was not verified.
10. **Looks as LOOK.md says: 7.** The tilt-shift diorama, the cream-on-green HUD and the sea, cliffs, pond and lighthouse all read well. Hue split is green 64% and yellow 21%. The golfer is only 0.015% of the aim view, which `look` flagged, and ballShadow1 is hidden behind ball2.
11. **Edit only the allowed files, COORDINATION.md rules: 7.** `lanes/hud-round.md` and the `hudRound` observe key exist. The files-touched list and the hook use were not audited.
12. **Keep what other lanes own: 8.** Camera, flyover, aim dots, the sheep (sheep* ×9) and the `signs` all look intact.

**Faults: 6.** `perf` gives 1169 ms a frame, 307 draw calls and 485,787 triangles, but it ran on SwiftShader with no GPU, so it is no signal. The z-fight is the one real fault.

**Next:**
1. Save the three missing checks, each with `expect` values, then re-run `test`. Use hud-round-full-round (`until` steps through 9 holes, expect the final-card phase, `scores` length 9 and the total), hud-round-hotseat (2 players, expect `hudRound.order` after a hole) and hud-round-sound. Dedupe the doubled hud-round-hud entry. The `test` call shows all checks passing, with the 4 original ones kept.
2. Take the pictures that were never taken: the stamped scorecard after hole 1 with 2 players and the "ROUND COMPLETE" final card. Use `interact` with `look: true` at the card phase and read the stamps and rows. Also get a PERFECT or NICE call on screen, with `perfectAt` read from `meter` and Space pressed at that frame, to confirm the banner shows and clears.
3. Clear the "HOLE n" intro banner when the swing starts (hide `#banner` and `#sub` at meter stage 1), and move the golfer or `#meterp` so the meter stays readable at stage 2. Check the picture with `look` at stage 2, which should show no banner and a clear meter. Also give ballShadow2 `polygonOffset` or a 0.001 y offset so the Surfaces: line is gone.

SCORE: 6.3

## Iteration 2
**Did** src/round.js: an addUpdate hook clears `#banner`/`#sub` (ST.bannerT/subT = 0) the first frame meter stage becomes 1, so the HOLE intro banner no longer lingers over the swing. Left src/balls.js (ballShadow z-fight) alone: not an allowed file for this lane.
**Saw** Not run in the browser this session (syntax checked only); no look/test taken.
**Next** Run `test` to confirm all checks still pass; save hud-round-full-round, -hotseat, -sound with expect values and dedupe hud-round-hud; take looks of the stamped card and the ROUND COMPLETE card; read a PERFECT call from perfectAt; ask the balls lane for the ballShadow2 polygonOffset.
**Open** Banner clear untested; meter readability at stage 2 unchanged; the three checks and card pictures still missing.
