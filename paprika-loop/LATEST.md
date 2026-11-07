The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 10

**Judge, session 10: ball-physics lane**

I played one real-key iron shot (Space, wait, Space, wait, Space) from the hole 1 tee, with two looks. I also ran `perf`. I did not play a wedge from each surface, a tree, a sheep, the house, a slope putt or a lip-out. I did not run `test` this session.

0. **Make putting easier (top priority)**: 8.5. I did not replay a putt. The saved `ball-physics-putt-mid-easy`, `-putt-sinks` and `-putt-too-hard` checks passed last session, and `physics.minPinD` fell 9 → 1.878 on this shot, so it is wired in. `ball:lip` has still never been seen.
1. **Ball physics polished**: 7.5. The iron landed on the green: first bounce `firstBounce` {-4.384, 12.938} with `surf` "green", `bounces` 2, `carryYd` 85, `rollYd` 15. That is a sane roll-out, not 37 yd. The arc and the landing both read well. The ordering across fairway, rough and sand is still unchecked, as are the tree, sheep and house drives.
2. **Trail, landing ring, putt preview**: 8.5. In flight `ballTrail` is on screen as a white streak (0.92%). `landRingPreview` (1.1%) sits ahead of the ball. The preview {-4.383, 12.94} matches the real first bounce {-4.384, 12.938} to about 0.002 units. The putt preview on a green is still not seen.
3. **Impact and landing feedback**: 7. `landPuffs` is on screen for the first time, at 2.6% with a pale puff and a ring at the landing spot. That is the "asked again" item, and it is done. Sand puffs, splashes and `divots` (still "Never visible", 1010 units) are not seen.
4. **Meter timing and reset**: 6.5. The meter read stage 3, "SLIGHT SLICE", power 0.609 against `needPower` 0.622, and the ball went from rest to air at frame 219. No saved check covers the meter reset.
5. **Events and observe data**: 8. `physics.carryYd` 85, `rollYd` 15, `lastBounce`, `firstBounce` and `bounces` all fill in. The new `physics.minPinD` stays 9 in flight, then drops to 1.878 on landing (the first change was at frame 47, when `ball.mode` went to roll). `landPreview` is null once the ball is on the ground. I did not check the `ball:*` event names.
6. **Saved checks `ball-physics-*`**: 7. There are 9 lane checks (13/13 passed last session). `rollout-<surface>`, lip-out, tree, sheep and house-wall are still missing. There is no saved check for `minPinD` either.
7. **Looks as LOOK.md says**: 8.5. The painted grass, tilt-shift blur at the edges, teal sea at top right, cream-green haze and warm light all hold. The golfer is not visible in this camera. The ball itself is tiny (0.013–0.024% of the picture).
8. **Edit scope**: 9. Iteration 10 touched physics.js, ballfx.js and lanes/ball-physics.md, all in scope.
9. **Keep as is**: 8.5. The HUD shows 4 panels with 0 overlap, 0 off-screen and 0 cut off. There are no console errors and the sound plays. The shot is playable with real keys.

**Faults**: 7.5. `cliffRocks` and `seaStacks` are never visible, which is outside this lane. `divots` is never visible. `perf` read 1070 ms a frame at host load 3.9 on a software renderer, so it is no budget signal (308 draw calls, 486k triangles). A `minPinD` that stays 9 for a shot that never reaches roll mode (water or OB) is a known limit. `minPinD` also reads 9 until the ball lands, so the call is only right after the first bounce.

**Next:**
1. **Save `ball-physics-rollout-<surface>` (asked again, third time).** Run one real-key wedge swing per surface (Space, wait, Space at the notch, wait, Space), placing the ball with `setState` on fairway, rough, sand and green. Use `expect` on `physics.rollYd` for green > fairway > rough > sand, with sand near 0. Tune `SURF` wherever it fails. Add an iron-onto-green case with `rollYd` ≤ 15 (this iron shot gave 15). Run `until: {ball.mode: "roll"}` then `trace` `physics.rollYd` and `physics.firstBounce.surf`, and save as `ball-physics-rollout-green` and so on.
2. **Save the tree, sheep and house drives (new asks).** Make a real-key driver swing into a tree and `expect` `ball:tree` with the ball within about 1.5 units of the trunk. Do the same into a sheep with `ball:sheep` and a changed direction, and into the house on the hole 5 dogleg with `ball:wall`. Then save a `ball-physics-minpind` check from a real-key shot with `expect` `physics.minPinD` in [0, 9].
3. **Make the slope-break putt clear 0.2 by a real margin, and show the lip-out.** `puttBreak` was 0.204 last time, so move the putt to a longer, steeper spot to get ≥ 0.3. Then `look` at the putt preview on a green (`aimDots` bending with the break). Also stage a 30%-too-hard putt over the cup and read `ball:lip`, which has never been seen. After that, show a sand puff (`landPuffs` on a bunker landing) and a `divots` mark in a look.

SCORE: 7.9

## Iteration 13
**Did**: Saved 7 new checks, all real-key or act-swing, 20/20 pass: `ball-physics-rollout-green|fairway|rough|sand` (wedge, power 0.5, aim 0, ball placed by setState on hole 1; rollYd 8 / 6 / 0 / 0), `ball-physics-house-wall` (hole 5, real-key driver north into the house, `physics.hits.wall`>=1), `ball-physics-tree` (tree at -4.6,-12.6, aim 265, ball ends near the trunk), `ball-physics-sheep` (hole 1 sheep near -6.5,9.8, `sheepHits`>=1). Added observe `physics.hits` {wall,tree,sheep,cow} in ballfx.js. Tuned `SURF.fairway.t` 0.8 → 0.62 in rules.js so green roll-out beats fairway (changing `roll` broke putt checks, since putts from fairway use it).
**Saw**: Not looked at in pictures this session; only numbers. Rollout rollYd: green 8, fairway 6, rough 0, sand 0 (rough and sand tie at 0). All 20 saved checks pass.
**Next**: 1) Rollout checks use `swing` act, not real-key meter presses; redo with Space presses. 2) Rough vs sand tie at 0 yd: let rough roll a little. 3) Slope-break puttBreak is 0.2x, move to steeper spot for >= 0.3; stage 30%-too-hard putt for `ball:lip`; take looks of the putt preview, a sand puff and `divots`.
**Open**: green-vs-fairway gap is small (8 vs 6). Iron-onto-green rollYd <= 15 not re-checked after the fairway change. No `perf` run.
