# Isle Blitz

A mini tilt-shift arcade football game made with paprika3d, played on Shepherd Isle (`../shepherd-isle`): the island is
regrown around a full 100-yard field, 7 on 7 against a CPU side, 30 yards for a first down, turbo, late hits, an on-fire
streak, big heads, a play-select grid, day and floodlit night. The players are one CC BY figure skinned onto CC0
animation clips. It came from a five-hour `paprika-loop` run (34 iterations); LOOK.md, CHARACTERS.md and DESIGN.md are
the look, cast and design docs it was built from.

## Play

```
bun install
bunx serve .
```

Open the address it prints.

- **Play select:** arrows, Enter.
- **Move:** WASD or arrows. **Turbo:** Shift.
- **Offense:** Space snaps and passes to the highlighted receiver, Tab cycles receivers; with the ball, Space dives, E spins, Q stiff-arms.
- **Defense:** Space switches to the nearest defender, E dives for a tackle.
- **N** toggles night, **B** big heads, **Esc** pauses.

`game-tests.json` holds its saved checks for the paprika3d `test` tool. Model credits are in `assets/CREDITS.md`.
