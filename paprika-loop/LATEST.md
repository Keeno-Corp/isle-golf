The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 7
**Did** `src/pose.js` observe: `creatures.golferClip` now reads the swing name (`backswing`/`downswing`/`follow`) while `G.phase === 'swing'`, else `golfer.cur` (new helper `poseNm`; `poseName` uses it). New saved check `creatures-cow-reacts` (setState ball at (-17.5, 10.6), aim 180, Space x3; expects `creatures.cow.state` alert and `moos` 1).
**Saw** Cow went `graze` → `alert` at frame 66 (`why: hit`, alert peak 3.18, moos 0 → 1, banner "MOO! THE COW SENDS IT BACK"), and moved from x -19.0 to -19.83. `golferClip` traced Idle_Loop → backswing (frames 42–54) → Idle_Loop. Golfer 0.22% of the picture, 12 of 26 parts shown, edge contrast 0.123. No console errors. No `perf`, no full `test`.
**Next** 1) Footballer a step off the ball line, cheering on good shots (clip still `Idle_Loop`). 2) 2-player `golfer_shirt` sample check (#3b78c9 / #d8503a). 3) Par `Dance_Loop`, bogey `Dismay`, putt and walk looks; the closer `sheet`. 4) A closer aim framing for the golfer (0.22%).
**Open** `asset_search` for sheep, golfer not run. Putt, walk, par and bogey unseen. `golferClip` shows `Idle_Loop` after the swing phase ends, before the follow clip. Other lanes' `Never visible` entries remain.

### Judge 7

**Judge 7.** The golfer reads well on the tee: a toy golfer with a white cap and an orange shirt, and the footballer beside him. Reactions, putt, walk and cow are still unseen. I ran the 2-player start (ISLA's turn, shirt orange-red), one real-key swing with a trace, a look and `perf`. I did not replay the bonk or cow checks, and I ran no par, bogey, putt or walk case.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 7.**
  - The look shows `golfer_cap`, `golfer_face`, `golfer_shirt`, `golfer_slack`, `golfer_shin` and `golfer_sleeve`. 19 of 26 golfer parts show, but he takes only 0.54% of the picture.
  - `poseName` ran address until frame 100, backswing until 112, then follow.
  - `golferClip` now names `backswing`, but it falls back to `Idle_Loop` at the follow-through. `downswing` and the follow-through are still unnamed in `golferClip`.
  - Putt, walk, celebration and dismay were not seen.
- **0b. Clean footballer as a side character: 6.**
  - `footballer_helmetShell` is a clean glossy blue and the jersey reads 4.
  - He is at (-12.5, 12.84), still in front of the golfer and next to the ball. In the look he stands right under the ball's line.
  - `footballer.clip` was `Idle_Loop` for all 115 frames, so he doesn't cheer.
- **1. Toy golfer, readable poses, club looks like a club: 7.** `club_shaft` and `club_head` read as an iron at the top of the swing, with a cap, face and a wide stance.
- **2. Kit colours per player: 6.**
  - ISLA's shirt reads orange-red.
  - I took no `sample` of `golfer_shirt` and did not see FINN's blue turn. There is no saved check for it.
- **3. Hole-out reactions: 4.** Not seen this session, and `golferClip` never showed `Dance_Loop`, `Celebration` or a dismay clip.
- **4. Sheep wander into play: 7.** Sheep 0, 3, 6 and 9 read `walk` with targets, and sheep 3 heads to (-10.8, 12.3), near the tee. Six of the ten sheep still graze.
- **5. Ball bonks a sheep: 6.** `sheepHits` stayed 0 in my swing. I did not replay the saved `creatures-sheep-bonk-real-keys`.
- **6. Cow reacts: 6.** The builder reports `cow.state` going `graze` → `alert` with `moos` +1 in the saved `creatures-cow-reacts`. I did not replay it, and `cow.state` stayed `graze` in my swing. `cow_hide` is still listed in `Never visible`.
- **7. Stepped real-key drive poses: 5.**
  - `poseName` reports address, backswing and follow, and `club_head` is visible at the top.
  - `golferClip` shows the backswing then `Idle_Loop`, with no `downswing` or follow name.
  - The camera shows the golfer at 0.54%. I took no stage 1 or flight frames.
- **8. Looks as LOOK.md says: 7.** The golfer, footballer and sheep are clean with crisp edges, and the storybook style holds. The picture's edge contrast is 0.155.
- **9. File discipline and docs: 6.** I did not check the diff.
- **10. Keep the rest: 8.** The title, 2-player start, flyover skip, meter, wind and club list all work, and the HUD overlaps the banner by design.
- **Faults: 5.**
  - I saw no console errors.
  - `Never visible` lists `cow_hide`, `cliffRocks`, `seaStacks` and `pond_*`.
  - `perf` read 1487 ms a frame, 181 draw calls and 368k triangles on SwiftShader, which is noise rather than a fault (host load 4.0).
  - The `toNonIndexed` warning is from three.js.
  - `sheep*` and `golfer*` are still code-built, and no `asset_search` is recorded in `paprika3d/asset-hits.json` or `sourcing.json`.

**Next:**
1. **Code-built golfer and sheep (asked again).**
   - Run `asset_search` for "low poly sheep" and "low poly golfer" and record the hits or the miss in `lanes/creatures.md`. `golfer*` and `sheep*` are boxes and spheres with no search recorded.
   - One `asset_search` call that returns hits or an explicit miss shows it done.
2. **Reactions and clip names, then a `sheet` (asked again).**
   - Keep `golferClip` on the swing name through `follow` instead of dropping to `Idle_Loop`, and name `downswing`.
   - Show par `Dance_Loop`, bogey dismay, the putt and the walk in one `look` `sheet` from a closer camera, e.g. [-15, 3, 14.5] → [-11.5, 1, 12.8].
   - One `interact` trace showing four or more distinct `golferClip` names shows it done.
3. **Footballer off the ball line, and the 2-player shirt check (asked again).**
   - Move him a step to the side and behind the golfer, and have him play `Celebration` on good shots, so `footballer.clip` leaves `Idle_Loop`.
   - Save a `creatures-kit-colours` check, a `look` with `sample` on `golfer_shirt` for FINN blue (#3b78c9) and ISLA red (#d8503a).
   - Offer a closer aim framing, since the golfer is 0.54% of the picture.

SCORE: 6.1
