**Judge 18 verdict**

I opened the page, played the title and flyover into the aim view, and ran `perf` once. I saved one check, `creatures-footballer-visible`. A putt from beside the cup failed: `setState` with `ball:{x,z,mode}` threw "Cannot read properties of undefined (reading 'pos')". I never saw a hole-out reaction, the sheep bonk, the cow or FINN's kit colour, so those scores carry over from session 17. This session's change (footballer at `H` 1.0, `creatures.shirtColour`) is the only thing I re-checked.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_shirt`, `golfer_slack` ×2, `golfer_shin` ×2, `golfer_forearm`, `golfer_glove` and `golfer_collar` show; 19 of 26 parts are on screen. He reads as a white cap, an orange polo and cream slacks, and stands clear of the ball. He is still small: `Subject` 0.35% of the picture. He was not enlarged, as the last Open says. Putt and walk were not seen.
0b. **Footballer as side character, clean helmet: 7.** `player` is now 0.24% of the picture (was 0.14–0.18%) at x -10.22, z 14.75, in `Idle_Loop`. The helmet reads dark blue and glossy with a crisp orange shirt and dark pants. He is readable beside the fairway and does not sit in the aim line. His Celebration was not tested.
1. **Toy golfer, swing poses, club looks like a club: 8.** At address `club_shaft` (0.444 × 0.032) and `club_grip` show, and `golfer_cap` reads as a cap. No new swing look this session.
2. **Kit colours per player: 6.** `creatures.shirtColour` is now present and reads `#d8503a` for ISLA ✓. FINN blue is still unchecked, and `creatures-kit-colours` is not saved.
3. **Hole-out reactions: 5.** I did not see Dance_Loop, Celebration or Dismay. No `creatures-` reaction check is saved, and I could not set up a putt (the `setState` error above).
4. **Sheep wander into play: 7.** `creatures.sheep` lists 10 sheep and four walk. One is at (-6.79, 9.97), walking to (-10.8, 12.3) beside the tee, and `sheep*` shows in the look.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 and no bonk was set up or seen.
6. **Cow reacts: 6.** The score carries over. `cow_hide` is outside this view.
7. **Stepped real-key drive: 9.** The score carries over from session 17 (address → backswing → downswing → follow with the club head visible).
8. **Looks as LOOK.md says, crisp materials: 7.** The picture is clean and in the Shepherd Isle style. Edge contrast is 0.107, which is weak. `ballShadow1` and `ballRing1` still show.
9. **Edit scope, checks saved, lanes/creatures.md: 5.** Only `src/pose.js` changed. `creatures-footballer-visible` is saved (9 checks now), but the reaction and bonk checks, asked for since session 7, are still missing.
10. **Keep the core loop: 8.** The title, flyover and aim view work; HUD, club list, wind and aim dots all show.
- **Faults: 6.** `perf` gave 1208 ms a frame at host load 3.3 on 8 cores, 307 draw calls and 486k triangles. That is a software renderer, so it is noise. The main scene is 367k triangles. The `toNonIndexed` warning is from three.js. No lane console errors appeared.

Mean: (8+7+8+6+5+7+4+6+9+7+5+8+6)/13 = 6.6.

**Next:**
1. **Save the reaction and bonk checks (asked again, since session 7).** Run `observe` and read the `setState` shape before building the step; `{ball:{x,z,mode}}` threw. Try `{ball:{pos:[x,z]}}` or the setState hook for ball in `src/shared.js`, or use `{action:"swing", power, accuracy}` after placing the ball near the cup. Save `creatures-par-dance`, `creatures-bogey-dismay`, `creatures-birdie-celebration` and `creatures-sheep-bonk`. Done is one `interact` call per check with every `expect` ✓: `creatures.golferClip` 'Dance_Loop', 'Dismay' or 'Celebration', and `creatures.sheepHits` 1.
2. **Make the golfer bigger on screen (asked again).** Scale `golfer.holder` about 1.3× in `src/pose.js` or `src/golfer.js` and check that `club_grip` still meets `golfer_glove`. A plain `look` should then show `Subject` over 0.8% (now 0.35%).
3. **Kit colour check.** Run `interact` with `{key:"Digit2"}` and then Space on the title. Save `creatures-kit-colours` with expects `creatures.shirtColour` `#3b78c9` for FINN, then play through to ISLA's turn for `#d8503a`. Done is both ✓.

SCORE: 6.6
