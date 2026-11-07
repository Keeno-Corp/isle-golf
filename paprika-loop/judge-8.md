**Judge 8: Isle Golf, hud-round lane**

I opened the page, played a 2-player start, a real-key swing, wedge and putter shots and a short putt, and ran `perf` once. I did not rerun `test`. I never reached a stamped card, a PERFECT banner, the final card, or a SO CLOSE!/IN! call. Those scores come from the saved checks and the builder's notes, not from my own play.

1. **Wider view and putt feedback (top priority): 7.**
   - `holep`, `windp`, `clubp`, `hinter` and the new `tag` show 0 overlap, 0 cut off and 0 off-screen at every stage I looked at.
   - On the green, `holep` [16,14,336,148], `windp` and `tag` stay clear of the pin and ball.
   - The `49 YD TO PIN` banner [184,208,481,253] sits left of the pin flag.
   - I did not see SO CLOSE! or IN! fire on a putt, so `hudRound.lastCall` for those is unverified by me.
2. **HUD in the Isle Blitz type: 9.**
   - `holep` shows the hole, par, strokes, yards and the player's dot and name; `windp` is top right.
   - `meterp` ("HOOK! 61%") is bottom centre at stage 3 and `clubp` is bottom left.
   - At the green `clubp` highlights PUTTER with "LIE · GREEN", and the fairway shows "LIE · FAIRWAY".
   - I did not see the yardage drop on rough or sand.
3. **Banners never cover the target: 8.**
   - `banner` and `sub` sit left of the ball and pin in all four looks, including 2 players and the green view.
4. **Stamped scorecard and final card: 5.**
   - Not seen by me for the third judge session running; I reached no card.
   - The Steer has asked for these pictures for several sessions and they are still missing.
5. **Title and hot-seat: 8.**
   - `start` with players 2 gives `hudRound.order` ["ISLA","FINN"], and the turn passes to FINN after ISLA's shot.
   - `holep` shows each player's kit dot (red for ISLA, blue for FINN) and `scores` has both rows.
6. **Sound: 8.**
   - 11 and 28 sounds started across my steps, with no "SFX[k] is not a function" error.
   - I can't hear the surf, gulls, jingle or tick in headless.
7. **Juice: 7.**
   - I saw `meter.label` HOOK! at stage 3.
   - `meter.label` read "PERFECT!" on a scripted swing, but I saw no PERFECT banner on screen.
   - The "n YD TO PIN" banner shows, and I did not see a bunker hint.
8. **R replay and full round: 7.**
   - Only the saved `hud-round-full-round` check backs this; I did not rerun it.
   - Mid-session my `swing`, `settle` and `until` steps left the page in a different state: `players` went from 2 to 1 and the ball sat on the fairway with strokes 2 and 84 yd to the pin.
   - I don't know whether a reload, replay or reset caused this, so I haven't called it a fault.
9. **No console errors: 9.**
   - Only the `toNonIndexed` warning appeared.
10. **Saved checks hud-round-*: 9.**
    - The 8 saved checks are in `game-tests.json` per Iteration 7, and I did not rerun them.
11. **Looks as LOOK.md says: 8.**
    - Cream-on-dark-green panels, tilt-shift blur and a warm green/yellow palette (green 65–76%, yellow 21–24%).
    - The `tag` pill in the kit colour sits just above the golfer's head and fits the HUD type.
    - The golfer is 0.34% of the frame at aim (0.048% in the first look). The look lane owns the camera, so this is not scored against this lane.
12. **Edit only the allowed files: 9.**
    - Iteration 8 touched `src/hud.js` only, and reverted the `src/effects.js` z-fight patch.
13. **Keep as they are: 8.**
    - Camera, `aimDots` arc, sheep, `slopeGrid` on the green, the cup and `window.__game` observe/act are all present.
14. **Faults: 6.**
    - `ballShadow1` and `ballShadow2` still z-fight at y = 4.49. The Steer says this belongs to ball-physics, so I do not score it.
    - `perf` read 1136 ms a frame on SwiftShader with host load 3.1 on 8 cores; this is no signal. Main scene 793 ms, 175 draw calls, 367k triangles.
    - Every look still lists `ball2` and `ball1` as Not found by the ID image.
    - There is a mid-session state oddity from my own steps (item 8).

**Next:**
1. **(asked again)** Photograph the stamped card. Use `interact` with `look: true` and real keys only: `Digit2`, `Space`, then Space ×3 with waits per shot and putts until both players hole out on hole 1. Without `settle` shortcuts, the card should show both rows with BIRDIE/PAR/BOGEY stamps. The call to prove it is `interact` with `until` `{phase: "card"}` and `look: true`. If `phase` never reaches `card`, the reply shows that.
2. **(asked again)** Prove SO CLOSE!/IN! on a real putt and photograph PERFECT. Use `interact` with `trace` on `hudRound.lastCall` and `hudRound.minPinD` across one putt that misses by less than a cup width, then one that drops. A PERFECT banner needs `meter.perfectAt` hit exactly on the third click. `look` right after shows `div#banner` clear of the ball and pin, and `lastCall` reads `SO CLOSE!` and then `IN!`.
3. Take the `clubp` yardage-drop `sheet` with `state` set to a rough lie and a sand lie (`lie: "rough"`, `lie: "sand"`), and a `C` overhead moment. It should show WEDGE/IRON yardages lower than on the tee (the tee shows 204/132/74), `#tag` hidden on the overhead, and `hinter` showing the bunker hint that matches the club.

SCORE: 7.6
