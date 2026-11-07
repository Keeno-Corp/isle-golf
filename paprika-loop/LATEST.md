The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 7

**Judge 7: Isle Golf, hud-round lane**

I took the title, a 2-player start, aim stage 2 and a tee shot in `look`, and ran `perf` once. I did not rerun `test`. Iteration 7 reports all 8 saved checks passing, and I did not verify that. I did not play any putts or see a stamped card, a PERFECT banner or the final card. Anything about those is from the builder's notes or the checks.

1. **Wider view and putt feedback (top priority): 7.**
   - The HUD holds at the wide camera. `holep` [16,14,336,148], `windp`, `clubp` and `hinter` have 0 overlap and 0 cut off, and no banner sits on the ball or pin.
   - The SO CLOSE!/IN! calls run through `hudRound.lastCall` and `minPinD`. I did not see them happen on a real putt this session.
   - `hud-round-sound` now asserts the outcome that happened, which meets the new Steer.
   - The groan and rattle sounds cannot be heard headless.
2. **HUD in the Isle Blitz type: 9.**
   - `holep` shows hole, par, strokes, yards and the player's name with a red dot.
   - `windp` is top right and `meterp` ("SNAP 32%", stage 2) is bottom centre.
   - `clubp` lists DRIVER 204, IRON 132, WEDGE 74 and PUTTER GREEN, with a LIE · TEE line.
   - I did not see the yardage drop on a rough or sand lie.
3. **Banners never cover the target: 8.**
   - In the 2-player look after the tee shot, `hudRound.lastCall` was "HOLE 1" and the banner was clear of ball and pin.
   - The "n YD TO PIN" banner position was last checked in session 7's Iteration (`#sub` left of the ball and pin).
4. **Stamped scorecard and final card: 6.**
   - Not seen by me this session. The stamped 2-player card still has no picture, so I can only take the saved checks' word for the card and 'ROUND COMPLETE'.
5. **Title and hot-seat: 8.**
   - Digit2 then Space gives `hudRound.order` ["ISLA","FINN"], with ISLA's red dot in `holep` and both players in `scores`.
   - The hot-seat check depends on ball physics deciding who is farthest, so it can break if that changes.
6. **Sound: 8.**
   - 9 and 10 sounds started during my steps, with no "SFX[k] is not a function" error.
   - I cannot hear the surf, gulls, jingle or tick in headless.
7. **Juice: 7.**
   - I saw the swing stage and the HOOK! label (`meter.label`) at stage 3.
   - I did not see a PERFECT banner or the hint shown for a sand lie.
8. **R replay and full round: 8.**
   - `hud-round-full-round` is saved with real keys. I did not rerun it, so this is Iteration 7's report that all 8 checks pass.
9. **No console errors: 9.**
   - Only the `toNonIndexed` warning appeared.
10. **Saved checks hud-round-*: 9.**
    - 8 checks are saved, including `hud-round-hotseat`, re-saved this session by the builder.
11. **Looks as LOOK.md says: 8.**
    - Cream-on-dark-green panels, tilt-shift blur and a warm green/yellow palette (green 70%, yellow 26%).
    - The golfer is only 0.17% of the picture and `look` says the camera shows little of the subject.
12. **Edit only the allowed files: 9.**
    - Iteration 7 made no source changes.
13. **Keep as they are: 8.**
    - Camera, `aimDots` arc, sheep, the 9 holes and `window.__game` observe/act are all present.
14. **Faults: 5.**
    - `ballShadow1` and `ballShadow2` z-fight at y = 4.49 in 2-player. `look` flags it again, and I asked for the fix in judge 6 as well.
    - `perf` read 1241 ms a frame on SwiftShader (no GPU), so it is not a signal. Host load was 4.7 on 8 cores.
    - `ball2` is the only ball visible at aim, with `ball1` hidden.

**Next:**
1. **(asked again)** Fix the `ballShadow1`/`ballShadow2` z-fight. `src/balls.js` belongs to another lane, so from `src/main.js` or `src/effects.js` set `ballShadow2.position.y += 0.001`, or set `polygonOffset` with `polygonOffsetFactor` -1 on its material. Shown done by `look` after `start` with players 2: the Surfaces line no longer names the pair.
2. **(asked again)** Photograph the 2-player stamped card and the PERFECT banner. Use `interact` with real keys through hole 1 for both players, with `look: true` right after the card appears. Then `look` with a `sheet` of the rough lie, the sand lie and meter stage 1, to show the `clubp` yardage drop.
3. Make the golfer easier to see at the wider camera. `golfer_body` is 0.17% of the frame and `look` says "little of the subject". Add a brief ring or a name tag over the active player's head at aim, in `src/hud.js`. Shown done by `look` at aim, where the `Subject:` line gives a larger share and "Stands out" shows more colour contrast.

SCORE: 7.7

## Iteration 8
**Did:** Added an active-player name tag to `src/hud.js`: `#tag` (cream-on-dark-green pill with the kit-colour dot and name), projected each frame from `curP().pos` (+0.85 up, 55 px left) in `updateTag()`; shown only in phase `aim`; `hud.tag` is exported. Tried a `ballShadow2` polygonOffset patch in `src/effects.js` first, then reverted it: the new PROMPT steer says the z-fight is ball-physics' (src/balls.js), not this lane's.
**Saw:** 2-player aim look on hole 1: `div#tag "ISLA"` [542,482,627,510] sits just above the golfer's head; holep/windp/banner/sub/clubp/hinter/tag all 0 overlap, 0 cut off, 0 off-screen. Green 63%, yellow 24%. Golfer still 0.34% of the frame (camera is the look lane's). `look` still names the ballShadow1/2 pair on Surfaces (not this lane's). No new console errors (toNonIndexed only). Did not run `perf` or the saved checks after the edit (the hook's check run was in progress).
**Next:** photograph the 2-player stamped card and the PERFECT banner with real keys (`interact` look:true right after the card); a `look` sheet of rough/sand lie and meter stage 1 for the clubp yardage drop; confirm the tag hides on a hole-camera `C` overview and when the ball is mid-flight (it only shows at aim).
**Open:** Stamped 2-player card, PERFECT banner and the clubp yardage-drop looks are still not photographed. The tag's offset (−55 px, +0.85) is tuned for the default camera only.
