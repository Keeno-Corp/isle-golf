# course lane

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
