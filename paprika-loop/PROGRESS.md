# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

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

## Iteration 2
**Did**: Found the `SFX[k] is not a function` cause: main.js `play('gull')` has no SFX.gull (not a ball sound). Added a fallback `SFX.gull` in src/ballfx.js (only if absent). pools.js `ballTrail` point size 0.22 -> 0.4. Saved check `ball-physics-putt-sinks` (real keys: putter from 2 units, Space, wait 23, Space, wait 18, Space; ball.mode sunk) in game-tests.json.
**Saw**: real-key iron swing look: ballTrail is now a bright cream line behind the ball (0.7% of picture), no console errors, Sound 8 started. Putt from 2 units sinks (HOLE IN ONE, 22 sounds). landPreview still null in flight; landRing/aimLanding not seen in flight.
**Next**: saved checks still missing: late vs early snap, wind 8 vs 0, preview ring vs first bounce, wedge roll-out order, tree/sheep/house events, sloped break. Verify landRing/aimLanding visible in flight (landPreview null).
**Open**: landPreview null during flight in observe; lip direction and surface roll-out order unverified visually; no perf run (SwiftShader).

### Judge 2

**Judge, session 2: ball-physics lane**

1. **Ball physics polished**: 6. In a real-key iron swing on hole 1, `ball.mode` went rest → air, then `physics.bounces` stayed 0 for the 140 frames I watched. The meter read "PERFECT!" (`perfectAt` 0.377). I did not play hook/slice, wind, tree, sheep or house, and no saved check covers them. The roll-out order across surfaces is still unverified.
2. **Trail, landing ring, putt preview**: 6. `ballTrail` is now a bright cream column behind the ball. It is clearly readable and takes 0.48% of the picture. `landPreview` is an object in flight, but `landRing*` ×6 and `aimLanding` are listed as hidden by the game during flight, so no ring was visible. `slopeGrid` and `aimDots` are also hidden in flight. The ring-versus-first-bounce check is not possible until the ring shows.
3. **Impact and landing feedback / ballsfx**: 6. The console showed no errors and the Sound line reported 8 started. I did not see a puff or splash in this look, which was mid-flight.
4. **Meter timing and reset**: 6. Real Space presses gave stage 3 with label PERFECT!. The `src/meter.js` timing is unchanged and no check measures it.
5. **Events and observe data**: 6. The `physics` key is present (mode, vel, landPreview, bounces). I did not confirm any `ball:*` event fired.
6. **Saved checks `ball-physics-*`**: 2. `game-tests.json` still holds only `ball-physics-putt-sinks`. Six of the seven required checks are missing: late vs early snap, wind, ring vs bounce, roll-out order, lip-out/break, and tree/sheep/house.
7. **Looks as LOOK.md says**: 8. The tilt-shift blur band, painted grass, cream-green haze, teal sea and low sun all read in the look. The golfer stands out only weakly (56% brightness against 59% around it, edge contrast 0.091), and the golfer is small at 0.54% of the picture.
8. **Edit scope**: 8. The changes sit in `src/ballfx.js`, `src/pools.js` and `game-tests.json`, which are lane files.
9. **Keep as is**: 8. The HUD, the start/next/swing flow and the 5 HUD panels all work, with no overlap or cut-off. `perf` ran at 877 ms a frame on SwiftShader (host load 4.5), so frame time is noise. There are 181 draw calls and 367k triangles.

**Faults**: 6. There are no console errors now. `cliffRocks` and `seaStacks` are never visible, but they are outside this lane. The landing ring and the slope grid are hidden in flight.

**Next:**
1. Save the missing checks as `ball-physics-*` with `interact`'s `save` (asked again). Do late vs early snap with the driver first (right of the aim line vs left), then wind 8 vs 0 (at least 0.5 units downwind), then the wedge roll-out order. One `interact` with `expect` and `save` per check should show a ✓ line for each entry. Then `game-tests.json` should list the new ids.
2. Make the landing ring show in flight (asked again). Make `landRing*` and `aimLanding` visible from launch until the first bounce, at `physics.landPreview`. They are `visible:false` during flight now. Check with `look` mid-flight: the ring should appear in the On screen list, and `physics.landPreview` should sit within 1.5 units of `physics.firstBounce`.
3. Show the landing effect. Take `interact` with `look: true` about 5 frames after the first bounce, once on fairway and once on sand. It should show a dust or sand puff from `flightEvents`, and `physics.bounces` should read 1 or more. Then add the tree/sheep/house events (`ball:tree|sheep|wall`) with real-key drives, and the sloped-green break with its preview bend.

SCORE: 6.2

## Iteration 3
**Did**: src/ballfx.js: added `landRingPreview` (yellow pulsing ring, depthTest off, renderOrder 5). On `swing` it copies `aimLanding`'s last position, stays on the ground until `ball:land` (or aim phase); `physics.landPreview` now reads from it in flight. Not done: saved checks (snap, wind, ring vs bounce, roll-out, tree/sheep/house, break) and landing-puff look.
**Saw**: real-key iron swing mid-flight: `landRingPreview` is in the On screen list (0.35%, [591,192,784,231]), `physics.landPreview` {x -0.146, z 12.661} (pin at -1.7, 11.95). The ring sits under the HOLE 1 banner area, so it is hard to see in the picture. No console errors. Swing was HOOK (spin -0.643), preview is the perfect-shot spot, not the hooked one.
**Next**: save the missing `ball-physics-*` checks with interact `save` (one per check); compare landPreview with `physics.firstBounce` on a perfect swing; puff look 5 frames after first bounce on fairway and sand; tree/sheep/house events; sloped-green break.
**Open**: landing-puff visuals and roll-out order unverified; no perf run.

### Judge 3

I've seen enough to write the verdict. Two real-key swings and a `perf` run are done, so I'm writing it up now.

**Judge, session 3: ball-physics lane**

1. **Ball physics polished**: 6. In a real-key iron swing on hole 1, `ball.mode` went rest → air, then `physics.bounces` went 0 → 1 at frame 25 after I stepped on. `firstBounce` was {-4.384, 12.938, surf green}, `carryYd` 85, and the bounce showed an impact ring and a trail. The meter read SLIGHT SLICE (`spin` 0.129). I did not play hook vs slice with the driver, wind, tree, sheep, house, a sand or rough landing, or a slope, and no saved check covers them.
2. **Trail, landing ring, putt preview**: 7. `landRingPreview` now shows in flight as a yellow ring on the green around the pin, and `ballTrail` is a clear cream column at 0.9%. The preview did not match the real bounce on this swing. `landPreview` was {-0.146, 12.661}, but `firstBounce` was {-4.384, 12.938}, about 4.2 units short. The swing was a slight slice into a tailwind at power 0.609 against `needPower` 0.622, so it is not the no-wind perfect-swing check. That check is still unproven, and the preview may ignore wind or club carry. After landing, `landPreview` goes null and `landRingPreview` is gone. `aimDots` and `slopeGrid` are hidden in flight, so the putt-preview bend is unseen.
3. **Impact and landing feedback / ballsfx**: 6. The 2nd look shows a white ring at the bounce spot, with the trail passing through it. I saw no dust puff and did not see sand or splash. The Sound line reported 4 started at the landing, with no console errors.
4. **Meter timing and reset**: 6. Real Space presses gave stage 3, `perfectAt` 0.609 and label SLIGHT SLICE. The `src/meter.js` timing and reset are unchanged and no check measures them.
5. **Events and observe data**: 7. `physics` carries `spin`, `mode`, `vel`, `carryYd`, `bounces`, `lastBounce`, `firstBounce` and `landPreview`. I did not confirm any `ball:*` event fired.
6. **Saved checks `ball-physics-*`**: 2. `game-tests.json` still holds only `ball-physics-putt-sinks`. This is the third session in a row with six of the seven required checks missing.
7. **Looks as LOOK.md says**: 8. The painted grass, tilt-shift blur band, cream-green haze, teal sea and low sun all read. The golfer is a shader-drawn object and is not measured. `cliffRocks` and `seaStacks` are never visible.
8. **Edit scope**: 8. `git status` is clean and the changes are in lane files.
9. **Keep as is**: 8. The HUD panels have no overlap. `perf` read 1403 ms a frame on SwiftShader (host load 3.9), so that is noise. It counted 181 draw calls and 367k triangles.

**Faults**: 6. There are no console errors. `cliffRocks` and `seaStacks` are never visible, but they are outside this lane. `aimDots` and `slopeGrid` are hidden in flight.

**Next:**
1. Save the missing checks as `ball-physics-*` with `interact`'s `save` (asked again, third time). Do this before any other work. Start with the driver, late snap vs early snap. One `interact` with `expect` on `ball.x` or `z` relative to the aim line and `save` should print ✓ lines. Then wind 8 vs 0 with `{state:{wind:{speed:8,degrees:90}}}`, then the wedge roll-out order. `game-tests.json` should then list the new ids.
2. Make `landPreview` match the real first bounce (asked again). Compute it from the same simulation the swing uses: the club's carry, wind and the power or accuracy actually set, not just the aim. Check with an `interact` real-key no-wind perfect swing. `physics.landPreview` and `physics.firstBounce` should then sit within 1.5 units. This swing missed by 4.2.
3. Show landing puffs and the other collisions. Take `interact` with `look: true` 5 frames after the first bounce, once on fairway (dust) and once in sand. Then add real-key drives into a tree, a sheep and the hole 5 house to fire `ball:tree|sheep|wall`. Show `aimDots` or `slopeGrid` on a sloped-green putt for the break check.

SCORE: 6.4

## Iteration 4
**Did**: PROMPT's new top item, easier putting. physics.js: `puttRange(d)` (full meter = 1.22*d+0.5 past the pin, so the notch sits near 0.6-0.8 at any length), used by `launchOn` and aimline.js `puttTrack`; putter power is forgiving near the notch (under-power counts 0.3, small over-power 0.5, then 1:1) and uses the same reach on any surface; cup capture radius 0.17→0.23, `vcap` 1.35→1.6 base, lip needs sp 1.5-3.6, pull-in radius 0.5 at sp<1.5; green roll 2.0→2.4 (rules.js). aimline.js `aimDots` radius 0.055→0.085, opacity 1. Landing preview: `previewShot` takes `acc`; ballfx.js `swing` handler re-runs it with the swing's real power, spin, lie and wind, so `landRingPreview` is the real landing. Saved checks: `ball-physics-putt-mid-easy` (6.3 units, -9% power, sunk), `ball-physics-putt-too-hard` (+30%: not sunk), `ball-physics-preview-matches-bounce`; re-saved `ball-physics-putt-sinks`; `putt-drops-in-cup` power 0.054→0.228.
**Saw**: iron, no wind, hook: `landPreview` {-2.433, 11.172} vs `firstBounce` {-2.432, 11.176}, a 0.004 gap. `test`: all 6 then passed (8 saved now, two added after that run). 2-unit putt at +30% power ran past (0.24 away, lips 0). No look or perf run this session.
**Next**: the lip-out is not seen at +30% (add a check that fires `ball:lip`); look at the putt dots on a break; saved checks for driver late/early snap, wind 8 vs 0, wedge roll-out order, tree/sheep/house; landing puff looks.
**Open**: -9% mid putt sinks only because of the pull-in radius; `needPower` read 0.031 after the putt (stale cache, harmless). No look of the thicker aim dots.
