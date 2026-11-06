import { songs, type SongId } from './songs'
import type { MachineState } from './state'
import type { Chord, Key, Quality } from './theory'

const PREFIX = '#v1.'
const QUALITIES: Quality[] = ['maj', 'min', 'dom', 'm7', 'maj7']

type Wire = [string, number, number[], [number, number][], [number, number], number, number[]]

const toBase64Url = (text: string) => btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromBase64Url = (text: string) => atob(text.replace(/-/g, '+').replace(/_/g, '/'))
const isInt = (n: unknown, lo: number, hi: number): n is number => Number.isInteger(n) && (n as number) >= lo && (n as number) <= hi
const isList = (v: unknown, length: number): v is unknown[] => Array.isArray(v) && v.length === length

/** The loop as a link fragment: song, tempo, patterns, chords, key and placed notes. */
export function encodeLoop(state: MachineState): string {
  const wire: Wire = [
    state.songId,
    state.bpm,
    state.patterns,
    state.chords.map((c) => [c.root, QUALITIES.indexOf(c.quality)]),
    [state.key.tonic, state.key.mode === 'maj' ? 0 : 1],
    state.shift,
    state.notes.map((n) => n ?? 0),
  ]
  return PREFIX + toBase64Url(JSON.stringify(wire))
}

/** Reads a link fragment back. Anything that is not a well-formed v1 loop gives null. */
export function decodeLoop(hash: string): Partial<MachineState> | null {
  if (!hash.startsWith(PREFIX)) return null
  let wire: unknown
  try {
    wire = JSON.parse(fromBase64Url(hash.slice(PREFIX.length)))
  } catch {
    return null
  }
  if (!isList(wire, 7)) return null
  const [songId, bpm, patterns, chords, key, shift, notes] = wire
  if (!songs.some((s) => s.id === songId)) return null
  if (!isInt(bpm, 40, 240) || !isInt(shift, -6, 6)) return null
  if (!isList(patterns, 6) || !patterns.every((p) => isInt(p, 0, 0xffff))) return null
  if (!isList(chords, 4) || !chords.every((c) => isList(c, 2) && isInt(c[0], 0, 11) && isInt(c[1], 0, QUALITIES.length - 1))) return null
  if (!isList(key, 2) || !isInt(key[0], 0, 11) || !isInt(key[1], 0, 1)) return null
  if (!isList(notes, 16) || !notes.every((n) => isInt(n, 0, 127))) return null
  return {
    songId: songId as SongId,
    bpm,
    patterns: patterns as number[],
    chords: (chords as [number, number][]).map(([root, q]): Chord => ({ root, quality: QUALITIES[q] })),
    key: { tonic: key[0], mode: key[1] === 0 ? 'maj' : 'min' } as Key,
    shift,
    notes: (notes as number[]).map((n) => n || null),
  }
}
