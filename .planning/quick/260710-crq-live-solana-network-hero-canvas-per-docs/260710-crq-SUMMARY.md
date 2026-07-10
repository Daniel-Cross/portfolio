---
phase: 260710-crq-live-solana-network-canvas
plan: 01
subsystem: ui
tags: [canvas, websocket, solana, react, useSyncExternalStore, vitest]

# Dependency graph
requires: []
provides:
  - Shared singleton Solana mainnet slot subscription (one WebSocket for the whole app)
  - SlotReadout live-proof caption in the hero corner
  - NetworkCanvas violet node-constellation backdrop pulsed by real mainnet slots
affects: [phase-05-crypto-signature]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Module-level singleton store (no React) exposed via subscribe/getSnapshot/getServerSnapshot, consumed through useSyncExternalStore — reference-counted so exactly one WebSocket serves multiple UI consumers"
    - "Canvas setup wrapped in try/catch inside useEffect; any failure (no 2D context, no WebSocket) degrades to rendering nothing extra rather than crashing the page"

key-files:
  created:
    - src/lib/solana-slots.ts
    - src/components/canvas/NetworkCanvas.tsx
    - src/components/canvas/SlotReadout.tsx
    - src/components/canvas/network-canvas.test.tsx
  modified:
    - src/app/layout.tsx
    - src/components/sections/Hero.tsx

key-decisions:
  - "Canvas component always renders the <canvas> DOM element (invisible, pointer-events-none, zero pixels drawn) rather than conditionally rendering null, so the jsdom mount test and the try/catch bail-out share one simple code path"
  - "NetworkCanvas skips subscribing to the shared slot store entirely under prefers-reduced-motion, since it draws once and never needs pulse ticks; SlotReadout still subscribes independently so the readout text keeps updating"

patterns-established:
  - "Pattern: shared external store singleton for cross-component real-time state (subscribe/getSnapshot/getServerSnapshot triplet consumed via useSyncExternalStore)"

requirements-completed: []  # SPEC-2026-07-10-live-solana-network-canvas: implementation (Tasks 1-2) complete; Task 3 human-verify checkpoint is pending — see Next Steps

coverage:
  - id: D1
    description: "Shared slot store: one WebSocket subscription feeds both canvas pulses and the hero readout; retries once on failure then falls back to a simulated heartbeat without fabricating a slot number"
    requirement: "SPEC-2026-07-10-live-solana-network-canvas"
    verification:
      - kind: unit
        ref: "src/components/canvas/network-canvas.test.tsx#SlotReadout > shows the formatted slot, 'live', and 'Solana mainnet' from a mocked socket message"
        status: pass
      - kind: unit
        ref: "src/components/canvas/network-canvas.test.tsx#SlotReadout > drops the slot number and 'live' when the socket fails twice and falls back to a heartbeat"
        status: pass
    human_judgment: false
  - id: D2
    description: "NetworkCanvas mounts safely when 2D context/WebSocket is unavailable, degrading to exactly today's page with no visible extra output"
    requirement: "SPEC-2026-07-10-live-solana-network-canvas"
    verification:
      - kind: unit
        ref: "src/components/canvas/network-canvas.test.tsx#NetworkCanvas > mounts without throwing when 2D context is unavailable (jsdom)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Visual/UX verification of the live constellation, pulses, scroll dim, fallback, and reduced-motion behavior in a real browser"
    verification: []
    human_judgment: true
    rationale: "Requires eyeballing animation density/speed, scroll-linked opacity, and simulated network failure/reduced-motion states in a live browser — not observable from a jsdom unit test."

# Metrics
duration: ~20min
completed: 2026-07-10
status: complete
---

# Quick Task 260710-crq: Live Solana Network Canvas Summary

**Full-viewport 2D canvas backdrop of a drifting violet node constellation, pulsed by real Solana mainnet slots over a single shared raw WebSocket, plus a hero-corner "live" readout that proves it — no new npm dependencies.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-10
- **Tasks:** 2 of 3 completed (Task 3 is a `checkpoint:human-verify` — deliberately not attempted, see Next Steps)
- **Files modified:** 6 (4 created, 2 edited)

## Accomplishments

- `src/lib/solana-slots.ts` — plain-TS singleton subscription store: opens `wss://api.mainnet-beta.solana.com`, sends `slotSubscribe`, defensively parses `slotNotification` messages, retries the socket once on error/close, then falls back to a `setInterval` heartbeat (~400ms) that keeps notifying subscribers without ever fabricating a slot number. Reference-counted: the socket opens on the first subscriber and closes when the last unsubscribes.
- `src/components/canvas/SlotReadout.tsx` — `useSyncExternalStore`-driven caption (mono, `text-muted-foreground`, pulsing dot) that shows `{slot} · live · Solana mainnet` when live, or just `Solana mainnet` on the fallback path.
- `src/components/canvas/NetworkCanvas.tsx` — fixed, full-viewport, `-z-10`, `pointer-events-none`, `aria-hidden` canvas: ~75 drifting nodes with faint near-neighbour links, DPR-aware sizing + resize handling, `visibilitychange` pause, scroll-linked opacity dim (1 → 0.35 over one viewport height), `prefers-reduced-motion` static single-frame mode (no rAF loop, no pulse subscription), and violet ripple/flash pulses driven by the shared slot store. Wrapped in try/catch — any setup failure (no 2D context, thrown error) bails out silently so the page is exactly today's page.
- Mounted `NetworkCanvas` as the first child of `<body>` in `src/app/layout.tsx`; wired `SlotReadout` into a `relative`/`absolute` corner of `src/components/sections/Hero.tsx` (hero stays transparent, no background added).
- `src/components/canvas/network-canvas.test.tsx` — 3 vitest cases: live-slot readout text via a mocked `WebSocket`, fallback readout text after two forced socket failures + heartbeat tick, and a jsdom mount-without-throwing check for `NetworkCanvas` (jsdom's `getContext("2d")` returns `null`, exercising the bail-out path).

## Task Commits

Each task was committed atomically:

1. **Task 1: Shared slot store + SlotReadout (the live proof)** - `ebb336a` (feat)
2. **Task 2: NetworkCanvas + mount it in layout, wire SlotReadout into Hero** - `192a26e` (feat)

**Plan metadata:** not yet committed — orchestrator handles the docs commit for this quick task (SUMMARY.md, materialized PLAN.md/spec are intentionally left uncommitted per execution constraints).

_Note: Task 3 (`checkpoint:human-verify`) was intentionally not attempted per execution constraints — see Next Steps._

## Files Created/Modified

- `src/lib/solana-slots.ts` - Singleton WebSocket subscription store (subscribe/getSnapshot/getServerSnapshot)
- `src/components/canvas/SlotReadout.tsx` - Hero-corner live-proof caption
- `src/components/canvas/NetworkCanvas.tsx` - Full-viewport pulsing node-constellation canvas
- `src/components/canvas/network-canvas.test.tsx` - Readout live/fallback tests + canvas jsdom mount test
- `src/app/layout.tsx` - Mounts `NetworkCanvas` behind all content
- `src/components/sections/Hero.tsx` - Renders `SlotReadout` in the hero corner

## Decisions Made

- Rebound `canvas`/`ctx` to explicitly-typed `el`/`ctx` consts right after the null checks in `NetworkCanvas.tsx`'s effect, since TypeScript does not preserve null-narrowing of `useRef` values across nested closures (`resize`, `step`, `drawFrame`, `onScroll`) — avoids sprinkling non-null assertions throughout.
- Base nodes are drawn before pulses in each frame (not after) so the neutral fill of the full node set never repaints over a pulsing node's violet flash.
- Kept the color palette runtime-derived from CSS custom properties (`getComputedStyle(document.documentElement)`) exactly as the plan specified — `--primary` for pulses, `--muted-foreground`/`--border` for base nodes/links — no hardcoded colors.

## Deviations from Plan

None - plan executed exactly as written for Tasks 1-2.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. The WebSocket endpoint (`wss://api.mainnet-beta.solana.com`) is public read-only mainnet RPC; no API key or secret needed.

## Verification Evidence

- `npx vitest run network-canvas` — 3/3 tests pass (readout live path, readout fallback path, canvas jsdom mount).
- `npx vitest run` (full suite) — 23/23 tests pass, no regressions in existing Hero/About/Contact/Projects tests.
- `npx tsc --noEmit` — clean, zero errors.
- `npx next build` — production build succeeds (Turbopack), static pages generated, no new routes.
- `grep -rn "new WebSocket" src` (excluding test files) — exactly one construction site, in `src/lib/solana-slots.ts`. Confirms the single-shared-socket requirement.
- `git diff --stat package.json package-lock.json` — empty; no new npm dependencies added.

## Next Steps

**Task 3 — `checkpoint:human-verify` (pending, not attempted by this execution):**

The plan's Task 3 requires the owner to run `npm run dev`, open the site, and visually verify:
1. Hero: drifting violet node constellation visible behind the text with periodic pulses (~2-3/sec) as mainnet slots arrive.
2. Corner readout: increasing slot number with "· live · Solana mainnet" and a pulsing dot.
3. Scroll dim: canvas dims to ~1/3 opacity below the hero; section text stays legible.
4. Fallback: blocking `api.mainnet-beta.solana.com` (or offline) keeps the constellation animating via heartbeat while the readout drops to "Solana mainnet" only.
5. Reduced motion: OS/browser "Reduce motion" yields a static constellation while the readout text still updates.

This checkpoint requires a live browser and cannot be automated from this execution context. Resume signal per the plan: "approved" or a description of what needs adjusting (density, speed, dim amount, readout placement).

## Next Phase Readiness

Implementation is code-complete and passes all automated verification (tests, typecheck, build, single-socket grep, no new dependencies). Owner sign-off on Task 3's visual checkpoint is the only remaining gate before this quick task can be considered fully done.

---
*Quick task: 260710-crq-live-solana-network-hero-canvas-per-docs*
*Completed (implementation): 2026-07-10*

## Self-Check: PASSED

All 6 created/modified source files and the SUMMARY.md itself confirmed present on disk. Both task commits (`ebb336a`, `192a26e`) confirmed present in git log.
