The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 20

**Judge 20: scores**

I took one real-key picture: hole 5 (index 4), Space ×3, then 150 frames in flight. I ran `perf` once. I did not see the flyover, C view, holed view, night view or scorecard this session, so those lines rest on Iteration 20's reported checks and on earlier sessions.

00. **Odyssey-style dithering**: 8. `look.dither` is `active:true`, with `subjectNdc` [-0.082, -0.31] matching `look.ball`. `radius` is 0.4 and `depth` 6.33. `tree8_leaves0` (9.8% of the frame) overhangs the shot and the ball stays crisp beside `tree8_trunk`. I did not see a dither hole through a canopy this session. The supervisor accepted that proof earlier (look-17).
0. **Wider framing, smoother ground**: 8. `camera` fov is 33 at (-8.8, 7.2, -9.2). `pond_water`, `bushes*` and the `grass*` stripes read as smooth painted bands with no texel blocks. There is still no saved before/after pair.
1. **Look lane goal**: 7. The painted haze, warm light and top-edge blur hold. `ball1` is only 0.059% of the frame (about 29 px) and sits low, at `look.ball.y` -0.31. `pin.on` and `golfer.on` are both false mid-flight, which the brief allows. The ball is still the weakest read in the picture.
2. **Look check 1 (aim blur band)**: 8. `focusY` is 0.357. The top fifth is blurred and the band around `ball1` is sharp. The saved `look-aim-hole1` and `look-aim-hole5` checks test only `look.ball.on` and `look.ball.y`, not blur.
3. **Look check 2 (C on 5, 6, 9)**: 6. I did not look at C. `look-c-hole5/6/9` is still not saved, although it has been asked for twice running.
4. **Look check 3 (flyover, drive)**: 8. My real-key drive kept `look.ball.y` -0.31, which is on screen. The flyover and drive checks are saved.
5. **Look check 4 (sea, key light, night)**: 7. `sea` is visible at the top edge, shadows fall to the lower right, and there were no `Lighting:` or `Surfaces:` lines. `look-night-hole5` is saved but I did not look at it.
6. **Critic views and course findings**: 6. Aim, flight and holed are now pictured. Iteration 20's holed view has `look.ball.y` -0.327 and pitch 26.7°. The scorecard picture is still missing, for the seventh session. The pink shrub at the right edge is the course lane's.
7. **LOOK.md Checks**: 8. The brush pass, haze, focus band and teal sea hold, and the frame is never unblurred.
8. **Edit scope and load-order imports**: 8. Iteration 20 made no source edits, and I did not re-read the sources.
9. **Observe hook, saved checks, lane notes**: 8. `look` carries `camPitchDeg`, `focusY`, `ball`, `pin`, `golfer` and `dither`. The saved set is aim 1/5, flyover 25/50/75, drive, night and `look-putt-holed`. There is no C check and no scorecard check.
10. **Faults**: 8. The only console message is the `toNonIndexed` warning. `perf` reads 181 draws and 367k triangles at the hole 5 flight moment, below the 307 draws / 486k tris baseline. The 1766 ms frame is SwiftShader with Host load 6.5 on 8 cores, so it is noise.

**Next:**
1. **Save the C checks** (asked again). Set `{hole:4, skipIntro:true}`, press C with real input, then wait 60 frames. Save `look-c-hole5`, then the same for `look-c-hole6` and `look-c-hole9` (hole indices 5 and 8). Each expects `look.camPitchDeg` in [45, 65] and `look.ball.on` and `look.pin.on` true. Done is `test` listing the three ids as passing.
2. **Take the scorecard picture and save the check** (asked again, seventh time). Use the Iteration 20 putt fixture: Space ×3, `until:{phase:'holed'}`, then `until:{phase:'card'}` if the phase value differs. Run `look` and save `look-card-hole`. Done is a picture showing the birdie/par stamp, with the four-view critic then closed on aim, meter, flight and card.
3. **Make `ball1` readable in the wide flight view.** Keep the camera as it is. Add a flight-time halo, or enlarge `ballRing`, in `src/stage.js` while `phase` is flight. Done is `look` with `sample` at the `ball1` box [575, 511, 604, 537] showing a brighter ring about 30 px wide, with `look.ball.y` unchanged at -0.31.

SCORE: 7.5

## Iteration 21
**Did**: Saved `look-card-hole` in `game-tests.json` (real-key putt fixture, `until phase holed`, then `until phase card`, expects `phase` card). I briefly added `look-c-hole6-broadside` and removed it again: `look-c-hole5-broadside`, `look-c-hole6-pitch` and `look-c-hole9-broadside` already exist and pass, as PROMPT.md says. No source edits.
**Saw**: Full `test` before the removal: 25 of 25 passed, including `look-card-hole`. Only the `toNonIndexed` console warning. I ran no `look` picture and no `perf`.
**Next**: (1) `interact` with look:true at phase card for the scorecard picture. (2) Flight-time halo on `ball1` in `src/stage.js` (ball is about 29 px in the wide view). (3) Adapt the stale fixtures (`look-holed-cup`, tree-circle, nearplane, sunk-closeup) only if the supervisor asks.
**Open**: The scorecard picture is still not looked at; `look-card-hole` only checks the phase. The suite now has 24 checks and was not re-run after removing the redundant one.

**Iteration 21 addendum (picture)**: Real-key putt to `phase card` plus 10 frames, with `look`. The card shows HOLE 1 · PEBBLE STEP, the `ISLA` row with a circled 1, the HOLE IN ONE stamp and "SPACE · NEXT HOLE". It covers 25% of the frame, and the island behind it is blurred, as intended. Camera is at (2.3, 22.0, 37.3), fov 29.6, `camPitchDeg` 33.1. There is no console error beyond `toNonIndexed`. The scorecard picture Next item is done.
