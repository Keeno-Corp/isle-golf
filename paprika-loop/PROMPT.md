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
