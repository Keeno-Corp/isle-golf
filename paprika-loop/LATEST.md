The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 21

Session 21 is judged: I've run `test` and one real-key 2-player tee shot with a `look`, and I ran `perf` once. I'm writing the verdict now.

**Judge 21: Isle Golf, hud-round lane**

`test` passed 8 of 8 in 276 s, so the Iteration 21 hold on the final card did not break `hud-round-full-round`. I took no look at ROUND COMPLETE, a stamped card, a putt, a rough lie or the PERFECT/NICE banner. The `look` after Digit2, Space and a swing showed no console errors.

1. **Wider view and putt feedback (top priority): 7.**
   - `holep`, `windp`, `sub`, `clubp`, `hinter` and `tag` show 0 overlap, 0 off-screen and 0 cut off at `camera` z 13.1, fov 30. "FINN TO PLAY" (`sub`) sits left of the `ball` and well off the `cup`.
   - SO CLOSE! and IN! are covered only by `hud-round-sound`, which passes. I saw no putt myself.
   - `hudRound.lastCall` still reads "16 YD TO PIN" while FINN stands on the tee. It carries over from ISLA's shot and is not cleared when the turn changes.
2. **HUD in the Isle Blitz type: 8.**
   - `holep` shows "HOLE 1 PAR 3, STROKES 0, 118 YD, ROUND EVEN, PEBBLE STEP" and a blue-dot "FINN". `windp` shows "2 MPH TAILWIND".
   - `clubp` highlights IRON 132 YD with "LIE · TEE".
   - I have not seen the yardage drop on rough or sand, or `meterp` at stage 1 or 2.
3. **Banners never cover the target: 8.** `sub` and `banner` are clear of the `ball` and `cup`.
4. **Stamped scorecard and final card: 6.**
   - The full-round check reaches the final card, so it exists.
   - I still have not seen the stamps, the PICKED UP stamp or the best/new-best line.
5. **Title and hot-seat: 8.**
   - `hudRound.order` is ["ISLA","FINN"] and `scores` has a row for each player.
   - FINN's kit colour (the blue dot) shows in `holep` and `tag`.
   - I did not see the lowest-score-first rule on hole 2.
6. **Sound: 8.** 18 sounds started in the play, with no `SFX[k]` error.
7. **Juice: 7.** The "FINN TO PLAY" call and the tee-off clear work. PERFECT/NICE and the bunker hint are not photographed.
8. **R replay and full round: 8.** The check passes and the Space guard did not break it. Iteration 21's Open asked whether `performance.now()` stalls on the paused clock. The pass suggests it does not, but I have not read the check's last steps.
9. **No console errors: 9.**
10. **Saved checks hud-round-*: 8.** All four hud-round checks and the 4 originals pass. I have not confirmed that `hud-round-sound` asserts a list of outcomes.
11. **Looks as LOOK.md says: 8.** Tilt-shift blur, cream on dark green panels, low-poly `bushes*` and trees, and a warm island with a teal sea. The `golfer_body` takes only 0.34% of the frame, which is the look lane's camera.
12. **Edit only the allowed files: 9.**
13. **Keep as they are: 8.** `aimDots`, `aimLanding`, `cup`, `sheep[3]`, `pin_flag`, `teeMarker` and `golferShadow` are present, and the iron is auto-picked for 118 yd.
14. **Faults: 8.**
    - `perf` read 765 ms a frame on SwiftShader at host load 5.1, with 181 draw calls and 367k triangles. That is a software renderer, so it is no signal.
    - `cliffRocks` and `seaStacks` are never visible, behind grass and bushes, which is not this lane's. The `toNonIndexed` warning is harmless.

**Next:**
1. **(asked again) Take the missing pictures.** This has now gone unseen for several sessions. Use `interact` with `look: true` after the last step in each case. Each call shows the item done when its picture shows the item:
   - the 2-player stamped card at the end of hole 1, showing both rows and the stamps;
   - a PICKED UP stamp, from a real run of 4 strokes on a par 1 hole, or use the `swing` action with power 0.1 until par+3;
   - ROUND COMPLETE with `hudRound.final` true, showing winner, best round and new best.
2. **(asked again) Look at `clubp` and the banners.** Use `look` with `sheet`: one moment with `state` lie "rough", where `clubp` IRON should drop below 132 YD, and one with Space twice, to show `meterp` at stage 2. Then run `interact` with `until meter.power` in [0.5, 0.52] and Space, to show the PERFECT!/NICE banner off the `ball`.
3. **Clear `hudRound.lastCall` and `banner` on turn change.** FINN's turn on the tee still shows ISLA's "16 YD TO PIN". Reset both in `src/hud.js` when `turn` changes. A `look` with `sample` at the `banner` position then shows no stale distance. Also make `hud-round-full-round` end with `until hudRound.final` and an `expect`, and `hud-round-sound` assert that `lastCall` is one of a list: SO CLOSE!, IN!, BIRDIE!, PAR! or "n YD TO PIN".

SCORE: 7.8

## Iteration 22
**Did:** `src/round.js` (turn change in the next-shot routine, ~line 74): when the next player differs and there is more than one player, `G.banner` and `G.lastCall` are now cleared along with the banner fade, so `hudRound.lastCall` no longer shows ISLA's "16 YD TO PIN" on FINN's tee shot.
**Saw:** No `look`, `test` or `perf` run this session. A hook reported that a saved check did not finish within 170 s; I did not find out which one or why. The edit is one line and has not been checked in a browser.
**Next:** Run `test` and find the check that timed out. Take the missing pictures: the 2-player stamped card, PICKED UP, ROUND COMPLETE, `clubp` on rough, `meterp` at stage 2 and the PERFECT banner. Make `hud-round-full-round` end on `until hudRound.final`, and make `hud-round-sound` assert `lastCall` is one of a list.
**Open:** The timed-out check may be a real hang or just slow software rendering. Check this first.
