import { afterEach, expect, test, vi } from 'vitest'
import { createEngine, type Engine } from './engine'
import { createSequencer, stepTime, type PlayState } from './sequencer'
import { songs } from './songs'

afterEach(() => vi.useRealTimers())

const song = songs[3]
const playState: PlayState = { song, bpm: song.bpm, patterns: song.patterns, chords: song.chords, lead: () => 0 }

test('step timing with swing', () => {
  expect(stepTime(10, 0, 120, 0)).toBeCloseTo(10)
  expect(stepTime(10, 4, 120, 0)).toBeCloseTo(10.5)
  expect(stepTime(10, 1, 120, 0.2)).toBeCloseTo(10.125 + 0.2 * 0.125)
})

test('sequencer does not burst after a long gap', () => {
  vi.useFakeTimers()
  let clock = 0
  const times: number[] = []
  const seq = createSequencer({
    engine: { now: () => clock, trigger() {} } as unknown as Engine,
    getState: () => playState,
    onStep: (_step, _bar, time) => times.push(time),
  })
  seq.start()
  vi.advanceTimersByTime(25)
  times.length = 0
  clock = 60
  vi.advanceTimersByTime(25)
  expect(times.length).toBeGreaterThan(0)
  expect(times.length).toBeLessThanOrEqual(2)
  for (const t of times) expect(t).toBeGreaterThanOrEqual(60)
  seq.stop()
})

test('steps advance through sixteen and then the next bar', () => {
  vi.useFakeTimers()
  let clock = 0
  const seen: [number, number][] = []
  const seq = createSequencer({
    engine: { now: () => clock, trigger() {} } as unknown as Engine,
    getState: () => playState,
    onStep: (step, bar) => seen.push([step, bar]),
  })
  seq.start()
  for (let i = 0; i < 200; i++) {
    clock += 0.025
    vi.advanceTimersByTime(25)
  }
  seq.stop()
  expect(seen[0]).toEqual([0, 0])
  expect(seen[16]).toEqual([0, 1])
})

test('no audio support gives no engine instead of throwing', () => {
  vi.stubGlobal('AudioContext', undefined)
  vi.stubGlobal('webkitAudioContext', undefined)
  expect(createEngine()).toBeNull()
  vi.unstubAllGlobals()
})
