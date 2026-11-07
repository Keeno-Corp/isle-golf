The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 1
**Did**: Lane edit (game already built). New src/ballfx.js (SFX overrides, `landRing` pool, `PHY` shot tracking + `physics` observe, meter reset in addUpdate). physics.js: cup logic (vcap by distance; lip event + swerve; pull-in), spin kick at first bounce, per-surface `land` puffs/sounds, 1/120 preview, interpolated 140-point `trail` (pools.js). aimline.js `puttTrack` bends putt dots with the slope. balls.js cup rattle. rules.js SURF green t .95, rough t .32. Notes in lanes/ball-physics.md.
**Saw**: via eval: driver preview ring == first bounce exactly (6.416,12.8); slice +0.6 lands +2.1 z right, hook -0.6 left; wind 8 moves the preview ring ~5 units; putt at needPower from 2 units sinks, x1.3 lips (lips=1) and rests 0.28 past, x0.7 short. A look in flight shows the trail but it is faint (size raised to 0.22 afterwards, not re-looked). No console errors.
**Next**: verify roll-out order green>fairway>rough>sand with wedge swings and tune SURF; check trees/sheep/house collisions with real keys; save ball-physics-* checks in game-tests.json (none added yet); verify putt preview bends on a sloped green; frame-fair click timing in meter.js untouched.
**Open**: no saved checks yet; rollYd only updates in real frames (not via act settle); the lip swerve direction is unverified visually.

### Judge 1

**Judge, session 1: ball-physics lane**

1. **Ball physics polished**: 6. A real-key iron swing on hole 1 flew and landed on `fairway` at (-4.54, 12.58), then bounced twice and rolled to `physics.rollYd` 29. It came to rest on the green 0.94 units from the pin. The `physics` observe key reports spin, carryYd 84, bounces 2, firstBounce and lastBounce. I did not play hook/slice, wind, tree, sheep or house collisions. I read them from the builder's eval numbers only. The roll-out order across surfaces is unchecked.
2. **Trail, landing ring, putt preview**: 6. `ballTrail` is visible in flight as a thin white dotted line behind the ball, and it is still faint. `landPreview` was null during flight in the observe output, so I could not see the ring. On the green, `slopeGrid` arrows and `aimDots` show, and `puttBreak` reads 0.353. I did not check that the preview line bends the same way.
3. **Impact and landing feedback / ballsfx**: 4. The console raised `SFX[k] is not a function (src/sound.js:71:61)` when the ball landed. The `Object.assign(SFX, …)` override in `src/ballfx.js` put a non-function value in the table, so a ball sound likely throws on each landing. I saw no puff in the frames I looked at.
4. **Meter timing and reset**: 6. Real Space presses worked (stage 3, `perfectAt` 0.594, label "SLIGHT HOOK"). `G.m` reads stage 0 and power 0 after the shot. The frame-fair click timing in `src/meter.js` is untouched, as the builder noted.
5. **Events and observe data**: 6. The `physics` key is present with spin, vel, carryYd, rollYd, bounces, firstBounce, lastBounce, puttBreak, mode and landPreview. I did not confirm the `ball:*` events fired.
6. **Saved checks `ball-physics-*`**: 1. `game-tests.json` holds none, which is the main gap in the lane. The builder only verified by eval.
7. **Looks as LOOK.md says**: 8. The tilt-shift blur band, painted grass, cream-green haze, teal sea with foam and low sun all read in both looks. The golfer in the second look stands out only moderately (58% brightness against 63% around it).
8. **Edit scope**: 8. The new file is `src/ballfx.js` and the changes sit in the lane's own files, but the SFX error above comes from that override.
9. **Keep as is**: 8. The HUD, the meter flow and the aim/club/swing/next actions all worked and the hole advanced to putting. Perf cannot be judged here: it ran on SwiftShader, a software renderer, at 1.5 s per frame, which is noise. There are 181 draw calls and 367k triangles, and the host load is 3.9 on 8 cores.

**Faults**: 4. There is one console error (the SFX one above). `cliffRocks`, `seaStacks` and `divots` show as never visible, but they sit outside this lane. `landPreview` was null in flight.

**Next:**
1. Fix `SFX[k] is not a function`. In `src/ballfx.js`, make sure every key you assign in `Object.assign(SFX, {...})` is a function with the signature `sound.js:71` calls. Check `sound.js:71` for how it invokes `SFX[k]`. Check by repeating the real-key swing. The `interact` reply should have no `errors` line and the Sound line should report ball sounds starting.
2. Save the missing checks as `ball-physics-*` with `interact`'s `save`, using real keys and `setState` only to place the ball or set wind. Start with the cheapest three: late versus early snap (right of the aim line versus left), wind 8 versus 0 (at least 0.5 units downwind), and a putt from 2 units that sinks (`ball.mode` 'sunk'). Then add the wedge roll-out order across fairway, rough, sand and green, the tree/sheep/house events, and the sloped-green break with the preview bend. Each `save` writes an entry to `game-tests.json` when its `expect` holds.
3. Make the effects readable in a look. The trail is faint, so thicken and brighten `ballTrail`. Also confirm that `landRing` and `aimLanding` show during flight, since `landPreview` was null in flight. Take `interact` with `look: true` mid-flight and right after the first bounce. It should show a bright trail, the ring at the bounce spot and a puff of dust (fairway) or sand at the landing.

SCORE: 5.9
