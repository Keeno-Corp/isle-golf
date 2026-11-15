The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 5

The page loads in 1.2 s with no console errors. The only console output is the three.js `toNonIndexed` warning. Iteration 5 changed one thing: point pools now hide when empty. Two effects of that show in the measurements. `divots` now registers as a particle burst, "divots 0 → 8 at frame 164" in a 25-frame `feel`. `landPuffs` is listed on screen in the "landing +3" cell. The first cell of each sheet still comes out pale (saturation 12%, a flat #b5c8bc frame). This is the known capture problem: the same views paint correctly in every other cell.

Two `feel` findings change last verdict's Next:
- **The camera move it flagged is not a strike lurch.** "Moved up to 67.3 at frame 138" happens before the swing at frame 151. It is the aim camera gliding into place after `skipIntro`. The strike has no camera punch at all.
- **The missing `landPuffs` count came from the steps I gave last session.** The 90-frame `feel` with `{wait:100}` puts the landing (about frame 238) inside the steps, so it is never in the watched frames. That is why neither `divots` nor `landPuffs` appeared in its Particles line.

1. **Looks as LOOK.md says: 7.** On the "h2 aim" view, saturation is 52%. The tilt-shift band is sharp on `player` and blurred above and below. There is cream haze, the `sea` is teal past the `cliffFace`, and `hydrangeas` and `bushes` are painted. There are no `Lighting:` or `Surfaces:` lines. The golfer is still small on the aim views (0.6%).
2. **Plays as DESIGN.md says: 8.** `act` aim, club and swing drove every shot. In the "C hole cam" cell, C gives the overhead hole view with `aimDots` to the pin. I did not try the mouse.
3. **Camera: 8.** The aim camera is high behind the ball (`camPitchDeg` 20.9, `fov` 33). "h1 flight" follows the ball and its `ballTrail`. "h1 intro" pulls back to the green and bunkers. The title and card cells show the whole island diorama.
4. **Ball flight by surface: 8.** An iron at power 0.4 carried 41 yd and rolled 6 yd over 2 bounces, with `firstBounce.surf` "fairway". A putter from the tee stopped in rough with "IN THE ROUGH: SHORTER SHOT". The pond and OB results from session 4 stand. I did not see a sand lie.
5. **Nine playable holes: 7.** Holes 1 (Pebble Step), 2 (Gorse Run), 4 (Lantern Road), 6 (Duck Pond Bend) and 9 (Lighthouse Home, par 5, 474 yd) are distinct. I hit two shots at the grazing `sheep[8]` at (-9, 2.2) on hole 1, and `sheepHits` stayed 0 through 600 frames. The sheep bounce exists in the code (physics.js:156) but still cannot be shown.
6. **Stroke play and scorecard: 8.** The `card` shows HOLE 1 · PEBBLE STEP, ISLA 3, EVEN, with a PAR stamp and "SPACE · NEXT HOLE".
7. **HUD: 8.** `#holep` is top left, wind is top right ("2 MPH TAILWIND"), and the club list is bottom left with "LIE · TEE / GREEN", all in the steel type.
8. **`window.__game` and 60 fps: 9.** `observe`/`act` worked throughout. `perf` measured a 4.8 ms median (109 fps), 181 draw calls and 4.54 MB of assets, all within budget.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the number 4 jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0→30, `divots` 0→8 (newly visible) and 8 sounds.
    - Landing: `landPuffs` is drawn at the landing, but no `feel` has measured it yet.
    - Camera: there is no strike lurch.
    - Teleports: `aimLanding` still teleports 0.58 units at the swing.
11. **Richer look: 7.** This is unchanged from session 4: library trees, `bushes`, `hydrangeas`, `fencePanels`, `teeBench` and `rowingBoat`. The putt view adds `slopeGridLines`. The water and the golfer's animation look the same as before.
12. **Course and play: 7.**
    - The putt view's `slopeGridLines` make the green slope readable. `puttBreak` is reported.
    - The pond and the sea cost strokes.
    - Sheep still never change a shot.
    - In "h1 putt", the golfer is still walking to the ball 120 frames after it settles. They stand between the camera and the pin, with a white puff column on the putting line.
13. **Better assets: 7.** `eval` shows that all four code stand-ins are still visible:

    | Object | Type | Material | Count |
    |---|---|---|---|
    | `seaStacks` | Mesh | MeshStandardMaterial | 24 |
    | `cliffRocks` | Mesh | MeshStandardMaterial | 70 |
    | `teeMarker` | Mesh | MeshStandardMaterial | 1 |
    | `pin_flag` | Mesh | MeshStandardMaterial | 1 |

    Their searches are in `sourcing.json`, but nothing was picked.

**Faults: 8.**
- The `divots` "Never visible" fault is gone.
- There are no console errors; only the `toNonIndexed` warning remains.
- `perf` p95 was 19.5 ms, but the host load was 3.7 on 8 cores, so that is noise.
- Iteration 5's Open is answered above: the landing fell inside the steps, not in the watched frames.

Next:
1. **(asked again) Replace the sea stacks, cliff rocks, tee marker and flag that are still built in code.**
   - What to do: `pick` from the searches already in `sourcing.json` ("stylized sea stack rock pillar", "golf tee marker", "golf flag pin hole"), `model_audit` each pick, credit it, then hide the code mesh. Start with `seaStacks`/`cliffRocks`, because they ring the island in the title and card views.
   - The call that shows it done: `eval` returning `find('seaStacks').visible`, `find('pin_flag').visible` and `find('teeMarker').visible`. All three should be `false`. A title-cell `look` should list the picked model's mesh names where `seaStacks` is now.
2. **(asked again) Make a sheep bounce happen on demand.** A grazing sheep cannot be hit by playing normally: two aimed shots at `sheep[8]` missed while it wandered.
   - What to do: add a `setState` option, for example `{hole:0, skipIntro:true, sheepAt:[-12.4, 12]}`. It should place `sheep[0]` on the tee-to-pin line, hold it in "graze" and clear its target (`tx`/`tz`). Then interact with a low putter roll through it, expect `sheepHits:[1,9]`, and save the check. Save a bunker check the same way, expecting `lie:"sand"`.
   - The call that shows it done: that `interact` with `trace:["sheepHits","banner"]`. It should show `sheepHits` 0→1 and banner "BAA!".
3. **Add a strike camera punch, and measure the landing in the watched frames.**
   - Camera: no strike punch exists; the "moved up to 67" is the aim camera gliding in at frame 138, before the swing. On the swing, push `camera.position` about 0.3 units along the view direction and ease it back over 0.15 s.
   - Golfer on the putt view: stop the golfer walking into the putt camera's line after the ball settles.
   - The calls that show it done:
     - Strike: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, swing 0.75` and `frames: 25`. Its Camera line should read "… and came back" after frame 151.
     - Landing: `feel` with the same steps plus `{wait:80}` and `frames: 30`. The landing at about frame 238 then falls inside the watched frames, and Particles should list a `landPuffs` rise and a sound there.

SCORE: 7.6

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
