---
phase: 01-portfolio-shell-live
plan: 02
subsystem: ui
tags: [nextjs, react, tailwind-v4, shadcn, vitest, rtl, hero, header]

requires:
  - phase: 01-portfolio-shell-live (plan 01)
    provides: Next.js 16 scaffold, dark OKLCH token system, shadcn button/card/badge primitives, Vitest+RTL harness
provides:
  - Typed src/content/site.ts identity/links module (name, role, hero copy, github/linkedin/email)
  - Sticky Header with anchor nav (About/Projects/Contact) + labelled GitHub icon link
  - Isolated client MobileNav toggle for narrow viewports
  - Above-the-fold Hero: display headline, numeric subhead, View work / Get in touch CTAs
  - Home page composing Header + Hero (D-03 section order start)
affects:
  - "01-03, 01-04, 01-05: later sections render inside <main> after Hero; Contact reuses src/content/site.ts"

tech-stack:
  added: []
  patterns:
    - "CTAs styled via buttonVariants() applied directly to <a> tags, not the base-ui Button render prop (avoids Base UI's non-native-button role='button' override stomping the anchor's implicit link role)"
    - "Brand/logo icons not in lucide-react (removed upstream) are hand-rolled as small local SVG components under src/components/icons/"
    - "RTL cleanup registered globally in vitest.setup.ts (afterEach(cleanup)) since vitest.config.ts doesn't set test.globals"

key-files:
  created:
    - src/content/site.ts
    - src/components/sections/Hero.tsx
    - src/components/sections/Hero.test.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/MobileNav.tsx
    - src/components/layout/Header.test.tsx
    - src/components/icons/github.tsx
  modified:
    - src/app/page.tsx
    - src/app/globals.css
    - vitest.setup.ts

key-decisions:
  - "GitHub CTA/icon uses buttonVariants()-styled plain anchors, not the base-ui Button render prop, to keep the native link role/semantics"
  - "GitHub brand mark is an inline Octicon SVG (lucide-react 1.23.0 ships no brand/logo icons)"
  - "site.github inferred from git config user.name (Daniel-Cross); site.linkedin uses a canonical placeholder — both flagged TODO pending confirmation"

patterns-established:
  - "Icon components not covered by lucide-react live in src/components/icons/"

requirements-completed: [IDENT-01, IDENT-04]

coverage:
  - id: D1
    description: "Hero renders name, senior React Native / Web3 role, and ex-MetaMask hook above the fold"
    requirement: "IDENT-01"
    verification:
      - kind: unit
        ref: "src/components/sections/Hero.test.tsx#renders name, role, and the ex-MetaMask hook above the fold"
        status: pass
    human_judgment: false
  - id: D2
    description: "Hero renders the concrete-numbers subhead (30M+, MetaMask)"
    requirement: "IDENT-01"
    verification:
      - kind: unit
        ref: "src/components/sections/Hero.test.tsx#renders the concrete-numbers subhead"
        status: pass
    human_judgment: false
  - id: D3
    description: "Hero renders primary 'View work' CTA to #projects and secondary 'Get in touch' CTA to #contact"
    verification:
      - kind: unit
        ref: "src/components/sections/Hero.test.tsx#renders a primary CTA to #projects and a secondary CTA to #contact"
        status: pass
    human_judgment: false
  - id: D4
    description: "Sticky header exposes a labelled GitHub link reachable from every page view"
    requirement: "IDENT-04"
    verification:
      - kind: unit
        ref: "src/components/layout/Header.test.tsx#renders a labelled GitHub link"
        status: pass
    human_judgment: false
  - id: D5
    description: "Header anchor nav links to #about, #projects, #contact"
    verification:
      - kind: unit
        ref: "src/components/layout/Header.test.tsx#renders anchor nav links to About, Projects, and Contact"
        status: pass
    human_judgment: false
  - id: D6
    description: "Mobile nav toggle is an isolated client component that still surfaces the same links on narrow viewports"
    verification: []
    human_judgment: true
    rationale: "Toggle open/close interaction and 375px layout were not exercised by an automated viewport/interaction test in this plan — needs a quick manual/visual pass."
  - id: D7
    description: "Home composes <Header /> then <main><Hero /></main>; full build and test suite pass"
    verification:
      - kind: integration
        ref: "npm run build"
        status: pass
      - kind: unit
        ref: "npx vitest run (full suite)"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-07-09
status: complete
---

# Phase 01 Plan 02: Header + Hero Above-the-Fold Identity Summary

**Sticky Header (anchor nav + GitHub link) and above-the-fold Hero (name, role, ex-MetaMask hook, numeric subhead, two CTAs) composed onto the home page, backed by a typed `src/content/site.ts` identity module.**

## Performance

- **Duration:** ~4 min (task execution; excludes read/planning time)
- **Started:** 2026-07-09T15:44:07+02:00
- **Completed:** 2026-07-09T15:47:31+02:00
- **Tasks:** 3
- **Files modified:** 10 (7 created, 3 modified)

## Accomplishments

- `src/content/site.ts` — single typed source of identity/links (`name`, `role`, `heroHook`, `heroSubhead`, `github`, `linkedin`, `email`) that Hero, Header, and later Contact all read from
- `Hero.tsx` — server component rendering the full above-the-fold payload: display headline (name + role + MetaMask hook, D-05 framing), verbatim numeric subhead (D-07), and two anchored CTAs (D-08)
- `Header.tsx` + `MobileNav.tsx` — sticky header with logo, About/Projects/Contact anchor nav, and a labelled GitHub icon link (44px tap target); mobile toggle isolated in its own client component so the rest of the header stays server-rendered
- `page.tsx` now composes `<Header />` then `<main id="top"><Hero /></main>`, establishing the start of the D-03 section order
- All new behavior covered by RTL tests (6/6 passing); full build (`npm run build`) and full test suite pass

## Task Commits

Each task was committed atomically (TDD: test → feat for Tasks 1–2):

1. **Task 1: Site identity data + Hero section** - `15ae093` (test), `321a584` (feat)
2. **Task 2: Sticky header with anchor nav + GitHub link** - `82b6168` (test), `cd5175d` (feat)
3. **Task 3: Compose Header + Hero into the page** - `dd442bb` (feat)

**Plan metadata:** _pending (this commit)_

## Files Created/Modified

- `src/content/site.ts` - Typed `site` object: identity + external links used by Hero/Header (and later Contact)
- `src/components/sections/Hero.tsx` - Above-the-fold identity section (server component)
- `src/components/sections/Hero.test.tsx` - RTL behavior tests for Hero
- `src/components/layout/Header.tsx` - Sticky header: logo, anchor nav, GitHub link (server component)
- `src/components/layout/MobileNav.tsx` - Client-only mobile menu toggle (`'use client'`)
- `src/components/layout/Header.test.tsx` - RTL behavior tests for Header
- `src/components/icons/github.tsx` - Inline Octicon GitHub mark (lucide-react has no brand icons)
- `src/app/page.tsx` - Composes `<Header />` + `<main><Hero /></main>`
- `src/app/globals.css` - Added `scroll-behavior: smooth` to `html` for same-page anchor nav (Task 2 action)
- `vitest.setup.ts` - Registered `afterEach(cleanup)` for RTL (was missing; see Deviations)

## Decisions Made

- **CTAs are `buttonVariants()`-styled `<a>` tags, not `Button` with a `render` prop.** Base UI's `useButton` forces `role="button"` onto any non-`<button>` element when `nativeButton={false}`, which would override the anchor's implicit link semantics for real navigation targets (`#projects`, `#contact`). Applying the shadcn button's exported `buttonVariants()` class function directly to plain anchors keeps native link a11y while still using the shadcn button visual system, as directed by the plan.
- **GitHub icon is a hand-rolled inline SVG (Octicon `mark-github`), not `lucide-react`'s `Github`.** The installed `lucide-react@1.23.0` ships no brand/logo icons (`Github` is `undefined` — confirmed via `require('lucide-react')`); this is an upstream lucide policy change, not a version pin issue. Added `src/components/icons/github.tsx` as the single source, imported by both `Header.tsx` and `MobileNav.tsx`.
- **`site.github`/`site.linkedin` are best-effort placeholders, flagged TODO.** `github: "https://github.com/Daniel-Cross"` is inferred from the local git config username; `linkedin` uses the canonical profile-URL shape. Both are real, well-formed `https://` links per the plan's fallback instruction, but need confirmation before launch.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `lucide-react` has no `Github` icon in the installed version**
- **Found during:** Task 2 (Header GitHub link)
- **Issue:** `import { Github } from "lucide-react"` resolved to `undefined`, causing a React "Element type is invalid" crash. Verified via `node -e "console.log(require('lucide-react').Github)"` → `undefined`; grepping all exports for `/git/i` confirms no brand mark exists in this version (lucide has removed brand/logo icons upstream).
- **Fix:** Added `src/components/icons/github.tsx` — a tiny inline SVG using the standard Octicon `mark-github` path (`fill="currentColor"`, sized via `className`), used identically to how a lucide icon would be. No new dependency added.
- **Files modified:** src/components/icons/github.tsx (new), src/components/layout/Header.tsx, src/components/layout/MobileNav.tsx
- **Verification:** `npx vitest run src/components/layout/Header.test.tsx` passes; `npm run build` exits 0
- **Committed in:** cd5175d (Task 2 feat commit)

**2. [Rule 3 - Blocking] RTL tests leaked DOM across cases within the same file**
- **Found during:** Task 1 (Hero.test.tsx — second and third tests failed with "multiple elements found" errors caused by an un-unmounted render from a prior test)
- **Issue:** `vitest.setup.ts` only imported `@testing-library/jest-dom/vitest` and never registered React Testing Library's automatic cleanup. RTL's auto-cleanup relies on detecting a global `afterEach` (via `test.globals: true` in Vitest config), which `vitest.config.ts` does not set — so cleanup silently never ran, and every `render()` within a test file accumulated in the same jsdom `document`.
- **Fix:** Added an explicit `afterEach(() => cleanup())` to `vitest.setup.ts`, importing `cleanup` from `@testing-library/react` and `afterEach` from `vitest`. This is the standard fix when `test.globals` is intentionally left off.
- **Files modified:** vitest.setup.ts
- **Verification:** `npx vitest run` (full suite) — all 3 Hero tests + all Header tests + smoke test pass independently
- **Committed in:** 321a584 (Task 1 feat commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking, both required to complete the plan's own TDD verification steps)
**Impact on plan:** No scope creep — both fixes were prerequisites for the plan's own `<verify>` commands to run at all. No architectural changes, no new dependencies.

## Issues Encountered

None beyond the two auto-fixed blocking issues above.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. `#about` and `#contact` anchor targets don't exist as sections yet (later waves 01-03 through 01-05 add them per the plan's own note), but this is explicitly scoped as expected, not a stub — the links themselves are correct and functional now.

## Threat Flags

None beyond the plan's own threat model (T-01-04 GitHub `target="_blank"` reverse-tabnabbing — mitigated with `rel="noopener noreferrer"` on both the desktop and mobile GitHub links, per plan).

## Next Phase Readiness

- `src/content/site.ts` is in place and ready for Plan 04 (Contact) to reuse `email`/`linkedin`/`github`
- Header/nav spine established; `#about`, `#projects`, `#contact` anchors will resolve once Plans 03–05 add those sections
- **Action before public launch:** confirm the real GitHub and LinkedIn profile URLs in `src/content/site.ts` (currently inferred/placeholder, marked with a `TODO` comment)

---
*Phase: 01-portfolio-shell-live*
*Completed: 2026-07-09*
