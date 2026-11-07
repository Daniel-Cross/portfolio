---
phase: quick-261107-rm3
plan: 01
status: complete
subsystem: shell, machine, looks
tags: [easter-egg, looks, machine]
key-files:
  modified:
    - src/shell/Shell.tsx
    - src/machine/Machine.tsx
    - src/machine/state.ts
    - src/machine/ui/Lcd.tsx
    - src/looks/looks.ts
    - src/styles/looks/c64.css
---

# Quick Task 261107-rm3: Easter egg fixes after launch

## Changes

- The name only opens the egg on the clean look (and still closes it from inside).
- A preset press inside the egg ends it and the site takes that decade's look; the preset is kept, not replaced by the default song.
- `isCustom(state, song)` in state.ts: once patterns, chords, notes, key or mode differ from the loaded preset, no preset is lit, the LCD says "Your loop", and the machine reports the look 'clean', which `effectiveLook` treats as "keep the visitor's pick". Knob tweaks alone do not count.
- The hidden look is now a DOS terminal: black, CGA grey, green prompts, VT323, scanlines, double borders, a boot log before the CV. The 'c64' id is unchanged.

## Verification

- PASS: `npm test` (78 tests, including four new ones for the three behaviours).
- PASS: `npm run lint`, `npm run build`.
- PASS: checked in Chrome on a dev server: the look, preset exit to e80, custom loop staying clean with immersion on.
- Not checked: phone widths of the new look.
