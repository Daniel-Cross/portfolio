---
status: testing
phase: 01-portfolio-shell-live
source: [01-VERIFICATION.md]
started: 2026-07-09T21:52:30Z
updated: 2026-07-09T21:52:30Z
---

## Current Test

number: 1
name: Confirm LinkedIn profile URL is correct
expected: |
  The LinkedIn CTA in Contact/Footer opens the real Daniel Cross profile
  (https://www.linkedin.com/in/danielcross), not a guessed handle belonging
  to someone else.
awaiting: user response

## Tests

### 1. Confirm LinkedIn profile URL is correct
expected: The LinkedIn CTA in Contact/Footer opens the real Daniel Cross profile, not a guessed handle belonging to someone else (src/content/site.ts flags this URL as an unverified inferred handle; LinkedIn blocks automated checks)
result: [pending]

### 2. Mobile menu opens/closes on a narrow viewport
expected: Menu toggles open/closed and anchor links close the menu. Note: Escape/outside-click are not currently implemented — the menu only closes via the toggle or a link tap
result: [pending]

### 3. CopyEmailButton copies email and shows "Copied!"
expected: Clicking the button in Contact swaps the label to "Copied!" for ~2s, then reverts, and the clipboard actually contains the email
result: [pending]

### 4. Anchor nav links don't clip section headings under the sticky header
expected: On a real mobile viewport, clicking About/Projects/Contact anchor links leaves the section heading fully visible below the header after smooth-scroll (offset currently relies on section padding coincidentally matching header height)
result: [pending]

### 5. Placeholder screenshots read as intentional on the live site
expected: On www.danielcross.dev the three placeholder cards (card-surface fill + project name text) render without aspect-ratio distortion and read as neutral/intentional, not broken — acceptable until real product screenshots replace them
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
