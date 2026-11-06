import { defaultSongId, songById, type Song, type SongId } from './songs'
import { transposeChord, transposeKey, type Chord, type Key } from './theory'

export const LEAD = 5

export type Tray = null | { kind: 'note'; step: number } | { kind: 'chord'; bar: number }

export type MachineState = {
  songId: SongId
  /** one 16-bit mask per pad */
  patterns: number[]
  /** one chord per bar */
  chords: Chord[]
  key: Key
  /** semitones the song has been moved from its own key */
  shift: number
  /** a note the visitor placed on a step, or null to use the written melody */
  notes: (number | null)[]
  bpm: number
  tone: number
  echo: number
  reverb: number
  pad: number
  tray: Tray
  trayOctave: number
  sevenths: boolean
  playing: boolean
}

export type Knob = 'bpm' | 'tone' | 'echo' | 'reverb'

export type Action =
  | { type: 'loadSong'; songId: SongId }
  | { type: 'selectPad'; pad: number }
  | { type: 'tapStep'; step: number }
  | { type: 'pickNote'; midi: number }
  | { type: 'removeNote' }
  | { type: 'tapChord'; bar: number }
  | { type: 'pickChord'; chord: Chord }
  | { type: 'shiftKey'; by: number }
  | { type: 'toggleMode' }
  | { type: 'toggleSevenths' }
  | { type: 'trayOctave'; by: number }
  | { type: 'closeTray' }
  | { type: 'clearPad' }
  | { type: 'setKnob'; knob: Knob; value: number }
  | { type: 'setPlaying'; playing: boolean }
  | { type: 'restore'; loop: Partial<MachineState> }

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const setAt = <T,>(list: T[], index: number, value: T) => list.map((item, i) => (i === index ? value : item))

function fromSong(song: Song) {
  return {
    songId: song.id,
    patterns: [...song.patterns],
    chords: song.chords.map((c) => ({ ...c })),
    key: { ...song.key },
    shift: 0,
    notes: Array<number | null>(16).fill(null),
    bpm: song.bpm,
    tone: song.tone,
    echo: song.echo,
    reverb: song.reverb,
    tray: null,
  }
}

export function initialState(songId: SongId = defaultSongId): MachineState {
  return { ...fromSong(songById(songId)), pad: 0, trayOctave: 4, sevenths: false, playing: false }
}

/** The lead note for a step: the visitor's note if they placed one, else the song's melody moved with the key. */
export function leadNote(state: MachineState, song: Song, step: number, bar: number): number {
  const placed = state.notes[step]
  if (placed != null) return placed
  const written = song.melody[bar % 4][step]
  return written ? written + state.shift : 0
}

export function reduce(state: MachineState, action: Action): MachineState {
  switch (action.type) {
    case 'loadSong':
      return { ...state, ...fromSong(songById(action.songId)) }
    case 'selectPad': {
      // the note tray belongs to the Lead pad; drums have no use for either tray
      const keepTray = state.tray?.kind === 'chord' && action.pad >= 3
      return { ...state, pad: action.pad, tray: keepTray ? state.tray : null }
    }
    case 'tapStep': {
      if (state.pad !== LEAD) {
        return { ...state, patterns: setAt(state.patterns, state.pad, state.patterns[state.pad] ^ (1 << action.step)) }
      }
      const open = state.tray?.kind === 'note' && state.tray.step === action.step
      const placed = state.notes[action.step]
      return {
        ...state,
        tray: open ? null : { kind: 'note', step: action.step },
        trayOctave: !open && placed != null ? clamp(Math.floor(placed / 12) - 1, 2, 5) : state.trayOctave,
      }
    }
    case 'pickNote': {
      if (state.tray?.kind !== 'note') return state
      const step = state.tray.step
      return {
        ...state,
        notes: setAt(state.notes, step, action.midi),
        patterns: setAt(state.patterns, LEAD, state.patterns[LEAD] | (1 << step)),
      }
    }
    case 'removeNote': {
      if (state.tray?.kind !== 'note') return state
      const step = state.tray.step
      return {
        ...state,
        notes: setAt(state.notes, step, null),
        patterns: setAt(state.patterns, LEAD, state.patterns[LEAD] & ~(1 << step)),
        tray: null,
      }
    }
    case 'tapChord': {
      const open = state.tray?.kind === 'chord' && state.tray.bar === action.bar
      return { ...state, tray: open ? null : { kind: 'chord', bar: action.bar } }
    }
    case 'pickChord':
      if (state.tray?.kind !== 'chord') return state
      return { ...state, chords: setAt(state.chords, state.tray.bar, action.chord) }
    case 'shiftKey': {
      let shift = state.shift + action.by
      if (shift > 6) shift -= 12
      if (shift < -6) shift += 12
      return {
        ...state,
        key: transposeKey(state.key, action.by),
        chords: state.chords.map((c) => transposeChord(c, action.by)),
        notes: state.notes.map((n) => (n == null ? null : n + action.by)),
        shift,
      }
    }
    case 'toggleMode':
      return { ...state, key: { ...state.key, mode: state.key.mode === 'maj' ? 'min' : 'maj' } }
    case 'toggleSevenths':
      return { ...state, sevenths: !state.sevenths }
    case 'trayOctave':
      return { ...state, trayOctave: clamp(state.trayOctave + action.by, 2, 5) }
    case 'closeTray':
      return { ...state, tray: null }
    case 'clearPad':
      return {
        ...state,
        patterns: setAt(state.patterns, state.pad, 0),
        notes: state.pad === LEAD ? state.notes.map(() => null) : state.notes,
      }
    case 'setKnob':
      return { ...state, [action.knob]: action.value }
    case 'setPlaying':
      return { ...state, playing: action.playing }
    case 'restore':
      // start from the linked song's own settings, then lay the saved loop over them
      return { ...state, ...fromSong(songById(action.loop.songId ?? state.songId)), ...action.loop, tray: null }
  }
}
