The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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

## Iteration 8
**Did** `src/pose.js`: footballer target moved to 2.2 behind and 2.4 beside the golfer (was 1.0/1.5); new `on('ball:land')` makes him play `Celebration` (foot.cheer 2.2) when the ball lands on fairway or green. `lanes/creatures.md` records the asset-search miss.
**Saw** `asset_search` ("low poly sheep", "low poly golfer") both failed with HTTP 530 (library unreachable), so no hits and no miss reason beyond that. I did not run `look`, `interact` or `perf` this session; the footballer change is unverified.
**Next** 1) Verify with an `interact` trace that `footballer.clip` leaves `Idle_Loop` after a fairway landing and that he is off the ball line. 2) Keep `golferClip` on the swing name through follow; show par/bogey/putt/walk in a closer `sheet`. 3) Save `creatures-kit-colours` (FINN #3b78c9, ISLA #d8503a). 4) Retry `asset_search` when the library is back.
**Open** Footballer position may fall off the playable surface or be hidden by terrain (fallback candidates are still the old offsets). `golferClip` still drops to `Idle_Loop` between swing end and follow. Other lanes' `Never visible` entries remain.
