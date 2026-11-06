export type Mode = 'maj' | 'min'
export type Quality = 'maj' | 'min' | 'dom' | 'm7' | 'maj7'
/** root is a pitch class, 0 (C) to 11 (B) */
export type Chord = { root: number; quality: Quality }
export type Key = { tonic: number; mode: Mode }

const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const SUFFIX: Record<Quality, string> = { maj: '', min: 'm', dom: '7', m7: 'm7', maj7: 'maj7' }
const TONES: Record<Quality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dom: [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
}
const SCALE: Record<Mode, number[]> = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10] }

const mod12 = (n: number) => ((n % 12) + 12) % 12

export const pitchName = (pc: number) => NAMES[mod12(pc)]
export const noteName = (midi: number) => `${pitchName(midi)}${Math.floor(midi / 12) - 1}`
export const chordName = (c: Chord) => pitchName(c.root) + SUFFIX[c.quality]
export const chordTones = (c: Chord) => TONES[c.quality]
export const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)
export const inKey = (pc: number, key: Key) => SCALE[key.mode].includes(mod12(pc - key.tonic))

/** The chords built on each degree of the key, skipping the diminished one. */
export function keyChords(key: Key, sevenths: boolean): Chord[] {
  const scale = SCALE[key.mode]
  const above = (degree: number, steps: number) =>
    scale[(degree + steps) % 7] + (degree + steps >= 7 ? 12 : 0) - scale[degree]
  const chords: Chord[] = []
  for (let degree = 0; degree < 7; degree++) {
    if (above(degree, 4) !== 7) continue
    const major = above(degree, 2) === 4
    const quality: Quality = !sevenths ? (major ? 'maj' : 'min') : !major ? 'm7' : above(degree, 6) === 11 ? 'maj7' : 'dom'
    chords.push({ root: mod12(key.tonic + scale[degree]), quality })
  }
  return chords
}

/** Chords from the parallel major or minor that the key does not already have. */
export function borrowedChords(key: Key, sevenths: boolean): Chord[] {
  const own = keyChords(key, sevenths)
  const other: Key = { tonic: key.tonic, mode: key.mode === 'maj' ? 'min' : 'maj' }
  return keyChords(other, sevenths).filter((c) => !own.some((o) => o.root === c.root && o.quality === c.quality))
}

export const transposeKey = (key: Key, semitones: number): Key => ({ ...key, tonic: mod12(key.tonic + semitones) })
export const transposeChord = (c: Chord, semitones: number): Chord => ({ ...c, root: mod12(c.root + semitones) })
