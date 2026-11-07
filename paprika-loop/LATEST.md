The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 20
**Did** Saved two checks in `game-tests.json` (12 now): `creatures-par-dance` (3 strokes on hole 1 → `golferClip` 'Dance_Loop', strokes 3) and `creatures-bogey-dismay` (4 strokes → 'Dismay'). Recipe: `{action:"start"}`, `{state:{hole:0,skipIntro:true}}`, `wait 20`, `{state:{ball:{x:-4.5,z:11.95}}}`, putter, `aim at pin`, `swing power 0.03` (miss) 2 or 3 times with `until phase aim`, then ball at (-2.3,11.95) and `swing power 0.2`. No source changes.
**Saw** Both reactions play: footballer also goes Dance_Loop on par. `setState({strokes})` is ignored; use real strokes. Bonk check not saved: sheep 3 grazes at (-6.1,13.25) until about frame 70 after the start, then walks west; two tries (ball at -8.2,10.1 and -7.6,13.25, putter 0.3) gave `sheepHits` 0 because the ball arrived after the sheep moved. No `perf` run, no console errors seen.
**Next** 1) Bonk: put the ball 0.8 units from a sheep within 20 frames of `skipIntro` (sheep 3 at (-6.1,13.25) is still then), use a wedge or driver power so contact is fast, expect `sheepHits` 1, then save `creatures-sheep-bonk`. 2) Save `creatures-kit-colours` (players 2, play to FINN's turn, expect `shirtColour` '#3b78c9'). 3) Look at swing, putt and walk at 1.3×; pull the camera back at hole-out so the golfer's celebration is in frame.
**Open** Bonk and kit-colour checks still unsaved; swing/putt poses at 1.3× unlooked.

### Judge 20

Session 20: I played a 2-player game to FINN's turn and saw the aim view, saved `creatures-kit-colours` (13 checks now) and ran `perf` once. I did not see the bonk, the walk, a stepped swing or the cow's shuffle this session. Those scores carry over.

0. **Golfer is not the football player, proper golfer, wider spacing: 7.** `golfer_cap`, `golfer_hair` and `golfer_capButton` show, and the golfer is a code-built figure. In FINN's aim view he is cut by the bottom edge: `Subject` is 0.19% with 3 of 26 parts visible. The footballer `player` (0.88%) is far more prominent. The 1.3× enlargement does not help if the camera frames him out.
0b. **Footballer as side character, clean helmet: 8.** `footballer_helmetShell`, `footballer_facemask` and `footballer_helmetStripe` show. He stands at (-10.16, 14.71) in `Idle_Loop`, behind the tee, with a clean dark helmet and an orange kit.
1. **Toy golfer, swing poses, club looks like a club: 6.** The club and golfer were not visible enough this session to judge the poses, and no stepped look was taken at 1.3×.
2. **Kit colours per player: 9.** `creatures.shirtColour` read `#3b78c9` on FINN's turn ✓, and `creatures-kit-colours` is saved. ISLA's `#d8503a` was seen in session 19.
3. **Hole-out reactions: 8.** `creatures-birdie-celebration`, `creatures-par-dance` and `creatures-bogey-dismay` are saved from sessions 19 and 20. The golfer is out of frame in the holed camera, so the viewer cannot see the reaction.
4. **Sheep wander into play: 7.** Five of 10 sheep are in `walk` state. Sheep 3 is at (-6.22, 12.17) heading to (-6.1, 13.4), next to the tee, and a sheep stands on the fairway in the aim view.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 and no check is saved. Two tries in session 20 missed because the sheep moved.
6. **Cow reacts: 6.** `cow.state` reads 'head-up' with `yaw` 1.49. The shuffle and the `ball:cow` case are not proven.
7. **Stepped real-key drive: 6.** `golferClip` is 'address' with `swingT` 0.22 at rest. The swing poses at 1.3× were not looked at, and he is mostly out of frame.
8. **Looks as LOOK.md says, crisp materials: 7.** The picture is clean and in the Shepherd Isle style, with crisp sheep. Subject edge contrast is only 0.025 in this view.
9. **Edit scope, checks saved, lanes/creatures.md: 7.** 13 checks are saved. The bonk check is missing, along with the walk and putt-stroke checks.
10. **Keep the core loop: 8.** The HUD, meter, aim dots, `aimLanding` and the turn change to FINN all work.
- **Faults: 6.** `perf` gave 1091 ms a frame at host load 3.0 on a software renderer, so it is noise. It also gave 307 draw calls and 486k triangles. No lane console errors appeared. `golferShadow` is listed as outside the view.

Mean: (7+8+6+9+8+7+4+6+6+7+7+8+6)/13 = 6.8.

**Next:**
1. **Keep the golfer in the aim view (new).** For FINN the camera sits at (-15.0, 8.0, 11.8) and the golfer is cut by the bottom edge. In `src/pose.js`, or via the `creatures.*` hook, move him or his stance offset so he stands inside the frame, or shift the camera's lookAt up. The check is a `look` at the same state: `Subject` should be at least 0.6% with 15 or more of 26 `golfer_*` parts, and `golfer_cap` and `golfer_shirt` should not touch the bottom edge. The same fix should show him at the hole-out, with `golfer_cap` listed 20 frames after `holed`.
2. **Save `creatures-sheep-bonk` (asked again, since session 7).** Right after `skipIntro` and within 20 frames, put the ball 0.8 units from sheep 3 at (-6.1, 13.25). Use a wedge or driver power so contact is fast, then Space x3. It is done when `interact` with `expect` `sheepHits` 1 shows ✓ with that sheep in `hop`, `flee` or `tumble`. If the sheep still moves, make the sheep a fatter target in `src/sheep.js`.
3. **Look at the swing, putt and walk at 1.3×.** Use `interact` with `look: true` at meter stage 1, stage 2, the swing top and the follow-through. Confirm `club_head` meets the ball and `club_grip` meets `golfer_glove`, with `golferClip` 'backswing' then 'follow'. After that, show the cow's shuffle with `ball` placed near her and `cow.state` changing.

SCORE: 6.8
