---
phase: 260718-bic
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/factmachine/
  - public/factmachine/motion/
  - src/components/sections/FactMachineShowcase.tsx
  - src/app/page.tsx
autonomous: true
requirements: ["260718-bic"]

must_haves:
  truths:
    - "The homepage shows a Fact Machine brand section: the case-study hero image plus wordmark, logo geometry, logomark, app dock, and on-device brand marks, in this site's dark card language."
    - "A motion gallery plays all 6 Fact Machine motion pieces as autoplaying, looping, muted, inline videos."
    - "The designer is credited with a visible link to https://terraform.nyc for brand and motion design."
    - "The new section sits directly after the Component Lab section (all Fact Machine content grouped) and matches the existing max-w-3xl / bg-card / grid styling."
  artifacts:
    - public/factmachine/
    - public/factmachine/motion/
    - src/components/sections/FactMachineShowcase.tsx
  key_links:
    - "src/app/page.tsx imports FactMachineShowcase and renders it immediately after <ComponentLab />."
    - "Every <img> src and every <video> source path resolves to a real file under public/factmachine/ copied in Task 1 (filenames kept verbatim, kebab-case as-is)."
---

<objective>
Copy the shared Fact Machine brand and motion design assets (built with the designer at terraform.nyc) into the repo, then add a homepage showcase section that presents the brand imagery plus a gallery of the 6 motion pieces, in this site's own dark Tailwind language, with a required designer credit link.

Purpose: Fact Machine is the owner's product (he is lead engineer). The Component Lab already shows the engineering side (web ports of the RN components). This adds the brand and motion craft alongside it, so a hiring manager sees the full picture: shipped product, real components, and polished design, all in one place.
Output: assets under public/factmachine/, one new presentational section component, and a one-line mount in page.tsx.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/STATE.md
@src/app/page.tsx
@src/components/lab/component-lab.tsx
@src/components/sections/Projects.tsx
@src/components/ui/phone-frame.tsx
@src/app/globals.css
</context>

<constraints>
- Ponytail mode: laziest working solution. One new presentational component plus a one-line mount. No gallery library, no lightbox, no carousel, no motion/animation library for this section. Plain CSS grid, native <img>, native <video>.
- No em dashes anywhere (copy, comments, commit message). Use commas, colons, or middots.
- Match the existing section shell exactly: `<section className="mx-auto max-w-3xl px-6 py-16 md:py-24">`, heading `text-2xl font-semibold md:text-3xl`, subhead `mt-2 text-muted-foreground`, tiles `rounded-lg bg-card p-6`, grids `grid gap-6 sm:grid-cols-2`. See component-lab.tsx and Projects.tsx.
- Images: use plain `<img loading="lazy" decoding="async">` with a single file-level `/* eslint-disable @next/next/no-img-element */`. Rationale: the gallery mixes SVG and raster, so plain img avoids both next/image per-asset width/height boilerplate and the `dangerouslyAllowSVG` next.config change; the largest rendered asset is the 705KB hero, so image optimization is not worth the added config here. (This is a warning-only rule; the repo already ships with lint findings.)
- Do NOT touch the LiveAppFrame / footballAlpha embed from quick task 260718-b7j, the Component Lab copy, or its "a client app" wording.
- Out of scope, leave alone: the pre-existing failing test in src/content/projects.test.ts and the pre-existing lint error in src/components/lab/consensus-dial.tsx. Do not run the full vitest suite as a gate; use `npm run build` (Next 16 does not run eslint during build, so neither pre-existing issue blocks it).
- Copy filenames verbatim (kebab-case as-is). Do not rename FactMachine.svg or any motion file.
</constraints>

<tasks>

<task type="auto">
  <name>Task 1: Copy Fact Machine assets into public/factmachine/</name>
  <files>public/factmachine/ (7 images), public/factmachine/motion/ (6 videos)</files>
  <action>
    Create public/factmachine/ and public/factmachine/motion/, then copy all 13 assets verbatim from the verified scratchpad source at
    /private/tmp/claude-501/-Users-danielcross-Projects-portfolio/ec13bab9-96d6-4b9c-9d38-82f95ad7fd00/scratchpad/factmachine-assets/
    Top-level images (7): app-dock-1600.webp, fact-machine-hero-2026-06-29.png, factmachine-iphone-mock.png, factmachine-logo-drafting-lines.svg, factmachine-wordmark-debossed-1600.webp, FactMachine.svg, fm-nice-logo.png.
    Motion videos (6) into public/factmachine/motion/: alpha-delay.mp4, alpha-select.mp4, door-brothers.mp4, market-launch.mp4, modal-animation.mp4, prize-pool-terminal.mp4.
    Keep names exactly as-is. Use `cp` (a recursive copy of the whole folder is fine); do not re-encode or rename anything. The ~35MB of mp4 is accepted as a committed asset for now.
  </action>
  <verify>
    <automated>test $(ls public/factmachine/*.png public/factmachine/*.webp public/factmachine/*.svg | wc -l) -eq 7 && test $(ls public/factmachine/motion/*.mp4 | wc -l) -eq 6</automated>
  </verify>
  <done>7 image files exist under public/factmachine/ and 6 mp4 files exist under public/factmachine/motion/, with original filenames.</done>
</task>

<task type="auto">
  <name>Task 2: Build FactMachineShowcase section and mount it after ComponentLab</name>
  <files>src/components/sections/FactMachineShowcase.tsx, src/app/page.tsx</files>
  <action>
    Create src/components/sections/FactMachineShowcase.tsx exporting a server component `FactMachineShowcase` (no "use client": it is static markup, videos are declarative). Top of file: one `/* eslint-disable @next/next/no-img-element */` comment.

    Structure, using the shared section shell (`<section id="fact-machine" className="mx-auto max-w-3xl px-6 py-16 md:py-24">`):
    1. Heading (`h2`, `text-2xl font-semibold md:text-3xl`): "Fact Machine Brand and Motion". Subhead (`p`, `mt-2 text-muted-foreground`): one line noting this is the brand identity and motion design for Fact Machine, the Solana prediction-market product the owner leads.
    2. Brand block: render the hero image first, full width, inside a `mt-8 overflow-hidden rounded-lg bg-card` frame (img `h-auto w-full`), src `/factmachine/fact-machine-hero-2026-06-29.png`, alt "Fact Machine brand case-study hero". Then a `mt-6 grid gap-6 sm:grid-cols-2` of brand-mark tiles (`rounded-lg bg-card p-6`, each with the img centered and a `mt-3 text-sm text-muted-foreground` caption): factmachine-wordmark-debossed-1600.webp ("Debossed wordmark"), factmachine-logo-drafting-lines.svg ("Logo drafting geometry"), FactMachine.svg ("Logomark"), app-dock-1600.webp ("App dock"), factmachine-iphone-mock.png ("On device"). Do NOT render fm-nice-logo.png: it is copied for completeness but redundant with the crisp SVG logomark; leaving it out keeps the grid tight and avoids serving a 1.7MB raster. (Give the SVG imgs an explicit `className="mx-auto w-full max-w-[240px]"` so they do not blow up to full width.)
    3. Motion gallery: a `mt-10` subheading (`text-lg font-semibold`, "Motion") then a `mt-6 grid gap-6 sm:grid-cols-2` of 6 video tiles. Drive it from an array of {file, caption}: alpha-delay.mp4 → "Alpha delay", alpha-select.mp4 → "Alpha approval", door-brothers.mp4 → "Door Brothers", market-launch.mp4 → "Market launch", modal-animation.mp4 → "Modal animation", prize-pool-terminal.mp4 → "Prize pool terminal". Each tile: `overflow-hidden rounded-lg bg-card`, a `<video>` with `autoPlay loop muted playsInline preload="metadata" className="h-auto w-full"` and a single `<source src={`/factmachine/motion/${file}`} type="video/mp4" />`, then a `p-4 text-sm text-muted-foreground` caption. No poster (skip it, autoplay shows frame one).
    4. Credit (required copy): a `mt-8 text-sm text-muted-foreground` line reading "Brand identity and motion design by Terraform." where "Terraform" is an anchor `href="https://terraform.nyc"` `target="_blank"` `rel="noopener noreferrer"` styled `text-foreground underline underline-offset-4 hover:text-accent`.

    Then edit src/app/page.tsx: import FactMachineShowcase and render `<FactMachineShowcase />` on the line immediately after `<ComponentLab />` (keeps all Fact Machine content grouped). Do not reorder any other section.
  </action>
  <verify>
    <automated>npm run build && test $(grep -oE 'motion/[a-z-]+\.mp4' src/components/sections/FactMachineShowcase.tsx | sort -u | wc -l) -eq 6 && grep -q 'href="https://terraform.nyc"' src/components/sections/FactMachineShowcase.tsx && grep -q 'FactMachineShowcase' src/app/page.tsx</automated>
  </verify>
  <done>`npm run build` passes; the section renders the hero plus 5 brand-mark tiles, a 6-video motion grid (autoplay/loop/muted/playsinline), and a terraform.nyc credit link; page.tsx renders it right after ComponentLab.</done>
</task>

</tasks>

<verification>
- `npm run build` succeeds (typecheck + compile) with the new section wired in.
- Manual eyeball (optional): run `npm run dev`, scroll past Component Lab, confirm the hero and brand tiles render, all 6 videos autoplay and loop muted, and the Terraform credit link points to https://terraform.nyc.
- No changes to LiveAppFrame, Projects, or Component Lab.
</verification>

<success_criteria>
- 13 assets committed under public/factmachine/ (7 images + 6 motion videos), names verbatim.
- A single new FactMachineShowcase section presents the brand imagery and the 6-video motion gallery in the site's dark card language, mounted after ComponentLab.
- The designer credit links to https://terraform.nyc and is visible.
- No em dashes anywhere. Pre-existing test/lint issues left untouched.
</success_criteria>

<notes>
Follow-up (do not block): the 6 mp4 files total ~35MB committed to the repo, and they autoplay below the fold. A later pass could compress/transcode them (for example to smaller H.264/WebM, or convert to poster + click-to-play) to cut repo weight and bandwidth. Flagged, not in scope here.
</notes>

<output>
Create `.planning/quick/260718-bic-copy-fact-machine-design-assets-into-the/260718-bic-SUMMARY.md` when done.
</output>
