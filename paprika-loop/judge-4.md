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
