# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1
**Did** pins.js: pole 0.05 thick + knob, bigger flag; only the current pin visible (`H.pinG.visible`, on `hole:start`); waypoint marker `wayMark` at `aimTarget()` (mirror of autoAim's target) ; observe `course`; `window.__course` debug handle. course.js: per-hole winds along the play line, `rayClear` moves bunkers out of drive ray and off greens, hole 5 and 9 paths reshaped so a perfect drive lands on the fairway. island.js: pink bushes -> green bushes with `blossoms` petals; ducks 0.26 -> 0.46. lanes/course.md written. Check `course-only-current-pin` saved.
**Saw** eval sweep of all 9 holes with auto-aim + needPower swings: every hole green in <=3 strokes (holes 2,3 are aces: too easy); drives land fairway on 5,6,7,9. Hole 5 aim image: pink rocks gone, petals read. Ducks visible on pond. C view hole 6/9 shows current pin only, in the upper part of frame (hole 9 pin near top edge). Not run: perf, real-key SPLASH check on hole 6, look zoom on cliff lip, colour sample check.
**Next** real-key hole 6 splash + dogleg drive checks and save them; hole 5 bunker at (-16.1,-14.6) sits on the cliff lip (inland 0.8); holes 2/3 aces: lengthen or move pins; marker is blurry at the frame's top in aim view (look lane); lighthouse in frame on hole 9 approach not verified.
**Open** autoAim (ball-physics lane) aims straight at a point 13.6 along, so doglegs only work because the corner is placed at the landing; marker follows that rule only by mirroring it.

### Judge 1

**Judged on session 1. Not run: the real-key SPLASH check on hole 6, the hole 9 three-click drive, the lighthouse-on-approach look, and the colour sample. Perf is not scored, because it ran on a software renderer.**

**Must have scores**

1. **LANE GOAL: 9 distinct, readable holes, current pin only, waypoint marker, ducks, blossom shrubs, thick pole: 5.**
   - In the aim and C looks, `pond_water` with `pond_lily` and `pond_sedge` reads on hole 6, and sand pots show beside the greens.
   - The hole 9 C look shows the sea, `house_roof` and a bunker-free fairway. The hole 7 C look shows the current pin only, with no neighbouring flag in the middle third.
   - The pin and waypoint marker are tiny and blurred at the frame top. No look shows the flag as the one vertical accent.
   - The lighthouse is not in frame in the hole 9 aim look.
   - Holes 2 and 3 are aces, so they are too easy.
   - Hole 5's bunker sits on the cliff lip.
   - The hole 6 splash and dogleg checks, the blossom zoom and the colour sample were not run, and no `course-*` real-key checks are saved except `course-only-current-pin`.
2. **Looks as LOOK.md says: 7.** Painted brush pass, cream-green haze, teal sea and a warm sun all show. Brightness is 49–57% with 0% blown out. The subject (golfer) takes only 0.1–0.34% of pixels, and the hole 9 and hole 7 C looks put it at 0–0.02%.
3. **Edit only the lane files: 8.** The last commit touched the lane's own files.
4. **Looks as LOOK.md says (second line): 7.** The tilt-shift band, with its blur at the frame top and bottom, is present and no frame is unblurred. The sea and haze fit.
5. **Plays as DESIGN.md says: 5.** The HUD and the C view work, and `__game` lists the actions. I ran no `interact` with real keys, so the three-click meter and R replay are unproven.
6. **Camera: 6.** The camera sits high behind the ball with a narrow FOV, and the C view shows the diorama. I saw no flight-follow or flyover.
7. **Ball flight: 5.** Surfaces exist, but I saw no flight or bounce in this session.
8. **Full 9 holes, sheep, hazards: 6.** `sheep*` ×4–5 are on the fairways, and holes, pond, sea and house are present. Holes 2 and 3 are aces by the builder's own sweep.
9. **Stroke play and scorecard: 5.** Not exercised this session. The HUD does show "ROUND EVEN" and the hole par.
10. **HUD: 7.** Hole, par and strokes are top left, wind top right, club bottom left. The Isle Blitz-style panels are legible.
11. **`window.__game` with `observe()` and `act()`: 8.** The actions are documented and `look` can set the hole. The sheet's `{hole:n}` is 0-based: the sheet's "hole 1" cell shows HOLE 2.
12. **Golfer matches CHARACTERS.md: 5.** I only saw `golfer_body`, tiny at 0.1–0.3% of the frame, so the silhouette is not checkable.
13. **COORDINATION.md and the load-order rule: 7.** I did not check the imports.
14. **Events named `course:<thing>` and `lanes/course.md`: 7.** The builder wrote `lanes/course.md` and a `hole:start` hook.
15. **Pictures taken with interact and look: 5.** The sheet looks are taken from state, not from real inputs.

**Faults: 6.** There are no console errors. There is one warning, `toNonIndexed(): already non-indexed`. Perf is 1302 ms a frame on SwiftShader, which is noise. There are 385k triangles and 151 draw calls, which is heavy for the GPU. The aim view's top-of-frame blur and the tiny golfer are not faults, but they hurt readability.

**Next:**
1. **Run the real-key checks and save them.** On hole 6, hold A/D toward the pond, W/S for the wedge, then Space three times at full power. Expect the banner 'SPLASH!' and strokes 2. Then drive along the waypoint and expect `ball.surface` 'fairway'. Save as `course-h6-splash`. Do the same on hole 9 for green in at most 3 strokes, with `look:true` on the approach to show the lighthouse in frame. If the lighthouse is out of frame, move the hole 9 tee, aim or camera framing in `course.js` or `island.js`.
2. **Make the current pin and waypoint marker read.** Make the flag pole taller and add a bright, unblurred cap or ring in `pins.js`, so it is the one vertical accent in the aim view. Check with `look` at the hole 1, 5 and 9 aim views using `zoom` on the pin. The hole 9 pin is near the top edge in the C view, so pull the C framing or the pin's screen position inward.
3. **Fix the course tuning the builder flagged.** Lengthen or move the pins on holes 2 and 3 so they are not aces, using a bunker or a carry. Move hole 5's bunker at (-16.1,-14.6) inland off the cliff lip. Then run a `look` zoom on the cliff lip for blossom shrubs, and a `sample` on hole 1's ribbon against #5d8a3a.

Not asked: `autoAim` (ball-physics lane) aims straight at a point 13.6 along, so the waypoint marker only mirrors that rule. The builder's Open records this, so use a different route: set the corner at the landing spot, as done now, and don't rewrite `autoAim`.

SCORE: 6.2

## The request changed

paprika-loop/PROMPT.md changed before session 2; the Next lists above were written before it. Changed lines:
+ 0. TOP PRIORITY, owner feedback after playing: "make the ground tiling les pixelated looking ... Also spacing is a little too close. Make it a little wider". Course lane's part: (a) the ground (terrain, fairway mowing stripes, rough, greens, sand, cliffs) must not look pixelated or tiled: raise texture resolution, use LinearMipmapLinear + max anisotropy (renderer.capabilities.getMaxAnisotropy()), break up repetition with macro variation / blended noise at two scales, and make the mowing stripes smooth-edged (no stair-stepping from vertex colours: add terrain subdivisions where the stripes are or move the stripes into a smooth texture/shader term). Prove with a look zoom on hole 1's fairway and on the rough at the aim view: no visible pixel blocks or repeated tile pattern. (b) Spread the holes, props and set-dressing a little wider apart (roughly 15-25% more room between holes, trees, bushes, house, fences) so the course feels less cramped, while all 9 holes stay on the island, playable, and the checks below still hold (the sea stays OB). The look lane owns camera width/FOV; if the wider spread needs the diorama/flyover to pull back, note it in lanes/course.md.

## Iteration 2
**Did** Owner priority 0. (a) island.js: `stripeTex` (16 px/m DataTexture from course.js `stripeAt`) + `grainTex` (3-scale tiling noise) in `terrainMat.onBeforeCompile`, LinearMipmapLinear + `getMaxAnisotropy()`; vertex-colour stripes removed in `courseColour`. (b) course.js `SPREAD = 1.12` scales HOLES paths/bunkers, HOUSE, POND, COW, BELL, HILL, LH_COT, TREES0, FLOWERS, topH bumps, ISLE_A/B; island.js path curves and fences scaled, terrain 78x54 (390x270 segs); bunkers within 3.2 m of the cliff are pulled inland.
**Saw** Zoom on hole 1 fairway/green at the overview: stripes smooth-edged, no pixel blocks or repeated tile. Eval sweep (auto-aim + needPower) finishes all 9 holes in <=3 strokes, all pins 'green'; yards now 131,142,135,232,254,203,258,288,443. Island overflows frame left/right in the hole 1 aim look (look lane's camera). Not run: perf, rough zoom in true aim view (camera is game-controlled), real-key checks.
**Next** look lane to widen the camera; real-key hole 6 splash and hole 9 checks from Judge 1; holes 2/3 still easy; pin/marker readability; verify trees/props didn't land on bunkers/fairway after scaling (TREES filter handles fairway).
**Open** Holes are ~12% longer (a 5-par at 443 yd); drivers reach 204 yd so par 4s need two shots, as before. Bunker-ray clearing ran after scaling, not re-verified by look.

### Judge 2

Judge 2 is written from what I saw. I did not prove the hole 6 SPLASH. My one real-key attempt landed on the rough with strokes 1, and the pin on the hole 6 C view was too small to read. I also did not run the hole 9 drive or the colour sample.

**Judged on session 2. Perf was not scored: it ran on SwiftShader at 1391 ms a frame, with 415k triangles and 159 draw calls.**

**Must have scores**

0. **Ground not pixelated or tiled, and spread 15–25% wider: 8.**
   - The zoom on hole 1's fairway and rough shows no pixel blocks or repeated tile. The stripe edge from `stripeTex` is smooth, with a soft macro blotch from `grainTex`.
   - Hole 6's C view shows the course more open (`pond_water`, sea on the right, bunker-free fairway), and `SPREAD = 1.12` is applied.
   - Missing: the 15–25% spread is only 12%. I saw no rough zoom at a different aim view. The hole 1 aim look shows `island` filling the frame edge to edge, so the look lane's camera was not pulled back.
1. **LANE GOAL (9 holes, current pin only, waypoint marker, ducks, blossom shrubs, thick pole): 6.**
   - `course.pinVisible` is `[false,…,true,…]` on hole 6, so only the current pin shows.
   - `way_post`, `way_diamond` and `way_ring` show on hole 1 and hole 6.
   - Ducks and `pond_lily` show on the pond. The hole 1 look shows `blossoms*` shrubs.
   - On hole 1, `pin_pole` and `pin_flag` cover 0.08% of the frame (the pole is 9 px wide), so the flag is not the one vertical accent.
   - On hole 6's C view the pin is at the frame top, about 20 px, and blurred.
   - The hole 6 SPLASH check was not proven (see the top). The hole 9 drive and lighthouse-in-frame were not run.
2. **Looks as LOOK.md says: 7.** The painted pass, cream-green haze, teal `sea` and warm sun all show. Brightness is 49–55% with 0% blown out. The `golfer_body` is only 0.28–0.34% of the picture and its edge contrast is 0.03–0.14, so the C view says it "blends in".
3. **Edit only the lane files: 8.** The session's changes were in `src/course.js` and `src/island.js` plus notes.
4. **Looks as LOOK.md says (tilt-shift and haze): 8.** The blur band at the frame top and bottom is present and no frame is unblurred.
5. **Plays as DESIGN.md says: 6.**
   - Real keys worked: S×3 changed the club, D held changed `aimDeg`, and three Space presses gave strokes 1 and a "PERFECT!" meter label.
   - The ball went to rough at 181 yd with the sub "IN THE ROUGH: SHORTER SHOT".
   - I did not exercise R replay or the scorecard.
6. **Camera: 6.** The aim view is high behind the ball with a narrow fov of 30, and the C view pulls back (fov 31.87, y 27.8). I did not see the flight-follow or flyover. The wider spread is not reflected in the framing.
7. **Ball flight: 6.** A swing ended in `ball.surface` "rough" with a lie change at frame 153. I saw no bounce or water drop.
8. **Full 9 holes, sheep, hazards: 6.** `sheep*` ×9 are present and the layout reads. The builder's sweep has every hole done in 3 strokes or fewer, so holes 2 and 3 are still too easy. The hole 5 bunker was not re-verified.
9. **Stroke play and scorecard: 5.** The HUD shows "STROKES 1" and "ROUND EVEN", but no card was seen.
10. **HUD: 8.** The hole, par, strokes and yards panel is top left. Wind is top right, the club list is bottom left and the hint is bottom right. All are legible, with 0 overlap.
11. **`window.__game` with `observe()` and `act()`: 8.** `state`, the actions and the `course` block (`waypoint`, `pinVisible`) all work.
12. **Golfer matches CHARACTERS.md: 6.** I saw a red-and-white golfer with a helmet at 0.3% of the frame. I did not check it against CHARACTERS.md.
13. **COORDINATION.md and load-order: 7.** I did not check the imports.
14. **Events named `course:<thing>` and `lanes/course.md`: 7.** `course.waypoint` and `pinVisible` are exposed in the state. The pull-back note for the look lane is recorded.
15. **Pictures taken with interact and look: 6.** The looks come from stepped real-key play, but I did not save a `course-*` check.

**Faults: 6.**
- The console shows one error, `SFX[k] is not a function (src/sound.js:71:61)`, on the swing. It is not a lane file but it is a real fault.
- The warning `toNonIndexed(): already non-indexed` is still there.
- The hole 1 tree blobs (`appleTree_leaves0` 6.4%, `tree19_leaves0` 5.7%) crowd the aim view.

**Next:**
1. **Make the flag the one vertical accent** (asked again). In `pins.js`, make `pin_pole` taller and thicker and add a bright cap or ring at the top, so it reads in the hole 1 aim view and the hole 6 C view. Shown done by `look` with `zoom` on the pin at [690,80,780,220] on hole 1: a pole at least 20 px wide with a bright flag, with `pin_pole` above 0.3%. In the hole 6 C view, move the pin from the top edge (y≈55) inward.
2. **Prove the hole 6 SPLASH and the hole 9 drive with real keys, and save them as `course-h6-splash` and `course-h9-drive`** (asked again). The first try drifted to the rough, because D held 25 frames only turned `aimDeg` to 10°. The pond is at bearing ≈46–60°, so hold D until `aimDeg` is above 40 (use `until`), pick the wedge, then Space×3. This shows `banner` 'SPLASH!' and `strokes` 2. For hole 9, read `ball.surface` 'green' within 3 strokes and the lighthouse in `look`. If it is not in frame, shift the hole 9 aim or tee.
3. **Widen the spread and fix the easy holes.**
   - Raise `SPREAD` from 1.12 to about 1.2 and record in `lanes/course.md` that the look lane must pull the camera back. The hole 1 aim look currently clips the island on the left and right.
   - Move the pin or add a bunker or carry so holes 2 and 3 are not 3-stroke walks.
   - Re-verify bunkers against the cliff lip and the fairway after scaling, with a `look` zoom on hole 5 and a `sample` on hole 1's ribbon against #5d8a3a.

SCORE: 6.7

## Iteration 3
**Did** Only Next item 1 (flag as the vertical accent), in `src/pins.js`: `pin_pole` 2.2 m tall and 0.17-0.19 m wide (was 1.35 m, 0.1 m), `pin_flag` cloth 1.05x0.7 at y 1.85, `pin_knob` is now a 0.15 yellow (#ffd23a) MeshBasicMaterial sphere at y 2.25 as a bright cap.
**Saw** Hole 2 aim look (state {hole:1} loads "HOLE 2"): `pin_pole` 0.19% [674,62,688,226] (was 0.08% on hole 1), `pin_flag` 0.13%, `pin_knob` 0.039%. Pole is ~14 px wide, still softened by the tilt-shift blur at the frame top. 0 console errors from the change; the `toNonIndexed` warning is still there. Brightness 50%, 0% blown out. Not run: perf, hole 6 C-view pin position, the splash and hole 9 real-key checks, the SPREAD raise, holes 2/3 difficulty, and the saved `course-*` checks.
**Next** (1) Real-key hole 6 splash (hold D until aimDeg > 40, wedge, Space x3) and hole 9 drive; save as `course-h6-splash`, `course-h9-drive`. (2) Raise `SPREAD` toward 1.2 in `src/course.js` and note the camera pull-back in `lanes/course.md`; add a carry or bunker on holes 2 and 3 (still 3-stroke walks). (3) Check the pin on the hole 6 C view is inside the frame, not at the top edge.
**Open** Pole and flag may now look oversized on the C view; unchecked. `SFX[k] is not a function` (`src/sound.js`) is outside this lane.

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

### Judge 4

I've finished the checks I could fit in the call budget, so I'm writing the verdict now.

**Judge 4.** Session 4 was judged on SwiftShader. Perf read 2452 ms a frame at host load 4.0, so it is not scored. It reports 429k triangles, 158 draw calls and 2.38 MB of textures. The hole 6 SPLASH and hole 9 drive are still unproven. The `until` on `aimDeg` [30,90] was already true at the start (aimDeg 29.4 reads as inside it), so D barely turned. The 3 clicks then gave "HOOK!" and the ball ended in the rough with strokes 1, so the pond was never aimed at.

**Must have scores**

0. **Ground not pixelated or tiled, spread 15–25% wider: 8.**
   - A zoom on hole 1's fairway [300,350,800,640] shows smooth painterly stripes and rough with no pixel blocks and no repeated tile.
   - A sample on the `island` ribbon at (600,500) reads #76a14c, within 30/255 of #5d8a3a.
   - `SPREAD` is now 1.2, and the tree and bush clusters on holes 1 and 4 have more room around them.
   - Not seen: the rough zoom on hole 6, and the cliff-edge tree crowding on holes 6 and 7.
1. **LANE GOAL: 6.**
   - `course.pinVisible` is true only for hole 6, as it should be, and `way_post`, `way_ring`, `way_diamond` and `aimLanding` show on hole 1.
   - `pin_pole` is 25 px wide but sits at the frame top [875,8,900,175], and its `pin_flag` is cut off at y=0. It is still not the clear accent.
   - On hole 6 `aimDeg` 29° against `pinBearingDeg` 55° means auto-aim is off by 26°, outside the 11–26° the brief calls too much.
   - Holes 4 and 7 show sand pots by the greens, and hole 6 shows `pond_water` with its lily and sedge.
   - The splash and hole 9 checks are unproven, and no `course-*` check is saved.
2. **Looks as LOOK.md says: 8.** The painted pass, cream-green haze and warm sun show, with brightness at 51–56% and 0% blown out.
3. **Edit only the lane files: 8.**
4. **Tilt-shift focus band: 8.** The blur is clear at the top and bottom of every look.
5. **Plays as DESIGN.md says: 6.**
   - Real keys changed the club, Space ran the 3-click meter, and the result was "IN THE ROUGH: SHORTER SHOT".
   - R replay and the scorecard are still unseen.
6. **Camera: 6.** The aim view has fov 30 high behind the ball. Flight-follow and the flyover are unseen.
7. **Ball flight: 6.** I saw a rough landing only, with no bounce, water drop or OB.
8. **Full 9 holes, sheep, hazards: 7.**
   - Holes 1, 4, 6, 7 and 9 read well, and `sheep*` show on holes 1, 6, 7 and 9.
   - Hole 1 is an open walk with no carry.
9. **Stroke play and scorecard: 5.** The HUD shows strokes and "ROUND EVEN", but no card was seen.
10. **HUD: 8.** All five elements are legible with 0 overlap.
11. **`window.__game`: 8.** `course.waypoint`, `pinVisible` and `needPower` are all in `observe()`.
12. **Golfer matches CHARACTERS.md: 6.** `golfer_body` is 0.24% of the frame with edge contrast 0.07, so it still blends into the grass.
13. **COORDINATION.md and load-order: 7.** The imports were not checked.
14. **`course:` events and `lanes/course.md`: 7.** The pull-back note is now written.
15. **Pictures with interact and look: 6.** The looks come from stepped play, but still no `course-*` check is saved.

**Faults: 5.**
- `SFX[k] is not a function` in `src/sound.js` (outside the lane).
- `toNonIndexed(): already non-indexed` warned at load.
- The hole 1 pin is cropped at the top of the aim view.
- The golfer is lost against the grass.

**Next:**
1. **Prove the hole 6 SPLASH with real keys** (asked again). Auto-aim sits at 29° against a pin bearing of 55° on hole 6.
   - First fix the waypoint in `src/course.js` so auto-aim points at the pond or pin within about 10°.
   - Then hold D with `{until:{aimDeg:[50,60]}}`, press S to wedge, and press Space 3 times at full power.
   - Save it as `course-h6-splash`; the reply should show `banner` 'SPLASH!' and `strokes` 2.
   - Then do the same for the hole 9 drive: `ball.surface` 'green' within 3 strokes, saved as `course-h9-drive`.
2. **Make the pin the one clear accent.** In `src/pins.js` and the aim-view framing, the hole 1 `pin_pole` and `pin_flag` run off the top of the frame [875,8,900,175].
   - Lower the target or raise the pole's visible share so the flag is fully inside the frame, and make the flag bigger.
   - Shown done by `look` with `zoom` on the pin: flag and `pin_knob` fully inside the frame, ≥14 px wide.
3. **Add a carry or bunker on holes 2 and 3** (hole 1 is an open walk too), and check the cliff-edge trees on holes 6 and 7 at the 1.2 spread.
   - Shown done by `look` with `sheet` for holes 2 and 3: a sand pot or water carry between tee and green, and no `tree*_leaves0` crowding the cliff lip.

SCORE: 6.8
