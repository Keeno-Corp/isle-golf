# creatures lane
Observe key `creatures`: golferClip ('Idle_Loop'|'Celebration'|'Dance_Loop'|'Dismay'), shirt (hex), swingT, pose (-1 top of backswing .. 0 impact .. 0.9 follow-through), clubHead (driver|iron|wedge|putter), cow {state, alert, why, moos, x, z, yaw}, sheep [{x,z,state,tx,tz}], sheepHits, lastSheepHit, hitStop.
Events fired: `creatures:sheep-hit`, `creatures:sheep-tumble`. Listened: `holed` (bogey or worse -> Dismay), `ball:water`, `ball:ob` (Dismay), `ball:sheep`, `ball:cow`, `ball:land`.
Golfer: code-built joint hierarchy (golfer.js), posed by hand every frame with two-bone arm IK (pose.js `updateGolfer`); stands 0.58 from the ball (STANCE); walks to a ball more than 1.2 away.
setState {creatures:{sheep:{i,x,z,wait}}} places a sheep.

## Footballer (session 3)
`foot` in src/pose.js: assets/player-anim.glb (Idle_Loop, Celebration, Dance_Loop) stands beside the golfer (behind-left, eased follow, faces the ball), cheers on `holed` birdie/par/better and on `ball:sheep`. Clean helmet: glossy blue shell (roughness 0.3, metalness 0), white stripe, facemask bars, all crisp; his own textures keep only the colour map. Observe: `creatures.footballer` {x, z, clip, visible, ready}.

## Session 8
asset_search for "low poly sheep" and "low poly golfer" (rigged): library unreachable (HTTP 530), no hits, so sheep and golfer stay code-built. Footballer now stands 2.2 behind / 2.4 beside the golfer and plays Celebration when a ball lands on fairway or green.

## Session 9
- `creatures.golferClip` now reads address/backswing/downswing/follow through aim..settle; reactions (Celebration, Dance_Loop, Dismay, Walk) override.
- Footballer stands 3.0 back from the ball against the aim, 1.5 to the side away from the golfer.
- `asset_search` retry not done this session (not run).

## Session 12
Reactions proven by calling `golferClip` (dynamic `import('/src/golfer.js')` in eval): Dance_Loop, Dismay and Celebration each read back in `creatures.golferClip`. Celebration look: arms up, shirt red, edge contrast 0.146. Firing `holed` alone does not play par/birdie: those are round.js's (round.js:52); pose.js only handles bogey+ Dismay.

## Session 13
- A real drive then putt on hole 1 reached `holed` with `Celebration` (golfer and footballer); no `round.js:71` error reproduced.
- Console: `SFX[k] is not a function (src/sound.js:71:61)` during play. Not the creatures lane's file; for the lead.
- Sheep bonk seen in play (`sheepHits` 1, tumble). A saved hole-out check needs the sheep parked by `setState`.

## Session 14
- The `sound.js:71` error is `play('gull')` in main.js:52: `SFX.gull` is not defined in sound.js. Not this lane; for the lead (add a `gull` entry or guard `SFX[k]?.()`).
- Kit colour, 2-player game, ISLA's turn: `golfer_shirt` samples #d33d29 / #d5402a (target #d8503a ±30). FINN's turn not sampled.
