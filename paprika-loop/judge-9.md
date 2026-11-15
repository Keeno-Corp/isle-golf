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
