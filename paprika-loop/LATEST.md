The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
