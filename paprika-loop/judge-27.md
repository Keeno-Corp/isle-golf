**Judge 27: Isle Golf, hud-round lane**

I ran `start` with 1 player, `next`, a rough-lie `swing` with `look`, a real Space click into swing stage 1 with `look`, and `perf` once. I did not reach SO CLOSE!, IN!, PERFECT!, PICKED UP, ROUND COMPLETE or R replay, and I did not run `test`.

Iteration 27's `#meterp .lab` text-shadow was untested by the builder. I saw it at stage 1: the "POWER" and "32%" label reads cleanly over the grass.

1. **Wider view and putt feedback (top priority): 7.**
   - At the rough lie `banner` read "118 YD TO PIN" at [171, 208, 494, 253] and `sub` read "IN THE ROUGH: SHORTER SHOT". Both are well off `ball1`, `pin_flag` and `cup`.
   - The `tag` "ISLA" sits beside the golfer at both views.
   - I still saw no SO CLOSE! or IN! call. This has now gone unseen for four sessions.
2. **HUD in the Isle Blitz type: 8.**
   - **Rough-lie yardage drop (newly seen):** `clubp` went from IRON 132 to IRON 103 and read "LIE · ROUGH". It showed DRIVER 204, IRON 103, WEDGE 74 and PUTTER GREEN.
   - **Other panels:** `holep` read "HOLE 1 PAR 3 / STROKES 1 / 118 YD". `windp` read "2 MPH CROSS →".
   - **`meterp` at stage 1:** it shows "POWER 32%" with a green-to-orange fill and a PERFECT tick. It sits at [384, 695, 895, 777]. Stage 2 and PERFECT!/HOOK were not captured.
   - **Fault:** `hinter` [837, 727, 1263, 785] overlaps the right end of `meterp`. The look reports 2 overlaps, and the hint text "A/D AIM… C HOLE VIEW" runs over the empty end of the bar. When `meterp` is on screen, `hinter` should hide.
3. **Banners never cover the target: 7.**
   - `banner` and `sub` were clear of `ball1` and `pin_flag`.
   - `meterp` and `hinter` overlap each other at swing stage 1, which is a clutter fault.
4. **Stamped scorecard and final card: 7.** Not seen this session. `hud-round-full-round` passed in an earlier session, and PICKED UP is still unseen.
5. **Title and hot-seat: 7.** I ran only 1 player this session. The `tag` and `holep` player dot showed the kit colour (red for ISLA). Order and farthest-ball play were not re-checked.
6. **Sound: 7.** `interact` reported "9 started" at stage 1, with no console error. I cannot name which sounds they were.
7. **Juice: 6.** The "118 YD TO PIN" banner and the rough hint "SHORTER SHOT" showed. PERFECT!/NICE and the bunker hint were not seen.
8. **R replay and full round: 7.** No new evidence. I did not run `test` and did not try R.
9. **No console errors: 9.** None in either play.
10. **Saved checks hud-round-*: 8.** I did not rerun them.
11. **Looks as LOOK.md says: 8.** Tilt-shift blur, cream on dark-green panels, teal sea, and the stage 1 camera showing the diorama well. The golfer is 0.4% of the picture at stage 1 and 0.81% at aim, so the `tag` carries it.
12. **Edit only the allowed files: 9.** The git tree was clean.
13. **Keep as they are: 8.** `pin_flag`, `cup`, `sheep`, `aimDots` and `aimLanding` are present. The iron was auto-picked at 118 yd, and the lie drops the yardage.
14. **Faults: 7.**
    - The `meterp`/`hinter` overlap at swing stages.
    - No console error.
    - `ballShadow1` and `ballShadow2` z-fight, which the brief says not to score here.
    - `perf` read 1027 ms a frame on SwiftShader at host load 3.6, with 307 draw calls and 486k triangles. That is no frame-time signal. The main scene is 175 draw calls and 367k triangles, with `grass*` at about 1267 instances.

**Next:**
1. **Fix the `meterp`/`hinter` overlap (new).**
   - In `src/hud.js`, hide `#hinter` while `meter.stage` ≥ 1 or the phase is swing/flight, or move it above `meterp`.
   - To check it, run `interact` with Space, `until meter.stage 1`, `look: true`. The look should report `hinter` with 0 overlap against `meterp`.
2. **Take the putt and closing pictures with real inputs (asked again, 4 sessions).**
   - Run a putt from the green with `until meter.power` in range and `until phase`. Then `observe` should show `hudRound.lastCall` as "SO CLOSE!" or "IN!" with `banner` clear of `ball1` and `cup`. Grab the PERFECT!/NICE banner with `until meter.label` "PERFECT!" and a `look` straight after.
   - Capture PICKED UP with four `swing` plays at power 0.05 and `until phase card`. Capture ROUND COMPLETE with `until hudRound.final`.
3. **Run `test` on the whole set, then add an active-player marker.**
   - Confirm `hud-round-full-round` and `hud-round-hotseat` still pass on `until` waits.
   - Then add a kit-colour ring under `golferShadow` or a marker on the player whose turn it is. The golfer is only 0.4% of the picture at stage 1, so it is hard to find at the wide camera. Show it with a 2-player `look` at stage 1.

SCORE: 7.5
