---
phase: 01-portfolio-shell-live
reviewed: 2026-07-09T21:04:29Z
depth: standard
files_reviewed: 28
files_reviewed_list:
  - public/screenshots/.gitkeep
  - public/screenshots/football-alpha.png
  - public/screenshots/keggy.png
  - public/screenshots/metamask.png
  - src/app/globals.css
  - src/app/page.tsx
  - src/components/icons/github.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Header.test.tsx
  - src/components/layout/Header.tsx
  - src/components/layout/MobileNav.tsx
  - src/components/sections/About.test.tsx
  - src/components/sections/About.tsx
  - src/components/sections/Contact.test.tsx
  - src/components/sections/Contact.tsx
  - src/components/sections/CopyEmailButton.tsx
  - src/components/sections/Hero.test.tsx
  - src/components/sections/Hero.tsx
  - src/components/sections/Projects.test.tsx
  - src/components/sections/Projects.tsx
  - src/components/sections/Skills.tsx
  - src/components/sections/SocialProof.tsx
  - src/content/employers.ts
  - src/content/projects.test.ts
  - src/content/projects.ts
  - src/content/site.ts
  - src/content/skills.ts
  - src/content/social-proof.ts
findings:
  critical: 0
  warning: 3
  info: 5
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-09T21:04:29Z
**Depth:** standard
**Files Reviewed:** 28
**Status:** issues_found

## Summary

Fresh full review of the Phase 1 portfolio shell after gap-closure plan 01-06 executed. This supersedes the earlier 01-REVIEW.md — the prior findings (broken screenshot 404s / CR-01, aspect-ratio distortion / WR-03, link-regex precedence bug / WR-04) are confirmed fixed in the current codebase.

Evidence gathered during this review:

- **Tests:** `vitest run` — 7 files, 20 tests, all pass. The new screenshot-existence guard and the anchored `^https://` link regex in `src/content/projects.test.ts` are present and effective.
- **Typecheck / lint:** `tsc --noEmit` clean; `eslint` clean.
- **Binary assets:** all three `public/screenshots/*.png` are valid, non-empty PNGs (640x400, RGB, 4.5–5.5 KB), dimensions matching the `width={640} height={400}` props in `Projects.tsx`, and each is referenced by `src/content/projects.ts`. They are generated name-on-dark placeholder cards, not real screenshots (owner-approved fallback per 01-06 — see WR-02).
- **Links:** `https://footballalpha.org`, `https://github.com/Daniel-Cross/keggy-data`, `https://metamask.io`, and `https://github.com/Daniel-Cross` all return HTTP 200. The LinkedIn URL could not be verified (LinkedIn returns 999 to non-browser clients) and is explicitly marked as a guess in source (WR-01).
- **API surface:** the `preload` prop passed to `next/image` in `Projects.tsx` was verified against the installed Next 16.2.10 types — it is the current, correct API (`priority` is deprecated in favor of `preload`), so this is not a bug.
- **Security:** no hardcoded secrets, no dangerous functions, no injection surfaces (static content, no user input other than a clipboard write of a constant). All `target="_blank"` links carry `rel="noopener noreferrer"`. The `shadcn/tailwind.css` import in `globals.css` resolves via the package's `exports` map.

No Critical issues found. Three Warnings (an unverified outbound profile URL wired into two CTAs, misleading alt text on placeholder images, and unconditional smooth-scroll that ignores reduced-motion preferences) and five Info items.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: LinkedIn CTA points at an unverified, guessed profile URL

**File:** `src/content/site.ts:21` (consumed by `src/components/layout/Footer.tsx:16` and `src/components/sections/Contact.tsx:31`)
**Issue:** The in-source TODO (`site.ts:11-13`) admits `https://www.linkedin.com/in/danielcross` is a guessed canonical-shape URL "pending confirmation of the real handle." "Daniel Cross" is a common name; short LinkedIn vanity URLs like `/in/danielcross` are frequently already claimed by someone else. This URL is wired into two of the site's primary conversion CTAs (Footer and the Contact section's filled-button LinkedIn link). If the handle is wrong, hiring managers are sent to a stranger's profile — the single worst failure mode for this site's stated purpose. The URL cannot be verified programmatically (LinkedIn returns HTTP 999 to non-browser clients), so this must be human-verified before launch.
**Fix:** Owner opens their own LinkedIn profile, copies the exact public vanity URL, and replaces the value in `site.ts`. Until verified, this should be treated as a launch blocker in the phase checklist even though it cannot be caught by CI.

### WR-02: Placeholder images are announced to users as real screenshots

**File:** `src/components/sections/Projects.tsx:19` (assets: `public/screenshots/football-alpha.png`, `metamask.png`, `keggy.png`)
**Issue:** All three PNGs are generated placeholder cards (project name in muted text on a flat dark fill — owner-approved fallback per 01-06-SUMMARY, real screenshots deferred). But the rendered `alt` is `` `${project.name} screenshot` ``, so screen-reader users are told they are looking at an app screenshot when the image contains only the project name. There is also no marker in `src/content/projects.ts` distinguishing placeholder from real assets, so nothing tracks the deferred swap at the code level — the site's flagship "proof through demos" section silently ships with non-proof imagery.
**Fix:** Until real screenshots land, make the alt text honest and add a tracking marker:
```tsx
// Projects.tsx — until real screenshots replace the placeholders:
alt={`${project.name} placeholder image`}
```
and add a `// TODO: replace placeholder PNGs with real app screenshots (deferred from 01-06)` note in `src/content/projects.ts` so the deferral is discoverable where the paths live.

### WR-03: Unconditional `scroll-behavior: smooth` ignores prefers-reduced-motion

**File:** `src/app/globals.css:82`
**Issue:** `html { scroll-behavior: smooth }` is applied unconditionally. Every anchor navigation (header nav, mobile nav, both hero CTAs, the `#top` logo link) triggers an animated full-page scroll even for users who have set `prefers-reduced-motion: reduce` — a vestibular-disorder accessibility issue (WCAG 2.3.3). For a site whose visitors are evaluated-by-first-impression hiring managers, motion-preference respect is also a signal of frontend craft.
**Fix:**
```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

## Info

### IN-01: CopyEmailButton — stacked timeouts, no unmount cleanup, no screen-reader announcement

**File:** `src/components/sections/CopyEmailButton.tsx:14-15, 22-29`
**Issue:** (a) Rapid re-clicks stack `setTimeout`s: a second click within 2s schedules a second reset while the first timer is still pending, so the fresh "Copied!" state is cleared early by the stale timer. (b) The timer is never cleared on unmount (harmless no-op setState in React 19, but untidy). (c) The label swap to "Copied!" is purely visual — no `aria-live`/`role="status"`, so screen-reader users get no confirmation that the copy succeeded.
**Fix:** Keep the timeout id in a ref; `clearTimeout` before scheduling and in a `useEffect` cleanup. Render the status in an element with `role="status"` (or add a visually-hidden `aria-live="polite"` region).

### IN-02: MobileNav lacks Escape-to-close, aria-controls, and outside-click dismissal

**File:** `src/components/layout/MobileNav.tsx:23-36`
**Issue:** The disclosure button has `aria-expanded` but no `aria-controls` linking it to the panel; the open panel cannot be dismissed with Escape or by tapping outside — only by re-tapping the toggle or choosing a link. Acceptable for a simple disclosure nav, but below the a11y bar the rest of the markup aims for.
**Fix:** Add `id` on the `<nav>` + `aria-controls` on the button; add a `keydown` handler (or document listener while open) closing on `Escape`.

### IN-03: Anchor targets sit flush against the sticky header on mobile

**File:** `src/components/sections/*.tsx` section elements (e.g. `Projects.tsx:9`, `About.tsx:5`, `Contact.tsx:10`); `src/app/globals.css`
**Issue:** The sticky header is `h-16` (64px) and sections use `py-16` (64px top padding) on mobile, so after anchor navigation a section heading lands exactly at the header's bottom edge with zero gap — content isn't hidden, but only because the padding happens to equal the header height. Any future padding or header-height change will clip headings.
**Fix:** Add `scroll-mt-16` (or a global `scroll-padding-top: 4rem` on `html`) so anchor positioning is decoupled from section padding.

### IN-04: Launch-verification TODOs live only as code comments; all social-proof items unlinked

**File:** `src/content/site.ts:11-13`, `src/content/social-proof.ts:6-7`
**Issue:** Two TODO comments track unresolved pre-launch facts (profile URLs, Evo Nordics episode URL). All three `socialProof` entries currently render as plain text with no `href`, so the "Social proof" section makes claims a visitor cannot verify with one click. Fine as interim state, but these TODOs are invisible to the roadmap unless copied into phase tracking.
**Fix:** Mirror both TODOs into the phase/milestone checklist; add the podcast/episode URLs when confirmed so at least one social-proof item is clickable.

### IN-05: Dead `--font-heading` design token

**File:** `src/app/globals.css:12`
**Issue:** `--font-heading: var(--font-geist-sans)` is defined in `@theme inline` but no `font-heading` utility is used anywhere in the codebase; it aliases the already-default sans font.
**Fix:** Remove the token, or start using `font-heading` on headings if a distinct heading face is planned.

---

_Reviewed: 2026-07-09T21:04:29Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
