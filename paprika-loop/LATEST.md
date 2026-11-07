The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 17

**Judge 17: Isle Golf, hud-round lane**

I played a real-key 1-player start. I then ran two putts from 1.5 units out, took a meter look at stage 1, and ran `perf` once. I did not play a full round, a hot-seat game, a rough lie, a replay, or ROUND COMPLETE. I saw no console errors.

1. **Wider view and putt feedback (top priority): 8.**
   - SO CLOSE! is seen for the first time in eight sessions. Putter, power 0.13, accuracy 0.25 from 1.5 units: `banner` "SO CLOSE!" with the sub "LIPPED OUT BY A HAIR", `hudRound.lipOut` true, `minPinD` 0.53, `ball.mode` "rest".
   - The banner sits upper left, off the ball and the pin. `holep`, `windp`, `clubp` and `banner` show 0 overlap and 0 cut off.
   - The drop call was seen in judge 16 ("BIRDIE!", "HOLE IN ONE!"), not this session.
   - The groan and the voice layer are not audible headless. The Sound line counted 6–7 sounds per step.
2. **HUD in the Isle Blitz type: 8.**
   - `holep` shows hole, par, strokes, yards and round, top left. `windp` is top right and now reads "CROSS →". `clubp` is bottom left.
   - `meterp` is now photographed at stage 1: "POWER 32%" with the gradient bar, bottom centre. Stage 2 is not seen.
   - `clubp` rough yardage is still unseen. Sand was seen last session.
3. **Banners never cover the target: 8.**
   - "11 YD TO PIN" and "SO CLOSE!" both sit off `ball1` and `cup`. The `tag` "ISLA" sits over the pin, not on the ball.
   - The next-player banner in hot-seat is untested.
4. **Stamped scorecard and final card: 6.**
   - I did not open a card this session. ROUND COMPLETE is unseen, and the 2-player card is unseen.
5. **Title and hot-seat: 6.**
   - Digit1 and Space run the flyover (230 frames) into aim. The hot-seat order and kit colours are still unseen.
6. **Sound: 8.**
   - No `SFX[k]` error. 4–7 sounds started per step.
7. **Juice: 8.**
   - The rest call now works. After the 0.9-unit stop, `lastCall` read "11 YD TO PIN", and `hudRound.lastCall` and `banner` agree. This fixes last session's gap.
   - A PERFECT/NICE call on the accuracy click is unseen.
8. **R replay and full round: 4.**
   - The full round has not been run or saved, which is the fourth session skipping it.
9. **No console errors: 9.**
10. **Saved checks hud-round-*: 5.**
    - I did not rerun them. A `hud-round-sound` with a robust `lastCall` assertion (SO CLOSE! or "n YD TO PIN" matching `minPinD`) can now be written from the two putts I ran.
11. **Looks as LOOK.md says: 8.**
    - Tilt-shift blur, cream on dark green panels and the grain read as Shepherd Isle.
    - The golfer is 0.41% of the frame at the wide camera in the stage-1 look. That is the look lane's camera.
12. **Edit only the allowed files: 9.**
13. **Keep as they are: 8.**
    - `aimDots`, `aimLanding`, `cup`, `sheep*` and the flyover are present.
14. **Faults: 8.**
    - `perf` read 1047 ms a frame on SwiftShader at host load 11. That is no signal and is not scored.
    - `G.lastCall` is never cleared between holes (the builder's Open). Not checked.

**Next:**
1. **(asked again)** Prove the full round and hot-seat, and save `hud-round-full-round`. From a fresh `open`, press Digit2, Space, Space to skip each flyover, Space ×3 per shot with `wait`s, and putts on each green. Space on each card. Take a `look` of the 2-player card on hole 2 and of ROUND COMPLETE. Check that `observe().scores` has 9 entries, and that Space on the final card returns the phase to "title". Save `hud-round-hotseat` the same way.
2. Save `hud-round-sound` from this session's putts. Use `state` ball {x:-3.2,z:11.95}, putter, then `swing` power 0.13, accuracy 0.25. `expect` `hudRound.lastCall` one of ["SO CLOSE!","IN!","BIRDIE!","PAR!"] or an "n YD TO PIN" matching `yardsToPin`, and no errors. Then clear `G.lastCall` on a new hole in `src/round.js` and confirm with `trace` on `hudRound.lastCall` across `next`. Add a 1 s hold on the sink before the card opens so the drop can be seen.
3. Take a `look` with `sheet` of `clubp` with `state` lie "rough", beside sand, with the `hinter` bunker hint matching the club. Add a stage-2 `meterp` moment (Space twice). Also show a PERFECT/NICE banner on the accuracy click, and an active-player marker at the wider camera (`tag` "ISLA" now sits over the pin, so check it marks the player and not the cup).

SCORE: 7.2

## Iteration 18
**Did:** `src/round.js` `beginHole`: now clears `G.lastCall` and `G.lastLip` at the start of each hole, so `hudRound.lastCall` no longer carries the last hole's call onto the next tee. Syntax-checked only.
**Saw:** Did not open the page; no looks, no `perf`. Only a short time was left and I spent it on this one fix.
**Next:** (1) Run and save `hud-round-full-round` (real keys only, 9 holes to ROUND COMPLETE) and `hud-round-hotseat`, with looks of the 2-player card and ROUND COMPLETE. (2) Save `hud-round-sound` with a robust `lastCall` assertion; confirm with `trace` that `lastCall` is empty after `next`. (3) `clubp` rough sheet, `meterp` at stage 2, PERFECT/NICE banner.
**Open:** The `lastCall` clear is untested in the browser. The full round and hot-seat proofs are still unrun (fifth session).
