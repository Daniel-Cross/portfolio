---
phase: 01-portfolio-shell-live
reviewed: 2026-07-10T05:56:10Z
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

**Reviewed:** 2026-07-10T05:56:10Z
**Depth:** standard
**Files Reviewed:** 28 (24 source/test files; 3 binary PNGs and 1 .gitkeep verified for existence/validity only)
**Status:** issues_found

## Narrative Findings (AI reviewer)

## Summary

Reviewed the full Phase 01 file set: static one-page portfolio (page composition, Header/MobileNav/Footer, six section components, one client-side copy button, five typed content modules, six test files, and the placeholder screenshot assets). Cross-referenced imports against `src/components/ui/` (buttonVariants/Badge exports confirmed), `src/app/layout.tsx` (font CSS variables `--font-geist-sans`/`--font-geist-mono` are defined and applied, so the `@theme inline` references in globals.css resolve), and `node_modules`.

Adversarial checks that came back clean — verified, not assumed:

- **`preload` prop on `next/image`** (`Projects.tsx:23`) looked like a bug (the classic prop is `priority`), but `node_modules/next/dist/shared/lib/get-img-props.d.ts` confirms Next 16 defines `preload?: boolean` and marks `priority` as `@deprecated`. Correct usage.
- **`@import "shadcn/tailwind.css"`** (`globals.css:3`) looked suspicious (shadcn is normally copy-in, not an npm CSS source), but the installed `shadcn@4.13.0` package exports `"./tailwind.css": "./dist/tailwind.css"`. Resolves correctly.
- **LinkedIn handle gap-closure (01-07)** — `src/content/site.ts:18` now carries the user-confirmed hyphenated URL `https://www.linkedin.com/in/daniel-cross`; the stale verification TODO is gone; the old no-hyphen handle appears nowhere in `src/`. Gap confirmed closed.
- **Security surface** — no secrets, no `eval`/`innerHTML`/injection vectors; every `target="_blank"` anchor (Header, MobileNav, Footer, Projects, SocialProof, Contact) carries `rel="noopener noreferrer"`; clipboard write is guarded for missing `navigator.clipboard` and wrapped in try/catch with a documented mailto fallback (D-15).
- **Binary assets** — all three PNGs are valid 640x400 images matching the `width={640} height={400}` props in `Projects.tsx`; none are empty. They are text-on-dark placeholders, which 01-VERIFICATION.md documents as an accepted deferral (see IN-02 for the one residual defect this leaves in code).
- **Test wiring** — `projects.test.ts`'s screenshot-existence guard resolves `public/` correctly via `import.meta.dirname`; `About.test.tsx`'s `new RegExp(employer.name)` is safe for all current names (no regex metacharacters); `Header.test.tsx`'s `getAllByRole` correctly tolerates the closed-by-default MobileNav.

Remaining findings are accessibility/robustness warnings in the two interactive client components, plus content/asset info items.

## Warnings

### WR-01: MobileNav menu cannot be dismissed with Escape, outside click, or focus loss

**File:** `src/components/layout/MobileNav.tsx:18-63`
**Issue:** The open menu only closes via the toggle button or clicking a menu link. There is no `Escape` handler, no outside-click/blur dismissal, and no focus management (focus is not moved into the menu on open nor returned to the toggle on close). A keyboard user can Tab straight past the open overlay and leave it stranded over the page content; the `aria-expanded` state is correct but there is no `aria-controls` linking the button to the panel it toggles. This is the primary mobile navigation for the site's target audience (hiring managers on phones), so a stuck overlay is a real robustness defect, not a style nit.
**Fix:** Add a keydown handler and `aria-controls`:

```tsx
<button
  type="button"
  onClick={() => setOpen((prev) => !prev)}
  aria-label={open ? "Close menu" : "Open menu"}
  aria-expanded={open}
  aria-controls="mobile-nav"
  ...
/>
{open && (
  <nav
    id="mobile-nav"
    aria-label="Mobile"
    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    ...
  >
```

and register a document-level `Escape` listener (`useEffect` with `keydown`) while `open` is true so Escape works regardless of where focus sits. Outside-click dismissal via a `pointerdown` listener on `document` is a small addition worth making at the same time.

### WR-02: Copy-email confirmation is invisible to screen readers

**File:** `src/components/sections/CopyEmailButton.tsx:22-30`
**Issue:** On success the button's text swaps from the email address to "Copied!" with no `aria-live` region, so assistive technology announces nothing — a screen-reader user activates the button and gets zero feedback that the copy happened. The swap also removes the email address from the button's accessible name for 2 seconds, so the control transiently loses its identity.
**Fix:** Announce the state change politely and keep a stable accessible name:

```tsx
<button
  type="button"
  onClick={handleClick}
  aria-label={`Copy ${site.email} to clipboard`}
  className="..."
>
  {copied ? "Copied!" : site.email}
</button>
<span aria-live="polite" className="sr-only">
  {copied ? "Email copied to clipboard" : ""}
</span>
```

### WR-03: CopyEmailButton timers stack across clicks and survive unmount

**File:** `src/components/sections/CopyEmailButton.tsx:10-20`
**Issue:** Each click schedules a new 2-second `setTimeout` without clearing the previous one. Click at t=0s and again at t=1.9s: the first timer fires at t=2.0s and flips the label back to the email address 0.1s into the second confirmation — the "Copied!" feedback visibly cuts out early. The timeout is also never cleared on unmount (harmless no-op setState in React 19, but still a dangling timer).
**Fix:** Hold the timer in a ref, clear before rescheduling, and clean up on unmount:

```tsx
const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

async function handleClick() {
  if (!navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(site.email)
    setCopied(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  } catch { /* mailto fallback (D-15) */ }
}

useEffect(() => () => clearTimeout(timerRef.current), [])
```

## Info

### IN-01: Launch-blocking TODO — Evo Nordics episode URL unconfirmed, all social-proof items unlinked

**File:** `src/content/social-proof.ts:6-12`
**Issue:** The file carries a `TODO: confirm the Evo Nordics episode URL before launch`, and all three current items omit `href` — every item renders through the `<span>` (unlinked) branch of `SocialProof.tsx:23`. "Social proof" without a single verifiable link is weaker proof. Tracked here so the TODO does not silently ride into launch.
**Fix:** Source the Evo Nordics episode URL and the Football Ramble reference, populate `href` on those items, and delete the TODO.

### IN-02: Alt text calls placeholder images "screenshot"

**File:** `src/components/sections/Projects.tsx:19` (assets: `public/screenshots/*.png`)
**Issue:** `alt={`${project.name} screenshot`}` while the committed PNGs are neutral name-on-card placeholders (documented deferral per 01-VERIFICATION.md). Until real captures land, the alt text asserts something the image is not — a small honesty gap given the project's content-honesty constraint, and a stale-content trap if real screenshots slip.
**Fix:** Use `alt={project.name}` (or `${project.name} preview`) now, or make the alt text part of the "replace placeholders" task so it cannot be forgotten.

### IN-03: Anchor scroll offset works only because section padding coincidentally equals header height

**File:** `src/components/layout/Header.tsx:14`, `src/app/globals.css:80-83`, section elements in `src/components/sections/*.tsx`
**Issue:** The header is `sticky top-0` at `h-16` (64px). Anchor navigation (`#about`, `#projects`, `#contact`) scrolls each section's top edge under the header; content is only visible because every section happens to use `py-16` (64px) top padding. Change either value independently and section headings will be clipped under the sticky header.
**Fix:** Make the offset explicit: add `scroll-padding-top: 4rem;` to the `html` rule in `globals.css` (or `scroll-mt-16` on each section), decoupling scroll behavior from section padding.

### IN-04: Obsolete `.gitkeep` in a now-populated directory

**File:** `public/screenshots/.gitkeep`
**Issue:** The `.gitkeep` was needed when the directory was empty; three tracked PNGs now keep the directory alive, leaving the file as dead weight.
**Fix:** Delete `public/screenshots/.gitkeep`.

### IN-05: Inconsistent terminal punctuation in the Contact availability list

**File:** `src/components/sections/Contact.tsx:16-17`
**Issue:** "Contract — via The App Forge AB (outside IR35, UK/EU remote)" has no closing period; "Full-time — open to senior/staff crypto roles." does. A copy-polish nit on the highest-stakes section of the page.
**Fix:** Pick one convention (drop the period from line 17 or add one to line 16).

---

_Reviewed: 2026-07-10T05:56:10Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
