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

## Iteration 11
**Did**: No code changes. Read LATEST.md and PROMPT.md, opened the page, and began setting up `ball-physics-rollout-<surface>`: scanned `surfaceAt` over x,z in [-30,30] step 2 via eval (fairway e.g. (-20,-4), rough (-28,0), sand (-12,-6), (0,14), green (-18,-12), (-16,8), water (-20,2)). That scan covers the whole map, not one hole. The SURF table in rules.js is `fairway roll 3.1 e.42`, `rough roll 10 e.14`, `sand roll 26 e0`, `green roll 2.4 e.3`.
**Saw**: No looks, no `perf`, no `test` this session. No swing was played, so there are no roll-out numbers yet.
**Next**: Same as Judge 10, in order. 1) Pick a spot on hole 1 whose wedge landing is on each surface (use `setState` ball plus `act swing` to find it, then re-do with real keys) and `expect` `physics.rollYd` green > fairway > rough > sand~0; save `ball-physics-rollout-<surface>`. 2) Save tree, sheep and house-wall drives. 3) Steeper slope-break putt (>=0.3), putt preview look, lip-out `ball:lip`, sand puff and `divots` looks.
**Open**: Rollout, tree, sheep, house-wall, lip-out and divots are still unverified. The surface list above is map-wide, so the coordinates may belong to other holes.
**Played (added after the stop hook)**: One real-key iron from the hole 1 tee (hook, power 0.739 vs needPower 0.622, wind 2 mph tail). It landed in the bunker short-left of the pin: `firstBounce` {-3.514, 11.483} `surf` "sand", `carryYd` 97, `minPinD` 1.868, banner "PLUGGED IN THE SAND", `rollYd` 0. The look shows a `landPuffs` puff (0.43%) at the landing and `ballTrail` (0.99%); 0 console errors. This is a sand data point for the rollout check (sand ~0 holds); `divots` is still "Never visible".
