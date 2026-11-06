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

test('the hidden song is well formed and is not one of the four on the machine', async () => {
  const { secretSong, songById } = await import('./songs')
  expect(songs.some((s) => s.id === secretSong.id)).toBe(false)
  expect(songById('c64')).toBe(secretSong)
  expect(secretSong.look).toBe('c64')
  expect(secretSong.name).toBe('Stardust')
  expect(secretSong.key).toEqual({ tonic: 11, mode: 'min' })
  expect(secretSong.bpm).toBe(148)
  expect(secretSong.chords).toHaveLength(4)
  expect(secretSong.patterns).toHaveLength(6)
  expect(secretSong.melody).toEqual([
    [0, 0, 59, 0, 62, 0, 64, 0, 66, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 59, 0, 62, 0, 64, 0, 66, 0, 67, 0, 66, 0, 62, 0],
    [64, 0, 0, 0, 0, 0, 0, 0, 62, 0, 0, 0, 66, 0, 59, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ])
  for (let step = 0; step < 16; step++) {
    const hasNote = secretSong.melody.some((bar) => bar[step] > 0)
    expect(Boolean((secretSong.patterns[5] >> step) & 1), `Stardust lead step ${step}`).toBe(hasNote)
  }
})
