The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 9

**Judge, session 9: ball-physics lane**

Session 9 only added a saved check, so I ran `test` (13/13 pass), one look at the hole 1 tee, and `perf`. I did not play a wedge from each surface, a tree, a sheep, the house, a putt on a slope or a lip-out. My one `act swing` from the tee did not launch: `ball.mode` stayed 'rest' for 64 frames, so there was no flight, roll-out or puff to see.

0. **Make putting easier (top priority)**: 8.5. `ball-physics-putt-mid-easy`, `ball-physics-putt-sinks` and `ball-physics-putt-too-hard` all pass. `ball-physics-slope-break` reads `puttBreak` 0.204, a thin margin over 0.2. `aimDots` ×28 is on screen in the aim look as a bright cream dotted line. I have still not seen it on a green, and `ball:lip` has never been seen.
1. **Ball physics polished**: 6.5. The wedge roll-out order (green > fairway > rough > sand), the 37 yd iron roll-out on a green, and the tree, sheep and house drives are all unchecked. The only evidence is the `SURF` numbers.
2. **Trail, landing ring, putt preview**: 7.5. `aimLanding` and `aimDots` show in the aim phase with `landPreview` {-4.81, 12.88}. `ballTrail` is not visible in this look (0 units, behind the camera), so I could not re-check it in flight.
3. **Impact and landing feedback**: 5. `landPuffs` and `divots` are both "behind the camera" at 0 units, for the fourth look running. No puff, sand puff or splash has been seen on screen.
4. **Meter timing and reset**: 6. The meter shows stage 3, PERFECT! 60% and `needPower` 1.05 for the wedge from the tee. No saved check covers the meter reset.
5. **Events and observe data**: 6. `physics.landPreview` is there, but `physics.rollYd` and `physics.carryYd` stayed 0 and I confirmed no `ball:*` event. **New cross-lane item not done:** `grep minPinD` over `src/*.js` and `lanes/*.md` finds nothing, so `SIM.minPinD` and `physics.minPinD` do not exist, and hud-round's "SO CLOSE!" call is blocked.
6. **Saved checks `ball-physics-*`**: 7. There are 9 lane checks and all pass. The rollout, lip-out, tree, sheep and house-wall checks are still missing.
7. **Looks as LOOK.md says**: 8. The painted grass, the tilt-shift blur on the foreground and far trees, the cream-green haze, the teal sea at top right and the warm light all read. The golfer is only 0.31% of the picture and its edge contrast is 0.151, so it does not stand out.
8. **Edit scope**: 9. Session 9 changed only `game-tests.json`.
9. **Keep as is**: 8. The four original checks pass, the HUD has 0 overlap and 0 off-screen, and there are no console errors.

**Faults**: 7. `cliffRocks` and `seaStacks` are never visible (outside this lane). `landPuffs` and `ballTrail` are never visible in any look. `perf` read 1118 ms a frame at host load 4.0 on a software renderer, so it is no budget signal. It counted 308 draw calls and 486k triangles.

**Next:**
1. **Add `SIM.minPinD` (new in PROMPT.md).** In `src/physics.js`, set it to 9 in `launchOn` and `doSwing`. In `stepFlight` while `SIM.mode==='roll'` and `SIM.pin` exists, keep the minimum of `hypot(pin.x-pos.x, pin.z-pos.z)`. Expose it as `physics.minPinD` through `addObserve`, and list it in lanes/ball-physics.md under Provides. Do not write `G.minPinD`. Done when `interact` with `expect` `physics.minPinD` in [0, 9] after a full real-key shot shows ✓.
2. **Save `ball-physics-rollout-<surface>` (asked again).** Use a real-key wedge swing (Space, wait, Space at the notch, wait, Space) onto fairway, rough, sand and green, placing the ball with `setState`. `expect` `physics.rollYd` green > fairway > rough > sand, with sand near 0. Tune `SURF` where a check fails, and also check that an iron onto a green stops within about 15 yd of its first bounce, not 37. An `act swing` from the aim phase did not launch for me, so drive it with Space keys as the PROMPT says. One `interact` per surface with `trace` on `physics.rollYd` and `ball.mode` shows it.
3. **Show a landing puff on screen (asked again).** Run `interact` with `look: true` 2–3 frames after `air` turns to `roll`, with a `camera` near the landing point. Done when the look lists `landPuffs` above 0.3% with a pale cloud beside `ball1`. If it still has 0 units, place the puff at the first-bounce position and not at the origin. After that, save the tree, sheep and house drives (`ball:tree`, `ball:sheep`, `ball:wall`). Also move the slope-break putt to a longer, steeper spot so `puttBreak` clears 0.2 by more than 0.004.

SCORE: 7.2

## The request changed

paprika-loop/PROMPT.md changed before session 10; the Next lists above were written before it. Changed lines:
+ - Cross-lane (do this session, small): hud-round needs the closest ball-to-pin distance of each shot for a "SO CLOSE!" call. Add `SIM.minPinD` in physics.js: set to 9 in launchOn/doSwing, and in stepFlight while SIM.mode==='roll' and SIM.pin exists, keep the min of hypot(pin - pos) on x/z. Also expose it as observe `physics.minPinD`, and list it in lanes/ball-physics.md under Provides. Do not write G.minPinD.

## Iteration 10
**Did**: Added `SIM.minPinD` (physics.js): `newSim` starts it at 9, `launchOn` (which `doSwing` and putts go through) resets it to 9, and the `stepFlight` sub-step loop keeps the min of hypot(pin - pos) on x/z while `SIM.mode==='roll'` and `SIM.pin` exists. Exposed as observe `physics.minPinD` (ballfx.js addObserve, r3-rounded) and listed under Provides in lanes/ball-physics.md. `G.minPinD` is not written.
**Saw**: `test` 13/13 pass. A real-key putt (Space/wait/Space/wait/Space) traced `physics.minPinD` 9 → 2.635 at frame 249, first change at frame 127 (roll start); `expect` [0,9] ✓. That putt stopped 2.6 from the pin (short, a 32 yd putt). No looks and no `perf` this session.
**Next**: The earlier Next items remain: `ball-physics-rollout-<surface>` checks, tree/sheep/house drive checks, a look at `landPuffs` at the first-bounce position, and a steeper/longer slope-break putt (puttBreak was 0.204 vs 0.2).
**Open**: minPinD only counts roll mode, so an air-only shot (water/OB) stays 9. The rollout, lip-out and puff looks are still unverified.
