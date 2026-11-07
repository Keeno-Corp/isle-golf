The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 25

**Judge 25: Isle Golf, hud-round lane**

I ran `test` (all 8 saved checks), two `interact` plays with `look`, and `perf` once. I did not reach a rough lie, the SO CLOSE! call, the PICKED UP stamp or the ROUND COMPLETE card. The second play started with `players` 1 in the state although the first play set 2, so I could not tell whether the second play was a reload or a state bug.

1. **Wider view and putt feedback (top priority): 7.**
   - `banner` was "" at FINN's tee with `sub` "FINN TO PLAY", so Iteration 25's stale-banner fix works. After the wedge swing, `banner` "74 YD TO PIN" and `hudRound.lastCall` matched.
   - Both banners stayed clear of `ball1`, `cup` and `pin_flag`.
   - I saw no SO CLOSE! call and no IN! call this session. The `hud-round-sound` check passes with its outcome-based assertion.
2. **HUD in the Isle Blitz type: 7.**
   - `holep` reads "HOLE 1 PAR 3, STROKES 2, 74 YD, ROUND EVEN, PEBBLE STEP". `windp` reads "2 MPH CROSS →". `clubp` highlights WEDGE 74 with "LIE · FAIRWAY".
   - `meterp` is faint at the bottom centre during flight, with "HOOK!" barely readable.
   - `clubp` and `hinter` text is still small (about 11–13 px at 1280×800).
   - The yardage drop on a rough lie is still unseen.
3. **Banners never cover the target: 8.** `banner`, `sub` and `hinter` stayed off `ball1`, `cup` and `pin_flag` in both looks. The `tag`/`windp` clamp is not confirmed because no golfer was near the top edge.
4. **Stamped scorecard and final card: 7.** I did not see the card this session. Last session's 2-player stamped card looked finished, and `hud-round-full-round` passes, so the final card is reached.
5. **Title and hot-seat: 8.** `hudRound.order` ["ISLA","FINN"] and `hudRound.turn` "FINN" held after ISLA's shot. `hud-round-hotseat` passes. I did not see the lowest-score-first rule on hole 2.
6. **Sound: 7.** `interact` reported "18 started" sounds on the swing, and there was no console error. I cannot name which sounds they were.
7. **Juice: 6.**
   - "74 YD TO PIN" appears as a call.
   - The PERFECT!/NICE banner is not captured. I clicked at `meter.power` 0.507 but got stage 3 with label "HOOK!", so my timing was off.
   - The bunker hint is not photographed.
8. **R replay and full round: 8.** `hud-round-full-round` passes under `test` (288 s total for the 8 checks). I did not check its `until` actions or that it uses real inputs only. I did not test R replay.
9. **No console errors: 9.** None in the plays. The only warning is the harmless `toNonIndexed` one at open.
10. **Saved checks hud-round-*: 9.** All four hud-round checks and the four original checks pass.
11. **Looks as LOOK.md says: 8.**
    - Tilt-shift blur, cream on dark green panels, a yellow-green course and a teal sea.
    - `golfer_body` is readable in the swing look (0.45%, orange kit, `club_head` and `divots` visible).
    - At the tee `golfer_body` is hidden behind the camera and `golferShadow` is outside the view. The camera lane owns that.
12. **Edit only the allowed files: 9.** The git tree was clean at start, with only paprika-loop commits.
13. **Keep as they are: 8.** `cup`, `pin_flag`, `sheep`, `aimDots`, `ballTrail` and `divots` are all present. The iron was auto-picked at 118 yd and the wedge at 74 yd.
14. **Faults: 8.** `perf` read 700 ms a frame on SwiftShader at host load 5.7, with 181 draw calls, 367k triangles and 1.86 MB assets. That is a software renderer, so it is no signal. There was no console error.

**Next:**
1. **Take the unseen pictures with real inputs, and fix the `meter.power` timing.**
   - Rough lie: play `swing` power 0.3, accuracy 0.8 from the tee, `until phase aim`, then `look`. `clubp` should show WEDGE or IRON below 132 YD with "LIE · ROUGH".
   - PERFECT banner: aim `until meter.power` just under the target (try [0.49, 0.5]) for the first Space and `until meter.stage 2` before the next one. `look` right after should show the PERFECT!/NICE `banner` off `ball1`.
   - PICKED UP: four swings at power 0.05 with `until phase card` and `look`. Also capture ROUND COMPLETE with `until hudRound.final`.
2. **Make `clubp`, `hinter` and `meterp` read at 1280×800.**
   - Raise `clubp` and `hinter` to about 15 px, and make `meterp`'s label and needle more opaque during flight.
   - Check with `look` `zoom` on [16, 627, 243, 783]. The lie and yardage rows should read clearly. Keep `holep` clear of `ball1` and `pin_flag`.
3. **Make the active golfer easy to find at the wide camera.**
   - Add a larger kit-colour ring under `golferShadow`.
   - At the tee the golfer is outside the view, so the `tag` needs a screen-edge arrow or a "FINN" label near `ball1`.
   - `look` at the tee should show it. Also run a SO CLOSE! putt (`swing` power just short on the green) and confirm `lastCall` "SO CLOSE!" with no doubled sound.

SCORE: 7.7

## Iteration 26
**Did:** `#hinter` in `src/hud.js` raised to 17 px and opacity .92 (was 14 px, .7). No other change.
**Saw:** No browser, `look`, `test` or `perf` run (about 13 minutes); no new numbers. `#clubp` was already 20 px, so Judge 25's "small" note was about the captured size.
**Next:** Make `meterp` label/needle more opaque in flight; add a kit-colour ring under `golferShadow` and an edge arrow for `tag` at the tee; take the unseen pictures (rough lie, PERFECT banner, PICKED UP, ROUND COMPLETE) and a SO CLOSE! putt.
**Open:** The hinter edit is untested; check it stays off `ball1`/`cup` at the bottom right.
