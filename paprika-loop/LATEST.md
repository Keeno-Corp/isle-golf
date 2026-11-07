The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 23
**Did** Fixed `creatures-sheep-bonk` in game-tests.json. The `state` block must be echoed by `observe()`, and `creatures.sheep` is an array there, so a `creatures` setState in `state` is "not realized". I moved the sheep placement (`{creatures:{sheep:{i:1,x:-10.5,z:12.8,wait:600}}}`) into the first action as a `{state:...}` step, as `creatures-ball-bonks-sheep` does. `src/sheep.js` is unchanged (I tried renaming the key to `placeSheep`, which broke two other checks, and reverted it).
**Saw** `test` after a fresh reload: 14 of 14 pass (212 s). I ran no `look` or `perf`, so the golfer size, FINN's view and the cow shuffle were not checked.
**Next** 1) `look` at FINN's aim view and raise `Subject` (0.61%) by scaling the golfer in `placeGolfer` (`src/pose.js`). 2) Save `creatures-putt-stroke` and `creatures-walk-to-ball`. 3) Prove the cow shuffle with the ball about 2 units from `cow_hide`, and raise the backswing's top angle in `src/pose.js`.
**Open** Putt-stroke, walk and cow-shuffle checks are unsaved. The golfer is still small in the aim view. The full test run takes about 3.5 minutes.

### Judge 23

**Session 23 verdict.** I opened the game and played ISLA's hole-1 aim view in a 2-player game. I took a three-moment `sheet` of the swing (`meter1`, `top`, `follow`) and ran `perf` once. I did not run `test`, a hole-out, the putt, the walk or the cow this session. The builder's 14/14 `test` result is taken from their notes, and those scores carry over from earlier sessions.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_face`, `golfer_shirt`, `golfer_slack` and `golfer_shoe` read as a toy golfer with a clear gap to the ball. `Subject` is 0.8% and 22 of 26 parts show, and the look says it "shows little of the subject". This was asked last session and is not done.
0b. **Footballer as side character, clean helmet: 8.** `player` stands behind the tee in an orange kit with a clean dark helmet, out of the aim line. He is small at 0.3% of the frame.
1. **Toy golfer, swing poses, club looks like a club: 7.** `club_grip` and `club_head` read as a thin shaft with a small head. In the sheet, `follow` shows the club raised over the shoulder, which reads. `meter1` and `top` are barely different from the address pose, so the backswing is still too subtle.
2. **Kit colours per player: 9.** `golfer_shirt` is red on ISLA's turn, and I did not re-test FINN's.
3. **Hole-out reactions: 8.** Carried over. `creatures-birdie-celebration`, `creatures-par-dance` and `creatures-bogey-dismay` passed in session 22.
4. **Sheep wander into play: 7.** Four of the ten sheep are in `walk` state. Sheep 3 is at (-7.61, 10.44) heading to (-10.8, 12.3), which is right next to the tee.
5. **Sheep bonk clip moment: 7.** The builder reports `creatures-sheep-bonk` now passes, and I did not re-run it. I did not look at the heart this session.
6. **Cow reacts: 6.** `cow_hide` is outside the aim view, and the shuffle is still not proven in a look or saved as a check.
7. **Stepped real-key drive: 6.** `golferClip` reads `address` in the aim view. The `meter1` and `top` frames look the same as address, so the backswing does not read distinctly.
8. **Looks as LOOK.md says, crisp materials: 8.** The picture is soft and clean in the Shepherd Isle style, with crisp golfer, footballer and sheep. There are no `Lighting:` or `Surfaces:` fault lines.
9. **Edit scope, checks saved, lanes/creatures.md: 7.** 14 checks are saved and pass according to the builder. The putt-stroke, walk-to-ball and cow-shuffle checks are still missing.
10. **Keep the core loop: 8.** The aim view shows the aim dots, wind, club panel, HUD and the three-click meter.
- **Faults: 7.** There are no console errors, only a harmless `toNonIndexed` warning. `perf` gave 968 ms a frame at host load 5.1 on SwiftShader, which is noise. It also gave 181 draw calls and 368k triangles. `ballShadow1` is "in view, behind ball2".

Mean: (8+8+7+9+8+7+6+6+8+7+8+7)/12 = 7.4.

**Next:**
1. **(asked again) Make the golfer and footballer read bigger in the aim view.** `Subject` is 0.8%. Scale the golfer by about 1.3 in `placeGolfer` (`src/pose.js`), or move the aim camera closer through a hook in your own files. It is done when `look` of FINN's aim view shows `Subject` of at least 1.5% and `golfer_cap` is clear of the meter panel.
2. **Make the backswing read distinctly.** In `src/pose.js`, raise the top-of-backswing arm and club angle so the club goes past horizontal and the shoulders turn. Check it with a `sheet` of three moments: the 2nd Space and a few frames after, the 3rd Space plus 6 frames, and the follow-through. It is done when `golferClip` reads `backswing` in the `top` moment and the club head sits clearly above the golfer's shoulder, unlike `address`.
3. **Save the missing proving checks.** Save `creatures-putt-stroke` (putter on the green, Space x3, `golferClip` goes `backswing` then `follow`, with `look: true`), `creatures-walk-to-ball` and `creatures-cow-shuffle` (ball about 2 units from `cow_hide`, trace `creatures.cow.state`). Each one is done when `test` reports it as ✓.

SCORE: 7.4
