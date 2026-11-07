# creatures lane
Observe key `creatures`: golferClip ('Idle_Loop'|'Celebration'|'Dance_Loop'|'Dismay'), shirt (hex), swingT, pose (-1 top of backswing .. 0 impact .. 0.9 follow-through), clubHead (driver|iron|wedge|putter), cow {state, alert, why, moos, x, z, yaw}, sheep [{x,z,state,tx,tz}], sheepHits, lastSheepHit, hitStop.
Events fired: `creatures:sheep-hit`, `creatures:sheep-tumble`. Listened: `holed` (bogey or worse -> Dismay), `ball:water`, `ball:ob` (Dismay), `ball:sheep`, `ball:cow`, `ball:land`.
Golfer: code-built joint hierarchy (golfer.js), posed by hand every frame with two-bone arm IK (pose.js `updateGolfer`); stands 0.58 from the ball (STANCE); walks to a ball more than 1.2 away.
setState {creatures:{sheep:{i,x,z,wait}}} places a sheep.
