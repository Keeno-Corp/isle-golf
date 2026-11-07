# creatures lane
Observe key `creatures`: golferClip ('Idle_Loop'|'Celebration'|'Dance_Loop'|'Dismay'), shirt (hex), swingT, pose (-1 top of backswing .. 0 impact .. 0.9 follow-through), clubHead (driver|iron|wedge|putter), cow {state, alert, why, moos, x, z, yaw}, sheep [{x,z,state,tx,tz}], sheepHits, lastSheepHit, hitStop.
Events fired: `creatures:sheep-hit`, `creatures:sheep-tumble`. Listened: `holed` (bogey or worse -> Dismay), `ball:water`, `ball:ob` (Dismay), `ball:sheep`, `ball:cow`, `ball:land`.
Golfer: code-built joint hierarchy (golfer.js), posed by hand every frame with two-bone arm IK (pose.js `updateGolfer`); stands 0.58 from the ball (STANCE); walks to a ball more than 1.2 away.
setState {creatures:{sheep:{i,x,z,wait}}} places a sheep.

## Footballer (session 3)
`foot` in src/pose.js: assets/player-anim.glb (Idle_Loop, Celebration, Dance_Loop) stands beside the golfer (behind-left, eased follow, faces the ball), cheers on `holed` birdie/par/better and on `ball:sheep`. Clean helmet: glossy blue shell (roughness 0.3, metalness 0), white stripe, facemask bars, all crisp; his own textures keep only the colour map. Observe: `creatures.footballer` {x, z, clip, visible, ready}.
