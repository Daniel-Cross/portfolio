import { expect, test } from 'vitest'
import {
  borrowedChords,
  chordName,
  chordTones,
  freq,
  inKey,
  keyChords,
  noteName,
  transposeChord,
  transposeKey,
} from './theory'

test('names', () => {
  expect(noteName(67)).toBe('G4')
  expect(noteName(70)).toBe('Bb4')
  expect(chordName({ root: 2, quality: 'm7' })).toBe('Dm7')
  expect(chordName({ root: 7, quality: 'dom' })).toBe('G7')
  expect(chordName({ root: 5, quality: 'maj' })).toBe('F')
})

test('C major chords', () => {
  expect(keyChords({ tonic: 0, mode: 'maj' }, false).map(chordName)).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am'])
  expect(keyChords({ tonic: 0, mode: 'maj' }, true).map(chordName)).toEqual(['Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7'])
  expect(borrowedChords({ tonic: 0, mode: 'maj' }, true).map(chordName)).toEqual(['Cm7', 'Ebmaj7', 'Fm7', 'Gm7', 'Abmaj7', 'Bb7'])
})

test('transposing up two from C major gives D major', () => {
  expect(transposeKey({ tonic: 0, mode: 'maj' }, 2)).toEqual({ tonic: 2, mode: 'maj' })
  expect(chordName(transposeChord({ root: 2, quality: 'm7' }, 2))).toBe('Em7')
  expect(transposeChord({ root: 11, quality: 'maj' }, 2).root).toBe(1)
})

test('transposing down wraps below C', () => {
  expect(transposeKey({ tonic: 0, mode: 'min' }, -1)).toEqual({ tonic: 11, mode: 'min' })
})

test('chord tones and key membership', () => {
  expect(chordTones({ root: 0, quality: 'maj7' })).toEqual([0, 4, 7, 11])
  expect(chordTones({ root: 0, quality: 'min' })).toEqual([0, 3, 7])
  expect(inKey(4, { tonic: 0, mode: 'maj' })).toBe(true)
  expect(inKey(3, { tonic: 0, mode: 'maj' })).toBe(false)
  expect(inKey(3, { tonic: 0, mode: 'min' })).toBe(true)
})

test('freq', () => {
  expect(freq(69)).toBeCloseTo(440)
})
