import type { Look } from '@/looks/looks'
import type { Chord, Key } from './theory'

export type SongId = 'e80' | 'e90' | 'e00' | 'e10'

/** The instrument sounds a song uses. Numbers are frequencies in Hz, times in seconds, gains 0 to 1. */
export type Kit = {
  kick: { from: number; to: number; decay: number; gain: number }
  snare: 'soft' | 'clap' | 'gated'
  hat: { highpass: number; decay: number; gain: number }
  bass: { wave: OscillatorType; cutoff: number; decay: number; gain: number }
  keys: 'ep' | 'saw' | 'filt' | 'poly'
  lead: { wave: OscillatorType; decay: number; gain: number }
  crackle?: boolean
}

export type Song = {
  id: SongId
  name: string
  look: Look
  key: Key
  bpm: number
  /** how late the off-beat sixteenths land, as a fraction of a step */
  swing: number
  tone: number
  echo: number
  reverb: number
  /** one chord per bar */
  chords: Chord[]
  /** one 16-bit mask per pad: Kick, Snare, Hat, Bass, Keys, Lead. Bit n is step n. */
  patterns: number[]
  /** semitones added to the bass note on a given step */
  bassOffsets: Record<number, number>
  /** four bars of sixteen MIDI notes, 0 for a rest */
  melody: number[][]
  kit: Kit
}

const steps = (...on: number[]) => on.reduce((mask, step) => mask | (1 << step), 0)
const bar = (notes: Record<number, number>) => Array.from({ length: 16 }, (_, step) => notes[step] ?? 0)
const leadSteps = (melody: number[][]) => melody.reduce((mask, b) => b.reduce((m, note, step) => (note ? m | (1 << step) : m), mask), 0)
const EIGHTHS = steps(0, 2, 4, 6, 8, 10, 12, 14)
const BEATS = steps(0, 4, 8, 12)
const BACKBEAT = steps(4, 12)
const OFFBEATS = steps(2, 6, 10, 14)

function song(s: Omit<Song, 'patterns'> & { drums: [number, number, number, number, number] }): Song {
  const { drums, ...rest } = s
  return { ...rest, patterns: [...drums, leadSteps(s.melody)] }
}

export const songs: Song[] = [
  song({
    id: 'e80',
    name: '80s Synth',
    look: 'e80',
    key: { tonic: 2, mode: 'min' },
    bpm: 118,
    swing: 0,
    tone: 0.84,
    echo: 0.24,
    reverb: 0.3,
    chords: [
      { root: 2, quality: 'min' },
      { root: 10, quality: 'maj' },
      { root: 7, quality: 'min' },
      { root: 9, quality: 'maj' },
    ],
    drums: [BEATS, BACKBEAT, OFFBEATS, EIGHTHS, steps(0, 6, 12)],
    bassOffsets: { 2: 12, 6: 12, 10: 12, 14: 12 },
    melody: [
      bar({ 0: 69, 2: 74, 4: 77, 6: 76, 8: 74, 12: 69 }),
      bar({ 0: 70, 2: 74, 4: 77, 6: 76, 8: 74, 12: 77 }),
      bar({ 0: 67, 2: 70, 4: 74, 6: 72, 8: 70, 12: 67 }),
      bar({ 0: 69, 2: 73, 4: 76, 6: 79, 8: 76, 12: 73, 14: 76 }),
    ],
    kit: {
      kick: { from: 150, to: 50, decay: 0.2, gain: 1 },
      snare: 'gated',
      hat: { highpass: 8500, decay: 0.06, gain: 0.14 },
      bass: { wave: 'sawtooth', cutoff: 600, decay: 0.16, gain: 0.5 },
      keys: 'poly',
      lead: { wave: 'triangle', decay: 0.32, gain: 0.12 },
    },
  }),
  song({
    id: 'e90',
    name: '90s Dance',
    look: 'e90',
    key: { tonic: 9, mode: 'min' },
    bpm: 138,
    swing: 0,
    tone: 0.95,
    echo: 0.22,
    reverb: 0.25,
    chords: [
      { root: 9, quality: 'min' },
      { root: 5, quality: 'maj' },
      { root: 0, quality: 'maj' },
      { root: 7, quality: 'maj' },
    ],
    drums: [BEATS, BACKBEAT, OFFBEATS, steps(2, 3, 6, 7, 10, 11, 14, 15), steps(0, 3, 6, 8, 11, 14)],
    bassOffsets: { 3: 12, 7: 12, 11: 12, 15: 12 },
    melody: [
      bar({ 0: 81, 2: 76, 3: 81, 5: 84, 6: 83, 8: 81, 10: 76, 11: 81, 13: 79, 14: 76 }),
      bar({ 0: 81, 2: 77, 3: 81, 5: 84, 6: 81, 8: 77, 10: 72, 11: 77, 13: 81, 14: 79 }),
      bar({ 0: 79, 2: 76, 3: 79, 5: 84, 6: 79, 8: 76, 10: 72, 11: 76, 13: 79, 14: 76 }),
      bar({ 0: 79, 2: 74, 3: 79, 5: 83, 6: 79, 8: 74, 10: 71, 11: 74, 13: 79, 14: 83 }),
    ],
    kit: {
      kick: { from: 180, to: 42, decay: 0.32, gain: 1.1 },
      snare: 'clap',
      hat: { highpass: 7000, decay: 0.11, gain: 0.2 },
      bass: { wave: 'sawtooth', cutoff: 900, decay: 0.12, gain: 0.45 },
      keys: 'saw',
      lead: { wave: 'square', decay: 0.12, gain: 0.06 },
    },
  }),
  song({
    id: 'e00',
    name: '00s House',
    look: 'e00',
    key: { tonic: 5, mode: 'maj' },
    bpm: 124,
    swing: 0.05,
    tone: 0.88,
    echo: 0.14,
    reverb: 0.22,
    chords: [
      { root: 10, quality: 'maj7' },
      { root: 9, quality: 'm7' },
      { root: 7, quality: 'm7' },
      { root: 0, quality: 'dom' },
    ],
    drums: [BEATS, BACKBEAT, OFFBEATS, steps(0, 3, 6, 7, 10, 14), steps(2, 5, 8, 11, 14)],
    bassOffsets: { 3: 12, 7: 12, 14: 12 },
    melody: [
      bar({ 0: 74, 3: 77, 6: 74, 10: 72 }),
      bar({ 0: 72, 3: 76, 6: 72, 10: 69 }),
      bar({ 0: 70, 3: 74, 6: 70, 10: 69 }),
      bar({ 0: 67, 3: 72, 6: 76, 8: 79, 12: 76 }),
    ],
    kit: {
      kick: { from: 165, to: 48, decay: 0.26, gain: 1.05 },
      snare: 'clap',
      hat: { highpass: 8000, decay: 0.09, gain: 0.18 },
      bass: { wave: 'sawtooth', cutoff: 520, decay: 0.16, gain: 0.5 },
      keys: 'filt',
      lead: { wave: 'triangle', decay: 0.3, gain: 0.1 },
    },
  }),
  song({
    id: 'e10',
    name: '10s Lo-fi',
    look: 'e10',
    key: { tonic: 0, mode: 'maj' },
    bpm: 76,
    swing: 0.18,
    tone: 0.55,
    echo: 0.12,
    reverb: 0.35,
    chords: [
      { root: 2, quality: 'm7' },
      { root: 7, quality: 'dom' },
      { root: 0, quality: 'maj7' },
      { root: 9, quality: 'm7' },
    ],
    drums: [steps(0, 7, 10), BACKBEAT, EIGHTHS, steps(0, 7, 10), steps(0, 10)],
    bassOffsets: { 10: 7 },
    melody: [
      bar({ 2: 77, 4: 76, 6: 74, 10: 69, 14: 72 }),
      bar({ 2: 74, 4: 71, 7: 69, 10: 67 }),
      bar({ 2: 76, 4: 79, 6: 76, 10: 74, 12: 71 }),
      bar({ 2: 72, 4: 69, 8: 67, 11: 64, 14: 69 }),
    ],
    kit: {
      kick: { from: 110, to: 45, decay: 0.28, gain: 0.9 },
      snare: 'soft',
      hat: { highpass: 5000, decay: 0.04, gain: 0.16 },
      bass: { wave: 'sine', cutoff: 400, decay: 0.45, gain: 0.65 },
      keys: 'ep',
      lead: { wave: 'triangle', decay: 0.5, gain: 0.1 },
      crackle: true,
    },
  }),
]

export const defaultSongId: SongId = 'e10'
export const songById = (id: SongId) => songs.find((s) => s.id === id)!
