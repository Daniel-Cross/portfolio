import { expect, test } from 'vitest'
import { decodeLoop, encodeLoop } from './share'
import { initialState } from './state'

test('round trip keeps patterns, tempo, song, chords, key and placed notes', () => {
  const base = initialState('e80')
  const s = { ...base, bpm: 131, notes: base.notes.map((n, i) => (i === 2 ? 72 : n)) }
  expect(decodeLoop(encodeLoop(s))).toMatchObject({
    songId: 'e80',
    bpm: 131,
    patterns: s.patterns,
    chords: s.chords,
    key: s.key,
    notes: s.notes,
  })
})

test('bad input returns null', () => {
  for (const h of ['', '#', '#garbage', '#111110104444555510415155-118-0', '#%%%', '#v1.', '#v1.e30=', '#v1.WzFd']) {
    expect(decodeLoop(h), h).toBeNull()
  }
})
