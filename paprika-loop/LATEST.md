The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 16

**Judge 16: Isle Golf, hud-round lane**

I opened the page and played a real-key 1-player start. A 1.0-power driver shot landed in sand, and I took a look there. I then put the ball 0.5 units from the cup twice (putter, power 0.1) and took a look at each card. I ran `perf` once. I did not play a full round, replay with R, hot-seat, or a rough lie. I saw no console errors; only the `toNonIndexed` warning at open.

1. **Wider view and putt feedback (top priority): 6.**
   - In the sand look `holep` [16,14,336,127], `windp`, `clubp`, `hinter` and `tag` show 0 overlap and 0 cut off.
   - The drop call is proven again: `lastCall` went "BIRDIE!" and then "HOLE IN ONE!", with `minPinD` 0.12 and 0.13.
   - SO CLOSE! and the lip-out are still unseen, for the seventh session. Both putts, including the one with accuracy +0.4 and the one aimed 10° off, sank (`ball.mode` "sunk"), so my setup did not make a near miss.
   - A putt from 0.5 units now always drops. The check needs a ball further out, for example 1.5 to 2 units from the cup at power 0.07, before a lip-out can happen.
2. **HUD in the Isle Blitz type: 8.**
   - `holep` carries hole, par, strokes, yards and the round score. `windp` "2 MPH HEADWIND" is top right. `clubp` is bottom left.
   - Yardage by lie is now seen for sand: `clubp` reads "LIE · SAND" with IRON 79 YD and WEDGE 74 YD, against 132 and 74 on the tee. The `hinter` and `banner` "BUNKER" appeared. The rough drop is unseen.
   - `meterp` was not photographed at swing stage 1 or 2.
3. **Banners never cover the target: 8.**
   - "BUNKER" and the HOLE 1 banner stay off the ball and pin.
   - The iteration 16 fix for the wrong-number banner at the next player's aim is untested, because I only played one player.
4. **Stamped scorecard and final card: 7.**
   - The 1-player `card` is clean and stamped. "BIRDIE" is in teal with a circled 2, and "HOLE IN ONE" is in gold with a double circle on the 1. The TOT and +/- columns read 2 / -1 and 1 / -2.
   - The card opens on the frame the ball sinks, with no pause to see the drop.
   - ROUND COMPLETE is still unseen.
5. **Title and hot-seat: 7.**
   - The title starts a 1-player game with Digit1 and Space, and the flyover runs into aim by frame 37.
   - This session I did not see the hot-seat order or the kit colours.
6. **Sound: 8.**
   - 16–23 sounds started per step with no `SFX[k]` error. I can't hear the surf, gulls, jingle or tick in headless.
7. **Juice: 7.**
   - "BUNKER" shows on landing in sand, and "BIRDIE!" and "HOLE IN ONE!" show on the card.
   - After the driver shot, `minPinD` read 9 and `lastCall` read "BUNKER", with no "n YD TO PIN" call.
   - The PERFECT/NICE calls on the accuracy click were not seen this session.
8. **R replay and full round: 5.**
   - `replay` returned to the title. Frame 62 ended on the title, and `intro` then `aim` followed after Space.
   - I did not run a full round or save `hud-round-full-round` this session.
9. **No console errors: 9.**
10. **Saved checks hud-round-*: 6.**
    - I did not rerun them. The robust `lastCall` assertion the lead asked for is unconfirmed. Both near-miss attempts here dropped, so an exact SO CLOSE! assertion would fail.
11. **Looks as LOOK.md says: 8.**
    - Tilt-shift blur, cream on dark green panels, a stamped card with the island blurred behind it, and green 76% on the aim look.
    - The golfer is 0.34% of the frame, which is the look lane's camera.
12. **Edit only the allowed files: 9.**
13. **Keep as they are: 8.**
    - `aimDots`, `aimLanding`, `cup`, `sheep*`, the flyover and `window.__game` are all present.
14. **Faults: 7.**
    - The `card` div takes the clicks on 13% of the canvas, which is fine for a keyboard card.
    - `perf` read 701 ms a frame on SwiftShader at host load 2.6 (181 draw calls, 367k triangles). That is no signal and is not scored.
    - Iteration 16 left a banner-clear change unverified, and this session did not verify it either.

**Next:**
1. **(asked again)** Prove SO CLOSE! with a ball that really misses. `state` the ball 1.5 units from the cup on the green, then `swing` with the putter, `power` ≈ 0.08 and `accuracy` ±0.3, so it passes the cup at a speed it can't drop at. If it still drops, lower the SO CLOSE! trigger in `src/effects.js` or `src/round.js` so that a pass within about 0.6 units that doesn't sink counts. `look` right after with `hudRound.lastCall` and `minPinD` traced. `banner` should read "SO CLOSE!" and sit off the ball and pin, and `minPinD` should be under 0.6 with `ball.mode` not "sunk". Make `hud-round-sound` assert one of SO CLOSE!, IN!, BIRDIE!, PAR! or "n YD TO PIN" that matches `minPinD`.
2. **(asked again)** Prove the full round, the final card and hot-seat. From a fresh `open`, press Digit2, Space, then Space to skip each flyover, Space ×3 per shot with `wait`s, and Space on each card. Take a `look` of the 2-player card on hole 2 (to see who tees off first) and of ROUND COMPLETE with winner and best round, and `observe().scores` with 9 entries. Press Space on the final card to confirm the return to the title. Save it as `hud-round-full-round`. Add a one-second hold on the sink before the card opens, so the drop and the jingle can be seen.
3. Take a `look` with `sheet` of `clubp` on `state` lie "rough", beside the sand look from this session, with the `hinter` bunker hint matching the club, and a stage-1 and a stage-2 moment that show `meterp`. Also set `lastCall` to "n YD TO PIN" when a shot comes to rest not in sand, and sync `observe().yardsToPin` with it. After a driver shot at rest the `hudRound` state showed only "BUNKER" with `minPinD` 9. A rest in rough or fairway should show "n YD TO PIN".

SCORE: 7.3

## Iteration 17
**Did:** `src/round.js` `resolveShot`: SO CLOSE! now triggers for a putt that rests within 3 units after passing the cup within 0.6 (was 0.24); new `G.lastCall` is set to "SO CLOSE!" or "n YD TO PIN" at rest, and `hudRound.lastCall` returns `G.banner || G.lastCall`, so the rest call is still visible after the next aim's "BUNKER" banner. Syntax-checked only.
**Saw:** Did not open the page; no looks, no `perf`.
**Next:** (1) Prove SO CLOSE! with the ball 1.5 units out, putter, power ~0.08. (2) Full real-key round to ROUND COMPLETE, saved as hud-round-full-round, and hot-seat card look. (3) `clubp` rough sheet, `meterp` at swing stages 1 and 2; 1 s hold on sink before the card.
**Open:** The wider SO CLOSE! trigger is untested and may fire on putts that nearly stop at the cup; `G.lastCall` is never cleared between holes.
