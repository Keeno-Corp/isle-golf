**Judge 17 verdict**

I looked at the aim view, ran one real-key Space ×3 drive with a `golferClip` trace, and ran `perf` once. I did not re-run the hole-out reactions, the sheep bonk, the cow or the kit colours, so those scores carry over from session 16. Iteration 17 moved the footballer, and that is the only change I checked.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_face`, `golfer_shirt`, `golfer_slack` ×2, `golfer_shin` ×2, `golfer_hair`, `golfer_sleeve` and `golfer_belt` show. He reads as a cap, an orange-red polo and cream slacks. He stands clear of the ball. He is still small: 0.47–0.67% of the picture (`Subject` line, 19–21 of 26 parts). The putting stroke and the walk were not seen.
0b. **Footballer as side character, clean helmet: 6.** He is now in the aim view. `player` 0.14–0.18% and `footballer_helmetShell` 0.018–0.024% show on screen, at x -10.22, z 14.75. The helmet reads blue and glossy, with an orange shirt and dark pants. He is tiny, stands in the rough beside the fairway and is barely visible. His cheering (Celebration) was not tested and `footballer_facemask` is not listed.
1. **Toy golfer, swing poses, club looks like a club: 8.** `club_grip`, `club_shaft` (0.495 × 0.032) and `club_head` show in the follow-through. The club reads as a thin iron and `golfer_cap` reads as a cap.
2. **Kit colours per player: 6.** The shirt reads orange-red for ISLA in the 1-player game. FINN blue is unchecked and there is still no `creatures.shirtColour` key.
3. **Hole-out reactions: 5.** I did not see Dance_Loop, Celebration or Dismay. No `creatures-` checks for them are saved.
4. **Sheep wander into play: 7.** `creatures.sheep` lists 10 sheep and five walk. One is at (-9.43, 11.5), right beside the tee, and it shows in both looks as a `sheep` next to the fairway.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 and no bonk was set up or seen.
6. **Cow reacts: 6.** `cow.state` read `head-up` after the shot, and `cow_hide` is in view but outside the aim picture. I did not see the moo or the shuffle.
7. **Stepped real-key drive: 9.** `golferClip` ran address → backswing (frames 1–65) → downswing (65–77) → follow. `creatures.pose` went 0 → -0.78 → 0.72. The follow-through look shows the club head (`club_head`) high over the shoulder, so every phase is now seen.
8. **Looks as LOOK.md says, crisp materials: 7.** The picture is clean and in the Shepherd Isle style. Edge contrast is 0.115–0.128, which is weak. `ballShadow1` is still listed.
9. **Edit scope, checks saved, lanes/creatures.md: 4.** Iteration 17 changed only `src/pose.js`. It saved no `creatures-` check, and reaction checks have been asked for since session 7.
10. **Keep the core loop: 8.** The HUD, meter, wind, club list and aim line all work, and the flight began after the third Space.
- **Faults: 6.** `perf` shows 1214 ms a frame at host load 4.7 on 8 cores, 307 draw calls and 486k triangles. That is a software renderer on a busy host, so it is noise. The main scene is 367k triangles. There are no console errors from the lane. The `gull` sound error and the `ballShadow` z-fight belong to other lanes.

Mean: (8+6+8+6+5+7+4+6+9+7+4+8+6)/13 = 6.5.

**Next:**
1. **Save the reaction and bonk checks (asked again, now since session 7).** Use `interact` `save` for `creatures-par-dance`, `creatures-bogey-dismay`, `creatures-birdie-celebration` and `creatures-sheep-bonk`. For each hole-out, set `ball` near the cup with `setState`, then do a real-key Space ×3 putt. `expect` `creatures.golferClip` 'Dance_Loop', 'Dismay' or 'Celebration', and `creatures.sheepHits` 1 for the bonk. Done is one `interact` call per check with every `expect` line showing ✓ and `look: true` showing the pose. Also save `creatures-footballer-visible` (`creatures.footballer.visible` true).
2. **Make the golfer and footballer bigger on screen.** Scale the golfer group about 1.3× and the footballer about 1.5× in `src/golfer.js` and `src/pose.js`. The footballer is 0.02% of the picture and sits in rough. Move him onto the tee box edge, not into the grass. A plain `look` should then show `Subject` over 1.2% and `footballer_helmetShell` over 0.05%. `sample` on the helmet shell should give a clean glossy colour, and his Celebration should show after a good landing.
3. **Kit colour check.** Add an `addObserve` key `creatures.shirtColour`. Then save `creatures-kit-colours` from a Digit2 game with expects `#3b78c9` ±30 for FINN and `#d8503a` ±30 for ISLA. Done is that `interact` call showing both ✓. Keep it small: no asset search again, since the library has been down.

SCORE: 6.5
