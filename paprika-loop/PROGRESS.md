# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1

Owner priority changed: the football golfer has to go. The asset library is unreachable (HTTP 530), so I'm building a jointed golfer in code and driving it with hand IK.

### Judge 1

**Verdict, session 1: the new golfer is built but its animation code crashes, and the page stopped drawing.**

I could only get one look and one play. After the first `interact`, the 20 s `look` calls failed with "has not drawn a three.js scene", including after a fresh `open`. The first look's picture shows only the grey sea colour with the HUD, with no island or golfer. The look list names `golfer_face`, `golfer_hair`, `golfer_ear`, `golfer_nose`, `club_shaft`, `club_head` and `club_grip`, so the football player is gone. The console errors come from the new pose code.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 4.** The new golfer is built from `golfer_*` parts with a face, hair and nose. 16 of its 26 named parts show on screen, and they take only 0.0096% of the picture. `src/pose.js:38` throws `Cannot read properties of undefined (reading 'DEF-hips')`, and `src/pose.js:40` throws `reading 'update'` on every frame (×140). The hand-IK rig is not applied, so the animation improvement is unproven. I could not check the spacing, the sheep and cow smoothing, or the putting stroke, walk and reactions.
- **1. Toy golfer, face or cap, readable poses, club looks like a club: 4.** `club_shaft`, `club_head` and `club_grip` exist. `observe` reports `creatures.clubHead: "iron"`, `pose: 0.72` and `swingT: 0.22`, but I never saw a pose picture.
- **2. Kit colours per player: 3.** I could not sample the shirt. The play reached the aim with `player: ISLA`, but no look showed the shirt (FINN blue, ISLA red).
- **3. Hole-out reactions: 2.** `golferClip` is missing from `observe().creatures`, and no `holed` was played.
- **4. Sheep wander into play: 5.** `creatures.sheep` lists 10 sheep with x, z, state and target (`tx`, `tz`). Some targets sit on fairway ground, such as sheep 4 at x -6.5, z 9.8 heading to 1.5, 7.6. All 10 were in `graze` and none was walking at the moment I read them.
- **5. Ball bonks a sheep: 3.** `sheepHits: 0`, and I did not see the hop, baa or heart.
- **6. Cow reacts: 3.** `creatures.cow` only has `yaw: 2.25`. I saw no reaction.
- **7. Stepped real-key drive poses: 2.** The stage 1, stage 2, swing and flight frames were not visible, because the page stopped drawing.
- **8. Looks as LOOK.md says: 3.** The `Stands out` line says the golfer "blends in" (brightness 77% against 77%, edge contrast 0). `cow_hide` is 0.047% of the picture. I found no `Lighting:` or `Surfaces:` lines. I did not check the crisp alpha-0 materials.
- **9. File discipline and docs: 5.** The git status was clean at the start and I did not check the diff. `observe` shows the `creatures` key, but no `creatures-` checks were saved and I did not check `lanes/creatures.md`.
- **10. Keep the rest: 6.** The phases ran (`flight` with `ball.mode: air`, `strokes: 1`) and the HUD was intact. The asset sheets (BRIEF/LOOK) were not checked.
- **Faults: 2.** Two console errors, one repeating each frame (`src/pose.js:38`, `src/pose.js:40`), and the scene did not draw in later looks. `ballShadow1` is Never visible, and `divots` is behind `ball2`. The `perf` run reported 1476 ms a frame (181 draw calls, 367,688 triangles, host load 2.2 on 8 cores), but that is on a software renderer, so it is not a signal. The main scene, 486,225 triangles per frame, is heavy, with `bushes*` ×288 and tree leaves.

**Next:**
1. **Fix the crash in `src/pose.js:38-40`.** The rig is looked up with `DEF-hips`, which is undefined, and `.update` is called on something undefined, so guard or construct the rig before use. Check with `interact` `{key: Digit2}`, Space, `{action: next}`, `{wait: 60}`, `look: true`. The console should show 0 errors and the island and golfer should draw. Then show the golfer at 4× size with `look` `camera` set near the tee (about [-14, 2.5, 15] looking at [-11.2, 1, 12.8]), with `zoom` on the golfer. Check the cap, the polo in kit colour, the slacks and the club head. Also set the subject's brightness against its surroundings with a rim or a contrasting kit colour, so `Stands out` stops saying "blends in".
2. **Prove the swing poses and the reactions, then save them.** Use `interact` with real-key Space ×3 and `sheet` frames for address, backswing, through and follow-through. Add `golferClip` to `observe().creatures` (it is missing, and the brief wants 'Celebration', 'Dance_Loop' and a dismay clip). Save `creatures-` checks with `save`. Sample the shirt at its pixels for FINN #3b78c9 and ISLA #d8503a.
3. **Sheep and cow moments.** Make some sheep walk or flee through fairway paths at the start, not only graze. Then place the ball in front of one with `setState` and swing, so `sheepHits` goes to 1 and the heart shows. Add cow fields to `observe().creatures.cow` (state, a moo and shuffle count). The asset library was unreachable (HTTP 530), so also run `asset_search` once more for "low poly golfer" or "sheep" before keeping the code-built figure.

SCORE: 3.7

## The request changed

paprika-loop/PROMPT.md changed before session 2; the Next lists above were written before it. Changed lines:
+ 0. **TOP PRIORITY, the owner (JC) after playing it:** "make it so that the main character isn't the football player. And improve the animations." The golfer must NOT be the football player (assets/player-anim.glb, the Happy Cheff football figure). Replace it with a proper golfer: cap or visor, polo shirt, slacks, golf shoes, in the player's kit colours, in the Shepherd Isle storybook style. First try `asset_search` for a rigged low-poly golfer or casual human (CC0/CC BY, credit it in assets/CREDITS.md); if nothing fits, build one in code (rounded low-poly limbs on a simple bone rig, or segmented meshes parented to a group hierarchy you animate). Improve the animations: a clear address, backswing, downswing, follow-through, a putting stroke (small pendulum, no full turn), walking to the ball between shots, and celebration (birdie or better / par) and dismay (bogey or worse, water, OB) reactions. Make the sheep and cow motion smoother too (eased starts and stops, leg swing while walking, no snapping turns). Spacing: JC said "spacing is a little too close, make it a little wider" — the golfer stands a touch farther from the ball than now.
+ 3. After a hole-out (listen to the `holed` event): birdie or better plays 'Celebration', par plays 'Dance_Loop' (keep those clip names in `creatures.golferClip` even with the new golfer, e.g. as names of your own animations), bogey or worse a dismay reaction. `__game.observe().creatures.golferClip` reports the clip playing.
- 3. After a hole-out (listen to the `holed` event): birdie or better plays 'Celebration', par plays 'Dance_Loop'. `__game.observe().creatures.golferClip` reports the clip playing.

## Iteration 2
**Did** Rewrote `updateGolfer`, `placeGolfer` and `swingParam` use in `src/pose.js` for the code-built golfer: the old rig lookup (`DEF-hips`, `golfer.mixer`) crashed. Now `body`/`hips`/`spine`/`head`/`legs` are posed per frame, `ik()` places both hands in the chest frame (two-bone), `clubG` hangs from the hands. Added procedural clips Celebration, Dance_Loop, Dismay (`golferClip` set by round.js for par/birdie; pose.js listens to `holed` bogey+, `ball:water`, `ball:ob`), a walk to the ball (`golfer.walking`, 3.2 u/s, only when the ball is >1.2 away, snapped when meter/swing starts), stance widened to 0.58 (`STANCE`). Saved check `creatures-real-key-drive-pose`; wrote `lanes/creatures.md`.
**Saw** No console errors; island draws. Aim look: golfer 0.44% of picture, 21/26 parts visible, cap, red polo (ISLA), club reads as a club. Follow-through frame (swing t 0.22) clearly shows arms up, club over shoulder. Backswing at 61% power is modest (k scaled 1.35). "Stands out" 62% vs 60%, edge contrast 0.12 (weak); on the hole-1 far view golfer blends in (edge 0.019). Not run: perf, shirt pixel sample, Celebration/Dismay/walk looks, sheep or cow moments.
**Next** 1) Look at Celebration/Dismay/Dance (setState to the cup, or ball in) and the walk (sheet frames) and fix poses; check the shirt samples FINN #3b78c9 / ISLA #d8503a. 2) Sheep: make a few start with walk targets, prove a ball-in-path hit (`sheepHits` +1, heart visible), cow reaction check; save `creatures-` checks. 3) Raise golfer contrast (rim or brighter cap/shirt) so `Stands out` stops saying blends in; maybe `asset_search` once more.
**Open** Walking club pose ('carry') and foot planting during walk are untested visually; a thin club-like shape was seen at the ball while the golfer walked far away in the 25-frame look (probably aim marker, unverified). The `golfer.mixer`/`bones` fields no longer exist.

### Judge 2

**Verdict, session 2: the golfer is now a convincing code-built toy golfer and the crash is fixed. The hole-out celebration plays. Sheep, cow, dismay, walk and the shirt sample are still unproven, and no sheep walks.**

I opened the page, played a 2-player drive and a putt (`interact` with `look`), and ran `perf` once. I did not run a sheep hit, a dismay case, a walk look or a shirt `sample`. I saw no console errors.

- **0. TOP PRIORITY, not the football player, better animations, wider spacing: 6.**
  - The football player is gone. The look lists `golfer_cap`, `golfer_brim`, `golfer_face`, `golfer_shirt`, `golfer_slack`, `golfer_shoe`, `golfer_toecap`, `club_shaft` and `club_head`.
  - The aim look shows a clear cap, a red polo, slacks, shoes and a thin iron. The stance is wider (`STANCE` 0.58).
  - The swing look shows the club raised and the cap filling the bottom of the frame (`creatures.swingT` 0.22, `pose` 0.59). The camera crowds the golfer during the swing.
  - Not shown: the putting stroke, the walk to the ball, the dismay reaction, and the smoother sheep and cow motion.
  - All 10 `creatures.sheep` read `graze` through the drive, the putt and about 200 frames.
- **1. Toy golfer, face or cap, readable poses, club looks like a club: 7.** `golfer_face` and `golfer_cap` are visible. `club_head`, `club_shaft` and `club_grip` read as an iron, and `clubHead` changes to `putter` when I pick it. I saw one swing frame. The aim pose and the swing frame are distinct, but I did not see the backswing or the through pose.
- **2. Kit colours per player: 5.** ISLA's shirt looks red and the HUD says ISLA. I did not `sample` the shirt, and I did not see FINN's blue.
- **3. Hole-out reactions: 6.** After the hole-in-one `golferClip` went `Idle_Loop` → `Celebration`, and `banner` read "HOLE IN ONE!". The camera then sits at the cup, so only `golfer_slack`, `golfer_shin` and `golfer_shoe` show, and the celebration pose is cut off. Par (`Dance_Loop`) and dismay were not tried.
- **4. Sheep wander into play: 4.** Every `creatures.sheep` entry was `graze`, with no walking at all. Some have targets (`tx`, `tz`) in the fairway (sheep 3 at -6.5, 9.8 → -7, 1.7; sheep 6 at 5, 9.5 → 4, 5.5), but none was walking at the time. The look showed only two small sheep (`sheep*` ×2).
- **5. Ball bonks a sheep: 3.** `sheepHits` stayed 0 and no check was run.
- **6. Cow reacts: 5.** `creatures.cow` now reports `state: "head-up"` and `yaw` changes (2.25 → 1.78 → 1.76) during the shot. I did not see a moo, a shuffle or `ball:cow`, and `cow_hide` was outside the view.
- **7. Stepped real-key drive poses: 5.** The swing frame shows a raised club and the follow-through. Because of the camera framing I could not read stage 1, stage 2 and the backswing as separate poses. The check `creatures-real-key-drive-pose` is saved.
- **8. Looks as LOOK.md says: 5.**
  - "Stands out" is weak in every look: edge contrast 0.126 at address, 0.027 in flight, 0.03 at the cup, with brightness about equal to the surroundings.
  - `Surfaces:` reports `ballShadow1` and `ballShadow2` z-fighting at y 4.49. They are not on this lane's files, but they are a fault.
  - I did not check the crisp alpha-0 materials.
- **9. File discipline and docs: 6.** `lanes/creatures.md` exists and one `creatures-` check was saved. I did not check the diff.
- **10. Keep the rest: 7.** The phases ran: intro → aim → swing → flight → settle → holed. The HUD, wind, meter and club list are intact. The hole-in-one banner works.
- **Faults: 6.**
  - There were no console errors.
  - `ballShadow1` is Never visible, and the shadow z-fight is reported.
  - `perf` read 1127 ms a frame with 307 draw calls and 486,231 triangles, on a software renderer (host load 3.1), so it is not a signal.
  - The scene triangle count is heavy, mostly `bushes*` and `grass*`.

**Next:**
1. **Sheep and cow moments (the lowest scores).**
   - Give several sheep real `walk` states on fairway paths at the start. For example, sheep 3 and sheep 6 already have targets in the fairway but stay in `graze`.
   - Prove a hit. Find a sheep in `creatures.sheep`, place the ball in front of it with `setState`, then swing with real keys (Space ×3). `interact` `expect` should show `creatures.sheepHits: 1` and a sheep state of `hop`, `flee` or `tumble`. Then run a `look` for the heart. Save it as a `creatures-sheep-hit` check.
   - Add a `ball:cow` check with a moo and shuffle counter in `creatures.cow`.
2. **Show every golfer pose and reaction clearly.**
   - Use `look` `sheet` moments (stage 1, stage 2, swing, follow-through) with a fixed camera near the tee, about [-14, 2.5, 15] looking at [-11.2, 1, 12.8]. The golfer is only 0.46% of the picture at the default camera and is cut off in the swing frame.
   - Show `Dance_Loop` (par) and `Dismay` (a `ball:water` or bogey case) in one `sheet`. Show the walk with `golfer.walking` and a stride.
   - Sample the shirt at its pixels in both players: `look` with `sample` on the `golfer_shirt` pixels, for FINN #3b78c9 and ISLA #d8503a.
   - Save these as `creatures-` checks.
3. **Make the golfer stand out and stay in frame at the hole-out.**
   - Raise the contrast of the cap, shirt or an outline against the grass and bring "Stands out" edge contrast to 0.1 or more. At the cup it is 0.03 and in flight 0.027.
   - Make sure the celebration is visible. At the cup the golfer is cut off at the frame edge, with only the legs showing. Offset the golfer's position, or place the celebration beside the cup. A `look` after `holed` should show the whole body.
   - The remaining code shapes are the sheep and cow (`sheep*`, `cow_hide`). Run `asset_search` for "low poly sheep" and "low poly cow", and keep the code-built ones only if the result is not usable.

SCORE: 5.4

## The request changed

paprika-loop/PROMPT.md changed before session 3; the Next lists above were written before it. Changed lines:
+ 0b. **Also from JC:** "make it clean, also lets get a better football player model to be there. His helmet just looks a little rusted or something". The golfer stays the main character; the football player (assets/player-anim.glb) stays in the game as a side character, a caddie or spectator standing near the current tee or green (out of the ball's line, playing his Idle_Loop / cheering on good shots), a nod to Isle Blitz. Make him clean: the helmet reads as rusty, so give it a clean glossy painted shell (metalness 0, low roughness ~0.3, one crisp stripe and a clean facemask), check its textures and normals (drop noisy maps), and keep him crisp through the brush pass (alpha 0). Everything on the creatures (golfer, football player, sheep, cow) should look clean, not grimy or noisy. `observe().creatures.footballer` reports where he stands.

## Iteration 3
**Did** Added the footballer as a side character in `src/pose.js` (`foot`, group `footballer`): player-anim.glb loaded via `gltfL`, 0.62 tall, stands behind-left of the golfer (eased follow, turns to the ball), plays Idle_Loop, Celebration (birdie+/ball:sheep), Dance_Loop (par), then back to idle. Clean helmet: `footballer_helmetShell` (glossy #2d63c8, roughness 0.3, metalness 0), `footballer_helmetStripe`, three `footballer_facemask` bars on the DEF-head bone; his normal/other maps dropped, all materials `crisp`. `creatures.footballer` added to the existing creatures observe key. Wrote the doc in lanes/creatures.md.
**Saw** 6/6 saved checks pass; no console errors. Front look: glossy blue helmet with facemask, orange jersey, faces the ball. The original helmet is still under the shell (hidden). He stands in tall rough on hole 1 (grass hides his legs). Not done: perf run, sheep walk / ball-bonk look, golfer contrast, Celebration/Dismay/walk looks, shirt samples.
**Next** 1) Look at the footballer in Celebration and at the green; move him to short grass if the spot is rough (check surfaceAt). 2) The earlier Next items: sheep walking at start, proven ball-bonk look with heart, golfer shirt samples FINN/ISLA, golfer contrast at the cup. 3) Helmet shell reads a little large/ball-like: tune R (0.072) or add a back flare.
**Open** Footballer phase visibility list includes intro; no hide in title. Facemask is approximate bars. Mixer's Celebration is LoopOnce clamped; returns to idle after 3.5 s.

### Judge 3

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
