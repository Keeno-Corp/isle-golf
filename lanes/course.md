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
