The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
