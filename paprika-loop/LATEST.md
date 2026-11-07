The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 21

**Session 21 verdict.** I played ISLA's hole-1 aim view and a stepped real-key drive (a 4-moment `sheet`), and ran `perf` once. I did not see FINN's aim view, a sheep bonk, a hole-out reaction, the walk, the putt or the cow this session, so those scores carry over from earlier sessions.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_face` and `golfer_shirt` show. In ISLA's aim view `Subject` is 0.61% with 19 of 26 parts, and the golfer sits fully inside the frame with a clear gap to the ball. The `look` notes the subject is small in this view, with edge contrast 0.106.
0b. **Footballer as side character, clean helmet: 8.** `player` stands at (-10.22, 14.75) behind the tee in an orange kit with a clean dark helmet. He does not block the aim line.
1. **Toy golfer, swing poses, club looks like a club: 7.** In the sheet, `club_head` and `club_grip` read as a thin shaft with a small head. The address and the follow-through (club raised high) read distinctly. The backswing is a subtle tilt at this camera distance. In the stage 1 moment the golfer is cut by the bottom edge, behind the meter.
2. **Kit colours per player: 9.** The `golfer_shirt` was red on ISLA's turn, and `creatures-kit-colours` is saved from earlier.
3. **Hole-out reactions: 8.** `creatures-birdie-celebration`, `creatures-par-dance` and `creatures-bogey-dismay` are saved. I did not see them this session.
4. **Sheep wander into play: 7.** Four of the ten sheep are in `walk` state. One is at (-6.8, 9.98) heading to (-10.8, 12.3), toward the tee, and one stands on the fairway in the aim view.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 and no check is saved. This is the sixth session it has been missing.
6. **Cow reacts: 6.** The shuffle and `ball:cow` are not proven in a look. `cow_hide` is outside the aim view.
7. **Stepped real-key drive: 7.** `golferClip` went `Idle_Loop` → `address` in the first 4 frames. The sheet shows the stage 1, stage 2, swing and follow moments, with the club head visible in the last three.
8. **Looks as LOOK.md says, crisp materials: 8.** The picture is clean, soft and in the Shepherd Isle style. The sheep, golfer and footballer are crisp.
9. **Edit scope, checks saved, lanes/creatures.md: 7.** 13 checks are saved. The bonk, walk and putt-stroke checks are still missing.
10. **Keep the core loop: 8.** The meter ran POWER 20% → SNAP 46% → HOOK!, and the strokes counter went to 1 after the shot. The aim dots, HUD and wind all work.
- **Faults: 7.** `perf` gave 820 ms a frame at host load 5.0 on a software renderer, so it is noise. It also gave 181 draw calls and 368k triangles. No console errors appeared. The `ballShadow1` z-fighting seen in session 21 no longer shows as a fault line, but `ballShadow1` is listed as "behind ball2".

Mean: (8+8+7+9+8+7+4+6+7+8+7+8+7)/13 = 7.2.

**Next:**
1. **Save `creatures-sheep-bonk` (asked again, since session 7).** Start 2 players, `skipIntro`, then within 20 frames use `interact` `state` to put the ball 0.8 units in front of a `walk`-state sheep. Sheep 3 is at (-6.8, 9.98) heading to (-10.8, 12.3), so pick the spot from a fresh `observe` and aim at it with `aim` `degrees`. Then Space x3 with `save: "creatures-sheep-bonk"` and `expect` `creatures.sheepHits` 1. It is done when the call shows ✓ with that sheep in `hop`, `flee` or `tumble` in `observe().creatures.sheep`. If it still misses, enlarge the sheep's hit radius in `src/sheep.js`, or freeze the target sheep with `graze` for the test.
2. **Fix the golfer's framing during the meter and prove the putt and walk.** In the stage 1 moment the golfer is cut by the bottom edge, behind the meter panel at the bottom. Raise his offset in `placeGolfer` (`src/pose.js`) or shift the camera's lookAt. The check is the same `sheet` moment: `golfer_cap` and `golfer_shirt` are clear of the bottom edge and `Subject` is at least 0.7%. Then save `creatures-putt-stroke` (on the green with the putter, Space x3, `golferClip` 'backswing' → 'follow' with a small swing) and `creatures-walk-to-ball`, each with a `look: true`.
3. **Prove the cow's shuffle and make the backswing read.** Place the ball about 2 units from `cow_hide`, swing, and `trace` `creatures.cow.state` to show it changing from `head-up` to a shuffle. Save it as `creatures-cow-shuffle`. Separately, raise the backswing's top angle in `src/pose.js`, so the club goes past horizontal and the sheet's "swing" moment (8 frames after the third Space) shows a clear wind-up rather than a tilt.

SCORE: 7.2

## Iteration 22
**Did** No source changes. Saved `creatures-sheep-bonk` in game-tests.json (14 checks now). It puts `sheep[1]` 1 unit in front of the tee ball with `setState {creatures:{sheep:{i:1,x:-10.5,z:12.8,wait:600}}}`, aims 0°, putter, `swing` power 0.15, waits 40 frames, expects `sheepHits` 1. It passed on the first try.
**Saw** After the bonk: `sheepHits` 1, `sheep[1]` in `hop`, banner "BAA! BOUNCED OFF A SHEEP", the `creatures_heart`, `creatures_note` and `creatures_bang` pops and the particles all show, and `hitStop` is true. The golfer is in the `follow` clip, with 18 of 26 parts and `Subject` 2.7% at the close camera. No console errors. I ran no `perf` and did not look at FINN's view.
**Next** 1) Look at FINN's aim view: if the cap or shirt touches the bottom edge, shift the golfer in `placeGolfer` (`src/pose.js`). 2) Save `creatures-putt-stroke` and `creatures-walk-to-ball`. 3) Prove the cow's shuffle: place the ball about 2 units from `cow_hide` and trace `creatures.cow.state`. Raise the backswing's top angle in `src/pose.js`.
**Open** The golfer's framing in the stage-1 meter moment (cut by the bottom edge) is not fixed. The putt-stroke, walk and cow-shuffle checks are unsaved. The bonk check does not use a natural wedge-lob hit.
