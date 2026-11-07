**Judge verdict, session 2**

1. **HUD in the Isle Blitz type: 8.** The aim look shows `#holep` (HOLE 1, PAR 3, STROKES 0, 118 YD, ROUND EVEN, player dot), `#windp` ("2 MPH TAILWIND"), `#clubp` (DRIVER 204, IRON 132, WEDGE 74, PUTTER GREEN, "LIE · TEE") and `#meterp` ("SNAP 17%"), with no overlaps. The yardage dropping for rough or sand was not looked at again. The meter was not seen at stage 1 in this session.
2. **Banners never cover the target: 7.** "104 YD TO PIN" (`#banner`) and "FINN TO PLAY" (`#sub`) sit left of the pin_flag and clear the ball and aim line. The banner is very large and close to the flag. The session-2 clear hook is only partly shown: `banner` read "HOLE 1" with `meter.stage` 2 in the aim phase, so the intro banner can still be up at stage 2. Whether it clears on time was not proven.
3. **Stamped scorecard and final card: 6.** `#card` ("HOLE 1 · PEBBLE STEP", columns 1–9 and TOT, PAR row, ISLA row, a "HOLE 1 PAR" stamp, "SPACE · NEXT HOLE") looks good over the island. Only a par stamp was seen, and there was no birdie or bogey stamp and no 2-player rows. The ROUND COMPLETE card was never looked at.
4. **Title and hot-seat: 6.** `hudRound.order` is ["ISLA","FINN"], and after ISLA's shot `hudRound.turn` and `player` switched to FINN (blue dot, "FINN TO PLAY"). The 2-player hole-2 order by last score and the title picture are still unchecked. The later run showed `players` 1, so the 2-player card rows were not seen.
5. **Sound: 7.** "Sound: 10 started" on a swing and no console errors. There is no saved hud-round-sound check.
6. **Juice: 7.** "104 YD TO PIN" appeared at rest and `meter.label` read "PERFECT!" at the putt. The PERFECT banner was not seen on screen, and the bunker hint was not seen.
7. **R replay and full 9-hole round: 5.** Hole 1 reached `phase` "card" with `scores[0].scores` [3], but the full 9-hole run was not replayed and no hud-round-full-round check is saved.
8. **No console errors: 8.** None from title through card, in 3 `interact` calls.
9. **Saved checks: 3.** `game-tests.json` still has only `hud-round-hud`, and it appears twice at lines 235–236. The full-round, hotseat and sound checks are missing, which is the same as last session. Two of the original checks, "putter" and "wedge", are visible, and the other two were not confirmed.
10. **Looks as LOOK.md says: 7.** The tilt-shift diorama, cream-on-green HUD and sea all read well, with hues green 62% and yellow 24%. The golfer is 0.34% of the aim view, which `look` flags. The `Surfaces:` line still flags the ballShadow1/ballShadow2 z-fight at y = 4.49.
11. **Edit only the allowed files and COORDINATION.md rules: 7.** The `hudRound` key, the `lanes/hud-round.md` file and the hud-round:* events were not audited again.
12. **Keep what other lanes own: 8.** The camera, aim dots, sheep, signs and golfer are intact.

**Faults: 6.** There are no console errors. `perf` gave 1256 ms a frame, 307 draw calls and 485,787 triangles, but that was SwiftShader on a loaded host, so it says nothing. The ballShadow z-fight remains.

**Next:**
1. **(asked again)** Save the three missing checks, each with `expect`: hud-round-full-round (loop `until phase card` → `next`, for 9 holes, then expect the final-card phase, `scores` length 9 and the total), hud-round-hotseat (`start` players 2, expect `hudRound.order`, and after one shot `hudRound.turn` "FINN") and hud-round-sound. Dedupe the doubled hud-round-hud entry. The one `test` call that shows it done lists all checks passing, with `game-tests.json` holding the hud-round-* names once each plus the 4 originals.
2. **(asked again)** Take the pictures that were never taken: the ROUND COMPLETE final card (winner, best round, new best) and a 2-player stamped card. Do one real 2-player hole and use `interact` with `look: true` at `phase` card. Also catch a PERFECT or NICE banner on screen: press Space with `meter.perfectAt` read at that frame, then `look` straight after. Press Space on the final card to see the title come back.
3. Prove the banner clear. Run `interact` with `look: true` at `meter.stage` 1, and again at stage 2, with `trace` on `banner`, and make the hook clear the "HOLE n" and `sub` at stage 1. The look should show no banner at stage 2. Shrink the "n YD TO PIN" banner and keep it clear of the pin_flag. Also give ballShadow2 `polygonOffset` (or ask the balls lane to) so the `Surfaces:` fault line goes.

SCORE: 6.5
