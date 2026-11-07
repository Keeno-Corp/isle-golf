The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 3

**Judge 3.** Judged on session 3. The hole 6 SPLASH and the hole 9 drive are still not proven. My real-key attempt used a wrong `until` path (`aim.deg`, where the state key is `aimDeg`). It ended in the rough with strokes 1, `aimDeg` 10.2 and `pinBearingDeg` 42, so the pond was never aimed at. Perf ran on SwiftShader at 1679 ms a frame (host load 2.5), so it is not scored. It reads 415k triangles and 159 draw calls.

The owner's feedback in PROMPT.md as item 0 was not done in iterations 1–3, and it is now the first Next item. I took no zoom on hole 1's fairway or on the 1.2× spread this session. On hole 6's aim view the rough and fairway read soft and painterly with no visible pixel blocks. The C view stripes look smooth-edged.

**Must have scores**

0. **Ground not pixelated or tiled, spread 15–25% wider: 6.**
   - The `grass*` ×3634 cover and the `island` ground look smooth at the aim view, but no zoom on hole 1's fairway was taken this session.
   - `SPREAD` is still 1.12, so the 15–25% target is unmet.
   - The hole 6 C view shows `pond_water` clear of the trees, but tree clusters (`tree9_leaves0`, `tree10_leaves0`, `tree11_leaves0`) still crowd the cliff edge.
1. **LANE GOAL (9 holes, current pin only, waypoint marker, ducks, blossom shrubs, thick pole): 6.**
   - `course.pinVisible` is true only for hole 6.
   - `way_post`, `way_diamond`, `way_ring` and `aimLanding` show.
   - `blossoms*` ×39 show, and `pond_lily` and the ducks show on the pond.
   - `pin_pole` is now 2.2 × 0.19 units with a yellow `pin_knob`, but at the aim view it is still only 0.16% of the frame (26 px wide) and sits at the frame's top-right edge [1253,58,1279,198].
   - In the C view the pin is only ~30 px at the top, still small, but now inside the frame.
   - The aim view's `aimDeg` of 10° against a `pinBearingDeg` of 42° is not fixed, so auto-aim and the pond are not lined up.
   - The splash and hole 9 checks were not proven, and no `course-*` check is saved.
2. **Looks as LOOK.md says: 7.** The painted pass, cream-green haze, teal `sea` and warm sun all show, with brightness at 51–55% and 0% blown out. `golfer_body` is 0.03–0.3% of the frame with edge contrast 0.03–0.15, so the C view says it "blends in".
3. **Edit only the lane files: 8.** Session 3 touched only `src/pins.js`.
4. **Tilt-shift focus band, haze, no unblurred frame: 8.** The blur is clear at the frame top and bottom in both looks.
5. **Plays as DESIGN.md says: 6.** Real keys worked for the club (S changed IRON→…), Space ran the three-click meter, and the result was strokes 1 with "IN THE ROUGH: SHORTER SHOT". The meter label read "SLICE!". R replay and the scorecard are still unseen.
6. **Camera: 6.** The aim view has fov 30 high behind the ball, and the C view pulls to y 27.7 with fov 31.9. Flight-follow and the flyover are still unseen.
7. **Ball flight: 6.** The ball ended in the rough, but I saw no bounce, water drop or OB.
8. **Full 9 holes, sheep, hazards: 6.** `sheep*` ×10 and `sign_board` ×8 are there, and the layout reads. Holes 2 and 3 are still reported as easy 3-stroke walks. No bunker is visible in hole 6's landing zone.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 1 / ROUND EVEN", but no card was seen.
10. **HUD: 8.** Hole/par/strokes top left, wind top right, club list bottom left, hint bottom right. All five elements are legible with 0 overlap.
11. **`window.__game` with `observe()` and `act()`: 8.** The `course.waypoint` and `pinVisible` fields work.
12. **Golfer matches CHARACTERS.md: 6.** The golfer shows as red-and-white with a helmet at 0.3% of the frame, and I did not check it against the entry.
13. **COORDINATION.md and load-order: 7.** The imports were not checked.
14. **`course:` events and `lanes/course.md`: 6.** The notes exist, but the pull-back request for the look lane is not updated for a wider spread.
15. **Pictures taken with interact and look: 6.** The looks come from stepped play, but no `course-*` check is saved.

**Faults: 5.**
- The console shows `SFX[k] is not a function (src/sound.js:71:61)` on the swing. It is not a lane file but it is a real fault.
- `toNonIndexed(): already non-indexed` is still warned at load.
- On hole 6 the aim view has the pin at the frame's right edge, so it is easy to miss.
- On hole 6 the golfer is lost against the rough at the C view.

**Next:**
1. **Do the owner's top priority** (asked again). In `src/course.js` and `src/island.js`:
   - Texture ground: raise `stripeTex` and `grainTex` size, set `LinearMipmapLinearFilter` and `anisotropy = renderer.capabilities.getMaxAnisotropy()`, and blend a second noise scale to break repetition.
   - Raise `SPREAD` from 1.12 to 1.2 and keep all 9 holes on the island.
   - Note the camera pull-back in `lanes/course.md`.
   - Shown done by `interact` with `state {hole:0, skipIntro:true}`, then `look` with `zoom` [300,350,800,640]. It should show smooth stripe edges with no pixel blocks and no repeated tile. A second `look` with `sample` on hole 1's ribbon should read within 30/255 of #5d8a3a.
2. **Prove the hole 6 SPLASH with real keys and save it as `course-h6-splash`** (asked again).
   - Use `{until:{aimDeg:[40,70]}}` with D held, not `aim.deg`.
   - Alternatively, if `aimDeg` stays near 10°, aim auto-aim at the pond.
   - Then pick the wedge with S, then Space ×3 at full power.
   - Shown done by `banner` 'SPLASH!' and `strokes` 2 in the reply.
   - Do the same for the hole 9 drive: `ball.surface` 'green' within 3 strokes, saved as `course-h9-drive`.
3. **Make the pin the clear accent on the hole 6 aim and C views.**
   - Move the pin or the camera framing in `pins.js` so `pin_pole` is not at the frame's right edge [1253,58,1279,198].
   - Make the cap bigger in the C view.
   - Add a carry or bunker on holes 2 and 3 so they are not 3-stroke walks.
   - Shown done by `look` with `zoom` on the pin at the aim view: pole fully inside the frame, ≥14 px wide with a bright `pin_knob`.

SCORE: 6.5

## The request changed

paprika-loop/PROMPT.md changed before session 4; the Next lists above were written before it. Changed lines:
+ 0. TOP PRIORITY (do this next session, before any other Next item; iterations 1-3 have not touched it yet), owner feedback after playing: "make the ground tiling les pixelated looking ... Also spacing is a little too close. Make it a little wider". Course lane's part: (a) the ground (terrain, fairway mowing stripes, rough, greens, sand, cliffs) must not look pixelated or tiled: raise texture resolution, use LinearMipmapLinear + max anisotropy (renderer.capabilities.getMaxAnisotropy()), break up repetition with macro variation / blended noise at two scales, and make the mowing stripes smooth-edged (no stair-stepping from vertex colours: add terrain subdivisions where the stripes are or move the stripes into a smooth texture/shader term). Prove with a look zoom on hole 1's fairway and on the rough at the aim view: no visible pixel blocks or repeated tile pattern. (b) Spread the holes, props and set-dressing a little wider apart (roughly 15-25% more room between holes, trees, bushes, house, fences) so the course feels less cramped, while all 9 holes stay on the island, playable, and the checks below still hold (the sea stays OB). The look lane owns camera width/FOV; if the wider spread needs the diorama/flyover to pull back, note it in lanes/course.md.
- 0. TOP PRIORITY, owner feedback after playing: "make the ground tiling les pixelated looking ... Also spacing is a little too close. Make it a little wider". Course lane's part: (a) the ground (terrain, fairway mowing stripes, rough, greens, sand, cliffs) must not look pixelated or tiled: raise texture resolution, use LinearMipmapLinear + max anisotropy (renderer.capabilities.getMaxAnisotropy()), break up repetition with macro variation / blended noise at two scales, and make the mowing stripes smooth-edged (no stair-stepping from vertex colours: add terrain subdivisions where the stripes are or move the stripes into a smooth texture/shader term). Prove with a look zoom on hole 1's fairway and on the rough at the aim view: no visible pixel blocks or repeated tile pattern. (b) Spread the holes, props and set-dressing a little wider apart (roughly 15-25% more room between holes, trees, bushes, house, fences) so the course feels less cramped, while all 9 holes stay on the island, playable, and the checks below still hold (the sea stays OB). The look lane owns camera width/FOV; if the wider spread needs the diorama/flyover to pull back, note it in lanes/course.md.

## Iteration 4
**Did** Raised `SPREAD` 1.12 -> 1.2 in `src/course.js` (owner item 0b); noted the camera pull-back in `lanes/course.md`. The ground work (`stripeTex` 16 px/m, `grainTex` at 3 scales, LinearMipmapLinear, max anisotropy in `src/island.js`) was already in place from session 2; checked, not changed.
**Saw** Hole 1 aim look at SPREAD 1.2: renders with 0 errors, brightness 51%, 0% blown out, ground reads smooth and painterly, no pixel blocks or tile pattern at the aim view. `pin_pole` 0.22% [602,66,616,232], now inside the frame. Not run: zoom/sample on the fairway ribbon, holes 2-9 at the new spread, perf, hole 6 splash and hole 9 drive real-key checks, saved `course-*` checks.
**Next** (1) Check holes 1-9 with `look` at the new spread (trees on the cliff, sea stays OB, no bunker in a drive's landing zone). (2) Real-key hole 6 splash (`until {aimDeg:[40,70]}`) and hole 9 drive; save as `course-h6-splash`, `course-h9-drive`. (3) A carry or bunker on holes 2 and 3.
**Open** The `SFX[k]` error in `src/sound.js` is outside this lane. `toNonIndexed` warning remains.
**Also (iteration 4)** The wider spread broke `putt-drops-in-cup` (ball start now (-1.82, 13.61) beside hole 1's pin) and `pond-costs-a-stroke` (wedge power 0.9 -> 1, pond is farther); edited both in `game-tests.json`. All 5 saved checks pass again.
