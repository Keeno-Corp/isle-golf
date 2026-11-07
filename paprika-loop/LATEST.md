The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 14

**Judge 14 verdict**

Page checked: golfer in two aim views, one stepped swing, `observe` and one `perf`. I did not re-run the hole-out reactions, the sheep bonk, the cow or the kit colours this session.

0. **Golfer is not the football player, proper golfer, wider spacing: 8.** `golfer_cap`, `golfer_brim`, `golfer_hair`, `golfer_face`, `golfer_shirt`, `golfer_slack` ×2, `golfer_shoe` ×2 and `golfer_collar` show, and 21–22 of 26 parts are visible. In the look it reads as a cap, an orange-red polo, cream slacks and shoes. It stands clear of the ball. The golfer is still only about 0.5% of the aim picture (`Subject` line), so he is small. I did not test the putting stroke or the walk.
0b. **Footballer as side character, clean helmet: 5.** `creatures.footballer` reports x -14.44, z 14.42, visible, and he moved to x -10.97 after the shot. He never appears in the on-screen list or in either aim look. `footballer_helmetShell`, `footballer_helmetStripe` and `footballer_facemask` are only in "Not found by the ID image". I could not judge the glossy clean helmet, and the aim view does not frame him as the Steer asked.
1. **Toy golfer, swing poses, club looks like a club: 8.** `club_grip`, `club_shaft` (0.53 × 0.032) and `club_head` show in the address look, and the club reads as a thin iron. `golfer_cap` is a cap, not a spotted helmet.
2. **Kit colours per player: 6.** ISLA's shirt measured `#d33d29` in session 14, which is in range. FINN blue is still unchecked and there is no `observe` key for the shirt colour.
3. **Hole-out reactions: 5.** `golferClip` runs Idle_Loop → address → backswing → downswing → follow → address. Dance_Loop, Celebration and Dismay were not seen this session, and no `creatures-` check for them is saved.
4. **Sheep wander into play: 7.** `observe().creatures.sheep` lists 10 sheep with walk, graze and target coordinates, and several change state and target between my two reads. One sheep walks at (-9.55, 11.58), near the tee.
5. **Sheep bonk clip moment: 4.** `sheepHits` is 0 throughout, and I did not set up or look at a bonk.
6. **Cow reacts: 6.** `creatures.cow.state` went graze → "head-up" at frame 29 and back to graze at frame 169, and `cow.yaw` changed to 1.36. The moo and shuffle are unseen.
7. **Stepped real-key drive: 8.** Real-key Space presses show the address and backswing clips, and the `swing` action gives `downswing` and `follow`. `creatures.pose` is -0.29 at the top of the backswing, and the club head is visible.
8. **Looks as LOOK.md says, crisp materials: 7.** The picture is clean and in the Shepherd Isle style, and the golfer separates from the grass. The Subject line gave edge contrast 0.10–0.14, which is weak. `ballShadow1` and `ballShadow2` z-fight at y = 4.49, in another lane's object.
9. **Edit scope, checks saved, lanes/creatures.md: 6.** No source change in iteration 14, and the `gull` fault is documented. Only the old checks are saved, with no new `creatures-` checks.
10. **Keep the core loop: 8.** The core loop works: three-click meter, aim line, club auto-pick, wind, flight and HUD.
- **Faults: 6.** `perf` shows 765 ms a frame on SwiftShader with host load 3.8 on 8 cores. That is a software renderer, so it says nothing about a real GPU. The scene is 486k triangles and 301 draw calls, which is heavy. The `sound.js:71` error from `play('gull')` is still open and belongs to the lead. The `ballShadow` z-fight is also still open.

Mean: (8+5+8+6+5+7+4+6+8+7+6+8+6)/13 = 6.5.

**Next:**
1. **Footballer (asked again, see sessions 7–13).** The footballer is not visible in the aim view. Set his position in `src/golfer.js` or `src/assets.js` so he stands 2.5–3.5 units behind the tee and about 1.5 to the side. With the camera behind the ball he is probably behind it and out of frame, so add a `look` camera or `observe` check showing him. A `look` with `camera` at his x,z must list `footballer_helmetShell` with pixels and sample a clean glossy colour. Take that look from the aim camera and from a close one.
2. **Reactions and bonk (asked again).** Save `creatures-par-dance`, `creatures-bogey-dismay`, `creatures-birdie-celebration` and `creatures-sheep-bonk`, with sheep parked or placed via `setState`. Use real-key Space ×3 and an `expect` on `creatures.golferClip` and `creatures.sheepHits` +1. A `look` after the hole-out must show the pose.
3. **Asset searches and FINN colour.** Run one `asset_search` each for "low poly golfer" and "low poly sheep" and record the hit or miss in `lanes/creatures.md` (still not done). Then add `addObserve` key `creatures.shirtColour` and save `creatures-kit-colours`, which expects `#3b78c9` ±30 for FINN and `#d8503a` ±30 for ISLA in a Digit2 game. Also enlarge the golfer a little, or frame a nearer aim camera, so he is more than 0.5% of the picture.

SCORE: 6.5

## Iteration 16
**Did** No page change. Tried `asset_search` for "low poly golfer" (character-humanoid) and "low poly sheep" (creature-animal); both returned HTTP 530 (library unreachable). Noted it in `lanes/creatures.md` Session 16.
**Saw** No look, no perf this session; nothing on screen changed from iteration 15.
**Next** 1) Retry the two asset searches and record hit/miss. 2) Save `creatures-footballer-visible`, and reaction checks (`-par-dance`, `-bogey-dismay`, `-birdie-celebration`, `-sheep-bonk`) with sheep parked via setState. 3) Check FINN's shirt with `creatures.shirt` observe (target #3b78c9 ±30) in a Digit2 game; enlarge the golfer or nearer aim camera (he is ~0.5% of the picture).
**Open** `gull` SFX error (`sound.js:71`) and `ballShadow1/2` z-fight belong to other lanes. Asset library was down.
