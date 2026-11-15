# Isle Golf · Daily Hole Extension

## What it is
An extension to the existing Isle Golf game adding a Daily Hole mode: one challenge hole per day, shared globally, with deterministic generation from the date.

## Must have
1. Preserves existing LOOK.md visual style and normal nine-hole gameplay
2. Entry via `?daily` (today) or `?daily=YYYY-MM-DD` starts solo daily mode
3. Title shows "D · DAILY HOLE" in existing cream-yellow heavy italic capitals
4. `__game.act({action:"daily",date?})` API entry point
5. UTC date hash PRNG deterministically picks: hole index (0-8), optional tee nudge, pin position (inside 60% of green, avoiding bunkers), wind speed (1-7) and direction
6. DAILY HOLE · date banner displayed on start
7. Tracks complete stroke path: start positions, resting/cup points, including penalties
8. On completion (cup or pickup), shows stamp card with: date, hole name, par, strokes, vs-par name, stroke number
9. Canvas-painted miniature path on stamp card: rough #b8a64a, striped fairway #5d8a3a/#6b9743, green #76a64a, sand #dcc78d, sea #0f6a67, red flag #d9392b, cream #f4e39a numbered dots and stroke lines
10. SHARE button: uses navigator.share (text+PNG) if supported, else clipboard text + download PNG with "COPIED!" feedback
11. Share text format: "Isle Golf Daily 2026-11-07 · Gorse Run (par 3) · 2 strokes, -1 BIRDIE" + stroke row + https://isle-golf.pages.dev/?daily
12. localStorage: saves first daily result per date, shows "TODAY'S FIRST: n" on subsequent plays
13. Observable state: `daily: {on, date, holeIndex, pin, wind, shots:[[x,z]...], strokes, result, shareText}`
14. Deterministic: same date always produces same hole/pin/wind

## References
Existing game files as reference for visual style and code patterns

## Left to the builder
- Hash function quality
- Pin placement algorithm within constraints
- Canvas painting implementation details
- Share image generation approach
