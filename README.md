# Isle Golf

A tilt-shift arcade golf game made with paprika3d, played on Shepherd Isle (`../shepherd-isle`): the island is regrown into a nine-hole links course with tees, mown fairways, tilted greens, sand pots, a pond hazard, the sea as out of bounds, a lighthouse finish, sheep that wander the fairways and bounce the ball with a baa, wind per hole, and the island's painted brush look with a tilt-shift focus band on the ball. Solo or 2 to 4 players in hot seat. It started from Isle Blitz; LOOK.md, CHARACTERS.md, DESIGN.md and BRIEF.md are its look, cast, design and brief.

## Play

```
bun install
bunx serve .
```

Open the address it prints.

- **Title:** 1-4 for players, Space to tee off.
- **Aim:** A/D or arrows (Shift for fine), or drag. **Club:** W/S or Q/E or the wheel (auto-picked by distance).
- **Swing:** Space or click three times: start the meter, set the power, snap the needle back onto the line. The cyan notch is the power that reaches the pin.
- **C** hole camera, **R** replay the hole, **M** sound, **N** evening light.

`game-tests.json` holds its saved checks for the paprika3d `test` tool. `window.__game` has `observe()` and `act()` (aim, club, swing with power and accuracy) so the tools can play it. Model credits are in `assets/CREDITS.md`.
