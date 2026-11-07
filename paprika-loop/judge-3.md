I've run the aim look, a 2-player swing, the shirt check and `perf`. I'm writing the verdict now.

**Verdict, session 3: the golfer is clean and reads well, and FINN's shirt is blue. The footballer is in the scene but small and standing in rough. Sheep now walk, but only after some frames. The ball-bonk, cow, dismay, walk and putt moments are still unproven.**

I did not run a sheep hit, a dismay case or the walk-to-ball look. I did not run a `ball:cow` check, a par case or a stepped drive in this session.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 7.**
  - The aim look shows `golfer_cap`, `golfer_face`, `golfer_shirt`, `golfer_slack` and `club_grip`. It reads as a toy golfer with a wide stance, and the golfer is not the football player.
  - After the swing, `creatures.golferClip` read `Idle_Loop` for all 316 frames. I did not see a swing clip name, so the swing animation is not visible in the trace.
  - Putt, walk and dismay were not seen.
  - Sheep now go from `graze` to `walk` (sheep 3 at frame 128, sheep 6 at frame 279), but I did not see eased starts or stops.
- **0b. Clean footballer as a side character: 5.**
  - `footballer_helmetShell` shows as a glossy blue helmet on an orange jersey, and `creatures.footballer` reports {x -12.56, z 11.34, visible true}.
  - He takes only 0.11% of the picture, at [317, 659, 341, 721].
  - He stands in tall rough, so his legs are hidden by grass.
  - His helmet reads a little ball-like. I did not see him cheer.
- **1. Toy golfer, readable poses, club looks like a club: 7.**
  - `club_shaft` and `club_head` read as an iron, and the cap has a brim.
  - Only the address pose was seen this session. The backswing and follow-through were not.
- **2. Kit colours per player: 7.**
  - `creatures.shirt` reads `#3b78c9` on FINN's turn, and the look shows a blue polo.
  - ISLA's red polo shows in the first look.
  - My pixel `sample` missed the shirt (the camera I gave it showed only sky), so there is no sampled colour.
- **3. Hole-out reactions: 5.** Nothing was run this session. Session 2 showed `Celebration` cut off at the cup, and par and dismay are untried.
- **4. Sheep wander into play: 6.**
  - 9 of 10 sheep switched to `walk` with targets in the fairway, such as sheep 3 heading to (-6.6, 5.6) and sheep 6 to (8, 12.9).
  - They start in `graze`, and the first look shows no sheep walking, so the wandering is slow to start.
- **5. Ball bonks a sheep: 3.** `sheepHits` is still 0. There is no `creatures-sheep-hit` check and no heart look. This was asked in sessions 2 and 3.
- **6. Cow reacts: 4.** `creatures.cow.yaw` moves (1.95), but `cow_hide` was out of view and I did not run a `ball:cow` check.
- **7. Stepped real-key drive poses: 4.** I played the three Space presses, but the long wait ran past the swing and only the end state was seen. The camera crowds the golfer in the swing frame, as in session 2.
- **8. Looks as LOOK.md says: 5.**
  - "Stands out" edge contrast is 0.118 at address and 0.126 after the swing.
  - The golfer takes 0.47% of the picture.
  - `Surfaces:` still reports `ballShadow1` and `ballShadow2` z-fighting at y 4.49.
  - Creature materials look clean and crisp, with no grime.
- **9. File discipline and docs: 6.** `lanes/creatures.md` was written and I saw no sign of edits outside the lane's files, but I did not check the diff.
- **10. Keep the rest: 7.** The title, intro, aim, swing and flight phases ran, and the HUD, meter, wind and club list are intact. The turn passed to FINN after the shot.
- **Faults: 5.**
  - One console error: `SFX[k] is not a function (src/sound.js:71:61)` during the swing. It is in `src/sound.js`, not a lane file, but it is a fault the page raises.
  - `ballShadow1` is Never visible, and the shadow z-fight is reported.
  - `perf` read a 1413 ms frame with 181 draw calls and 367,688 triangles, on a software renderer (host load 2.7), so it is not a frame-time signal.
  - The triangle count is heavy, mostly `bushes*` and `grass*`.

**Next:**
1. **Prove the sheep bonk and the cow moment (lowest scores).**
   - Take a sheep from `creatures.sheep`, for example one with a target in the fairway. Place the ball in front of it with `setState`, then swing with Space ×3.
   - The `interact` `expect` should show `creatures.sheepHits: 1` and that sheep's state as `hop`, `flee` or `tumble`. A `look` then shows the heart.
   - Save it as `creatures-sheep-hit`.
   - Do the same for `ball:cow`: a moo and shuffle counter in `creatures.cow` and a `cow_hide` look. Start 3–4 sheep in `walk` at the first frame, not `graze`.
2. **Show each golfer pose and reaction in one `sheet`.**
   - Use a camera near [-14, 2.5, 15] looking at [-11.2, 1, 12.8]. My `sample` at that camera hit only sky.
   - Moments: stage 1, stage 2, backswing, follow-through, putt, walk, par `Dance_Loop`, bogey/water dismay, and birdie `Celebration`.
   - Use `golferClip` to confirm each clip name.
   - Fix the camera crowding at the swing and the cut-off celebration at the cup.
   - Then `sample` the `golfer_shirt` pixels for FINN #3b78c9 and ISLA #d8503a, and save `creatures-` checks.
3. **Make the footballer and the golfer stand out.**
   - Move the footballer onto short grass using the `surfaceAt` check. He is currently in rough with his legs hidden, and he takes 0.11% of the picture.
   - Increase the footballer's scale a little. Add a back flare to the helmet, since the shell is a bit ball-like.
   - Show his `Celebration` after a good shot.
   - Raise the golfer's contrast: a brighter cap or shirt, or a thin outline, to get "Stands out" edge contrast above 0.15.
   - Tell the owner of `src/sound.js` about the `SFX[k]` error and the `ballShadow` z-fight, or work around them inside the lane's files.
   - The remaining code-built creatures are `sheep*` and `cow_hide`. Run `asset_search` for "low poly sheep" and "cow", and keep the code-built ones only if the results are unusable. Record that in the Open part.

SCORE: 5.6
