# Characters and key props: Isle Blitz

## Football player (home kit, the player's team)
Role: the controlled player and six team-mates; must read as a chunky toy figure against olive turf.
Silhouette: squat and wide, about 1.1 m tall at field scale with the head (helmet) about 1/3 of the height, shoulder pads wider than the hips, thick legs; big-head mode scales the helmet 1.6x.
Colours: jersey white #a3936d with navy #042316 trim and number, helmet navy, pants white, gloves and socks dark.
Materials: matte flat colour, helmet glossy, number painted on; no PBR texture.
Animation: real skinned clips, sourced (the person asked for quality animations, 2026-11-05): the figure is skinned onto the Quaternius Universal Animation Library skeleton (CC0, assets/anim/quaternius-ual-godot/, 53 bones, 127 clips) and plays its clips through an AnimationMixer: Crouch_Idle_Loop before the snap, Jog_Fwd_Loop and the LeanL/LeanR variants, Sprint_Enter/Loop/Exit on turbo (grass spray added in code), Roll for the dive, Dodge_Left/Right for the spin, Push_Loop for the stiff-arm, Hit_Chest/Head/Shoulder_L/R when tackled, Death01/02 for the fly and landing, GroundSit_Exit for the get-up, Celebration and BackFlip for scores. The quarterback's throw is KayKit's Throw clip (CC0, assets/anim/kaykit-anims-medium/Rig_Medium_General.glb) retargeted with a bone map, or a short code pose if the retarget fails. Sources and licences: assets/anim/SOURCES.md. Built file: assets/player-anim.glb (skeleton, skinned figure, the clips above, under 3 MB).
Source: library ccde5e37e2144d1dae496626de0f7467 · "Happy Cheff" (a stylized football player in an orange kit, helmet and pads) · CC BY · picked by person (2026-11-05) from refs/assets/player-3.jpg pick 1; searched "football player" with image refs/05-tiltshift-runner.png crop [800, 560, 1150, 1000]. Audit (2026-11-05): 699 KB, 125,634 triangles, one material with a 1024 px WebP texture, meshopt, no animation clips. model_audit's shrink only cuts textures, so the build decimates the mesh itself (model_run: load, simplify to about 12,000 triangles, save as assets/player-lite.glb) or shares one geometry across 14 figures with per-kit material colours; it is skinned in model_run onto the sourced skeleton above (nearest-bone weights, rest pose fitted to the squat figure); fallback if the skinning tears: the Quaternius mesh itself in kit colours with a code-built helmet and pads on its head and chest bones. Not taken: library 96dec386 and 2f2e08d8 (animated, 4,674 tris, the cheap fallback if the shrink fails audit); 8a655001 "Rugby Player"; a28d0d58 "kiannfl13" big-head toy; code.
Refs: refs/05-tiltshift-runner.png (style, match), refs/06-diorama-day.png (scale on the field, match), study/behind-qb-field-view.jpg (proportions, inspiration).
Turnaround: refs/assets/player.jpg, refs/assets/player-2.jpg, refs/assets/player-3.jpg (asset_search contact sheets)

## Football player (away kit, the CPU team)
Role: the seven opponents; the same figure as above recoloured.
Colours: jersey red #853621 with white trim and number, helmet red, pants white.
Source: the same source as the home kit, recoloured by material.
Refs: refs/07-diorama-night.png (the red side, match).

## Football
Role: the ball; small, must be visible in flight and on the ground.
Silhouette: a prolate spheroid about 0.28 m long at field scale, white laces up.
Colours: leather #4c341a, laces chalk #c2b496; on fire, wrapped in a flame sprite.
Source: library b2164700 · "Object9 - Football" · CC BY · 2537 tris · picked by builder, or code (a scaled sphere with a lace strip).
Refs: refs/05-tiltshift-runner.png (the ball, match).
Turnaround: refs/assets/goalpost.jpg (the football hits are on it)

## Goalpost
Role: two, one per end zone; the extra-point target.
Silhouette: a single yellow post with a crossbar and two uprights, about 1/10 of the field width wide, uprights three times the crossbar height.
Colours: chalk-yellow #c2b496 warmed toward yellow.
Source: code: by design, three cylinders · picked by builder.
Refs: refs/06-diorama-day.png (the far goalpost, match).

## Picked by the builder
- Timber sideline stands: code, two low benches of planks in the island's fence timber; the library had only steel bleacher seats.
- Crowd: the island's sheep, ducks and cow placed along the sidelines, plus flat painted spectator billboards in crowd warm #8f5d4e and teal #247876 (refs/06, refs/07).
- Floodlight masts: code, a tapered steel pole with a tilted frame carrying a 3 × 2 bank of round lamps; four library searches (stadium floodlight tower, sports field light pole, stadium light, floodlight pole) gave only radio towers and street lamps.
- Yard lines, numbers and end-zone lettering: a canvas texture via fx.js tex(), chalk colour, slightly rough edge.
