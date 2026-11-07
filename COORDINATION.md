# Isle Golf · team run golf1 · coordination

Five lanes run 3-hour paprika-loops in parallel on `team/golf1/base`, then an integrator merges them. Every lane keeps the style LOOK.md sets: Shepherd Isle's painted brush pass, the tilt-shift focus band on the ball, cream-green haze, teal sea, warm low sun, and no unblurred frame. LOOK.md, BRIEF.md, DESIGN.md and CHARACTERS.md are read-only for every lane. The goal is a polished, fun, complete 9-hole tilt-shift arcade golf game that a player can finish, all 9 holes, with real inputs.

## Owner requirements (JC, apply to every lane)
- "make sure the ball physics are polished." One lane, **ball-physics**, has that as its whole goal: flight arc, spin and wind drift, bounce and roll on each surface (fairway, rough, sand, green), cup lip-outs and drops, collisions with trees, sheep and the house, and putting break on slopes. Each one is proved with real swings.
- "Like how wii golf or the modern nintendo mario golf games are well polished and feel good, but keep our same tilt shift mini style." The feel reference is Wii Sports Golf and Mario Golf: Super Rush: readable, satisfying ball flight with a trail and a landing-spot preview, a crisp first bounce, roll-out that varies by surface, a camera that follows the flight, impact and landing feedback (sound, dust or sand puffs, splashes), a cup rattle with a satisfying drop, a putt preview line that shows the break, and tight swing timing. All of it in the tilt-shift miniature Shepherd Isle look.
- Open art-critic findings from paprika-make: (1) the golfer and ball sit on the bottom edge of the frame and get blurred: keep them crisp inside the focus band and lift them off the edge (look). (2) Tree shadows fall to the left, which contradicts LOOK.md's warm low sun from the top left: move the key light (look). (3) The pink blobs on the cliff read as pink rocks: make them proper blossom shrubs (course). (4) The flag must read as the one vertical accent on every hole: a thicker pole, kept out of the heaviest blur (course; look keeps it out of the blur). (5) The critic hasn't yet looked at the aim view, the meter, the scorecard or a ball in flight: the look lane runs it on those views.

## Code layout
`index.html` loads `src/main.js`. The game is split into ES modules in `src/` that run in a fixed **load order** (the old single script's order, so the seeded `Math.random` draws are unchanged):

assets > util > shared > course > stage > island > cow > effects > sound > post > rules > pins > golfer > balls > pools > aimline > physics > sheep > round > meter > hud > pose > camera > input > api > main

**Load-order rule:** each file's first line is `import './<previous>.js';`. Never remove or reorder that line. A new file a lane creates:
- Leave the chain line out.
- Import only what it uses, and import the new file from one of your own files, after that file's chain line.
- Don't run code at load time that reads values from files later in the order. Functions are fine to call at any time; a `const` from a later file is not ready yet.

Each file `export`s all of its top-level names. Import what you need by name. Imported `let`s are read-only outside the file that declares them, so a value more than one file writes goes in `ST` (see below).

## Lanes and the files each owns
A lane edits only the files it owns, plus new files it creates. It never edits another lane's file. If you need a change there, add it through the hooks/events below. If that can't do it, write the request under "Requests" in the run's shared `workflow.md` notes so the owner picks it up.

| lane | owns |
|---|---|
| course | src/course.js, src/island.js, src/pins.js |
| ball-physics | src/physics.js, src/balls.js, src/rules.js, src/aimline.js, src/meter.js, src/pools.js |
| creatures | src/assets.js, src/cow.js, src/golfer.js, src/pose.js, src/sheep.js, assets/ |
| look | src/stage.js, src/post.js, src/camera.js |
| hud-round | src/hud.js, src/round.js, src/effects.js, src/sound.js, src/input.js, src/main.js, src/api.js, index.html, README.md |
| integrator only (frozen) | src/util.js, src/shared.js, COORDINATION.md, LOOK.md, BRIEF.md, DESIGN.md, CHARACTERS.md |

`game-tests.json` is shared. Each lane adds its saved checks with ids prefixed by its lane name (`course-…`, `physics-…`, `creatures-…`, `look-…`, `hud-…`), keeps the four that exist now, and never deletes or edits another lane's. The integrator unions them by id. `paprika-loop/` is each lane's own loop state; the integrator does not merge it.

### What is in each file now
- **course.js** (course): island shape (`inland`, `edgeR`), landmarks `HOUSE POND COW BELL HILL LH`, `HOLES` (tee, pin, par, yards, wind, waypoints), `BUNKERS`, `mownSigned`, `greenOf`, `bunkerQ`, `surfaceAt(x,z)` → 'tee'|'fairway'|'rough'|'sand'|'green'|'water'|'ob', `heightAt(x,z)`, `courseColour`, `TREES`, `YD` (1 unit = 12 yd).
- **island.js** (course): sea, path, terrain, cliffs, boulders, bushes and flowers, grass cards (`grassU`), trees (`treeObjs`, each has `.shake`), house, fences, bell, lighthouse and lamp (`lampBeams`, `lampLight`), pond, lilies and ducks, `TEX_SOFT_SHADOW`, `updateIsland(dt)` (smoke, butterflies, gulls, tree shake, pond, fireflies, clouds, lighthouse lamp).
- **pins.js** (course): `flagU`, `flagMat`, `pins` (per-hole flag, cup, tee markers, signs).
- **physics.js** (ball-physics): `treeBlockers`, `BOXES` (house etc.), `ROUND` (lighthouse, bell), `SIM` (the live ball: pos, vel, mode 'rest'|'air'|'roll'|'sunk'|'water'|'ob', surf, ev[], sheep, treeHit, entry), `stepSim`, `collideWorld`, `previewShot`, `launchOn`, `stepFlight(dt)` (the flight phase: 240 Hz sim, events, trail, settle), `flightEvents()` (what each ball event does: dust, sound, banner; it fires `ball:<event>`).
- **balls.js** (ball-physics): `balls` (mesh, shadow, ring per player), `updateBalls()`.
- **rules.js** (ball-physics): `CLUBS` (carry, loft, land, putt), `SURF` (bounce e, tangential t, roll drag, ks per surface), `LIE`, `GR`, `BR`, `WIND`, `KITS` (the kit colours: creatures and hud-round read them; ask before changing), `tmpV`, `_cm`, `pick`, `r3`.
- **aimline.js** (ball-physics): `aimDots`, `aimRing` (landing preview), `slopeGrid`, `gridLines`, `autoClub`, `autoAim`, `onClubChanged`, `cycleClub`, `lieMul`, `holdAim(dt)`, `updateAimLine()`, `buildSlopeGrid()`.
- **meter.js** (ball-physics): `METER` timing, `meterClick()`, `finishMeter`, `updateMeter(dt)`, `doSwing(power, acc, clubIdx)` (launches the ball, fires `swing`).
- **pools.js** (ball-physics): `pointPool`, `dust`, `trail`, `emit(pool, x, y, z, o)`, `updatePool`, `burst(x, z, n, colour, sp, up)`.
- **assets.js** (creatures): GLTF loader, `playerP`, `duckGLB`, `cowGLB`, `modelCopy`, `centreFloor`. **cow.js**: `cowG`, `cow`, `animateCow(dt)` (watches `ball` while `ST.cowWatch` > 0). **golfer.js**: `kitU` (kit colours uniform), `kitMaterial`, `golfer` (holder, mixer, acts, bones), `golferClip(name)`, `clubG`, `setClubLook(club)`, `golferShadow`. **pose.js**: `POSE`, `showGolfer`, `hideGolfer`, `swingParam`, `placeGolfer`, `updateGolfer(dt)`. **sheep.js**: `sheep` (each: x, z, tx, tz, hop, flee, wait…), `okForSheep`, `updateSheep(dt)`, `sheepBonked(s, ball)` (the sheep's own reaction to a hit).
- **stage.js** (look): `renderer`, `scene`, `camera`, `hemi`, `sun`, `std(colour, o)`, `named`, `mergeChildren`, `skyMat`, `updateWorld(dt)` (day/night fade, sun, fog, sky, hit flash decay). **post.js**: render targets, `kuwa`, `kmix`, `tiltH`, `tiltV`, `grade` passes, `sizePasses`, `updatePost(dt)` (focus band on the ball, lamp glare, mist, grade uniforms), `renderFrame(dt)`, `crisp(material)` (alpha 0 keeps a material out of the brush pass). **camera.js**: `cam` (pos, look, fov, dio, fy), `DIO`, `aimCam`, `overheadCam`, `updateCamera(dt)` (title, flyover intro, aim, C overhead, flight follow, holed).
- **round.js** (hud-round): `G` (the game state), `curP`, `curH`, `curClub`, `teeVec`, `pinDist`, `scoreName`, `vsPar`, `startRound`, `beginHole`, `beginShot`, `resolveShot`, `nextTurnOrCard`. **hud.js**: scorecard (`openCard`, `buildCard`, `advanceCard`, `replayHole`), HUD DOM (`hud`, `showTitle`, `showBanner`, `setSub`, `windInfo`, `needPower`, `updateHUD`). **effects.js**: `canvasTex`, `TEX`, `spawnIcon` (heart etc.), `spawnParticles`, `spawnRipple`, smoke, butterflies, gulls, fireflies, clouds, `updateEffects(dt)`. **sound.js**: `audio()`, `tone`, `noise`, `SFX` table, `play(name, ...)`. **input.js**: keyboard, mouse drag, wheel, click (`onKey`). **main.js**: `stepGame(dt)` (phase machine, 60 Hz substeps), `frame()` (the loop), start-up. **api.js**: `window.__game` (`summary`, `actFn`, describe/observe/act/setState).
- **shared.js** (frozen): `hooks`, `addUpdate`, `addKey`, `addAction`, `addObserve`, `addSetState`, `on`, `fire`, `ST`. **util.js** (frozen): `lerp`, `clamp`, `smooth`, `rand`, `hash`, `vnoise`, `fbm`, `angDiff`.

## Contracts between lanes

### Hooks (src/shared.js)
- `addUpdate(fn)`: `fn(dt)` once a frame, after `updateHUD` and before the post pass. Use it for any new per-frame work in a file you own, instead of editing main.js.
- `addKey(fn)`: `fn(code)` on a fresh keydown, before the built-in keys. Return true to eat the key. Only bind keys nobody uses yet. Taken: Space Enter, A D ←→ (aim, Shift = fine), W S Q E ↑↓ (club), C, R, M, N, H, Digit1-4 on the title.
- `addAction(name, fn)`: adds `__game.act({ action: name, ... })`, which returns `summary()`. Only add new names, prefixed by your lane (`physics.drop`, `look.cam`, ...). Existing actions are hud-round's: start, newRound, aim, club, click, swing, next, replay, overhead, sound.
- `addObserve(fn)`: `fn()` returns an object merged into `__game.observe()`. Each lane uses one top-level key named after itself (`course`, `physics`, `creatures`, `look`, `hud`) so nothing collides.
- `addSetState(fn)`: `fn(partial)` after the built-in setState keys (hole, skipIntro, ball, night, wind). Same rule: use a key named after your lane.

### Events (`on(name, fn)` / `fire(name, data)`)
| event | fired by (file, lane) | data | used by |
|---|---|---|---|
| `swing` | meter.js `doSwing` (ball-physics) | `{ power, acc, club, player }` | creatures (swing pose), look (camera), hud-round (sound) |
| `ball:land` `ball:bounce` `ball:sandHit` `ball:tree` `ball:wall` `ball:sheep` `ball:cow` `ball:water` `ball:ob` `ball:sunk` `ball:lip` | physics.js `flightEvents` (ball-physics), one per event in `SIM.ev` | `{ ball: SIM, player }` (`ball.sheep` and `ball.treeHit` are set on those events) | creatures (`ball:sheep`, `ball:cow`), look (landing and cup camera beats), hud-round (banners, juice) |
| `hole:start` | round.js `beginHole` (hud-round) | `{ hole }` (0-based) | look (flyover), course (only the current pin stands out), creatures |
| `hole:end` | hud.js `openCard` (hud-round) | `{ hole }` | look, creatures |
| `holed` | round.js `resolveShot` (hud-round) | `{ player, strokes, result }` (e.g. 'BIRDIE!') | creatures (celebration), look, hud-round |

A lane may fire new events, named `<lane>:<thing>` (e.g. `physics:roll-stop`, `creatures:sheep-tumble`). List them in your lane notes (below).

### Shared mutable state
- `ST` (shared.js) holds the values more than one file writes. Only the listed writers change each one; anyone may read them.
  - `ST.gameTime`: written by main.
  - `ST.dusk`, `ST.duskTarget`: stage `updateWorld` fades `dusk` toward `duskTarget`; input (N key) and api setState write `duskTarget`.
  - `ST.lampLit`: written by input (N) and api.
  - `ST.lampOn`, `ST.beamAngle`: written by island `updateIsland`.
  - `ST.flash`, `ST.flashHold`: the hit flash. physics `flightEvents` sets them on a sheep hit or a sunk ball; stage decays them; post feeds the grade.
  - `ST.cowWatch`: meter and physics set it, main decays it, cow reads it.
  - `ST.gust`: set by round `beginHole`, read by effects.
  - `ST.smokeT`: written by island.
  - `ST.bannerT`, `ST.subT`: written by hud and main.
  - A new shared value goes through the integrator. Until then, keep it in your own file and export a setter.
- `G` (round.js, hud-round) is the game state. Field writers:
  - `phase`: round and main; meter `doSwing` (aim→flight); physics `stepFlight` (flight→settle).
  - `club`, `aim`: aimline and input (ball-physics and hud-round); api act.
  - `m` (the meter: stage, t, t2, power, tp, acc, label): meter (ball-physics).
  - `pend`, `swingT`, `flightT`, `shotOrigin`: meter and physics.
  - `overhead`: input (C key), read by camera.
  - `hitStop`: physics `flightEvents`, decayed by main.
  - `sheepHits`: physics.
  - `banner`, `sub`: hud.
  - `players`, `turn`, `order`, `hole`, `round`, `nPlayers`, `lastResult`, `cardHole`, `sound`: round, hud and api.
  - New fields go in your lane's `observe` key, or in your own file, not on `G`.
- The frame order in main.js `frame()` is: stepGame (60 Hz substeps) → updateWorld → animateCow → updateEffects → updateIsland → updateSheep → dust and trail pools → updateGolfer → updateBalls → updateCamera → updateHUD → `hooks.update` → flag time → updatePost → renderFrame.

### window.__game observe() keys and their sources
- The existing keys are built in api.js (hud-round): `phase round hole holeName par yards player players strokes club clubIndex aimDeg pinBearingDeg lie distToPin yardsToPin ball{x,y,z,mode,surface} pin meter{stage,power,t,perfectAt,label,needPower} wind banner sub lastResult sheepHits overhead sound scores holes camera`.
- Their values come from the owning lanes' state: ball/meter/club/aim come from ball-physics, camera from look. Don't rename or remove these keys; the saved checks use them.
- Each lane's extra keys go under its own key through `addObserve`, for example:
  - `physics: { spin, carryYd, rollYd, lastBounce, puttBreak }`
  - `creatures: { sheep: [{x, z, state}], golferClip }`
  - `look: { camPitchDeg, flyoverT, focusY }`
  - `course: { pinVisible, waypoint }`
  - `hud: { cardOpen, final }`

### Lane notes
Each lane keeps `lanes/<lane>.md` (its own file): the new events, observe keys, actions, keys and exports it provides, plus anything it needs from another lane. Read the other lanes' notes when you start each iteration.

## Lanes

### course
**Goal:** 9 distinct, fun, readable holes on Shepherd Isle.
- Layout, surfaces, hazards and island set-dressing:
  - sand pots by greens;
  - the pond on 6;
  - the house dogleg on 5;
  - the lighthouse finish on 9;
  - the sea as OB.
- Only the current hole's flag stands out. Other holes' pins are hidden or dimmed: today hole 7's flag sits 8 units in front of hole 9's real pin, 33 units away.
- Each dogleg has a visible waypoint or aim marker the auto-aim uses.
- Perfect tee shots are not punished by bunkers in the landing zone.
- Ducks actually show on the pond.
- Critic findings 3 (blossom shrubs, not pink rocks) and 4 (the flag as the one vertical accent: a thicker pole).

**Checks:**
1. For holes 1-9: `{state:{hole:n, skipIntro:true}}` then a `look` of the aim view and the C view: the current pin is on screen in the C view, and no other hole's flag shows within the frame's middle third.
2. Hole 6 with real keys: A/D toward the pond, then Space three times at full power with a wedge → `banner` is 'SPLASH!' and `strokes` is 2. Then a drive along the dogleg waypoint lands on 'fairway' (observe `ball.surface`).
3. Hole 9 with real keys: perfect drives along auto-aim reach the green in at most 3 strokes (`lie` 'green'), and the lighthouse is in frame on the approach.
4. LOOK.md check 2: at a sample on the tee-to-green ribbon of hole 1, the fairway is within 30/255 of #5d8a3a. A `look` zoom on the cliff shows shrubs with blossom, not pink rocks.

### ball-physics
**Goal (JC):** "make sure the ball physics are polished", "like how wii golf or the modern nintendo mario golf games are well polished and feel good, but keep our same tilt shift mini style".
- Flight arc, spin (hook and slice from the meter) and wind drift.
- A crisp first bounce, then bounce and roll-out that differ on each surface (fairway, rough, sand plugs, fast green).
- Cup lip-outs and drops (the cup pulls a slow ball in, with a rattle and a satisfying drop).
- Collisions with trees (leaves shake), sheep (bounce off with a baa) and the house and walls.
- Putting break on slopes.
- A ball trail and a landing-spot preview ring, plus a putt preview line that shows the break.
- Impact and landing feedback in `flightEvents`: dust and sand puffs, splashes, thud, sand hiss and cup sounds.
- Tight swing timing: a meter that rewards a well-timed snap and stays frame-fair, and meter fields that reset after the shot.
- Ball sounds: you may replace `SFX.hit`, `SFX.thud`, `SFX.sand`, `SFX.cup`, `SFX.splash`, `SFX.rustle` and `SFX.clank` from a new file of yours (e.g. src/ballsfx.js) with `Object.assign(SFX, {...})`, built on sound.js's `tone` and `noise`. The rest of SFX is hud-round's.

**Checks (every one with real swings: Space three times with waits between, A/D aim, W/S club; setState only to place the ball):**
1. Flight, spin and wind:
   - The same driver swing with a perfect snap vs a late snap: the late one ends ≥ 1 unit right of the aim line (slice), and the early one left (hook).
   - With `{state:{wind:{speed:8, degrees:90}}}` vs speed 0, the landing point moves ≥ 0.5 units downwind.
   - The landing ring of the preview sits within 1.5 units of the real first bounce on a no-wind perfect swing.
2. Bounce and roll by surface: the same wedge swing landing on fairway, rough, sand and green (ball placed by setState, aimed with keys) gives roll-out green > fairway > rough > sand (sand ≈ 0, plugged). Each first bounce plays a landing puff (`ball:land` fires once).
3. Cup and putting:
   - A putt at the right power from 2 units sinks with `ball.mode` 'sunk'.
   - A putt 30% too hard over the cup lips out or runs past (`ball:lip` or not sunk).
   - On a sloped green, a putt aimed straight at the pin breaks downhill ≥ 0.2 units, and the preview line bends the same way.
4. Collisions: a ball driven into a tree fires `ball:tree` and drops nearby; one into a sheep fires `ball:sheep` and changes direction; one into the house (hole 5 dogleg) fires `ball:wall`. The trail is visible in a `look` of a ball in flight.

### creatures
**Goal:**
- The golfer reads as the CHARACTERS.md toy golfer: a face or cap, not a spotted helmet. The swing pose reads (address, backswing, through, follow-through) and the club looks like a club, not a hammer. Kit colours per player; Celebration for birdie or better and Dance for par.
- Sheep wander across fairways and into play.
- The ball-bonks-a-sheep clip moment (listen to `ball:sheep`): the sheep tumbles or hops, a baa, a heart, a beat of hit-stop. It should be a 5-second-clip moment.
- The cow reacts to `ball:cow` and to nearby shots.

**Checks:**
1. Ball placed by setState in front of a sheep in its path (use your `creatures.sheep` observe key to find one), then a real-key swing → `sheepHits` +1, the sheep's state shows hop/flee, and a `look` shows the heart.
2. Stepped frames through a real-key drive (meter stage 1 and 2, the swing, the flight): looks show the backswing and the follow-through poses distinctly, and the club head is visible.
3. In a 2-player game the golfer's shirt samples as FINN blue (#3b78c9 ±30) on FINN's turn and ISLA red on ISLA's.
4. Holing a birdie (setState ball near the cup, real-key putt) plays Celebration (`creatures.golferClip`).

### look
**Goal (LOOK.md held, camera Wii/Mario-Golf readable):**
- Flyover intros per hole: from the diorama view, along tee → pin, then behind the ball, with the pin in frame mid-flyover.
- A camera that follows the ball's flight and eases to the green; a holed camera that shows the ball drop.
- C as a 55° hole view framing tee and pin, never flat top-down (today it is near top-down).
- The tilt-shift band on the ball.
- Critic findings 1 (golfer and ball crisp inside the focus band and lifted off the bottom edge), 2 (key light moved so shadows fall as from a warm low sun at the top left) and 5 (run the art critic on the aim view, the meter, the scorecard and a ball in flight). Also verify course's 3 and 4 in those passes.
- Night mode (N) still reads.

**Checks:**
1. LOOK.md check 1: in the aim view of holes 1, 5 and 9 the top fifth is visibly blurred, and the band around the ball and golfer is sharp. The ball sits above the bottom 20% of the frame.
2. C on holes 5, 6 and 9: camera pitch is 45-65° (`look.camPitchDeg`), and the tee/ball and pin are both on screen.
3. Hole flyover: Space from the title, then stepped frames with looks at 25/50/75%: the camera moves diorama → over the hole → behind the ball, and the pin is on screen at 50%. A real-key drive keeps the ball on screen through its flight (looks at 3 moments).
4. LOOK.md checks 2 and 4: sea at a corner of the title view within 30/255 of #0f6a67; one warm key light from the top left (shadows fall to the lower right); the only `Lighting:` note is the club's metal.

### hud-round
**Goal:**
- HUD in the Isle Blitz type (LOOK.md UI): hole, par and strokes top left; wind top right; meter bottom centre; club with yardage by lie bottom left.
- Banners that don't cover the target and clear on time.
- The scorecard with stamps after each hole, and a final card with the winner, best and new best.
- Title with 1-4 players. Hot-seat flow: the lowest score on the last hole tees off first, then the ball farthest from the cup plays, with kit colours.
- Sound: fix the console error `SFX[k] is not a function` (`play('gull')` has no `SFX.gull`). Add surf, gulls, a birdie jingle and a meter tick.
- Juice: PERFECT and NICE calls and "x YD TO PIN" at rest.
- The whole round is completable with real inputs, and R replay works.

**Checks:**
1. A full 9-hole solo round with real keys only (Space start, Space to skip each flyover, Space three times per shot, putts on the green) reaches the final card ('ROUND COMPLETE'); `scores` has 9 entries and the total matches; Space returns to the title.
2. 2 players: after both tee off, the player farther from the cup plays next (`player`), both rows show on the card, and the next hole's order follows the last hole's scores.
3. No console errors through a hole (tee to holed to card), and sounds play for swing, land and cup.
4. LOOK.md check 3: the HUD layout and colours (cream on dark green), the meter visible at stage 1-2, and the club panel showing yardage that drops in rough and sand.

## Starting point (baseline review, before the split)
- All four saved checks pass. Hole 1 plays with real keys: iron to 13 yd, then a putt for birdie.
- The scorecard and confetti work.
- Known problems:
  - `SFX.gull` is missing (a console error each gull call).
  - Every hole's flag shows at once.
  - Auto-aim is 11-26° off the pin on doglegs.
  - C is near top-down.
  - The golfer's head reads as a spotted helmet and the club as a hammer.
  - `sheepHits` stays 0 in normal play.
  - Ducks are never on screen.
  - Meter fields and `banner`/`lastResult` go stale after a shot.
  - A bunker hint says "A WEDGE DIGS IT OUT" while auto-club picks the putter.
  - The slope grid is faint blobs.
  - The holed camera loses the ball.
- Perf (SwiftShader): 307 draws, 486k tris; grass cards 102k and cliffFace 54k shadow-casting.

## Working notes for every lane
- Game work goes through the paprika3d MCP tools (headless Claude Code with the paprika3d plugin). Run the game with `bun install` (or `npm i`), then open `index.html` in this folder.
- This game draws through a post pass: take pictures with `interact` + `look: true` right after stepped frames. A `look` straight after an `until` step can read near-black on a fine frame.
- Starting the paprika-loop from inside `claude -p` leaves its sessions "Not logged in". Let the skill write `paprika-loop/PROMPT.md`, then start `node ~/repos/paprika3d/src/cli.js loop --minutes 180 --prompt-file paprika-loop/PROMPT.md` yourself with CLAUDE_CODE_OAUTH_TOKEN in the environment. Check after a minute that its sessions use tokens.
- `pkill -f <pattern>` run from a shell whose own command line holds the pattern kills that shell too.
- Prove every check with real inputs on stepped frames; judges can score a build high while its core loop is faked.
