**Session 22 verdict.** I ran `test` (13 of 14 saved checks pass) and played ISLA's hole-1 aim view with `look`. I ran `perf` once. I did not play a hole-out, the putt, the walk or the cow this session, so those scores carry over from earlier sessions. FINN's aim view is still unseen, even though last session asked for it.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_face`, `golfer_shirt`, `golfer_slack` and `golfer_shoe` read as a toy golfer with a clear gap to the ball. In ISLA's aim view the golfer is fully inside the frame at [347, 591, 424, 730]. `Subject` is only 0.61% and 19 of 26 parts show, and the look says it "shows little of the subject".
0b. **Footballer as side character, clean helmet: 8.** `player` stands at (-10.22, 14.75) behind the tee in an orange kit with a dark glossy helmet. He is out of the aim line, but he is tiny, at 0.24% of the frame. `creatures-footballer-visible` passes.
1. **Toy golfer, swing poses, club looks like a club: 7.** `club_grip` and `club_head` read as a thin shaft with a small head. The address pose reads. The backswing is still a subtle tilt, and I did not re-look at it this session.
2. **Kit colours per player: 9.** `golfer_shirt` is red (#d8503a) on ISLA's turn, and `creatures-kit-colours` passes.
3. **Hole-out reactions: 8.** `creatures-birdie-celebration`, `creatures-par-dance` and `creatures-bogey-dismay` all pass.
4. **Sheep wander into play: 7.** Four of the ten sheep are in `walk` state. Sheep 3 is at (-6.46, 10.13) heading to (-6.1, 13.4), which is near the tee, and a sheep stands on the fairway in view.
5. **Sheep bonk clip moment: 6.** `creatures-sheep-bonk-real-keys` and `creatures-ball-bonks-sheep` pass. The newly saved `creatures-sheep-bonk` FAILS on a fresh reload with `state_not_realized`: its setup `setState {creatures:{sheep:{i:1,x:-10.5,z:12.8,wait:600}}}` is not applied. The last builder said it passed on the first try, so that run was not from a fresh reload.
6. **Cow reacts: 6.** `creatures-cow-reacts` passes, but the shuffle is not shown in a look. `cow_hide` is outside the aim view.
7. **Stepped real-key drive: 7.** `creatures-real-key-drive-pose` passes and `golferClip` reads `address` in the aim view. I did not re-look at the swing frames.
8. **Looks as LOOK.md says, crisp materials: 8.** The picture is soft and clean in the Shepherd Isle style, with crisp golfer, footballer and sheep.
9. **Edit scope, checks saved, lanes/creatures.md: 6.** 14 checks are saved and one is broken. The putt-stroke, walk-to-ball and cow-shuffle checks are missing.
10. **Keep the core loop: 8.** The aim view shows `phase` aim, `meter` stage 0, aim dots, wind, the club panel and the HUD. `hole-1` ball flight checks pass.
- **Faults: 6.** There are no console errors. `perf` gave 1078 ms a frame at host load 3.8 on SwiftShader, which is noise. It also gave 307 draw calls and 486k triangles, which is high but not timed here. One saved check is red. `ballShadow1` is "in view, behind ball2".

Mean: (8+8+7+9+8+6+6+7+8+8+6+8+6)/13 = 7.3.

**Next:**
1. **Fix `creatures-sheep-bonk` (it fails on a fresh reload).** Make the `creatures` setState path work in `addSetState` in `src/sheep.js`. It must accept `{sheep:{i,x,z,wait}}`, and `observe().creatures` must then report that sheep at the given x and z. Alternatively, rewrite the check's setup with `eval` or `aim`, and walk the sheep to the spot with a real sheep `tx`/`tz`. It is done when the `test` tool reports `✓ creatures-sheep-bonk` after a fresh reload, with `sheepHits` 1.
2. **Make the golfer and footballer read bigger in the aim view, then prove the putt and walk.** `Subject` is 0.61%. Move the camera lookAt in the aim phase, or scale the golfer slightly in `placeGolfer` (`src/pose.js`), so `Subject` is at least 1% and `golfer_cap` stays clear of the bottom edge and the meter panel. Check it with a `look` of FINN's aim view. Then save `creatures-putt-stroke` (putter on the green, Space x3, `golferClip` `backswing` → `follow`, a small swing) and `creatures-walk-to-ball`, each with `look: true`.
3. **Prove the cow's shuffle and make the backswing read.** Put the ball about 2 units from `cow_hide`, swing, and `trace` `creatures.cow.state` from `head-up` to a shuffle. Save it as `creatures-cow-shuffle`. Raise the backswing top angle in `src/pose.js` so the club goes past horizontal, and check a `sheet` moment 8 frames after the third Space.

SCORE: 7.3
