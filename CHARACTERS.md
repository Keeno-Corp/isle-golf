# Characters and key props: Isle Golf

## Golfer (player)
Role: the player, one figure repainted in each player's kit colour (ISLA red, FINN blue, MOSS yellow, WREN pink).
Silhouette: the island's footballer (assets/player-anim.glb), restored by the owner and kept as the golfer: 0.85 units tall at course scale, its own black helmet and face mask from the model (the code-built teal helmet was removed at the owner's request, 2026-11-15), shoulder pads, thick limbs; stands beside the ball facing it, club in the right hand.   (builder's call)
Colours: jersey in the kit colour with the player's number, the model's own black helmet, trousers black, ink-dark outline in the shader.
Materials: matte; alpha 0 so the painterly pass leaves it crisp.
Animation: Idle_Loop clip plus procedural bone nudges for the lean, twist and the swing (address, backswing, impact, follow), a walk to the ball after each shot; Celebration (birdie or better) and Dance_Loop (par) after a hole-out.
Source: existing project asset assets/player-anim.glb (Happy Cheff, CC BY, see assets/CREDITS.md), reused as the golfer as asked; fallback none needed · picked by builder (asset search found nothing usable offline).
Turnaround: refs/sheets/LOOK.png (in-game views)

## Golf ball
Role: the thing the player follows; must read at every camera distance.
Silhouette: drawn at radius 0.049 (physics radius 0.07; still exaggerated so it reads), unlit warm white with a soft shadow blob and a player-colour ring.
Source: code: by design · picked by builder.

## Flag and cup
Role: the target on each green; the one vertical accent.
Silhouette: thin white pole 1.1 units (1.3x the 0.85 golfer), a red cloth flag that waves in the hole's wind and points downwind, a dark cup disc with a white rim.
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
- From the paprika3d library (asset_search, all CC BY 4.0, each audited with model_audit: passes the site budget; credits in assets/CREDITS.md), placed by src/library.js in place of the code-built stand-ins:
  - Sheep: assets/koyun-ef9df4.glb (Koyun, Feraxion), merged to one instanced geometry, 0.55 units long.
  - Trees: assets/stylized-tree-6ba26d.glb (Stylized tree, roroer) and assets/odd-little-tree-37524b.glb (Odd Little Tree, Javafern), by turns under each crown group.
  - Lighthouse tower: assets/lighthouse-florane-games-2ed07b.glb (Jenya_girl), its blue base disc cut away; the code lamp beams, light and keeper's cottage stay.
  - House on hole 5: assets/fantasy-cottage-gart130-56175c.glb (Manuel Pelaez Taracena).
  - Standing stones in the deep rough (round colliders): assets/stonepile-2d5f24.glb (Rico Peters). Tee benches: assets/bench-stylized-ee9269.glb (salmonclosebeta). Rowing boats off the cliffs: assets/rowing-boat-prop-free-agustin-honnun-afdd98.glb (Agustín Hönnun).
  - Searched and left as code: boulders at the waterline (only an 80-triangle kit rock fit), flags and cups (by design), the sky (a haze gradient by LOOK.md). Two cottage hits by "Scenario" were rejected as possibly generated.
