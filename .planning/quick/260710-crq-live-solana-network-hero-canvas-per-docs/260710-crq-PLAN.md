---
phase: 260710-crq-live-solana-network-canvas
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/solana-slots.ts
  - src/components/canvas/NetworkCanvas.tsx
  - src/components/canvas/SlotReadout.tsx
  - src/components/canvas/network-canvas.test.tsx
  - src/app/layout.tsx
  - src/components/sections/Hero.tsx
autonomous: false
requirements:
  - SPEC-2026-07-10-live-solana-network-canvas
user_setup: []

must_haves:
  truths:
    - "A drifting violet node constellation renders behind the hero, animated by real mainnet slots."
    - "Each incoming mainnet slot (~400 ms) fires a visible pulse; readout shows the current slot number, 'live', and 'Solana mainnet'."
    - "On socket failure the animation keeps running via a simulated heartbeat and the readout drops the slot number and 'live' label."
    - "With prefers-reduced-motion the constellation is static (no drift/pulses) while the readout still updates as text."
    - "If canvas/2D context is unavailable or setup throws, nothing extra renders — the page is exactly today's page."
  artifacts:
    - src/lib/solana-slots.ts
    - src/components/canvas/NetworkCanvas.tsx
    - src/components/canvas/SlotReadout.tsx
    - src/components/canvas/network-canvas.test.tsx
  key_links:
    - "One shared subscription (src/lib/solana-slots.ts) opens exactly one WebSocket and feeds BOTH the canvas pulses and the readout — never two sockets."
    - "layout.tsx mounts NetworkCanvas once behind all content (fixed, inset-0, -z-10, pointer-events-none, aria-hidden)."
    - "Hero.tsx renders SlotReadout, which reads {slot, live} from the same shared store."
---

<objective>
Implement the approved Live Solana Network Canvas design exactly: a full-viewport 2D
canvas backdrop of a drifting violet node constellation, pulsed by real Solana mainnet
slots over a raw WebSocket, with a hero-corner "live" readout that proves it. Graceful
fallback to a simulated heartbeat (readout drops the proof), reduced-motion static mode,
and zero-impact degradation when canvas is unsupported.

Purpose: Pull Phase 5's crypto-signature moment forward — a hiring manager sees a genuinely
live Solana signal within a second of landing, not a claim.
Output: 3 new files + 1 test file, plus small edits to layout.tsx and Hero.tsx. No new npm
dependencies (raw browser `WebSocket`, existing palette tokens only).
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@docs/superpowers/specs/2026-07-10-live-solana-network-canvas-design.md
@src/app/layout.tsx
@src/components/sections/Hero.tsx
@src/app/globals.css
@src/lib/utils.ts
@vitest.config.ts
@src/components/sections/Hero.test.tsx

Palette (from globals.css): `--primary` is Signal Violet (the ONLY accent — use for pulses).
Neutrals for base nodes/links: `--muted-foreground`, `--border`. Read them at runtime via
`getComputedStyle(document.documentElement).getPropertyValue(...)`; do NOT hardcode new colors.
Ponytail mode: minimum code that works — no speculative config, no extra abstractions.
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Shared slot store + SlotReadout (the live proof)</name>
  <files>src/lib/solana-slots.ts, src/components/canvas/SlotReadout.tsx, src/components/canvas/network-canvas.test.tsx</files>
  <behavior>
    - Given a mocked WebSocket that delivers a JSON-RPC slotNotification with slot 312345678,
      SlotReadout renders text containing "312,345,678", the word "live", and "Solana mainnet".
    - Given the mocked socket errors/closes (fallback path engaged, simulated heartbeat), the
      readout renders "Solana mainnet" but does NOT contain "live" and does NOT contain a
      grouped slot number.
    - getSlotSnapshot returns a referentially STABLE object while {slot, live} are unchanged
      (so useSyncExternalStore does not loop).
  </behavior>
  <action>
    Create `src/lib/solana-slots.ts`: a module-level singleton subscription store (no React,
    plain TS) that owns exactly one connection. Export `subscribe(listener)` (calls listener on
    every slot event AND every heartbeat tick; returns an unsubscribe fn), `getSnapshot()`
    returning a cached `{ slot: number | null, live: boolean }` recreated only when values
    change, and `getServerSnapshot()` returning a constant `{ slot: null, live: false }` for SSR.
    Reference-count subscribers: open the socket on 0→1, close on 1→0.

    Connection logic: guard `typeof WebSocket === "undefined"` (SSR / no support) → skip socket.
    Open `wss://api.mainnet-beta.solana.com`; on open send a JSON-RPC `slotSubscribe` request; on
    message defensively `JSON.parse`, ignore anything that is not a `slotNotification`, and read
    the slot from `params.result.slot`. Update state to `{ slot, live: true }` and notify.
    On `error` or `close`, retry the socket ONCE; if that also fails, start a `setInterval`
    heartbeat (~400 ms) that sets `{ slot: null, live: false }` and notifies each tick — the
    animation keeps ticking but the proof is dropped. Never fabricate a slot number when simulated.

    Create `src/components/canvas/SlotReadout.tsx` (`"use client"`): read state via
    `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`. Render a small mono caption
    in `text-muted-foreground` (use the `cn` helper + `font-mono`): a pulsing dot (an
    `animate-pulse` span, violet when live) followed by text. When `live` and `slot != null`:
    show the slot via `toLocaleString("en-US")`, then the word live, then Solana mainnet, joined
    by " · ". When simulated (not live): show only Solana mainnet (dot still pulses). Keep it a
    single inline element positioned by its parent (Hero) — no fixed positioning here.

    Create `src/components/canvas/network-canvas.test.tsx`: use `vi.stubGlobal` to install a
    controllable fake WebSocket and `vi.useFakeTimers()` for the heartbeat path; use
    `vi.resetModules()` + dynamic import between the two readout cases so the singleton starts
    clean (avoid adding a test-only reset export to production code). Assert the two readout
    behaviors above. (The canvas mount assertion is added in Task 2 — same file.)
  </action>
  <verify>
    <automated>npm test -- network-canvas</automated>
  </verify>
  <done>SlotReadout shows the formatted slot + "live" + "Solana mainnet" from a mocked socket message, and drops slot/"live" on the fallback path; both assertions pass.</done>
</task>

<task type="auto">
  <name>Task 2: NetworkCanvas + mount it in layout, wire SlotReadout into Hero</name>
  <files>src/components/canvas/NetworkCanvas.tsx, src/app/layout.tsx, src/components/sections/Hero.tsx, src/components/canvas/network-canvas.test.tsx</files>
  <action>
    Create `src/components/canvas/NetworkCanvas.tsx` (`"use client"`): a single `<canvas>` styled
    `fixed inset-0 -z-10 pointer-events-none` with `aria-hidden="true"` and `role` omitted. In a
    `useEffect`, get the 2D context; if `getContext("2d")` is null OR any setup throws, bail out and
    render nothing (page must be exactly today's page). Read `--primary` for pulses and a neutral
    (`--muted-foreground`/`--border`) for base nodes/links via `getComputedStyle`.

    Simulation (keep it minimal): ~60–90 nodes with position + slow velocity, drifting and wrapping
    at edges; draw faint links between near neighbours (distance threshold); O(n²) over ~75 nodes is
    fine. DPR-aware sizing on mount + `resize` (canvas backing store = clientSize × devicePixelRatio,
    scale the context). Run the draw via `requestAnimationFrame`; cancel and resume on
    `visibilitychange` (pause when `document.hidden`). Scroll-linked dim: on passive `scroll`, lerp
    the canvas element opacity from 1 at the top to ~0.35 once scrolled roughly one viewport past the
    hero.

    Pulses: subscribe to the shared store (`subscribe` from `src/lib/solana-slots.ts`); on each
    notification/heartbeat tick, enqueue a pulse targeting a random node — the node flashes violet and
    a ripple travels outward along its links, fading over ~1 s. This is the same store the readout
    uses, so there is only ever one WebSocket.

    prefers-reduced-motion (`matchMedia`): when reduced, draw the constellation ONCE (static, no rAF
    loop, no pulses); the readout still updates because the store keeps running independently.

    Edit `src/app/layout.tsx`: import and render `<NetworkCanvas />` inside `<body>` as the first
    child, before `{children}`. Because it is `-z-10` and the body background paints behind negative
    z-index children, the constellation is visible in transparent sections while opaque surfaces
    (header/footer/cards with `bg-card`) still cover it — leave those as-is.

    Edit `src/components/sections/Hero.tsx`: import and render `<SlotReadout />` in a hero corner
    (e.g. a small absolutely-or-margin positioned caption near the section). The Hero section stays
    transparent (add no background).

    Append to `src/components/canvas/network-canvas.test.tsx`: a case asserting `<NetworkCanvas />`
    mounts in jsdom without throwing (jsdom's `getContext("2d")` returns null, exercising the
    graceful "render nothing" path).
  </action>
  <verify>
    <automated>npm test -- network-canvas && npm run build</automated>
  </verify>
  <done>NetworkCanvas mounts without crashing in jsdom; production build succeeds with the canvas mounted in layout and SlotReadout in the hero; `git grep -c "new WebSocket" src` shows exactly one socket construction site (in src/lib/solana-slots.ts).</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Human-verify the live canvas by eye</name>
  <action>Pause execution and have the owner run the dev server and walk the verification steps below (visual density, pulses, scroll dim, fallback, reduced-motion). Do not proceed until the resume signal is given.</action>
  <what-built>Full live Solana network canvas: violet constellation behind the hero pulsed by real mainnet slots, a hero-corner "live" readout, scroll dim, reduced-motion static mode, and heartbeat fallback.</what-built>
  <how-to-verify>
    1. Run `npm run dev` and open the site.
    2. Hero: confirm a drifting violet node constellation is visible behind the text, faint links between nodes, and periodic violet pulses (~2–3 per second) as mainnet slots arrive.
    3. Corner readout: confirm it shows an increasing slot number with "· live · Solana mainnet" and a pulsing dot. The slot number should climb.
    4. Scroll down: the canvas should dim to roughly one-third opacity behind the content below the hero; all section text stays legible.
    5. Fallback: in DevTools, block `api.mainnet-beta.solana.com` (or go offline) and reload — the constellation should keep animating via heartbeat and the readout should show only "Solana mainnet" (no slot number, no "live").
    6. Reduced motion: enable "Reduce motion" in OS/browser settings and reload — the constellation should be static (no drift, no pulses) while the readout text still updates.
  </how-to-verify>
  <resume-signal>Type "approved" or describe what needs adjusting (density, speed, dim amount, readout placement).</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| client → Solana mainnet RPC (`wss://api.mainnet-beta.solana.com`) | Untrusted external WebSocket data crosses into the browser; public read-only, no key, no secrets. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-CRQ-01 | Tampering | slot-store message handler | low | mitigate | Defensive `JSON.parse` in try/catch; ignore any message that is not a `slotNotification` with a numeric `params.result.slot`; never render unvalidated payload as HTML (readout uses text nodes only). |
| T-CRQ-02 | Denial of Service | reconnect logic | medium | mitigate | Cap reconnection at exactly one retry per the locked spec, then fall to a bounded `setInterval` heartbeat — no unbounded reconnect storm against the public endpoint. |
| T-CRQ-03 | Information disclosure | WebSocket endpoint | low | accept | Endpoint is public mainnet RPC carrying only public slot numbers; no API key, wallet, or user data is sent or received. |
</threat_model>

<verification>
- `npm test -- network-canvas` passes (readout live/fallback behavior + canvas jsdom mount).
- `npm run build` succeeds (client-boundary correctness for layout + hero edits).
- Exactly one `new WebSocket(...)` in `src/` (single shared socket).
- No new entries in package.json dependencies (raw WebSocket only).
- Human-verify checkpoint approved for the visual (density, pulses, dim, fallback, reduced-motion).
</verification>

<success_criteria>
- Live constellation renders behind the hero and pulses on real mainnet slots.
- Hero-corner readout proves it's live (slot + "live" + "Solana mainnet"); drops the proof on fallback.
- prefers-reduced-motion yields a static constellation; canvas-unsupported yields today's exact page.
- One WebSocket feeds both canvas and readout; no new npm dependencies.
- Test file green; production build green; owner approves the visual.
</success_criteria>

<output>
Create `.planning/quick/260710-crq-live-solana-network-hero-canvas-per-docs/260710-crq-SUMMARY.md` when done.
</output>
