import { expect, test } from 'vitest'
import { defaultSongId, songs } from './songs'

test('four songs in decade order, lo-fi is the default', () => {
  expect(songs.map((s) => s.name)).toEqual(['80s Synth', '90s Dance', '00s House', '10s Lo-fi'])
  expect(songs.map((s) => s.look)).toEqual(['e80', 'e90', 'e00', 'e10'])
  expect(defaultSongId).toBe('e10')
})

test('each song is well formed', () => {
  for (const s of songs) {
    expect(s.chords).toHaveLength(4)
    expect(s.patterns).toHaveLength(6)
    expect(s.melody).toHaveLength(4)
    for (const bar of s.melody) expect(bar).toHaveLength(16)
    for (let i = 0; i < 16; i++) {
      const has = s.melody.some((bar) => bar[i] > 0)
      expect(Boolean((s.patterns[5] >> i) & 1), `${s.name} lead step ${i}`).toBe(has)
    }
  }
})
