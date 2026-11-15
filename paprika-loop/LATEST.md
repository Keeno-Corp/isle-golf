The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
