# Isle Golf
## What it is
A tilt-shift arcade golf game on Shepherd Isle: the football field of Isle Blitz is regrown into a nine-hole links course with sheep, a pond, the lighthouse and the sea along the cliffs.
## Must have
0. TOP PRIORITY (do this next session, before any other Next item; iterations 1-3 have not touched it yet), owner feedback after playing: "make the ground tiling les pixelated looking ... Also spacing is a little too close. Make it a little wider". Course lane's part: (a) the ground (terrain, fairway mowing stripes, rough, greens, sand, cliffs) must not look pixelated or tiled: raise texture resolution, use LinearMipmapLinear + max anisotropy (renderer.capabilities.getMaxAnisotropy()), break up repetition with macro variation / blended noise at two scales, and make the mowing stripes smooth-edged (no stair-stepping from vertex colours: add terrain subdivisions where the stripes are or move the stripes into a smooth texture/shader term). Prove with a look zoom on hole 1's fairway and on the rough at the aim view: no visible pixel blocks or repeated tile pattern. (b) Spread the holes, props and set-dressing a little wider apart (roughly 15-25% more room between holes, trees, bushes, house, fences) so the course feels less cramped, while all 9 holes stay on the island, playable, and the checks below still hold (the sea stays OB). The look lane owns camera width/FOV; if the wider spread needs the diorama/flyover to pull back, note it in lanes/course.md.
1. LANE GOAL: Make 9 distinct, fun, readable holes on Shepherd Isle: layout, surfaces, hazards (sand pots by the greens, the pond on 6, the house dogleg on 5, the lighthouse finish on 9, the sea as OB) and island set-dressing. Only the current hole's flag stands out; other pins are hidden or dimmed (hole 7's flag sits in front of hole 9's pin now). Each dogleg gets a visible waypoint or aim marker the auto-aim uses (auto-aim is 11-26 deg off now). No bunker in a perfect drive's landing zone. Ducks show on the pond. Critic findings 3 (the pink cliff blobs become proper blossom shrubs) and 4 (the flag reads as the one vertical accent on every hole: a thicker pole). Keep the LOOK.md style.

   CHECKS:
- Holes 1-9: {state:{hole:n, skipIntro:true}}, then a look of the aim view and of the C view (press KeyC, step 40 frames): the current pin is on screen in the C view, and no other hole's flag shows in the middle third of the frame.
- Hole 6 with real keys: hold A/D toward the pond, W/S to the wedge, Space three times at full power -> banner 'SPLASH!' and strokes 2. Then a real-key drive along the dogleg waypoint ends with ball.surface 'fairway'.
- Hole 9 with real keys: perfect three-click drives along the auto-aim reach lie 'green' in at most 3 strokes, and the lighthouse is in frame on the approach look.
- LOOK.md check 2: a sample on hole 1's tee-to-green ribbon is within 30/255 of #5d8a3a. A look zoom on the cliff lip shows blossom shrubs, not pink rocks. The flag pole stays visible and sharp in the aim view of holes 1, 5 and 9. All proven with real inputs on stepped frames, saved with interact's save named course-<what>.

2. Looks as LOOK.md says: its Checks hold
3. Edit only src/course.js, src/island.js, src/pins.js, lanes/course.md and game-tests.json (check ids prefixed 'course-'; keep the existing checks)
4. Looks as LOOK.md says: Shepherd Isle's painted brush pass, a tilt-shift focus band on the ball, cream-green haze, teal sea, warm low sun; no unblurred frame.
5. Plays as DESIGN.md's Core loop and Controls say: aim, club, a three-click meter, mouse or keyboard, C hole camera, R replay.
6. Camera high behind the ball with a narrow FOV, following the ball in flight, pulling back to the diorama for each hole's flyover intro.
7. Ball flight with arc, wind, bounce and roll by surface (fairway, rough, sand, green, water drop, out of bounds).
8. A full playable 9 holes (tees, fairways, rough, greens with flags, bunkers, the pond, the sea as OB, lighthouse, house, trees), holes 1-3 par 3, doglegs round the pond and house, hole 9 par 5 at the lighthouse; sheep wander the fairways and a ball bounces off one with a baa.
9. Stroke play against par per hole and over 9 holes, a scorecard after each hole with birdie/par/bogey stamps, solo and 2-4 player hot seat in kit colours.
10. HUD in the Isle Blitz type restyled for golf: hole/par/strokes top left, wind top right, power meter bottom centre, club bottom left.
11. window.__game with observe() and act() for aim, club and swing (power, accuracy) so the paprika3d tools play it; 60 fps.
12. The golfer matches CHARACTERS.md; no real golf brands, courses or game names on screen.

13. Follow COORDINATION.md contracts and the load-order rule: each src file's first line is `import './<previous>.js'`, never reorder; new files imported from own files. The chain import takes priority over the generic watermark-first-line rule.
14. New events named course:<thing>; document what the lane provides (e.g. dogleg waypoint/aim marker export the auto-aim uses, current-pin API) in lanes/course.md.
15. Take pictures with interact + look:true after stepped frames.

## References
refs/sheets/LOOK.png · style · match (Shepherd Isle, the game's own views) · built from /home/ubuntu/repos/paprika3d-dev/examples/shepherd-isle
refs/study/ (not published) · mood · inspiration
## Inspirations and notes
Mario Golf and Everybody's Golf arcade feel, Golf Story charm, the tilt-shift diorama views of Shepherd Isle and Isle Blitz. The owner: "take the shepherds isle / the tilt-shift nfl blitz game, and make it a golf game. Use the same style as shepherds isle".
## Sheets
LOOK.md · CHARACTERS.md · DESIGN.md · refs/sheets/LOOK.png
Web study: yes (asked) · Picture sheets: no, no image key (asked) · Asset style: stylized (asked)
## Left to the builder
Hole layouts and names, club distances, the meter's timing, the golfer's swing pose, the kit colours and player names.

Steering note (lane lead): the aim-view camera framing and whether the golfer shows in it belong to the look lane (src/camera.js); don't chase those here. If the pin is cut at the frame top, keep the pole thick but not taller than needed. Priorities left, in order: hole 9 real-key drive saved as course-h9-drive; the holes 1-9 C-view pin check saved as course-only-current-pin (already saved, keep it passing); a carry on holes 2 and 3; look zoom on the cliff lip (blossom shrubs) and the #5d8a3a ribbon sample on hole 1, both saved as course- checks.

Steering note 2 (lane lead): par 3s (holes 1-3) must be reachable with the iron at full power (needPower <= 0.95 for the club the game picks) even after SPREAD 1.2; fix it in src/course.js (pull hole 2's pin/tee closer) rather than waiting on another lane. Then the cliff-lip and ribbon checks.
