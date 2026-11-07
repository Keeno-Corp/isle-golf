# Look: Isle Golf
Board: refs/sheets/LOOK.png
## Palette
fairway #5d8a3a (stripe #6b9743) · green #76a64a · tee #86ae56 · rough straw #b8a64a · sand #dcc78d · sea #0f6a67 · haze #bccabd · flag #d9392b · UI cream #f4e39a on bevelled green steel #122219   (Shepherd Isle's own paint sampled in refs/sheets/LOOK.png, style match; refs/study/links-coast-fairway-dunes-sea.jpg, straw dunes and bright fairway strip, inspiration)
## Lighting
Warm low sun from the top left, long soft shadows, cream-green haze rising toward the top of the frame; teal sea; a lighthouse lamp that sweeps at night (N key).   (Shepherd Isle, style match; study/STUDY.md: lighting note)
## Materials
Painterly flat colour, no PBR shine; fairways carry mow stripes, greens are finer and brighter, sand is pale with a darker lip, rough is tall straw-gold fluffy grass cards. The brush (Kuwahara) post pass stays; the golfer, ball, pin and club write alpha 0 so they stay crisp.   (Shepherd Isle, style match; study/clifftop-hole-ocean-green.jpg, inspiration)
## Shape language
A hole is a ribbon of mown green (tee box, fairway, tilted green) cut out of rough, with the red flag the one vertical accent; round tree clumps, soft bushes, pot bunkers with ragged lips, cliffs and sea close every view. Toy golfer 0.85 units tall, ball oversized so it reads.   (study/STUDY.md: composition; Shepherd Isle, style match)
## Camera
Perspective, FOV about 30, high behind the ball and tilted about 25 degrees down, following the ball in flight and close in on the green; each hole opens with a flyover from the whole-island diorama view; C gives a 55 degree hole view, never flat top-down. Tilt-shift focus band sits on the ball (a little ahead of it while aiming).   (Shepherd Isle and Isle Blitz, style match)
## UI and type
Heavy condensed italic capitals in cream-yellow on bevelled green steel panels with a warm glow: hole, par, strokes top left; wind arrow and speed top right; the three-click power meter bottom centre (power fill, snap zone at the line, cyan caddy notch for the pin); club list bottom left; stamp-style scorecard.   (Isle Blitz UI type, restyled; builder's call)
## Sound mood
Soft club thwack, a bright meter tick, thuds and sand hiss, a cup rattle and a short jingle, surf, gulls, sheep baa and cow moo.   (study/STUDY.md: sound note)
## Assets
style: stylized · asked · sources: existing assets/ models, code
## Avoid
Real golf brands, courses or game names on screen; generic bright low-poly look; a flat top-down camera during shots; an unblurred frame.
## Checks
1. In the aim view the top fifth of the frame is visibly blurred and the band around the ball is sharp (look at aim phase).
2. Sea sampled at a corner of the title view within 30/255 of #0f6a67; fairway at a sample on the tee-to-green ribbon within 30/255 of #5d8a3a.
3. HUD: hole/par/strokes top left, wind top right, club bottom left, meter bottom centre, cream text on dark green.
4. One warm key light with soft shadows; the only `Lighting:` note is the club's metal (no environment map).
