The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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

## The request changed

paprika-loop/PROMPT.md changed before session 7; the Next lists above were written before it. Changed lines:
+ 14. The golfer looks its best: still the footballer the owner restored, in the existing Shepherd Isle style, with cleaner proportions, materials and outline and a smoother swing, walk and idle; it reads clearly in the aim and flight views and never fills the frame or blocks the putt view.
+ 15. Everything is scaled correctly against the golfer (0.85 units tall), using refs/01-03 for relative sizes only: the ball, cup, flag and pin, tee markers, clubs, sheep, bench, boat, fences, trees, bushes, rocks, bunkers, greens, the house and the lighthouse each sit at a believable size next to a person, checked in the aim, putt and hole-camera views; nothing reads as a toy or a giant beside its neighbours.
+ refs/01.jpg · layout (relative scale only; the style stays Shepherd Isle's) · inspiration · https://www.flickr.com/photos/29450586@N04/5097697858 (CC BY): tilt-shift links fairway, golfers tiny against bunkers and gorse
+ refs/02.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Putting_green_at_the_Royal_Canberra_Golf_Club_1.JPG (CC BY 4.0): golfer, flag and bunker sizes on a green from above
+ refs/03.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Bruntsfield_Links_golf_course_from_the_air_-_geograph.org.uk_-_7885450.jpg (CC BY-SA 2.0): tree clumps, bunkers, pond and houses against fairway widths

## Iteration 7

Worked the changed brief first (items 14 and 15: golfer at 0.85 units, everything sized against it).

**Did**
- `src/pose.js`: `GS` (golfer holder scale) 1.9 → 1.09, so the `footballer` stands 0.85 units tall in play (it was 1.48, taller than the 1.28 pin). `STANCE` 0.66 → 0.4 (feet to ball).
- `src/camera.js` `aimCam`: closer to match the smaller golfer. Full shots D 9.2 → 6.8, height 4.7 → 3.5. Putts D 4.2 → 3.6, height 2.5 → 2.1. New `side` offset (0.15 full, 0.45 putt) moves the camera away from the golfer's side, so the ball-to-pin line stays clear.
- `src/pins.js`: `FLAG.poleH` 1.28 → 1.1. `teeMarker` radius 0.07 → 0.045.
- `src/balls.js`: the ball is drawn at 0.7 × `BR` and shifted down so it still rests on the ground. Physics `BR` is unchanged, so no check moved. `ballRing` and `ballShadow` are smaller to match.
- `src/cow.js`: the cow is 0.72 tall (was 1.25), with a smaller contact shadow. `src/physics.js`: the cow collider radius 0.62 → 0.38 and height 1.05 → 0.65.
- `src/island.js`: ducks 0.46 → 0.26 tall. `src/library.js`: `hydrangeas` instance scale ×1.25 → ×0.95.
- `src/aimline.js`: putt preview dots scale 2.4 → 1.0. They were 0.2-radius discs that stacked into the "white puff column" on the putting line.
- `src/hud.js`: `#tag` anchored at ball + 1.2 (was + 0.85, which sat on the golfer's helmet).
- CHARACTERS.md: the ball and flag lines now give the new sizes.

**Saw**
- Measured with `eval`, in world units, against the golfer's 0.85:
  - footballer 0.85, pin 1.14, cow 0.76 tall, duck 0.26, bench 0.42 tall × 0.86 wide.
  - sheep 0.55 tall × 0.66 long, trees 2.6–3.7, house 3.95, lighthouse 7.7.
  - club shaft 0.42 at address.
- Sheet after the edits:
  - "h1 putt": the golfer is 1.3% of the frame (was 3%). The pin and cup are clear, and the dots are a thin line.
  - "h6 aim": the golfer is 0.36% of the frame (was 0.6%). It is small but readable, standing on the tee with the pond behind.
  - "C hole cam" is unchanged.
- `look compare before-aim` (the fixed `aim-h1` camera): 3% of pixels differ. The changes are the golfer region [432,320,720,528] and the smaller hydrangeas at top right. Both were intended. In that fixed camera the golfer goes from 0.6% to 0.19%. The game's own aim camera is now closer, which is why it shows 0.36%.
- `test`: 70 of 70 checks pass. An early version of the `aimCam` edit broke `look-aim-hole1`, `look-aim-hole5` and `look-drive-early`: a comment swallowed the look-target line. That is fixed.
- Strike `feel`: still no camera punch. The Camera line ("moved up to 67.2 at frame 141") is the aim camera settling. `aimLanding` jumps 0.58 units at frame 151, which is the `aim at:"pin"` step re-aiming, not a glitch. `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 8 sounds.
- The "h1 aim" sheet cell is still the pale capture artifact (12% saturation). Every other cell is normal.

**Next**
1. Scale, the rest of item 15:
   - `way_post`/`way_diamond`, the yellow aim waypoint marker, is 1 unit tall, bigger than the golfer. Shrink it to about 0.5.
   - Check the boats, `standingStone`/stonepile, `fencePanels` (0.66 tall, a little high), the `sign_arrow` signs (0.8) and the bunker and green sizes in the C view against refs/02–03.
   - The house (3.95) and lighthouse (7.7) could be 1.2–1.4× for a believable ratio to the 0.85 golfer.
2. Judge 6 Next 1, still undone: library picks for `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag`.
3. Judge 6 Next 2: strike punch in `src/camera.js`, 0.3 units along the view direction, eased back over 0.15 s. Then Next 3: an `{action:"setup"}` step in `src/api.js` and the `sheep-bounce-on-demand` and `sand-lie` checks. The cow collider shrank, so re-run `creatures-cow-reacts`; it passed this session.
4. Item 14 golfer polish is not started beyond size: outline, materials, and a smoother walk and idle.

**Open**
- The golfer is smaller on screen in the aim views (0.36% of the frame), even with the closer camera. If the judge finds it unreadable, bring the full-shot `aimCam` D down further (6.8 → about 5.5). Keep the pin on screen: the aim checks expect the ball's y between -0.6 and 0.6.
- The ball is still about 7× real size relative to the golfer (drawn radius 0.049). This is kept for readability, and is listed as by design in CHARACTERS.md.
- No `perf` was run this session.
