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
