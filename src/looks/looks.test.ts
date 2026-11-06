import { expect, test } from 'vitest'
import { effectiveLook, pickLook } from './looks'

test('immersion follows the song only while playing', () => {
  expect(effectiveLook({ immersion: true, playing: true, songLook: 'e80', picked: 'clean' })).toBe('e80')
  expect(effectiveLook({ immersion: true, playing: false, songLook: 'e80', picked: 'e90' })).toBe('e90')
  expect(effectiveLook({ immersion: false, playing: true, songLook: 'e80', picked: 'e10' })).toBe('e10')
})

test('picking a look turns immersion off only if a song is playing', () => {
  expect(pickLook({ immersion: true, playing: false }, 'e00')).toEqual({ picked: 'e00', immersion: true })
  expect(pickLook({ immersion: true, playing: true }, 'e00')).toEqual({ picked: 'e00', immersion: false })
})
