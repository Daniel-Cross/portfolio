import { expect, test } from 'vitest'
import { songById } from './songs'
import { initialState, leadNote, reduce } from './state'

test('tapping a step toggles a drum hit', () => {
  const s = reduce(initialState('e10'), { type: 'tapStep', step: 1 })
  expect((s.patterns[0] >> 1) & 1).toBe(1)
  expect((reduce(s, { type: 'tapStep', step: 1 }).patterns[0] >> 1) & 1).toBe(0)
})

test('tapping a step on Lead opens the note tray instead', () => {
  let s = reduce(initialState('e10'), { type: 'selectPad', pad: 5 })
  const before = s.patterns[5]
  s = reduce(s, { type: 'tapStep', step: 4 })
  expect(s.tray).toEqual({ kind: 'note', step: 4 })
  expect(s.patterns[5]).toBe(before)
})

test('picking a note sets it and turns the step on; it overrides the written melody', () => {
  let s = reduce(initialState('e10'), { type: 'selectPad', pad: 5 })
  s = reduce(reduce(s, { type: 'tapStep', step: 0 }), { type: 'pickNote', midi: 67 })
  expect(s.notes[0]).toBe(67)
  expect(s.patterns[5] & 1).toBe(1)
  expect(leadNote(s, songById('e10'), 0, 2)).toBe(67)
})

test('without a placed note the lead plays the written melody', () => {
  const s = initialState('e10')
  expect(leadNote(s, songById('e10'), 2, 0)).toBe(77)
  expect(leadNote(s, songById('e10'), 0, 0)).toBe(0)
})

test('removing a note turns the step off and closes the tray', () => {
  let s = reduce(initialState('e10'), { type: 'selectPad', pad: 5 })
  s = reduce(reduce(s, { type: 'tapStep', step: 2 }), { type: 'removeNote' })
  expect((s.patterns[5] >> 2) & 1).toBe(0)
  expect(s.notes[2]).toBeNull()
  expect(s.tray).toBeNull()
})

test('selecting a drum pad closes the tray; sevenths start off', () => {
  const s = reduce(initialState('e10'), { type: 'tapChord', bar: 1 })
  expect(s.tray).toEqual({ kind: 'chord', bar: 1 })
  expect(s.sevenths).toBe(false)
  expect(reduce(s, { type: 'selectPad', pad: 0 }).tray).toBeNull()
})

test('picking a chord replaces that bar only', () => {
  let s = reduce(initialState('e10'), { type: 'tapChord', bar: 1 })
  s = reduce(s, { type: 'pickChord', chord: { root: 5, quality: 'maj' } })
  expect(s.chords[1]).toEqual({ root: 5, quality: 'maj' })
  expect(s.chords[0]).toEqual(songById('e10').chords[0])
})

test('shifting the key moves chords, placed notes and the written melody together', () => {
  let s = initialState('e10')
  s = { ...s, notes: s.notes.map((n, i) => (i === 3 ? 60 : n)) }
  const up = reduce(s, { type: 'shiftKey', by: 2 })
  expect(up.key.tonic).toBe((s.key.tonic + 2) % 12)
  expect(up.notes[3]).toBe(62)
  expect(up.chords[0].root).toBe((s.chords[0].root + 2) % 12)
  expect(up.shift).toBe(2)
  expect(leadNote(up, songById('e10'), 2, 0)).toBe(79)
})

test('major/minor changes the key mode only', () => {
  const s = initialState('e10')
  const t = reduce(s, { type: 'toggleMode' })
  expect(t.key.mode).not.toBe(s.key.mode)
  expect(t.chords).toEqual(s.chords)
})

test('loading a song resets chords, notes, key and closes the tray', () => {
  const s = reduce({ ...initialState('e10'), tray: { kind: 'chord', bar: 0 }, shift: 3 }, { type: 'loadSong', songId: 'e80' })
  const e80 = songById('e80')
  expect(s).toMatchObject({ songId: 'e80', chords: e80.chords, key: e80.key, shift: 0, tray: null, patterns: e80.patterns, bpm: e80.bpm })
  expect(s.notes.every((n) => n === null)).toBe(true)
})

test('clearing the Lead pad also forgets placed notes', () => {
  let s = reduce(initialState('e10'), { type: 'selectPad', pad: 5 })
  s = reduce(reduce(s, { type: 'tapStep', step: 0 }), { type: 'pickNote', midi: 67 })
  s = reduce(s, { type: 'clearPad' })
  expect(s.patterns[5]).toBe(0)
  expect(s.notes[0]).toBeNull()
})
