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

## Iteration 4
**Did** No code change this session (short on room). Re-ran all saved checks: 6/6 pass, including `creatures-ball-bonks-sheep` (already saved earlier; the judge's "no check exists" was wrong) and `creatures-real-key-drive-pose`.
**Saw** Bonk replay: `sheepHits` 1, sheep 3 state `hop` (tx -2.3, tz 12), banner "BAA! BOUNCED OFF A SHEEP", `hitStop` true, footballer clip `Celebration` (reacts to `ball:sheep`), no console errors. The default camera in the swing/flight frame sits ~0.3 units above the ball, so the picture shows only grass and the trail: sheep, heart and golfer are not in view (golfer 0 of 26 parts shown). Footballer at (-9.05, 11) on hole 1 is probably still in rough; perf not run.
**Next** 1) Take the bonk look from a fixed camera, e.g. `look` camera [-9, 2.5, 15] lookAt [-6, 0.5, 12.5] right after `sheepHits` hits 1, to prove the heart sprite (`creatures_heart`) is visible. 2) Run a `ball:cow` check with a `cow_hide` look, and a par/bogey hole-out for `Dance_Loop`/dismay. 3) Move the footballer onto short grass (check `surfaceAt`), scale him up slightly, brighten the golfer's cap or shirt for contrast.
**Open** `SFX[k] is not a function` at src/sound.js:71 and `ballShadow` z-fight belong to other lanes. Sheep still start in `graze`; sheep/cow are still code-built, with no `asset_search` done for them.

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

## The request changed

paprika-loop/PROMPT.md changed before session 6; the Next lists above were written before it. Changed lines:
+ ## Steer (lane lead, after session 4)
+ A session that only re-runs checks scores nothing. Each session must change code and prove one of these with real inputs, in this order, saving each as a `creatures-` check:
+ 1. Sheep bonk: setState the ball 1-2 units in front of a sheep on the aim line (aim with A/D or the `aim` action), Space x3 -> `creatures.sheepHits` +1, that sheep `hop`/`tumble`/`flee`, a look shows the heart, hit-stop visible. If the ball keeps missing, make sheep a fatter target in your own sheep.js data (physics reads `sheepList`).
+ 2. Stepped real-key drive: looks at meter stage 1, stage 2, the swing and the flight show address, top of backswing and follow-through distinctly, club head visible; `creatures.golferClip` (or a `creatures.pose` name) reports 'address'|'backswing'|'downswing'|'follow' during the swing.
+ 3. Par -> 'Dance_Loop', bogey -> a dismay clip, the putting stroke (small pendulum) and the walk to the ball, each seen in a look.
+ 4. The footballer near the tee/green framed so he reads in the aim view (not hidden in rough), clean glossy helmet.
+ 5. Cow reacts to a shot landing near her (look up/turn/moo/shuffle), proven by `creatures.cow.state`.

## Iteration 6
**Did** `src/sheep.js` `updateSheep`: found why `wait: 0` never showed as `walk`. The first update saw `d = 0` (target = home), so it reset `wait` to 1.5–5 s. Now `s.init` picks a target on frame 1 for sheep with `wait <= 0`. `src/pose.js` observe: new `creatures.poseName` (`address`|`backswing`|`downswing`|`follow`, from phase, `swingT` and the sign of `pose`). New saved check `creatures-sheep-bonk-real-keys` (setState sheep 3 at (-9, 12.5) wait 60, `aim at pin`, Space x3).
**Saw** Sheep 0, 3, 6 and 9 read `walk` from frame 1 and move by frame 5. The bonk run: `sheepHits` 0 → 1 at frame 79, sheep 3 `hop`, `hitStop` true, banner "BAA! BOUNCED OFF A SHEEP". The look shows `creatures_heart`, `creatures_bang` and `creatures_note` over the sheep, and the cow went `head-up`. The footballer played `Celebration` after the shot. `poseName` ran address until frame 34, backswing until 46, then follow. Golfer 0.48% of that picture, cut by the bottom edge, edge contrast 0.02 (the camera is low-left). No console errors. I did not run `perf` or a full `test`.
**Next** 1) `downswing` is almost never seen (swing phase jumps from backswing to follow), so either name it from `pose` crossing 0 or accept it. 2) `golferClip` stays `Idle_Loop` during the swing; the name is only in `poseName`. 3) Sheets still not seen: par `Dance_Loop`, bogey `Dismay`, putt, walk. 4) Cow check `creatures-cow-reacts`; `asset_search` for sheep and cow. 5) The golfer's contrast and the framing at the bottom edge.
**Open** Putt, walk, par and bogey are unseen by me. The `ball:cow` case is untested. The sheep and cow are still code-built, no `asset_search`. The other lanes' `ballShadow` and `Surfaces` faults remain.

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
