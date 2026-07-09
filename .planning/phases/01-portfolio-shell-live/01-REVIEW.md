---
phase: 01-portfolio-shell-live
reviewed: 2026-07-09T16:39:59Z
depth: standard
files_reviewed: 40
files_reviewed_list:
  - .gitignore
  - README.md
  - components.json
  - eslint.config.mjs
  - next.config.ts
  - package.json
  - postcss.config.mjs
  - src/app/__smoke__.test.tsx
  - src/app/globals.css
  - src/app/layout.tsx
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
  - src/components/ui/badge.tsx
  - src/components/ui/button.tsx
  - src/components/ui/card.tsx
  - src/content/employers.ts
  - src/content/projects.test.ts
  - src/content/projects.ts
  - src/content/site.ts
  - src/content/skills.ts
  - src/content/social-proof.ts
  - src/lib/utils.ts
  - tsconfig.json
  - vitest.config.ts
  - vitest.setup.ts
findings:
  critical: 1
  warning: 5
  info: 6
  total: 12
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-09T16:39:59Z
**Depth:** standard
**Files Reviewed:** 40
**Status:** issues_found

## Summary

Reviewed the full Phase 1 portfolio shell: Next.js 16 config, layout/page composition, six section components, three shadcn-style UI primitives, content modules, and their tests. The test suite (19 tests, 7 files) passes and `npm run lint` is clean. Component code is generally well-structured — server components by default with `"use client"` correctly scoped to the two interactive components, external links consistently carry `rel="noopener noreferrer"`, security headers are set in `next.config.ts`, and no injection surfaces, secrets, or dangerous APIs exist in this static site.

Facts verified against installed dependencies during review (not assumed): the `preload` prop on `next/image` is valid in Next 16.2.10 (it supersedes the deprecated `priority`), the `shadcn/tailwind.css` export exists in shadcn 4.13.0, and `@base-ui/react@1.6.0` exports `./button`, `./merge-props`, and `./use-render`. None of those are issues.

The one blocker is a shipped-broken user-facing defect: all three project screenshots referenced by `src/content/projects.ts` do not exist — `public/screenshots/` contains only a `.gitkeep` — so the Projects section, the site's core proof, renders three broken images in production. Warnings cover known-placeholder external links merged to the live branch (including an App Store URL shape that 404s), a fragile anchor-scroll offset that only works because section padding coincidentally equals the sticky header height, an aspect-ratio distortion bug in the project card image, a regex precedence bug that neuters the link-validation test, and a screen-reader gap in the copy-email interaction.

## Critical Issues

### CR-01: All three project screenshots are missing — Projects section renders broken images in production

**File:** `src/content/projects.ts:21,30,39` and `public/screenshots/`
**Issue:** Every project entry references a screenshot (`/screenshots/football-alpha.png`, `/screenshots/metamask.png`, `/screenshots/keggy.png`), and `src/components/sections/Projects.tsx:17-24` renders each through `next/image`. But `public/screenshots/` contains only a `.gitkeep` (`git ls-files public/` confirms no PNGs are tracked). `next/image` does not validate static paths at build time, so the build and deploy succeed — and the live site's flagship Projects section shows three broken images (the image optimizer returns 404 for the missing sources, leaving alt text in a broken frame). This defeats the phase's core value ("live, touchable proof") and is visible to every visitor. Unlike the URL placeholders, no TODO in the code flags this gap.
**Fix:** Add the three real screenshots to `public/screenshots/` before this phase is considered shippable. If real screenshots are not yet available, either commit temporary placeholder images at the referenced paths or remove the `screenshot` field and the `<Image>` render until assets exist. Additionally, extend `src/content/projects.test.ts` to fail loudly on this class of defect:

```ts
import { existsSync } from "node:fs"
import path from "node:path"

it("every project screenshot exists in public/", () => {
  for (const project of projects) {
    expect(
      existsSync(path.join(__dirname, "../../public", project.screenshot)),
      `${project.screenshot} missing`
    ).toBe(true)
  }
})
```

## Warnings

### WR-01: Known-placeholder external links are live on the production branch — including an App Store URL shape that 404s

**File:** `src/content/projects.ts:22,31,41,44`, `src/content/site.ts:20-21`, `src/content/social-proof.ts:14`
**Issue:** Several links a hiring manager is explicitly expected to click are unverified or wrong, and this code deploys to danielcross.dev on every push to `main` (per README):
- `https://apps.apple.com/app/keggy` (used twice: projects.ts:41, social-proof.ts:14) is not a resolvable App Store URL — App Store links require an id segment (`/app/<slug>/id<number>`); this shape returns a 404 from Apple.
- The MetaMask link labeled **"App Store"** points to `https://metamask.io` (projects.ts:31) — a mislabeled link; the label promises the App Store listing and delivers a marketing site.
- `https://www.linkedin.com/in/danielcross` (site.ts:21) is an unverified guess at the handle for a common name — if wrong, the Contact section's primary CTA sends recruiters to a stranger's profile.
- `https://footballalpha.app` (projects.ts:22) is flagged in the code's own TODO as unconfirmed.

The TODO comments show awareness, but TODOs don't gate deploys — the defect is live the moment this merges.
**Fix:** Resolve the real URLs before (or immediately after) this phase ships. At minimum: correct the Keggy App Store URL to the full `/id` form, relabel the MetaMask link to "metamask.io" or point it at the actual App Store listing, and verify the LinkedIn handle. Then strengthen the link test (see WR-04) so placeholder shapes like `apps.apple.com/app/keggy` (no id) fail.

### WR-02: Anchor scrolling works only because section padding coincidentally equals the sticky header height

**File:** `src/app/globals.css:80-83`, `src/components/layout/Header.tsx:14`, section components (`About.tsx:5`, `Projects.tsx:9`, `Contact.tsx:10`)
**Issue:** The header is `sticky top-0` with `h-16` (64px), and `html` has `scroll-behavior: smooth`, but there is no `scroll-padding-top`/`scroll-margin-top` anywhere. When a nav link scrolls to `#about`/`#projects`/`#contact`, the browser aligns the section's top edge with the viewport top — underneath the 64px header. The section headings are currently not clipped only because every section happens to use `py-16` (64px top padding), exactly matching the header height with zero tolerance on mobile. Any padding reduction, a taller header, or a future in-section anchor will clip content under the header. The same applies to the `#top` logo link.
**Fix:** Make the offset explicit in `globals.css`:

```css
html {
  color-scheme: dark;
  scroll-behavior: smooth;
  scroll-padding-top: 4rem; /* sticky header height */
}
```

### WR-03: Project card image will render distorted — CSS overrides width but not height

**File:** `src/components/sections/Projects.tsx:17-24`
**Issue:** The `<Image>` has `width={640} height={400}` plus className `w-full shrink-0 rounded-md md:w-64`. The `w-full`/`md:w-64` CSS overrides the width, but nothing overrides the height, so the `height="400"` presentational attribute keeps the rendered height fixed at 400px while the width flexes — distorting the image's aspect ratio (e.g., at `md:w-64` the image renders 256×400 from a 640×400 source). This is exactly the case Next.js warns about in dev ("has either width or height modified, but not the other"). It's currently masked because the screenshots are missing (CR-01), but will surface as soon as real assets land. The 640×400 landscape intrinsic size is also questionable for what are presumably portrait phone screenshots — worth revisiting when the real assets arrive.
**Fix:** Add `h-auto` to the className:

```tsx
className="h-auto w-full shrink-0 rounded-md md:w-64"
```

### WR-04: Link-validation regex has a precedence bug that accepts invalid URLs

**File:** `src/content/projects.test.ts:24`
**Issue:** `expect(link.href).toMatch(/^https:\/\/|apps\.apple\.com/)` — the `^` anchor binds only to the first alternative. The pattern therefore passes for any string containing `apps.apple.com` anywhere (`http://evil.example/apps.apple.com` passes, as would a plain-`http` Apple link). The second alternative is also dead weight: every Apple link is already `https://`, so it can never be the deciding branch for a valid URL — it only widens the accepted set to include invalid ones. This weakens the only guard that could catch bad link data (see WR-01).
**Fix:**

```ts
expect(link.href).toMatch(/^https:\/\//)
```

### WR-05: "Copied!" feedback is invisible to screen readers

**File:** `src/components/sections/CopyEmailButton.tsx:22-30`
**Issue:** On click, the button's text content swaps from the email address to "Copied!". There is no `aria-live` region, so screen readers announce nothing when the copy succeeds — and the button's accessible name silently changes out from under the user, which is disorienting when they re-encounter the control. A keyboard/AT user gets zero confirmation the copy happened.
**Fix:** Announce the state change politely and keep a stable control:

```tsx
<button type="button" onClick={handleClick} className="...">
  <span aria-live="polite">{copied ? "Copied!" : site.email}</span>
</button>
```

## Info

### IN-01: Mobile menu lacks Escape-to-close, outside-click dismissal, and aria-controls

**File:** `src/components/layout/MobileNav.tsx:21-63`
**Issue:** The disclosure menu only closes via the toggle button or clicking a link. Pressing Escape or tapping outside leaves it open, and the toggle button has `aria-expanded` but no `aria-controls` pointing at the nav element it controls.
**Fix:** Add a `useEffect` keydown listener for Escape when `open`, give the `<nav>` an `id` referenced by `aria-controls` on the button. Outside-click dismissal is optional polish.

### IN-02: CopyEmailButton timers stack on rapid clicks and are not cleared on unmount

**File:** `src/components/sections/CopyEmailButton.tsx:14-15`
**Issue:** Each click schedules a new 2s `setTimeout` without clearing the previous one — rapid double-click makes the first timer hide "Copied!" early. The timer is also never cleared on unmount (harmless in React 19, but untidy).
**Fix:** Store the timer id in a ref, `clearTimeout` before scheduling, and clear it in a `useEffect` cleanup.

### IN-03: Dead code — `card.tsx` is entirely unused and the `Button` component is never imported

**File:** `src/components/ui/card.tsx` (whole file), `src/components/ui/button.tsx:43-56`
**Issue:** No file imports anything from `ui/card`, and only `buttonVariants` is ever imported from `ui/button` — the `Button` component (and with it the `@base-ui/react/button` runtime import) is unused. shadcn's copy-in model makes some slack conventional, but `card.tsx` has no consumer and no near-term one visible in this phase.
**Fix:** Delete `card.tsx` (it can be re-added via the shadcn CLI when needed), or leave with a note if Phase 2/3 plans consume it imminently.

### IN-04: create-next-app starter SVGs still tracked in public/

**File:** `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
**Issue:** Five unused scaffold assets from `create-next-app` remain tracked and deploy with the site.
**Fix:** Delete them.

### IN-05: TODO markers in content modules must be resolved before launch

**File:** `src/content/site.ts:11-13`, `src/content/projects.ts:10-13`, `src/content/social-proof.ts:6-8`
**Issue:** Three TODO blocks flag unverified URLs (the substance is covered in WR-01). Listing here so they're tracked as pre-launch checklist items rather than rediscovered later.
**Fix:** Resolve and remove the TODOs alongside the WR-01 fixes.

### IN-06: Metadata lacks metadataBase and Open Graph tags

**File:** `src/app/layout.tsx:15-19`
**Issue:** Only `title` and `description` are set. LinkedIn is a stated share channel for this job search; without `openGraph`/`metadataBase`, shared links get no preview card.
**Fix:** Add `metadataBase: new URL("https://danielcross.dev")` and a minimal `openGraph` block. Fine to defer past Phase 1; noting because the share channel is explicit in PROJECT.md.

---

_Reviewed: 2026-07-09T16:39:59Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
