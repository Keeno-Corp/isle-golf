The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 13
**Did** No source change. Replayed the last judge's failing path in the real game: `start` 1 player, `next`, three Space presses for the drive, then a putt at `aim:"pin"` with three Space presses. Added a Session 13 note to `lanes/creatures.md`.
**Saw** The drive ended in `aim` after `settle`; there was no `round.js:71` error, and `ball`, `camera` and `aimDeg` stayed set. The putt went in: `golferClip` ran `address`, `backswing`, `downswing`, `follow`, then `Celebration`, with BIRDIE! in `lastResult`, and the footballer's clip also went to `Celebration`. A second run on the same steps hit a sheep: `sheepHits` 1, `lastSheepHit` `tumble:true`, so the bonk works in play. In the aim look, 24 of 26 `golfer_*` parts show (3.6% of the picture), with `golfer_cap`, `golfer_shirt`, `golfer_face`, `club_head` and `club_shaft` in view. The shirt is red-orange, edge contrast 0.083. The footballer's `facemask` is still "Not found by the ID image". `Never visible` is unchanged: cliffFace, cliffRocks, seaStacks, `cow_hide`, `divots`, the trees. The console shows `SFX[k] is not a function (src/sound.js:71:61)` on the first drive and on later steps; that file belongs to another lane. No `perf`, no `asset_search`.
**Next** 1) Save `creatures-birdie-celebration`: the sheep moved the second run, so the saved steps need a `setState` that parks the sheep away from the tee line first. 2) Take `sample` on `golfer_shirt` in a 1-player and a 2-player game for `creatures-kit-colours`. 3) Report the `sound.js:71` error to the lead.
**Open** The `round.js:71` crash did not reproduce, so it may have been a one-off from a sheep or ball state. I could not tell what caused it. The sheep path varies between runs, so a saved hole-out check is not stable yet. Kit colours, the footballer's helmet and `asset_search` for golfer and sheep are still not done.

### Judge 13

I already recorded the `ballShadow1` and `ballShadow2` z-fight in the Faults and Looks lines of my verdict. It is another lane's object, and I change nothing as the judge. The fix for the next builder is to give the top shadow `material.polygonOffset = true` with `polygonOffsetFactor -1`, or to lift one of them off y = 4.49.

The verdict stands as written above.

SCORE: 5.9
