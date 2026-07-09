---
phase: 01-portfolio-shell-live
plan: 01
subsystem: scaffold
tags: [nextjs, tailwind-v4, shadcn, vitest, design-tokens, security-headers]
requires: []
provides:
  - Booting Next.js 16 App Router repo (Turbopack default, TypeScript ^5)
  - Dark-only OKLCH @theme token system (background/surface/accent/destructive/foreground/muted)
  - shadcn/ui primitives (button, card, badge) + cn() helper
  - Vitest 4 + Testing Library + jsdom harness with passing smoke test
  - Security response headers (nosniff, referrer-policy, X-Frame-Options DENY)
affects:
  - All later Phase 1 plans (02-05) render through this layout/token system
tech-stack:
  added:
    - next@16.2.10, react@19.2.4, typescript@^5 (resolves 5.x)
    - tailwindcss@^4 + @tailwindcss/postcss
    - shadcn CLI 4.13.0 (devDep), @base-ui/react, cva, clsx, tailwind-merge, tw-animate-css, lucide-react
    - vitest@^4.1.10, @testing-library/react, @testing-library/jest-dom, jsdom, @vitejs/plugin-react@^5
  patterns:
    - Server components by default; no 'use client' at layout/page level
    - Dark-only theme; :root and .dark share identical token values (no light flash)
    - Content tokens centralized in globals.css @theme (SITE-02 ≤3-accent budget)
key-files:
  created:
    - package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs, components.json
    - vitest.config.ts, vitest.setup.ts, src/app/__smoke__.test.tsx
    - src/app/layout.tsx, src/app/page.tsx, src/app/globals.css
    - src/lib/utils.ts, src/components/ui/{button,card,badge}.tsx
  modified: []
decisions:
  - "Pinned @vitejs/plugin-react to ^5 — v6 optionally peers on @babel/core@8, conflicting with shadcn/eslint-config-next Babel 7 tree"
  - "shadcn moved to devDependencies — CLI-only, no runtime imports in src/"
  - "shadcn init used base-nova preset (CLI 4.13 has no --base-color flag); generated components use @base-ui/react primitives; all preset tokens overwritten with UI-SPEC dark OKLCH values"
  - ":root carries the dark tokens directly (not only .dark) so a light-mode flash is structurally impossible"
  - "shadcn primary + accent + ring all map to Signal Violet — one active accent color total (SITE-02)"
metrics:
  duration: ~8 min execution (plus blocking package-legitimacy checkpoint)
  completed: 2026-07-09
status: complete
---

# Phase 01 Plan 01: Walking-Skeleton Scaffold Summary

**One-liner:** Next.js 16 + Tailwind v4 + shadcn/ui scaffold with dark-only OKLCH Signal-Violet token system, Geist fonts, security headers, and a green Vitest smoke harness.

## What Was Built

- **Task 1 (checkpoint):** Blocking package-legitimacy gate presented and approved by the developer before any install (next, typescript ^5, tailwindcss/@tailwindcss/postcss, shadcn CLI, lucide-react — all confirmed official, no typosquats).
- **Task 2 (`d0960b6`):** Scaffolded via `create-next-app@latest` (TypeScript, Tailwind, App Router, src/ dir, ESLint flat config, `@/*` alias, no custom webpack). shadcn/ui initialized and button/card/badge copied in with `cn()` helper. Vitest 4 + Testing Library + jsdom harness installed; `vitest.config.ts` (jsdom env, React plugin, `@` alias), `vitest.setup.ts`, and a passing smoke test at `src/app/__smoke__.test.tsx`; `"test": "vitest run"` script added. `typescript` is `^5` as research predicted (not the 7.x tsgo line). No out-of-scope deps (no motion, next-themes, @solana/*, react-native-web, MDX).
- **Task 3 (`14ea085`):** `globals.css` `@theme`/token block rewritten to the UI-SPEC dark palette — background `oklch(0.16 0.01 260)`, surface `oklch(0.22 0.012 260)`, Signal Violet `oklch(0.62 0.19 293)` (primary/accent/ring), reserved destructive `oklch(0.58 0.245 27)`, foreground `oklch(0.96 0.002 260)`, muted `oklch(0.65 0.01 260)`. `layout.tsx` sets `<html lang="en" className="dark">`, Geist Sans/Mono via `next/font`, real site metadata (ex-MetaMask + Solana). `page.tsx` reduced to a minimal dark `<main>` shell. `next.config.ts` serves `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` on all routes.

## Verification Results

- `npm run build` exits 0 (Turbopack, static prerender of `/`)
- `npx vitest run` — 1/1 tests pass
- `npx eslint .` exits 0
- `grep -c "@theme" src/app/globals.css` = 1; 18 `oklch(` values
- Runtime check against `next start`: all three security headers present in the response; served HTML contains `class="dark"`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pinned `@vitejs/plugin-react` to `^5`**
- **Found during:** Task 2 (Vitest harness install)
- **Issue:** `@vitejs/plugin-react@6` optionally peers on `@babel/core@^8`, which conflicts with the Babel 7 tree required by `shadcn` and `eslint-config-next` — npm install failed with ERESOLVE.
- **Fix:** Installed `@vitejs/plugin-react@^5` (fully compatible with Vitest 4); no `--legacy-peer-deps` used.
- **Files modified:** package.json, package-lock.json
- **Commit:** d0960b6

**2. [Rule 2 - Correctness] Moved `shadcn` to devDependencies**
- **Found during:** Task 2 (post shadcn init)
- **Issue:** `shadcn init` added itself as a runtime dependency; research and plan classify it as CLI-only (no `src/` imports reference it — verified by grep).
- **Fix:** `npm install -D shadcn`.
- **Commit:** d0960b6

### Notes (not deviations)

- shadcn CLI 4.13 no longer offers a `--base-color` flag; init used the default base-nova preset (Base UI primitives instead of Radix). Harmless — the plan explicitly says the preset tokens are overwritten in Task 3, which they were. `components.json` records `baseColor: neutral`.
- `create-next-app` refused-conflict risk with the pre-existing `.planning/`/`.claude/` dirs was avoided by scaffolding in a scratch dir and copying files in; scaffold-generated root `CLAUDE.md`/`AGENTS.md` boilerplate was intentionally not copied (project instructions live in `.claude/CLAUDE.md`).

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Empty `<main>` shell | src/app/page.tsx | Intentional per plan Task 3 ("later waves add Header + section children") — filled by plans 01-02 through 01-05 |

## Threat Flags

None — no new security surface beyond the plan's threat model. T-01-SC mitigated via the approved blocking checkpoint; T-01-01/02/03 mitigated via the three response headers (runtime-verified).

## Self-Check: PASSED

- src/app/globals.css — FOUND
- src/app/layout.tsx — FOUND
- src/app/page.tsx — FOUND
- next.config.ts — FOUND
- vitest.config.ts / vitest.setup.ts / src/app/__smoke__.test.tsx — FOUND
- src/lib/utils.ts + src/components/ui/{button,card,badge}.tsx — FOUND
- Commit d0960b6 — FOUND
- Commit 14ea085 — FOUND
