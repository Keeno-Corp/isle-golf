The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 28
**Did:** `src/hud.js` update loop: `hud.help` (`#hinter`) gets `visibility:hidden` while `#meterp` has class `on` (aim stage>0 or swing), fixing the meterp/hinter overlap.
**Saw:** No browser run (about 10 minutes); syntax check only. No new numbers.
**Next:** Verify with `interact` Space `until meter.stage 1` + `look` (hinter hidden, 0 overlap); take the putt/PERFECT/PICKED UP/ROUND COMPLETE pictures; run `test` on the full set; kit-colour ring under `golferShadow`.
**Open:** The hinter hide is untested.

### Judge 28

**Judge 28: Isle Golf, hud-round lane**

I ran `start` with 2 players into stage 1 with `look`, then a driver swing and a wedge shot from the rough with `look`. I also ran `test` on the whole set and `perf` once.

The `test` run is new evidence: **8 of 8 saved checks pass**, including `hud-round-full-round`, `hud-round-hotseat`, `hud-round-sound` and `hud-round-hud`.

I did not see SO CLOSE!, IN!, PERFECT!, PICKED UP, ROUND COMPLETE or R replay on screen. The putt I tried never happened: the state had reset to 1 player, and the second shot was a wedge from the rough, left at "38 YD TO PIN".

1. **Wider view and putt feedback (top priority): 7.**
   - **Banners:** at the rough lie, `banner` "38 YD TO PIN" [184, 208, 481, 253] and `sub` "IN THE ROUGH: SHORTER SHOT" sit well away from `ball1`, `pin_flag` and `cup`.
   - **Panels at the wide camera:** they stay readable.
   - **Putt calls:** I saw no SO CLOSE! or IN! on screen for a fifth session. The saved `hud-round-sound` check passes, but only as an assertion; no picture shows it.
2. **HUD in the Isle Blitz type: 9.**
   - **Panels:** `holep` reads "HOLE 1 PAR 3 / STROKES 0 / 118 YD / ROUND EVEN", `windp` reads "2 MPH TAILWIND", and `clubp` shows DRIVER 204, IRON 132, WEDGE 74 and PUTTER GREEN.
   - **Rough lie:** `clubp` drops WEDGE to 58 YD and reads "LIE · ROUGH".
   - **`meterp`:** the "POWER 3%" bar sits at the bottom centre [384, 695, 895, 777].
   - **Iteration 28 fix confirmed:** at stage 1 the look lists no `hinter` and reports 0 overlap. At aim, `hinter` is back at [837, 727, 1263, 785] with 0 overlap.
3. **Banners never cover the target: 9.** `banner`, `sub` and `tag` are clear of `ball1` and `pin_flag`, and the look reports 0 overlap at both stages.
4. **Stamped scorecard and final card: 7.** `hud-round-full-round` passes under `test`, but I saw no stamp or ROUND COMPLETE picture.
5. **Title and hot-seat: 8.**
   - `hudRound.order` was ["ISLA","FINN"] with `turn` ISLA, and `scores` had 2 entries.
   - The `tag` and the `holep` dot show the kit colour.
   - `hud-round-hotseat` passes.
   - I did not see the 2-player stamped card or the farthest-ball order in a look.
6. **Sound: 7.**
   - The reply said "3 started" at the tee, with no console error.
   - `hud-round-sound` passes.
   - I cannot name which sounds played.
7. **Juice: 6.** The "38 YD TO PIN" banner and the "SHORTER SHOT" hint show. PERFECT!/NICE and the bunker hint are still unseen.
8. **R replay and full round: 8.** `hud-round-full-round` passes in `test` (252 s for the set). I did not try R.
9. **No console errors: 9.** None in any play.
10. **Saved checks hud-round-*: 9.** All 4 original checks and the 4 hud-round checks pass.
11. **Looks as LOOK.md says: 8.**
    - Tilt-shift blur, cream-on-green panels, and a teal sea with surf at stage 1.
    - The golfer is 0.34% of the picture at stage 1 and 0.22% at aim. The `tag` carries it, and `golfer_body` has low edge contrast (0.095).
12. **Edit only the allowed files: 9.** The git tree was clean at the start.
13. **Keep as they are: 8.** `pin_flag`, `cup`, `sheep*`, `aimDots*`, `aimLanding` and `slopeGrid*` are present, and the iron was auto-picked at 118 yd.
14. **Faults: 8.**
    - **No console error.**
    - **`ballShadow1`/`ballShadow2` z-fight:** not scored here, per the brief.
    - **`perf`:** 585 ms a frame on SwiftShader at host load 4.8, with 181 draw calls and 367k triangles. This is not a frame-time signal. The main scene takes 371 ms of it, and `grass*` is about 1786–2482 instances.

**Next:**
1. **Take the putt and closing pictures with real inputs (asked again, 5 sessions).**
   - **Putt:** use `interact` with `{action:"start",players:1}`, `{action:"next"}`, a `swing` to the green, `{action:"club",name:"putter"}`, a `swing` at power 0.3, then `look: true`. `observe` should show `hudRound.lastCall` as "SO CLOSE!" or "IN!", with `banner` clear of `ball1` and `cup`.
   - **PERFECT!:** use `until meter.label "PERFECT!"` and `look` straight after.
   - **PICKED UP:** play four `swing` shots at power 0.05, then `until phase card`.
   - **ROUND COMPLETE:** use `until hudRound.final`.
2. **Add an active-player marker (asked again).**
   - Add a kit-colour ring under `golferShadow`, or a larger arrow above the `tag`. The golfer is only 0.22–0.34% of the picture at the wide camera.
   - Show it with a 2-player `look` at stage 1: the marker should be visible and in FINN's colour on FINN's turn.
3. **Add a 2-player stamped scorecard picture, then add a sound proof.**
   - Run `start` with 2 players and `until phase card` using `swing` plays. Then `look` should show a row per player with birdie/par/bogey stamps.
   - Next, make `hud-round-sound` expect specific `hudRound` call and jingle events, such as `hud-round:jingle`, so I can name which sounds started instead of reading "N started".

SCORE: 8.0
