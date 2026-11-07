The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 18

**Judge 18: Isle Golf, hud-round lane**

I opened the page and played a real-key 2-player start: Digit2, Space, then Space×3 for ISLA's tee shot. I took one look at FINN's turn and ran `perf` once. I did not play a full round, a card, ROUND COMPLETE, a rough lie, a replay or a putt. I saw no console errors. The builder's `lastCall` clear is untested: this session only reached hole 1.

1. **Wider view and putt feedback (top priority): 7.**
   - No putt was played this session. The wider camera at `camera` z 13.1, fov 30 keeps `holep`, `windp`, `clubp`, `hinter` and the `sub` banner at 0 overlap and 0 cut off.
   - The `sub` "FINN TO PLAY" and `banner` "52 YD TO PIN" sit left of the `ball`, off `ball1` and `cup`.
   - SO CLOSE! was seen in judge 17. IN!/BIRDIE! was seen in judge 16.
2. **HUD in the Isle Blitz type: 8.**
   - `holep` shows "HOLE 1 PAR 3, STROKES 0, 118 YD, ROUND EVEN, PEBBLE STEP" and a blue-dot "FINN", top left. `windp` "2 MPH TAILWIND" is top right. `clubp` is bottom left with IRON highlighted and "LIE · TEE".
   - `meterp` and the `clubp` rough yardage were not seen.
3. **Banners never cover the target: 8.** "FINN TO PLAY" is clear of the ball and pin.
4. **Stamped scorecard and final card: 5.** No card was opened this session, and ROUND COMPLETE and the 2-player card are still unseen.
5. **Title and hot-seat: 8.**
   - Digit2 and Space gave `players` 2 with `hudRound.order` ["ISLA","FINN"]. After ISLA's shot, `hudRound.turn` is "FINN", with `scores` ISLA strokes 1 and FINN strokes 0.
   - The `tag` "FINN" has a blue kit dot and sits over the golfer, not the cup. FINN is the farther-back ball, but I did not check the farthest-ball rule.
   - I did not see the lowest-score-tees-first rule on a second hole.
6. **Sound: 8.** 26 sounds started across the steps, with no `SFX[k]` error.
7. **Juice: 7.**
   - The yardage call "52 YD TO PIN" is seen after ISLA's ball rested.
   - PERFECT/NICE on the click is unseen. `meter.label` reads "PERFECT!" at `perfectAt` 0.377, but no banner was photographed.
8. **R replay and full round: 3.** The full round is unrun and `hud-round-full-round` is unsaved, now the fifth session skipping it. Replay is unseen.
9. **No console errors: 9.**
10. **Saved checks hud-round-*: 4.** I did not rerun or save any. Judge 17's note that `hud-round-sound` needs a robust `lastCall` assertion still stands.
11. **Looks as LOOK.md says: 8.**
    - Tilt-shift blur, cream on dark green panels and low-poly bushes read as Shepherd Isle.
    - The golfer is 0.34% of the frame, and `look` says the camera shows little of the subject. That is the look lane's camera.
12. **Edit only the allowed files: 9.**
13. **Keep as they are: 8.**
    - `aimDots`, `aimLanding`, `cup`, `sheep*`, `pin_flag` and `teeMarker` are present.
    - The picture shows a tee box with an iron auto-picked for 118 yards.
14. **Faults: 8.**
    - `perf` read 1286 ms a frame on SwiftShader at host load 10.4, which is not a signal and is not scored.
    - The look reports `cliffRocks` and `seaStacks` as never visible (behind grass and bushes). I did not score them.

**Next:**
1. **(asked again)** Prove the full round and save `hud-round-full-round`: from a fresh `open`, press Digit1, Space, Space to skip each flyover, Space×3 per shot with waits, and putts on each green, with Space on each card. The saved check must use real keys only. When it is done, the final `interact` shows `phase` "final", `scores` with 9 entries and a matching total, and one more Space gives `phase` "title". Take a `look` of ROUND COMPLETE in the same call.
2. **(asked again)** Save `hud-round-hotseat` from this session's opening keys: Digit2, Space, Space, Space×3, then `expect` `hudRound.turn` "FINN" and `players` 2. Continue to the end of hole 1 and `look` at the 2-player stamped card, with both rows and the stamps. Then save `hud-round-sound` with an `expect` on `hudRound.lastCall` as a list of SO CLOSE!, IN!, BIRDIE!, PAR! or an "n YD TO PIN" matching `yardsToPin`. Add a `trace` of `hudRound.lastCall` across the next hole, which should show it empty at the tee (the iteration 18 clear, still unverified).
3. **(asked again)** Run `look` with `sheet` for three moments: `clubp` with `state` lie "rough" (the yardage should drop), `meterp` at stage 2 (Space twice), and a PERFECT/NICE banner right after the accuracy click, with the `hinter` bunker hint matching the club.

SCORE: 6.8

## The request changed

paprika-loop/PROMPT.md changed before session 20; the Next lists above were written before it. Changed lines:
+ **Steer (lane lead, trial merge #2):** on the merged build with the other lanes' branches 7 of 8 checks pass; hud-round-full-round fails (stuck in phase aim on hole 7) because its fixed Space/wait script depends on this branch's exact ball physics, which other lanes are changing. Make it robust: (a) add an arcade pick-up rule in src/round.js: a player who reaches par+3 strokes without holing picks up (card shows the capped score, banner 'PICKED UP'), so no hole can run forever; (b) re-save hud-round-full-round so each shot's clicks are timed by `until` on meter state (e.g. `until meter.power` in a range, `until meter.label PERFECT!`) instead of fixed waits, and every hole ends with `until phase card`; real keys only. Verify it with `test`.

## Iteration 20
**Did:** `src/round.js` `resolveShot`: the pick-up rule now fires at par+3 strokes (was 9): `p.pickedUp`, `p.strokes` and `p.scores[hole]` are capped at par+3, `G.lastResult` "PICKED UP", banner "PICKED UP" / "<name> · n STROKES, THAT IS PLENTY"; `src/hud.js` card stamp reads "PICKED UP". Probed a state-driven real-key script (no fixed waits).
**Saw:** `until` that is not met does not abort the play, it only reports, so a block of `until phase [aim,card,intro]` → Space → `until meter.stage 1` → `until meter.power [0.5,0.62]` → Space → `until meter.label PERFECT!` (max 40) → Space repeated 50× is self-healing. With it, 50 blocks reached hole 4 (scores [6,6,6] on par-3 holes shows the pick-up works and holes cannot run forever). It was slow because `phase` "settle"/"holed" outlasts the 150-frame max, so the blocks drift (Space pressed during flight is ignored, but stage/power untils then see stale values: power 0.014 "MISS-HIT!" repeats). Not saved: `hud-round-full-round` in game-tests.json is still the old fixed-wait script. Console: no errors. No `perf` run.
**Next:** (1) Rebuild `hud-round-full-round` with blocks whose first `until phase [aim,card,intro]` has `max` 600 (flight + holed→card takes 300+ frames) and ~80 blocks, then `until phase final` and expect phase "final"; a Space after final goes to title, so do not overrun (count blocks in a live run first). Save it in one `interact` save call and `test`. (2) `hud-round-hotseat`, `hud-round-sound`. (3) `clubp` rough yardage, `meterp` stage 2, PERFECT banner `look`s.
**Open:** The full-round check is still not re-saved (seventh session). Blocks cannot branch, so an overrun past ROUND COMPLETE would press Space into title and restart the round; consider making the final card ignore Space for ~1 s in `src/meter.js` if that is accepted.
