# Characters and key props: Isle Golf

## Golfer (player)
Role: the player, one figure repainted in each player's kit colour (ISLA red, FINN blue, MOSS yellow, WREN pink).
Silhouette: the island's skinned figure (assets/player-anim.glb), 0.85 units tall at course scale, big round cap-like head, thick limbs; stands beside the ball facing it, club in the right hand.   (builder's call)
Colours: shirt in the kit colour, cap cream (or dark green for MOSS), trousers cream-khaki, ink-dark outline in the shader.
Materials: matte; alpha 0 so the painterly pass leaves it crisp.
Animation: Idle_Loop clip plus procedural bone nudges for the lean, twist and the swing; Celebration (birdie or better) and Dance_Loop (par) after a hole-out.
Source: existing project asset assets/player-anim.glb (Happy Cheff, CC BY, see assets/CREDITS.md), reused as the golfer as asked; fallback none needed · picked by builder (asset search found nothing usable offline).
Turnaround: refs/sheets/LOOK.png (in-game views)

## Golf ball
Role: the thing the player follows; must read at every camera distance.
Silhouette: sphere radius 0.07 (exaggerated), unlit warm white with a soft shadow blob and a player-colour ring.
Source: code: by design · picked by builder.

## Flag and cup
Role: the target on each green; the one vertical accent.
Silhouette: thin white pole 1.25 units, a red cloth flag that waves in the hole's wind and points downwind, a dark cup disc with a white rim.
Source: code: by design · picked by builder.

## Club
Role: driver, iron, wedge, putter, held in the golfer's right hand.
Silhouette: grey shaft, a dark wood head (driver), grey iron or wedge head, gold-brown putter blade; swings by a pendulum from the hand.
Source: code: by design · picked by builder.

## Sheep
Role: obstacles and comedy; wander across fairways; a ball that hits one bounces off it with a baa.
Silhouette: round off-white fleece, dark face and legs, 0.5 units long.
Source: code (the Shepherd Isle sheep geometry), instanced · picked by builder.

## Course surfaces
Tee box (pale, level), fairway (mown stripes, fast roll), rough (tall straw, slows the ball and the club), sand bunker (pale, dips, ball plugs), green (fine, tilted, fast, slope arrows), pond (water hazard, +1 stroke and a drop), cliffs and sea (out of bounds, +1 stroke and replay). All painted into the island's vertex colours and read by the physics through the same functions.   (builder's call)

## Picked by the builder
- Cow, ducks: assets/vaca-2-771611.glb, assets/duck-1ef909.glb (CC BY, assets/CREDITS.md), as set-dressing and a ball obstacle (the cow).
- Lighthouse, house, cottage, bell, trees, gulls, koi-free pond: the island's own code from Shepherd Isle.
- Hole sign posts, tee markers: code.
