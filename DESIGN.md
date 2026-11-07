# Design doc: Isle Blitz
## Core loop
Pick a play from a 3 by 3 chalkboard grid, snap the ball, run or pass against a CPU defense, and keep moving the chains: 30 yards for a first down, four downs, score touchdowns and extra points; when the drive ends the sides swap and you play defense against the CPU offense. Two short halves of a game clock; the higher score wins.   (study/STUDY.md; refs/01-blitz2000-presnap.png)
## Controls
Keyboard and gamepad. Move: WASD or arrows or left stick. Turbo: Shift or a trigger (a meter that drains and refills). Offense: Space snaps and passes to the highlighted receiver, A/D or the stick cycles the receiver; with the ball, Space jumps or dives, E spins, Q stiff-arms. Defense: Space switches to the nearest defender, E dives for a tackle, and a tackle after the whistle is a late hit that still lands. Touch: a virtual stick and two buttons. Play select: arrows or tap a tile, Enter confirms, a hidden-cursor toggle with H.   (study/STUDY.md; builder's call)
## Progression
One match at a time, no season. On-fire streak: three straight completions to the same receiver, or two straight sacks, set the player alight (flames, unlimited turbo, sticky catches) until the other side scores or the half ends. A big-head toggle in the pause menu, on by default.   (study/STUDY.md)
## Win and lose
The game is two halves of 2 minutes each (clock runs during plays and stops on incompletions, scores and out of bounds). Win by score at the final whistle; a tie goes to a sudden-death overtime drive. Nothing is lost between matches.   (builder's call)
## Levels
One field, on the island, in two lights: day (default) and floodlit night (N key). The island is regrown around a full 100-yard field with 10-yard end zones: the meadow flattens and widens to hold the field, the house, pond, lighthouse and trees move to a ring around it, sheep, ducks and the cow stand along the sidelines as the crowd, and a small timber stand sits on each long side.   (refs/06-diorama-day.png; refs/04-island-current.png; person: full field, island regrown)
## Feel
Arcade-fast and exaggerated: sprint at 8 to 9 m/s with turbo, hits that throw the tackled player a body length, pile-ups, a little camera shake on every tackle and a grass spray burst at each cut; the ball carrier runs with a slight bob and arm flap. Players never fall off the island: the field edge is the sideline and out of bounds ends the play.   (refs/05-tiltshift-runner.png; study/STUDY.md motion note)
## Audio
One announcer voice (synthesised phrases or short recorded clips written fresh) shouting the call after each play, crowd swell on big plays, a whistle, thuds, surf and gulls under everything.   (study/STUDY.md sound note)
## UI
Scoreboard top left; centre banner for the call and down and distance; turbo pill bottom left; the play-select grid between plays with a General Info panel for the first play; a pause menu with big-head and sound toggles. Fonts: a heavy condensed italic sans, yellow on dark steel.   (LOOK.md, UI and type)
## Decisions
Surfaced (asked, or to ask):
- Teams: two invented island sides with their own kits, names and a small crest. Asked: two invented island sides (the names are the builder's; the announcer uses them).
- Match length: two 2-minute halves with a halftime side swap and sudden-death overtime. Asked: two 2-minute halves.
Left to the builder:
- Camera: follow behind the offense, narrow FOV (recommended, LOOK.md Camera).
- Play book: 9 offense plays (3 runs, 6 passes) and 9 defense plays, drawn as chalkboard tiles.
- CPU: the defense reads the play tile and reacts with a short delay; the CPU offense picks a random play weighted by down and distance.
- Big-head mode: on by default, toggle in the pause menu.
## Decision log
2026-11-05 · field · full 100-yard field, island regrown · over a short field on the meadow, a tiny pitch · person
2026-11-05 · scope · full mini-game vs CPU · over offense-only drill, two-player hot seat · person
2026-11-05 · references · Blitz arcade field views 1 to 3 kept; the person's three tilt-shift pictures added; the Shepherd's Isle look kept as the base · person
2026-11-05 · teams · two invented island sides · over colour-only kits, a team-select screen · person
2026-11-05 · match length · two 2-minute halves · over one drive each, first to 21 · person
2026-11-05 · player model · library ccde5e37 "Happy Cheff", shrunk and animated in code · over the animated low-poly pair, the rugby figure, the big-head toy, code · person
