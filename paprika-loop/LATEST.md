The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 15
**Did:** One change in `src/round.js` (line 82, `_introCleared` update): the banner and `sub` now clear whenever a new shot reaches meter stage 1 with any banner still up (was only banners with more than 1 s left), so "n YD TO PIN" from the last player's rest no longer sits over the next player's tee. Not run in the browser.
**Saw:** Nothing looked this session; no numbers, no `perf`.
**Next:** (1) 2-player stamped card and ROUND COMPLETE with real keys only. (2) Prove SO CLOSE! with a near-miss. (3) `sheet` of `clubp` on rough and sand. (4) Check the stale-banner change at FINN's tee after ISLA's rest.
**Open:** The stale-banner fix is untested; the 2-player card, final card, SO CLOSE! and clubp yardage drop are still unphotographed.

### Judge 15

**Judge 15: Isle Golf, hud-round lane**

I played a real-key 2-player start through ISLA's first shot, FINN's turn change, a scripted putt-out for both players, and the stamped card. I ran `perf` once. I did not play a full 9-hole round, or see SO CLOSE!, the final card, or a rough or sand `clubp` drop.

1. **Wider view and putt feedback (top priority): 7.**
   - At every look `holep` [16,14,336,148], `windp`, `clubp`, `hinter` and `tag` show 0 overlap and 0 cut off. The `sub` "FINN TO PLAY" sits left of the pin, clear of the ball.
   - `hudRound.lastCall` went "PERFECT!" then "BIRDIE!" for a 0.12-power putt, and `minPinD` read 0.12. The drop call is proven.
   - SO CLOSE! and the lip-out are still unseen, for the sixth session running.
2. **HUD in the Isle Blitz type: 8.**
   - `holep` carries hole, par, strokes and yards. `windp` is top right. `clubp` shows "LIE · TEE" and "LIE · FAIRWAY", with IRON then WEDGE highlighted.
   - `meterp` was not on screen in my looks.
   - The yardage drop on rough or sand is unseen.
3. **Banners never cover the target: 8.**
   - `banner` and `sub` stayed off the ball and pin in all three gameplay looks.
   - They do clear: "PERFECT!" was replaced by "65 YD TO PIN" when FINN reached aim (frame 42), so the stale-banner fix from iteration 15 works at that tee.
   - One fault: after ISLA's second turn, "65 YD TO PIN" shows at her aim with FINN's number, because the last rest banner is only cleared at meter stage 1.
4. **Stamped scorecard and final card: 7.**
   - The 2-player `card` is seen at last. "HOLE 1 · PEBBLE STEP" has a 9-hole grid with PAR, TOT and +/- columns. It has rows for ISLA and FINN in kit-colour dots, a circled "2" score each, and two stamps "ISLA BIRDIE" and "FINN BIRDIE". The footer reads "SPACE · NEXT HOLE" and the island shows blurred behind it.
   - The card appears one frame after the sink, with no pause to see the ball drop.
   - The ROUND COMPLETE final card is still unseen.
5. **Title and hot-seat: 8.**
   - `hudRound.order` was ["ISLA","FINN"]. The turn passed to FINN with `scores` rows for both, and the `tag` pill shows each player's colour.
   - Whether the lowest score tees off first on hole 2 is unseen.
6. **Sound: 8.**
   - Interact reported 14–26 sounds started per step, with no `SFX[k]` error.
   - I can't hear the surf, gulls, jingle or tick in headless.
7. **Juice: 7.**
   - `meter.label` and `banner` showed "PERFECT!" through the whole flight and settle phase, then "n YD TO PIN" at rest.
   - `observe().yardsToPin` stayed 118 during the settle, so it lags the banner's value.
   - The bunker hint is unseen.
8. **R replay and full round: 5.**
   - No real-key round has been photographed to ROUND COMPLETE, and I did not rerun `hud-round-full-round`. R is untested by me.
9. **No console errors: 9.**
   - Only the `toNonIndexed` warning appeared across the whole play.
10. **Saved checks hud-round-*: 7.**
    - They exist per earlier sessions, but I did not rerun them. The lead's steer asks for outcome-robust assertions on `lastCall`, and I did not see these.
11. **Looks as LOOK.md says: 8.**
    - The tilt-shift blur holds. Panels are cream on dark green and the type is Isle Blitz.
    - The look shows 28–29% grass and green 54–67%.
    - The golfer is 0.34–0.5% of the frame, which is the look lane's camera and not this lane's.
12. **Edit only the allowed files: 9.**
    - Iteration 15 touched `src/round.js` only.
13. **Keep as they are: 8.**
    - `aimDots`, `aimLanding`, sheep, `cup`, flyover and `window.__game` are all present.
14. **Faults: 7.**
    - The `card` div takes the clicks on only 6% of the canvas. It is a keyboard card, which is fine.
    - `perf` read 598 ms a frame on SwiftShader at host load 5.2, which is no signal (181 draw calls, 367k triangles). It is not scored.
    - The `ball2` and `ballShadow` objects are hidden or z-fight. They are ball-physics' and not scored.

**Next:**
1. **(asked again)** Prove SO CLOSE! and a lip-out. Use `state` to put the ball about 0.5 units from the cup, then `swing` with the putter, `power` ~0.1 and `accuracy` ±0.4. This misses by under a cup width. `look` right after, with `hudRound.lastCall` and `minPinD` traced. It should show "SO CLOSE!" in `banner` and the lip sound once, with `banner` clear of the ball and pin. Make the check assert any of SO CLOSE!, IN!, BIRDIE! or "n YD TO PIN" that matches `minPinD`.
2. **(asked again)** Take the `look` with `sheet` of `clubp` on `state` lie "rough" and "sand". `clubp` DRIVER, IRON and WEDGE yardages should read lower than the tee's 204/132/74. `hinter` should show the bunker hint matching the club. Add a `C` overhead moment, where `#tag` should hide. Also sync `observe().yardsToPin` with the banner during settle, and clear the settle banner "PERFECT!" when the ball lands rather than holding it through flight.
3. **Prove the full round and the final card.** From a fresh open with real keys only (Digit1 or Digit2, Space, Space to skip each flyover, Space ×3 per shot with `wait`s, Space on each card), run all 9 holes to `phase` "final". Take a `look` of ROUND COMPLETE with the winner and best round. Press Space to confirm the return to the title. Save it as `hud-round-full-round`, with `observe().scores` having 9 entries. Add a one-second hold on the sink moment before the card opens, so the ball drop and the jingle can be seen.

SCORE: 7.5
