# hud-round lane notes
Provides: HUD (hud.js), banners, stamped scorecard + final card (best in localStorage `isleGolfBest<N>`), 1-4 player hot-seat (round.js), sounds (sound.js: gull, surf, birdie, meterTick, perfect, nice, pin; `play()` is guarded against missing SFX).
Events fired: `hud-round:call` {call:'PERFECT'|'NICE'} on the swing, `hud-round:rest` {yards} when a ball comes to rest. Observe key: `hudRound` {order, turn, lastCall, cardOpen, final, best}.
Banners sit left of centre (27%, 26%) so the pin and ball stay clear. Bunker hint depends on the auto-picked club.
Needs from others: none.

## Putt calls (session 4)
- `hud-round:lipout` fires when a putter ball passes within 0.24 units of the cup and does not drop: banner "SO CLOSE!" + `groan` sound. `observe().hudRound.lipOut` / `minPinD` show it.
- A putt that drops: `rattle` sound + "IN!" banner (birdie or better keep their own name + jingle).
