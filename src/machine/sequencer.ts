import type { Engine } from './engine'
import type { Song } from './songs'
import type { Chord } from './theory'

export type PlayState = {
  song: Song
  bpm: number
  patterns: number[]
  chords: Chord[]
  /** the lead note for a step and bar, 0 for none */
  lead(step: number, bar: number): number
}

const TICK_MS = 25
const LOOKAHEAD = 0.1
/** if the clock has run this far past the next step (a hidden tab), restart the grid from now */
const LATE = 0.2

const stepLength = (bpm: number) => 60 / bpm / 4

/** When sixteenth-note `index` plays, counting from `start`. Odd steps are pushed late by `swing` of a step. */
export function stepTime(start: number, index: number, bpm: number, swing: number): number {
  const d = stepLength(bpm)
  return start + index * d + (index % 2 ? swing * d : 0)
}

export function createSequencer(opts: {
  engine: Engine
  getState: () => PlayState
  onStep: (step: number, bar: number, time: number) => void
}) {
  let timer: ReturnType<typeof setInterval> | undefined
  let origin = 0
  let count = 0
  let step = 0
  let bar = 0
  let bpm = 0

  function tick() {
    const state = opts.getState()
    const now = opts.engine.now()
    if (state.bpm !== bpm) {
      // keep the grid continuous across a tempo change
      origin = bpm ? origin + count * stepLength(bpm) : origin
      count = 0
      bpm = state.bpm
    }
    const d = stepLength(bpm)
    if (origin + count * d < now - LATE) {
      origin = now
      count = 0
    }
    while (origin + count * d < now + LOOKAHEAD) {
      const time = origin + count * d + (step % 2 ? state.song.swing * d : 0)
      const chord = state.chords[bar]
      for (let pad = 0; pad < 6; pad++) {
        if (!((state.patterns[pad] >> step) & 1)) continue
        const note = pad === 5 ? state.lead(step, bar) : undefined
        if (pad === 5 && !note) continue
        opts.engine.trigger(pad, time, { song: state.song, chord, step, bar, note })
      }
      opts.onStep(step, bar, time)
      count++
      step = (step + 1) % 16
      if (step === 0) bar = (bar + 1) % 4
    }
  }

  return {
    start() {
      this.stop()
      step = 0
      bar = 0
      count = 0
      bpm = 0
      origin = opts.engine.now() + 0.06
      timer = setInterval(tick, TICK_MS)
    },
    stop() {
      if (timer !== undefined) clearInterval(timer)
      timer = undefined
    },
  }
}
