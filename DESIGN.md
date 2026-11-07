# Design doc: Isle Golf
## Core loop
Aim, pick a club, swing with the three-click meter, watch the ball fly, bounce and roll, then play on until it drops in the cup; nine holes make a round scored against par.   (builder's call; study/STUDY.md: motion note)
## Controls
Mouse or keyboard. Aim: A/D or arrows (hold Shift for fine), or drag the mouse sideways. Club: W/S or Q/E or the wheel (driver, iron, wedge, putter), auto-picked by distance and lie. Swing: Space or click three times: start the meter, set the power, snap the needle back onto the line (early hooks, late slices, a click on the line is straight). A cyan notch on the bar marks the power that reaches the pin. On the green the putter shows a short aiming line and a slope grid of downhill arrows. C = hole camera, R = replay the hole, M = sound, N = evening light. Title: 1-4 players, Space.   (answers; study/STUDY.md)
## Progression
One 9-hole round with a running total against par; nothing is lost between rounds (the best total per player count is kept in the browser).   (answers)
## Win and lose
Stroke play: every hole is scored against its par (hole in one, eagle, birdie, par, bogey, double bogey stamps on the scorecard after each hole); the lowest total wins. Solo, or 2 to 4 players in hot seat: each has a kit colour, the lowest score of the last hole tees off first, then the ball farthest from the cup plays. Water costs a stroke and a drop; out of bounds (the sea beyond the cliffs) costs a stroke and a replay from the same spot; nine strokes ends a hole.   (answers)
## Levels
Nine holes laid over Shepherd Isle: 1 Pebble Step, 2 Gorse Run, 3 Bluff Edge (par 3), 4 Lantern Road, 5 Chimney Turn (dogleg round the house), 6 Duck Pond Bend (dogleg round the pond), 7 Mid Meadow, 8 Bell Hill Back (par 4), 9 Lighthouse Home (par 5, finishing by the lighthouse). Sand pots near each green, trees, wind per hole shown by the pin flag and the HUD pennant, sheep wandering across fairways, the cow south of the pond. 1 world unit = 12 yards on the HUD.   (answers)
## Feel
Arcade: the ball arcs high and floaty, the wind pushes it in flight, a perfect snap is a straight shot, a sheep bounce stops the action for a beat with a baa and a heart, tree hits shake the leaves, the cup pulls a slow ball in. The camera follows the ball and eases to the green.   (answers; study/STUDY.md)
## Audio
Synthesised: thwack, meter ticks, thuds, sand hiss, rustle, splash, baa, moo, cup rattle, jingle for a birdie, gulls and surf.   (study/STUDY.md)
## UI
HUD in the Isle Blitz type restyled for golf (LOOK.md, UI and type): hole panel top left, wind top right, power meter bottom centre, clubs bottom left, centre banner for calls, scorecard with stamps.   (answers)
## Decisions
Surfaced (asked, or to ask):
- Tone: cosy-arcade, small comedy from sheep, ducks and the cow. Asked (answers).
- Progression: one 9-hole round with a total vs par. Asked (answers).
Left to the builder:
- Meter timing: 1.15 s up, 1.0 s back, a 0.05 s exact snap window (recommended, arcade-forgiving).
- Pick-up at nine strokes (recommended).
- Hole-in-one counted as the stamp of the best result.
## Decision log
2026-11-07 · tone · cosy-arcade · over tense, comic · person (the session's answers)
2026-11-07 · progression · one 9-hole round vs par · over a tour, endless · person
2026-11-07 · golfer model · the island's skinned figure · over a new library model (the asset library was unreachable, no web asset passed the licence check) · builder, unasked
