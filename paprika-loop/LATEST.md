The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
