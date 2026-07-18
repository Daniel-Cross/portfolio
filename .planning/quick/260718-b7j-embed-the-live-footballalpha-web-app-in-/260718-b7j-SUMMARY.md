---
phase: 260718-b7j
plan: 01
subsystem: projects-section
tags: [live-embed, iframe, football-alpha]
dependency-graph:
  requires: []
  provides:
    - src/components/ui/live-app-frame.tsx
  affects:
    - src/components/sections/Projects.tsx
    - src/content/projects.ts
tech-stack:
  added: []
  patterns:
    - "Hand-rolled CSS iPhone bezel wrapping a live cross-origin iframe (390x844 aspect-ratio, no sandbox attribute)"
key-files:
  created:
    - src/components/ui/live-app-frame.tsx
    - src/components/ui/live-app-frame.test.tsx
  modified:
    - src/components/sections/Projects.tsx
    - src/content/projects.ts
decisions:
  - "footballAlpha card is special-cased by slug (project.slug === 'football-alpha') rather than a generic liveUrl content field, per ponytail scope constraint"
  - "Link URL corrected to https://www.footballalpha.org (was https://footballalpha.org) and label changed to 'Open full app'"
metrics:
  duration: 12min
  completed: 2026-07-18
status: complete
---

# Phase 260718-b7j Plan 01: Embed the live footballAlpha web app Summary

Hand-rolled iPhone-bezel iframe embedding the live www.footballalpha.org app directly inside the footballAlpha project card, replacing the static placeholder screenshot, with an "Open full app" link and a wallet-connect caveat underneath.

## What Was Built

- `LiveAppFrame` component (`src/components/ui/live-app-frame.tsx`): renders a 390x844 aspect-ratio bezel (reusing `phone-frame.tsx`'s bezel classes and dynamic-island cutout) containing a lazy-loaded, unsandboxed iframe pointed at a live URL, a caveat note about wallet browser extensions not injecting into embeds, and a row of outline-button links.
- `Projects.tsx`: the footballAlpha card now renders `LiveAppFrame` in place of `PhoneFrame`, with the card's own duplicate links row suppressed for that one card (links render once, inside the frame).
- `projects.ts`: the football-alpha entry's link corrected to `https://www.footballalpha.org` with the label "Open full app".

## Deviations from Plan

### Auto-fixed Issues

None - plan executed exactly as written.

### Out-of-Scope (not fixed, per scope boundary rule)

- `npm run lint` reports a pre-existing `react-hooks/set-state-in-effect` error in `src/components/lab/consensus-dial.tsx` (last touched in commit `81331ca`, unrelated to this task's files). Left untouched. `npx eslint` scoped to this task's four files passes clean.
- Pre-existing failing test `src/content/projects.test.ts` (name assertion mismatch "footballAlpha" vs "Football Alpha") was explicitly out of scope per plan constraints and left untouched.

## Verification

- `npx vitest run src/components/ui/live-app-frame.test.tsx src/components/sections/Projects.test.tsx`: 2 files, 6 tests passed.
- `npx eslint` on the four task files: clean, no errors.
- Manual: ran `npm run dev`, curled the rendered Projects section HTML and confirmed one `<iframe>` targeting footballalpha.org, the caveat note text, and the "Open full app" link with the correct href are all present.

## TDD Gate Compliance

- RED: commit `97e2183` (`test(260718-b7j): add failing test for LiveAppFrame`) - test file created, import failed as expected (component didn't exist yet).
- GREEN: commit `0aa7d42` (`feat(260718-b7j): implement LiveAppFrame live iframe bezel`) - all 3 tests passed.
- Task 2 wiring: commit `944a598` (`feat(260718-b7j): wire LiveAppFrame into footballAlpha project card`).

## Self-Check: PASSED

- FOUND: src/components/ui/live-app-frame.tsx
- FOUND: src/components/ui/live-app-frame.test.tsx
- FOUND commit 97e2183
- FOUND commit 0aa7d42
- FOUND commit 944a598
