---
phase: 01-portfolio-shell-live
plan: 06
subsystem: content
tags: [nextjs, vitest, content-integrity, testing]

# Dependency graph
requires:
  - phase: 01-portfolio-shell-live
    provides: Projects section, projects.ts/social-proof.ts content, initial link-validation test (plan 01-03)
provides:
  - Three committed placeholder screenshot PNGs at public/screenshots/ (no more 404s)
  - Aspect-ratio-safe Image rendering in Projects.tsx (h-auto)
  - Screenshot-existence Vitest guard (CR-01)
  - footballAlpha's confirmed live link (https://footballalpha.org)
  - Keggy's dead App Store link removed; GitHub source link remains the sole, working link
  - Anchored ^https:// link-validation regex (WR-04 fix) that rejects malformed/placeholder URLs
affects: [portfolio-shell-live verification, any future phase touching Projects.tsx or content/projects.ts]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Placeholder assets generated locally via Python/Pillow (no external fetch) when real assets aren't yet available, gated behind an explicit owner-approved fallback"
    - "Content-integrity Vitest guards (link regex + file-existence check) live alongside content data files, not in a separate test suite"

key-files:
  created:
    - public/screenshots/football-alpha.png
    - public/screenshots/metamask.png
    - public/screenshots/keggy.png
  modified:
    - src/components/sections/Projects.tsx
    - src/content/projects.ts
    - src/content/social-proof.ts
    - src/content/projects.test.ts

key-decisions:
  - "Generated neutral dark placeholder PNGs (card-surface #1c1c24 fill, project name in muted #9a9aa5 text) for all three screenshots per the owner's Task 1 checkpoint response — real screenshots deferred to a future plan"
  - "Dropped Keggy's App Store link entirely per owner's Task 1 fallback choice; kept only the working GitHub 'View source' link, which alone satisfies SHOW-01 for Keggy"
  - "Applied footballAlpha's owner-locked URL (https://footballalpha.org) directly in Task 3, no additional owner input required"
  - "social-proof.ts's Keggy mention converted to a plain-text label (href removed) to avoid diverging from the corrected projects.ts state"

patterns-established:
  - "When an owner-supplied asset/URL is unavailable at execution time, the plan's explicit fallback is applied automatically rather than reopening the checkpoint"

requirements-completed: [SHOW-01, IDENT-03]

coverage:
  - id: D1
    description: "Every project.screenshot path resolves to a real committed PNG file under public/ (no 404s)"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "src/content/projects.test.ts#every project screenshot exists in public/"
        status: pass
    human_judgment: false
  - id: D2
    description: "Project card screenshots render without aspect-ratio distortion (h-auto added to Image className)"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "npm run build (static generation succeeds, no runtime errors)"
        status: pass
    human_judgment: true
    rationale: "Visual non-distortion is a rendering property best confirmed by a human looking at the live card, not just a className string match."
  - id: D3
    description: "footballAlpha's card links to the owner-confirmed https://footballalpha.org, which resolves live over HTTPS"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "src/content/projects.test.ts#every project has a blurb, at least one tag, and at least one valid link"
        status: pass
      - kind: other
        ref: "curl -sIL -o /dev/null -w '%{http_code}' https://footballalpha.org -> 200"
        status: pass
    human_judgment: false
  - id: D4
    description: "Keggy's dead App Store link is removed; its working GitHub source link remains and resolves"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "src/content/projects.test.ts#every project has a blurb, at least one tag, and at least one valid link"
        status: pass
    human_judgment: false
  - id: D5
    description: "social-proof.ts's Keggy mention no longer diverges into a dead App Store URL"
    requirement: "IDENT-03"
    verification: []
    human_judgment: true
    rationale: "social-proof.ts has no dedicated test file; the change (href removal) was verified by grep/inspection, not an automated assertion — flagging for human confirmation."
  - id: D6
    description: "Link-validation regex anchored to ^https:// (no apps.apple.com alternative), rejecting non-https/placeholder URLs"
    requirement: "SHOW-01"
    verification:
      - kind: unit
        ref: "src/content/projects.test.ts#every project has a blurb, at least one tag, and at least one valid link"
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-07-09
status: complete
---

# Phase 01 Plan 06: Screenshots + Working Links Summary

**Replaced three 404ing screenshot paths with generated placeholder PNGs, fixed an Image aspect-ratio bug, added a screenshot-existence test guard, applied footballAlpha's confirmed live URL, dropped Keggy's dead App Store link, and anchored the link-validation regex to `^https://` to close two Phase 1 verification gaps.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-07-09T22:48:00Z
- **Completed:** 2026-07-09T22:52:30Z
- **Tasks:** 3 (1 checkpoint resolved by owner input, 2 auto-executed)
- **Files modified:** 7 (3 created, 4 modified)

## Accomplishments
- All three `public/screenshots/*.png` paths now resolve to real, valid, committed PNG files (640x400, `sips`-verified) instead of a bare `.gitkeep` — eliminates the live-site 404s
- `Projects.tsx` Image className now includes `h-auto`, preventing the fixed `height="400"` prop from fighting the CSS-overridden width and distorting the card image
- New Vitest case (`every project screenshot exists in public/`) asserts each `project.screenshot` resolves to a real file under `public/` — verified it actually fails when a file is deleted, then reverted the break before committing
- footballAlpha's "Live app" link now points to the owner-confirmed, live-verified `https://footballalpha.org` (previously a dead `footballalpha.app` TLS failure)
- Keggy's dead `apps.apple.com/app/keggy` link removed from both `projects.ts` and `social-proof.ts`; Keggy's working GitHub "View source" link remains as its sole, resolving link
- Link-validation regex in `projects.test.ts` anchored to `^https://` (removed the `apps.apple.com` alternative), so a non-https or placeholder-shaped URL now fails CI

## Task Commits

Each task was committed atomically:

1. **Task 1: Owner supplies the two remaining facts** - checkpoint, no commit (resolved via owner response in this continuation prompt: placeholders approved for all three screenshots; Keggy App Store link dropped)
2. **Task 2: Screenshots + aspect-ratio fix + existence test** - `7cbeeff` (feat)
3. **Task 3: Dead links replaced + regex anchored** - `9c29ca2` (fix)

**Plan metadata:** pending final commit (this SUMMARY + STATE/ROADMAP update)

## Files Created/Modified
- `public/screenshots/football-alpha.png` - Neutral dark placeholder (640x400, card-surface fill + project name text)
- `public/screenshots/metamask.png` - Same placeholder treatment
- `public/screenshots/keggy.png` - Same placeholder treatment
- `src/components/sections/Projects.tsx` - Added `h-auto` to the project screenshot `Image` className
- `src/content/projects.ts` - footballAlpha URL corrected to `https://footballalpha.org`; Keggy's App Store link removed; resolved TODO comments removed
- `src/content/social-proof.ts` - Keggy mention converted to plain-text (href removed); resolved TODO comment removed
- `src/content/projects.test.ts` - Added screenshot-existence test; anchored link regex to `^https://`

## Decisions Made
- Generated placeholder screenshots locally via Python/Pillow (card-surface `#1c1c24` fill, muted `#9a9aa5` project-name text, 640x400 to match existing `Image` width/height props) rather than waiting on real assets — matches the owner's Task 1 checkpoint approval
- Dropped Keggy's App Store link entirely rather than guessing an `/id` URL, per the owner's explicit fallback choice; GitHub "View source" alone satisfies SHOW-01 for Keggy
- Removed the href from social-proof.ts's Keggy entry (rather than leaving a dead link) so it can't diverge from the corrected projects.ts state

## Deviations from Plan

None - plan executed exactly as written, using the owner's checkpoint-resolution answers supplied in the continuation prompt (all three screenshots as placeholders; Keggy App Store link dropped; footballAlpha URL already locked in the plan).

## Issues Encountered
- No ImageMagick or Node canvas/sharp/jimp dependency was available for placeholder PNG generation. Resolved by using the system's Python 3 + Pillow installation (confirmed present), which the plan's "available tool" language permitted as an alternative to the suggested Node-script approach.

## User Setup Required
None - no external service configuration required. The owner's two Task 1 decisions (screenshot placeholders approved; Keggy App Store link dropped) were already supplied and are fully consumed by this execution.

## Next Phase Readiness
- Both Phase 1 verification gaps (broken screenshots, dead links) are closed; the safety-net test suite now actually validates both defect classes (screenshot existence + anchored https link regex)
- Real screenshots for footballAlpha, MetaMask, and Keggy remain a future to-do — current placeholders are honest and non-broken but not final marketing assets. This should be tracked as a follow-up item (not part of this plan's scope).
- No blockers for continuing Phase 1 verification / next phase work

---
*Phase: 01-portfolio-shell-live*
*Completed: 2026-07-09*

## Self-Check: PASSED
All created files verified present on disk; both task commits (7cbeeff, 9c29ca2) confirmed in git log.
