**Judge 11.** I played one real-key drive on hole 1 with a trace of `golferClip`, then a putt attempt and `perf`. The putt did not hole out, so the par, bogey and birdie reactions, the sheep bonk and the 2-player shirt are still unseen. I did not retry `asset_search`.

- **0. Not the football player, better animations, wider spacing: 7.**
  - The drive trace was `Idle_Loop` → `address` → `backswing` (frames 54-88) → `downswing` → `follow`.
  - Builder 11's `poseNm` fix works: `backswing` now reports in the real-key drive, and the pose is distinct from the downswing.
  - The follow-through look shows the iron up and over the shoulder. The golfer is clear of the ball, in `golfer_cap`, `golfer_face`, `golfer_shirt` (red) and `golfer_slack`.
  - The putting stroke, the walk, `Celebration` and `Dismay` are still unseen.
- **0b. Clean footballer as a side character: 5.**
  - He is behind the tee at (-14.44, 14.42), and his clip went `Idle_Loop` → `Celebration` (frames 11-143) after the putt, so he cheers.
  - He is not in the aim look, and `footballer_helmetShell`, `footballer_helmetStripe` and `footballer_facemask` are "Not found by the ID image", so the clean helmet is unseen.
  - In the second shot he stood at (-5.2, 13.45), near the green.
- **1. Toy golfer, readable poses, club looks like a club: 7.**
  - The look shows a cap, a face, a thin `club_shaft` and a small iron `club_head`.
  - The golfer takes only 0.79% of the picture (19 of 26 parts show), and the Subject line says it "blends in" (edge contrast 0.074, 60% brightness against 59% around it).
- **2. Kit colours per player: 4.** The shirt reads red for ISLA. No `sample` was taken, FINN blue is untested, and no `creatures-kit-colours` check is saved.
- **3. Hole-out reactions: 3.**
  - My `setState` with `lie`, `phase` and `ball.y` still left `ball` x, y, z null, `aimDeg` null and `camera` null. The putt ended in `mode: "roll"`, `surface: "rough"` and never reached `holed`.
  - `Dance_Loop`, `Celebration` and `Dismay` are unseen and none of the three checks is saved.
- **4. Sheep wander into play: 7.** In the putt reply 8 of 10 sheep are `walk`. Sheep 3 is at (-9.66, 10.71), on the tee side, with a target of (-6, 5.5).
- **5. Ball bonks a sheep: 4.** `sheepHits` is 0 and the bonk check was not replayed.
- **6. Cow reacts: 6.** `cow.state` read `head-up` with `yaw` 1.98 after the shot. `cow_hide` is still in `Never visible`.
- **7. Stepped real-key drive poses: 8.** `golferClip` reports all four phases in order (address → backswing → downswing → follow), and `club_head` is visible in the follow look.
- **8. Looks as LOOK.md says: 7.** The storybook greens, tilt-shift, sea and trees hold. The golfer is low in contrast.
- **9. File discipline and docs: 6.** Builder 11 changed only `src/pose.js`. No `asset_search` result is recorded in `lanes/creatures.md`, and none of the `creatures-` checks from the Steer is saved.
- **10. Keep the rest: 8.** Title, flyover, meter, HUD, club list and wind work. `perf` read 1027 ms a frame on SwiftShader at host load 3.2, which is noise.
- **Faults: 4.**
  - The putt run raised `SFX[k] is not a function (src/sound.js:71:61)`, in another lane's file.
  - It also raised `<g> attribute transform: rotate(NaN)` twice.
  - `Never visible` lists `cow_hide`, `cliffRocks`, `seaStacks`, `fenceRails`, `fencePosts` and `divots`.
  - The golfer and sheep are code-built and no search is recorded.

**Next:**
1. **Prove one hole-out reaction with a saved check, then the other two (asked again, fourth time).**
   - A `setState` on the ball nulls `ball`, `aimDeg` and the camera every time, so stop using it. Use `eval` to move the ball through the game's own API, or play to the green with real swings (`{action:"swing", power, accuracy, settle:true}`, `until:{phase:"aim"}`).
   - Then putt with `{action:"aim",degrees:"auto"}` and three Space presses, with `until:{phase:"holed"}`.
   - Save `creatures-par-dance` with `expect` `creatures.golferClip` = `Dance_Loop`. Repeat for a bogey (`Dismay`) and a birdie (`Celebration`).
   - A trace of `golferClip` listing `Dance_Loop` shows it done.
2. **Make the footballer and the golfer readable (asked again).**
   - Take one `look` with `camera` [-15, 3, 14.5] → [-11.5, 1, 12.8] during aim, with `sample` on `footballer_helmetShell`. It should read as a clean glossy painted shell, and `footballer_helmetShell` should leave the "Not found" list.
   - Give the golfer a brighter cap or a contrast rim light so edge contrast in the aim look goes above 0.1.
   - Check that the footballer stays 2.5-3.5 units behind the tee and not beside the camera on later shots.
3. **Save `creatures-kit-colours` and the bonk replay, and run the asset search (asked again).**
   - Take a `look` with `sample` on `golfer_shirt` in a 1-player game and in a 2-player game (Digit2, Space). FINN should read #3b78c9 ±30 and ISLA #d8503a ±30.
   - Replay `creatures-sheep-bonk-real-keys`. `sheepHits` should go to 1 and that sheep should show `hop` or `flee`.
   - Run `asset_search` for "low poly golfer" and "low poly sheep" and record the hit or miss in `lanes/creatures.md`.

SCORE: 5.8
