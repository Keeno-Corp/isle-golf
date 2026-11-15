The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 6

**Did**
- `src/sheep.js`: new `setState({sheepAt:[x,z]})` hook. It plants `sheep[0]` at that point with its target set to the same point, `wait` 60 s (grazing in place) and `init` true, so a shot can be aimed through it.

**Saw**
- On hole 1 the tee is (-12.84, 15.36) and the pin is (-2.14, 14.43). I used `interact` with `{state:{hole:0,skipIntro:true,sheepAt:[-9.85,15.1]}}, wait 30, aim at pin, swing putter power 0.6, wait 240` and traced `sheepHits` and `banner`.
  - `sheepHits` went 0 → 1 at frame 65.
  - The banner read "PERFECT!" until frame 65, then "BAA!" until frame 193.
  - `lastSheepHit` had `tumble:true`, and `sheep[0]` went to "flee".
  - The ball bounced back off the sheep to (-14.58, 15.49), in the rough: carry 7 yd, roll 14 yd.
- The check was not saved. `test` refuses leading `{state}` steps unless `observe()` reports each key back, and `hole`, `skipIntro` and `sheepAt` are not reported.
- There was no console error. The only console output was the known `toNonIndexed` warning.
- I took no before/after `look` this session (there was not enough time). The change does not touch rendering unless `sheepAt` is passed.

**Next**
1. Save the sheep check. Either make the setup an `{action:"setup", hole, sheepAt}` step in `actFn` (src/api.js), or have `observe()` echo `sheepAt` and accept that `hole` is reported 1-based. Then save `sheep-bounce-on-demand` with the steps above and expect `sheepHits:[1,9]`. Save a bunker check the same way, expecting `lie:"sand"`.
2. Replace the code-built `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag` with picks from the searches already in `sourcing.json` (Judge 5, Next 1, asked again).
3. Add a strike camera punch: 0.3 units along the view direction, eased back over 0.15 s. Stop the golfer walking into the putt camera's line. Run both `feel` calls Judge 5 gave.

**Open**
- `sheepAt` only moves `sheep[0]`. Its home is (-16.5, 4.2), so once `wait` runs out it wanders back toward that range.

### Judge 6

The page opens in 1.3 s with no console errors. The only console output is the known three.js `toNonIndexed` warning. Iteration 6 added one thing, the `sheepAt` setup, and it works. With `sheepAt:[-9.85,15.1]`, a putter at power 0.6 raised `sheepHits` from 0 to 1 at frame 65. The banner read "BAA!" from frame 65 to 193, and the "sheep hit" sheet cell shows "BAA! BOUNCED OFF A SHEEP" with the ball rolling back toward the tee. I ran the landing `feel` Judge 5 asked for, and the landing is now inside the watched frames: `divots` 0 → 18 at frame 239, and sounds rose from 8 to 14. `landPuffs` does not appear in the Particles line. The strike `feel` still shows no camera punch. The first cell of the sheet (the title) is pale again, at 12% saturation, which is the known capture problem.

1. **Looks as LOOK.md says: 7.** On "h2 aim" saturation is 52%. The tilt-shift band is sharp on `player` and blurred above and below it. The haze is cream, the `sea` is teal beyond the `cliffFace`, and `hydrangeas` and `bushes` look painted. There are no `Lighting:` or `Surfaces:` lines. The golfer is still small on the aim views: 0.6% of the frame on h2, h6 and h9.
2. **Plays as DESIGN.md says: 8.** The mouse works now. Three clicks took `meter.stage` from 0 to 3 and `meter.power` peaked at 0.594. The ball flew and settled on "fairway", 38 yd from the pin. `act` aim, club and swing worked throughout. In the "C hole cam" cell, C gives the overhead view of hole 6 with `aimDots` to the pin past `pond_water`.
3. **Camera: 8.** The aim camera is high behind the ball. "h1 flight" follows the ball and its `ballTrail` toward the pin. "h1 intro" pulls back over the hole with the "HOLE 1 · PAR 3 · PEBBLE STEP" card.
4. **Ball flight by surface: 8.** The ball's first bounce was on fairway, and the sheep rebound left the ball in the rough (`lie` "rough"). The pond and out-of-bounds results from session 4 stand. I still have not seen a sand lie.
5. **Nine playable holes: 8.** A sheep bounce can now be shown: `sheepHits` went 0 → 1, `lastSheepHit.tumble` was true and the banner read "BAA!". Holes 1, 2, 6 (Duck Pond Bend, par 4, 206 yd, round the pond) and 9 (Lighthouse Home, par 5, 474 yd) each look different.
6. **Stroke play and scorecard: 8.** Carried over from session 5: the `card` shows the PAR stamp and "SPACE · NEXT HOLE". I did not re-check it this session.
7. **HUD: 8.** `#holep` is top left with strokes, round and hole name. Wind is top right ("2 MPH TAILWIND"). The club list is bottom left with yardages, and the key hints are bottom right.
8. **`window.__game` and 60 fps: 9.** `observe`, `act` and `setState({sheepAt})` all worked. `perf` measured a 9 ms median frame, 4.54 MB of assets and a 1.7 s load. Its p95 of 41.4 ms was taken with the host load at 15.8 on 8 cores, so that number is noise.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 8 sounds.
    - Landing: `divots` 0 → 18 at frame 239 and 6 more sounds.
    - Camera: there is still no strike punch. The only camera move is the aim camera settling at frame 138.
    - Teleport: `aimLanding` still jumps 0.58 units at frame 151.
11. **Richer look: 7.** Unchanged since session 4: library trees, `bushes`, `hydrangeas`, `fencePanels`, `teeBench` and `sign_arrow`, plus `slopeGridLines` on the putt view.
12. **Course and play: 7.** The `slopeGridLines` make the green slope readable, and the sheep rebound changes where the ball ends up. In "h1 putt", the golfer still stands between the camera and the pin, with a white puff column on the putting line.
13. **Better assets: 7.** `eval` shows all four code stand-ins still visible, each a `Mesh` with `MeshStandardMaterial`: `seaStacks` (24), `cliffRocks` (70), `teeMarker` (1) and `pin_flag` (1). This was asked for twice and is not done.

**Faults: 8.**
- There are no console errors.
- The `aimLanding` teleport remains.
- Iteration 6's `sheepAt` check is still not saved.
- The `perf` p95 was read on a busy host, so it is not a fault.

Next:
1. **(asked again) Replace the code-built `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag`.** This has been asked for twice and Iteration 6 did not touch it.
   - What to do: `pick` from the searches already in `paprika3d/sourcing.json`, using its "stylized sea stack rock pillar", "golf tee marker" and "golf flag pin hole" searches. `model_audit` each pick, credit it, and hide the code mesh. If a search finds nothing usable, try library words such as "stylized rock formation", "low poly cliff rocks", "flag pole" or "triangle flag". The `stonepile-2d5f24.glb` already loaded could replace `cliffRocks`.
   - The call that shows it done: `eval` returning `find('seaStacks').visible`, `find('cliffRocks').visible`, `find('teeMarker').visible` and `find('pin_flag').visible`, all `false`. A `look` with `camera` at about `{position:[0,60,80], lookAt:[0,0,0]}` should list the picked model's meshes where `seaStacks` was.
2. **(asked again) Add a strike camera punch, and stop the golfer walking into the putt camera's line.**
   - Camera: in `src/camera.js`, at the frame the swing turns into flight, push `camera.position` about 0.3 units along the view direction and ease it back over 0.15 s. Also stop the `aimLanding` jump at frame 151: ease it, or hide it at the swing.
   - Golfer: on the putt view, place the golfer beside the ball, off the ball-to-pin line, before the putt camera settles.
   - The calls that show it done:
     - Strike: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, {action:"swing",power:0.75,accuracy:0}` and `frames: 25`. Its Camera line should read "… and came back" after frame 151, and Teleports should be 0.
     - Golfer: the "h1 putt" sheet cell, the same steps plus `{wait:300}` and `frames:120`. The pin should be visible with no golfer or puff column between the ball and the pin.
3. **(asked again) Save the sheep check and a sand check.** Add an `{action:"setup", hole, sheepAt}` step to `actFn` in `src/api.js` so `test` accepts it. Then save `sheep-bounce-on-demand` from the steps that passed this session (setup, wait 30, aim at pin, putter swing at power 0.6, wait 240), expecting `sheepHits:[1,9]`. Add a `ballAt` option to the same setup to place the ball in a bunker, and save `sand-lie`, expecting `lie:"sand"`.
   - The call that shows it done: `test`, listing both checks as passing.

SCORE: 7.6
