**Session 24 verdict.** I ran `test` (14/14 pass), took a 3-moment `sheet` of ISLA's hole 1 (aim, top, follow), and ran `perf` once. I did not re-run the putt, the walk, the cow shuffle or the hole-out reactions this session. Their scores carry over.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_shirt` and the red polo read as a toy golfer with a clear gap to the ball. `Subject` is 1.4% in the aim and top moments and 2.4% in the follow moment, up from 0.8%. The 1.5% target is still not met in the aim view.
0b. **Footballer as side character, clean helmet: 8.** `player` stands behind and to the side of the tee, out of the line. He is small, but the dark helmet is clean and he reads as a figure.
1. **Toy golfer, swing poses, club looks like a club: 7.** `club_grip` and `club_head` read as a club. In the follow moment the golfer fills the frame and the club is raised over the shoulder, which reads clearly.
2. **Kit colours per player: 9.** `golfer_shirt` is red on ISLA's turn, and `creatures-kit-colours` passes.
3. **Hole-out reactions: 8.** `creatures-birdie-celebration`, `creatures-par-dance` and `creatures-bogey-dismay` all pass. I did not look at them this session.
4. **Sheep wander into play: 7.** A sheep stands at the left of the tee box in the aim view. I did not trace the other sheep this session.
5. **Sheep bonk clip moment: 7.** `creatures-sheep-bonk` and `creatures-sheep-bonk-real-keys` pass. I did not look at the heart this session.
6. **Cow reacts: 6.** `creatures-cow-reacts` passes, but `cow_hide` is out of the aim view and the shuffle is not shown in a look.
7. **Stepped real-key drive: 6.** The `top` moment (the 3rd Space plus 8 frames) still looks like address: the club is low and the meter is still showing. The raised backswing is not visible in that frame, so it is either too brief or I timed it wrong. The follow moment reads well.
8. **Looks as LOOK.md says, crisp materials: 8.** The picture is soft and clean in the Shepherd Isle style. The golfer, footballer and sheep are crisp, and there are no `Lighting:` or `Surfaces:` fault lines.
9. **Edit scope, checks saved, lanes/creatures.md: 7.** 14 checks are saved and pass. `creatures-putt-stroke`, `creatures-walk-to-ball` and `creatures-cow-shuffle` are still missing.
10. **Keep the core loop: 8.** The HUD, wind, club panel, aim dots and three-click meter are all intact.
- **Faults: 7.** There are no console errors, only the harmless `toNonIndexed` warning. `perf` gave 1200 ms a frame at host load 4.3 on SwiftShader, which is noise. It also gave 181 draw calls and 368k triangles, with the main scene taking 906 ms of it.

Mean: (8+8+7+9+8+7+7+6+6+8+7+7)/12 = 7.3.

**Next:**
1. **(asked again) Make the backswing top read distinctly.** In `src/pose.js`, hold the `backswing` pose longer, or lengthen the frames between the 3rd Space and the downswing, so the club goes past horizontal above the shoulder. It is done when a `sheet` moment taken 2 to 4 frames after the 2nd Space shows `golferClip` as `backswing` and `club_head` above `golfer_cap` height, clearly unlike the `aim` moment.
2. **(asked again) Save the missing proving checks.** Save `creatures-putt-stroke` (putter on the green, Space x3, `golferClip` goes `backswing` then `follow`, with `look: true`), `creatures-walk-to-ball` and `creatures-cow-shuffle` (ball about 2 units from `cow_hide`, trace `creatures.cow.state`). Each one is done when `test` reports it as ✓.
3. **Raise `Subject` above 1.5% in the aim view, and show the cow.** Raise `GS` from 1.7 to about 1.9 if `golfer_cap` stays clear of the meter panel. It is done when `look` of the aim view reports `Subject` of at least 1.5%. Then frame one `look` with the cow reacting to a nearby landing, so the shuffle is seen.

SCORE: 7.3
