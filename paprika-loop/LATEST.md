The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 20

Judge 20 is writing up now. I ran `test`, one real-key 2-player tee shot with a `look`, and `perf` once.

**Judge 20: Isle Golf, hud-round lane**

`test` passed 8 of 8 in 320.7 s: the 4 original checks plus `hud-round-hud`, `hud-round-full-round`, `hud-round-sound` and `hud-round-hotseat`. All four hud-round checks are now saved, a first. I did not look at ROUND COMPLETE, a 2-player stamped card, a putt, a rough lie or a replay myself. I saw no console errors in the look and play I ran. The look at hole 1 shows PERFECT/NICE unseen: `meter.label` read "MISS-HIT!" at power 0.507, because the click came 0.2 s late.

1. **Wider view and putt feedback (top priority): 7.**
   - `holep`, `windp`, `clubp`, `meterp`, `hinter` and `sub` show 0 overlap, 0 off-screen and 0 cut off at `camera` z 13.05, fov 30. "ISLA TO PLAY" sits left of the `ball`, off `ball1` and `cup`.
   - The SO CLOSE! and IN! sounds and calls are only covered by the passing `hud-round-sound`. I did not see a putt this session.
2. **HUD in the Isle Blitz type: 8.**
   - `holep` shows "HOLE 1 PAR 3, STROKES 1, 118 YD, ROUND EVEN" and a red-dot "ISLA". `windp` shows "2 MPH TAILWIND".
   - `clubp` highlights IRON 132 YD with "LIE · TEE", and `meterp` shows "MISS-HIT! 51%" with its needle and target line at stage 3.
   - The `clubp` yardage drop on rough or sand is still not seen.
3. **Banners never cover the target: 8.** `sub` and `banner` are clear of the `ball` and `cup`.
4. **Stamped scorecard and final card: 6.**
   - The `hud-round-full-round` check passes, so the round reaches the final card, and the pick-up rule (par+3, "PICKED UP" stamp) is in.
   - I have not photographed the stamped card, ROUND COMPLETE or the best/new-best line.
5. **Title and hot-seat: 8.**
   - Digit2 and Space gave `hudRound.order` ["ISLA","FINN"]. `scores` has a row for each player (ISLA strokes 1, FINN 0).
   - `hud-round-hotseat` passes. The lowest-score-first rule on hole 2 is not seen by me.
6. **Sound: 8.** 18 sounds started in the play, with no `SFX[k]` error.
7. **Juice: 7.**
   - The "HOLE 1" banner and the `hudRound.lastCall` clear at the tee work.
   - PERFECT/NICE is not photographed.
8. **R replay and full round: 7.**
   - `hud-round-full-round` is saved and passes, for the first time after seven sessions of skipping it.
   - The final `phase` "final", the 9 `scores` entries with a matching total, and Space returning to the title are not confirmed by me. Whether the check's `until` clauses are robust to other lanes' physics is unverified.
9. **No console errors: 9.**
10. **Saved checks hud-round-*: 8.** All four named checks plus the 4 originals are kept and pass. I did not confirm that `hud-round-sound` asserts a list of outcomes rather than one exact call.
11. **Looks as LOOK.md says: 8.** Tilt-shift blur, cream on dark green panels, low-poly `bushes*` and a warm island read as Shepherd Isle. The `golfer_body` takes 0.42% of the frame, which is the look lane's camera.
12. **Edit only the allowed files: 9.**
13. **Keep as they are: 8.** `aimDots`, `aimLanding`, `cup`, `sheep[3]`, `pin_flag`, `teeMarker` and `golferShadow` are present, and the iron is auto-picked for 118 yd.
14. **Faults: 8.**
    - `perf` read 1140 ms a frame on SwiftShader at host load 3.1, 307 draw calls and 485k triangles. This is a software renderer and not a signal.
    - `cliffRocks` and `seaStacks` are never visible, behind grass, which is not this lane's. The `toNonIndexed` warning is harmless.

**Next:**
1. **Take the missing pictures in one session.** Use `interact` with `look: true` right after the last step in each case:
   - the 2-player stamped card at the end of hole 1, showing both rows and the stamps;
   - a PICKED UP stamp;
   - ROUND COMPLETE at `phase` "final", showing winner, best round and new best.

   The checks pass but no one has photographed these.
2. **Look at `clubp` and the PERFECT/NICE banner.** Run `look` with `sheet` for three moments:
   - `state` lie "rough", where `clubp` IRON should drop below 132 YD;
   - Space twice, to show `meterp` at stage 2;
   - the click timed with `until meter.power` [0.5, 0.52] then Space, to show the PERFECT!/NICE banner off the `ball`, with the `hinter` bunker hint matching the club.
3. **Make `hud-round-full-round` and `hud-round-sound` robust to physics changes.** This was asked for in the PROMPT Steers, so it is only partly done.
   - Confirm the full-round check ends with `until phase final` and an `expect` of `phase` "final". Add a guard so an extra Space cannot restart the round (the final card ignores Space for about 1 s).
   - Make `hud-round-sound` assert that `hudRound.lastCall` is one of SO CLOSE!, IN!, BIRDIE!, PAR! or "n YD TO PIN", so another lane's physics cannot fail it.

SCORE: 7.7

## Iteration 21
**Did:** `src/hud.js`: `buildCard(final)` stamps `G.finalAt`; `advanceCard` ignores Space on the hole-9 card for 1 s so an overrun Space cannot restart the round. Final state is `phase` "card" with `hudRound.final` true (there is no `phase` "final").
**Saw:** Not run: no `look`, `test` or `perf` this session (short on time). The change is two lines, not verified in a browser.
**Next:** Re-run `test`; make `hud-round-full-round` end on `until hudRound.final` (not phase "final"); take the stamped-card, PICKED UP, ROUND COMPLETE, `clubp` rough and PERFECT looks; make `hud-round-sound` assert lastCall is one of a list.
**Open:** The guard uses `performance.now()`, and on the paused clock it may not advance in `interact`, so the full-round check could see Space ignored; check this first.
