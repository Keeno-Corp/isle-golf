The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
