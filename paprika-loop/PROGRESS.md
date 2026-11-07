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
