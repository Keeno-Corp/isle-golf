The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
