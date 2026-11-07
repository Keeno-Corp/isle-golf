**Judge 24: Isle Golf, hud-round lane**

I took three `interact` plays with `look` and ran `perf` once. The plays covered a 2-player hole 1 (tee to holed), the IN! banner and the stamped 2-player card. I did not run `test`, so Iteration 24's new `until hudRound.final` action is still unconfirmed. I did not reach a rough lie, so the `clubp` yardage drop and the PERFECT banner are still unseen. I saw no PICKED UP stamp and no ROUND COMPLETE card.

1. **Wider view and putt feedback (top priority): 7.**
   - `banner` "IN!" with the sub-line "PAR · ISLA · 3 STROKES" showed for ISLA's holed putt, and `hudRound.lastCall` read "IN!". It sat well clear of the `ball`, `cup` and `pin_flag`.
   - I saw no SO CLOSE! call this session.
   - Fault: the `tag` "FINN" (the active-player marker over the golfer) overlaps `windp` at the top right when the golfer is near the top edge of the frame.
   - Fault: FINN's tee turn showed a stale `banner` "34 YD TO PIN", left over from ISLA's rest, together with the `sub` "FINN TO PLAY". Iteration 22's turn-change clear leaves the banner behind.
2. **HUD in the Isle Blitz type: 7.**
   - `holep` reads "HOLE 1 PAR 3, STROKES 0, 118 YD, ROUND EVEN, PEBBLE STEP" with a FINN dot. `windp` reads "2 MPH TAILWIND", and it flipped to HEADWIND on the putt. `clubp` lists driver 204, iron 132, wedge 74 and putter, with "LIE · TEE" and later "LIE · GREEN".
   - At 1280×800 the `clubp` and `hinter` text is small.
   - I did not see the yardage drop on a rough or sand lie. I did not capture `meterp` this session.
3. **Banners never cover the target: 7.** `banner`, `sub` and `hinter` stayed off the `ball`, `cup` and `pin_flag`. The stale banner and the `tag`/`windp` overlap above are the weak spots.
4. **Stamped scorecard and final card: 8.** `card` "HOLE 1 · PEBBLE STEP" has PAR, 1–9, TOT and +/- columns, a row each for ISLA and FINN with coloured dots, "PAR" stamps for both, and "SPACE · NEXT HOLE". It looks finished. I did not see the PICKED UP stamp or the ROUND COMPLETE card.
5. **Title and hot-seat: 8.**
   - ISLA went first with FINN's `hudRound.turn` set after. `hudRound.order` read ["ISLA","FINN"] and the `tag` showed the kit colour.
   - Farthest-from-the-cup play showed as FINN taking the next turn on his tee.
   - I did not see the lowest-score-first rule on hole 2.
6. **Sound: 7.**
   - No console error appeared in the three plays.
   - The `interact` replies returned no Sound line, so I cannot confirm the cup and tick sounds this session.
7. **Juice: 7.**
   - "34 YD TO PIN" shows as a large gold call.
   - IN! was captured mid-fade.
   - The PERFECT/NICE banner and the bunker hint are still not photographed.
8. **R replay and full round: 6.** I did not run the full round or `test`. Iteration 24's added `until` action is untested, and a rejected key there would break `hud-round-full-round`.
9. **No console errors: 9.** None in the plays (the open-time `toNonIndexed` warning is harmless).
10. **Saved checks hud-round-*: 6.** They are not re-verified. The `hud-round-sound` outcome assertion and the new final-card wait are not confirmed.
11. **Looks as LOOK.md says: 8.** Tilt-shift blur, cream on dark green panels, a warm yellow-green course, and a teal sea around the island on the card backdrop. The `golferShadow` and golfer are tiny at the wide camera, under 0.3% of the frame, and blend into the grass. The camera lane owns that.
12. **Edit only the allowed files: 9.** The git tree was clean with only paprika-loop commits.
13. **Keep as they are: 8.** `cup`, `pin_flag`, `sheep`, `aimDots`, `ballTrail` and `divots` are present, and the iron was auto-picked for 118 yd.
14. **Faults: 8.** `perf` read 1023 ms a frame on SwiftShader (307 draw calls, 486k triangles, 1.86 MB assets). It is a software renderer on a host load of 3.2 on 8 cores, so it is not a signal. The `slopeGrid` appears on the green and is fine.

**Next:**
1. **Fix the two overlap faults at the wide camera, in `hud.js`.**
   - Clear the `banner` text on the turn change, so a stale "34 YD TO PIN" doesn't show under "FINN TO PLAY".
   - Pin the `tag` marker so it never overlaps `windp`. Clamp it below y=80, or flip it to the golfer's left near the top edge.
   - It is done when an `interact` with `start` players 2, `next`, `swing` 0.9, `until phase aim` and `look: true` shows `banner` empty at FINN's tee. A `look` with `at` [1040, 20] then shows `windp` without the `tag`.
2. **(asked again) Take the pictures still unseen, and confirm the checks with `test`.**
   - Run `test` and read whether `hud-round-full-round` accepts `hudRound.final`.
   - Reach a rough lie with a real shot: `swing` power 0.3 with accuracy 0.8, `until phase aim`, then `look`. `clubp` should show IRON below 132 YD with "LIE · ROUGH".
   - Run `interact` with `until meter.power [0.5,0.52]` then Space, with `look: true`. It shows the PERFECT!/NICE banner off the `ball`.
   - Play 4 swings at power 0.05 to par+3 with `until phase card` and `look: true`. It shows the PICKED UP stamp.
3. **Make `clubp`, `meterp` and `hinter` read at 1280×800.**
   - The `clubp` rows and `hinter` text are about 11–13 px. Raise them to about 15 px and keep the panels clear of the `ball` and `pin_flag`.
   - Check with `look` `zoom` on [16, 627, 243, 783]. The lie and yardage rows should read clearly.
   - Also make the active golfer easy to find at the wide camera: a larger ring under `golferShadow`, or a brighter `tag`.

SCORE: 7.5
