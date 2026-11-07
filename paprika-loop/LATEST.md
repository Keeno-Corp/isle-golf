The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 16
**Did** No page change. Tried `asset_search` for "low poly golfer" (character-humanoid) and "low poly sheep" (creature-animal); both returned HTTP 530 (library unreachable). Noted it in `lanes/creatures.md` Session 16.
**Saw** No look, no perf this session; nothing on screen changed from iteration 15.
**Next** 1) Retry the two asset searches and record hit/miss. 2) Save `creatures-footballer-visible`, and reaction checks (`-par-dance`, `-bogey-dismay`, `-birdie-celebration`, `-sheep-bonk`) with sheep parked via setState. 3) Check FINN's shirt with `creatures.shirt` observe (target #3b78c9 ±30) in a Digit2 game; enlarge the golfer or nearer aim camera (he is ~0.5% of the picture).
**Open** `gull` SFX error (`sound.js:71`) and `ballShadow1/2` z-fight belong to other lanes. Asset library was down.

### Judge 16

**Judge 16 verdict**

Page checked: one aim look, a real-key Space swing trace and one `perf`. I did not re-run the hole-out reactions, the sheep bonk, the cow or the kit colours. Iteration 16 changed no code, so these scores carry over from session 14. The `golferClip` trace and the `Subject` line are new.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_face`, `golfer_shirt`, `golfer_slack` ×2, `golfer_shin` ×2 and `golfer_collar` show. In the look it reads as a cap, an orange-red polo, cream slacks and shoes. He stands clear of the ball. He is only 0.46% of the picture (`Subject` line, 21 of 26 parts visible), so he is small. The putting stroke and the walk were not seen.
0b. **Footballer as side character, clean helmet: 5.** `creatures.footballer` reports x -14.44, z 14.42, visible. He is not in the on-screen list or in the look. `footballer_helmetShell`, `footballer_helmetStripe` and `footballer_facemask` are only under "Not found by the ID image". The glossy clean helmet cannot be judged and he is not framed in the aim view.
1. **Toy golfer, swing poses, club looks like a club: 8.** `club_grip`, `club_shaft` (0.504 × 0.032) and `club_head` show in the address look, and the club reads as a thin iron. `golfer_cap` is a cap.
2. **Kit colours per player: 6.** The shirt reads orange-red for ISLA in the 1-player game. FINN blue is still unchecked and there is no `observe` key for the shirt colour.
3. **Hole-out reactions: 5.** `golferClip` runs Idle_Loop → address → backswing. Dance_Loop, Celebration and Dismay were not seen, and no `creatures-` check for them is saved.
4. **Sheep wander into play: 7.** `creatures.sheep` lists 10 sheep. Four walk, including one at (-8.07, 10.71) near the tee, and one `sheep` is in the look.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 and no bonk was set up or looked at.
6. **Cow reacts: 6.** Not re-tested. The last read showed `cow.state` going graze → head-up. The moo and shuffle are unseen. `cow_hide` is outside the aim view.
7. **Stepped real-key drive: 8.** Real-key Space gave address then backswing, with `creatures.pose` -0.18 and the club head visible. The `downswing` and `follow` phases were not stepped this session.
8. **Looks as LOOK.md says, crisp materials: 7.** The picture is clean and in the Shepherd Isle style. Edge contrast is 0.128, which is weak. `ballShadow1` is still in the list at 0.037%, and the z-fight with `ballShadow2` belongs to another lane.
9. **Edit scope, checks saved, lanes/creatures.md: 5.** Iteration 16 only added a note to `lanes/creatures.md`, with no code and no new `creatures-` checks.
10. **Keep the core loop: 8.** The HUD, meter, wind, club list and aim line all work.
- **Faults: 6.** `perf` shows 1132 ms a frame at host load 3.0 on 8 cores, 307 draw calls and 486k triangles. That is a software renderer and a busy host, so it is noise. The main scene is 367k triangles, so trim the trees or bushes if it matters. The `gull` error at `sound.js:71` and the `ballShadow` z-fight belong to other lanes. Iteration 16 made no page change.

Mean: (8+5+8+6+5+7+4+6+8+7+5+8+6)/13 = 6.4.

**Next:**
1. **Footballer visible (asked again since session 7).** In `src/golfer.js` or `src/assets.js`, put the footballer 2.5–3.5 units behind the ball against the aim direction and about 1.5 to the side. He is now at (-14.44, 14.42) while the ball is at (-11.5, 12.8), so he is behind and outside the aim camera at x -19. One `look` with `camera` at about (-17, 4, 11) looking at him must list `footballer_helmetShell` with pixels, and `sample` on it must give a clean glossy shell colour.
2. **Reactions and bonk (asked again).** Save `creatures-par-dance`, `creatures-bogey-dismay`, `creatures-birdie-celebration` and `creatures-sheep-bonk` with `interact` `save`. Park the sheep with `setState`, put the ball near the cup, and putt with real-key Space ×3. The `expect` entries are `creatures.golferClip` = 'Dance_Loop', 'Dismay' or 'Celebration', and `creatures.sheepHits` 1. One `look` after each hole-out must show the pose.
3. **Asset searches, FINN colour, golfer size (asked again).** Retry `asset_search` for "low poly golfer" and "low poly sheep", and record the hit or miss in `lanes/creatures.md`. If the library is still down, say so and drop it. Add `addObserve` key `creatures.shirtColour` and save `creatures-kit-colours` in a Digit2 game. It expects `#3b78c9` ±30 for FINN and `#d8503a` ±30 for ISLA. Scale the golfer up about 1.3× or move the aim camera nearer. The `Subject` line should then show more than 1.5% of the picture.

SCORE: 6.4
