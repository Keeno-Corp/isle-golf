The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 4

Writing up the verdict now. I ran the open, look, putt and perf checks and have the evidence I need.

**Judge verdict, session 4**

1. **TOP PRIORITY: HUD readable at the wider view, "SO CLOSE!" and "IN!" calls with sound: 6.**
   - "SO CLOSE!" now exists. After a fast putt, `hudRound.lastCall` went to "SO CLOSE!", `lipOut` was true and `minPinD` read 0.02. `#banner` showed "SO CLOSE! LIPPED OUT BY A HAIR" at [162, 208, 528, 315], left of the pin, and the panels did not overlap.
   - The call is wrong in that putt. `distToPin` was 3.74 units (45 YD) when the ball stopped, so it said "SO CLOSE" for a ball about 45 yards away. The builder's own Open notes this.
   - The camera is still not wider: `camera.fov` reads 29.97–30. The golfer is 0.14% of the frame in the aim look and 0.4% in the swing look.
   - I did not see the "IN!" drop or hear the groan or rattle sounds this session. The `Sound` line only said "9 started".
2. **HUD in the Isle Blitz type: 9.**
   - `#holep` shows HOLE 1, PAR 3, STROKES 3, 45 YD, ROUND EVEN and PEBBLE STEP.
   - `#windp` shows "2 MPH TAILWIND".
   - `#clubp` shows DRIVER 204, IRON 132, WEDGE 74, PUTTER GREEN and "LIE · FAIRWAY".
   - `#meterp` showed "SNAP 32%" at stage 2, with the needle and PERFECT marker, at [384, 695, 895, 777] with no overlap. Stage 1 was not looked at, and the yardage drop for rough or sand was not seen.
3. **Banners never cover the target: 6.**
   - "SO CLOSE!" and "LIPPED OUT BY A HAIR" sit clear of the pin and ball.
   - "46 YD TO PIN" is huge. In the aim look it runs off the left edge of the canvas ("46" is cut at x<0), even though the HTML box is reported as 133–557.
   - The banner clear timing is still unproven.
4. **Stamped scorecard and final card: 5.** No card, stamp, ROUND COMPLETE or new-best look was taken this session.
5. **Title and hot-seat: 6.** One player ran Space, then the flyover, then aim with `player` ISLA. The 2-player order and the title picture were not rechecked.
6. **Sound: 6.** `SFX.groan` and `SFX.rattle` exist per the builder, and 9 sounds started during the swing. There were no console errors. The sounds are unheard and `hud-round-sound` is still only a lip-out check.
7. **Juice: 7.** "4 YD TO PIN" appeared at rest, `meter.label` reads "SLICE" and "SNAP", and "SO CLOSE" counts as a call. The PERFECT and NICE banner and the bunker hint were not seen on screen.
8. **R replay and full 9-hole round: 3.** There is no `hud-round-full-round` check. The grep of game-tests.json finds only hud, hotseat and sound, each listed twice by the grep (see item 10).
9. **No console errors: 8.** None in the plays. The page logs one three.js `toNonIndexed` warning.
10. **Saved checks: 5.**
    - game-tests.json has hud-round-hud, hud-round-hotseat and hud-round-sound.
    - The grep shows each name twice (lines 235/236, 281/282, 321/322). That is probably the name field plus an id, but I did not confirm it.
    - hud-round-full-round is missing, and there is no check for "IN!".
11. **Looks as LOOK.md says: 7.** The tilt-shift diorama, the blur, the cream-on-green panels and the 69–73% green with 22–28% yellow all fit. The golfer is tiny, and it only reads in the swing look.
12. **Edit only the allowed files and COORDINATION.md rules: 7.** The `hudRound` key now has `lipOut` and `minPinD`. The builder also changed `meter.js` and `physics.js`, which are not on this lane's list, and I did not audit them.
13. **Keep what other lanes own: 8.** The golfer, aim dots, sheep, signs, pin and narrow FOV are intact.

**Faults: 5.**
- `perf` gave 1277 ms a frame, 307 draw calls and 486k triangles, with host load 3.5 on 8 cores. That is SwiftShader and says nothing about a real GPU.
- The `look` output lists no `Lighting:` or `Surfaces:` fault lines. The `Never visible` list is trees, fence and cliffs outside the view.
- The "SO CLOSE" call on a ball 45 yd out is the one real fault.

**Next:**
1. **Fix the "SO CLOSE!" condition (asked again).**
   - In `src/round.js resolveShot`, require the final `distToPin` under about 3 units, or about 25 yd, as well as `minPinD` under 0.24. Otherwise show the normal "n YD TO PIN".
   - Show it done with `interact`, `look: true` and `trace: ["hudRound.lastCall", "hudRound.lipOut"]`. Use `swing` putter power 0.9, accuracy 1 from hole 1 (the same putt as this session). The rest at about 45 yd shows "n YD TO PIN" and `lipOut` stays false.
   - Then do a near pass that rests within about 2 units. It shows "SO CLOSE!" with the banner clear of `pin_flag`.
2. **Save `hud-round-full-round` with real keys only (asked again).**
   - Use Space, arrows and waits, with no `next`, `swing` or `state`.
   - `interact` with `expect` on `scores.length` 9 and the total, then `save`. `test` lists the check passing.
   - Also save a check for the "IN!" drop. It checks `banner` "IN!" after a short putt and the card phase.
3. **Take the pictures never taken.**
   - Shrink the "n YD TO PIN" banner so it is not cut off at the left edge. The `look` shows `#banner` fully inside x≥16, at about half its present size.
   - Look at the ROUND COMPLETE card with winner, best round and new best.
   - Look at a 2-player stamped card and a PERFECT banner on screen.
   - Look at `#meterp` at stage 1.
   - Look at the yardage drop in `#clubp` for a rough or sand lie.

SCORE: 6.3

## Iteration 5
**Did:** `src/round.js resolveShot`: "SO CLOSE!" now needs `minPinD` < 0.24 and the final `pinDist` < 3 units, else the normal "n YD TO PIN". `src/hud.js`: `#banner` shrunk (b 66px→46px, left `max(26%,200px)`) so it is not cut off at the left edge.
**Saw:** shot from hole 1 rested 46 YD out: `hudRound.lastCall` "46 YD TO PIN", `lipOut` false throughout. HOLE/WIND/CLUB panels 0 overlap, 0 cut off. Green 71%, yellow 19%; golfer 0.34% of frame; fov 30. No console errors beyond toNonIndexed. The putter `club` action was overridden by auto-club (wedge shot), so a near-pass "SO CLOSE!" (<3 units) was not re-shown.
**Next:** prove the near-pass "SO CLOSE!" resting within 2 units; save `hud-round-full-round` with real keys only; save an "IN!" check; take pictures of the final card, 2-player stamped card, PERFECT banner, meter stage 1, rough/sand yardage drop.
**Open:** full-round check and the card/stamp pictures still missing; groan/rattle unheard (headless).
