The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 3

**Did**
- Load error fixed (Judge Next 1). Found with `node --check src/*.js`: in `src/assets.js:22` the batch edit had put a `//` comment in front of the `lib` loader's closing `}); return g; };`, so the next line's `export const [sheepGLB, …]` sat inside an open function. The comment now follows the code. `src/stage.js:9` has its `;` back before the comment.
- `CHARACTERS.md` Golfer entry rewritten for the footballer the owner restored (teal `footballer_helmetShell` with face guard, shoulder pads, numbered jersey in the kit colour, black trousers, walk to the ball).
- `game-tests.json` check `look-dither-nearplane` now reads `look.dither.nearFades.1` for `tree4_leaves0`: with the library tree models `tree1_leaves0` fades first and `tree4_leaves0` second, both listed.
- `src/camera.js` `updateCamera`: the aim camera now holds for the first 0.25 s of a full shot's flight (`G.flightT < 0.25`, not putts), so the strike's punch and FOV kick play on a still frame before the camera chases the ball. 70 of 70 checks still pass with it.
- Tried `updatePost(0); renderFrame(0)` at the end of `src/main.js` for the frame-0 capture; it changed nothing and was reverted.

**Saw**
- `open index.html`: loads in 1.5 s, no console error, `observe` returns state. `test`: 70 of 70 pass. `perf`: 7.3 ms median frame (82 fps), 185 draw calls, 4.44 MB assets, within the desktop budget.
- Title look (baseline `before-title`): brightness 53%, saturation 45%, `bushes` ×232, `hydrangeas` ×43, `sign_arrow` ×9, `teeBench` ×8; no `Lighting:` or `Surfaces:` line.
- Next 2 (asked again): sheet cell two players, `state {hole: 5}`, `next`: island under the HOLE 6 banner, saturation 44% (with `{wait: 20}` 49%). After `swing … settle:true` and 120 frames the golfer stands at the ball (picture; hole 1 aim state: `creatures.footballer` -12.88, 14.7 against `ball` -12.84, 15.36, 0.66 apart, which is the address stance beside the ball).
- Next 3 (asked again): `feel` on `{state:{hole:0,skipIntro:true}}, {wait:150}, swing 0.9, {wait:10}`: Sounds started 8, `feelBits` 0 → 32 at the impact frame, smoke puff. Its Camera line reads "moved up to 67.4 and did not come back" because the flight camera follows the ball straight after impact, so `feel` cannot show the lurch as out-and-back. The `interact` trace of the same play does: `camera.fov` 33 → peak 34.44 at frame 162 → 33.05 at frame 191, `feel.shake` 0 → 0.158 at frame 162 → 0.002.
- Hole 1 aim look (after one extra `{wait: 1}`): saturation 48%, golfer 0.61%, subject brightness 42% against 56% around it, `bushes` ×37 (7.7%), `hydrangeas` ×7 (2%) read as soft painted shrubs; no `Lighting:` or `Surfaces:` line.

**Next**
- Strike lurch that `feel` can read: `feel` measures the camera from its pose at the first step (the title diorama, 67 units from the tee), so the lurch is lost in that move even with the 0.25 s hold. A `?hole=1` query read in `src/main.js` (`QS` is already there) that starts the page on the tee would let `open` with that url and `feel` on `swing` alone report it.
- Cut the main scene pass (10.2 ms, 2.38 M triangles with the shadow pass; `bushes` and `grass` instances are most of it): fewer blank captures if the race above is GPU time, and headroom on weaker machines.
- Assets (Must have 13): flags/cups, tee markers and waterline boulders are still code; search `asset_search` again for a stylized golf flag and rocks.
- Course and play (Must have 12): check each green's slope arrows in a putt look on holes 4, 7, 9 and that the card-to-next-hole flow never waits on input longer than the card itself.

**Open**
- Blank pale capture (saturation 12%, only the page background and HUD) is the capture, not the page: `eval` reading the canvas right after such an `interact` returns scene pixels (120,163,77,255), and the next `look` still pictures it blank. It depends on the frame count of the last step: after `start`, `next`, a last `{wait: 37}` or `{wait: 40}` is blank, 30/33/34/38/39/41/42/60/80/120 paint, and `{wait: 20},{wait: 20}` paints. Frame 0 after a reload (a sheet cell with no steps) is also blank; `frames: 1` paints. One extra `{wait: 1}` step before the look painted it three times and failed once (mid-flight, after `swing`, `{wait: 27, draw: true}`, `{wait: 60}`, `{wait: 1}`), so it looks like a race between the frame's GPU work and the capture, not a frame the page fails to draw: when a look is pale at saturation 12%, send `interact {wait: 1} look: true` again. Sheet cells with steps painted in 19 of 21 cells this session. `preserveDrawingBuffer: true` in `src/stage.js` does not change it.
- `feel` lists `club_shaft`/`club_grip` teleports of 0.83 units at the swing's first frame: the club snapping from address to backswing. Not smoothed.
- `perf`: 1.34 M triangles on screen (over the 200k guide, frame time still in budget); p95 28.6 ms on a busy host.

### Judge 3

The page loads in 1.7 s with no console errors, and you can play it from tee to scorecard. On hole 1 I used `aim at:pin` and `swing` to finish in two strokes, and the `card` showed a BIRDIE stamp with par 34. The keyboard three-click meter works: Space started the meter, `meter.power` stopped at 0.594 and gave "SLIGHT HOOK". C switched `overhead` on and back off, and R put `strokes` back to 0 and the ball back on the tee. Judge 2's two repeated items are done. The two-player hole 6 cell shows the island under "ISLA TO PLAY" at saturation 45%. After the ball settles, `player` stands at it. In the sheet, the title cell after `{wait: 30}` came out pale (saturation 12%), and so did one `interact` look right after a strike. Both match the capture race that Iteration 3's Open describes. Every later look painted.

1. **Looks as LOOK.md says: 7.** Hole 1 aim: saturation 47%, `island`, `sea` and `appleTree_leaves0` drawn with the painted pass. The tilt-shift band is sharp on `player` and the ball and blurred top and bottom. There is cream-green haze over the distant `cliffFace`, and the `sea` is teal in the card view. No `Lighting:` or `Surfaces:` lines. On the aim view, the subject reads 42% brightness against 61% around it, so it stands out, but only just.
2. **Plays as DESIGN.md says: 8.** Keyboard Space ×3 drives `meter.stage` 0→3. D aims (`aimDeg` 5.1), W changes club (iron→driver), C toggles `overhead` (frames 151–192), and R replays (strokes 1→0, `ball.x` 11.86→3.78). Mouse clicks were not tried.
3. **Camera: 8.** The aim camera is high behind the ball (pitch 20.9°, `camera.fov` 29–34). The flight cell follows the ball with `ballTrail` and `landRingPreview` in view. The "h1 intro" cell pulls back for the flyover over the green.
4. **Ball flight by surface: 6.** Fairway, rough ("IN THE ROUGH: SHORTER SHOT") and green lies all work, and `physics.firstBounce.surf` is recorded. I saw no water drop, out-of-bounds or sand result this session.
5. **Nine playable holes: 7.** I saw holes 1, 4, 5, 6, 7 and 9 with their names (Pebble Step, Lantern Road, Chimney Turn, Duck Pond Bend, Mid Meadow, Lighthouse Home). Pars are 3,3,3,4,4,4,4,4,5. `pond_water`, `lighthouse_tower` and `house_walls` are on screen, and 10 `sheep` walk and graze. `sheepHits` stayed 0 in every play, so the bounce off a sheep with a baa was not shown.
6. **Stroke play and scorecard: 8.** The `card` shows the PAR row, TOT 34, +/- (−1), and a BIRDIE stamp with "SPACE · NEXT HOLE". The two-player turn banner works. The kit colour dot sits by ISLA.
7. **HUD: 8.** `#holep` is top left (hole, par, strokes, yards, round), `#windp` top right ("3 MPH ← CROSS"), the meter bar bottom centre, and `#clubp` bottom left with yards and lie, all in the steel Isle Blitz type.
8. **`window.__game` and 60 fps: 9.** `observe` and `act` drive everything above. `perf`: 2.4 ms median frame (129 fps), 185 draw calls, 4.44 MB of assets, within budget.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal with a face guard, the jersey is in the kit colour and the trousers are black, matching the rewritten entry. No brands are on screen. In the putt look, `club_head` reads as a large yellow block beside the ball.
10. **Game feel: 6.** The strike reacts: `feel.shake` peaks at 0.116, `camera.fov` goes 29→33.95, `feelBits` 0→30 at frame 163, and 16 sounds start. Three things are weak. Landing has no reaction: `landPuffs` is "Never visible" in every look, and `feel` shows no particles after the strike. `club_head` teleports 1.95 units at the swing's first frame. The camera lurch still reads as "moved up to 67.4 and did not come back".
11. **Richer look: 7.** Library trees (`tree*_leaves0`), `bushes` ×216, `hydrangeas` ×42, `pond_sedge` ×70, `rowingBoat`, `teeBench` and `smoke` add detail. The water and the golfer's motion look about the same as the starting commit.
12. **Course and play: 6.** The hole 4 putt shows `slopeGrid` ×24 arrows that read clearly, and the card-to-next-hole flow worked. Three problems. The API's `needPower` with accuracy 0 chipped in from 37 yd in the rough for an eagle on hole 7, so the perfect line holes out too easily. `lastResult` carried "BIRDIE!" from the previous hole into the first shot of hole 7. Nothing showed a hazard or a sheep changing which shot to play.
13. **Better assets: 6.** The trees, bushes, hydrangeas, signs, cattails, cottage, lighthouse, bench, boat, sheep and cow all come from the library. Still built in code: `fencePosts`/`fenceRails`, `seaStacks`, `cliffRocks`, `teeMarker`, `pin_flag`/`cup`.

**Faults: 7.**
- No console errors. three.js warns once: `toNonIndexed(): BufferGeometry is already non-indexed`.
- `club_head` teleports 1.95 units and `club_grip`/`club_shaft` 0.83 units at the swing's first frame.
- `landPuffs` is never visible.
- `perf` p95 is 19.5 ms with 172 frames over 3× the median. The host load was 4.7 on 8 cores, so treat that as noise.
- The pale captures at saturation 12% are the known tool race.

Next:
1. **Fences and sea stacks are still built in code, and nobody has searched for them.** `fencePosts`/`fenceRails` (beside the hole 4 green) and `seaStacks`/`cliffRocks` (around the island in the card view) have no search in `paprika3d/sourcing.json`. Run `asset_search` for "stylized wooden fence rail" and "stylized sea stack rock pillar". `pick` a close hit, check it with `model_audit`, and replace the code meshes. To see it done, `look` at the hole 4 putt and the card view should list the picked model names where `fencePosts*` and `seaStacks*` are now.
2. **Give landings a reaction and fix the club snap.** `landPuffs` is never visible and no particles appear after the strike. Spawn a puff from `landPuffs`, tinted by surface (sand, grass, green), on `physics.firstBounce`, plus a thud sound. Ease `club_head` from address into the backswing over 4–6 frames instead of jumping 1.95 units. To see it done, run `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, swing 0.75, {wait:100}` and `frames: 90`. It should show a `landPuffs` count rising at the bounce frame, a sound started there, and no `club_*` teleport.
3. **Show hazards and sheep changing the shot, and clear `lastResult` between holes.**
   - Save checks with `interact` `expect`: a shot on hole 6 aimed into `pond_water` should give a water drop and a penalty stroke; a shot into the `sea` should give out of bounds; a shot through a `sheep` should give `sheepHits` ≥ 1 and a baa.
   - Make a perfect `needPower` shot from 30+ yd in the rough land short of the cup most of the time, so chips do not hole out.
   - Clear `lastResult` on `next`.

SCORE: 7.1
