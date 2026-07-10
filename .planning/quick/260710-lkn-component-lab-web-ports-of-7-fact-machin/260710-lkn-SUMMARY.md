---
phase: 260710-lkn-component-lab
plan: 01
subsystem: ui
tags: [react, css, canvas, pointer-events, component-lab, fact-machine-port]

requires: []
provides:
  - Component Lab section rendered between Projects and About on the homepage
  - 7 faithful web ports of Fact Machine React Native components (PixelLoader, LoopingGradientText, AnimatedDashedGradientLine, AnimatedGradientPill, GlassControl, CrtStaticOverlay, ConsensusDial)
  - Shared lab-* CSS keyframes plus a single prefers-reduced-motion rule pausing all lab-animated elements
affects: [portfolio homepage, future case-study content referencing Fact Machine]

tech-stack:
  added: []
  patterns:
    - "Component Lab web ports: plain React + CSS transforms/animations + canvas + pointer events, zero new npm dependencies"
    - "Shared .lab-animated class centralizes prefers-reduced-motion handling for all looping demos"
    - "Canvas effects follow the NetworkCanvas defensive pattern: null-context bailout wrapped in try/catch"

key-files:
  created:
    - src/components/lab/pixel-loader.tsx
    - src/components/lab/looping-gradient-text.tsx
    - src/components/lab/animated-dashed-gradient-line.tsx
    - src/components/lab/animated-gradient-pill.tsx
    - src/components/lab/glass-control.tsx
    - src/components/lab/crt-static-overlay.tsx
    - src/components/lab/consensus-dial.tsx
    - src/components/lab/component-lab.tsx
    - src/components/lab/component-lab.test.tsx
  modified:
    - src/app/globals.css
    - src/app/page.tsx

key-decisions:
  - "All source accents (warm/orange, sweep glow) map to var(--primary), the site's single Solana-purple accent token"
  - "Dial glow window reproduced via per-tick opacity (direct port of getGlowOpacityAt), not a masked gradient"
  - "CrtStaticOverlay draws live canvas noise each frame instead of cycling 4 pre-rendered PNGs (no noise assets in this repo); native ignition/dismiss lifecycle dropped for an always-on showcase tile"
  - "GlassControl ports only the frosted-glass surface via backdrop-filter; native pressable/haptic/recipe system dropped for a static showcase panel"

requirements-completed: [QUICK-260710-lkn-component-lab]

coverage:
  - id: D1
    description: "Component Lab section renders between Projects and About with 7 named, described tiles on bg-card surfaces"
    requirement: "QUICK-260710-lkn-component-lab"
    verification:
      - kind: unit
        ref: "src/components/lab/component-lab.test.tsx#ComponentLab renders all 7 lab component names as headings"
        status: pass
      - kind: unit
        ref: "src/components/lab/component-lab.test.tsx#ComponentLab renders the section landmark with id=lab"
        status: pass
    human_judgment: false
  - id: D2
    description: "Consensus dial responds to pointer drag, updates its readout, and fires onChange with the rounded percentage"
    requirement: "QUICK-260710-lkn-component-lab"
    verification:
      - kind: unit
        ref: "src/components/lab/component-lab.test.tsx#ConsensusDial fires onChange with a changed rounded value on pointer drag"
        status: pass
    human_judgment: false
  - id: D3
    description: "Looping animations (pixel loader, gradient text, dashed line, gradient pill) pause under prefers-reduced-motion via the shared .lab-animated rule; CRT static renders a single frame instead of looping"
    verification: []
    human_judgment: true
    rationale: "prefers-reduced-motion behavior requires a real browser with the media feature toggled; no automated test exercises the media query in jsdom"
  - id: D4
    description: "No new npm dependencies, no react-native-web/reanimated/skia imports, no em dashes in shipped code"
    verification:
      - kind: other
        ref: "grep -rlE react-native|reanimated|@shopify/react-native-skia|expo- src/components/lab (expect no match)"
        status: pass
      - kind: other
        ref: "grep -rl em-dash src/components/lab src/app/page.tsx (expect no match)"
        status: pass
    human_judgment: false

duration: ~22min
completed: 2026-07-10
status: complete
---

# Quick Task 260710-lkn: Component Lab Web Ports Summary

**Seven faithful web ports of Fact Machine mobile components (pixel loader, gradient shimmer, dashed gradient line, gradient pill, glass panel, CRT static, and a drag-to-set consensus dial) rendered in a new Component Lab section, using only plain React, CSS transforms/animations, canvas, and pointer events.**

## Performance

- **Duration:** ~22 min
- **Completed:** 2026-07-10
- **Tasks:** 3
- **Files modified:** 11 (9 created, 2 modified)

## Accomplishments

- Ported 6 looping/visual Fact Machine components (PixelLoader, LoopingGradientText, AnimatedDashedGradientLine, AnimatedGradientPill, GlassControl, CrtStaticOverlay) to plain React + CSS, backed by 4 shared keyframes plus one registered custom property (`--lab-angle`) and a single `prefers-reduced-motion` rule
- Ported the interactive consensus dial, copying the exact math from `dial-model.ts` (clamp, round, translation, velocity projection, glow opacity) and converting `Gesture.Pan` handlers to pointer events
- Built the Component Lab section with 7 named, described tiles and wired it into the homepage between Projects and About
- Added a vitest file covering all 7 tile headings, the section landmark id, and the dial's pointer-drag `onChange` behavior

## Task Commits

Each task was committed atomically:

1. **Task 1: Six looping/visual web ports plus shared lab keyframes** - `6588b27` (feat)
2. **Task 2: Interactive consensus dial (the centrepiece)** - `697fb8b` (feat)
3. **Task 3: Component Lab section, page wiring, and the vitest file** - `0da33f6` (feat, includes a Rule 1 bugfix to consensus-dial.tsx)

## Files Created/Modified

- `src/app/globals.css` - Appended lab-pixel, lab-shimmer, lab-dash, `--lab-angle`, lab-rotate keyframes and a prefers-reduced-motion rule for `.lab-animated`
- `src/components/lab/pixel-loader.tsx` - 4x4 grid with a diagonal brightness wave via per-cell negative animation-delay
- `src/components/lab/looping-gradient-text.tsx` - background-clip: text shimmer over "Fact Machine"
- `src/components/lab/animated-dashed-gradient-line.tsx` - CSS-masked dashed connector with a sweeping gradient highlight
- `src/components/lab/animated-gradient-pill.tsx` - rounded pill with a rotating conic-gradient border via `--lab-angle`
- `src/components/lab/glass-control.tsx` - static frosted-glass panel via backdrop-filter
- `src/components/lab/crt-static-overlay.tsx` - canvas-drawn CRT static noise, NetworkCanvas-style defensive setup
- `src/components/lab/consensus-dial.tsx` - self-contained interactive dial: tick strip, center marker, edge fades, pointer drag with velocity-based release projection
- `src/components/lab/component-lab.tsx` - server component rendering the 7-tile Component Lab section
- `src/components/lab/component-lab.test.tsx` - vitest coverage for tile headings, section id, and dial drag `onChange`
- `src/app/page.tsx` - wired `<ComponentLab />` between `<Projects />` and `<About />`

## Decisions Made

- All source accent colors (warm/orange, sweep glow stops) map to `var(--primary)`, the site's single Solana-purple accent; `var(--live)` stays reserved and unused here, per the plan's faithful-lazy scope.
- CRT static overlay draws fresh canvas noise on an interval rather than cycling 4 pre-rendered noise PNGs, since this repo has no noise assets; the native ignition/dismiss animation sequence is dropped for an always-on showcase tile.
- GlassControl ports only the frosted-glass surface (backdrop-filter, hairline border, subtle shadow, faint primary tint); native pressable/haptic/glass-recipe system is dropped for a static showcase panel with sample content.
- Dial glow window is reproduced by per-tick opacity (`getGlowOpacityAt`), not a masked gradient, matching the plan's documented faithful-lazy scope.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Guarded `window.matchMedia` call in consensus-dial.tsx for jsdom safety**
- **Found during:** Task 3 (running the vitest file against the dial and section)
- **Issue:** `consensus-dial.tsx` called `window.matchMedia(...)` unguarded in a `useEffect`; jsdom's `window` has no `matchMedia` implementation, so mounting `<ConsensusDial />` or `<ComponentLab />` in tests threw `TypeError: window.matchMedia is not a function`, failing all 3 new tests.
- **Fix:** Added a `typeof window.matchMedia !== "function"` guard before calling it, mirroring the defensive pattern already used by `NetworkCanvas.tsx`. No behavior change in real browsers, where `matchMedia` always exists.
- **Files modified:** `src/components/lab/consensus-dial.tsx`
- **Verification:** `npx vitest run component-lab` passes (3/3); full `npx vitest run` passes (25/25); `npm run build` succeeds.
- **Committed in:** `0da33f6` (part of Task 3 commit)

### Noted, not fixed (out of scope)

**Pre-existing em dashes in `src/app/globals.css`** - The file already contained 8 em dashes in existing design-token comments (lines 44-72, e.g. "Accent budget (SITE-02): one active accent — Solana purple") from before this task. Per Surgical Changes (touch only what you must), these were left untouched. The newly appended lab-* keyframes block (lines 92+) is confirmed free of em dashes. A literal, unscoped run of `grep -rl $'—' src/app/globals.css` will still report a match due to this pre-existing content; a scoped check against only the new block passes.

---

**Total deviations:** 1 auto-fixed (Rule 1 bug), 1 noted-but-out-of-scope pre-existing issue.
**Impact on plan:** The matchMedia fix was necessary for the dial and section to mount at all in tests (and defensively in any environment without matchMedia). No scope creep; the em dash finding is pre-existing content unrelated to this task's shipped code.

## Issues Encountered

None beyond the matchMedia fix documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Component Lab section is live on the homepage between Projects and About, fully covered by automated tests and the production build.
- No new dependencies were introduced; the ports remain plain React/CSS/canvas/pointer-events only.
- Visual QA of the dial's drag feel, the CRT static's motion, and prefers-reduced-motion behavior in a real browser is recommended before this ships publicly (D3 above is flagged for human judgment since jsdom cannot exercise the media query).

---
*Phase: 260710-lkn-component-lab*
*Completed: 2026-07-10*

## Self-Check: PASSED

All 12 claimed files found on disk; all 3 task commit hashes (6588b27, 697fb8b, 0da33f6) found in git log.
