# Look lane

Owned files: `src/camera.js`, `src/stage.js`, `src/post.js`, this document, and `look-` checks in `game-tests.json`. No new source module is required. First-line predecessor imports are preserved. No new action or event contract.

## Camera and rendering

- Wider 33-degree aim/flight framing preserves the miniature perspective. Aim uses a lifted target; putting has its own raised, pulled-back frame. Flight follows earlier with smoothing 8 and non-putt distance/height 7.8/3.9, easing toward the green without zooming back in.
- C fits tee/current ball and the full flag (pin +2.25) at about 55 degrees. It searches both broadside yaws and caches the fit by hole/from/aspect.
- Intro runs diorama -> hole overview -> along tee/pin -> behind ball. Pin visibility at the midpoint and 25/50/75-percent timing are replayed.
- The cup close-up begins during sunk settle, before the holed phase, so the camera can show the drop. Final close-up uses FOV 30 and a raised look target.
- Focus follows the ball/golfer; the upper aim-view fifth stays blurred. Crisp subjects and dither survivors bypass the Kuwahara mix and both tilt blur passes through the existing alpha mask, without changing opaque blending.
- Warm sun is at (-22,28,-16), casting shadows lower-right in the main view. Teal sea grading and cream-green haze remain. Night fill stays readable. Ground textures use linear/trilinear filtering and up to 8x anisotropy; course owns the baked stripe/grain textures.

## Dither/material contract

Implementation is folded into `src/camera.js` (there is no `src/dither.js`). Opaque standard/basic materials are patched after preserving their existing `onBeforeCompile` and program-cache key. Stable screen-space Bayer thresholds discard fragments, never alpha-blend them.

- Near-plane fade covers view depths 1.3..3.4. A soft screen-space circular hole reveals the occluded golfer/ball. The live walking holder position is used in aim/swing, not the golfer's destination.
- Sky, sea, translucent effects, ball, golfer and club hierarchy are excluded. Dithering is disabled for title/intro/card/C views.
- No course/creature material hook is needed. Keep those materials opaque unless genuinely translucent; their existing shader callbacks are chained.
- Surviving dither pixels retain a crisp raw-scene mask through post processing. The rest of the scene remains painterly and tilt-shifted.

Observe key `look`: `camPitchDeg`, `flyoverT` (zero outside intro), `focusY`, `ball/pin/golfer {x,y,on}` in live-camera NDC, and `dither {patched,active,subjectNdc,depth,radius,occluders,nearFades}`. Occluders use projected bounding-sphere candidates; near fades use visible depth-clipped box bounds, not just a sphere. Metadata names are diagnostic, not stable course IDs.

## Proof and replay

Full 180-minute paprika loop: 71 sessions, best iteration 21 at `92c603f`, score **7.8**. Final fresh `test` replay in iteration 71: **24/24 passed in 328.4 seconds**. The four original baseline checks are unchanged. All later source code matches the selected best; final cleanup only removes loop artifacts and updates this document.

Saved look checks (all pass on this lane):
- Aim: `look-aim-hole1`, `look-aim-hole5`, `look-aim-hole9-ball-lifted`.
- C: `look-c-hole5-broadside`, `look-c-hole6-pitch`, `look-c-hole9-broadside`.
- Intro: `look-flyover-25`, `look-flyover-50`, `look-flyover-75`.
- Flight: `look-drive-early`, `look-drive-mid`, `look-drive-late`.
- Night: `look-night-hole5` (N replay, with visual readability checked separately).
- Dither: `look-dither-occluder-tree`, `look-dither-hole5-tree7-circle`, `look-dither-nearplane`.
- Cup/card: `look-holed-cup`, `look-sunk-cup-closeup`, `look-putt-holed`, `look-card-hole`.

Aim, meter, flight, holed and scorecard pictures were inspected. Last full-scene perf was 307 draws / 485,787 triangles, within the 307 / 486k baseline; a hole-5 flight frame was 181 / 367k. No shader/harness errors were observed; the known non-indexed-geometry warning remains.

Open exactly with paprika3d `open({cwd: <repo>, url: "index.html"})`. Replay with `node <paprika3d>/src/cli.js check --cwd <repo> --url index.html`.

## Integration notes / requests

Fresh overlay with course `71f4645`, creatures `75c5e50`, physics `5076089` and HUD `1b14143`: **16/22 passed**. All C, aim, flyover, flight, night and generic tree checks passed; an inspected picture shows the new walking golfer through a crisp Bayer hole. This overlay predates the final two cup/card checks.

The integrator must refit world-coordinate/power fixtures after course SPREAD1.2 and the new putting physics: baseline `putt-drops-in-cup` / `pond-costs-a-stroke`, plus `look-holed-cup`. `look-dither-hole5-tree7-circle` sees tree8 instead of the baseline tree7; `look-dither-nearplane` needs a new close-camera fixture; `look-sunk-cup-closeup` reaches y=-0.127 instead of its overly narrow [-0.75,-0.3] range. Re-record the later cup/card fixtures in the integrated game too. Do not change rendering to satisfy old tree names or coordinates.

Course's current-only thicker flag and new blossoms were visible in the overlay. A pink-red cliff boulder on hole 1 and shrubs beside the hole-5 house still read as rocks in some critic views; course owns those shapes. Earlier sound-dispatch/other-hole flag problems were not observed with the integrated HUD/course modules. A potentially stale putter caddy-power notch was reported to physics/HUD for their integrated pass.
