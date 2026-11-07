The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 6

**Judge 6.** The golfer reads well on the tee, the footballer is clearer, and the sheep now walk from frame 1. Putt, walk, par, bogey and the cow reaction are still unseen. I ran the title, the flyover skip, one real-key swing (Space ×3) with a trace and a look, and `perf`. I did not re-run the sheep bonk, a par or bogey case, a putt, a walk, a `ball:cow` case or a 2-player kit check.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 7.**
  - The look shows `golfer_cap`, `golfer_brim`, `golfer_face`, `golfer_shirt`, `golfer_slack` and `golfer_shoe`, a toy golfer with a wide stance and the iron raised.
  - 22 of 26 golfer parts show, edge contrast is 0.157, and he takes 0.56% of the picture.
  - `poseName` ran address until frame 80, backswing until 92, then follow, so the swing is named. `swingT` and `pose` (0.59) move too.
  - `golferClip` stayed `Idle_Loop` for all 102 frames. Putt, walk and dismay were not seen.
  - The `vaca-2` glb now loads for the cow.
- **0b. Clean footballer as a side character: 7.**
  - He stands at (-12.5, 12.84), just ahead of the golfer, with `footballer_helmetShell` a clean glossy blue and the orange jersey numbered 4. He is clearly legible in the picture.
  - His clip stayed `Idle_Loop` through the swing, and the builder's note that he played `Celebration` was not reproduced here.
  - He sits close to the ball line, in front of the golfer, and is still small.
- **1. Toy golfer, readable poses, club looks like a club: 7.**
  - `club_shaft` and `club_head` are thin and read as an iron. The follow-through frame (pose 0.59) shows the club swung up and through.
  - The `downswing` pose name never appears.
- **2. Kit colours per player: 6.**
  - The 1-player shirt reads ISLA orange-red.
  - I took no `sample` of `golfer_shirt` and did not run the 2-player blue-versus-red check.
- **3. Hole-out reactions: 4.** Not run this session. `golferClip` never leaves `Idle_Loop`, and par `Dance_Loop` and bogey dismay have not been seen.
- **4. Sheep wander into play: 7.**
  - Sheep 0, 3, 6 and 9 read `walk` from frame 1 with targets, for example sheep 3 moving from (-7.41, 10.33) toward (-10.8, 12.3), into the aim corridor.
  - Six of the ten sheep are still `graze`.
- **5. Ball bonks a sheep: 6.**
  - The builder's `creatures-sheep-bonk-real-keys` run shows `sheepHits` going 0 → 1, sheep 3 `hop`, `hitStop`, and the heart, bang and note over the sheep.
  - I did not replay it, and `sheepHits` was 0 in my swing.
- **6. Cow reacts: 4.** `cow.state` stayed `graze` for 102 frames, with only `yaw` 2.16. `cow_hide` is in `Never visible` as "in view" at 1.89 units. There is no `creatures-cow-reacts` check.
- **7. Stepped real-key drive poses: 6.**
  - `poseName` now reports address, backswing and follow, so the Steer's naming is met for those three.
  - `downswing` is missing, and the camera sits low-left so the golfer stays small.
  - I took no stage 1, stage 2 and flight frames.
- **8. Looks as LOOK.md says: 7.** The golfer, footballer and sheep are clean with crisp edges, and the Shepherd Isle storybook style holds.
- **9. File discipline and docs: 6.** I did not check the diff.
- **10. Keep the rest: 8.** Title, flyover skip, three-click meter, flight, HUD, wind and club list all work.
- **Faults: 5.**
  - I saw no console errors.
  - `ballShadow1` is present at 0.07%, and `Never visible` still lists `cliffFace`, `cow_hide` and `pond_*`.
  - `perf` read 1219 ms a frame, 307 draw calls and 486k triangles on SwiftShader (host load 3.3). That is not a frame-time signal.
  - The triangle count is high, mostly `grass*` ×2216 and `bushes*` ×37.
  - `sheep*` and `golfer*` are still code-built, and no `asset_search` result is recorded.

**Next:**
1. **Cow reaction and `asset_search` (asked again).**
   - Add `creatures-cow-reacts`. Place the ball 1–2 units from `cow_hide` with `setState`, swing with Space ×3, and `expect` `creatures.cow.state` to move off `graze` (look-up or shuffle). Add a `look` of the cow.
   - One `interact` with `trace: creatures.cow.state` that reads something other than `graze` shows it done.
   - Run `asset_search` for "low poly sheep" and "low poly golfer", and record the hits or the miss in Open.
2. **Report the swing and the reactions in `golferClip`, then show them in one `sheet`.**
   - Set `golferClip` to `address`, `backswing`, `downswing` and `follow` during the swing, and name `downswing` when `pose` crosses 0.
   - Then take a `look` `sheet` from a closer camera, for example [-15, 3, 14.5] → [-11.5, 1, 12.8]. Frames: stage 1, top of backswing, follow-through, putt, walk, par `Dance_Loop`, bogey dismay and birdie `Celebration`.
   - One `interact` trace showing four distinct `golferClip` names shows it done.
3. **Footballer placement and golfer size.**
   - Move him a step off the ball line, to the side and behind the golfer, so his body no longer sits in front of the club. Have him cheer on good shots; his `clip` should leave `Idle_Loop`.
   - Add the 2-player `sample` of `golfer_shirt` against blue `#3b78c9` and red `#d8503a` as a saved check.
   - The golfer is only 0.56% of the picture, so offer a closer aim framing through the creatures hooks if one is allowed.

SCORE: 6.3

## Iteration 7
**Did** `src/pose.js` observe: `creatures.golferClip` now reads the swing name (`backswing`/`downswing`/`follow`) while `G.phase === 'swing'`, else `golfer.cur` (new helper `poseNm`; `poseName` uses it). New saved check `creatures-cow-reacts` (setState ball at (-17.5, 10.6), aim 180, Space x3; expects `creatures.cow.state` alert and `moos` 1).
**Saw** Cow went `graze` → `alert` at frame 66 (`why: hit`, alert peak 3.18, moos 0 → 1, banner "MOO! THE COW SENDS IT BACK"), and moved from x -19.0 to -19.83. `golferClip` traced Idle_Loop → backswing (frames 42–54) → Idle_Loop. Golfer 0.22% of the picture, 12 of 26 parts shown, edge contrast 0.123. No console errors. No `perf`, no full `test`.
**Next** 1) Footballer a step off the ball line, cheering on good shots (clip still `Idle_Loop`). 2) 2-player `golfer_shirt` sample check (#3b78c9 / #d8503a). 3) Par `Dance_Loop`, bogey `Dismay`, putt and walk looks; the closer `sheet`. 4) A closer aim framing for the golfer (0.22%).
**Open** `asset_search` for sheep, golfer not run. Putt, walk, par and bogey unseen. `golferClip` shows `Idle_Loop` after the swing phase ends, before the follow clip. Other lanes' `Never visible` entries remain.
