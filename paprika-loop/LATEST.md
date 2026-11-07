The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 8
**Did** `src/pose.js`: footballer target moved to 2.2 behind and 2.4 beside the golfer (was 1.0/1.5); new `on('ball:land')` makes him play `Celebration` (foot.cheer 2.2) when the ball lands on fairway or green. `lanes/creatures.md` records the asset-search miss.
**Saw** `asset_search` ("low poly sheep", "low poly golfer") both failed with HTTP 530 (library unreachable), so no hits and no miss reason beyond that. I did not run `look`, `interact` or `perf` this session; the footballer change is unverified.
**Next** 1) Verify with an `interact` trace that `footballer.clip` leaves `Idle_Loop` after a fairway landing and that he is off the ball line. 2) Keep `golferClip` on the swing name through follow; show par/bogey/putt/walk in a closer `sheet`. 3) Save `creatures-kit-colours` (FINN #3b78c9, ISLA #d8503a). 4) Retry `asset_search` when the library is back.
**Open** Footballer position may fall off the playable surface or be hidden by terrain (fallback candidates are still the old offsets). `golferClip` still drops to `Idle_Loop` between swing end and follow. Other lanes' `Never visible` entries remain.

### Judge 8

Wasted sheet; I'll write the verdict.

**Judge 8.** I ran one real-key swing on hole 1 with a trace, a `perf` and one `look`. The swing look has the camera past the golfer, and my closer tee `sheet` only reloaded the title, so I did not see the golfer or the footballer. I did not test par, bogey, putt, walk, bonk or the 2-player shirt. `asset_search` returned HTTP 530 again.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 6.**
  - `poseName` ran `address` until frame 113, `backswing` until 125, then `follow`.
  - `golferClip` ran `Idle_Loop`, then `backswing`, then back to `Idle_Loop` at frame 125, so `downswing` and the follow-through are still unnamed. PROMPT's new Steer wants `address`, `backswing`, `downswing`, `follow`, then the reaction clip.
  - Putt, walk, celebration and dismay were not seen.
  - The golfer is not framed in the aim view. The `look` says 0 of 26 golfer parts show.
- **0b. Clean footballer as a side character: 5.**
  - `footballer.clip` went from `Idle_Loop` to `Celebration` at frame 171, after the landing. That fix works.
  - He still stands at (-12.5, 12.84), which was where he stood last session, and the camera sits at (-11.65, 6.88, 12.1). I could not see him, so I can't say whether he is off the ball line.
  - The new Steer asks for 2.5–3.5 units behind the ball, about 1.5 to the side away from the golfer, facing the golfer. Nothing shows that was done.
- **1. Toy golfer, readable poses, club looks like a club: 5.** Last session's look showed `golfer_cap`, `golfer_face`, `club_shaft` and `club_head` reading as an iron. This session's `clubHead` reports `iron`, but no look showed the golfer.
- **2. Kit colours per player: 5.** No `sample` of `golfer_shirt` and no saved `creatures-kit-colours` check. This item has been open for several sessions.
- **3. Hole-out reactions: 3.** `Dance_Loop`, `Celebration` and `Dismay` have never been seen in a trace, and no check exists.
- **4. Sheep wander into play: 7.** Sheep 0, 3, 6 and 9 read `walk` with targets, and sheep 3 heads to (-10.8, 12.3), next to the tee. Six of ten still graze.
- **5. Ball bonks a sheep: 5.** `sheepHits` is 0 and I did not replay `creatures-sheep-bonk-real-keys`.
- **6. Cow reacts: 7.** `cow.state` went `graze` to `head-up` at frame 138 after my shot, with `yaw` 1.6. `cow_hide` is still in `Never visible`.
- **7. Stepped real-key drive poses: 4.**
  - `poseName` is distinct, but `golferClip` is not.
  - The look was taken after the swing, and the golfer was not in frame.
  - I took no stage 1 or stage 2 looks.
- **8. Looks as LOOK.md says: 6.** The island, tilt-shift blur and storybook greens hold. The creatures were not visible to sample for crisp alpha-0 edges.
- **9. File discipline and docs: 6.** I did not check the diff. Builder 8 touched only `src/pose.js` and `lanes/creatures.md`, which is allowed.
- **10. Keep the rest: 8.** The title, flyover skip, three-click meter, wind, club list and HUD all work. `perf` read 973 ms a frame on SwiftShader at host load 4.4, which is noise.
- **Faults: 5.**
  - I saw no console errors. The `toNonIndexed` warning is from three.js.
  - `Never visible` lists `cow_hide`, `cliffRocks`, `seaStacks`, `fenceRails` and `fencePosts`, and `golfer*` parts are not found by the ID image.
  - `golfer*` and `sheep*` are still code-built. The search is blocked by HTTP 530, which is not a miss.

**Next:**
1. **Name every swing phase in `golferClip`, and frame the golfer so a look can read it (asked again).**
   - In `src/pose.js`, make `golferClip` follow `poseName`: `address`, `backswing`, `downswing`, `follow`, then the reaction. It currently drops to `Idle_Loop` at frame 125.
   - Add an `observe().creatures.golferPos` that a `look` camera can aim at.
   - One `interact` with `trace: ["creatures.golferClip"]` over a real-key swing shows it done when it lists four or more distinct names and none is `Idle_Loop`.
2. **Footballer behind the tee (asked again, now in PROMPT's Steer).**
   - Place him 2.5–3.5 units back from the ball against the aim direction and about 1.5 to the side away from the golfer, facing the golfer. Have him cheer on a bonk and a birdie as well as a good landing.
   - A `look` camera at [-15, 3, 14.5] → [-11.5, 1, 12.8], set through `interact`'s `look: true` after the aim phase has started, shows him off the ball line. Do not use `look`'s `sheet` with `state: {phase:'aim'}`, which reloaded the title.
3. **Reactions and kit colour proven and saved (asked again).**
   - Use `setState` to put the ball near the cup, then a real-key putt. Save `creatures-par-dance`, `creatures-bogey-dismay` and `creatures-birdie-celebrate`, each with an `expect` on `creatures.golferClip`.
   - Save `creatures-kit-colours`: a `look` with `sample` on `golfer_shirt` for FINN blue (#3b78c9 ±30) and ISLA red (#d8503a ±30).
   - Retry `asset_search` "low poly golfer" and "low poly sheep" when the library is back, and record the hit or miss in `lanes/creatures.md`.

SCORE: 5.4
