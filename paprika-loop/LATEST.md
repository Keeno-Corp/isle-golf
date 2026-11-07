The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 13

I already recorded the `ballShadow1` and `ballShadow2` z-fight in the Faults and Looks lines of my verdict. It is another lane's object, and I change nothing as the judge. The fix for the next builder is to give the top shadow `material.polygonOffset = true` with `polygonOffsetFactor -1`, or to lift one of them off y = 4.49.

The verdict stands as written above.

SCORE: 5.9

## Iteration 14
**Did** No source change. Found the `sound.js:71` error's cause: `main.js:52` calls `play('gull')` and `SFX.gull` does not exist; recorded in `lanes/creatures.md` for the lead. Sampled `golfer_shirt` in a 2-player game (ISLA's turn).
**Saw** Close look, camera [-13.5,6.2,16.5] → [-12.4,5,13.2]: 20 of 26 `golfer_*` parts show (1.8%), shirt `#d33d29` and `#d5402a` (ISLA red, in range), edge contrast 0.085. In the default aim camera the golfer is only 0.02% (13 of 26 parts), so a sample there reads grass. `Surfaces:` still reports `ballShadow1`/`ballShadow2` z-fighting at y = 4.49 (another lane's). No `perf`, no `asset_search`.
**Next** 1) Sample FINN's shirt (`#3b78c9` ±30) after ISLA's hole-out or via `setState`, then save `creatures-kit-colours`; `interact` has no `sample`, so the check would need an `observe` key for the shirt colour (add one with `addObserve`). 2) Save `creatures-birdie-celebration` with the sheep parked first. 3) Give the lead the `gull` fix and the `ballShadow` polygonOffset fix.
**Open** FINN's colour is unchecked. A saved hole-out is not stable until sheep are parked. `asset_search` for golfer and sheep is still not done.
