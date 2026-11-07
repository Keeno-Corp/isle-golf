# Look: Isle Blitz
Board: refs/sheets/LOOK.png
## Palette
turf #5f6a36 · turf shade #344c2b · chalk #c2b496 · sea #0f6a67 · far sea #94b6a8 · meadow #b89e5b · hill green #5f7e42 · crowd warm #8f5d4e · crowd teal #247876 · home kit white #a3936d on navy #042316 · away kit red #853621 · UI yellow #7c7112 on steel #2f3534   (refs/06-diorama-day.png style match: sampled at (1000, 950), (500, 1000), (200, 800), (1800, 1000); refs/07-diorama-night.png style inspiration: (1000, 950), (300, 1000); refs/05-tiltshift-runner.png style match: (980, 700), (1050, 620); refs/04-island-current.png style match: (100, 700), (640, 40), (520, 330), (780, 500); refs/01-blitz2000-presnap.png mood inspiration: (70, 25), (200, 355))
## Lighting
Warm low sun from the top left, long soft shadows, the field in a sharp bright band and everything above and below it blurred into bokeh; the island's teal sea and soft haze stay as they are. A floodlit night variant (warm #feeecf lamps, dark #845635 surround) is the N key, as the railway's evening.   (refs/06-diorama-day.png, style, match; refs/07-diorama-night.png, style, inspiration; refs/04-island-current.png, style, match)
## Materials
Painterly flat colour with soft gradients, no PBR shine: turf a mottled olive green with faint mow stripes, chalk lines slightly rough and warm, kits matte with one bright trim colour, helmets the only glossy thing. The island keeps its painted-stroke post pass.   (refs/05-tiltshift-runner.png, style, match; refs/04-island-current.png, style, match)
## Shape language
Toy figures: squat bodies, big round helmets (head about 1/3 of height, scaled up further in big-head mode), thick limbs, oversized shoulder pads; 14 players on the field, each reading as a bright blob with a number. The field is a flat chalked rectangle with 10-yard stripes, numbers every 10 yards, hash marks, end-zone lettering and two goalposts; the island's rounded hills, soft tree clumps and cliff edge wrap round it.   (refs/06-diorama-day.png, layout, match; study/behind-qb-field-view.jpg, proportions, inspiration; refs/01-blitz2000-presnap.png, layout, inspiration)
## Camera
Perspective, narrow FOV (about 22 to 28 degrees) from high behind the offense, tilted 40 to 50 degrees down, following the ball smoothly without cuts; the whole island never fills the frame during play, but the kickoff and score views pull back to the diorama view of refs/06. Tilt-shift focus band on the line of scrimmage, blur growing above and below.   (refs/06-diorama-day.png, layout, match; refs/01-blitz2000-presnap.png, layout, inspiration)
## UI and type
Heavy condensed italic capitals in yellow on bevelled dark steel panels with a cyan edge glow: a small scoreboard top left (clock, quarter, score), a wide centre banner for calls ("TOUCHDOWN", "2ND AND 30"), a turbo pill bottom left; the play-select screen a 3 by 3 grid of dark green chalkboard tiles with red route lines. Never an NFL or Midway mark, name or logo.   (refs/01-blitz2000-presnap.png, mood, inspiration; study/incomplete-banner-and-hud.jpg; study/playselect-diagram-grid.jpg)
## Sound mood
One loud announcer shouting two- or three-word calls over a small crowd roar, thuds on tackles, a whistle at the end of each play, gulls and surf between downs; all lines written fresh.   (study/STUDY.md: sound note; builder's call)
## Assets
style: stylized · maxTris 20000 per model · asked (stylized, from refs/05 and 06) · sources: library, web, code
## Avoid
Realistic stadium bowls that hide the island; grey or desaturated grass; real team logos, names, fonts or the Blitz lettering; a flat top-down camera; an unblurred frame (the miniature look needs the band).
## Checks
1. Turf sampled at the centre of the field in the opening look within 30/255 of #5f6a36, and sea at a bottom corner within 30/255 of #0f6a67.
2. The opening look is sharp across the line of scrimmage and visibly blurred in the top fifth and bottom fifth of the frame.
3. 14 player figures plus two goalposts are on screen at the kickoff view (look's On screen list), each player under 2% of the frame.
4. The scoreboard sits in the top left and the turbo pill bottom left, yellow text on dark steel, readable at 1280 x 800.
5. One warm key light with soft shadows; no `Lighting:` fault line.
