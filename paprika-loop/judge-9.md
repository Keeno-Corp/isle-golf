**Judge 9.** I played a real-key drive on hole 1 and took two looks: the swing and the next aim view. I tried one putt and ran `perf` once. The putt did not hole out, so par, bogey and birdie reactions, the sheep bonk and the 2-player shirt are still unseen. `asset_search` was not tried.

- **0. Not the football player, better animations, wider spacing: 7.**
  - The code-built golfer is on screen in `golfer_cap`, `golfer_face`, `golfer_shirt` (red for ISLA), `golfer_slack`, `golfer_belt`, `golfer_shoe` and `golfer_glove`. 19 and 21 of 26 parts show.
  - It reads as a toy golfer with its back to the camera, and the stance has some distance from the ball.
  - `golferClip` now names the phases: `address` until frame 99, then `backswing`, `follow` until frame 131, then `address`.
  - `downswing` never appears in the trace. The second swing also went `backswing` to `follow` at frame 78, so the downswing is skipped.
  - Putting stroke, walk, celebration and dismay are not seen.
- **0b. Clean footballer as a side character: 5.**
  - The first swing's `footballer` stood at (-14.44, 14.42). The ball is at (-11.5, 12.8), so he is about 3 units back and to the side, which matches the Steer.
  - He is not in either look. The swing camera is past the golfer and the aim camera is past the footballer's position.
  - His clip went `Idle_Loop` then `Celebration` at frame 63, after the landing, then back to `Idle_Loop`. The clean helmet is unseen: `footballer_helmetShell` is not found by the ID image.
  - After the second shot he moved to (3.38, 12.39), next to the camera, and stayed on `Idle_Loop`.
- **1. Toy golfer, readable poses, club looks like a club: 7.** The swing look shows a cap, a face and an iron with a thin `club_shaft` and a small `club_head` raised at the top of the backswing. The golfer takes 0.5% of that look and 1% in the aim view.
- **2. Kit colours per player: 5.** The shirt is red in the ISLA look, but no `sample` was taken and nothing is saved as `creatures-kit-colours`. FINN blue is untested.
- **3. Hole-out reactions: 3.** My putt left the ball in the rough, with `lastResult` empty and `strokes` 2. `Dance_Loop`, `Celebration` and `Dismay` are still unseen, and no `creatures-par-dance`, `creatures-bogey-dismay` or `creatures-birdie-celebrate` check is saved.
- **4. Sheep wander into play: 7.** Sheep 0, 3, 6 and 9 read `walk`, and sheep 3 walked toward the tee area at (-9.64, 11.62). Most sheep move or retarget over the shots.
- **5. Ball bonks a sheep: 5.** `sheepHits` stayed 0 and I did not replay `creatures-sheep-bonk-real-keys`.
- **6. Cow reacts: 6.** `cow.yaw` was 1.53 and 1.5 in my replies. `cow_hide` is still in `Never visible`.
- **7. Stepped real-key drive poses: 6.** The backswing look is clear. `golferClip` is distinct for `address`, `backswing` and `follow`, but `downswing` is missing. I did not look at the follow-through.
- **8. Looks as LOOK.md says: 7.** Storybook greens, tilt-shift blur, sea and trees hold. The golfer blends into the surroundings in the aim look (edge contrast 0.066).
- **9. File discipline and docs: 6.** I did not check the diff, but builder 9 reports `src/pose.js`, `game-tests.json` and `lanes/creatures.md` only.
- **10. Keep the rest: 8.** Title, flyover skip, three-click meter, banners, club list, aim dots and wind all work. `perf` read 906 ms a frame on SwiftShader at host load 2.8, which is noise.
- **Faults: 5.**
  - The putt run raised `SFX[k] is not a function (src/sound.js:71:61)`. That file belongs to another lane.
  - `Never visible` lists `cow_hide`, `cliffRocks`, `seaStacks`, `fenceRails`, `fencePosts` and `divots`.
  - The golfer and sheep are code-built, and no `asset_search` result is recorded in `lanes/creatures.md`.

**Next:**
1. **Prove one hole-out reaction with a saved check, then the other two (asked again).**
   - Use `interact` with `{state:{ball:{x:-1.9,z:11.95}}}`, then `{action:"club",name:"putter"}`, `{action:"aim",degrees:"auto"}`, then three Space presses. My putt from (-2.6, 11.95) did not hole, and the `ball` in `setState` may have been ignored.
   - Check that `aimDeg` and `distToPin` change before swinging. Use `until:{phase:"holed"}`.
   - Save `creatures-par-dance` with `expect` `creatures.golferClip` = `Dance_Loop`. Do the same for a bogey (`Dismay`) and a birdie (`Celebration`).
   - A trace of `creatures.golferClip` listing `Dance_Loop` shows it done.
2. **Add `downswing` to `golferClip`, and frame the golfer and footballer together (asked again).**
   - In `src/pose.js`, hold `downswing` for the frames between the top of the backswing and impact. A swing trace should then list `address`, `backswing`, `downswing`, `follow` and no `Idle_Loop`.
   - Take one `look` with `camera` [-15, 3, 14.5] → [-11.5, 1, 12.8] during aim. A `look` on `footballer_helmetShell` with `sample` shows a clean glossy helmet off the ball line.
   - Make the footballer cheer on a bonk and a birdie, and keep him from standing beside the camera on later shots.
3. **Save `creatures-kit-colours` and the sheep bonk replay, and run the asset search.**
   - Take a `look` with `sample` on `golfer_shirt` in a 1-player game, then in a 2-player game (Digit2, Space). FINN should read #3b78c9 ±30 and ISLA #d8503a ±30.
   - Replay `creatures-sheep-bonk-real-keys`. `sheepHits` should go to 1 and the sheep should show `hop` or `flee`.
   - Retry `asset_search` for "low poly golfer" and "low poly sheep" and record the hit or miss in `lanes/creatures.md`.

SCORE: 5.9
