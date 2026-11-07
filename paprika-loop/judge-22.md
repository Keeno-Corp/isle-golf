**Judge 22: Isle Golf, hud-round lane**

`test` passed 8 of 8 in 323 s, so the Iteration 22 one-line turn-change clear broke nothing. The timed-out check from Iteration 22's Open was not a hang: every check finished, `hud-round-full-round` and `hud-round-sound` included. The time is software rendering. I took one 3-cell `sheet` (2-player tee, a rough-lie attempt, `meterp` at stage 2) and ran `perf` once. I took no look at a putt, a stamped card, PICKED UP, ROUND COMPLETE or the PERFECT banner, and the sheet showed no console errors.

1. **Wider view and putt feedback (top priority): 7.**
   - `holep`, `windp`, `sub` ("ISLA TO PLAY"), `clubp` and `hinter` are legible and clear of the `ball` and `cup` at the wide camera.
   - SO CLOSE! and IN! are covered only by `hud-round-sound`, which passes. I saw no putt.
   - The turn-change clear looks right: the 2-player tee frame shows "ISLA TO PLAY" and no stale yardage. I did not read `hudRound.lastCall` for FINN's turn.
2. **HUD in the Isle Blitz type: 7.**
   - `holep` reads "HOLE 1 PAR 3, STROKES 0, 118 YD, ROUND EVEN, PEBBLE STEP" with an ISLA dot. `windp` reads "2 MPH". `clubp` lists driver, iron, wedge and putter with "LIE · TEE".
   - `meterp` at the second click reads "SNAP 33%", so stage 2 is seen. The `meterp` header and `clubp` text are tiny at 1280×800.
   - The `clubp` yardage drop on rough or sand is still not seen. My `state` {lie:"rough"} did not change the lie (the panel still said TEE), so that moment proved nothing.
3. **Banners never cover the target: 8.** `sub` and `banner` are clear of the `ball`, `cup` and `pin_flag` in all three frames.
4. **Stamped scorecard and final card: 6.** The full-round check reaches the final card, but I have not seen the stamps, the PICKED UP stamp or the best and new-best line.
5. **Title and hot-seat: 8.** Two players show an ISLA marker and "ISLA TO PLAY" on the tee, and the hot-seat check passes. I did not see the lowest-score-first rule on hole 2.
6. **Sound: 8.** `hud-round-sound` passes. This session I read no Sound line and saw no `SFX[k]` error.
7. **Juice: 6.** "ISLA TO PLAY" and `meterp` show. The PERFECT/NICE banner, the "x YD TO PIN" line and the bunker hint are still not photographed.
8. **R replay and full round: 8.** `hud-round-full-round` passes in the 323 s run, with the pick-up rule in place.
9. **No console errors: 9.**
10. **Saved checks hud-round-*: 8.** Four hud-round checks and the 4 originals all pass. I have not confirmed that `hud-round-sound` asserts a list of outcomes, or that the full round ends on `until hudRound.final`.
11. **Looks as LOOK.md says: 8.** Tilt-shift blur, cream on dark green panels, low-poly trees and a warm island with a teal sea. The `golferShadow` and the golfer are small, at 0.35% of the frame, which is the camera lane's.
12. **Edit only the allowed files: 9.**
13. **Keep as they are: 8.** The `cup`, `pin_flag`, `sheep`, `aimDots` and `teeMarker` are present, and the iron is auto-picked for 118 yd.
14. **Faults: 8.** `perf` read 818 ms a frame on SwiftShader (181 draw calls, 367k triangles). That is a software renderer, so it is not a signal. The `toNonIndexed` warning is harmless.

**Next:**
1. **(asked again) Take the stamped-card, PICKED UP and ROUND COMPLETE pictures.** This has gone unseen for about six sessions.
   - Use `interact` with `look: true`, and use real keys or the `swing` action rather than `setState`.
   - Play `start` players 2, then `swing` power 0.9 repeatedly with `until phase card`. The call shows it done when the picture has both player rows and the stamps.
   - Then `swing` power 0.05 until strokes reach par+3, with `until phase card` and `look: true`. It shows the PICKED UP stamp.
   - Last, `until hudRound.final true` with `look: true`. It shows winner, best round and new best.
2. **(asked again) Show the `clubp` yardage drop and the PERFECT banner.**
   - Reach a rough lie with a real shot (`swing` power 0.3, accuracy 0.8, then `until phase aim`) and `look` at `clubp`. IRON should then read below 132 YD with "LIE · ROUGH".
   - Run `interact` with `until meter.power [0.5,0.52]` then Space, with `look: true`. It shows the PERFECT!/NICE banner off the `ball`.
3. **Make the checks outcome-robust and sturdier.**
   - Make `hud-round-full-round` end on `until hudRound.final` with an `expect`.
   - Make `hud-round-sound` assert that `hudRound.lastCall` is one of SO CLOSE!, IN!, BIRDIE!, PAR! or "n YD TO PIN", as the lane lead asked.
   - The whole `test` run now takes 323 s. Shorten the full-round check, or the hook's 170 s limit will keep tripping.
   - Optionally, raise the font size of the `clubp` and `meterp` labels so they read at 1280×800.

SCORE: 7.6
