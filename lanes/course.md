# course lane

## Owner feedback and final flag contract
- Critic finding 4: "the flag is a vertical accent, not a billboard".
- `FLAG` in pins.js: pole height 1.28 (about 1.5x the 0.85 golfer), radius 0.012, tapered bright pennant 0.30 x 0.17; no C-view enlargement. Cup ring radii 0.26/0.40.
- `aimTarget(H, pos, clubIdx)` exports the auto-aim target; `wayMark` displays it. Observe `course.waypoint` is its [x,z] or null when aiming at the pin.
- Observe `course` includes `pinVisible`, `pinScreen`, `cViewPinOk`, `flag`, `waypointSurface`, `waypoint`, `cViewCentre` and `cViewSpan`. Camera lane can use the last two for framing.
- `SPREAD = 1.2` remains the course scale. The historical C-view 2.6x note below is superseded by the true-size flag.

## Provides
- `pins.js` `aimTarget(H, pos, clubIdx)` -> `{x, z, pin}`: the point autoAim() aims at (same rule: the fairway point 0.8 x carry along `H.samp`, or the pin when near / putting).
- `pins.js` `wayMark` (Group `waypointMarker`: post, spinning diamond, ring): stands at `aimTarget` when it is not the pin and more than 2.5 away, during intro/aim/swing.
- Only the current hole's pin is visible (`H.pinG.visible`), switched on `hole:start` (and by polling `G.hole`).
- `__game.observe().course` = `{ pinVisible: bool[9], waypoint: [x,z] | null }`. `window.__course` = `{HOLES, BUNKERS, inland, surfaceAt, heightAt}` for the tools.
- `course.js`: winds are set per hole along the line of play (light cross-wind); bunkers are slid sideways out of a perfect drive's ray (`rayClear`) and off the greens.
- Events: none new.

## Notes
- A perfect drive runs out about 1.5 x the aim point's distance; holes 5 and 9 have their first-leg landing on the fairway, the corner lies there.
- island.js: blossom shrubs = `blossoms` instanced petals on green bushes; ducks scaled 0.46.

## Session 2: smooth ground, wider spread
- Ground: mowing stripes are now a 16 px/m baked texture (`stripeTex` in island.js, from `stripeAt` in course.js) read in the terrain shader with mipmaps + max anisotropy; no vertex-colour stripes. `grainTex` (tileable noise) is read at three scales/rotations for macro and micro variation.
- Spread: `SPREAD = 1.12` in course.js scales every hand-placed x/z (island, holes, bunkers, trees, house, pond, bell, cottage, path curves, fences). Terrain mesh grew to 78 x 54. **Look lane: the island now overflows the aim/overview frame left and right; pull the camera back / widen FOV ~12%.**

## Session 4: spread 1.2
- `SPREAD` raised 1.12 -> 1.2 (about 20% over the original 1.0). Terrain 78 x 54 still covers the isle. **Look lane: pull the aim/overview camera back a further ~7%.**

## Iteration 10 notes
- Par 3 tees (holes 1-3) pulled toward the green in src/course.js: iron needPower 0.88-0.89 (was 0.96-1.05). Hole 2 no longer needs a hud-lane club fix.
- C view: the current pin (pole, flag, knob) is drawn 2.6x with a yellow `pin_ring` disc under it (src/pins.js, driven by G.overhead).

## Iteration 15
- `__game.observe().course` also has `cViewCentre: [x,z]` (midpoint of ball and pin) and `cViewSpan` (ball-to-pin distance) so src/camera.js can frame pin and golfer in the C view.
