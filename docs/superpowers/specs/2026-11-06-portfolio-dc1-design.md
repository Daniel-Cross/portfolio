# danielcross.dev rebuild: CV page plus the DC-1 drum machine

Date: 2026-11-06
Status: design agreed through 47 rounds of browser mockups; awaiting sign-off on this document before any build.

## Intent

Rebuild danielcross.dev so it is shared, not only read. A recruiter, hiring manager or CTO, usually arriving from LinkedIn and often on a phone, should be able to judge Daniel in ten seconds on a plain page. Anyone curious gets something original to play with that shows taste and product sense: a retro drum machine that can restyle the whole site by decade.

Target: lead or staff mobile roles at crypto companies, mostly US and remote.

## Reference mockup

The final mockup is the visual and behavioural source of truth for everything not spelled out here:

`.superpowers/brainstorm/36086-1793952135/content/round48-emailonly.html`

It is throwaway code, written as layered patches. Do not copy its structure. Rebuild it cleanly and match what it shows and does. Its image files sit beside it in the same folder.

## Goals

- A fast, readable CV page that works without JavaScript for its content and is the landing page.
- A playable drum machine, the DC-1, on a second page to the right of the CV.
- Four decade looks that restyle both pages, tied to four songs.
- Every factual claim on the CV page is either checkable from a public link or is Daniel's own statement about his work. No placeholders, no invented figures.

## Non-goals

- The "portfolio is a phone" concept, the React Native app and the QR code. Dropped.
- Rebuilding interactions from Daniel's apps. The apps are linked, not imitated.
- Case study pages. Not in this version.
- A CMS, analytics dashboards, a contact form.

## Anti-goals

- Copying another OS or app so faithfully that it reads as generic. The earlier iPhone mockup failed for this reason.
- Stat tiles used as decoration. Research on what hiring readers value found they discount activity counts, titles used as achievements, and table-stakes facts.
- Music that starts without the visitor asking.
- Anything from Fact Machine beyond what is public on the App Store. Fact Machine is a client. Do not copy from its private repository. The existing `src/components/lab/fm-palette.ts` says it was copied from there and should not be carried over.

## Constraints

- Stack: stay on the existing Next.js App Router site in this repo, deployed on Vercel to danielcross.dev. (Claude's call, since the React Native idea went with the phone concept.)
- The CV page must be server-rendered text, readable by search engines, and must not load the audio or animation code until the visitor interacts.
- Respect `prefers-reduced-motion`: no background animation loops, no transitions, a single still frame for canvases.
- Keyboard focus visible; all machine controls reachable by keyboard; knobs are sliders with arrow keys.
- Use the personal GitHub account `Daniel-Cross`.
- No em dashes anywhere in copy, comments or commits.
- The old site stays live until Daniel says the new one is ready.
- This document supersedes the older roadmap in `.planning/` (case studies phase) and the stack notes in `.claude/CLAUDE.md` that prescribe a wallet adapter, react-native-web and a dark-only theme.

## Structure

Two full-height pages side by side in a horizontal scroll-snap container. The CV is on the left and is what loads. The machine is on the right. Swiping or the top bar moves between them.

### Top bar (fixed, same order in every look)

1. Name, "Daniel Cross"
2. Play / Pause (label is exactly "Play" or "Pause"; a red light shows when playing)
3. Volume slider (master volume for everything the machine plays)
4. "Go to the machine" / "Back to the CV"
5. Look picker: Clean, 80s, 90s, 00s, 10s
6. Immersion on / off
7. Light / dark (only shown in the Clean look)

The bar stays at the top in every look.

### Looks and immersion

- Immersion on (default): while a song plays, the site takes that song's decade look. When paused it returns to the look selected in the picker.
- Picking a look while nothing is playing leaves immersion on. Picking a look while a song is playing turns immersion off, so the pick is not overridden.
- Immersion off: song and look are independent.
- A change of look wipes across the screen left to right in about 0.75 seconds.
- In every look the name is in capitals and the bar order is unchanged.
- The machine itself keeps the same appearance in every look.

### CV page content (final copy is in the mockup)

- Hero: name in very large wide capitals; photo; one-line pitch; three-sentence bio; one button, Email me (hello@danielcross.dev). There is no Book a call button and no CV download; Daniel removed both. On wide screens the name is left and the rest is right. On narrow screens it stacks with the photo first.
- What I do: four cards (Mobile, Crypto, Shipping, Leading), each a claim plus a line of tools.
- Work: seven cards in this order: Fact Machine, Use AI, MetaMask Mobile, Ahlsell, Yomento, Booking.com, Skiddle. No dates. Each has a role (set directly under the company name, in the accent colour, larger than other labels), one or two sentences leading with what Daniel did, real proof links, and screenshots. Fact Machine is a full-width feature card; the rest are two across on wide screens.
- Projects: four cards: Football Alpha (early access), Haven (on the App Store), Neo, Bandwagon (coming soon, black banner, no links).
- No stat boxes. No "What managers say" section.

Content rules that came out of fact-checking:

- MetaMask: claim Snaps dynamic UI on mobile and Solana send and transaction screens, with links to pull requests 12429, 15799, 16073 and the list of all 31 merged pull requests (May 2024 to June 2025). Do not claim Bitcoin or Tron unless Daniel confirms his part.
- Football Alpha lives in `~/Projects/regista`; its public site says early access.

### Clean look

- Light by default for every visitor, whatever their system setting. Dark is a variant the visitor switches to with the Light / dark button.
- One warm surface colour with soft raised and inset shadows (neumorphism), used sparingly: cards raised, only the primary button solid orange, other buttons thin outlines.
- A soft recessed frame around the whole window.
- Type: Mona Sans, extended width, heavy weight, capitals for the name and headings; Mona Sans regular for body; Martian Mono, small tracked capitals, for labels and buttons. All are free on Google Fonts.
- Accent orange `#E8501C`; a three-line stripe in red, orange and yellow as the recurring motif.

### Decade looks

Each is a full restyle of both pages plus an animated canvas behind the content that reacts to the kick drum. Exact styling is in the mockup.

| Look | Song | Style | Canvas |
|---|---|---|---|
| 80s | 80s Synth | Neon grid on deep purple, chrome-gradient italic name, pink and cyan block shadows | Striped sun and a grid rushing toward the viewer |
| 90s | 90s Dance | Windows 95 desktop: teal, grey windows with navy title bars, pixel-lettered name | Bouncing coloured lines, like the Mystify screensaver |
| 00s | 00s House | Windows XP: sky and green hill, blue rounded windows, name label styled as the green Start button | Drifting clouds |
| 10s | 10s Lo-fi | Late-night study stream: dim indigo, amber glow, rainy window with a cat in place of the photo, LIVE badge, tape overlay, chat box, katakana name under the name | Rain and soft city lights |

### The DC-1

A soft-plastic retro drum machine. Landscape on wide screens, portrait on narrow ones, sized to fit the window with room below for its tray. Title "The DC-1" above it and nothing else beside it.

Controls:

- Screen: selected pad and sound; tempo and bar; song name or "Press play"; a one-line instruction for the selected pad; the current key; the four bar chords (tappable).
- Four song buttons in decade order: 80s Synth, 90s Dance, 00s House, 10s Lo-fi. Tapping one loads it and starts playing. Lo-fi is the default.
- Four dials: Tempo, Tone, Echo, Reverb.
- Sixteen step keys in red, orange, yellow and cream groups of four, each with a light.
- Six pads: Kick, Snare, Hat, Bass, Keys, Lead.
- Play/Stop, Clear, Share.

Editing:

- Drum pads: step keys toggle hits.
- Lead: tapping a step opens a tray that slides out under the machine with a two-octave piano keyboard. Picking a key sets that step's note. Notes in the song's key carry a dot. The tray has Octave down, Octave up, Remove note and Done. A placed note plays on that step in all four bars and overrides the song's written melody for that step.
- Chords: tapping a chord on the screen opens the tray with the chords of the song's key ("In key") and of the parallel major or minor ("Borrowed"). A Sevenths switch, off by default, changes the list between triads and seventh chords. Key down and Key up transpose the whole song (chords, written melody, placed notes). A Major/minor button changes only which chords are offered.
- Bass and keys follow the bar chords.

Sound: everything is synthesised with the Web Audio API. No audio files. A limiter on the master output, plus echo and reverb sends. Each song defines tempo, swing, a four-bar chord loop, a one-bar pattern per pad, a written four-bar melody and its own instrument sounds. Song definitions are in the mockup script.

Share copies a link that restores the loop. In the mockup it carries only the step patterns, tempo and song.

## Ideas tried and rejected (do not reintroduce)

- A working iPhone on the page; a draggable design board on a cutting mat.
- A synth voice singing the pitch line.
- Extra Japanese decoration in the lo-fi look beyond the katakana name.
- GeoCities and MySpace versions of the 90s and 2000s.
- Rows of note and chord buttons on the machine; Note and Chord dials.
- Stat boxes with three numbers per job.
- Project information on the machine's screen.

## Left to the builder

- Component and file structure, state management, test approach.
- How the audio and canvas code is split and lazy-loaded.
- Image formats and sizes, using original files where they exist.
- Exact responsive breakpoints.

## Open before this can go live

These need Daniel's answer or more design work. They are listed here so the plan can schedule them.

1. Phone layout. Most visitors are on phones and no mockup round checked a phone-sized screen. In the mockup the machine shrinks until its keys are too small to tap, the tray opens off-screen, a swipe that starts on the machine cannot go back to the CV, and the seven-control top bar does not fit. Decision (Claude's call, for Daniel to approve when he sees it): the build starts with a phone design pass, shown to Daniel for sign-off before the top bar, machine and tray are built. On phones the machine page may scroll and need not fit the window, and the top bar keeps Play/Pause and the page switch visible with the rest behind a menu.
2. Whether Share should also carry chords, key and placed notes.
3. Image sources. Several mockup images are screen-resolution browser captures of store listings and live sites.
4. Search and sharing basics: title and description, share preview image, person structured data, sitemap.
