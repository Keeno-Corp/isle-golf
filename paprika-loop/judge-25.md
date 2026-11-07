**Session 25 verdict.** I took a 4-moment `sheet` of hole 1 (aim, 1st Space +4 frames, 2nd Space +3, 3rd Space +8) and ran `perf` once. I did not run `test`, and I did not re-play the putt, the walk, the cow shuffle, the sheep bonk or the hole-out reactions this session. Their scores carry over.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_shirt` and the orange-red polo read as a toy golfer, with a clear gap to the ball. `Subject` is 1.3% in the aim view, so the 1.5% target is still missed.
0b. **Footballer as side character, clean helmet: 8.** `player` stands behind the tee, off to the side. He is small, but he is out of the line and reads as a figure.
1. **Toy golfer, swing poses, club looks like a club: 8.** The `club_grip` and `club_head` read as a thin shaft with a small head. At 1st Space +4 the club is raised high behind the head, and in the aim moment it is low by the ball, so the poses are clearly different.
2. **Kit colours per player: 9.** The shirt is orange-red for player 1 in this 1-player game. The per-player check carries over from the last session.
3. **Hole-out reactions: 8.** The saved checks passed last session. I did not look at them this session.
4. **Sheep wander into play: 7.** A `sheep` stands at the upper left of the fairway in the aim view. I did not trace the other sheep.
5. **Sheep bonk clip moment: 7.** This carries over. I did not look at the heart.
6. **Cow reacts: 6.** `cow_hide` is not in the aim view, and the shuffle is not shown in a look.
7. **Stepped real-key drive: 8.** This is up from 6, and the iteration 25 change works. The backswing top shows at 1st Space +4 and holds through 2nd Space +3, with the club head above `golfer_cap`. At 3rd Space +8 the club is down at the ball, so the downswing reads. The jump from address to top is abrupt: the pose is already at the top 4 frames after the 1st Space.
8. **Looks as LOOK.md says, crisp materials: 8.** The picture is soft and clean in the Shepherd Isle style. The golfer, footballer and sheep are crisp. The look reported no `Lighting:` or `Surfaces:` fault lines.
9. **Edit scope, checks saved, lanes/creatures.md: 7.** There are 14 saved checks. `creatures-putt-stroke`, `creatures-walk-to-ball` and `creatures-cow-shuffle` are still missing, and I did not re-run the existing checks.
10. **Keep the core loop: 8.** The HUD, wind, club panel, aim dots and three-click meter are intact.
- **Faults: 7.** There are no console errors, only the harmless `toNonIndexed` warning. `perf` gave 1011 ms a frame on SwiftShader, which is noise because it is a software renderer. It also gave 307 draw calls and 486k triangles, with the main scene taking 900 ms of it.

Mean: (8+8+8+9+8+7+7+6+8+8+7+8+7)/13 = 7.7.

**Next:**
1. **(asked again) Save the missing proving checks.** Save `creatures-putt-stroke` (putter on the green, Space x3, `golferClip` goes `backswing` then `follow`, with `look: true`), `creatures-walk-to-ball` and `creatures-cow-shuffle`. For the shuffle, put the ball about 2 units from `cow_hide` and trace `creatures.cow.state`. Each one is done when `test` reports it as ✓.
2. **(asked again) Raise `Subject` above 1.5% in the aim view.** Raise `GS` from 1.7 to about 1.9 if `golfer_cap` stays clear of the meter panel. `look` of the aim moment should report `subject golfer` of at least 1.5%. Then take one `look` with the cow reacting to a nearby landing, so the shuffle is seen.
3. **Ease the backswing entry.** In `src/pose.js` `swingParam`, ramp the stage-1 jump over about 6 to 8 frames instead of snapping. A `sheet` of the 1st Space at +2 and +6 frames should show the club part-way up at +2 and at the top by +6, not already at the top.

SCORE: 7.7
