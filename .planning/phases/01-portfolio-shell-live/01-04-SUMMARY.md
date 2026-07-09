---
phase: 01-portfolio-shell-live
plan: 04
subsystem: content
tags: [nextjs, react, tailwind-v4, shadcn, vitest, rtl, about, skills, contact, clipboard]

requires:
  - phase: 01-portfolio-shell-live (plan 01)
    provides: Next.js 16 scaffold, dark OKLCH token system, shadcn button/badge primitives, Vitest+RTL harness
  - phase: 01-portfolio-shell-live (plan 02)
    provides: src/content/site.ts identity module, buttonVariants()-on-anchor CTA pattern
  - phase: 01-portfolio-shell-live (plan 03)
    provides: Home page composing Header + Hero + Projects, section/card layout conventions
provides:
  - Typed src/content/employers.ts, src/content/skills.ts, src/content/social-proof.ts modules
  - About, Skills, SocialProof, Contact sections and a Footer, composed into the page
  - Complete single-page shell in D-03 order (Hero -> Projects -> About -> Skills -> Social proof -> Contact -> Footer)
affects:
  - "Phase 2: Contact remains the closing conversion endpoint; case-study routes will link back into this same page"

tech-stack:
  added: []
  patterns:
    - "Client-side click-to-copy (CopyEmailButton) isolated as the only new 'use client' boundary in this plan; feature-detected navigator.clipboard with silent-fail, mailto anchor always rendered alongside as guaranteed fallback"
    - "Section content modules (employers/skills/social-proof) mirror the src/content/site.ts and src/content/projects.ts typed-array shape"
    - "RTL queries scoped with within(list) when a shared substring (e.g. 'MetaMask') appears in both prose and list data, avoiding getByText ambiguity"

key-files:
  created:
    - src/content/employers.ts
    - src/content/skills.ts
    - src/content/social-proof.ts
    - src/components/sections/About.tsx
    - src/components/sections/About.test.tsx
    - src/components/sections/Skills.tsx
    - src/components/sections/SocialProof.tsx
    - src/components/sections/Contact.tsx
    - src/components/sections/Contact.test.tsx
    - src/components/sections/CopyEmailButton.tsx
    - src/components/layout/Footer.tsx
  modified:
    - src/app/page.tsx

key-decisions:
  - "Employers ordered reverse-chronologically (current role first): The App Forge AB, MetaMask, Hackberry, Yomento, BookingGo — sourced from PROJECT.md career context, no invented job titles for BookingGo (role left blank, honest-content constraint)"
  - "Skills grouped into 4 areas (Web3/Solana, React Native/Mobile, Frontend/Web, AI/Tooling) using only the skill names PROJECT.md lists — no percentage/proficiency field anywhere in the SkillGroup type"
  - "Evo Nordics podcast episode URL not sourced (no web-fetch tool in this execution environment) — social-proof item left as unlinked text, flagged TODO; Football Ramble/Keggy item reuses the same App Store placeholder URL already flagged in projects.ts"
  - "Email affordance split into two adjacent controls: CopyEmailButton (a <button>, not a link) shows the visible email text and swaps to 'Copied!' on click; a separate small icon-only mailto <a> (lucide Mail icon, aria-label carries the email) sits beside it as the always-present, never-replaced fallback per D-15"
  - "LinkedIn/GitHub in Contact are buttonVariants()-styled anchors (text labels, not icons) to keep Contact's 'big links' distinct from Header's icon-only GitHub link; Footer repeats all three as small plain-text links"

patterns-established: []

requirements-completed: [IDENT-02, IDENT-03, CONV-01]

coverage:
  - id: D1
    description: "About/experience section names MetaMask, The App Forge (AB), Hackberry, Yomento, and BookingGo"
    requirement: "IDENT-02"
    verification:
      - kind: unit
        ref: "src/components/sections/About.test.tsx#employers includes MetaMask, The App Forge, Hackberry, Yomento, and BookingGo"
        status: pass
      - kind: unit
        ref: "src/components/sections/About.test.tsx#About > renders all five employer names and has id=about"
        status: pass
    human_judgment: false
  - id: D2
    description: "Skills section is a plain grouped list with no percentage/proficiency bars"
    requirement: "IDENT-04"
    verification:
      - kind: unit
        ref: "src/components/sections/About.test.tsx#skillGroups has at least two groups, each with a label and a non-empty skills list"
        status: pass
      - kind: manual
        ref: "grep -c 'width:|percent|proficiency' src/content/skills.ts src/components/sections/Skills.tsx returns 0"
        status: pass
    human_judgment: false
  - id: D3
    description: "Compact social-proof row present (ex-MetaMask, Evo Nordics podcast, Football Ramble/App Store)"
    requirement: "IDENT-03"
    verification:
      - kind: unit
        ref: "src/components/sections/About.test.tsx#socialProof includes items referencing ex-MetaMask, Evo Nordics, and Football Ramble / App Store"
        status: pass
    human_judgment: true
    rationale: "Compact single-row wrapping layout (visual density, not overflow into a second visual block on common viewports) needs a quick manual/visual pass — not unit-testable."
  - id: D4
    description: "Contact renders a mailto link (always present) plus dual-path availability lines verbatim and LinkedIn/GitHub links"
    requirement: "CONV-01"
    verification:
      - kind: unit
        ref: "src/components/sections/Contact.test.tsx#renders a mailto:hello@danielcross.dev link (always present)"
        status: pass
      - kind: unit
        ref: "src/components/sections/Contact.test.tsx#renders both dual-path availability lines verbatim"
        status: pass
      - kind: unit
        ref: "src/components/sections/Contact.test.tsx#renders a LinkedIn link and a GitHub link"
        status: pass
    human_judgment: false
  - id: D5
    description: "CopyEmailButton is a client component using navigator.clipboard with a silent-fail fallback"
    verification:
      - kind: manual
        ref: "grep 'use client' and 'navigator.clipboard' in src/components/sections/CopyEmailButton.tsx"
        status: pass
    human_judgment: true
    rationale: "Clipboard write success + 2s label revert timing is a runtime browser behavior not exercised by jsdom in this plan's automated tests — needs a quick manual click-through."
  - id: D6
    description: "Full page composed in D-03 order (Hero -> Projects -> About -> Skills -> Social proof -> Contact) with Footer after main; full build and test suite pass"
    verification:
      - kind: integration
        ref: "npm run build"
        status: pass
      - kind: unit
        ref: "npx vitest run (full suite, 7 files / 19 tests)"
        status: pass
    human_judgment: false

duration: ~4min (task execution; excludes read/planning time)
completed: 2026-07-09
status: complete
---

# Phase 01 Plan 04: About/Skills/Social-Proof Narrative + Contact Conversion Endpoint Summary

**Employer/skills/social-proof content modules and their sections, plus a full closing Contact section (dual-path availability, click-to-copy email with mailto fallback, LinkedIn/GitHub) and a small Footer — completing the D-03 single-page shell end to end.**

## Performance

- **Duration:** ~4 min (task execution; excludes read/planning time)
- **Started:** 2026-07-09T16:03:07+02:00
- **Completed:** 2026-07-09T16:07:20+02:00
- **Tasks:** 3
- **Files modified:** 12 (11 created, 1 modified)

## Accomplishments

- `src/content/employers.ts`, `src/content/skills.ts`, `src/content/social-proof.ts` — three typed content modules mirroring the established `site.ts`/`projects.ts` shape; employers cover all five real employers (IDENT-02), skills are a bar-free grouped list (IDENT-04), social proof covers ex-MetaMask, Evo Nordics, and Football Ramble/Keggy (IDENT-03)
- `About.tsx`, `Skills.tsx`, `SocialProof.tsx` — three server components (`id="about"`, `id="skills"`, `id="social-proof"`) mapping over the new content data, no hardcoded copy for the repeatable lists
- `Contact.tsx` + `CopyEmailButton.tsx` — the page's conversion endpoint (D-14): verbatim dual-path availability lines, a click-to-copy email button that swaps its own label to "Copied!" for 2s, and an always-present small mailto icon-link beside it as the guaranteed fallback (D-15); LinkedIn and GitHub rendered as big CTA-styled links
- `Footer.tsx` — small repeat links (email, LinkedIn, GitHub) beneath Contact
- `page.tsx` now composes the complete D-03 section order: Header → Hero → Projects → About → Skills → SocialProof → Contact → Footer
- All new behavior covered by RTL/unit tests (7 new assertions across two test files); full build (`npm run build`) and full test suite (7 files, 19 tests) pass; `npx eslint .` clean

## Task Commits

Each task was committed atomically (TDD: test → feat for Tasks 1 and 3):

1. **Task 1: Employer, skills, social-proof content data** - `13e751a` (test), `8f9f412` (feat)
2. **Task 2: About, Skills, and Social Proof sections** - `ffe6418` (feat)
3. **Task 3: Contact section, CopyEmailButton, Footer, full page composition** - `d481ba6` (test), `78262b8` (feat)

**Plan metadata:** _pending (this commit)_

## Files Created/Modified

- `src/content/employers.ts` - `Employer` type + reverse-chronological employers array
- `src/content/skills.ts` - `SkillGroup` type (no proficiency field) + grouped skills array
- `src/content/social-proof.ts` - `SocialProofItem` type + compact proof-row array
- `src/components/sections/About.tsx` - Narrative + employer list section (server component)
- `src/components/sections/About.test.tsx` - RTL/unit tests: employers/skillGroups/socialProof data shape + About render
- `src/components/sections/Skills.tsx` - Grouped skill-badge section, no bars (server component)
- `src/components/sections/SocialProof.tsx` - Compact wrapping proof row (server component)
- `src/components/sections/Contact.tsx` - Closing conversion section: availability, email, LinkedIn, GitHub (server component)
- `src/components/sections/Contact.test.tsx` - RTL tests for mailto link, availability lines, LinkedIn/GitHub links
- `src/components/sections/CopyEmailButton.tsx` - Click-to-copy email button (`'use client'`)
- `src/components/layout/Footer.tsx` - Small repeat-link footer (server component)
- `src/app/page.tsx` - Composes full D-03 section order + Footer

## Decisions Made

- **Employers ordered reverse-chronologically, current role first.** The App Forge AB → MetaMask → Hackberry → Yomento → BookingGo, matching how a hiring manager would scan an experience list. BookingGo's specific job title isn't documented in PROJECT.md, so `role` is left `undefined` rather than invented (content-honesty constraint).
- **Skills grouped into 4 areas using only PROJECT.md's listed skill names** — Web3/Solana, React Native/Mobile, Frontend/Web, AI/Tooling. No numeric/percentage field exists anywhere in the `SkillGroup` type, satisfying the explicit Out-of-Scope requirement.
- **Evo Nordics podcast link omitted.** No web-fetch tool is available in this execution environment to source the real episode URL, so that social-proof item renders as plain text (no `href`), flagged `TODO`. The Football Ramble/Keggy item reuses the same placeholder App Store URL already flagged in `projects.ts` (Plan 03 precedent).
- **Email affordance split into two adjacent controls, not one.** `CopyEmailButton` is a `<button>` (not a link) showing the visible email text that swaps to "Copied!" on click. A separate, small icon-only `mailto:` `<a>` (lucide `Mail` icon, `aria-label` carries the full email address) sits beside it — this is the "always present, never replaced" fallback D-15 calls for, kept visually distinct from the copy button so the two don't show duplicate email text side by side.
- **Contact's LinkedIn/GitHub are `buttonVariants()`-styled text anchors**, not icons — keeps Contact's "big links" (D-14) visually distinct from the Header's icon-only GitHub link. Footer repeats all three (email, LinkedIn, GitHub) as small plain-text links.

## Deviations from Plan

None — plan executed as written. All three tasks' verification commands (`npx vitest run`, `npm run build`) passed without requiring auto-fixes.

## Issues Encountered

None.

## User Setup Required

None new. Carried forward from Plans 02/03: confirm real GitHub/LinkedIn URLs, footballAlpha/Keggy live URLs, and supply screenshot PNGs before launch (unchanged by this plan).

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Evo Nordics podcast item has no `href` | src/content/social-proof.ts | Episode URL not sourced — no web-fetch tool in this execution environment; flagged `TODO` inline, owner follow-up before launch |

## Threat Flags

None beyond the plan's own threat model. T-01-09 (clipboard API unavailable/throws) mitigated via feature detection (`if (!navigator.clipboard) return`) and a `try/catch` silent-fail in `CopyEmailButton.tsx`, with the mailto icon-link as the guaranteed fallback. T-01-10 (reverse-tabnabbing on `_blank` links) mitigated with `rel="noopener noreferrer"` on every `target="_blank"` anchor in `Contact.tsx`, `Footer.tsx`, and `SocialProof.tsx` (verified via grep — all three files' `_blank` links carry the `rel` attribute). T-01-08 (visible email harvested by scrapers) is an accepted risk per the locked D-15 decision, not a new threat.

## Next Phase Readiness

- The complete single-page shell now exists end to end: Header → Hero → Projects → About → Skills → Social proof → Contact → Footer, closing out Phase 1's IDENT-02, IDENT-03, IDENT-04 (skills half), and CONV-01
- Contact is the stable conversion endpoint Phase 2+ case-study routes and any future demo routes can link back into
- **Action before public launch:** confirm the real GitHub/LinkedIn URLs, footballAlpha/Keggy live URLs, source the Evo Nordics episode URL, and supply screenshot PNGs (all carried-forward blockers, none newly introduced by this plan)

## Self-Check: PASSED

- src/content/employers.ts — FOUND
- src/content/skills.ts — FOUND
- src/content/social-proof.ts — FOUND
- src/components/sections/About.tsx — FOUND
- src/components/sections/About.test.tsx — FOUND
- src/components/sections/Skills.tsx — FOUND
- src/components/sections/SocialProof.tsx — FOUND
- src/components/sections/Contact.tsx — FOUND
- src/components/sections/Contact.test.tsx — FOUND
- src/components/sections/CopyEmailButton.tsx — FOUND
- src/components/layout/Footer.tsx — FOUND
- src/app/page.tsx — FOUND
- Commit 13e751a — FOUND
- Commit 8f9f412 — FOUND
- Commit ffe6418 — FOUND
- Commit d481ba6 — FOUND
- Commit 78262b8 — FOUND

---
*Phase: 01-portfolio-shell-live*
*Completed: 2026-07-09*
