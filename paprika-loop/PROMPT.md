# Isle Golf
## What it is
A tilt-shift arcade golf game on Shepherd Isle: the football field of Isle Blitz is regrown into a nine-hole links course with sheep, a pond, the lighthouse and the sea along the cliffs.
## Must have
1. Looks as LOOK.md says: Shepherd Isle's painted brush pass, a tilt-shift focus band on the ball, cream-green haze, teal sea, warm low sun; no unblurred frame.
2. Plays as DESIGN.md's Core loop and Controls say: aim, club, a three-click meter, mouse or keyboard, C hole camera, R replay.
3. Camera high behind the ball with a narrow FOV, following the ball in flight, pulling back to the diorama for each hole's flyover intro.
4. Ball flight with arc, wind, bounce and roll by surface (fairway, rough, sand, green, water drop, out of bounds).
5. A full playable 9 holes (tees, fairways, rough, greens with flags, bunkers, the pond, the sea as OB, lighthouse, house, trees), holes 1-3 par 3, doglegs round the pond and house, hole 9 par 5 at the lighthouse; sheep wander the fairways and a ball bounces off one with a baa.
6. Stroke play against par per hole and over 9 holes, a scorecard after each hole with birdie/par/bogey stamps, solo and 2-4 player hot seat in kit colours.
7. HUD in the Isle Blitz type restyled for golf: hole/par/strokes top left, wind top right, power meter bottom centre, club bottom left.
8. window.__game with observe() and act() for aim, club and swing (power, accuracy) so the paprika3d tools play it; 60 fps.
9. The golfer matches CHARACTERS.md; no real golf brands, courses or game names on screen.
10. Game feel: the three-click meter, the strike, the ball's flight, each landing by surface, the hole-out and the camera follow each answer with feedback a player feels (motion, a short hit-stop or shake, particles, sound), measured with `feel`.
11. Look: richer course detail, lighting, water and golfer animation than the starting commit, still inside LOOK.md's Checks.
12. Course and play: each of the nine holes plays differently, putting has a readable green slope, hazards and sheep change the shot a player picks, and the flow from hole to scorecard to next hole never stalls.
13. Better assets: the key things a viewer sees (trees, rocks, the house, the lighthouse, sheep, flags, course props, textures, the sky) come from the paprika3d library through `asset_search` where it has a higher-quality match in the stylized Shepherd Isle look, each picked one checked with `model_audit` and credited; code-built stand-ins are replaced first. Nothing paid and no generated models.
14. The golfer looks its best: still the footballer the owner restored, in the existing Shepherd Isle style, with cleaner proportions, materials and outline and a smoother swing, walk and idle; it reads clearly in the aim and flight views and never fills the frame or blocks the putt view.
15. Everything is scaled correctly against the golfer (0.85 units tall), using refs/01-03 for relative sizes only: the ball, cup, flag and pin, tee markers, clubs, sheep, bench, boat, fences, trees, bushes, rocks, bunkers, greens, the house and the lighthouse each sit at a believable size next to a person, checked in the aim, putt and hole-camera views; nothing reads as a toy or a giant beside its neighbours.
16. Greens, tees, bunkers and fairways meet in smooth, soft edges: no pixelated, stair-stepped or blocky borders where a green blends into the fairway or rough, seen up close in the putt and aim views and from above in the hole camera (the owner, 2026-11-14: "The greens look pixelated and blocky. They should have smoother edges when blending to the fairway grass").
## References
refs/sheets/LOOK.png · style · match (Shepherd Isle, the game's own views) · built from /home/ubuntu/repos/paprika3d-dev/examples/shepherd-isle
refs/01.jpg · layout (relative scale only; the style stays Shepherd Isle's) · inspiration · https://www.flickr.com/photos/29450586@N04/5097697858 (CC BY): tilt-shift links fairway, golfers tiny against bunkers and gorse
refs/02.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Putting_green_at_the_Royal_Canberra_Golf_Club_1.JPG (CC BY 4.0): golfer, flag and bunker sizes on a green from above
refs/03.jpg · layout (relative scale only) · inspiration · https://commons.wikimedia.org/wiki/File:Bruntsfield_Links_golf_course_from_the_air_-_geograph.org.uk_-_7885450.jpg (CC BY-SA 2.0): tree clumps, bunkers, pond and houses against fairway widths
refs/study/ (not published) · mood · inspiration
## Inspirations and notes
Mario Golf and Everybody's Golf arcade feel, Golf Story charm, the tilt-shift diorama views of Shepherd Isle and Isle Blitz. The owner: "take the shepherds isle / the tilt-shift nfl blitz game, and make it a golf game. Use the same style as shepherds isle".
## Sheets
LOOK.md · CHARACTERS.md · DESIGN.md · refs/sheets/LOOK.png
Web study: yes (asked) · Picture sheets: no, no image key (asked) · Asset style: stylized (asked)
## Left to the builder
Hole layouts and names, club distances, the meter's timing, the golfer's swing pose, the kit colours and player names.
