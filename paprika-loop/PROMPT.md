# Isle Golf · lane hud-round
## What it is
A tilt-shift arcade golf game on Shepherd Isle: the football field of Isle Blitz is regrown into a nine-hole links course with sheep, a pond, the lighthouse and the sea along the cliffs. This loop is the hud-round lane of a 5-lane team (see COORDINATION.md): it makes the round complete and fun from title to final card.
## Must have
1. TOP PRIORITY (owner feedback after playing): the look lane is widening the camera ("spacing is a little too close, make it a little wider") and the physics lane is making putting easier. This lane keeps the HUD readable and uncluttered at the wider view (panels stay legible, banners off the ball and pin), and adds clear UI and sound feedback when a putt is close (e.g. a 'SO CLOSE!' / lip-out call with a groan) and when it drops (a cup rattle-drop sound with a 'IN!' or birdie/par call). Prove both with real putts and a look.
2. HUD in the Isle Blitz type (LOOK.md UI, cream on dark green): hole, par and strokes top left; wind top right; power meter bottom centre (visible in looks at swing stage 1 and 2); club with yardage by lie bottom left, the yardage dropping when the lie is rough or sand.
3. Banners that never cover the target (ball, pin) and clear on time.
4. A stamped scorecard (birdie/par/bogey stamps) after each hole; a final card 'ROUND COMPLETE' with the winner, best round and new best (localStorage); Space on the final card returns to the title.
5. Title with 1-4 players (Digit1-4, Space starts). Hot-seat flow: on each tee the lowest score on the last hole tees off first; then the ball farthest from the cup plays; each player in their kit colour; scorecard rows for every player.
6. Sound: no console error 'SFX[k] is not a function' (there is no SFX.gull for play('gull'): guard play() and add the missing sounds). Add surf, gulls, a birdie jingle and a meter tick; the swing, the landing and the cup all play sounds.
7. Juice: PERFECT and NICE calls on the accuracy click, 'x YD TO PIN' when the ball comes to rest, a bunker hint that matches the club.
8. R replay works, and a player can finish all 9 holes with real inputs: a full solo round with real keys only (Space start, Space to skip each flyover, Space x3 per shot with waits, putts on the green) reaches 'ROUND COMPLETE'; observe() scores has 9 entries and the total matches. The saved hud-round-full-round check must use only real key/mouse inputs (Space, arrows, waits), never setState or an act action that skips or forces a hole (no `next`/teleport), or it does not count.
9. No console errors from tee to holed to card.
10. Each proving check is saved with interact's save, named hud-round-<what> (e.g. hud-round-full-round, hud-round-hotseat, hud-round-sound, hud-round-hud), and the 4 existing checks in game-tests.json are kept.
11. Looks as LOOK.md says: its Checks hold.
12. Edit only src/hud.js, src/round.js, src/effects.js, src/sound.js, src/input.js, src/main.js, src/api.js, index.html, README.md, lanes/hud-round.md and game-tests.json. Follow COORDINATION.md: keep each src file's first-line `import './<previous>.js'`, use the hooks in src/shared.js, add one observe key named `hudRound`, name new events hud-round:<thing>, and document what this lane provides in lanes/hud-round.md.
13. Keep as they are (other lanes own them): plays as DESIGN.md's Core loop and Controls say (aim, club, three-click meter, mouse or keyboard, C hole camera); camera high behind the ball with narrow FOV and flyover intros; ball flight with arc, wind, bounce and roll by surface; the 9 holes, sheep and the ball-bonks-a-sheep baa; the golfer matches CHARACTERS.md; window.__game observe()/act(); 60 fps; no real golf brands on screen.
**Steer (lane lead):** the next session's first job, before any new feature, is to run and save hud-round-full-round (real keys only, all 9 holes to ROUND COMPLETE) and hud-round-hotseat; take the ROUND COMPLETE and 2-player stamped-card pictures in the same session. Three sessions have skipped these.

**Steer (lane lead, trial merge with the other lanes' pushed branches):** 6 of 7 checks pass on the merged build; hud-round-sound fails there (lastCall "10 YD TO PIN", expected "SO CLOSE!") because ball-physics made putting easier and changed the cup capture. Make hud-round checks robust to other lanes' physics: assert the call/sound fired for the outcome that happened (e.g. lastCall is one of SO CLOSE!/IN!/n YD TO PIN matching hudRound state, no console errors), not one exact rest distance. ball-physics already plays the cup rattle and lip sounds (src/ballfx.js); keep this lane's putt sounds to the voice/jingle layer so they don't double up.

## References
refs/sheets/LOOK.png · style · match (Shepherd Isle, the game's own views) · built from /home/ubuntu/repos/paprika3d-dev/examples/shepherd-isle
refs/study/ (not published) · mood · inspiration
## Inspirations and notes
Mario Golf and Everybody's Golf arcade feel, Golf Story charm, Wii golf polish; the tilt-shift diorama views of Shepherd Isle and Isle Blitz. The owner: "take the shepherds isle / the tilt-shift nfl blitz game, and make it a golf game. Use the same style as shepherds isle". The game has a full-screen post pass: take pictures with interact + look:true right after stepped frames.
## Sheets
LOOK.md · CHARACTERS.md · DESIGN.md · refs/sheets/LOOK.png · COORDINATION.md
Web study: yes (asked) · Picture sheets: no, no image key (asked) · Asset style: stylized (asked)
## Left to the builder
Banner wording and timing, jingle and tick sounds, final card layout, kit colours and player names.
