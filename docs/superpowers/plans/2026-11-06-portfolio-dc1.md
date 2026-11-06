# danielcross.dev Rebuild (CV + DC-1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current one-page site with a server-rendered CV page plus a lazily loaded, playable drum machine and four decade looks, matching the approved mockup.

**Architecture:** The CV is a server component built from typed content files. A thin client shell adds the two-page deck, the top bar and look switching. The machine, audio engine and background canvases live in their own client modules and are loaded with `next/dynamic` only when the visitor presses Play or goes to the machine. All music logic (theory, songs, sharing, state) is pure TypeScript with unit tests; React components are thin.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, plain CSS files (no Tailwind), `next/font/google`, Web Audio API, Canvas 2D, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-06-portfolio-dc1-design.md`. Visual and behavioural reference: `.superpowers/brainstorm/36086-1793952135/content/round48-emailonly.html` (throwaway code; match what it shows and does, do not copy its structure).

## Global Constraints

- Work on branch `rebuild-dc1`. Do not push to `main` or change the production deployment until Daniel says go.
- The repo's GSD workflow is waived for this rebuild (Daniel, 2026-11-06). Do not edit `.planning/`.
- CV content renders on the server and is readable with JavaScript off. Audio and canvas code must not be in the initial page bundle.
- No placeholders and no invented figures. The strings "need from you", "Bitcoin" and "Tron" must not appear in rendered CV content.
- Fact Machine: only App Store material. Do not carry over `src/components/lab/fm-palette.ts` or anything else copied from its repository.
- Respect `prefers-reduced-motion`: no animation loops, no look transition, one still canvas frame.
- No em dashes in copy, comments or commit messages.
- Music never starts without a visitor action.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. A malformed or old share link (`#garbage`, a hash from the mockup format): the page loads the default song and does not throw. Test in Task 7.
2. `AudioContext` missing or refused (old browser, autoplay policy): pressing Play does not throw and the button returns to "Play". Test in Task 6.
3. A 320px-wide viewport: the CV page has no horizontal overflow and every top bar control is reachable. Check in Task 3 and Task 11.
4. The tab is hidden for a minute while playing: on return the sequencer resumes in time without firing a burst of queued steps. Test in Task 6.
5. Reduced motion is on: changing look applies instantly and no `requestAnimationFrame` loop is left running. Test in Task 9.

---

## File structure

```
src/app/layout.tsx            fonts, metadata, JSON-LD, <html data-theme>
src/app/page.tsx              server page: <Shell><Cv/></Shell>
src/app/sitemap.ts, robots.ts, opengraph-image.tsx
src/content/site.ts           name, role, pitch, bio, email, links
src/content/skills.ts         four "What I do" cards
src/content/work.ts           seven work cards with proof links and images
src/content/projects.ts       four project cards
src/cv/Cv.tsx, Hero.tsx, Skills.tsx, Work.tsx, Projects.tsx   server components
src/shell/Shell.tsx           client: deck, top bar, look state, lazy machine
src/shell/TopBar.tsx
src/looks/looks.ts            Look type, effectiveLook(), pickLook()
src/looks/FxCanvas.tsx        client canvas host
src/looks/fx/e80.ts e90.ts e00.ts e10.ts   draw functions
src/machine/theory.ts         notes, chords, keys, transposition
src/machine/songs.ts          the four songs
src/machine/state.ts          MachineState, reducer, actions
src/machine/share.ts          encodeLoop(), decodeLoop()
src/machine/engine.ts         Web Audio voices and master chain
src/machine/sequencer.ts      scheduler
src/machine/Machine.tsx       client root of the machine
src/machine/ui/Lcd.tsx Knob.tsx Steps.tsx Pads.tsx Tray.tsx
src/styles/tokens.css base.css cv.css shell.css machine.css
src/styles/looks/e80.css e90.css e00.css e10.css
public/work/*                 screenshots and banners
public/daniel.jpg
```

Tests sit beside their module as `*.test.ts(x)`.

---

### Task 1: Phone design sign-off (gate)

No product code. The spec leaves the phone layout open and says it must be approved before the bar, machine and tray are built.

**Files:**
- Create: `.superpowers/brainstorm/36086-1793952135/content/round49-phone.html`

- [ ] **Step 1:** Copy the reference mockup and adapt it for a 390px-wide screen: top bar shows name, Play/Pause, a page-switch button and a "Menu" button that opens volume, look, immersion and light/dark; the machine page scrolls vertically instead of scaling to fit; step keys at least 36px wide (two rows of eight); the tray opens as a bottom sheet with piano keys at least 30px wide (one octave visible, Octave buttons to move); horizontal swipe between pages works when started on the title or screen areas, and the top bar switch always works.
- [ ] **Step 2:** View it at 390x844 and 320x568 in the browser and confirm nothing overflows sideways and the tray is fully on screen.
- [ ] **Step 3:** Show Daniel and wait. Record his decisions in the spec under "Open before this can go live", item 1. **Do not start Task 3 or Task 8 before this is approved.** Tasks 2, 4 to 7 do not depend on it.

### Task 2: Clean slate, content and the CV page

**Files:**
- Delete: `src/components/**`, `src/lib/**`, `src/content/employers.ts`, `src/app/__smoke__.test.tsx`, `components.json`, `public/factmachine/**`, `public/screenshots/**`, `public/*.svg`
- Modify: `package.json` (remove `@base-ui/react`, `class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`, `tw-animate-css`, `shadcn`, `tailwindcss`, `@tailwindcss/postcss`), delete `postcss.config.mjs`
- Create: `src/content/{site,skills,work,projects}.ts`, `src/cv/*.tsx`, `src/styles/{tokens,base,cv}.css`, `src/app/{layout,page}.tsx`, `public/work/*`, `public/daniel.jpg`
- Test: `src/content/content.test.ts`, `src/cv/Cv.test.tsx`

**Interfaces:**
- Produces:
  - `type Proof = { label: string; href: string; note: string }`
  - `type WorkCard = { slug: string; name: string; role: string; text: string; proof: Proof[]; tint: string; shots: { src: string; alt: string }[]; shotLayout: 'pair' | 'phone' | 'web' }`
  - `type ProjectCard = { slug: string; name: string; status?: string; text: string; links: { label: string; href: string }[]; banner?: { src: string; alt: string } }`
  - `export const work: WorkCard[]`, `export const projects: ProjectCard[]`, `export const skills: { name: string; claim: string; tools: string }[]`, `export const site`
  - `export function Cv(): JSX.Element` (server component, no props)

- [ ] **Step 1: Write the failing content test** in `src/content/content.test.ts`:

```ts
import { work, projects, skills, site } from './index'
test('work cards are the seven agreed, in order', () => {
  expect(work.map(w => w.name)).toEqual(['Fact Machine','Use AI','MetaMask Mobile','Ahlsell','Yomento','Booking.com','Skiddle'])
})
test('projects are the four agreed, in order', () => {
  expect(projects.map(p => p.name)).toEqual(['Football Alpha','Haven','Neo','Bandwagon'])
})
test('no placeholders or unverified chain claims anywhere', () => {
  const all = JSON.stringify({ work, projects, skills, site })
  for (const banned of ['need from you', 'Bitcoin', 'Tron', '—']) expect(all).not.toContain(banned)
})
test('every proof link is https and MetaMask links its pull requests', () => {
  for (const w of work) for (const p of w.proof) expect(p.href).toMatch(/^https:\/\//)
  const mm = work.find(w => w.slug === 'metamask')!
  expect(mm.proof.map(p => p.href).join(' ')).toMatch(/pull\/12429.*pull\/15799.*pull\/16073/)
})
test('Bandwagon has no links', () => { expect(projects[3].links).toEqual([]) })
```

- [ ] **Step 2:** Run `npx vitest run src/content` and see it fail (module missing).
- [ ] **Step 3:** Create the content files. Copy every string and link exactly from the reference mockup's CV page (hero pitch and bio, four skill cards, seven work cards with their proof links, four project cards). `site.email = 'hello@danielcross.dev'`. Add `src/content/index.ts` re-exporting all four.
- [ ] **Step 4:** Copy images into `public/work/`: Fact Machine and MetaMask from `~/Downloads/linkedin-media/` (originals), `ahlsell.png` and `neo-splash.png` from the old `public/screenshots/` before deleting it, and the remaining captures from the mockup folder. Copy `~/Documents/Work/daniel.jpg` to `public/daniel.jpg`.
- [ ] **Step 5: Write the failing render test** in `src/cv/Cv.test.tsx`: render `<Cv />`; assert an `h1` with text "Daniel Cross"; exactly one link named "Email me" with `href="mailto:hello@danielcross.dev"`; no element with text "Book a call" or "Download CV"; headings "What I do", "Work", "Projects" in that order; 7 `article`s inside the Work section.
- [ ] **Step 6:** Implement the `src/cv` components and `src/styles/{tokens,base,cv}.css` for the Clean look (dark and light via `html[data-theme]`), using class names of your choice. Load Mona Sans (variable, width axis), Martian Mono, Doto and Michroma with `next/font/google` in `layout.tsx`. Remove Tailwind and the old components and dependencies listed above.
- [ ] **Step 7:** `npx vitest run` passes; `npm run build` succeeds; `npm run lint` is clean.
- [ ] **Step 8:** Commit: `feat: server-rendered CV page with verified content`.

### Task 3: Shell, deck and top bar

Depends on Task 1 approval for the phone bar.

**Files:**
- Create: `src/shell/Shell.tsx`, `src/shell/TopBar.tsx`, `src/styles/shell.css`
- Modify: `src/app/page.tsx`
- Test: `src/shell/TopBar.test.tsx`

**Interfaces:**
- Consumes: `effectiveLook`, `pickLook`, `Look` from Task 4.
- Produces: `Shell({ children }: { children: React.ReactNode })`. Renders children in the left pane and, once requested, the lazily imported `Machine` in the right pane. Owns `page: 0 | 1`, `playing`, `volume`, `picked: Look`, `immersion: boolean`, `theme: 'light' | 'dark'`, and sets `data-era` and `data-theme` on `<html>`.
- `TopBar` props: `{ page, playing, volume, look, immersion, onPlay, onVolume, onGo, onPickLook, onImmersion, onTheme }`.

- [ ] **Step 1: Failing test:** render `TopBar` with `page=0, playing=false, look='clean'`; assert controls appear in DOM order: text "Daniel Cross", button "Play", slider "Music volume", button "Go to the machine", combobox "Look of the site", button "Immersion on", button "Light / dark". With `playing=true` the button is named exactly "Pause". With `page=1` the button is "Back to the CV". With `look='e90'` there is no "Light / dark" button.
- [ ] **Step 2:** Run and see it fail.
- [ ] **Step 3:** Implement `TopBar` and `Shell`. Deck is a horizontal scroll-snap container with two full-height panes; `onGo` scrolls to the other pane; a scroll listener keeps `page` in sync. Add the recessed window frame for the Clean look. Apply the phone bar from Task 1. Import `Machine` with `next/dynamic({ ssr: false })` only after the first Play press or the first move to page 1.
- [ ] **Step 4:** Test passes. In the browser at 1470px and 320px wide: no sideways overflow on the CV pane; the bar's controls are all reachable.
- [ ] **Step 5:** Commit: `feat: two-page shell and top bar`.

### Task 4: Look logic and the four decade skins

**Files:**
- Create: `src/looks/looks.ts`, `src/styles/looks/{e80,e90,e00,e10}.css`
- Test: `src/looks/looks.test.ts`

**Interfaces:**
- Produces:
  - `type Look = 'clean' | 'e80' | 'e90' | 'e00' | 'e10'`
  - `effectiveLook(s: { immersion: boolean; playing: boolean; songLook: Look; picked: Look }): Look`
  - `pickLook(s: { immersion: boolean; playing: boolean }, look: Look): { picked: Look; immersion: boolean }`

- [ ] **Step 1: Failing test:**

```ts
test('immersion follows the song only while playing', () => {
  expect(effectiveLook({ immersion: true, playing: true, songLook: 'e80', picked: 'clean' })).toBe('e80')
  expect(effectiveLook({ immersion: true, playing: false, songLook: 'e80', picked: 'e90' })).toBe('e90')
  expect(effectiveLook({ immersion: false, playing: true, songLook: 'e80', picked: 'e10' })).toBe('e10')
})
test('picking a look turns immersion off only if a song is playing', () => {
  expect(pickLook({ immersion: true, playing: false }, 'e00')).toEqual({ picked: 'e00', immersion: true })
  expect(pickLook({ immersion: true, playing: true }, 'e00')).toEqual({ picked: 'e00', immersion: false })
})
```

- [ ] **Step 2:** Run, fail. **Step 3:** Implement. **Step 4:** Pass.
- [ ] **Step 5:** Write the four skin stylesheets against `html[data-era="..."]`, matching the mockup: 80s neon grid; 90s Windows 95 (teal, grey windows, navy title bars, pixel name, yellow folder icon on section headings); 00s Windows XP (sky and hill background, blue rounded windows, red close box, name label as the green Start-style button, Play as a normal taskbar button); 10s lo-fi stream (indigo, amber glow, grain, rainy window with cat in place of the photo, LIVE badge, tape overlay, chat box on the CV page only, katakana ダニエル・クロス under the name). In every skin the name is capitals and the bar stays at the top in the same order. Load skin-only fonts (Audiowide, Pixelify Sans, Zen Maru Gothic, Caveat, VT323) with `preload: false`.
- [ ] **Step 6:** Look change uses `document.startViewTransition` with a left-to-right wipe of 0.75s when available and motion is allowed; otherwise it applies instantly.
- [ ] **Step 7:** Check each look in the browser on both panes. Commit: `feat: decade looks and immersion`.

### Task 5: Music theory

**Files:** Create `src/machine/theory.ts`; Test `src/machine/theory.test.ts`

**Interfaces (produces):**
- `type Mode = 'maj' | 'min'`; `type Quality = 'maj' | 'min' | 'dom' | 'm7' | 'maj7'`
- `type Chord = { root: number; quality: Quality }` (root is a pitch class 0 to 11)
- `type Key = { tonic: number; mode: Mode }`
- `noteName(midi: number): string` gives "G4"; `chordName(c: Chord): string` gives "Dm7", "G7", "Cmaj7", "F", "Am"
- `chordTones(c: Chord): number[]` semitone offsets
- `keyChords(key: Key, sevenths: boolean): Chord[]` (diminished degree skipped)
- `borrowedChords(key: Key, sevenths: boolean): Chord[]` (parallel mode, minus any already in key)
- `inKey(pc: number, key: Key): boolean`
- `transposeKey(key: Key, semitones: number): Key`, `transposeChord(c: Chord, semitones: number): Chord`
- `freq(midi: number): number`

- [ ] **Step 1: Failing tests:**

```ts
test('names', () => {
  expect(noteName(67)).toBe('G4'); expect(noteName(70)).toBe('Bb4')
  expect(chordName({ root: 2, quality: 'm7' })).toBe('Dm7'); expect(chordName({ root: 7, quality: 'dom' })).toBe('G7')
  expect(chordName({ root: 5, quality: 'maj' })).toBe('F')
})
test('C major chords', () => {
  expect(keyChords({ tonic: 0, mode: 'maj' }, false).map(chordName)).toEqual(['C','Dm','Em','F','G','Am'])
  expect(keyChords({ tonic: 0, mode: 'maj' }, true).map(chordName)).toEqual(['Cmaj7','Dm7','Em7','Fmaj7','G7','Am7'])
  expect(borrowedChords({ tonic: 0, mode: 'maj' }, true).map(chordName)).toEqual(['Cm7','Ebmaj7','Fm7','Gm7','Abmaj7','Bb7'])
})
test('transposing up two from C major gives D major', () => {
  expect(transposeKey({ tonic: 0, mode: 'maj' }, 2)).toEqual({ tonic: 2, mode: 'maj' })
  expect(chordName(transposeChord({ root: 2, quality: 'm7' }, 2))).toBe('Em7')
  expect(transposeChord({ root: 11, quality: 'maj' }, 2).root).toBe(1)
})
test('freq', () => { expect(freq(69)).toBeCloseTo(440) })
```

- [ ] **Step 2:** Fail. **Step 3:** Implement. **Step 4:** Pass. **Step 5:** Commit: `feat: music theory helpers`.

### Task 6: Songs, engine and sequencer

**Files:** Create `src/machine/{songs,engine,sequencer}.ts`; Test `src/machine/{songs,sequencer}.test.ts`

**Interfaces:**
- Consumes: `Chord`, `Key`, `freq`, `chordTones` from Task 5; `Look` from Task 4.
- Produces:
  - `type Song = { id: 'e80'|'e90'|'e00'|'e10'; name: string; look: Look; key: Key; bpm: number; swing: number; tone: number; echo: number; reverb: number; chords: Chord[]; patterns: number[]; bassOffsets: Record<number, number>; melody: number[][]; kit: Kit }` where `patterns` is six 16-bit masks in pad order Kick, Snare, Hat, Bass, Keys, Lead, and `melody` is 4 bars of 16 MIDI notes with 0 for rest.
  - `export const songs: Song[]` in order 80s Synth, 90s Dance, 00s House, 10s Lo-fi; `export const defaultSongId = 'e10'`
  - `createEngine(): Engine | null` (null when `AudioContext` is unavailable); `Engine` has `resume(): Promise<void>`, `now(): number`, `setVolume(v)`, `setTone(v)`, `setEcho(v)`, `setReverb(v)`, `setTempo(bpm)`, `trigger(pad: number, time: number, ctx: { song: Song; chord: Chord; step: number; bar: number; note?: number }): void`, `setCrackle(on: boolean)`
  - `type PlayState = { song: Song; bpm: number; patterns: number[]; chords: Chord[]; lead(step: number, bar: number): number }` (`playState` in the test is one built from the default song)
  - `stepTime(start: number, index: number, bpm: number, swing: number): number`
  - `createSequencer(opts: { engine: Engine; getState: () => PlayState; onStep: (step: number, bar: number, time: number) => void }): { start(): void; stop(): void }`

- [ ] **Step 1: Failing tests:**

```ts
test('four songs, each well formed', () => {
  expect(songs.map(s => s.name)).toEqual(['80s Synth','90s Dance','00s House','10s Lo-fi'])
  for (const s of songs) {
    expect(s.chords).toHaveLength(4); expect(s.patterns).toHaveLength(6)
    expect(s.melody).toHaveLength(4); for (const bar of s.melody) expect(bar).toHaveLength(16)
    for (let i = 0; i < 16; i++) { const has = s.melody.some(b => b[i] > 0); expect(!!(s.patterns[5] >> i & 1)).toBe(has) }
  }
})
test('step timing with swing', () => {
  expect(stepTime(10, 0, 120, 0)).toBeCloseTo(10)
  expect(stepTime(10, 4, 120, 0)).toBeCloseTo(10.5)
  expect(stepTime(10, 1, 120, 0.2)).toBeCloseTo(10.125 + 0.2 * 0.125)
})
test('sequencer does not burst after a long gap', () => {
  vi.useFakeTimers(); let clock = 0; const times: number[] = []
  const seq = createSequencer({ engine: { now: () => clock, trigger() {} } as unknown as Engine, getState: () => playState, onStep: (_s, _b, t) => times.push(t) })
  seq.start(); vi.advanceTimersByTime(25); times.length = 0
  clock = 60; vi.advanceTimersByTime(25)
  expect(times.length).toBeLessThanOrEqual(2); for (const t of times) expect(t).toBeGreaterThanOrEqual(60)
})
```

- [ ] **Step 2:** Fail.
- [ ] **Step 3:** Port the four song definitions and every voice from the mockup script (kick, three snare types plus clap and rim, hat, bass, the key types `ep`, `saw`, `filt`, `poly`, lead, vinyl crackle) into `songs.ts` and `engine.ts`. Master chain: voices to a lowpass (Tone), to a compressor used as a limiter (threshold -16 dB, ratio 10), to a master gain (Volume), with echo and convolution reverb sends.
- [ ] **Step 4:** Implement `stepTime` and the sequencer with a 25ms timer and 100ms lookahead. If the next scheduled time is more than 0.2s behind the clock, reset it to now before scheduling.
- [ ] **Step 5:** Add a test that `createEngine()` returns `null` when `globalThis.AudioContext` and `webkitAudioContext` are undefined.
- [ ] **Step 6:** Pass. Commit: `feat: songs, synth engine and sequencer`.

### Task 7: Machine state and share links

**Files:** Create `src/machine/{state,share}.ts`; Test beside each.

**Interfaces:**
- Consumes: Task 5 and Task 6 types.
- Produces:
  - `type Tray = null | { kind: 'note'; step: number } | { kind: 'chord'; bar: number }`
  - `type MachineState = { songId: Song['id']; patterns: number[]; chords: Chord[]; key: Key; shift: number; notes: (number | null)[]; bpm: number; tone: number; echo: number; reverb: number; pad: number; tray: Tray; trayOctave: number; sevenths: boolean; playing: boolean }`
  - `initialState(songId?: Song['id']): MachineState`
  - `reduce(state: MachineState, action: Action): MachineState` with actions `loadSong`, `selectPad`, `tapStep`, `pickNote`, `removeNote`, `tapChord`, `pickChord`, `shiftKey`, `toggleMode`, `toggleSevenths`, `trayOctave`, `closeTray`, `clearPad`, `setKnob`, `setPlaying`
  - `leadNote(state: MachineState, song: Song, step: number, bar: number): number` (0 for rest)
  - `encodeLoop(state: MachineState): string`, `decodeLoop(hash: string): Partial<MachineState> | null`

- [ ] **Step 1: Failing tests** (state):

```ts
test('tapping a step toggles a drum hit', () => {
  const s = reduce(initialState('e10'), { type: 'tapStep', step: 1 })
  expect(s.patterns[0] >> 1 & 1).toBe(1)
})
test('tapping a step on Lead opens the note tray instead', () => {
  let s = reduce(initialState('e10'), { type: 'selectPad', pad: 5 })
  const before = s.patterns[5]
  s = reduce(s, { type: 'tapStep', step: 4 })
  expect(s.tray).toEqual({ kind: 'note', step: 4 }); expect(s.patterns[5]).toBe(before)
})
test('picking a note sets it and turns the step on; it overrides the written melody', () => {
  let s = reduce(initialState('e10'), { type: 'selectPad', pad: 5 })
  s = reduce(reduce(s, { type: 'tapStep', step: 0 }), { type: 'pickNote', midi: 67 })
  expect(s.notes[0]).toBe(67); expect(s.patterns[5] & 1).toBe(1)
  expect(leadNote(s, songs.find(x => x.id === 'e10')!, 0, 2)).toBe(67)
})
test('selecting a drum pad closes the tray; sevenths start off', () => {
  let s = reduce(initialState('e10'), { type: 'tapChord', bar: 1 })
  expect(s.tray).toEqual({ kind: 'chord', bar: 1 }); expect(s.sevenths).toBe(false)
  expect(reduce(s, { type: 'selectPad', pad: 0 }).tray).toBeNull()
})
test('shifting the key moves chords, placed notes and the written melody together', () => {
  let s = initialState('e10'); s = { ...s, notes: s.notes.map((n, i) => i === 3 ? 60 : n) }
  const up = reduce(s, { type: 'shiftKey', by: 2 })
  expect(up.key.tonic).toBe((s.key.tonic + 2) % 12); expect(up.notes[3]).toBe(62)
  expect(up.chords[0].root).toBe((s.chords[0].root + 2) % 12); expect(up.shift).toBe(2)
})
test('major/minor changes the key mode only', () => {
  const s = initialState('e10'); const t = reduce(s, { type: 'toggleMode' })
  expect(t.key.mode).not.toBe(s.key.mode); expect(t.chords).toEqual(s.chords)
})
test('loading a song resets chords, notes, key and closes the tray', () => {
  const s = reduce({ ...initialState('e10'), tray: { kind: 'chord', bar: 0 }, shift: 3 }, { type: 'loadSong', songId: 'e80' })
  const e80 = songs.find(x => x.id === 'e80')!
  expect(s).toMatchObject({ songId: 'e80', chords: e80.chords, key: e80.key, shift: 0, tray: null, patterns: e80.patterns, bpm: e80.bpm })
  expect(s.notes.every(n => n === null)).toBe(true)
})
```

- [ ] **Step 2: Failing tests** (share):

```ts
test('round trip keeps patterns, tempo, song, chords, key and placed notes', () => {
  const s = { ...initialState('e80'), bpm: 131, notes: initialState('e80').notes.map((n, i) => i === 2 ? 72 : n) }
  expect(decodeLoop(encodeLoop(s))).toMatchObject({ songId: 'e80', bpm: 131, patterns: s.patterns, chords: s.chords, key: s.key, notes: s.notes })
})
test('bad input returns null', () => {
  for (const h of ['', '#', '#garbage', '#111110104444555510415155-118-0', '#%%%']) expect(decodeLoop(h)).toBeNull()
})
```

- [ ] **Step 3:** Fail. **Step 4:** Implement. Share format: `#v1.` followed by base64url of a compact JSON array; anything else decodes to `null`. This settles spec open item 2: Share carries chords, key and placed notes.
- [ ] **Step 5:** Pass. Commit: `feat: machine state and share links`.

### Task 8: Machine UI

Depends on Task 1 approval for the phone layout.

**Files:** Create `src/machine/Machine.tsx`, `src/machine/ui/{Lcd,Knob,Steps,Pads,Tray}.tsx`, `src/styles/machine.css`; Test `src/machine/Machine.test.tsx`

**Interfaces:**
- Consumes: everything from Tasks 5 to 7.
- Produces: `Machine(props: { playing: boolean; volume: number; onPlayingChange(p: boolean): void; onSongLook(l: Look): void; onBeat(): void; registerToggle(fn: () => void): void })`, default export for `next/dynamic`.

- [ ] **Step 1: Failing test** (engine mocked to a stub that records `trigger` calls): the screen shows "Press play" and the four chords "Dm7", "G7", "Cmaj7", "Am7"; clicking pad "Lead" then step 5 shows a region containing "Step 5: pick a note" with a button "Remove note"; clicking chord "G7" shows "Bar 2: pick a chord" with a "Sevenths" button whose `aria-pressed` is "false" and chord buttons "C", "Dm", "Em", "F", "G", "Am"; clicking "Key +" changes the screen text "Key of C major" to "Key of C# major"; there is no text matching /Fact Machine|MetaMask|Open it/ anywhere in the machine.
- [ ] **Step 2:** Fail.
- [ ] **Step 3:** Build the components to match the mockup: landscape above 900px wide, the Task 1 phone layout below. Knobs are `role="slider"` with vertical drag and arrow keys. The tray slides out under the machine; note mode is a two-octave piano with in-key dots, Octave down, Octave up, Remove note, Done; chord mode lists "In key" and "Borrowed from ..." with Key down, Key up, Major / minor, Sevenths, Done. Screen instruction lines: Lead "Tap a step to choose its note"; Bass and Keys "Tap a chord below to change it"; drums "<Sound> plays on N of 16 steps". Song buttons load and start playing. Share writes `encodeLoop` to the address bar and clipboard; on mount, `decodeLoop(location.hash)` is applied when not null.
- [ ] **Step 4:** Pass. In the browser: play each song, place a note, change a chord, shift the key, share and reload the link.
- [ ] **Step 5:** Commit: `feat: the DC-1`.

### Task 9: Background canvases

**Files:** Create `src/looks/FxCanvas.tsx`, `src/looks/fx/{e80,e90,e00,e10}.ts`; Test `src/looks/FxCanvas.test.tsx`

**Interfaces:**
- Produces: `type Fx = (g: CanvasRenderingContext2D, f: { w: number; h: number; t: number; dt: number; beat: number; mem: Record<string, unknown> }) => void`; one default export per fx file; `FxCanvas({ look, beatRef }: { look: Look; beatRef: React.MutableRefObject<number> })`.

- [ ] **Step 1: Failing test:** with `matchMedia('(prefers-reduced-motion: reduce)')` mocked to match, mounting `FxCanvas` with `look='e80'` calls `requestAnimationFrame` at most once; with `look='clean'` it calls it zero times; unmounting cancels any pending frame.
- [ ] **Step 2:** Fail. **Step 3:** Port the four draw functions from the mockup (sun and grid; bouncing trailed polygons; clouds; rain and soft lights). `beat` is set to 1 on each kick by the machine and decays by 0.9 per frame. The canvas is fixed behind the deck and loaded with `next/dynamic` only when a decade look is first shown.
- [ ] **Step 4:** Pass; check each in the browser. Commit: `feat: animated backgrounds per decade`.

### Task 10: Search, sharing and accessibility

**Files:** Modify `src/app/layout.tsx`; Create `src/app/{sitemap,robots}.ts`, `src/app/opengraph-image.tsx`; Test `src/app/metadata.test.ts`

- [ ] **Step 1: Failing test:** `metadata.title` is "Daniel Cross | Lead Mobile Engineer, React Native and Crypto"; `metadata.description` contains "React Native" and "Solana" and is under 160 characters; `metadata.openGraph.url` is "https://danielcross.dev"; the exported JSON-LD object has `@type: 'Person'`, `name: 'Daniel Cross'`, `jobTitle: 'Lead Mobile Engineer'`, `address.addressLocality: 'Stockholm'`, and `sameAs` containing the GitHub and LinkedIn URLs from `site`.
- [ ] **Step 2:** Fail. **Step 3:** Implement, with a 1200x630 generated share image showing the name in the wide capitals on the clean dark background with the three-line stripe.
- [ ] **Step 4:** Pass. Keyboard pass in the browser: tab through the bar, CV links, and every machine control; focus is always visible; Escape closes the tray.
- [ ] **Step 5:** Commit: `feat: metadata, share image and sitemap`.

### Task 11: Preview, phone check and hand-off

- [ ] **Step 1:** `npm run lint && npx vitest run && npm run build` all pass. Confirm in the build output that the route's first-load JavaScript does not include the machine, engine or fx chunks.
- [ ] **Step 2:** Push `rebuild-dc1` to `origin` (personal account `Daniel-Cross`). Find the Vercel preview URL for the branch.
- [ ] **Step 3:** Open the preview at 390x844 and 320x568 and on desktop. Check: no sideways overflow on the CV; every bar control reachable; machine playable; tray fully on screen; each look on both pages; reduced motion; JavaScript disabled shows the full CV.
- [ ] **Step 4:** Give Daniel the preview link with a list of what was and was not checked. **Stop.** Merging to `main` and going live happens only when he says so.
- [ ] **Step 5 (after go):** Open a pull request from `rebuild-dc1` to `main`, merge, confirm danielcross.dev serves the new site, and update `.claude/CLAUDE.md` to remove the stack notes this design superseded.
