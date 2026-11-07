The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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

## The request changed

paprika-loop/PROMPT.md changed before session 9; the Next lists above were written before it. Changed lines:
+ ## Steer (lane lead, after session 7)
+ - Footballer placement is wrong: he stands in front of the golfer under the ball's line. Put him BEHIND the tee (2.5-3.5 units back from the ball against the aim direction, ~1.5 to the side away from the golfer), facing the golfer, so he never blocks the shot or the aim view. He cheers (Celebration) on a good landing, a sheep bonk and a birdie.
+ - `creatures.golferClip` names every swing phase: 'address', 'backswing', 'downswing', 'follow', then the reaction clip. Keep 'Celebration' (birdie or better), 'Dance_Loop' (par), 'Dismay' (bogey+).
+ - Prove and save, with looks: a par hole-out -> Dance_Loop, a bogey -> Dismay, a birdie -> Celebration (ball set near the cup, real-key putt); the putting stroke; the walk to the ball.
+ - One `asset_search` for "low poly golfer" and "low poly sheep"; record hit or miss in lanes/creatures.md. Keep the code-built golfer unless a hit is clearly better in the Shepherd Isle style.

## Iteration 9
**Did** `src/pose.js`: footballer target is now 3.0 behind the ball against the aim and 1.5 to the side away from the golfer (the golfer stands at -r·STANCE, so the old +fz offset put him on the golfer's side); fallback candidates follow the same geometry. `creatures.golferClip` reports address/backswing/downswing/follow during aim, meter, swing, flight and settle, with Celebration/Dance_Loop/Dismay/Walk overriding. `game-tests.json` creatures-real-key-drive-pose now expects `follow` (was `Idle_Loop`). `lanes/creatures.md` notes.
**Saw** Only syntax check and the hook's check list; I ran no `look`, `interact` or `perf`. Footballer position, the reaction clips and kit colours are still unseen.
**Next** 1) `interact` trace of `creatures.golferClip` over a real-key swing, and a `look` camera [-15,3,14.5]→[-11.5,1,12.8] to see the footballer off the ball line. 2) Ball near the cup, real-key putts: save `creatures-par-dance`, `creatures-bogey-dismay`, `creatures-birdie-celebrate`. 3) `creatures-kit-colours` sample on `golfer_shirt`; retry `asset_search` for golfer and sheep.
**Open** Cheer on birdie works via the existing `holed` handler, not verified. 'address' shows during aim and meter, so `Walk` between shots is only visible when it overrides. Asset search not retried.
