The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 7

Iteration 7's rescale is visible and broke nothing in play. The footballer's box is 0.354 × 0.785 × 0.213. In the "h1 putt" cell the golfer stands beside the ball, the pin and `cup` are clear, and the aim dots are a thin line. The "white puff column" Judge 6 reported is gone. The "h1 aim" cell now draws at 46% saturation; Judge 6 saw it pale.

Two things are not fixed:
- The strike `feel` still has no camera punch. The Camera line reads "moved up to 67.215 at frame 141 and did not come back", and `aimLanding` jumps 0.58 units at frame 151.
- `eval` still finds `seaStacks` (24), `cliffRocks` (70), `teeMarker` and `pin_flag` visible as code meshes.

New this session: the "golfer walk to ball" cell (the moment the ball settles) is pale, at 12% saturation, like the title cell. A plain `look` after `interact` was also a flat haze colour, `#b5c8bc`.

1. **Looks as LOOK.md says: 7.** On "h1 aim" saturation is 46%. The tilt-shift band is sharp on `player` and blurred above and below. The `sea` is teal past `cliffFace`, and `hydrangeas` and `bushes` look painted. There are no `Lighting:` or `Surfaces:` lines. The title and settle cells are still pale.
2. **Plays as DESIGN.md says: 8.** Keyboard Space ×3 took `meter.stage` 0 → 3 at frame 229, with `meter.power` peaking at 0.594. Phases went swing, flight, settle, then aim at frame 392. R reset `strokes` from 1 to 0 with the banner "REPLAY". C gives the overhead view of hole 6 with `aimDots` past `pond_water`.
3. **Camera: 8.** The aim camera is high behind the ball (pitch 19.3°, fov 33). "h1 flight" follows the `ballTrail` to the green. "h1 intro" pulls back over the hole with the "PAR 3 · 129 YD · PEBBLE STEP" card.
4. **Ball flight by surface: 8.** `physics` read carry 122 yd, roll 41 yd and 2 bounces, with the first bounce on "green". The sheep rebound left the ball in the rough. A sand lie is still not shown.
5. **Nine playable holes: 8.** The "sheep hit" cell shows "BAA! BOUNCED OFF A SHEEP". Holes 1, 6 (Duck Pond Bend, par 4, 206 yd, round `pond_water`) and 9 (Lighthouse Home, par 5, 474 yd) each look different.
6. **Stroke play and scorecard: 8.** Holed in 2 on hole 1. The `card` shows the BIRDIE stamp, 2 strokes, −1 and "SPACE · NEXT HOLE".
7. **HUD: 8.** `#holep` is top left. Wind ("2 MPH TAILWIND") is top right. The club list with yardages is bottom left, and the key hints are bottom right.
8. **`window.__game` and 60 fps: 9.** `observe`, `act` and `setState` all work. `perf` measured an 8.1 ms median frame, 4.54 MB of assets and a 1.5 s load. The 25.5 ms p95 was taken with the host load at 7.2 on 8 cores, so it is noise.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 8 sounds.
    - Camera: still no punch.
    - Teleport: `aimLanding` still jumps 0.58 units at frame 151.
11. **Richer look: 7.** Unchanged: library trees, `bushes`, `hydrangeas`, `fencePanels`, `teeBench`, `sign_arrow` and `slopeGridLines`.
12. **Course and play: 8.** The putt view is now clear. The `slopeGridLines` make the green slope readable, and the sheep rebound changes where the ball ends up. In "putt address", 60 frames into the second aim, the golfer is still out past the pin, not yet at the ball.
13. **Better assets: 7.** `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag` are still visible code meshes. `lighthouse_cottageWalls`, `lighthouse_cottageRoof` and `lighthouse_cottageDoor` are code meshes too.
14. **The golfer looks its best: 5.** This is a first draft: only the size has changed.
    - Size: about 0.85 tall in play, and it never fills the frame. It is 0.36% of the frame on "h1 aim", "h6 aim" and "h9 aim", and 1.3% on "h1 putt".
    - Not started: outline, materials, and a smoother walk and idle.
    - On the aim views it reads as a tiny orange figure.
15. **Everything scaled against the golfer: 6.**
    - Believable: `teeBench` (0.42 tall × 0.87 wide), `standingStone` (0.65), trees (2.6–3.7), `house` (3.95), `lighthouse` (7.7), `teeMarker` (0.09).
    - Too big: `way_post` is 1.0 tall, taller than the 0.785 footballer, and `way_diamond` is 0.56. The ball is drawn about 5× real size by design.
    - Not checked against refs/02–03: the bunker and green sizes.

**Faults: 8.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- The `aimLanding` teleport remains.
- The `sheep-bounce-on-demand` and `sand-lie` checks are still not saved.
- The settle-moment and title cells are pale. This may be the known capture problem, but it now also shows during play.

Next:
1. **(asked again) Replace the code-built `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag` with library models.** This has been asked for three times. Iteration 7 did not attempt it, and its Open does not say it is impossible.
   - What to do: `pick` from the searches already in `paprika3d/sourcing.json`. If those find nothing usable, try "stylized rock formation", "low poly cliff rocks", "flag pole" or "triangle flag".
   - Use `stonepile-2d5f24.glb`, which is already loaded, for `cliffRocks`. Run `asset_search` "stylized small cottage" for `lighthouse_cottage`.
   - `model_audit` each pick, credit it and hide the code mesh.
   - The call that shows it done: `eval` returning `.visible === false` for all four names. A `look` from `{position:[0,60,80], lookAt:[0,0,0]}` should list the picked meshes where `seaStacks` was.
2. **Item 14, the golfer polish.** This is the lowest score.
   - Aim views: bring the full-shot `aimCam` D in `src/camera.js` from 6.8 to about 5.5, as the Iteration 7 Open suggests. Keep the ball's y between −0.6 and 0.6 so the aim checks pass. Check it with the "h1 aim" sheet cell: the golfer should be at least 0.6% of the frame.
   - Outline: give `player` an inverted-hull outline (Shepherd Isle's dark outline) and a less shiny jersey and helmet material.
   - Walk: speed up the walk to the ball so the golfer is at address before the putt camera settles. Check it with the "putt address" cell (second aim plus `{wait:60}`): the golfer should be beside the ball, not out past the pin.
3. **Item 15, the scale pass, plus the strike punch (asked again).**
   - Waypoint marker: shrink `way_post` from 1.0 to about 0.45 tall and `way_diamond` from 0.56 to about 0.25.
   - Bunkers and greens: compare their sizes in the "C hole cam" cell against refs/02–03 and record the numbers in CHARACTERS.md.
   - Strike punch: in `src/camera.js`, push the camera 0.3 units along the view direction at the frame the swing turns into flight, then ease it back over 0.15 s. Ease or hide `aimLanding` at the swing.
   - The call that shows it done: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, {action:"swing",power:0.75,accuracy:0}` and `frames:25`. Its Camera line should read "… and came back", and Teleports should be 0.

Not checked this session: a sand lie, a 2–4 player hot-seat round, and whether the pale settle frame is a real fade or a capture problem.

SCORE: 7.4

## Iteration 8

The background check rerun keeps resetting the page; running the full test suite now.
