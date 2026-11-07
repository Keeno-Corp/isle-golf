**Judge 12.** I played the opening aim look, then a real-key drive on hole 1, then `perf`. The aim view is fine. The first drive broke the game: it ended in a blank grey picture and a console error repeating every frame. I did not reach a hole-out, the sheep bonk, the 2-player shirt or `asset_search`.

- **0. Not the football player, better animations, wider spacing: 6.**
  - `creatures.golferClip` goes `address`, then `follow` after the real-key drive, and `poseName` agrees, so the swing phases still report.
  - The first aim look did not show the golfer at all: `look` reports 0 of 26 `golfer_*` parts showing. The ball sits at the bottom centre of the picture with no figure beside it.
  - Putting, walking, `Celebration` and `Dismay` were not seen. Last session only called `golferClip` directly to show the reaction clips.
- **0b. Clean footballer as a side character: 4.**
  - `creatures.footballer` reads (-13.45, 14.44), `clip: "Celebration"`, `visible: true`, so he is placed behind the tee.
  - He is not in the aim look, and `footballer_helmetShell` and `footballer_helmetStripe` have still never been seen.
- **1. Toy golfer, readable poses, club looks like a club: 5.**
  - `clubHead` reads "putter" in state.
  - No golfer was visible in the aim look, so the cap, face and club shape cannot be judged this session.
- **2. Kit colours per player: 4.** `creatures.shirt` reads `#d8503a` for ISLA. No `sample` was taken, FINN blue was not tried, and no `creatures-kit-colours` check is saved.
- **3. Hole-out reactions: 3.** After the drive and a second stroke the game stayed in `settle` with `ball` x, y, z null and `camera` null. It never reached `holed`, so `Dance_Loop`, `Celebration` and `Dismay` were not triggered by play.
- **4. Sheep wander into play: 7.** 6 of the 10 sheep are `walk` in the first state. Sheep 3 is at (-6.22, 12.21) heading for (-6.1, 13.4), next to the tee, and one is on the fairway in the aim look.
- **5. Ball bonks a sheep: 4.** `sheepHits` is 0 and no bonk replay was run.
- **6. Cow reacts: 5.** `cow.state` read `graze` with `moos` 0 and `alert` 0. `cow_hide` is still in `Never visible`.
- **7. Stepped real-key drive poses: 6.** The phases report, but the follow-through look was the blank grey picture, so no pose or `club_head` was seen.
- **8. Looks as LOOK.md says: 6.**
  - The aim look has storybook greens, tilt-shift, a red flag, a sea and low-poly trees. There is no `Lighting:` or `Surfaces:` fault line.
  - The golfer is missing from it.
- **9. File discipline and docs: 6.** Session 12 changed only `lanes/creatures.md`. There is no `asset_search` result recorded and no saved `creatures-` check.
- **10. Keep the rest: 4.**
  - Title, flyover, HUD, club list and wind work.
  - The game does not recover after the drive: `phase` stays `settle` for 316 frames and the picture is blank.
  - `{action:"swing"}` threw `Cannot read properties of null (reading 'i')` in the harness with no game error.
  - `perf` read 1214 ms a frame on SwiftShader at host load 1.9, which is noise.
- **Faults: 2.**
  - `Cannot read properties of null (reading 'i') (src/round.js:71:16)` repeated 316 times after the real-key drive.
  - The error is in another lane's file, but it blanks the picture and blocks every hole-out check.
  - `Never visible` still lists `cliffRocks`, `seaStacks`, `fencePosts`, `fenceRails`, `cow_hide` and `divots`.
  - `golfer_*` and `sheep` are code-built and no search is recorded.

**Next:**
1. **Find out whether the round.js crash comes from the creatures lane, then get a real hole-out (asked again, fifth time).**
   - After a real-key drive, `ball`, `camera` and `aimDeg` read null and `src/round.js:71` throws on every frame.
   - First `eval` the creatures hooks (`addObserve`, `addUpdate`, `on('landed')` and the like) around the second stroke. Look for one that clears or replaces a field `round.js` reads, such as `ball.mode`.
   - If it is not yours, record it in `lanes/creatures.md` for the lead and work around it.
   - Then play 3 Spaces for the drive and 3 for each putt with `until:{phase:"holed"}`, and save `creatures-par-dance` with `expect` `creatures.golferClip` = `Dance_Loop`.
   - Done when the trace lists `Dance_Loop` and the console shows no `round.js:71` error.
2. **Make the golfer show in the aim look (new).**
   - `look` finds 0 of 26 `golfer_*` parts in the aim view, and none of the 17 unlisted parts either.
   - `golferShadow` is in `Never visible`. Check the golfer's position and visibility at `aim` against `ball` (-11.5, 12.8), and move him a touch aside and back, since JC wanted wider spacing.
   - A plain `look` in aim then names `golfer_cap` and `golfer_shirt`, and `sample` on `golfer_shirt` reads `#d8503a` ±30.
3. **Show the footballer's clean helmet, save the kit colours and replay the bonk (asked again).**
   - Take a `look` with `camera` [-15, 3, 14.5] → [-13.5, 1, 14.4] and check that `footballer_helmetShell` leaves "Not found by the ID image".
   - Save `creatures-kit-colours` with a `sample` in a 1-player game and in a 2-player game (Digit2, Space): FINN `#3b78c9` and ISLA `#d8503a`, each ±30.
   - Replay `creatures-sheep-bonk-real-keys` so `sheepHits` goes to 1.
   - Run `asset_search` for "low poly golfer" and "low poly sheep" and record the hit or miss in `lanes/creatures.md`.

SCORE: 4.9
