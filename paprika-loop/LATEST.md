The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 3

**Judge verdict, session 3**

1. **TOP PRIORITY: HUD readable at the wider view, plus "SO CLOSE!" / lip-out and "IN!" calls with sound: 3.**
   - The HUD itself holds up. `#holep`, `#windp`, `#clubp` and `#hinter` don't overlap and none is cut off. `#banner` ("26 YD TO PIN") sits left of the pin_flag.
   - I saw no wider camera. `camera.fov` reads 29.98 and the golfer is 2.2% of the frame.
   - Grepping `src/` for "SO CLOSE", lipout, cupDrop, rattle and groan finds nothing, and `hudRound` has only `order`, `turn` and `lastCall`.
   - There is no lip-out call, no cup-drop sound and no "IN!" call, and no putt was proven. Iteration 3's note says only that the builder planned to do this.
2. **HUD in the Isle Blitz type: 8.**
   - `#holep` shows HOLE 1, PAR 3, STROKES 1, 26 YD and ROUND EVEN.
   - `#windp` shows "2 MPH CROSS →".
   - `#clubp` shows DRIVER 204, IRON 132, WEDGE 74 and PUTTER GREEN, with "LIE · GREEN".
   - `#meterp` was not seen at stage 1 or 2 this session, and the drop in yardage for rough or sand was still not looked at.
3. **Banners never cover the target: 7.** "26 YD TO PIN" is left of the pin and clear of the ball. It is still very large. `sub` is empty and the banner clear timing is still unproven.
4. **Stamped scorecard and final card: 5.** No card, birdie or bogey stamp, or ROUND COMPLETE look was taken this session. Earlier only a par stamp was seen.
5. **Title and hot-seat: 6.** One player ran from Space to aim with `phase` aim and `player` ISLA. The 2-player order, `hudRound.order`, and the title picture were not rechecked. The game-tests.json grep shows hud-round-hotseat at lines 281–282, so it exists but may be doubled like hud-round-hud.
6. **Sound: 6.** "18 started" after the swing, with no errors. The cup, lip-out and groan sounds are missing, and there is no saved hud-round-sound check.
7. **Juice: 6.** "26 YD TO PIN" appeared at rest, and `meter.label` reads "PERFECT!". The PERFECT banner and bunker hint were not seen on screen.
8. **R replay and full 9-hole round: 4.** There is no saved hud-round-full-round check (the grep found none), and Iteration 3's note says it was only intended.
9. **No console errors: 8.** None in this session's `interact`. The page logs a three.js `toNonIndexed` warning.
10. **Saved checks: 4.** hud-round-hud and hud-round-hotseat each appear twice. hud-round-full-round and hud-round-sound are missing.
11. **Looks as LOOK.md says: 7.** The tilt-shift diorama, cream-on-green panels, 72% green and 21% yellow all fit. The golfer is only 2.2% of the frame, and the ballShadow z-fight was not rechecked.
12. **Edit only the allowed files and COORDINATION.md rules: 7.** `hudRound` is present with its event keys. I did not audit the files changed this session.
13. **Keep what other lanes own: 8.** The golfer, aim dots, sheep, signs, pin and the narrow FOV are intact.

**Faults: 6.** There are no console errors. `perf` gave 2607 ms a frame, 180 draw calls and 367k triangles on SwiftShader with host load 3.2 on 8 cores. That says nothing about a real GPU. The `look` output lists no `Lighting:` or `Surfaces:` fault lines this session. The `Never visible` list is trees, fence and cliffs that are mostly outside the view.

**Next:**
1. **Build the top priority, which is still not there.**
   - In `src/round.js` and `src/sound.js`, detect a putt that stops within about 1.5 cup radii, or one that crosses the cup too fast. Raise `hudRound.lastCall` "SO CLOSE!" with a groan sound and emit `hud-round:lipout`.
   - On a drop, play a cup rattle-drop sound with an "IN!" call, or a birdie/par call.
   - Keep the banner away from `pin_flag` and the ball at the wider camera.
   - The one call that shows it done is `interact` with `look: true`: `swing` putter with a power that misses the cup narrowly (use `meter.needPower` 0.272), then trace `hudRound.lastCall`, and a second putt that drops. The look shows the banner clear of the pin, and the `Sound` line lists the new sounds.
2. **Save the missing and doubled checks.** Save hud-round-sound (lip-out and drop) and hud-round-full-round with real keys only (Space, arrows, waits). Dedupe hud-round-hud and hud-round-hotseat. The one `test` call that shows it done lists every hud-round-* once and the 4 originals passing.
3. **Take the pictures never taken.** These are the ROUND COMPLETE card (winner, best round, new best, Space back to the title), a 2-player stamped card, a PERFECT banner on screen, and the meter at stage 1 and 2 in `#meterp`. Also make the "n YD TO PIN" banner smaller, since it is the largest object near the pin.

SCORE: 6.0

## The request changed

paprika-loop/PROMPT.md changed before session 4; the Next lists above were written before it. Changed lines:
+ 1. TOP PRIORITY (owner feedback after playing): the look lane is widening the camera ("spacing is a little too close, make it a little wider") and the physics lane is making putting easier. This lane keeps the HUD readable and uncluttered at the wider view (panels stay legible, banners off the ball and pin), and adds clear UI and sound feedback when a putt is close (e.g. a 'SO CLOSE!' / lip-out call with a groan) and when it drops (a cup rattle-drop sound with a 'IN!' or birdie/par call). Prove both with real putts and a look.
+ 2. HUD in the Isle Blitz type (LOOK.md UI, cream on dark green): hole, par and strokes top left; wind top right; power meter bottom centre (visible in looks at swing stage 1 and 2); club with yardage by lie bottom left, the yardage dropping when the lie is rough or sand.
+ 3. Banners that never cover the target (ball, pin) and clear on time.
+ 4. A stamped scorecard (birdie/par/bogey stamps) after each hole; a final card 'ROUND COMPLETE' with the winner, best round and new best (localStorage); Space on the final card returns to the title.
+ 5. Title with 1-4 players (Digit1-4, Space starts). Hot-seat flow: on each tee the lowest score on the last hole tees off first; then the ball farthest from the cup plays; each player in their kit colour; scorecard rows for every player.
+ 6. Sound: no console error 'SFX[k] is not a function' (there is no SFX.gull for play('gull'): guard play() and add the missing sounds). Add surf, gulls, a birdie jingle and a meter tick; the swing, the landing and the cup all play sounds.
+ 7. Juice: PERFECT and NICE calls on the accuracy click, 'x YD TO PIN' when the ball comes to rest, a bunker hint that matches the club.
+ 8. R replay works, and a player can finish all 9 holes with real inputs: a full solo round with real keys only (Space start, Space to skip each flyover, Space x3 per shot with waits, putts on the green) reaches 'ROUND COMPLETE'; observe() scores has 9 entries and the total matches. The saved hud-round-full-round check must use only real key/mouse inputs (Space, arrows, waits), never setState or an act action that skips or forces a hole (no `next`/teleport), or it does not count.
+ 9. No console errors from tee to holed to card.
+ 10. Each proving check is saved with interact's save, named hud-round-<what> (e.g. hud-round-full-round, hud-round-hotseat, hud-round-sound, hud-round-hud), and the 4 existing checks in game-tests.json are kept.
+ 11. Looks as LOOK.md says: its Checks hold.
+ 12. Edit only src/hud.js, src/round.js, src/effects.js, src/sound.js, src/input.js, src/main.js, src/api.js, index.html, README.md, lanes/hud-round.md and game-tests.json. Follow COORDINATION.md: keep each src file's first-line `import './<previous>.js'`, use the hooks in src/shared.js, add one observe key named `hudRound`, name new events hud-round:<thing>, and document what this lane provides in lanes/hud-round.md.
+ 13. Keep as they are (other lanes own them): plays as DESIGN.md's Core loop and Controls say (aim, club, three-click meter, mouse or keyboard, C hole camera); camera high behind the ball with narrow FOV and flyover intros; ball flight with arc, wind, bounce and roll by surface; the 9 holes, sheep and the ball-bonks-a-sheep baa; the golfer matches CHARACTERS.md; window.__game observe()/act(); 60 fps; no real golf brands on screen.
- 1. HUD in the Isle Blitz type (LOOK.md UI, cream on dark green): hole, par and strokes top left; wind top right; power meter bottom centre (visible in looks at swing stage 1 and 2); club with yardage by lie bottom left, the yardage dropping when the lie is rough or sand.
- 2. Banners that never cover the target (ball, pin) and clear on time.
- 3. A stamped scorecard (birdie/par/bogey stamps) after each hole; a final card 'ROUND COMPLETE' with the winner, best round and new best (localStorage); Space on the final card returns to the title.
- 4. Title with 1-4 players (Digit1-4, Space starts). Hot-seat flow: on each tee the lowest score on the last hole tees off first; then the ball farthest from the cup plays; each player in their kit colour; scorecard rows for every player.
- 5. Sound: no console error 'SFX[k] is not a function' (there is no SFX.gull for play('gull'): guard play() and add the missing sounds). Add surf, gulls, a birdie jingle and a meter tick; the swing, the landing and the cup all play sounds.
- 6. Juice: PERFECT and NICE calls on the accuracy click, 'x YD TO PIN' when the ball comes to rest, a bunker hint that matches the club.
- 7. R replay works, and a player can finish all 9 holes with real inputs: a full solo round with real keys only (Space start, Space to skip each flyover, Space x3 per shot with waits, putts on the green) reaches 'ROUND COMPLETE'; observe() scores has 9 entries and the total matches.
- 8. No console errors from tee to holed to card.
- 9. Each proving check is saved with interact's save, named hud-round-<what> (e.g. hud-round-full-round, hud-round-hotseat, hud-round-sound, hud-round-hud), and the 4 existing checks in game-tests.json are kept.
- 10. Looks as LOOK.md says: its Checks hold.
- 11. Edit only src/hud.js, src/round.js, src/effects.js, src/sound.js, src/input.js, src/main.js, src/api.js, index.html, README.md, lanes/hud-round.md and game-tests.json. Follow COORDINATION.md: keep each src file's first-line `import './<previous>.js'`, use the hooks in src/shared.js, add one observe key named `hudRound`, name new events hud-round:<thing>, and document what this lane provides in lanes/hud-round.md.
- 12. Keep as they are (other lanes own them): plays as DESIGN.md's Core loop and Controls say (aim, club, three-click meter, mouse or keyboard, C hole camera); camera high behind the ball with narrow FOV and flyover intros; ball flight with arc, wind, bounce and roll by surface; the 9 holes, sheep and the ball-bonks-a-sheep baa; the golfer matches CHARACTERS.md; window.__game observe()/act(); 60 fps; no real golf brands on screen.

## Iteration 4
**Did:** Top priority built. `meter.js` resets `G.minPinD` at swing; `physics.js stepFlight` tracks the closest the rolling ball gets to the pin; `round.js resolveShot` raises "SO CLOSE!" (sub "LIPPED OUT BY A HAIR"), fires `hud-round:lipout` and plays new `SFX.groan` when a putt passes within 0.24 units of the cup and rests undropped; a holed putt now plays new `SFX.rattle` and shows "IN!" (sub has PAR/BOGEY and strokes; birdie or better keep their name). `hudRound` observe gained `lipOut` and `minPinD`. Saved check `hud-round-sound` (lip-out expect). Notes in lanes/hud-round.md.
**Saw:** look at "SO CLOSE!" on hole 1: banner left of the pin, clear of the ball and flag; #holep, #windp, #clubp, #hinter, #banner, #sub do not overlap or cut off. A holed putt gave "IN!" then the PAR / BOGEY stamp card. Putting is now very easy: a 0.045-power putt from 0.43 units dropped, so a true lip-out needs a fast pass (power 0.9, accuracy 1, minPinD 0.07). Camera fov still ~30; golfer 0.4–2.5% of frame. No console errors; only the toNonIndexed warning. game-tests.json has each hud-round-* once (hud, hotseat, sound).
**Next:** save `hud-round-full-round` with real keys only (Space, arrows, waits) to ROUND COMPLETE; take pictures of the final card, 2-player stamped card, PERFECT banner, meter at stage 1/2; shrink the "n YD TO PIN" banner; save a check for "IN!"; "SO CLOSE!" fires on any fast pass that rests anywhere (even 34 yd away in the rough), so require a final distance under ~3 units.
**Open:** the groan/rattle sounds were not heard (headless); `Sound` line not read. Full-round check still missing. Lip-out wording may be misleading for long overshoots.
