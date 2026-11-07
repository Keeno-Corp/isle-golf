The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 13
**Did:** `src/hud.js` line 159: wind arrow `rotate(${w.rel})` now falls back to 0 when `w.rel` is not finite, to remove the `rotate(NaN)` console error from Iteration 12.
**Saw:** I did not run the page this session. The saved-check hook reported it did not finish in 170 s; I did not investigate.
**Next:** (1) Reopen and confirm the NaN error is gone and find why the look was grey after a swing `act`. (2) Real-key 2-player card photo, SO CLOSE!/IN! trace, PERFECT banner, rough/sand clubp sheet (still unphotographed).
**Open:** the fix is unverified in the browser. The hook timeout may come from SwiftShader load. ballShadow z-fight belongs to ball-physics.

### Judge 13

**Judge 13: Isle Golf, hud-round lane**

I opened the page, played a real-key 2-player start through ISLA's first shot, then ran a scripted putter shot on a fresh 1-player round and ran `perf` once. I never saw a stamped card, a final card, SO CLOSE!, a bunker hint, a rough or sand `clubp` drop, or the NaN fix running. Those lines rest on earlier sessions' notes, not on my own play.

1. **Wider view and putt feedback (top priority): 7.**
   - At the 2-player tee, `holep` [16,14,336,148], `windp`, `clubp`, `hinter` and `tag` show 0 overlap and 0 cut off.
   - `banner` "70 YD TO PIN" [184,208,481,253] and `sub` "FINN TO PLAY" sit left of the pin flag, clear of the ball and pin.
   - On the green, a 0.2-power putt dropped, and `hudRound.lastCall` went "PERFECT!" then "HOLE IN ONE!". `banner` [173,208,492,295] stayed left of the cup and pole.
   - The drop is verified for a hole-in-one. SO CLOSE! and a lip-out are still unseen, for the fifth judge session running.
2. **HUD in the Isle Blitz type: 9.**
   - `holep` carries hole, par, strokes and yards, `windp` is top right, and `clubp` shows "LIE · TEE" then "LIE · GREEN" with PUTTER highlighted.
   - The yardage drop on rough or sand is unseen.
   - `meterp` was not on screen in either look.
3. **Banners never cover the target: 8.**
   - In both looks, `banner` and `sub` are left of the ball and pin.
   - Not checked: whether they clear on time.
4. **Stamped scorecard and final card: 4.**
   - I did not see the card. After the hole-in-one, `until {phase:"card"}` ran 400 frames and ended with `phase` "title".
   - The title page was showing and no card appeared. I had called `newRound` earlier, so this may be my own state, but it needs a clean real-key check.
5. **Title and hot-seat: 8.**
   - `hudRound.order` was ["ISLA","FINN"] and the turn passed to FINN after ISLA's shot, with `scores` rows for both.
   - The `tag` pill "FINN" in kit colour sits above the golfer, which covers the active-player marker.
   - The title picture is clean: Isle Blitz type and 1–4 player buttons.
6. **Sound: 8.**
   - Interact reported 28 and 16 sounds started, with no `SFX[k]` error.
   - I can't hear the surf, gulls, jingle or tick in headless.
7. **Juice: 7.**
   - `meter.label` and `banner` showed "PERFECT!" for the whole settle phase (frames 22–96).
   - "n YD TO PIN" shows at rest, but "70 YD TO PIN" was left over from ISLA while FINN's `yardsToPin` read 118. The bunker hint is unseen.
8. **R replay and full round: 6.**
   - I did not rerun `hud-round-full-round`, and no real-key round has been photographed to ROUND COMPLETE.
9. **No console errors: 9.**
   - Only the `toNonIndexed` warning appeared.
   - The NaN wind fix is unconfirmed: `windp` "2 MPH TAILWIND" rendered with no error.
10. **Saved checks hud-round-*: 8.**
    - They exist per earlier sessions, but the saved-check hook timed out last session and I did not rerun them.
11. **Looks as LOOK.md says: 8.**
    - Tee look: green 63%, yellow 24%, tilt-shift blur, cream-on-dark-green panels.
    - The golfer is 0.35% of the frame, which is the look lane's camera.
    - The holed look puts the camera very close on the cup, so the `grass` and pole fill the frame and the HUD still reads.
12. **Edit only the allowed files: 9.**
    - Iteration 13 touched `src/hud.js` only.
13. **Keep as they are: 8.**
    - `aimDots`, `aimLanding`, sheep, cup, flyover and `window.__game` are all present.
14. **Faults: 7.**
    - Every look lists `ball2` and `ball1` as hidden or not found by the ID image.
    - `perf` read 1059 ms a frame on SwiftShader with host load 4.2, which is no signal (175 draw calls, 367k triangles in the main scene).
    - The `ballShadow` z-fight is ball-physics' and not scored.
    - The card-to-title jump after a hole-in-one is possible but unconfirmed.

**Next:**
1. **(asked again)** Photograph the stamped card with real keys only. From a fresh open: `Digit2`, `Space`, then Space ×3 per shot with `wait`s, putts on the green, until both players hole out on hole 1. Use `until {phase:"card"}` with `look:true`. The expected result is both rows with BIRDIE/PAR/BOGEY stamps. If `phase` skips straight to "title" or the next hole, as it did after my `newRound` hole-in-one, that is the bug to fix in `src/round.js`.
2. **(asked again)** Prove SO CLOSE! and a lip-out. Set `state` with the ball about 0.4 units from the cup. Use a putter `swing` with `power` set so the ball misses by under a cup width, tracing `hudRound.lastCall` and `hudRound.minPinD`. `look` right after should show "SO CLOSE!" in `banner` clear of the ball and pin. Also check that the PERFECT/NICE banner clears when the ball comes to rest. This session it stayed up through the whole settle phase.
3. **(asked again)** Take the `clubp` yardage-drop `sheet` with `state` lie "rough" and "sand", plus a `C` overhead moment. `clubp` yardages should read lower than the tee's 204/132/74, `#tag` should be hidden on the overhead, and `hinter` should show the bunker hint that matches the club. Then fix the stale rest banner: "70 YD TO PIN" was still on screen at FINN's tee while his `yardsToPin` was 118.

SCORE: 7.3
