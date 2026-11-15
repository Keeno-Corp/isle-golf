# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1

Feel is measured (strike: 32 bits at the impact frame, shake peak 0.158; hole-out: 69 bits). Saving two checks for it, then running the full suite and writing the handoff.

### Judge 1

1. **Looks as LOOK.md says: 7.** Check 1 passes in the aim view: the top fifth is blurred and the band on `ball1` is sharp. Check 2 passes for the sea at the title corners (#055753 and #036862 against #0f6a67); the fairway was not sampled. Check 3 passes, with `#meterp` shown only during the swing. Check 4 passes with no `Lighting:` or `Surfaces:` lines. Two faults: the two-player intro of hole 6 drew a flat pale frame with no scene (brightness 72%, saturation 13%, only the "HOLE 6 / ISLA TO PLAY" banner), and large flat white blobs sit unshaded in the aim view (bottom centre near [390–550, 650–800], probably `blossoms`).
2. **Plays as DESIGN.md says: 8.** A/D moved `aimDeg` 358 → 0.1 → 358, W/S switched iron → driver → iron, C toggled `overhead` on and off, and three Space clicks ran `meter.stage` 0 → 2 → 3 with "SNAP 58%" then "SLIGHT SLICE". R, the mouse drag and the wheel were not played.
3. **Camera: 8.** It sits behind the ball at 20.9° pitch and follows the flight (`camera.x` -22.0 → -17.0), and the flyover opens from the diorama. The aim FOV is 33 where LOOK.md says about 30.
4. **Ball flight: 8.** `ball.y` arced 4.53 → 5.43, the wedge carried 45 yards with two bounces on the green, the wind flipped from tailwind to headwind with the aim, and `landRingPreview` and `ballTrail` showed. Sand, water and out of bounds were not played.
5. **Nine holes: 8.** Seen: Pebble Step (par 3, 129 yd), Duck Pond Bend (par 4), Mid Meadow, Lighthouse Home (par 5, 474 yd), with flags, bunkers, pond, house, lighthouse, trees and ten wandering sheep. The sheep bounce was not played.
6. **Stroke play and scorecard: 8.** The card after hole 1 shows the par row, ISLA's 2 and a BIRDIE stamp with "SPACE · NEXT HOLE"; the two-player start shows "ISLA TO PLAY". Kit colours for players 2–4 were not seen.
7. **HUD: 9.** `#holep` top left, `#windp` top right, `#meterp` bottom centre, `#clubp` bottom left, cream on green steel, no overlap. The `#tag` "ISLA" sits over the golfer's chest, and `#hinter` keeps showing aim keys during flight.
8. **`window.__game` and 60 fps: 9.** `observe`, `act` and `setState` all drove the play. Median frame 1.9 ms, within budget; p95 19.2 ms was read on a busy host (load 4.5 on 8 cores). 530,118 triangles and 158 draw calls are over the guides.
9. **Golfer matches CHARACTERS.md: 5.** On screen the golfer is a footballer: teal `footballer_helmetShell`, shoulder pads, a number 4 jersey and black trousers. CHARACTERS.md gives a cream cap and cream-khaki trousers. Only the red kit shirt matches. No brands on screen.
10. **Game feel: 7.** The strike gave `feelBits` 0 → 29, a `ballShadow1` scale pop and an FOV kick of 33 → 33.93; the green landing gave `landPuffs` and 14 bits. `feel` found no colour flash, no out-and-back camera shake and no sounds on the strike. The hole-out was not measured this session.
11. **Richer look: 7.** Library trees, cottage, standing stones, benches and boats are in, and evening light works. The golfer has backswing and follow poses but its shadow is a hard dark shape, and `bushes` are still faceted code blobs filling the foreground.
12. **Course and play: 7.** `slopeGrid` arrows read clearly on the green, and the flow from hole to card worked. How differently the holes play was only partly seen.
13. **Better assets: 7.** Sheep, trees, lighthouse tower, cottage, stones, benches and boats are from the library with credits. `sourcing.json` holds no search for `bushes`, `sign_post`/`sign_board`, `teeMarker`, `pond_cattail`/`pond_lily`, grass or sand textures, or the sky.

**Faults: 6.**
- The blank pale frame in the two-player hole 6 intro.
- After a second shot made with the `swing` action and `settle:true`, the golfer stood at (-3.2, 15.24), beyond the pin, with the ball at (-1.02, 14.19) on the green.
- `divots` was never visible after two shots.
- One three.js warning at load (`toNonIndexed`: already non-indexed).
- 183 frames ran over three times the median, on a busy host.

Next:
1. Run `asset_search` for the objects still made in code with no search on record: `bushes` ("stylized bush hand painted shrub"), `sign_post` and `sign_board` ("wooden signpost stylized"), `teeMarker`, pond reeds and lilies, and grass and sand textures ("stylized painted grass texture"). Replace the 327 faceted `bushes` first, since they fill the aim view; the aim look on hole 1 should show soft painted shrubs.
2. Fix the blank pale frame: start two players, `setState {hole: 5}`, `next`, and the intro of hole 6 draws only haze. The same look should show the island under the "ISLA TO PLAY" banner, with saturation near 45%. While there, place the golfer beside the ball after every settle; `creatures.footballer` should be within about 0.5 units of `ball` in the putt view.
3. Make the golfer and CHARACTERS.md agree: either give the figure the cream cap and cream-khaki trousers the sheet asks for, or rewrite the Golfer entry for the footballer the repo's commits restored. Then add an out-and-back camera shake and a sound to the strike, so `feel` on the `swing` action reports a camera lurch and at least one sound started.

Not checked: R replay, mouse input, sand, water, out of bounds, the sheep bounce, the hole-out feel and holes 2–5 and 8.

SCORE: 7.4

## The request changed

paprika-loop/PROMPT.md changed before session 2; the Next lists above were written before it. Changed lines:
+ 10. Game feel: the three-click meter, the strike, the ball's flight, each landing by surface, the hole-out and the camera follow each answer with feedback a player feels (motion, a short hit-stop or shake, particles, sound), measured with `feel`.
+ 11. Look: richer course detail, lighting, water and golfer animation than the starting commit, still inside LOOK.md's Checks.
+ 12. Course and play: each of the nine holes plays differently, putting has a readable green slope, hazards and sheep change the shot a player picks, and the flow from hole to scorecard to next hole never stalls.
+ 13. Better assets: the key things a viewer sees (trees, rocks, the house, the lighthouse, sheep, flags, course props, textures, the sky) come from the paprika3d library through `asset_search` where it has a higher-quality match in the stylized Shepherd Isle look, each picked one checked with `model_audit` and credited; code-built stand-ins are replaced first. Nothing paid and no generated models.

## Iteration 2

Real load error after the batch edit. Locating the exact column.

### Judge 2

The page does not load, so nothing in the brief could be seen or played. `open` failed twice (on `.` and on `index.html`) with "no window.__game, three.js renderer or WebGL canvas" and the console error `Unexpected token 'export'`. Every item scores 1 because the page shows none of it; the session 2 work in the source is unjudged.

1. **Looks as LOOK.md says: 1.** No canvas, so no look and no Checks could be read.
2. **Plays as DESIGN.md says: 1.** `window.__game` does not exist, so no input could be sent.
3. **Camera: 1.** Not drawn.
4. **Ball flight: 1.** Not playable.
5. **Nine holes: 1.** Not drawn.
6. **Stroke play and scorecard: 1.** Not reachable.
7. **HUD: 1.** Not seen.
8. **`window.__game` and 60 fps: 1.** `window.__game` is missing and `perf` cannot run on a page with no renderer.
9. **Golfer matches CHARACTERS.md: 1.** Not drawn.
10. **Game feel: 1.** `feel` cannot run. `src/juice.js` holds a strike punch (`FEEL.strikePunch`) and per-surface sprays, unmeasured.
11. **Richer look: 1.** Not drawn.
12. **Course and play: 1.** Not playable.
13. **Better assets: 1.** `src/library.js` now swaps in library `bushes`, `hydrangeas`, `sign_arrow` and `pond_cattailPlant`, but none of it reaches the screen.

**Faults: 1.**
- The module graph fails to parse: `Unexpected token 'export'`, which means an `export` sits inside an unclosed brace or bracket in one file under `src/`.
- I did not find the file. `src/juice.js` lines 12–77 and `src/library.js` lines 14–108 read as balanced. Not read: `main.js`, `api.js`, `pose.js`, `golfer.js`, `sound.js`, `camera.js`, `post.js`, `hud.js`, `island.js`.
- `src/stage.js:9` has its closing semicolon swallowed into the trailing comment ("…never an empty canvas;"). Automatic semicolon insertion should cover that line, so it is probably not the cause, but it shows the batch edit damaged line ends.
- The builder's own Iteration 2 note says the load error was still open when the session ended.

Next:
1. Fix the load error before anything else. Run `node --check` on each file in `src/` (or `bun build src/main.js`) to get the file and line of the stray `export`, close the brace the batch edit left open, and restore the semicolon on `src/stage.js:9`. Done when `open` returns the title diorama with no console error and `observe` returns state.
2. (asked again) Fix the blank pale frame in the two-player hole 6 intro and the golfer's place after a settle. The call that shows it: `look` with `sheet` of one moment (two players, `state {hole: 5}`, action `next`) shows the island under "ISLA TO PLAY" at saturation near 45%; an `interact` swing with `settle:true` shows `creatures.footballer` within 0.5 units of `ball`.
3. (asked again) Make the golfer and CHARACTERS.md agree by rewriting the Golfer entry for the footballer the owner restored, and prove the strike feel. The call that shows it: `feel` on the `swing` action reports a camera move out and back and at least one sound started. Then take the hole 1 aim `look` to confirm the library `bushes` and `hydrangeas` read as soft painted shrubs with no `Surfaces:` line.

Not checked: everything on the page; I also could not run a syntax check myself, so the faulty file is still to be located.

SCORE: 1.0
