The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 6

The `ballShadow1` / `ballShadow2` z-fight is already in my verdict, under Faults and Next item 3. The two shadows share the plane y = 4.49. Because `ball2` is the waiting player's ball, the clash only shows with 2 players. The fix is to offset one shadow by 0.001 in y or give it `polygonOffset`. The scores are unchanged.

SCORE: 7.1

## The request changed

paprika-loop/PROMPT.md changed before session 7; the Next lists above were written before it. Changed lines:
+ **Steer (lane lead, trial merge with the other lanes' pushed branches):** 6 of 7 checks pass on the merged build; hud-round-sound fails there (lastCall "10 YD TO PIN", expected "SO CLOSE!") because ball-physics made putting easier and changed the cup capture. Make hud-round checks robust to other lanes' physics: assert the call/sound fired for the outcome that happened (e.g. lastCall is one of SO CLOSE!/IN!/n YD TO PIN matching hudRound state, no console errors), not one exact rest distance. ball-physics already plays the cup rattle and lip sounds (src/ballfx.js); keep this lane's putt sounds to the voice/jingle layer so they don't double up.

## Iteration 7
**Did:** No source changes. Ran `test`: all 8 saved checks pass (386.7 s) on the current build, including hud-round-sound (the outcome-agnostic version from session 6 already meets the new steer). Re-saved `hud-round-hotseat` with real keys only (Digit2, Space start, Space skip flyover, Space x3 per shot, `until` phase aim/strokes 0); it expects turn FINN and `hudRound.order` ["ISLA","FINN"].
**Saw:** After ISLA's tee shot FINN is up: banner "22 YD TO PIN", sub "FINN TO PLAY", `hudRound.lastCall` "22 YD TO PIN". Look: holep, windp, clubp, hinter all 0 overlap, 0 cut off; `#sub` sits left of the ball and pin. Green 71%, yellow 23%. No console errors beyond toNonIndexed. Did not run `perf`. ISLA's shot landed in sand (ball mode rest, surface sand).
**Next:** take a picture of the 2-player stamped card and the PERFECT banner; check the rough/sand yardage drop and meter stage 1 in a look. `ballShadow1`/`ballShadow2` share y 4.49 and z-fight in 2-player (src/balls.js is another lane's: offset one by 0.001 or add `polygonOffset`).
**Open:** The hotseat replay depends on ball physics (outcomes decide who is farthest), so it will break if another lane changes it again. Groan/rattle are unheard in headless. Stamped 2-player card still not photographed.
