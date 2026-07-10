# Live Solana Network Canvas — Design

**Date:** 2026-07-10
**Status:** Approved (user: "lets do it and i will give feedback after")
**Scope note:** Pulls Phase 5's "crypto signature" forward. Independent of Phases 2–4.

## Goal

An impressive crypto-native hero visual: a full-page canvas backdrop — a drifting
node constellation in the site's violet palette — animated by **real Solana mainnet
slots**. Most prominent in the hero; dims behind content on scroll. A subtle corner
readout proves it's live.

## Components

| File | Role |
|------|------|
| `src/components/canvas/NetworkCanvas.tsx` (new, `"use client"`) | Fixed full-viewport `<canvas>` (`inset-0`, `-z-10`, `pointer-events-none`, `aria-hidden`). Owns rAF loop, node simulation, WebSocket subscription, scroll dim. |
| `src/components/canvas/SlotReadout.tsx` (new, `"use client"`) | Hero-corner caption: pulsing dot + `slot 3xx,xxx,xxx · live · Solana mainnet`. Mono font, `text-muted-foreground`. Hides slot/"live" when data is simulated. |
| `src/app/layout.tsx` (edit) | Mount `NetworkCanvas` once behind all content. |
| `src/components/sections/Hero.tsx` (edit) | Add `SlotReadout`. Hero stays transparent. |
| Section backgrounds (edit as needed) | Ensure legibility over the canvas below the fold. |

## Visual behavior

- ~60–90 nodes, slow drift, faint links to near neighbours. Palette: existing
  neutrals + Signal Violet (`--primary`). Nothing new.
- Each mainnet slot (~400 ms) fires a pulse: a random node flashes violet, ripple
  travels its links, fades in ~1 s.
- Scroll-linked dim: canvas opacity eases to ~35 % below the hero.
- DPR-aware sizing; pause on `visibilitychange`.

## Data flow

Raw `WebSocket` → `wss://api.mainnet-beta.solana.com`, JSON-RPC `slotSubscribe`.
No `@solana/web3.js`, no API key. Notifications update readout + enqueue pulses.

**Fallback:** on failure/close, retry once, then simulate a ~400 ms heartbeat —
animation identical, but readout drops slot number and "live" label. Never fake
the proof.

## Error handling / accessibility

- `prefers-reduced-motion`: static constellation, no drift/pulses; readout still
  updates (text only).
- No canvas/WS support or thrown error → component renders nothing; page is
  exactly today's page.
- Canvas `aria-hidden`; readout is real text.

## Testing

One vitest file: readout shows slot from mocked socket message; hides "live" on
fallback; canvas mounts without crashing in jsdom. Visuals verified by eye.
