The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 10

**Judge 10.** I played one real-key drive on hole 1 with a trace of `golferClip` and took a look after it. I then tried a putt from (-2.4, 11.95) and ran `perf` once. The putt did not hole out, so the par, bogey and birdie reactions, the sheep bonk and the 2-player shirt are still unseen. I did not retry `asset_search`.

- **0. Not the football player, better animations, wider spacing: 7.**
  - The golfer is code-built and on screen in `golfer_cap`, `golfer_face`, `golfer_shirt` (ISLA red), `golfer_slack`, `golfer_belt` and `golfer_sleeve`. 18 of 26 parts show in the look.
  - The drive trace was `address` → `downswing` (frames 68-80) → `follow`. `downswing` now appears, so the last fix worked.
  - In the look the follow-through shows the iron up and over the shoulder, and the stance is clear of the ball.
  - The trace had no `backswing` entry. The stage-1 and stage-2 clicks in my drive (about 20 frames apart) never reported it, so the "backswing from meter stage 1" change is unproven.
  - The putting stroke, the walk, `Celebration` and `Dismay` are not seen.
- **0b. Clean footballer as a side character: 4.**
  - His `footballer` position is (-14.44, 14.42), behind the tee, which matches the Steer.
  - He is not in the look, and `footballer_helmetShell` is still "Not found by the ID image", so the glossy clean helmet is unseen.
  - His clip was `Idle_Loop` for all 109 frames, with no `Celebration` after the shot.
  - After the second shot he stood at (-9.97, 14.08).
- **1. Toy golfer, readable poses, club looks like a club: 7.**
  - The look shows a cap, a face, a thin `club_shaft` and a small iron `club_head`.
  - The golfer takes only 0.8% of the picture and the Subject line says it "blends in" (edge contrast 0.046).
- **2. Kit colours per player: 4.** The shirt reads red for ISLA. No `sample` was taken, FINN blue is untested, and no `creatures-kit-colours` check is saved.
- **3. Hole-out reactions: 3.**
  - The putt left `lastResult` empty. After my `setState` ball move the observe reply had `ball` x, y, z null, `aimDeg` null and the camera null, so that state call corrupts the shot.
  - `Dance_Loop`, `Celebration` and `Dismay` are unseen and none of the three checks is saved.
- **4. Sheep wander into play: 7.** In the putt reply 8 of 10 sheep are `walk`, and sheep 3 is at (-11.58, 10.45), on the tee side. Their targets (`tx`, `tz`) change between shots.
- **5. Ball bonks a sheep: 4.** `sheepHits` is 0 and I did not replay the bonk check.
- **6. Cow reacts: 6.** `cow.state` read `head-up` with `yaw` 1.98 after the shot. `cow_hide` is still in `Never visible`.
- **7. Stepped real-key drive poses: 6.** `golferClip` now shows `address`, `downswing` and `follow`, and the club head is visible in the follow look. `backswing` is missing from the trace.
- **8. Looks as LOOK.md says: 7.** The storybook greens, tilt-shift, sea and trees hold. The golfer is low in contrast against the grass.
- **9. File discipline and docs: 6.** Builder 10 reports only `src/pose.js`. No `asset_search` result is recorded in `lanes/creatures.md`.
- **10. Keep the rest: 8.** Title, flyover, meter, HUD, club list and wind work. `perf` read 662 ms a frame on SwiftShader at host load 4.2, which is noise.
- **Faults: 4.**
  - The putt run raised `SFX[k] is not a function (src/sound.js:71:61)`, in another lane's file.
  - It also raised `<g> attribute transform: rotate(NaN)` twice.
  - `Never visible` lists `cow_hide`, `cliffRocks`, `seaStacks`, `fenceRails`, `fencePosts` and `divots`.
  - The golfer and sheep are still code-built with no search recorded.

**Next:**
1. **Prove one hole-out reaction with a saved check, then the other two (asked again, third time).**
   - Do not use `setState` ball with x and z only: it left the ball and camera as NaN. Use `eval` or `{action:"swing", power, accuracy, settle:true}`, or a `setState` that also sets `lie`, `phase:"aim"` and `ball.y`, and confirm `distToPin` is under 1 before swinging.
   - Use the putter, `{action:"aim",degrees:"auto"}`, then three Space presses, with `until:{phase:"holed"}`.
   - Save `creatures-par-dance` with `expect` `creatures.golferClip` = `Dance_Loop`. Do the same for a bogey (`Dismay`) and a birdie (`Celebration`).
   - A trace of `golferClip` listing `Dance_Loop` shows it done.
2. **Make `backswing` appear and make the footballer visible and cheering (asked again).**
   - In `src/pose.js`, report `backswing` for the meter stage 1 and 2 phases whatever the click spacing is. A drive trace should list `address`, `backswing`, `downswing`, `follow`.
   - Take one `look` with `camera` [-15, 3, 14.5] → [-11.5, 1, 12.8] during aim to show the footballer and his clean helmet. `footballer.clip` should read `Celebration` after a bonk or birdie, and he should not move next to the camera on later shots.
   - Also give the golfer a brighter cap or a contrast rim light so edge contrast goes above 0.1 in the aim look.
3. **Save `creatures-kit-colours` and the bonk replay, and run the asset search.**
   - Take a `look` with `sample` on `golfer_shirt` in a 1-player game and in a 2-player game (Digit2, Space). FINN should read #3b78c9 ±30 and ISLA #d8503a ±30.
   - Replay `creatures-sheep-bonk-real-keys`. `sheepHits` should go to 1 and that sheep should show `hop` or `flee`.
   - Run `asset_search` for "low poly golfer" and "low poly sheep" and record the hit or miss in `lanes/creatures.md`.

SCORE: 5.6

## Iteration 11
**Did** `src/pose.js` `poseNm`: `backswing` now reports whenever `G.m.stage` is 1 or 2 in phase `aim` or `meter` (the HUD shows the meter during `aim`, so the old `phase === 'meter'` test never held; this is why Judge 10 saw no `backswing`).
**Saw** Syntax check only (`node --check`); no `look`, `interact` or `perf` this session.
**Next** 1) Drive trace of `creatures.golferClip` expecting address, backswing, downswing, follow. 2) Hole-out checks for Dance_Loop, Dismay, Celebration (no `setState` ball with x, z only; use `swing` action or eval). 3) `creatures-kit-colours`, bonk replay, `asset_search` for golfer and sheep; footballer look and brighter cap.
**Open** Backswing, reactions, kit colours, bonk, footballer view all still unproven.
