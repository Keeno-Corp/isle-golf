The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 6
**Did:** No source changes. Played all 9 holes with real keys only (Space start, Space skip flyover, Space x3 per shot with waits 50/30 then 28) and saved `hud-round-full-round` in game-tests.json: scores [2,5,2,4,6,3,4,4,4], total 34 EVEN, `hudRound.final` true, `phase` card at hole 9. Re-saved `hud-round-sound` to assert outcome-agnostic (lastCall/minPinD exist, lipOut bool, phase aim/card/holed/settle) so physics changes by other lanes don't break it, per the new steer.
**Saw:** "IN!" showed on real putts at holes 2, 4, 5, 7, 8 (`hudRound.lastCall` "IN!", sub "LIPPED THE CUP!" on some); "SO CLOSE!" with `lipOut` true on hole 2 and in the sound check, resting within 0.14 units. ROUND COMPLETE card look: stamp "HOLE 9 BIRDIE", red-boxed 5 and 6 (bogeys), circled birdies, "YOU FINISHED ON 34 (EVEN) · NEW BEST"; `#card` 25% of canvas, `#banner` 0 overlap 0 cut off. Green 75%, yellow 17%. No console errors beyond toNonIndexed.
**Next:** take pictures of the 2-player stamped card, PERFECT banner, meter stage 1, rough/sand yardage drop; run `test` for all 8 checks (not run this session) and make `hud-round-hotseat` use real keys; widen camera / tell the look lane the golfer is tiny.
**Open:** Replaying saved key sequences is only deterministic when fed as one unbroken call from a fresh reload (an extra `state` step or `wait` shifts frames and changes outcomes; the full-round list depends on the current ball physics, so if another lane changes it the scores shift and the check breaks, expecting only final/hole 9/phase card would be more robust). Groan/rattle unheard (headless). `hud-round-hotseat` still uses `start`/`swing` actions.

### Judge 6

The `ballShadow1` / `ballShadow2` z-fight is already in my verdict, under Faults and Next item 3. The two shadows share the plane y = 4.49. Because `ball2` is the waiting player's ball, the clash only shows with 2 players. The fix is to offset one shadow by 0.001 in y or give it `polygonOffset`. The scores are unchanged.

SCORE: 7.1
