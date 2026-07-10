---
phase: 260710-lkn-component-lab
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/globals.css
  - src/components/lab/pixel-loader.tsx
  - src/components/lab/looping-gradient-text.tsx
  - src/components/lab/animated-dashed-gradient-line.tsx
  - src/components/lab/animated-gradient-pill.tsx
  - src/components/lab/glass-control.tsx
  - src/components/lab/crt-static-overlay.tsx
  - src/components/lab/consensus-dial.tsx
  - src/components/lab/component-lab.tsx
  - src/components/lab/component-lab.test.tsx
  - src/app/page.tsx
autonomous: true
requirements:
  - QUICK-260710-lkn-component-lab
user_setup: []

must_haves:
  truths:
    - "A 'Component Lab' section renders between Projects and About with 7 named, described tiles, each showing a live web port of a Fact Machine component centered on a bg-card surface."
    - "The consensus dial responds to pointer drag: dragging updates its numeric readout and fires onChange with the rounded percentage."
    - "Every looping animation (pixel loader, gradient text, dashed line, gradient pill) stops under prefers-reduced-motion; the CRT static renders a single frame instead of looping."
    - "The section carries an honest one-line note that these are rebuilt for the web from the original React Native source of Fact Machine, a client app."
    - "No new npm dependencies are added: ports are plain React plus CSS transforms/animations plus canvas plus pointer events only."
  artifacts:
    - src/components/lab/consensus-dial.tsx
    - src/components/lab/pixel-loader.tsx
    - src/components/lab/looping-gradient-text.tsx
    - src/components/lab/crt-static-overlay.tsx
    - src/components/lab/glass-control.tsx
    - src/components/lab/animated-dashed-gradient-line.tsx
    - src/components/lab/animated-gradient-pill.tsx
    - src/components/lab/component-lab.tsx
    - src/components/lab/component-lab.test.tsx
  key_links:
    - "page.tsx renders <ComponentLab /> between <Projects /> and <About />."
    - "component-lab.tsx imports and renders all 7 lab components as tiles, each labelled with the source component name the test asserts on."
    - "consensus-dial.tsx exposes an onChange callback that fires on pointer drag (test-verified via fireEvent pointer events)."
    - "globals.css defines the shared lab keyframes plus one prefers-reduced-motion rule that pauses elements carrying the lab-animated class."
---

<objective>
Build a "Component Lab" section that showcases seven faithful web ports of Fact Machine
mobile components. Each source component is a React Native / Reanimated / Skia component
that we rebuild using plain React, CSS transforms and animations, canvas, and pointer
events only (no react-native-web, no reanimated, no skia, no new npm dependencies). The
centrepiece is an interactive drag-to-set consensus dial whose tick strip slides under a
fixed marker with a numeric readout that updates live.

Purpose: prove, through touchable web demos, that Daniel ships polished interactive
product work, using components rebuilt from a real client app (Fact Machine).
Output: 7 lab component files, 1 section, 1 vitest file, small edits to page.tsx and
globals.css. No new dependencies.

Source reference (read-only, OUTSIDE this repo, in factmachine-monorepo/apps/mobile):
- components/consensus-dial/ (consensus-dial.tsx, dial-model.ts, use-consensus-dial.ts, consensus-dial-marker.tsx, consensus-dial-readout.tsx, consensus-tick-strip.tsx)
- components/PixelLoader.tsx, components/LoopingGradientText.tsx, components/CrtStaticOverlay.tsx, components/GlassControl.tsx, components/AnimatedDashedGradientLine.tsx, components/market/AnimatedGradientPill.tsx
- constants/{colors,animations,spacing,typography}.ts (for exact numeric values)

Faithful-lazy scope (ponytail, documented so the executor does not over-build):
- All source accents (warm/orange, sweep glow stops, etc.) map to Solana purple: the CSS token var(--primary). Solana green var(--live) is reserved and not used here.
- The dial glow window is reproduced by per-tick opacity (a direct port of getGlowOpacityAt), not a masked gradient. Fling on release ports projectValueFromRelease with a lightweight pointer-velocity estimate; settle is a CSS transition, not a Reanimated spring.
- CrtStaticOverlay ports the core looping static noise via canvas (this repo has no noise PNG assets); the native visible/dismiss lifecycle and ignition sequence are dropped for an always-on showcase tile.
- GlassControl ports the frosted-glass surface via backdrop-filter; the native pressable/haptic/recipe system is dropped (a static showcase panel with sample content).
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/app/page.tsx
@src/app/globals.css
@src/components/sections/Projects.tsx
@src/components/sections/Projects.test.tsx
@src/components/ui/phone-frame.tsx
@src/components/canvas/NetworkCanvas.tsx
@vitest.config.ts
@vitest.setup.ts

Design tokens (globals.css, dark-only): var(--primary) is Solana purple #9945ff, the single
accent; var(--live) is Solana green #14f195, reserved and NOT used here; var(--card) is the
tile surface; var(--muted-foreground) is subdued text; var(--border) is hairlines. Read tokens
via Tailwind classes (bg-card, text-primary, text-muted-foreground) or var(--token) in inline
styles. Do NOT hardcode new hex colors.

Repo code style (match exactly, see Projects.tsx and NetworkCanvas.tsx): 2-space indent,
double quotes, NO semicolons in src/components, kebab-case filenames under lab/ (like
phone-frame.tsx), PascalCase exports.

Hard bans (user-locked): NO em dashes anywhere in shipped copy or comments (use commas,
colons, or periods). NO new npm dependencies. NO react-native-web, reanimated, or skia imports.
Ponytail: minimum faithful code, no speculative props, no config nobody asked for.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Six looping/visual web ports plus shared lab keyframes</name>
  <files>src/app/globals.css, src/components/lab/pixel-loader.tsx, src/components/lab/looping-gradient-text.tsx, src/components/lab/animated-dashed-gradient-line.tsx, src/components/lab/animated-gradient-pill.tsx, src/components/lab/glass-control.tsx, src/components/lab/crt-static-overlay.tsx</files>
  <action>
    First add the shared keyframes and reduced-motion rule to src/app/globals.css (append, do not touch existing tokens). Define: keyframe lab-pixel with 0% and 100% at opacity 0.25 and 50% at opacity 1; keyframe lab-shimmer moving background-position from 200% 0 to -200% 0; keyframe lab-dash translating transform translateY from -100% to 100%; a registered custom property lab-angle of syntax angle, non-inheriting, initial 0deg, plus keyframe lab-rotate ending at lab-angle 360deg. Add one media block for prefers-reduced-motion reduce that sets animation none on the class lab-animated. Every looping element below carries className lab-animated so reduced motion pauses it centrally.

    Create the six components, each a "use client" file (they use browser CSS animations, and one uses canvas). Port faithful numeric values from the named source files. Keep each component to the essentials described. Where the source uses its own accent color, use var(--primary).

    pixel-loader.tsx (port of PixelLoader.tsx): render a 4 by 4 grid (GRID 4, CELL_SIZE 10px, CELL_GAP 2.5px) of small squares filled with var(--primary). Give each cell the lab-pixel animation, duration 1400ms linear infinite, with a negative animation-delay proportional to its diagonal index row plus col over the 7 diagonals (delay in ms equals negative of (row plus col) divided by 7 times 1400) so the bright wave travels diagonally, matching the source diagonal brightness wave. Wrap the grid role progressbar aria-label Loading. Cells carry lab-animated.

    looping-gradient-text.tsx (port of LoopingGradientText.tsx): render a headline word (use "Fact Machine") as text with the moving shimmer. Use background-clip text (color transparent, -webkit-background-clip text and background-clip text) with a horizontal linear-gradient whose mid stop is var(--primary) and outer stops are the muted base color, background-size around 200% to 400%, animated with lab-shimmer over 4000ms linear infinite. Element carries lab-animated. Keep it a single styled element, no measurement layer.

    animated-dashed-gradient-line.tsx (port of AnimatedDashedGradientLine.tsx): render a vertical connector (width 4px, height around 80px). Build the dashed pattern with a CSS mask using a repeating-linear-gradient to top (dashLength 10, dashGap 10) so the line is a stack of rounded dashes; fill the base with a muted color, and overlay a purple gradient highlight (transparent to var(--primary) to transparent) inside the masked region that sweeps down via lab-dash over 3000ms linear infinite. Highlight element carries lab-animated. pointer-events none.

    animated-gradient-pill.tsx (port of AnimatedGradientPill.tsx): render a rounded-full pill with a rotating sweep-gradient border in purple. Use the border technique: background composited as a solid fill (var(--card) or a subtle fill) via padding-box plus a conic-gradient from var(--lab-angle) through purple stops via border-box, with a 2px transparent border; animate lab-rotate over 3000ms linear infinite so the conic sweep revolves seamlessly. Show a short label (for example "Live") in var(--primary) centered inside. Optionally include a small lucide-react icon (already a dependency) sized 14. Pill carries lab-animated.

    glass-control.tsx (port of GlassControl.tsx): render a frosted-glass panel: a rounded container with backdrop-filter blur (around 12px), a semi-transparent light fill, a hairline border using var(--border), a subtle shadow, and a faint var(--primary) tint. Put simple sample content inside (a short label, optionally a lucide icon) so the frosted surface is visible over the tile. No pressable, haptic, or recipe props. Static.

    crt-static-overlay.tsx (port of CrtStaticOverlay.tsx): render a small framed box containing a canvas that draws grayscale CRT static. Follow the NetworkCanvas pattern for the effect body: in a useEffect get the 2D context and bail out rendering nothing if it is null or setup throws; check window.matchMedia prefers-reduced-motion reduce. When motion is allowed, redraw random grayscale noise on an interval near 80ms (FRAME_INTERVAL_MS 80) using putImageData or many small fillRect calls at a low internal resolution scaled up; clear the interval on cleanup and pause on visibilitychange hidden. When reduced motion, draw a single noise frame once and do not loop. Keep the canvas sized modestly (for example internal 64 by 64 scaled to fill the tile). aria-hidden true.

    Do not add semicolons in these files; use double quotes and 2-space indent. Zero em dash characters in any comment or string.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>All six lab components compile in the production build; globals.css defines lab-pixel, lab-shimmer, lab-dash, lab-angle plus lab-rotate, and a prefers-reduced-motion rule targeting lab-animated. No RN/reanimated/skia imports and no em dashes: `! grep -rlE "react-native|reanimated|@shopify/react-native-skia|expo-" src/components/lab` passes and `! grep -rl $'\u2014' src/components/lab src/app/globals.css` passes.</done>
</task>

<task type="auto">
  <name>Task 2: Interactive consensus dial (the centrepiece)</name>
  <files>src/components/lab/consensus-dial.tsx</files>
  <action>
    Create src/components/lab/consensus-dial.tsx as a self-contained "use client" component that ports the consensus-dial folder into one file. Signature is minimal and self-managing: props are an optional defaultValue (default 50) and an optional onChange callback of one number. It holds its own displayValue state; no external state wrapper is needed by the section.

    Port the pure math from dial-model.ts exactly (copy the constants and functions, drop the worklet directives): MIN_VALUE 0, MAX_VALUE 100, TICK_COUNT 101, MAJOR_TICK_EVERY 5, TICK_PITCH 8, DRAG_SIGN negative 1; clampPercentValue, roundPercentValue, valueFromTranslation(startValue, translationX, pitch), projectedVelocityTicks(velocityX, pitch) using VELOCITY_PROJECTION_WINDOW_S 0.08 and MAX_VELOCITY_THROW_TICKS 14, projectValueFromRelease(currentValue, velocityX, pitch), and getGlowOpacityAt(index, value, radius 5) using TICK_BASE_OPACITY 0.4 and TICK_GLOW_OPACITY 0.6.

    Layout (port consensus-tick-strip.tsx dimensions): a readout above a fixed-height track. The track is a relative, overflow-hidden box, height 48 (TRACK_HEIGHT), full width up to a max around 500. The tick strip is absolutely positioned left 50 percent and translated on the x axis by negative displayValue times TICK_PITCH so the current value sits under the center marker. Render all 101 ticks absolutely at left index times TICK_PITCH: width 2 (TICK_WIDTH), rounded, height 14 for major ticks (index divisible by 5, MAJOR_TICK_HEIGHT) else 8 (MINOR_TICK_HEIGHT), vertically centered. Color every tick var(--primary); set each tick opacity to getGlowOpacityAt(index, displayValue) when the dial has been touched, else the flat base opacity 0.4, reproducing the glow window under the marker. Add a fixed center marker (port consensus-dial-marker.tsx): a 2 by 20 rounded caret in var(--primary) plus a small CSS triangle (6 wide, 3 tall) above it in var(--primary), both pointer-events none. Add left and right edge fades (port EDGE_FADE_WIDTH 48): two absolutely positioned overlays fading from the tile surface color var(--card) to transparent, pointer-events none.

    Readout (port consensus-dial-readout.tsx): above the track, centered, a large number (around text-5xl to text-6xl, semibold) showing Math.round(displayValue) followed by a percent sign. Color is var(--primary) when touched, else the muted text color, matching the resting-versus-touched behavior.

    Pointer interaction (port use-consensus-dial.ts and the Gesture.Pan handlers to pointer events): on the track use onPointerDown to guard-capture the pointer (call setPointerCapture only if it exists, for jsdom safety), record startClientX and startValue equal to current displayValue, mark touched true, and set a dragging flag. On onPointerMove while dragging, compute translationX as clientX minus startClientX, set displayValue to valueFromTranslation(startValue, translationX, TICK_PITCH), and when Math.round(displayValue) changes from the last emitted rounded value, call onChange with the new rounded value (dedupe like the source publishValue). Track pointer velocity from the last move sample (delta clientX over delta time in seconds). On onPointerUp, release capture if present, clear the dragging flag, compute a target via projectValueFromRelease(displayValue, velocityX, TICK_PITCH), emit onChange for the target if its rounded value changed, and settle displayValue to the target.

    Settle and reduced motion: apply a CSS transition on the strip transform only when NOT dragging (for example 250ms with easing cubic-bezier 0.4, 0, 0, 1, approximating the source IN_DEFAULT curve); during drag set transition none so the strip tracks the finger exactly. Read prefers-reduced-motion via matchMedia once; when reduced, use transition none on settle and jump straight to the target.

    Accessibility: give the track role slider with aria-valuemin 0, aria-valuemax 100, aria-valuenow the rounded value, and an aria-label such as Consensus percentage. touchAction none on the track so the browser does not scroll during drag.

    No semicolons, double quotes, 2-space indent, zero em dashes.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>consensus-dial.tsx compiles in the production build, exposes role slider with a numeric readout, and on pointer drag translates the tick strip and fires onChange with rounded values. No RN/reanimated/skia imports: `! grep -rlE "react-native|reanimated|skia" src/components/lab/consensus-dial.tsx` passes.</done>
</task>

<task type="auto">
  <name>Task 3: Component Lab section, page wiring, and the vitest file</name>
  <files>src/components/lab/component-lab.tsx, src/app/page.tsx, src/components/lab/component-lab.test.tsx</files>
  <action>
    Create src/components/lab/component-lab.tsx as a server component exporting ComponentLab (no "use client"; it renders client children, exactly like Projects.tsx renders PhoneFrame). Match the existing section shell: a section with id lab and className "mx-auto max-w-3xl px-6 py-16 md:py-24", an h2 "Component Lab" with className "text-2xl font-semibold md:text-3xl", and directly under it one honest note paragraph in text-muted-foreground reading exactly: "Rebuilt for the web from the original React Native source of Fact Machine, a client app." (no em dash).

    Below the note render a responsive grid (for example "mt-8 grid gap-6 sm:grid-cols-2"). Define an inline array of 7 tiles, each with a name, a one-line description, and the rendered node. Use these names and short descriptions (keep descriptions to one line each): Consensus Dial (drag to set a percentage; the tick strip slides under a fixed marker with a live readout); Pixel Loader (a 4 by 4 grid with a diagonal brightness wave on a 1400ms cycle); Looping Gradient Text (a headline with an endlessly cycling gradient shimmer); CRT Static Overlay (canvas-drawn CRT static noise); Glass Control (a frosted-glass control surface); Animated Dashed Gradient Line (a dashed connector with a sweeping gradient highlight); Animated Gradient Pill (a pill with a rotating sweep-gradient border). Render the consensus dial tile so it can span the full width on wider screens (for example sm:col-span-2) since it is the centrepiece and is interactive.

    Each tile is a div with className including "bg-card" and rounded padding (for example "flex flex-col gap-3 rounded-lg bg-card p-6"), with the live component centered in a min-height area (for example a "flex min-h-40 items-center justify-center" wrapper), then an h3 with the component name (text-lg font-semibold) and a p with the description (text-sm text-muted-foreground). The h3 must render the exact name string so the test can find it by heading role.

    Edit src/app/page.tsx: import ComponentLab from "@/components/lab/component-lab" and render <ComponentLab /> between <Projects /> and <About />. Change nothing else.

    Create the single vitest file src/components/lab/component-lab.test.tsx (double quotes, no semicolons, mirror the style of Projects.test.tsx and network-canvas.test.tsx). It has two parts. Part one: render <ComponentLab /> and assert that each of the 7 component names appears as a heading (getByRole heading with the name), and assert the section landmark container has id lab. Part two: render <ConsensusDial onChange={spy} /> with a vi.fn spy, get the slider by role, then fireEvent.pointerDown on it with a clientX (for example 200) and a pointerId, fireEvent.pointerMove with a smaller clientX (for example 120, moving left so the value increases), and fireEvent.pointerUp; assert the spy was called and that its most recent call argument is a number that changed from the default 50. Note the dial math uses only clientX deltas, so it works in jsdom without layout; guard code already makes setPointerCapture optional.

    No semicolons in the section file (src/components lives under the no-semicolon rule); test files elsewhere in the repo also use no semicolons, so match that. Zero em dashes anywhere.
  </action>
  <verify>
    <automated>npm test -- component-lab && npm run build</automated>
  </verify>
  <done>component-lab.test.tsx passes: the section renders all 7 named tiles and has id lab, and the dial fires onChange with a changed numeric value on pointer drag. Production build succeeds with ComponentLab wired between Projects and About. `! grep -rl $'\u2014' src/components/lab src/app/page.tsx` passes (no em dashes).</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| (none crossed) | All 7 ports render locally in the browser from static component code. No network requests, no user-supplied data, no external input, no secrets, and no new packages are installed. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-LKN-01 | Tampering | supply chain (package.json) | low | mitigate | Locked constraint: zero new npm dependencies. Verified by `! grep -rlE "react-native\|reanimated\|@shopify/react-native-skia\|expo-" src/components/lab`; ports use only React, existing lucide-react, CSS, and canvas. |
| T-LKN-02 | Denial of Service | crt-static-overlay animation loop | low | mitigate | Canvas noise interval is cleared on unmount and paused on visibilitychange hidden; a null 2D context or thrown setup renders nothing (NetworkCanvas pattern), so a missing/limited canvas cannot crash the page. |
| T-LKN-03 | Information disclosure | all lab components | low | accept | Components render only static visual demos; no user data, storage, or network is touched, so there is nothing to disclose. |
</threat_model>

<verification>
- `npm test -- component-lab` passes: 7 named tiles render, section id is lab, and the dial fires onChange with a changed numeric value on pointer drag.
- `npm run build` succeeds with all 7 ports plus the wired ComponentLab section.
- No new dependencies and no forbidden imports: `! grep -rlE "react-native|reanimated|@shopify/react-native-skia|expo-" src/components/lab`.
- No em dashes in shipped files: `! grep -rl $'\u2014' src/components/lab src/app/page.tsx src/app/globals.css`.
- ComponentLab appears between Projects and About in src/app/page.tsx.
</verification>

<success_criteria>
- A "Component Lab" section sits between Projects and About with 7 faithful web-port tiles, each named and described on a bg-card surface, plus the honest one-line Fact Machine note.
- The consensus dial is interactive: pointer drag slides the tick strip under the fixed marker, updates the live readout, and fires onChange with the rounded percentage.
- Looping animations pause under prefers-reduced-motion; the CRT static renders a single frame instead of looping.
- All accents use var(--primary); no new npm dependencies; no react-native-web, reanimated, or skia; no em dashes.
- The single vitest file is green and the production build is green.
</success_criteria>

<output>
Create `.planning/quick/260710-lkn-component-lab-web-ports-of-7-fact-machin/260710-lkn-SUMMARY.md` when done.
</output>
