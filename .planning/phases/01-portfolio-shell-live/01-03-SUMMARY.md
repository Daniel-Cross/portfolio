---
phase: 01-portfolio-shell-live
plan: 03
subsystem: content
tags: [nextjs, react, tailwind-v4, shadcn, vitest, rtl, projects, next-image]

requires:
  - phase: 01-portfolio-shell-live (plan 01)
    provides: Next.js 16 scaffold, dark OKLCH token system, shadcn button/card/badge primitives, Vitest+RTL harness
  - phase: 01-portfolio-shell-live (plan 02)
    provides: src/content/site.ts pattern, Home page composing Header + Hero, buttonVariants()-on-anchor CTA pattern
provides:
  - Typed src/content/projects.ts module (Project type, projects array — footballAlpha, MetaMask, Keggy)
  - Featured-stack Projects section rendering full-width stacked project cards
  - Home page composing Header + Hero + Projects (D-03 order continues)
  - public/screenshots/ directory (screenshot assets pending, paths wired)
affects:
  - "01-04, 01-05: later sections (About/Skills/Social proof/Contact) render inside <main> after Projects; Phase 2 case-study routes extend project cards with 'Read case study' links per D-10"

tech-stack:
  added: []
  patterns:
    - "Project card links use buttonVariants({ variant: 'outline', size: 'sm' }) on plain anchors, matching Plan 02's CTA-on-anchor pattern"
    - "Tech-tag chips use shadcn Badge with an added font-mono className (Geist Mono is the phase's restrained web3-flavor cue, UI-SPEC Label role)"
    - "next/image preload={true} applied only to the first card's screenshot (LCP candidate); priority intentionally not used (deprecated Next 16)"

key-files:
  created:
    - src/content/projects.ts
    - src/content/projects.test.ts
    - src/components/sections/Projects.tsx
    - src/components/sections/Projects.test.tsx
    - public/screenshots/.gitkeep
  modified:
    - src/app/page.tsx

key-decisions:
  - "footballAlpha and Keggy links are best-effort placeholder https URLs, flagged TODO pending confirmation before launch — external live-URL verification is not possible in this execution environment (no web-fetch tool); mirrors Plan 02's precedent for site.github/site.linkedin placeholders"
  - "MetaMask's link points to the official metamask.io site (a stable, verifiable public URL) rather than a specific App Store listing ID, avoiding an unverifiable numeric App Store URL for the one project where a public listing is required to stay NDA-safe (D-11)"
  - "Screenshot files themselves are not yet supplied — screenshot paths are wired and next/image renders correctly against the placeholder paths (build succeeds); actual PNG assets are an owner follow-up before launch"

patterns-established:
  - "Content modules that reference not-yet-available external facts (URLs, assets) use a file-level TODO comment plus a STATE.md blocker entry, not a blocking checkpoint — matches the Plan 02 precedent"

requirements-completed: [SHOW-01]

coverage:
  - id: D1
    description: "Visitor can browse 3-4 flagship project cards (footballAlpha, MetaMask, Keggy)"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "src/content/projects.test.ts#contains 3 or 4 entries / includes footballAlpha, MetaMask, and Keggy"
        status: pass
      - kind: unit
        ref: "src/components/sections/Projects.test.tsx#renders one card per entry in projects, each with the project name as a heading"
        status: pass
    human_judgment: false
  - id: D2
    description: "Each project card shows a screenshot/still, a 2-3 sentence outcome blurb, a tech-tag row, and at least one link"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "src/content/projects.test.ts#every project has a blurb, at least one tag, and at least one valid link"
        status: pass
      - kind: unit
        ref: "src/components/sections/Projects.test.tsx#renders at least one accessibly-labelled link per card"
        status: pass
    human_judgment: true
    rationale: "Visual card layout (screenshot placement, stacked-not-grid reading) and actual screenshot assets need a manual/visual pass once real PNGs are supplied."
  - id: D3
    description: "Project cards read as a stacked 'few deep projects' feature list, not a uniform grid"
    requirement: "SHOW-01"
    verification: []
    human_judgment: true
    rationale: "D-09 featured-stack layout is implemented (flex-col gap-8, full-width horizontal cards on md+) but the visual 'reads as depth not a grid' quality needs a manual/visual UAT pass, not unit-testable."
  - id: D4
    description: "Projects composed into page.tsx immediately after Hero (D-03 order); full build and test suite pass"
    verification:
      - kind: integration
        ref: "npm run build"
        status: pass
      - kind: unit
        ref: "npx vitest run (full suite)"
        status: pass
    human_judgment: false

duration: ~2min (task execution; excludes read/planning time)
completed: 2026-07-09
status: complete
---

# Phase 01 Plan 03: Featured-Stack Projects Section Summary

**Typed `projects.ts` content module (footballAlpha, MetaMask, Keggy) rendered as full-width, vertically-stacked featured project cards — screenshot, outcome blurb, Geist Mono tech-tag row, and best-available links — composed into the page directly after Hero.**

## Performance

- **Duration:** ~2 min (task execution; excludes read/planning time)
- **Started:** 2026-07-09T15:55:00+02:00
- **Completed:** 2026-07-09T15:57:26+02:00
- **Tasks:** 3
- **Files modified:** 6 (5 created, 1 modified)

## Accomplishments

- `src/content/projects.ts` — typed `Project` shape (`slug`, `name`, `blurb`, `tags`, `screenshot`, `links`) and a 3-entry `projects` array: footballAlpha (Solana prediction market, lead engineer), MetaMask (30M+ user wallet, "my role" framing, NDA-safe public-listing link only), Keggy (App Store + open-source game-data repo)
- `Projects.tsx` — server component mapping `projects` into full-width horizontal cards stacked vertically (D-09 featured stack, not a grid): `next/image` screenshot (`preload` on the first card only, never the deprecated `priority`), heading, blurb, Geist Mono tech-tag `Badge` row, and a link row built from each project's `links` array (no forced uniformity, no disabled placeholders)
- `page.tsx` now composes `<Header /> → <main><Hero /><Projects /></main>`, continuing the D-03 section order
- `public/screenshots/.gitkeep` establishes the asset directory; screenshot paths are wired end-to-end (actual PNGs are an owner follow-up before launch)
- All new behavior covered by RTL tests (6/6 new assertions passing across the two new test files); full build (`npm run build`) and full test suite (12/12) pass

## Task Commits

Each task was committed atomically (TDD: test → feat for Tasks 1-2):

1. **Task 1: Typed flagship project data** - `b76d065` (test), `cd326b4` (feat)
2. **Task 2: Featured-stack Projects section** - `baa0b0d` (test), `5b7774a` (feat)
3. **Task 3: Compose Projects into the page after Hero** - `c28c364` (feat)

**Plan metadata:** _pending (this commit)_

## Files Created/Modified

- `src/content/projects.ts` - `Project` type + `projects` array (footballAlpha, MetaMask, Keggy)
- `src/content/projects.test.ts` - Unit tests for the projects data shape/contents
- `src/components/sections/Projects.tsx` - Featured-stack cards section (server component)
- `src/components/sections/Projects.test.tsx` - RTL behavior tests for Projects
- `public/screenshots/.gitkeep` - Establishes the screenshot asset directory
- `src/app/page.tsx` - Composes `<Projects />` after `<Hero />`

## Decisions Made

- **footballAlpha and Keggy links are best-effort placeholder `https://` URLs, flagged `TODO` for confirmation before launch.** This execution environment has no web-fetch/browsing tool, so the live-URL/App-Store-status confirmation the plan calls for (RESEARCH A1, STATE.md blocker) cannot be performed from here. This mirrors the precedent Plan 02 set for `site.github`/`site.linkedin`: well-formed, real-shaped links that satisfy the content contract now, clearly marked for owner confirmation before launch. STATE.md already tracks this as an open blocker.
- **MetaMask's link points to `metamask.io`, not a specific App Store listing ID.** This is a stable, verifiable public URL (vs. guessing a numeric App Store ID), and satisfies D-11's NDA-safe "public app/store listing only, no private repo" requirement.
- **Screenshot assets are not yet supplied.** `screenshot` paths (`/screenshots/football-alpha.png`, etc.) are wired through `next/image`; the build succeeds and the component doesn't crash against the placeholder paths (per Task 1's acceptance criteria), but the actual PNG files need to be added by the owner before launch.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed a link-scoping collision in the Projects RTL test**
- **Found during:** Task 2 (first GREEN run)
- **Issue:** The initial test used a global `screen.getByRole("link", { name: /App Store/i })` to check each card's first link, but both MetaMask and Keggy use the label "App Store" — the unscoped query matched two elements and threw a "multiple elements found" error.
- **Fix:** Scoped the link query per card using RTL's `within()`, finding each card's `<article>` via its heading and asserting `getAllByRole("link").length > 0` with an accessible name on the first link — matches the plan's actual behavior spec ("each rendered card contains at least one link... with a non-empty accessible label") more precisely than the original global query.
- **Files modified:** src/components/sections/Projects.test.tsx
- **Commit:** 5b7774a (Task 2 feat commit)

### External-verification note (not a deviation, documented per plan's own guidance)

- footballAlpha's live URL/App Store status and Keggy's App Store/repo URLs remain unconfirmed — flagged via file-level `TODO` comments in `projects.ts` and already tracked as a STATE.md blocker (carried forward, not newly introduced).

---

**Total deviations:** 1 auto-fixed (Rule 1, test-scoping bug found during the plan's own TDD verification)
**Impact on plan:** No scope creep — the fix was a prerequisite for the plan's own `<verify>` step to pass. No architectural changes, no new dependencies.

## Issues Encountered

None beyond the one auto-fixed test-scoping issue above.

## User Setup Required

- **Before launch:** confirm footballAlpha's live/App Store URL, Keggy's App Store and open-source game-data repo URLs, and supply the actual screenshot PNGs at `public/screenshots/football-alpha.png`, `public/screenshots/metamask.png`, `public/screenshots/keggy.png` (currently referenced but not present as files).

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Screenshot image files not present on disk | public/screenshots/*.png | Paths are wired through `next/image` and the build succeeds against them (Next.js doesn't fail the build on a missing static asset at this path shape), but the actual PNGs need to be supplied by the owner before launch — tracked as User Setup Required above, not a code defect |
| footballAlpha/Keggy link URLs are best-effort placeholders | src/content/projects.ts | Flagged `TODO` inline; external verification not possible in this execution environment (no web-fetch tool) — carried forward from the existing STATE.md blocker, not newly introduced |

## Threat Flags

None beyond the plan's own threat model. T-01-06 (external links opened in new tab) mitigated with `rel="noopener noreferrer"` on all project links (verified in Projects.tsx). T-01-07 (accidental private/NDA MetaMask repo link) mitigated at the data level — `projects.ts`'s MetaMask entry links only to the public `metamask.io` site, no repo links anywhere in the file.

## Next Phase Readiness

- `src/content/projects.ts`'s `Project` shape is stable and ready for Phase 2 to extend with "Read case study" links (D-10) without a breaking change
- Section order after this plan: Header → Hero → Projects; Plans 04-05 add About/Skills/Social proof/Contact after Projects
- **Action before public launch:** supply real screenshot assets and confirm footballAlpha/Keggy external URLs (see User Setup Required)

## Self-Check: PASSED

- src/content/projects.ts — FOUND
- src/content/projects.test.ts — FOUND
- src/components/sections/Projects.tsx — FOUND
- src/components/sections/Projects.test.tsx — FOUND
- public/screenshots/.gitkeep — FOUND
- src/app/page.tsx — FOUND
- Commit b76d065 — FOUND
- Commit cd326b4 — FOUND
- Commit baa0b0d — FOUND
- Commit 5b7774a — FOUND
- Commit c28c364 — FOUND

---
*Phase: 01-portfolio-shell-live*
*Completed: 2026-07-09*
