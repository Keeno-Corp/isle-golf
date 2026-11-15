# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1

Feel is measured (strike: 32 bits at the impact frame, shake peak 0.158; hole-out: 69 bits). Saving two checks for it, then running the full suite and writing the handoff.

### Judge 1

1. **Looks as LOOK.md says: 7.** Check 1 passes in the aim view: the top fifth is blurred and the band on `ball1` is sharp. Check 2 passes for the sea at the title corners (#055753 and #036862 against #0f6a67); the fairway was not sampled. Check 3 passes, with `#meterp` shown only during the swing. Check 4 passes with no `Lighting:` or `Surfaces:` lines. Two faults: the two-player intro of hole 6 drew a flat pale frame with no scene (brightness 72%, saturation 13%, only the "HOLE 6 / ISLA TO PLAY" banner), and large flat white blobs sit unshaded in the aim view (bottom centre near [390–550, 650–800], probably `blossoms`).
2. **Plays as DESIGN.md says: 8.** A/D moved `aimDeg` 358 → 0.1 → 358, W/S switched iron → driver → iron, C toggled `overhead` on and off, and three Space clicks ran `meter.stage` 0 → 2 → 3 with "SNAP 58%" then "SLIGHT SLICE". R, the mouse drag and the wheel were not played.
3. **Camera: 8.** It sits behind the ball at 20.9° pitch and follows the flight (`camera.x` -22.0 → -17.0), and the flyover opens from the diorama. The aim FOV is 33 where LOOK.md says about 30.
4. **Ball flight: 8.** `ball.y` arced 4.53 → 5.43, the wedge carried 45 yards with two bounces on the green, the wind flipped from tailwind to headwind with the aim, and `landRingPreview` and `ballTrail` showed. Sand, water and out of bounds were not played.
5. **Nine holes: 8.** Seen: Pebble Step (par 3, 129 yd), Duck Pond Bend (par 4), Mid Meadow, Lighthouse Home (par 5, 474 yd), with flags, bunkers, pond, house, lighthouse, trees and ten wandering sheep. The sheep bounce was not played.
6. **Stroke play and scorecard: 8.** The card after hole 1 shows the par row, ISLA's 2 and a BIRDIE stamp with "SPACE · NEXT HOLE"; the two-player start shows "ISLA TO PLAY". Kit colours for players 2–4 were not seen.
7. **HUD: 9.** `#holep` top left, `#windp` top right, `#meterp` bottom centre, `#clubp` bottom left, cream on green steel, no overlap. The `#tag` "ISLA" sits over the golfer's chest, and `#hinter` keeps showing aim keys during flight.
8. **`window.__game` and 60 fps: 9.** `observe`, `act` and `setState` all drove the play. Median frame 1.9 ms, within budget; p95 19.2 ms was read on a busy host (load 4.5 on 8 cores). 530,118 triangles and 158 draw calls are over the guides.
9. **Golfer matches CHARACTERS.md: 5.** On screen the golfer is a footballer: teal `footballer_helmetShell`, shoulder pads, a number 4 jersey and black trousers. CHARACTERS.md gives a cream cap and cream-khaki trousers. Only the red kit shirt matches. No brands on screen.
10. **Game feel: 7.** The strike gave `feelBits` 0 → 29, a `ballShadow1` scale pop and an FOV kick of 33 → 33.93; the green landing gave `landPuffs` and 14 bits. `feel` found no colour flash, no out-and-back camera shake and no sounds on the strike. The hole-out was not measured this session.
11. **Richer look: 7.** Library trees, cottage, standing stones, benches and boats are in, and evening light works. The golfer has backswing and follow poses but its shadow is a hard dark shape, and `bushes` are still faceted code blobs filling the foreground.
12. **Course and play: 7.** `slopeGrid` arrows read clearly on the green, and the flow from hole to card worked. How differently the holes play was only partly seen.
13. **Better assets: 7.** Sheep, trees, lighthouse tower, cottage, stones, benches and boats are from the library with credits. `sourcing.json` holds no search for `bushes`, `sign_post`/`sign_board`, `teeMarker`, `pond_cattail`/`pond_lily`, grass or sand textures, or the sky.

**Faults: 6.**
- The blank pale frame in the two-player hole 6 intro.
- After a second shot made with the `swing` action and `settle:true`, the golfer stood at (-3.2, 15.24), beyond the pin, with the ball at (-1.02, 14.19) on the green.
- `divots` was never visible after two shots.
- One three.js warning at load (`toNonIndexed`: already non-indexed).
- 183 frames ran over three times the median, on a busy host.

Next:
1. Run `asset_search` for the objects still made in code with no search on record: `bushes` ("stylized bush hand painted shrub"), `sign_post` and `sign_board` ("wooden signpost stylized"), `teeMarker`, pond reeds and lilies, and grass and sand textures ("stylized painted grass texture"). Replace the 327 faceted `bushes` first, since they fill the aim view; the aim look on hole 1 should show soft painted shrubs.
2. Fix the blank pale frame: start two players, `setState {hole: 5}`, `next`, and the intro of hole 6 draws only haze. The same look should show the island under the "ISLA TO PLAY" banner, with saturation near 45%. While there, place the golfer beside the ball after every settle; `creatures.footballer` should be within about 0.5 units of `ball` in the putt view.
3. Make the golfer and CHARACTERS.md agree: either give the figure the cream cap and cream-khaki trousers the sheet asks for, or rewrite the Golfer entry for the footballer the repo's commits restored. Then add an out-and-back camera shake and a sound to the strike, so `feel` on the `swing` action reports a camera lurch and at least one sound started.

Not checked: R replay, mouse input, sand, water, out of bounds, the sheep bounce, the hole-out feel and holes 2–5 and 8.

SCORE: 7.4

## The request changed

paprika-loop/PROMPT.md changed before session 2; the Next lists above were written before it. Changed lines:
+ 10. Game feel: the three-click meter, the strike, the ball's flight, each landing by surface, the hole-out and the camera follow each answer with feedback a player feels (motion, a short hit-stop or shake, particles, sound), measured with `feel`.
+ 11. Look: richer course detail, lighting, water and golfer animation than the starting commit, still inside LOOK.md's Checks.
+ 12. Course and play: each of the nine holes plays differently, putting has a readable green slope, hazards and sheep change the shot a player picks, and the flow from hole to scorecard to next hole never stalls.
+ 13. Better assets: the key things a viewer sees (trees, rocks, the house, the lighthouse, sheep, flags, course props, textures, the sky) come from the paprika3d library through `asset_search` where it has a higher-quality match in the stylized Shepherd Isle look, each picked one checked with `model_audit` and credited; code-built stand-ins are replaced first. Nothing paid and no generated models.

## Iteration 2

Real load error after the batch edit. Locating the exact column.

### Judge 2

The page does not load, so nothing in the brief could be seen or played. `open` failed twice (on `.` and on `index.html`) with "no window.__game, three.js renderer or WebGL canvas" and the console error `Unexpected token 'export'`. Every item scores 1 because the page shows none of it; the session 2 work in the source is unjudged.

1. **Looks as LOOK.md says: 1.** No canvas, so no look and no Checks could be read.
2. **Plays as DESIGN.md says: 1.** `window.__game` does not exist, so no input could be sent.
3. **Camera: 1.** Not drawn.
4. **Ball flight: 1.** Not playable.
5. **Nine holes: 1.** Not drawn.
6. **Stroke play and scorecard: 1.** Not reachable.
7. **HUD: 1.** Not seen.
8. **`window.__game` and 60 fps: 1.** `window.__game` is missing and `perf` cannot run on a page with no renderer.
9. **Golfer matches CHARACTERS.md: 1.** Not drawn.
10. **Game feel: 1.** `feel` cannot run. `src/juice.js` holds a strike punch (`FEEL.strikePunch`) and per-surface sprays, unmeasured.
11. **Richer look: 1.** Not drawn.
12. **Course and play: 1.** Not playable.
13. **Better assets: 1.** `src/library.js` now swaps in library `bushes`, `hydrangeas`, `sign_arrow` and `pond_cattailPlant`, but none of it reaches the screen.

**Faults: 1.**
- The module graph fails to parse: `Unexpected token 'export'`, which means an `export` sits inside an unclosed brace or bracket in one file under `src/`.
- I did not find the file. `src/juice.js` lines 12–77 and `src/library.js` lines 14–108 read as balanced. Not read: `main.js`, `api.js`, `pose.js`, `golfer.js`, `sound.js`, `camera.js`, `post.js`, `hud.js`, `island.js`.
- `src/stage.js:9` has its closing semicolon swallowed into the trailing comment ("…never an empty canvas;"). Automatic semicolon insertion should cover that line, so it is probably not the cause, but it shows the batch edit damaged line ends.
- The builder's own Iteration 2 note says the load error was still open when the session ended.

Next:
1. Fix the load error before anything else. Run `node --check` on each file in `src/` (or `bun build src/main.js`) to get the file and line of the stray `export`, close the brace the batch edit left open, and restore the semicolon on `src/stage.js:9`. Done when `open` returns the title diorama with no console error and `observe` returns state.
2. (asked again) Fix the blank pale frame in the two-player hole 6 intro and the golfer's place after a settle. The call that shows it: `look` with `sheet` of one moment (two players, `state {hole: 5}`, action `next`) shows the island under "ISLA TO PLAY" at saturation near 45%; an `interact` swing with `settle:true` shows `creatures.footballer` within 0.5 units of `ball`.
3. (asked again) Make the golfer and CHARACTERS.md agree by rewriting the Golfer entry for the footballer the owner restored, and prove the strike feel. The call that shows it: `feel` on the `swing` action reports a camera move out and back and at least one sound started. Then take the hole 1 aim `look` to confirm the library `bushes` and `hydrangeas` read as soft painted shrubs with no `Surfaces:` line.

Not checked: everything on the page; I also could not run a syntax check myself, so the faulty file is still to be located.

SCORE: 1.0

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

## Iteration 4

Fence panels are placed along the line but render near-black. Checking their material.

### Judge 4

The page loads in 1.4 s with no console errors. In real time it paints correctly: the `look opening` frames at 1.4, 2.0 and 5.0 s show the island, `sea` and the title with the painted look. Some paused-clock captures came out pale (saturation 12%, every pixel #b5c8bc, and `readPixels` returned 0). That includes the paused captures of the hole 4 putt. This is the known capture issue, not a fault in the game. The game camera did not need to work for the fence check: the `cameras` look at the fence drew normally.

The Iteration 4 section in PROGRESS.md is only one line ("Fence panels … render near-black"). It has no Did, Saw or Open, so I judged the page alone.

Two of last verdict's items are done. Water drop and out of bounds now work. The `club_*` teleport at the start of the swing is gone.

1. **Looks as LOOK.md says: 7.** On the hole 1 aim view, saturation is 47%. The tilt-shift band is sharp on `player` and blurred above and below. There is cream haze over the distant `cliffFace`, and the `sea` is teal in the `card` cell. There are no `Lighting:` or `Surfaces:` lines. The golfer is a small subject: 0.61% of the frame on the aim view. The new `fencePanels` render as dark brown wood with visible grain in the "fence close" camera, not black. Their sunlit side faces away from the play camera, so on the hole 4 putt the row reads as a dark silhouette.
2. **Plays as DESIGN.md says: 8.** `act` aim, club and swing all work. The keyboard meter, C and R were confirmed last session. The C cell in this sheet still showed the "HOLE 3" banner view, so I could not confirm it again. I did not try mouse clicks.
3. **Camera: 8.** The aim camera is high behind the ball (`look.camPitchDeg` 20.9, `camera.fov` 33). The flight cell follows the ball with `ballTrail` and `landRingPreview`. The "h1 intro" cell pulls back to the green for the flyover.
4. **Ball flight by surface: 8.** I shot an iron at 57.6° on hole 6 into `pond_water`. It gave "SPLASH!", added a penalty (strokes 0→2 on one swing) and dropped the ball in rough beside the pond. A driver at 200° gave "OUT OF BOUNDS / OVER THE CLIFF AND INTO THE SEA", a 2-stroke total and the ball back on the tee. Fairway and rough lies work. I did not see a sand result.
5. **Nine playable holes: 7.** Holes 1, 3, 4, 6 and 9 are named, and 9 is "Lighthouse Home", par 5. Ten `sheep` walk and graze. I hit a putt down a sheep's line (aim 340.4° from the hole 6 tee), but the sheep had walked to (-22.2, -4.4) and `sheepHits` stayed 0. The bounce off a sheep with a baa is still not shown.
6. **Stroke play and scorecard: 8.** The `card` shows hole 1 PEBBLE STEP, PAR 3, ISLA 2, −1, a BIRDIE stamp and "SPACE · NEXT HOLE". The hole 6 two-player cell shows "ISLA TO PLAY".
7. **HUD: 8.** `#holep` is top left, `#windp` top right ("3 MPH HEADWIND"), `#clubp` bottom left with "LIE · FAIRWAY", and the meter is bottom centre, all in the steel type.
8. **`window.__game` and 60 fps: 9.** `observe` and `act` drove every play above. `perf` measured a 2.7 ms median frame (131 fps), 185 draw calls and 4.54 MB of assets, all within budget.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.** The `feel` run on a hole 1 swing shows `feelBits` 0→30 at frame 164 and 16 sounds. There is no `club_*` teleport any more; the only teleport left is `aimLanding`, 0.58 units. Two things are weak:
    - Landing: `landPuffs` is now on screen (2.6% in the putt look), but `feel` lists no `landPuffs` count rising at the bounce.
    - Camera: it still "moved up to 67.8 … did not come back".
11. **Richer look: 7.** Library trees, `bushes`, `hydrangeas`, `fencePanels` ×14, `teeBench`, `rowingBoat` and `smoke` add detail. The water and the golfer's motion look the same as before.
12. **Course and play: 7.** `lastResult` stayed "" through all three hole 6 plays, so it is now cleared between holes. The pond and the sea now cost strokes, which changes the shot a player picks. Sheep still never change a shot. I did not test the chip-in problem from last verdict.
13. **Better assets: 7.** `fencePanels` come from `fence-4d3f7d.glb`, and the old `fencePosts`/`fenceRails` are hidden. Three code stand-ins are still on screen even though their searches are in `sourcing.json`: `seaStacks`/`cliffRocks` ("stylized sea stack rock pillar"), `teeMarker` ("golf tee marker") and `pin_flag` ("golf flag pin hole"). None of them was picked.

**Faults: 7.**
- No console errors. three.js warns once: `toNonIndexed(): BufferGeometry is already non-indexed`.
- `divots` is "Never visible", although it is in view.
- The Iteration 4 section is a one-line stub with no Did or Open.
- `perf` p95 is 19.1 ms with 176 slow frames. The host load was 4.1 on 8 cores, so treat that as noise.

Next:
1. **(asked again) Replace the sea stacks, tee markers and flag that are still built in code.** Searches for all three are already in `sourcing.json`. For each, `pick` the closest stylized hit from its search, check it with `model_audit`, then hide the code mesh. Do `seaStacks`/`cliffRocks` first, because they ring the island in the title and card views, then `teeMarker` and `pin_flag`. To see it done, take a sheet cell `{state:{hole:0,skipIntro:true}}` through the card. It should list the picked model's name where `seaStacks` is now, and `seaStacks` should appear under "Hidden by the game".
2. **(asked again) Make the landing react and bring the camera back.** On `physics.firstBounce`, raise the `landPuffs` count, tinted by surface (sand, grass, green), and start a thud sound. After the strike punch, ease the camera back to the follow path instead of leaving it raised. To see it done, run `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, swing 0.75, {wait:100}` and `frames: 90`. It should list a `landPuffs` count rise and a sound at the bounce frame, and the Camera line should read "came back".
3. **(asked again) Show a sheep bounce and a sand lie as saved checks.** Add a `setState` option that puts a grazing sheep on the shot line. For example, `{hole:5, sheepAt:[-24,-5.5]}` would hold `sheep[5]` there in "graze". Then `interact` a low iron through it with `expect {sheepHits:[1,9]}` and `save` the check. A "BAA" banner and a sound should appear in the trace. Save a bunker shot the same way, expecting `lie:"sand"`. The builder should also fill in Iteration 4's Did and Open.

SCORE: 7.5

## Iteration 5

**Did**
- `src/pools.js` `updatePool`: every point pool (`landPuffs`, `divots`, `ballTrail`) now sets `geometry.setDrawRange(0, lastLiveIndex+1)` and `pts.visible = hi > 0`. A pool with no live particles is hidden instead of drawing 60–160 points parked at y −999, and its live count is the geometry's draw count. This targets the "divots Never visible" fault and the missing `landPuffs` count.
- No other files changed. Session 4's stub, filled in from the git diff: `fencePanels` (an InstancedMesh from `assets/fence-4d3f7d.glb`, 14 panels, its own textured MeshStandardMaterial) replaced the hidden `fencePosts`/`fenceRails`. The follow-through ramp is now 0.1 s, and the `creatures-real-key-drive-pose` check waits 20 frames.

**Saw**
- Hole 1 iron shot (`{hole:0,skipIntro:true}`, wait 150, aim pin, swing 0.75): the first land event (`feel.last` "land:green") fires at frame 238. 3 frames later, `eval` reads `landPuffs` visible with drawRange 20 and `divots` visible with drawRange 39. At settle (frame 330+) both read hidden with drawRange 0. Land puffs and the land sound (`play('land', surf)` in physics.js:148) already fire on every landing, tinted by surface.
- `feel` on the same steps (frames 90) still lists no `landPuffs` rise. Its Spawned line names `divots` and is cut off with "…", so `landPuffs` may be in it but not shown. The Camera line still reads "moved up to 67.8 … did not come back". The camera follows the ball 12 units down the hole, so out-and-back cannot happen in this window.
- `test`: 70 of 70 checks pass. The only console output is the three.js `toNonIndexed` warning. I did not run `look` compare or `perf` this session.

**Next**
1. Judge items 1 and 3 are untouched. Pick library models for `seaStacks`/`cliffRocks`, `teeMarker` and `pin_flag`; their searches are in `sourcing.json`. Then add a `sheepAt` setState option for a saved sheep-bounce check, plus a bunker check expecting `lie:"sand"`.
2. Camera "came back": measure the punch on its own. A `feel` with frames 20 right after the swing should show the strike lurch returning within the 0.25 s aim-hold before the follow starts (camera.js:65). Or accept the follow camera as by design.

**Open**
- I have not confirmed with a `look` that hidden empty pools changed nothing on screen. They draw nothing when empty, so I expect no change.
- I don't know why `feel` doesn't name `landPuffs` even though its draw count goes 0→20 at the landing. It may be the Spawned list being cut off.

### Judge 5

The page loads in 1.2 s with no console errors. The only console output is the three.js `toNonIndexed` warning. Iteration 5 changed one thing: point pools now hide when empty. Two effects of that show in the measurements. `divots` now registers as a particle burst, "divots 0 → 8 at frame 164" in a 25-frame `feel`. `landPuffs` is listed on screen in the "landing +3" cell. The first cell of each sheet still comes out pale (saturation 12%, a flat #b5c8bc frame). This is the known capture problem: the same views paint correctly in every other cell.

Two `feel` findings change last verdict's Next:
- **The camera move it flagged is not a strike lurch.** "Moved up to 67.3 at frame 138" happens before the swing at frame 151. It is the aim camera gliding into place after `skipIntro`. The strike has no camera punch at all.
- **The missing `landPuffs` count came from the steps I gave last session.** The 90-frame `feel` with `{wait:100}` puts the landing (about frame 238) inside the steps, so it is never in the watched frames. That is why neither `divots` nor `landPuffs` appeared in its Particles line.

1. **Looks as LOOK.md says: 7.** On the "h2 aim" view, saturation is 52%. The tilt-shift band is sharp on `player` and blurred above and below. There is cream haze, the `sea` is teal past the `cliffFace`, and `hydrangeas` and `bushes` are painted. There are no `Lighting:` or `Surfaces:` lines. The golfer is still small on the aim views (0.6%).
2. **Plays as DESIGN.md says: 8.** `act` aim, club and swing drove every shot. In the "C hole cam" cell, C gives the overhead hole view with `aimDots` to the pin. I did not try the mouse.
3. **Camera: 8.** The aim camera is high behind the ball (`camPitchDeg` 20.9, `fov` 33). "h1 flight" follows the ball and its `ballTrail`. "h1 intro" pulls back to the green and bunkers. The title and card cells show the whole island diorama.
4. **Ball flight by surface: 8.** An iron at power 0.4 carried 41 yd and rolled 6 yd over 2 bounces, with `firstBounce.surf` "fairway". A putter from the tee stopped in rough with "IN THE ROUGH: SHORTER SHOT". The pond and OB results from session 4 stand. I did not see a sand lie.
5. **Nine playable holes: 7.** Holes 1 (Pebble Step), 2 (Gorse Run), 4 (Lantern Road), 6 (Duck Pond Bend) and 9 (Lighthouse Home, par 5, 474 yd) are distinct. I hit two shots at the grazing `sheep[8]` at (-9, 2.2) on hole 1, and `sheepHits` stayed 0 through 600 frames. The sheep bounce exists in the code (physics.js:156) but still cannot be shown.
6. **Stroke play and scorecard: 8.** The `card` shows HOLE 1 · PEBBLE STEP, ISLA 3, EVEN, with a PAR stamp and "SPACE · NEXT HOLE".
7. **HUD: 8.** `#holep` is top left, wind is top right ("2 MPH TAILWIND"), and the club list is bottom left with "LIE · TEE / GREEN", all in the steel type.
8. **`window.__game` and 60 fps: 9.** `observe`/`act` worked throughout. `perf` measured a 4.8 ms median (109 fps), 181 draw calls and 4.54 MB of assets, all within budget.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the number 4 jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0→30, `divots` 0→8 (newly visible) and 8 sounds.
    - Landing: `landPuffs` is drawn at the landing, but no `feel` has measured it yet.
    - Camera: there is no strike lurch.
    - Teleports: `aimLanding` still teleports 0.58 units at the swing.
11. **Richer look: 7.** This is unchanged from session 4: library trees, `bushes`, `hydrangeas`, `fencePanels`, `teeBench` and `rowingBoat`. The putt view adds `slopeGridLines`. The water and the golfer's animation look the same as before.
12. **Course and play: 7.**
    - The putt view's `slopeGridLines` make the green slope readable. `puttBreak` is reported.
    - The pond and the sea cost strokes.
    - Sheep still never change a shot.
    - In "h1 putt", the golfer is still walking to the ball 120 frames after it settles. They stand between the camera and the pin, with a white puff column on the putting line.
13. **Better assets: 7.** `eval` shows that all four code stand-ins are still visible:

    | Object | Type | Material | Count |
    |---|---|---|---|
    | `seaStacks` | Mesh | MeshStandardMaterial | 24 |
    | `cliffRocks` | Mesh | MeshStandardMaterial | 70 |
    | `teeMarker` | Mesh | MeshStandardMaterial | 1 |
    | `pin_flag` | Mesh | MeshStandardMaterial | 1 |

    Their searches are in `sourcing.json`, but nothing was picked.

**Faults: 8.**
- The `divots` "Never visible" fault is gone.
- There are no console errors; only the `toNonIndexed` warning remains.
- `perf` p95 was 19.5 ms, but the host load was 3.7 on 8 cores, so that is noise.
- Iteration 5's Open is answered above: the landing fell inside the steps, not in the watched frames.

Next:
1. **(asked again) Replace the sea stacks, cliff rocks, tee marker and flag that are still built in code.**
   - What to do: `pick` from the searches already in `sourcing.json` ("stylized sea stack rock pillar", "golf tee marker", "golf flag pin hole"), `model_audit` each pick, credit it, then hide the code mesh. Start with `seaStacks`/`cliffRocks`, because they ring the island in the title and card views.
   - The call that shows it done: `eval` returning `find('seaStacks').visible`, `find('pin_flag').visible` and `find('teeMarker').visible`. All three should be `false`. A title-cell `look` should list the picked model's mesh names where `seaStacks` is now.
2. **(asked again) Make a sheep bounce happen on demand.** A grazing sheep cannot be hit by playing normally: two aimed shots at `sheep[8]` missed while it wandered.
   - What to do: add a `setState` option, for example `{hole:0, skipIntro:true, sheepAt:[-12.4, 12]}`. It should place `sheep[0]` on the tee-to-pin line, hold it in "graze" and clear its target (`tx`/`tz`). Then interact with a low putter roll through it, expect `sheepHits:[1,9]`, and save the check. Save a bunker check the same way, expecting `lie:"sand"`.
   - The call that shows it done: that `interact` with `trace:["sheepHits","banner"]`. It should show `sheepHits` 0→1 and banner "BAA!".
3. **Add a strike camera punch, and measure the landing in the watched frames.**
   - Camera: no strike punch exists; the "moved up to 67" is the aim camera gliding in at frame 138, before the swing. On the swing, push `camera.position` about 0.3 units along the view direction and ease it back over 0.15 s.
   - Golfer on the putt view: stop the golfer walking into the putt camera's line after the ball settles.
   - The calls that show it done:
     - Strike: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, swing 0.75` and `frames: 25`. Its Camera line should read "… and came back" after frame 151.
     - Landing: `feel` with the same steps plus `{wait:80}` and `frames: 30`. The landing at about frame 238 then falls inside the watched frames, and Particles should list a `landPuffs` rise and a sound there.

SCORE: 7.6

## Iteration 6

**Did**
- `src/sheep.js`: new `setState({sheepAt:[x,z]})` hook. It plants `sheep[0]` at that point with its target set to the same point, `wait` 60 s (grazing in place) and `init` true, so a shot can be aimed through it.

**Saw**
- On hole 1 the tee is (-12.84, 15.36) and the pin is (-2.14, 14.43). I used `interact` with `{state:{hole:0,skipIntro:true,sheepAt:[-9.85,15.1]}}, wait 30, aim at pin, swing putter power 0.6, wait 240` and traced `sheepHits` and `banner`.
  - `sheepHits` went 0 → 1 at frame 65.
  - The banner read "PERFECT!" until frame 65, then "BAA!" until frame 193.
  - `lastSheepHit` had `tumble:true`, and `sheep[0]` went to "flee".
  - The ball bounced back off the sheep to (-14.58, 15.49), in the rough: carry 7 yd, roll 14 yd.
- The check was not saved. `test` refuses leading `{state}` steps unless `observe()` reports each key back, and `hole`, `skipIntro` and `sheepAt` are not reported.
- There was no console error. The only console output was the known `toNonIndexed` warning.
- I took no before/after `look` this session (there was not enough time). The change does not touch rendering unless `sheepAt` is passed.

**Next**
1. Save the sheep check. Either make the setup an `{action:"setup", hole, sheepAt}` step in `actFn` (src/api.js), or have `observe()` echo `sheepAt` and accept that `hole` is reported 1-based. Then save `sheep-bounce-on-demand` with the steps above and expect `sheepHits:[1,9]`. Save a bunker check the same way, expecting `lie:"sand"`.
2. Replace the code-built `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag` with picks from the searches already in `sourcing.json` (Judge 5, Next 1, asked again).
3. Add a strike camera punch: 0.3 units along the view direction, eased back over 0.15 s. Stop the golfer walking into the putt camera's line. Run both `feel` calls Judge 5 gave.

**Open**
- `sheepAt` only moves `sheep[0]`. Its home is (-16.5, 4.2), so once `wait` runs out it wanders back toward that range.

### Judge 6

The page opens in 1.3 s with no console errors. The only console output is the known three.js `toNonIndexed` warning. Iteration 6 added one thing, the `sheepAt` setup, and it works. With `sheepAt:[-9.85,15.1]`, a putter at power 0.6 raised `sheepHits` from 0 to 1 at frame 65. The banner read "BAA!" from frame 65 to 193, and the "sheep hit" sheet cell shows "BAA! BOUNCED OFF A SHEEP" with the ball rolling back toward the tee. I ran the landing `feel` Judge 5 asked for, and the landing is now inside the watched frames: `divots` 0 → 18 at frame 239, and sounds rose from 8 to 14. `landPuffs` does not appear in the Particles line. The strike `feel` still shows no camera punch. The first cell of the sheet (the title) is pale again, at 12% saturation, which is the known capture problem.

1. **Looks as LOOK.md says: 7.** On "h2 aim" saturation is 52%. The tilt-shift band is sharp on `player` and blurred above and below it. The haze is cream, the `sea` is teal beyond the `cliffFace`, and `hydrangeas` and `bushes` look painted. There are no `Lighting:` or `Surfaces:` lines. The golfer is still small on the aim views: 0.6% of the frame on h2, h6 and h9.
2. **Plays as DESIGN.md says: 8.** The mouse works now. Three clicks took `meter.stage` from 0 to 3 and `meter.power` peaked at 0.594. The ball flew and settled on "fairway", 38 yd from the pin. `act` aim, club and swing worked throughout. In the "C hole cam" cell, C gives the overhead view of hole 6 with `aimDots` to the pin past `pond_water`.
3. **Camera: 8.** The aim camera is high behind the ball. "h1 flight" follows the ball and its `ballTrail` toward the pin. "h1 intro" pulls back over the hole with the "HOLE 1 · PAR 3 · PEBBLE STEP" card.
4. **Ball flight by surface: 8.** The ball's first bounce was on fairway, and the sheep rebound left the ball in the rough (`lie` "rough"). The pond and out-of-bounds results from session 4 stand. I still have not seen a sand lie.
5. **Nine playable holes: 8.** A sheep bounce can now be shown: `sheepHits` went 0 → 1, `lastSheepHit.tumble` was true and the banner read "BAA!". Holes 1, 2, 6 (Duck Pond Bend, par 4, 206 yd, round the pond) and 9 (Lighthouse Home, par 5, 474 yd) each look different.
6. **Stroke play and scorecard: 8.** Carried over from session 5: the `card` shows the PAR stamp and "SPACE · NEXT HOLE". I did not re-check it this session.
7. **HUD: 8.** `#holep` is top left with strokes, round and hole name. Wind is top right ("2 MPH TAILWIND"). The club list is bottom left with yardages, and the key hints are bottom right.
8. **`window.__game` and 60 fps: 9.** `observe`, `act` and `setState({sheepAt})` all worked. `perf` measured a 9 ms median frame, 4.54 MB of assets and a 1.7 s load. Its p95 of 41.4 ms was taken with the host load at 15.8 on 8 cores, so that number is noise.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 8 sounds.
    - Landing: `divots` 0 → 18 at frame 239 and 6 more sounds.
    - Camera: there is still no strike punch. The only camera move is the aim camera settling at frame 138.
    - Teleport: `aimLanding` still jumps 0.58 units at frame 151.
11. **Richer look: 7.** Unchanged since session 4: library trees, `bushes`, `hydrangeas`, `fencePanels`, `teeBench` and `sign_arrow`, plus `slopeGridLines` on the putt view.
12. **Course and play: 7.** The `slopeGridLines` make the green slope readable, and the sheep rebound changes where the ball ends up. In "h1 putt", the golfer still stands between the camera and the pin, with a white puff column on the putting line.
13. **Better assets: 7.** `eval` shows all four code stand-ins still visible, each a `Mesh` with `MeshStandardMaterial`: `seaStacks` (24), `cliffRocks` (70), `teeMarker` (1) and `pin_flag` (1). This was asked for twice and is not done.

**Faults: 8.**
- There are no console errors.
- The `aimLanding` teleport remains.
- Iteration 6's `sheepAt` check is still not saved.
- The `perf` p95 was read on a busy host, so it is not a fault.

Next:
1. **(asked again) Replace the code-built `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag`.** This has been asked for twice and Iteration 6 did not touch it.
   - What to do: `pick` from the searches already in `paprika3d/sourcing.json`, using its "stylized sea stack rock pillar", "golf tee marker" and "golf flag pin hole" searches. `model_audit` each pick, credit it, and hide the code mesh. If a search finds nothing usable, try library words such as "stylized rock formation", "low poly cliff rocks", "flag pole" or "triangle flag". The `stonepile-2d5f24.glb` already loaded could replace `cliffRocks`.
   - The call that shows it done: `eval` returning `find('seaStacks').visible`, `find('cliffRocks').visible`, `find('teeMarker').visible` and `find('pin_flag').visible`, all `false`. A `look` with `camera` at about `{position:[0,60,80], lookAt:[0,0,0]}` should list the picked model's meshes where `seaStacks` was.
2. **(asked again) Add a strike camera punch, and stop the golfer walking into the putt camera's line.**
   - Camera: in `src/camera.js`, at the frame the swing turns into flight, push `camera.position` about 0.3 units along the view direction and ease it back over 0.15 s. Also stop the `aimLanding` jump at frame 151: ease it, or hide it at the swing.
   - Golfer: on the putt view, place the golfer beside the ball, off the ball-to-pin line, before the putt camera settles.
   - The calls that show it done:
     - Strike: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, {action:"swing",power:0.75,accuracy:0}` and `frames: 25`. Its Camera line should read "… and came back" after frame 151, and Teleports should be 0.
     - Golfer: the "h1 putt" sheet cell, the same steps plus `{wait:300}` and `frames:120`. The pin should be visible with no golfer or puff column between the ball and the pin.
3. **(asked again) Save the sheep check and a sand check.** Add an `{action:"setup", hole, sheepAt}` step to `actFn` in `src/api.js` so `test` accepts it. Then save `sheep-bounce-on-demand` from the steps that passed this session (setup, wait 30, aim at pin, putter swing at power 0.6, wait 240), expecting `sheepHits:[1,9]`. Add a `ballAt` option to the same setup to place the ball in a bunker, and save `sand-lie`, expecting `lie:"sand"`.
   - The call that shows it done: `test`, listing both checks as passing.

SCORE: 7.6

## The request changed

paprika-loop/PROMPT.md changed before session 7; the Next lists above were written before it. Changed lines:
+ 14. The golfer looks its best: still the footballer the owner restored, in the existing Shepherd Isle style, with cleaner proportions, materials and outline and a smoother swing, walk and idle; it reads clearly in the aim and flight views and never fills the frame or blocks the putt view.
+ 15. Everything is scaled correctly against the golfer (0.85 units tall), using refs/01-03 for relative sizes only: the ball, cup, flag and pin, tee markers, clubs, sheep, bench, boat, fences, trees, bushes, rocks, bunkers, greens, the house and the lighthouse each sit at a believable size next to a person, checked in the aim, putt and hole-camera views; nothing reads as a toy or a giant beside its neighbours.
+ refs/01.jpg · layout (relative scale only; the style stays Shepherd Isle's) · inspiration · https://www.flickr.com/photos/29450586@N04/5097697858 (CC BY): tilt-shift links fairway, golfers tiny against bunkers and gorse
+ refs/02.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Putting_green_at_the_Royal_Canberra_Golf_Club_1.JPG (CC BY 4.0): golfer, flag and bunker sizes on a green from above
+ refs/03.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Bruntsfield_Links_golf_course_from_the_air_-_geograph.org.uk_-_7885450.jpg (CC BY-SA 2.0): tree clumps, bunkers, pond and houses against fairway widths

## The request changed

paprika-loop/PROMPT.md changed before session 7; the Next lists above were written before it. Changed lines:
+ 14. The golfer looks its best: still the footballer the owner restored, in the existing Shepherd Isle style, with cleaner proportions, materials and outline and a smoother swing, walk and idle; it reads clearly in the aim and flight views and never fills the frame or blocks the putt view.
+ 15. Everything is scaled correctly against the golfer (0.85 units tall), using refs/01-03 for relative sizes only: the ball, cup, flag and pin, tee markers, clubs, sheep, bench, boat, fences, trees, bushes, rocks, bunkers, greens, the house and the lighthouse each sit at a believable size next to a person, checked in the aim, putt and hole-camera views; nothing reads as a toy or a giant beside its neighbours.
+ refs/01.jpg · layout (relative scale only; the style stays Shepherd Isle's) · inspiration · https://www.flickr.com/photos/29450586@N04/5097697858 (CC BY): tilt-shift links fairway, golfers tiny against bunkers and gorse
+ refs/02.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Putting_green_at_the_Royal_Canberra_Golf_Club_1.JPG (CC BY 4.0): golfer, flag and bunker sizes on a green from above
+ refs/03.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Bruntsfield_Links_golf_course_from_the_air_-_geograph.org.uk_-_7885450.jpg (CC BY-SA 2.0): tree clumps, bunkers, pond and houses against fairway widths

## Iteration 7

Worked the changed brief first (items 14 and 15: golfer at 0.85 units, everything sized against it).

**Did**
- `src/pose.js`: `GS` (golfer holder scale) 1.9 → 1.09, so the `footballer` stands 0.85 units tall in play (it was 1.48, taller than the 1.28 pin). `STANCE` 0.66 → 0.4 (feet to ball).
- `src/camera.js` `aimCam`: closer to match the smaller golfer. Full shots D 9.2 → 6.8, height 4.7 → 3.5. Putts D 4.2 → 3.6, height 2.5 → 2.1. New `side` offset (0.15 full, 0.45 putt) moves the camera away from the golfer's side, so the ball-to-pin line stays clear.
- `src/pins.js`: `FLAG.poleH` 1.28 → 1.1. `teeMarker` radius 0.07 → 0.045.
- `src/balls.js`: the ball is drawn at 0.7 × `BR` and shifted down so it still rests on the ground. Physics `BR` is unchanged, so no check moved. `ballRing` and `ballShadow` are smaller to match.
- `src/cow.js`: the cow is 0.72 tall (was 1.25), with a smaller contact shadow. `src/physics.js`: the cow collider radius 0.62 → 0.38 and height 1.05 → 0.65.
- `src/island.js`: ducks 0.46 → 0.26 tall. `src/library.js`: `hydrangeas` instance scale ×1.25 → ×0.95.
- `src/aimline.js`: putt preview dots scale 2.4 → 1.0. They were 0.2-radius discs that stacked into the "white puff column" on the putting line.
- `src/hud.js`: `#tag` anchored at ball + 1.2 (was + 0.85, which sat on the golfer's helmet).
- CHARACTERS.md: the ball and flag lines now give the new sizes.

**Saw**
- Measured with `eval`, in world units, against the golfer's 0.85:
  - footballer 0.85, pin 1.14, cow 0.76 tall, duck 0.26, bench 0.42 tall × 0.86 wide.
  - sheep 0.55 tall × 0.66 long, trees 2.6–3.7, house 3.95, lighthouse 7.7.
  - club shaft 0.42 at address.
- Sheet after the edits:
  - "h1 putt": the golfer is 1.3% of the frame (was 3%). The pin and cup are clear, and the dots are a thin line.
  - "h6 aim": the golfer is 0.36% of the frame (was 0.6%). It is small but readable, standing on the tee with the pond behind.
  - "C hole cam" is unchanged.
- `look compare before-aim` (the fixed `aim-h1` camera): 3% of pixels differ. The changes are the golfer region [432,320,720,528] and the smaller hydrangeas at top right. Both were intended. In that fixed camera the golfer goes from 0.6% to 0.19%. The game's own aim camera is now closer, which is why it shows 0.36%.
- `test`: 70 of 70 checks pass. An early version of the `aimCam` edit broke `look-aim-hole1`, `look-aim-hole5` and `look-drive-early`: a comment swallowed the look-target line. That is fixed.
- Strike `feel`: still no camera punch. The Camera line ("moved up to 67.2 at frame 141") is the aim camera settling. `aimLanding` jumps 0.58 units at frame 151, which is the `aim at:"pin"` step re-aiming, not a glitch. `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 8 sounds.
- The "h1 aim" sheet cell is still the pale capture artifact (12% saturation). Every other cell is normal.

**Next**
1. Scale, the rest of item 15:
   - `way_post`/`way_diamond`, the yellow aim waypoint marker, is 1 unit tall, bigger than the golfer. Shrink it to about 0.5.
   - Check the boats, `standingStone`/stonepile, `fencePanels` (0.66 tall, a little high), the `sign_arrow` signs (0.8) and the bunker and green sizes in the C view against refs/02–03.
   - The house (3.95) and lighthouse (7.7) could be 1.2–1.4× for a believable ratio to the 0.85 golfer.
2. Judge 6 Next 1, still undone: library picks for `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag`.
3. Judge 6 Next 2: strike punch in `src/camera.js`, 0.3 units along the view direction, eased back over 0.15 s. Then Next 3: an `{action:"setup"}` step in `src/api.js` and the `sheep-bounce-on-demand` and `sand-lie` checks. The cow collider shrank, so re-run `creatures-cow-reacts`; it passed this session.
4. Item 14 golfer polish is not started beyond size: outline, materials, and a smoother walk and idle.

**Open**
- The golfer is smaller on screen in the aim views (0.36% of the frame), even with the closer camera. If the judge finds it unreadable, bring the full-shot `aimCam` D down further (6.8 → about 5.5). Keep the pin on screen: the aim checks expect the ball's y between -0.6 and 0.6.
- The ball is still about 7× real size relative to the golfer (drawn radius 0.049). This is kept for readability, and is listed as by design in CHARACTERS.md.
- No `perf` was run this session.

### Judge 7

Iteration 7's rescale is visible and broke nothing in play. The footballer's box is 0.354 × 0.785 × 0.213. In the "h1 putt" cell the golfer stands beside the ball, the pin and `cup` are clear, and the aim dots are a thin line. The "white puff column" Judge 6 reported is gone. The "h1 aim" cell now draws at 46% saturation; Judge 6 saw it pale.

Two things are not fixed:
- The strike `feel` still has no camera punch. The Camera line reads "moved up to 67.215 at frame 141 and did not come back", and `aimLanding` jumps 0.58 units at frame 151.
- `eval` still finds `seaStacks` (24), `cliffRocks` (70), `teeMarker` and `pin_flag` visible as code meshes.

New this session: the "golfer walk to ball" cell (the moment the ball settles) is pale, at 12% saturation, like the title cell. A plain `look` after `interact` was also a flat haze colour, `#b5c8bc`.

1. **Looks as LOOK.md says: 7.** On "h1 aim" saturation is 46%. The tilt-shift band is sharp on `player` and blurred above and below. The `sea` is teal past `cliffFace`, and `hydrangeas` and `bushes` look painted. There are no `Lighting:` or `Surfaces:` lines. The title and settle cells are still pale.
2. **Plays as DESIGN.md says: 8.** Keyboard Space ×3 took `meter.stage` 0 → 3 at frame 229, with `meter.power` peaking at 0.594. Phases went swing, flight, settle, then aim at frame 392. R reset `strokes` from 1 to 0 with the banner "REPLAY". C gives the overhead view of hole 6 with `aimDots` past `pond_water`.
3. **Camera: 8.** The aim camera is high behind the ball (pitch 19.3°, fov 33). "h1 flight" follows the `ballTrail` to the green. "h1 intro" pulls back over the hole with the "PAR 3 · 129 YD · PEBBLE STEP" card.
4. **Ball flight by surface: 8.** `physics` read carry 122 yd, roll 41 yd and 2 bounces, with the first bounce on "green". The sheep rebound left the ball in the rough. A sand lie is still not shown.
5. **Nine playable holes: 8.** The "sheep hit" cell shows "BAA! BOUNCED OFF A SHEEP". Holes 1, 6 (Duck Pond Bend, par 4, 206 yd, round `pond_water`) and 9 (Lighthouse Home, par 5, 474 yd) each look different.
6. **Stroke play and scorecard: 8.** Holed in 2 on hole 1. The `card` shows the BIRDIE stamp, 2 strokes, −1 and "SPACE · NEXT HOLE".
7. **HUD: 8.** `#holep` is top left. Wind ("2 MPH TAILWIND") is top right. The club list with yardages is bottom left, and the key hints are bottom right.
8. **`window.__game` and 60 fps: 9.** `observe`, `act` and `setState` all work. `perf` measured an 8.1 ms median frame, 4.54 MB of assets and a 1.5 s load. The 25.5 ms p95 was taken with the host load at 7.2 on 8 cores, so it is noise.
9. **Golfer matches CHARACTERS.md: 7.** `footballer_helmetShell` is teal and the jersey is in the kit colour. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 8 sounds.
    - Camera: still no punch.
    - Teleport: `aimLanding` still jumps 0.58 units at frame 151.
11. **Richer look: 7.** Unchanged: library trees, `bushes`, `hydrangeas`, `fencePanels`, `teeBench`, `sign_arrow` and `slopeGridLines`.
12. **Course and play: 8.** The putt view is now clear. The `slopeGridLines` make the green slope readable, and the sheep rebound changes where the ball ends up. In "putt address", 60 frames into the second aim, the golfer is still out past the pin, not yet at the ball.
13. **Better assets: 7.** `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag` are still visible code meshes. `lighthouse_cottageWalls`, `lighthouse_cottageRoof` and `lighthouse_cottageDoor` are code meshes too.
14. **The golfer looks its best: 5.** This is a first draft: only the size has changed.
    - Size: about 0.85 tall in play, and it never fills the frame. It is 0.36% of the frame on "h1 aim", "h6 aim" and "h9 aim", and 1.3% on "h1 putt".
    - Not started: outline, materials, and a smoother walk and idle.
    - On the aim views it reads as a tiny orange figure.
15. **Everything scaled against the golfer: 6.**
    - Believable: `teeBench` (0.42 tall × 0.87 wide), `standingStone` (0.65), trees (2.6–3.7), `house` (3.95), `lighthouse` (7.7), `teeMarker` (0.09).
    - Too big: `way_post` is 1.0 tall, taller than the 0.785 footballer, and `way_diamond` is 0.56. The ball is drawn about 5× real size by design.
    - Not checked against refs/02–03: the bunker and green sizes.

**Faults: 8.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- The `aimLanding` teleport remains.
- The `sheep-bounce-on-demand` and `sand-lie` checks are still not saved.
- The settle-moment and title cells are pale. This may be the known capture problem, but it now also shows during play.

Next:
1. **(asked again) Replace the code-built `seaStacks`, `cliffRocks`, `teeMarker` and `pin_flag` with library models.** This has been asked for three times. Iteration 7 did not attempt it, and its Open does not say it is impossible.
   - What to do: `pick` from the searches already in `paprika3d/sourcing.json`. If those find nothing usable, try "stylized rock formation", "low poly cliff rocks", "flag pole" or "triangle flag".
   - Use `stonepile-2d5f24.glb`, which is already loaded, for `cliffRocks`. Run `asset_search` "stylized small cottage" for `lighthouse_cottage`.
   - `model_audit` each pick, credit it and hide the code mesh.
   - The call that shows it done: `eval` returning `.visible === false` for all four names. A `look` from `{position:[0,60,80], lookAt:[0,0,0]}` should list the picked meshes where `seaStacks` was.
2. **Item 14, the golfer polish.** This is the lowest score.
   - Aim views: bring the full-shot `aimCam` D in `src/camera.js` from 6.8 to about 5.5, as the Iteration 7 Open suggests. Keep the ball's y between −0.6 and 0.6 so the aim checks pass. Check it with the "h1 aim" sheet cell: the golfer should be at least 0.6% of the frame.
   - Outline: give `player` an inverted-hull outline (Shepherd Isle's dark outline) and a less shiny jersey and helmet material.
   - Walk: speed up the walk to the ball so the golfer is at address before the putt camera settles. Check it with the "putt address" cell (second aim plus `{wait:60}`): the golfer should be beside the ball, not out past the pin.
3. **Item 15, the scale pass, plus the strike punch (asked again).**
   - Waypoint marker: shrink `way_post` from 1.0 to about 0.45 tall and `way_diamond` from 0.56 to about 0.25.
   - Bunkers and greens: compare their sizes in the "C hole cam" cell against refs/02–03 and record the numbers in CHARACTERS.md.
   - Strike punch: in `src/camera.js`, push the camera 0.3 units along the view direction at the frame the swing turns into flight, then ease it back over 0.15 s. Ease or hide `aimLanding` at the swing.
   - The call that shows it done: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, {action:"swing",power:0.75,accuracy:0}` and `frames:25`. Its Camera line should read "… and came back", and Teleports should be 0.

Not checked this session: a sand lie, a 2–4 player hot-seat round, and whether the pale settle frame is a real fade or a capture problem.

SCORE: 7.4

## Iteration 8

The background check rerun keeps resetting the page; running the full test suite now.

### Judge 8

Iteration 8's section in PROGRESS.md is only a placeholder ("running the full test suite now"). It has no Did, Saw or Open, so this verdict is based on the page alone.

Three of Judge 7's asks are done:
- **Code meshes replaced.** `seaStacks`, `cliffRocks`, `teeMarker`, `pin_flag`, `pin_pole` and `way_post` are hidden. In their place are `seaStacksLib`, `cliffRocksLib`, `teeStone` and a library `flagPole` with `flagPennant`. The "pin1 close" camera shows a red triangle pennant on a 1.1 pole over a 0.23 `cup`.
- **Golfer polish started.** `footballer_outline` exists. On the aim views the golfer now takes 0.54% of the frame, up from 0.36%. The walk is quick: after the putt's aim began, the golfer covered 1.9 units and stopped at frame 11, at the ball.
- **Waypoint marker.** `way_diamond` is 0.25 tall.

Not done: the strike punch and the `aimLanding` teleport are unchanged.

The pale haze frames (`#b5c8bc`, 12% saturation) are a capture effect. The same moment came back at 47% saturation once the step drew (`draw: true`), so they are not a game fault.

1. **Looks as LOOK.md says: 7.** On "h1 aim" saturation is 46%. The tilt-shift band is sharp on `player` and blurred above and below. The `sea` is teal past `cliffFace` in "stacks low". There are no `Lighting:` or `Surfaces:` lines. The title cell is still pale, at 12% saturation.
2. **Plays as DESIGN.md says: 8.** D aimed and W changed club. Space ×3 took `meter.stage` 0 → 3 at frame 215, with `meter.power` peaking at 0.449. Phases went swing, flight, settle, then aim at frame 405. The banner read "IN THE ROUGH: SHORTER SHOT".
3. **Camera: 8.** The aim view is high behind the ball (pitch 21.2° on the putt). "h1 flight" follows the `ballTrail`. "h1 intro" pulls back with the "PAR 3 · 129 YD · PEBBLE STEP" card. "C hole cam h6" shows the hole from above, round `pond_water`.
4. **Ball flight by surface: 8.** The ball went from fairway to green, and the rough lie gives a shorter shot. A sand lie is still not shown.
5. **Nine playable holes: 8.** Holes 1, 6 (Duck Pond Bend, par 4, 206 yd) and 9 (Lighthouse Home, par 5, 474 yd) each look different. There are 10 sheep walking in `creatures.sheep`.
6. **Stroke play and hot seat: 8.** Hot seat is checked for the first time. With 2 players, `hudRound.turn` went ISLA → FINN at frame 330, then back to "ISLA TO PLAY" because Isla was farther from the pin. Both balls show on the green.
7. **HUD: 8.** `#holep` is top left with the player's colour dot. `#windp` ("2 MPH CROSS →") is top right. `#clubp` is bottom left and `#hinter` bottom right. There is no overlap.
8. **`window.__game` and 60 fps: 9.** `act`, `setState` and `observe` all drove play. `perf` measured a 7.7 ms median frame, 4.67 MB of assets and a 1.9 s load. The 40.1 ms p95 was taken with the host load at 11.5 on 8 cores, so it is noise.
9. **Golfer matches CHARACTERS.md: 8.** `footballer_helmetShell` is teal, the jersey is in the kit colour with dark panels, and `footballer_outline` is present. No brands appear on screen.
10. **Game feel: 7.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 10 sounds.
    - Camera: "moved up to 67.215 … at frame 134 and did not come back", so there is still no punch.
    - Teleport: `aimLanding` still jumps 0.58 units at frame 151.
11. **Richer look: 7.** The new `flagPennant` and library rocks help. Otherwise it is the same set of library trees, `bushes`, `hydrangeas`, `teeBench` and `slopeGridLines` as last time.
12. **Course and play: 8.** In "putt address" the golfer is now at the ball, which Judge 7 asked for. The `slopeGridLines` arrows make the green slope readable, and the putt view stays clear.
13. **Better assets: 8.** The four code meshes are replaced by library models. `lighthouse_cottageWalls`, `lighthouse_cottageRoof` and `lighthouse_cottageDoor` are still code: a plain white box with a teal roof in the "cottage" camera.
14. **The golfer looks its best: 6.**
    - Size: 0.54% of the frame on "h1 aim", "h6 aim" and "h9 aim", under the 0.6% asked for. It is 1.3% on the putt and never blocks the view.
    - Outline: `footballer_outline` covers only a box of about [470, 441, 542, 491] on a golfer whose box is [439, 382, 565, 636], so it is not a full silhouette.
    - Idle: not checked.
    - On the aim views the golfer is still a small orange figure.
15. **Everything scaled against the golfer: 7.**
    - Believable: the golfer is 0.78 tall, the pin 1.1, `way_diamond` 0.25, `sign_board` 0.46 × 0.23 and `teeBench` 0.42.
    - Larger by design: the `cup` (0.23) and the ball are drawn about 4–5× real size.
    - Not checked against refs/02–03: bunker and green sizes are still not recorded.

**Faults: 8.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- The `aimLanding` teleport remains.
- PROGRESS.md's Iteration 8 is a one-line placeholder, so its Did and Open are missing.
- The sheep-bounce and sand-lie checks are still not saved.

Next:
1. **Item 14, the golfer reading clearly on the aim views.** This is the lowest score.
   - Aim camera: in `src/camera.js`, bring the full-shot aim camera's D in until the golfer covers at least 0.8% of the frame, keeping the ball's y between −0.6 and 0.6.
   - Outline: make `footballer_outline` an inverted hull over the whole skinned mesh (helmet, arms and legs, not only the torso).
   - Idle: add a slow breathing idle at address.
   - Check it: the "h1 aim" sheet cell (state `{hole:0, skipIntro:true}`, frames 150) should show the golfer at ≥0.8%, and `look` `zoom` on its box should show a dark edge all round.
2. **(asked again) The strike camera punch and the `aimLanding` teleport.** Judges 6 and 7 asked for this, and Iteration 8 left it untouched.
   - Punch: at the swing → flight frame, push the camera 0.3 units along the view direction and ease it back over 0.15 s.
   - Teleport: fade or hide `aimLanding` at the swing instead of moving it.
   - The call that shows it done: `feel` with `{state:{hole:0,skipIntro:true}}, {wait:150}, {action:"aim",at:"pin"}, {action:"swing",power:0.75,accuracy:0}` and `frames:40`. Its Camera line should end "… and came back", and Teleports should be 0.
3. **Item 15 and item 13: the scale record and the last code-built building.**
   - Cottage: replace `lighthouse_cottage*` with a library cottage. Reuse the already loaded `fantasy-cottage-gart130-56175c.glb` at about 2.6 wide, or `pick` from the sourcing.json "stylized stone cottage" searches. Then hide the code meshes. Check it with the saved "cottage" camera.
   - Bunkers and greens: measure them in the "C hole cam h6" cell and write the numbers next to refs/02–03 in CHARACTERS.md.
   - Saved checks: save a sand-lie check with `interact` `save`, expecting `lie: "sand"` and a shorter carry.

Not checked this session: a sand lie, a full 4-player round, and the golfer's idle.

SCORE: 7.7

## Iteration 9

All checks but one pass; looking at the one that fails (the near-plane fade test) now.

### Judge 9

Session 9 scores 8.0, up from 7.7. Four of Judge 8's asks are done: the golfer reads clearly on the aim views, the `aimLanding` teleport is gone, the full-body outline is in, and the green edges are smooth. The lighthouse cottage is still built in code, and PROGRESS.md's Iteration 9 is again a one-line placeholder.

### Judge 9

Iteration 9's section in PROGRESS.md is only one line ("looking at the one that fails"). It has no Did, Saw or Open, so this verdict is based on the page alone.

What changed since Judge 8:
- **Golfer size.** The golfer now covers 0.85% of the frame on "h1 aim", "h3 aim", "h6 aim" and "h9 aim", up from 0.54%.
- **Outline.** `footballer_outline` is now a SkinnedMesh over the whole body.
- **Teleport.** `feel` on the strike reports 0 teleports.
- **Course edges.** The course paint is smooth. A 4× zoom on the "green1 top" camera shows a soft gradient from green to fringe, with no stair steps.

1. **Looks as LOOK.md says: 8.**
   - "h1 aim" is at 46% saturation, with a warm yellow rough and the tilt-shift band sharp on `player`.
   - The `sea` is teal in "stacks low", and there are no `Lighting:` or `Surfaces:` lines.
   - The title cell and some live captures come back pale (`#b5c8bc`, 12% saturation). This is the known capture effect: the same frames read 46–49% once drawn.
2. **Plays as DESIGN.md says: 8.**
   - D aimed and W changed club.
   - Space ×3 took `meter.stage` 0 → 3 at frame 215, with `meter.power` peaking at 0.449.
   - Phases went swing, flight, settle, then aim at frame 405. The banner read "IN THE ROUGH: SHORTER SHOT".
   - "C hole cam h6" shows the hole from above, round `pond_water`.
3. **Camera: 8.**
   - The aim view is at pitch 18.6° with fov 33. The ball sits at y −0.564 and the pin at y 0.679.
   - "h1 flight" follows `ballTrail` to `landRingPreview`.
   - "h1 intro" pulls back to the diorama with the "PAR 3 · 129 YD · PEBBLE STEP" card.
4. **Ball flight by surface: 8.** The ball goes from fairway to rough, the rough lie gives a shorter shot, and the putt lands on the green with `slopeGridLines`. A sand lie is still not shown.
5. **Nine playable holes: 8.**
   - Holes 1, 3 (Bluff Edge, par 3), 6 (Duck Pond Bend, par 4, 206 yd) and 9 (Lighthouse Home, par 5, 474 yd) each look different.
   - 10 sheep walk or graze in `creatures.sheep`.
6. **Stroke play and hot seat: 8.** Not re-checked this session; Judge 8 confirmed the ISLA → FINN turn order.
7. **HUD: 8.** `#holep` is top left, `#windp` ("2 MPH TAILWIND") top right, `#clubp` bottom left (with "LIE · TEE") and `#hinter` bottom right. Nothing overlaps.
8. **`window.__game` and 60 fps: 9.**
   - `setState`, `act` and `observe` all drove play.
   - `perf` measured a 3.8 ms median frame, 4.67 MB of assets and a 1.9 s load.
   - The 19.3 ms p95 was taken with the host load at 7.3 on 8 cores, so it is noise.
9. **Golfer matches CHARACTERS.md: 8.** The golfer wears a teal `footballer_helmetShell` and an orange kit jersey with dark panels, and has `footballer_helmetOutline`. No brands appear on screen.
10. **Game feel: 8.**
    - Strike: `feelBits` 0 → 30 and `divots` 0 → 8 at frame 164, with 10 sounds.
    - Teleports: none.
    - Camera: it moved up to 0.493 at frame 171 (down from 67 units at Judge 8). `feel` still says it "did not come back".
    - Flashes: none on the strike or the "PERFECT!" banner.
11. **Richer look: 8.** The baked course paint gives soft fringe rings round the greens and bunkers in "green1 top", and "h1 putt" reads cleanly.
12. **Course and play: 8.** In "h1 putt" the golfer stands at the ball (1.3% of the frame), the `slopeGridLines` arrows show the slope, and the putt view stays clear.
13. **Better assets: 8.** `lighthouse_cottageWalls`, `lighthouse_cottageRoof`, `lighthouse_cottageDoor` and `lighthouse_cottageWindow` are still code: a white box with a teal roof in the "cottage" camera, and visible behind the tee in "h3 aim".
14. **The golfer looks its best: 8.**
    - Size: 0.85% on all four aim views and 1.3% on the putt; it never blocks the view.
    - Contrast: the golfer's brightness is 36% against 56% around it, with a dark edge on the legs and arms.
    - Idle: `golferClip` stayed "address" for 150 frames. The breathing idle was not measured.
15. **Everything scaled against the golfer: 7.**
    - Believable: the golfer is 0.78 tall, `flagPole` 1.1, `sign_board` 0.46 and `golferShadow` 0.84.
    - Too small: `lighthouse_cottageDoor` is 0.72 tall, shorter than the golfer.
    - Not checked against refs/02–03: bunker and green sizes are still not recorded.
16. **Smooth edges between greens, tees, bunkers and fairways: 9.** "green1 top" zoomed 4× shows a soft blend from the green through a darker fringe into the rough. "green1 low edge" and "pin1 close" show no pixelated borders.

**Faults: 7.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- The saved suite still fails `look-dither-nearplane` (69 of 70), which is what Iteration 9's one line says it was working on.
- Iteration 9 is a placeholder again, the second session in a row.
- The sand-lie and sheep-bounce checks are still not saved.

Next:
1. **(asked again) Items 13 and 15: the lighthouse cottage.** It is the last code-built building, and its 0.72 door is shorter than the golfer.
   - Swap: clone the already loaded `fantasy-cottage-gart130-56175c.glb` at about 2.6 wide beside `lighthouse_tower`, or run `asset_search` for "stylized stone cottage" or "lighthouse keeper house" (sourcing.json already holds two cottage searches, so use new words). Then hide `lighthouse_cottage*`.
   - The call that shows it done: `look` with camera "cottage". Its On screen list should have no `lighthouse_cottageWalls`, and the library cottage's door should be at least 1.0 tall.
2. **Faults: fix the failing `look-dither-nearplane` check and write Iteration 9's real Did, Saw and Open.**
   - Work out whether the near-plane fade broke when the aim camera moved closer this session. If so, fix the fade; otherwise re-save the baseline with the reason in Open.
   - The call that shows it done: `test` reports 70 of 70.
3. **(asked again) Item 15 and item 4: the scale record and a saved sand-lie check.**
   - Measure the bunker and green sizes in "C hole cam h6" and "green1 top", and write them next to refs/02–03 in CHARACTERS.md.
   - Save an `interact` check named `sand-lie` that puts the ball in a hole 1 bunker. It should expect `lie: "sand"` and a lower `physics.carryYd` than from the fairway.
   - The call that shows it done: that `interact` with `save` returns ✓ on both entries.

Not checked this session: a sand lie, the sheep bounce, a full 4-player round, the breathing idle, and the colour of `footballer_outline` up close (that zoom came back pale).

SCORE: 8.0

## The request changed

paprika-loop/PROMPT.md changed before session 10; the Next lists above were written before it. Changed lines:
+ 16. Greens, tees, bunkers and fairways meet in smooth, soft edges: no pixelated, stair-stepped or blocky borders where a green blends into the fairway or rough, seen up close in the putt and aim views and from above in the hole camera (the owner, 2026-11-14: "The greens look pixelated and blocky. They should have smoother edges when blending to the fairway grass").

## Iteration 10

**Did**
- Judge 9 Next 1 (items 13, 15): the code keeper's cottage is replaced by the library's "Stylized House FREE" (`assets/stylized-house-free-b4a979.glb`, CC-BY Leontev Artem, credited in assets/CREDITS.md; found with the new query "stylized small white cottage blue roof chimney"). It loads as `keeperGLB` in src/assets.js and is placed in src/library.js inside the `lhCottage` group (code children hidden), 4.8 units tall, named `lighthouse_cottage`. Its door is 1.01 tall (0.61 × 4.8 / 2.9), above the 0.85 golfer.
- The bigger footprint is carried through: `LH_COT` in src/course.js is now w 6.4, d 4.1 (the collider in src/physics.js reads it; its top is now H_COT + 4.6); `clearOf` in src/island.js keeps props 3.6 (was 2.1) from the cottage; the cottage path in island.js now starts at the new door (LH_COT.x − 1.2, z + 2.3).
- Judge 9 Next 2: `look-dither-nearplane` in game-tests.json now expects `nearFades.1` = `house_walls` (was `tree4_leaves0`). Reason: the fade works. In the check's setup the list is [tree1_leaves0, house_walls ×4]. tree4 dropped out of the list when the hole-5 house became the bigger library cottage in an earlier session; the shader did not break. I tried letting named props fade at any height inside the subject circle (a `DITH_PROP` define in src/camera.js). That did not help, because the wall stands beside the golfer at the same depth rather than in front of them, so I reverted it.

**Saw**
- "cottage" camera: compared with before-cottage, 64% of pixels changed. `lighthouse_cottage` (5 meshes: Wood, Roof, Pipe, Door, Building) fills 66% of that close camera. `lighthouse_cottageWalls` and `lighthouse_cottageDoor` are no longer on screen. No Lighting or Surfaces lines.
- "cottage wide" (new camera, [20,12,6] looking at [29,4.5,−7]): the blue-roofed timber house sits beside `lighthouse_tower` and the roof reads as teal slate. "coast" shows it small at the island's east end.
- `look-dither-nearplane` setup (hole 5, ball at (−12, −13.5), A held 12 frames): `house_walls` covers 56% of the aim frame on the right. The golfer is still 0.54% of the frame and readable. The wall is half-dithered, so it reads as a dark translucent blur. Surfaces line: `house_walls` z-fights at x −10.57 (0.46 × 0.003 units, inside the library model).
- Before this session's edits the suite passed 69 of 70, with only look-dither-nearplane failing.

**Next**
- Item 3 (camera) and item 1: the aim camera should not sit against the hole-5 house wall when the ball is near it. Pull the camera in front of the house (cast from the ball toward the camera against the `house` collider box in physics.js), or fade `house_walls` fully below depth 3.4 for props only. The test above is the repro.
- Judge 9 Next 3, not done: record bunker and green sizes ("C hole cam h6", "green1 top") next to refs/02–03 in CHARACTERS.md, and save a `sand-lie` interact check (hole 1 bunker, `lie: "sand"`, carry lower than from the fairway).
- Check that `lighthouse_cottage` does not hide the hole 9 tee or green in its aim views. The house is now 6.4 × 4.1 units on the ground.

**Open**
- After the cottage swap and the check update, `test` passes 70 of 70 (course-h9-drive and look-aim-hole9-ball-lifted among them). Not run: `perf` (the house adds 7,336 triangles and 0.7 MB).
- The library house's own faces z-fight at x −10.57 (`house_walls`, hole 5). This is not new this session.

### Judge 10

Session 10 scores **7.9**, down from 8.0. The saved checks now pass 70 of 70, and the code-built cottage has been replaced with a library model. Two new problems pull the score down. At the hole-5 address spot the aim camera sits inside the house wall, so the wall covers half the screen. The new cottage is almost as tall as the lighthouse.

### Judge 10

What changed since Judge 9:
- **Saved checks.** `test` passes 70 of 70, including `look-dither-nearplane`, `creatures-ball-bonks-sheep` and `ball-physics-rollout-sand`.
- **Cottage.** The code cottage is gone. `lighthouse_cottage` (the Stylized House GLB) has a blue roof and timber walls in the "cottage" and "cottage wide" cameras.

1. **Looks as LOOK.md says: 8.**
   - "h9 aim" is at 45% saturation, with warm yellow rough, the tilt-shift band sharp on `player` and the `sea` teal.
   - No `Lighting:` or `Surfaces:` lines.
   - The "h1 aim" cell again came back pale (12% saturation). This is the known capture effect.
2. **Plays as DESIGN.md says: 8.**
   - D aimed and W changed club.
   - Space ×3 took `meter.stage` 0 → 3 at frame 116, with `meter.power` peaking at 0.594.
   - Phases went swing, flight, settle, then aim at frame 285.
   - R reset `strokes` to 0 and `player` to ISLA.
3. **Camera: 7.**
   - Flyover, aim and flight are good: "h1 intro" pulls back to the diorama, and the camera follows `ballTrail` in flight.
   - The fault: in "h5 house aim" (hole 5, ball at (−12, −13.5), A held 12 frames), the camera sits against `house_walls`. A dark dithered wall covers the right half of the frame, and the golfer shrinks to 0.46% of the frame.
4. **Ball flight by surface: 8.**
   - The rough lie gives a shorter shot ("IN THE ROUGH: SHORTER SHOT" banner on hole 5).
   - The roll-out checks for fairway, rough, sand and green, and the pond check, all pass.
   - A shot played from a sand lie is still not shown.
5. **Nine playable holes: 8.**
   - "h6 C cam" shows the dogleg round `pond_water`.
   - "h9 aim" shows the par 5 Lighthouse Home (474 yd), and "h9 approach" shows 268 yd to the pin with `lighthouse_cottage` in view.
   - `creatures.sheep` are on the course.
6. **Stroke play and hot seat: 8.** With 2 players the turn passed ISLA → FINN at frame 285. `hot-seat-passes-turn`, `look-card-hole` and the birdie, par and bogey reaction checks pass.
7. **HUD: 8.** `#holep` (HOLE 9, PAR 5, STROKES 0) is top left, `#windp` top right and `#clubp` bottom left with LIE. Nothing overlaps.
8. **`window.__game` and 60 fps: 8.**
   - `act`, `setState` and `observe` drove all play.
   - `perf` measured an 8.8 ms median frame (75 fps), 180 draw calls and a 2.5 s load.
   - The 39.9 ms p95 was taken with the host load at 16.3 on 8 cores, so it is noise.
   - Assets are 5.37 MB, over the 5 MB budget. The house added 0.69 MB, and `player-anim.glb` is the largest file at 1.44 MB.
9. **Golfer matches CHARACTERS.md: 8.** The golfer wears a teal `footballer_helmetShell` and an orange kit in "h9 aim" and "h9 approach". No brands appear on screen.
10. **Game feel: 8.**
    - On the strike, `feelBits` went 0 → 18 at frame 115, `divots` 0 → 21, `ballTrail` 0 → 85, with 24 sounds.
    - A `smoke` puff fires on each meter click.
    - There are no teleports. There are also no flashes.
11. **Richer look: 8.** The new cottage adds detail by the lighthouse. "green1 low edge" and "green1 top" show soft fringe rings.
12. **Course and play: 8.** `slopeGridLines` and `ball-physics-slope-break` pass, and the flow from hole to card to next hole passes `hud-round-full-round`.
13. **Better assets: 9.** `lighthouse_cottage` comes from the library and is credited. No code-built building is left in any view taken this session.
14. **The golfer looks its best: 8.**
    - The golfer is 0.86% of the frame in "h1 aim", "h9 aim" and "h9 approach".
    - In "h5 house aim" it is 0.46%, half-hidden against `house_walls`.
15. **Everything scaled against the golfer: 7.**
    - Believable: `player` is 0.78 tall, `flagPole` 1.1 and `teeBench` 0.42.
    - Too big: `lighthouse_cottage` is 5.09 tall against `lighthouse_tower` at 5.2. The keeper's cottage is as tall as the lighthouse, and in "cottage wide" the tower barely clears its roof.
    - Not recorded: bunker and green sizes against refs/02–03.
16. **Smooth edges between greens, tees, bunkers and fairways: 9.** "green1 top" and "green1 low edge" show soft blends from green through fringe into rough, with no stair steps.

**Faults: 7.**
- There are no console errors; the only warning is the known `toNonIndexed` one.
- 70 of 70 checks pass.
- Assets are 5.37 MB against a 5 MB budget.
- The camera clips into the wall at the hole-5 house.
- Iteration 10's Open notes a `house_walls` z-fight at x −10.57.

Next:
1. **Items 3 and 14: keep the aim camera out of the hole-5 house.**
   - Fix: in src/camera.js, cast from the ball toward the aim camera against the `house` collider box in physics.js, and pull the camera to the near side of the hit point minus about 0.3. Fading `house_walls` alone would leave a translucent smear.
   - The call that shows it done: the "h5 house aim" sheet cell (hole 4 state, ball at (−12, −13.5), `a` held 12 frames). It should not list `house_walls` among the first three on-screen objects, and the golfer should be at least 0.8% of the frame.
2. **Item 15: the lighthouse must dominate its keeper's cottage.**
   - Fix: scale the `lighthouse_tower` group up to about 8.5 tall, about 11 golfers, keeping the cottage door at 1.01. Check that the hole 9 green and tee stay clear of it.
   - Then (asked again) measure the bunker and green sizes in "green1 top" and "C hole cam h6", and write them next to refs/02–03 in CHARACTERS.md.
   - The call that shows it done: an `eval` of the Box3 heights showing `lighthouse_tower` y ≥ 1.6 × `lighthouse_cottage` y. In "cottage wide" the tower should rise well above the roof.
3. **(asked again) Item 4: a saved sand-lie shot, and the asset budget.**
   - Save an `interact` check named `sand-lie` that puts the ball in a hole-1 or hole-2 bunker and swings. It should expect `lie: "sand"` and a `physics.carryYd` below the same club's carry from the fairway.
   - Then run `model_audit` on `assets/player-anim.glb` with textures shrunk to 1024 px to bring assets under 5 MB.
   - The calls that show it done: that `interact` with `save` returns ✓ on both entries, and `perf` reports assets under 5 MB with no over-budget line.

Not checked this session: a full 4-player round, the scorecard stamps on screen, and a shot from sand.

SCORE: 7.9

## Iteration 11

**Did**
- Judge 10 Next 1 (items 3, 14): `aimCam` in src/camera.js now calls a new `clearHouse(src, pos, look)`. It casts a ray from the ball (0.3 up) to the aim camera against the Box3 of `house_walls` (grown by 0.3, measured once). If the wall is more than 2.4 units from the ball, the camera pulls in to 0.1 short of it and the look point pulls toward the ball by the same share, so the ball stays in frame. If the wall is closer than that, the camera rises in 0.4 steps until it clears the roof. I tried rising alone first: camera y went to 12.3, the pitch to 51°, and the golfer to 0.16%, so I dropped that as the main path.
- Judge 10 Next 2 (item 15): `LH_TOP` in src/island.js went from 5.4 to 6.4. The library tower (`modelCopy(lhGLB, LH_TOP + 2.1)`) is now 8.5 tall, and the lamp, lamp light and post-process glare follow it, since they all read LH_TOP.
- game-tests.json `look-dither-hole5-tree7-circle`: the old expectation `look.dither.occluders.0 == tree1_leaves0` only held while the camera stood behind the house. It now expects `look.ball.y` to be between −0.9 and 0.2 (the ball in frame).

**Saw**
- Hole-5 house aim (hole 4 state, ball at (−12, −13.5), `a` held 12 frames, then 30 frames). Before: camera at (−8.32, 6.74, −16.10), `house_walls` 57% of the frame, golfer 0.33%, ball y −0.564, z-fight Surfaces line on `house_walls`. After: camera at (−10.68, 6.36, −14.43), pitch 40°, `house_walls` not on screen, golfer 2.7% (`player`) or 3.4% (subject), ball y −0.649. No Surfaces line in view. The pin is now off the top of the frame (y 2.29) in this one spot.
- Tower vs cottage, from an eval of Box3: the visible `lighthouse_tower` is 8.5 tall (y 5.54 to 14.04) and `lighthouse_cottage` is 5.09, a ratio of 1.67 (the target was ≥ 1.6). Note: `find('lighthouse_tower')` returns the hidden code tower first, which is how Judge 10 got 5.2. "cottage wide" compared with before-cottage-wide: 2.7% of pixels differ, all at the tower ([128, 0, 400, 288]). The tower's top now goes past the top of that camera's frame.
- `test` before the json fix: 69 of 70. The one that failed was look-dither-hole5-tree7-circle, as described above. `look-dither-nearplane` passes. After the json edit, the after-edit hook reran all 70 checks and all 70 pass. That run came before the physics.js collider edit below.
- Captures of the in-game aim view still come back as flat grey (12% saturation). This is the known capture effect; read the numbers instead.

**Next**
- Hole-5 house view: the pin is off-frame when pulled in. Consider widening the fov a little while `clearHouse` is active, or pulling in less (stopping at h − 0.1 but keeping the look point farther out).
- Still not done from Judge 10: (asked again) the `sand-lie` saved check; bunker and green sizes in CHARACTERS.md; assets over 5 MB (`model_audit` on player-anim.glb). Also check that the 8.5-tall tower does not block the hole 9 aim views ("h9 aim", "h9 approach").

**Open**
- I raised the `ROUND` lighthouse collider top in src/physics.js from H_LH + 7 to H_LH + 9 to cover the taller tower. No check has run since that edit.
- The hidden code tower still carries the name `lighthouse_tower`, the same as the library model, so `find` returns the hidden one.
- The `house_walls` z-fight is unchanged inside the model. It is just out of view now.

### Judge 11

What changed since Judge 10: the hole-5 aim camera no longer sits in the house, the lighthouse tower now stands well above its cottage, and a shot from sand was played for the first time.

1. **Looks as LOOK.md says: 8.** "h9 aim", "h9 approach" and "h1 putt" sit at 45–46% saturation with the focus band on `player`, a teal `sea` and warm rough. No `Lighting:` or `Surfaces:` lines. The "h1 intro" cell at frame 90 came back pale (12% saturation), the known capture effect.
2. **Plays as DESIGN.md says: 8.** Real keys: D aimed, W changed club, Space ×3 ran the meter, and phases went aim → swing (frame 85) → flight (97) → settle (258) → aim (301). C toggled `overhead`.
3. **Camera: 8.** "h5 house aim" no longer lists `house_walls`, and the golfer is 3.4% of the frame. The pin is off the top of that frame. "h1 flight" follows `ballTrail`, and `camera.fov` goes 28.75 → 33.69 on the strike.
4. **Ball flight by surface: 9.** Sand lie played: from (−24, −12.5) the banner reads BUNKER and an iron at 0.8 power carries 72 yd, against 111 yd from the fairway at (−30, −5). The roll-out, wind, slope and pond checks pass.
5. **Nine playable holes: 8.** "h6 C cam" shows the dogleg round `pond_water`. "h9 aim" shows par 5, 474 yd, Lighthouse Home. `sheep` are on the hole-1 green surround, and the sheep bonk checks pass.
6. **Stroke play and hot seat: 8.** "h1 card" shows the Pebble Step scorecard with a HOLE IN ONE stamp and −2. With 2 players the "FINN TO PLAY" banner showed after ISLA's shot.
7. **HUD: 8.** Hole, par and strokes are top left, wind top right, the club list bottom left, key hints bottom right. Nothing overlaps in nine cells.
8. **`window.__game` and 60 fps: 8.** `act`, `setState` and `observe` drove everything. `perf` measured a 7 ms median frame (79 fps), 180 draw calls and a 2.0 s load. The 40.2 ms p95 was taken at host load 6.3 on 8 cores, so it is noise. Assets are still 5.37 MB against the 5 MB budget.
9. **Golfer matches CHARACTERS.md: 8.** Teal `footballer_helmetShell` and orange kit in every aim cell. No brands on screen.
10. **Game feel: 8.** On the strike `feelBits` went 0 → 15 at frame 85, a `smoke` puff fired on each meter click (frames 34, 68, 102), `divots` 0 → 21, `ballTrail` 0 → 77, and 19 sounds. No flashes. `feel` found no shake or out-and-back camera move on the strike: the camera "did not come back".
11. **Richer look: 8.** "lighthouse far" now reads as a proper landmark: striped tower over the blue-roofed cottage against the sea.
12. **Course and play: 8.** `slopeGridLines` shows in "h1 putt". `hud-round-full-round` and `ball-physics-slope-break` pass.
13. **Better assets: 9.** 19 library GLBs load, and no code-built object appears in any of the 15 views.
14. **The golfer looks its best: 8.** 0.86% in "h9 aim" and "h9 approach", 0.68% in "h1 putt" and clear of the putt line. In "h5 house aim" it is 3.4%, large but readable, standing in tall `grass`.
15. **Everything scaled against the golfer: 8.** The visible `lighthouse_tower` is 8.5 tall against `lighthouse_cottage` at 5.09, a ratio of 1.67. `flagPole` is 1.1 and `teeBench` 0.42. The cottage is still 6 golfers tall against the hole-5 `house_walls` at 3.6, and bunker and green sizes are still not written next to refs/02–03.
16. **Smooth edges: 9.** "green1 top" and "green1 low edge" show soft green-to-fringe-to-rough blends with no stair steps. The hole-9 bunker edge in "bunker h9" is soft too.

**Faults: 7.**
- No console errors; the only warning is the known `toNonIndexed` one.
- 70 of 70 saved checks pass, run after the physics.js collider edit.
- Assets are 5.37 MB against 5 MB, for the third verdict running.
- Hidden code stand-ins still share the names `lighthouse_tower` and `house_walls` with the library models.
- The `house_walls` z-fight is still inside the model, just out of view.

Next:
1. **(asked again) Faults and item 8: bring assets under 5 MB and remove the hidden stand-ins.**
   - Run `model_audit` on `assets/player-anim.glb` (1.44 MB) with textures shrunk to 1024, and on `bench-stylized-ee9269.glb` (0.43 MB for a 0.42-tall bench) at 512. Load the `-opt` files.
   - Delete the hidden code `lighthouse_tower` and `house_walls` meshes so `find` returns the library models.
   - The call that shows it done: `perf` reports assets under 5 MB with no "over budget" line.
2. **(asked again) Items 4 and 15: save the sand-lie check and record the sizes.**
   - Save an `interact` check named `sand-lie`: hole 1, `{state: {ball: {x: -24, z: -12.5}}}`, then `{action: "swing", power: 0.8, accuracy: 0, club: "iron", aimDegrees: 0, settle: true}`. Expect `lie: "sand"` before the swing and `physics.carryYd` in [50, 95]. This session it gave 72, against 111 from the fairway.
   - Measure the bunker and green widths in "green1 top" and "h6 C cam" in golfer heights and write them beside refs/02–03 in CHARACTERS.md. While there, bring `lighthouse_cottage` down to about 4 tall, with the door kept at 1.01.
   - The call that shows it done: `interact` with `save: "sand-lie"` returns ✓ on both entries, and `test` lists 71 of 71.
3. **Items 3 and 10: keep the pin in the pulled-in hole-5 view and give the strike a kick.**
   - In `clearHouse` in src/camera.js, keep the look point farther out, or widen the fov by about 6° while it is active, so the pin comes back into frame and the golfer drops to 1–2%.
   - On the strike, add a 3–4 frame hit-stop and a small camera shake that returns.
   - The calls that show it done: the "h5 house aim" sheet cell has `look.pin.y` at or below 1 with the golfer between 1% and 2%, and `feel` on Space ×3 reports a shake or an out-and-back camera move near frame 85.

Not checked this session: a full 4-player round, the evening light (N), mouse drag aim, and the hole-9 tee and green clearance from the taller tower beyond the two hole-9 aim cells.

SCORE: 8.1
