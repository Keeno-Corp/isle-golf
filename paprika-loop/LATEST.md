The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 5
**Did** `src/sheep.js` line 22: every third sheep (`i % 3 === 0`) now starts with `wait: 0`, so it walks at frame 0 instead of grazing. `src/pose.js`: `foot` (footballer) height 0.62 → 0.74, and his stand spot is moved onto fairway/green/tee (`surfaceAt` imported from course.js) by trying six alternate offsets when the default behind-left spot is rough.
**Saw** All 6 saved checks pass after the edits (incl. `creatures-ball-bonks-sheep`, `creatures-real-key-drive-pose`). I did not take a new look, run `perf`, or sample footballer pixels this session, so the footballer's framing and the sheep's early walking are unseen.
**Next** 1) After `sheepHits` hits 1, take a `look` from a fixed camera near [-9, 2.5, 15] looking at [-6, 0.5, 12.5] to see the heart and `hit-stop`. 2) Stepped drive: trace `creatures.golferClip`/`pose` for backswing and follow-through names. 3) Par `Dance_Loop`, bogey dismay, putt and walk looks; `ball:cow` check. 4) Look at footballer at hole 1 aim view to confirm he is on short grass.
**Open** Not verified by sight: footballer new spot and size. Other lanes' `SFX[k]` error and `ballShadow` z-fight remain. Sheep/cow still code-built, no `asset_search` done.
**Late look (iter 5)** Hole 1 aim, 30 frames: footballer at (-12.5, 12.84), `Idle_Loop`, `footballer_helmetShell` at [358,750,383,771], bottom-left edge of the picture, partly cut off (0.1% of frame); golfer 0.37%, edge contrast 0.107. Sheep 0/3/6/9 have targets but all still read `graze` at frame ~30, so the `wait: 0` start does not show as `walk` yet (probably the `walk` state needs `d > 0.12` after easing). No console errors. Next: move the footballer up/inward so he is fully in frame, and make the early-walk state show.

### Judge 5

**Verdict, session 5: the golfer is clean and the swing now moves through distinct poses. The footballer is fully in frame on the tee, but the sheep, cow, reaction and putt moments are still unproven by sight.**

I ran the hole 1 aim look, one real-key swing (Space ×3) with a trace, and `perf`. I did not run a sheep hit, a dismay case, a par case, a walk, a putt or a `ball:cow` check this session.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 7.**
  - The aim look shows `golfer_cap`, `golfer_face`, `golfer_shirt`, `golfer_slack` and `club_grip`, a toy golfer with a wide stance.
  - The swing trace shows `creatures.pose` going 0 → -0.61 (frame 29) → 0.59 (frame 41), so a backswing and a through-swing exist. The frame at the top shows the club raised behind the head, with `club_shaft` and `club_head` visible.
  - `creatures.golferClip` stayed `"Idle_Loop"` for all 41 frames, so the swing is not named there, as the Steer asks.
  - Putt, walk and dismay were not seen.
- **0b. Clean footballer as a side character: 7.**
  - He now stands on the tee beside the golfer, at (-12.5, 12.84), with `footballer_helmetShell` at [601, 640, 629, 663]. The helmet is a clean glossy blue and the jersey is orange with the number 4.
  - He takes only 0.055% of the picture, so he is small. His clip stayed `Idle_Loop`, and I did not see him cheer.
  - He stands close to the golfer's line, behind the ball side. In the swing look he sits just ahead of the golfer's club, so the two overlap.
- **1. Toy golfer, readable poses, club looks like a club: 7.**
  - The cap with `golfer_brim`, the face and the thin iron shaft with a small head all read at the address and at the top of the backswing.
  - The follow-through frame was not captured.
- **2. Kit colours per player: 6.**
  - The 1-player game showed ISLA with an orange-red shirt. The 2-player blue-versus-red check was not re-run, and I took no `sample` of `golfer_shirt`.
  - The earlier verdict recorded `#3b78c9` for FINN.
- **3. Hole-out reactions: 4.**
  - Nothing was run. `Celebration` was seen cut off at the cup in session 2, and par and dismay are untried.
- **4. Sheep wander into play: 5.**
  - All 10 sheep read `graze` at frame 63. Sheep 0, 3, 6 and 9 have targets (for example sheep 3 heading to (-5.5, 1)) but have not started walking.
  - The `wait: 0` change from the last iteration shows no effect after 63 frames.
- **5. Ball bonks a sheep: 4.**
  - `sheepHits` is 0 throughout. The saved check `creatures-ball-bonks-sheep` exists and passed for the builder, but I did not see a heart or hit-stop look.
- **6. Cow reacts: 4.**
  - `creatures.cow.yaw` moved to 2.29, and `cow_hide` was in view after the swing but small.
  - `cow.state` stayed `graze`, and I ran no `ball:cow` check.
- **7. Stepped real-key drive poses: 6.**
  - The swing look at the top of the backswing is clear, and `pose` changes from frame 1. The camera sits fixed behind and above, and the golfer is only 0.47% of the picture.
  - No `golferClip` name changes appear in the trace.
- **8. Looks as LOOK.md says: 6.**
  - The creature materials are clean and crisp.
  - The golfer's edge contrast is 0.123, and he is 0.48% of the picture. The Shepherd Isle style is kept.
- **9. File discipline and docs: 6.** `lanes/creatures.md` exists. I did not check the diff.
- **10. Keep the rest: 7.** The title, flyover skip, aim, meter, swing and flight phases ran, and the HUD, wind and club list are intact.
- **Faults: 5.**
  - I saw no console errors in these runs, and the `SFX[k]` error did not appear in this swing.
  - `ballShadow1` is still reported as `Never visible`, and the `Surfaces:` z-fight from other lanes remains.
  - `perf` read a 1559 ms median frame with 181 draw calls and 367,688 triangles. That is on a software renderer (host load 2.5), so it is not a frame-time signal.
  - The triangle count is heavy, mostly `grass*` ×2425 and `bushes*`.
  - `sheep*`, `cow_hide` and the golfer are still code-built. The builder's Open records no `asset_search` for them.

**Next:**
1. **Make the sheep walk visibly and prove the bonk (asked again).**
   - The `wait: 0` start does not show as `walk` at frame 63. Force `state: 'walk'` with a visible step for sheep 0, 3, 6 and 9 in the first frames, or lower the `d > 0.12` gate.
   - The call that shows it done is `interact` with `{wait: 90}` and `trace: creatures.sheep.3.state`. It should read `walk` before frame 60 and the sheep's x or z should change.
   - Then place the ball in front of that walking sheep with `setState` and swing with Space ×3. `expect` `creatures.sheepHits: 1`, and `look` at [-9, 2.5, 15] → [-6, 0.5, 12.5] to show the heart.
2. **Put the swing and the reactions in `creatures.golferClip`, and show them in one `sheet` (asked again).**
   - Report `address`, `backswing`, `downswing` and `follow` from `creatures.golferClip`. It is `Idle_Loop` through the whole swing now.
   - Then take a `look` `sheet` with a closer camera, for example [-15, 3, 14.5] → [-11.5, 1, 12.8]. Frames: stage 1, top of backswing, follow-through, putt, walk, par `Dance_Loop`, bogey dismay and birdie `Celebration`.
   - Move the footballer a step off the ball-side so he does not overlap the club, and have him cheer after a good shot. The `sheet` shows it done.
3. **Cow, then asset searches.**
   - Add a `creatures-cow-reacts` check: place the ball next to `cow_hide`, swing, and `expect` `creatures.cow.state` to leave `graze` for look-up or shuffle, with a `look` of the cow.
   - Run `asset_search` for "low poly sheep" and "low poly cow", and record the result in Open. Swap in anything usable.
   - Raise the golfer's contrast with a brighter cap or a thin outline, toward an edge contrast above 0.15.

SCORE: 5.6
