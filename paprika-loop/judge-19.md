**Judge 19 verdict**

I opened the page and played a 2-player start into the aim view (`look`). I then putted from beside the cup with the real `swing` action and saw the hole-out reaction. I saved one check, `creatures-birdie-celebration` (10 checks now), and ran `perf` once. I did not play the sheep bonk, the bogey or par reactions, the stepped swing at 1.3×, the walk or the cow's shuffle. Those scores carry over.

The earlier `setState` error was because `{ball}` was sent from the title, before any player existed. `api.js:72` reads `curP()`. Call `{action:"start"}` and then `{state:{hole:0, skipIntro:true}}` first, and `{ball:{x,z}}` works. A mode field is not needed.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** The golfer was enlarged 1.3×. `Subject` is 0.61% of this 1280×800 aim view (was 0.35%); the builder measured 0.81%. 19 of 26 parts show: `golfer_cap`, `golfer_brim`, `golfer_shirt`, `golfer_collar`, `golfer_slack`, `golfer_glove` and `club_grip`. He reads as a white cap, an orange polo and cream slacks, and stands clear of the ball. He is still small in the frame, and the putt and walk were not seen.
0b. **Footballer as side character, clean helmet: 8.** `player` (0.24%) stands at (-10.22, 14.75) in `Idle_Loop`, behind the tee and clear of the aim dots. He has a glossy dark-blue helmet and an orange kit. On the hole-out `creatures.footballer.clip` was 'Celebration' ✓, now in the saved check.
1. **Toy golfer, swing poses, club looks like a club: 8.** `club_shaft`, `club_grip` and `club_head` show and read as a club.
2. **Kit colours per player: 6.** With `players: 2`, ISLA is first and `creatures.shirtColour` is `#d8503a` ✓. FINN's `#3b78c9` was not seen, and `creatures-kit-colours` is still not saved.
3. **Hole-out reactions: 6.** A hole-in-one putt gives `creatures.golferClip` 'Celebration' ✓, which is saved. Dance_Loop (par) and Dismay (bogey) are still unseen. In the holed camera the golfer is out of frame (`golfer_*` 0 of 26 parts), so the viewer cannot see the celebration there.
4. **Sheep wander into play: 7.** Five of 10 sheep are in `walk` state. One is at (-6.4, 10.65) heading to (-6.1, 13.4), next to the tee.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 and there is no saved check.
6. **Cow reacts: 6.** `cow.state` read 'head-up' after the putt, so she reacts to the hole-out. The shuffle and the `ball:cow` case were not proven.
7. **Stepped real-key drive: 8.** During the putt `golferClip` ran address → downswing → follow → Celebration, but nothing was looked at at 1.3× (see Open).
8. **Looks as LOOK.md says, crisp materials: 7.** The picture is clean and in the Shepherd Isle style. Edge contrast is 0.103, which is weak.
9. **Edit scope, checks saved, lanes/creatures.md: 6.** The new check is saved. The par, bogey, bonk and kit-colour checks are still missing, asked for since session 7.
10. **Keep the core loop: 8.** The title, flyover, aim view, HUD, meter, hole-out banner and cup camera work.
- **Faults: 6.** `perf` gave 1201 ms a frame at host load 3.6 on 8 cores, 307 draw calls and 486k triangles. That is a software renderer, so it is noise. `Surfaces:` still reports `ballShadow1` and `ballShadow2` z-fighting on the plane y = 4.49. The `toNonIndexed` warning is from three.js. No lane console errors appeared.

Mean: (8+8+8+6+6+7+4+6+8+7+6+8+6)/13 = 6.8.

**Next:**
1. **Save the remaining reaction, bonk and kit checks (asked again, since session 7).** After `{action:"start"}` and `{state:{hole:0,skipIntro:true}}`, `{state:{ball:{x,z}}}` works. Use these four steps:
   - Dance_Loop: `ball` at x -2.4, z 11.95 on a par 3, `swing` power 0.2 from the putter. A one-putt on par 3 is a birdie, so the par case needs a first stroke elsewhere.
   - Dismay: take 3 or more strokes on the hole.
   - Bonk: put the ball 1.5 units in front of a sheep from `creatures.sheep` and swing.
   - Kit: `players: 2` and play to FINN's turn.

   Each is one `interact` with `save`. Done is every `expect` ✓: `golferClip` 'Dance_Loop' or 'Dismay', `sheepHits` 1 with that sheep in `hop`, `flee` or `tumble`, and `shirtColour` `#3b78c9` on FINN's turn.
2. **Show the reaction on screen.** At the hole-out the camera is on the cup and none of `golfer_*` shows. In `src/pose.js`, or through a `creatures.*` hook, hold the camera back, or raise the golfer's reaction until the camera pulls out. A `look` taken 20 frames after the `holed` event should then list `golfer_cap` and `golfer_shirt` while `golferClip` reads 'Celebration'.
3. **Check the swing, putt and walk at 1.3×, and make him bigger on screen.** `Subject` is 0.61% here, so push the golfer to about 1.5× or tighten the aim view. Take stepped looks at backswing top, follow and a putt (`interact` with `look: true`) and confirm `club_head` meets the ball and `club_grip` meets `golfer_glove`. Raise `STANCE` slightly if the body sits too close.

SCORE: 6.8
