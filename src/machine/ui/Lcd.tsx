import { LEAD, type MachineState } from '../state'
import type { Song } from '../songs'
import { chordName, pitchName } from '../theory'

const SOUNDS = ['Kick', 'Snare', 'Hat', 'Bass', 'Keys', 'Lead']

type Props = {
  state: MachineState
  song: Song
  /** the step and bar sounding now, or null when stopped */
  at: { step: number; bar: number } | null
  /** a short message that replaces the pad line, such as "Link copied" */
  notice?: string
  onChord(bar: number): void
}

function instruction(state: MachineState) {
  if (state.pad === LEAD) return 'Tap a step to choose its note'
  if (state.pad >= 3) return 'Tap a chord below to change it'
  const hits = state.patterns[state.pad].toString(2).replace(/0/g, '').length
  return `${SOUNDS[state.pad]} plays on ${hits} of 16 steps`
}

/** The machine's screen. It shows music only. */
export function Lcd({ state, song, at, notice, onChord }: Props) {
  const tempo = `${state.bpm} bpm`
  return (
    <div className="lcd">
      <div className="lcd__row">
        <span>{notice ?? `Pad ${state.pad + 1}, ${SOUNDS[state.pad].toLowerCase()}`}</span>
        <span>{at ? `${tempo}, bar ${at.bar + 1} of 4` : tempo}</span>
      </div>
      <div className="lcd__title">{state.playing ? song.name : 'Press play'}</div>
      <div className="lcd__hint">{instruction(state)}</div>
      <div className="lcd__key">{`Key of ${pitchName(state.key.tonic)} ${state.key.mode === 'maj' ? 'major' : 'minor'}`}</div>
      <div className="lcd__chords">
        {state.chords.map((chord, bar) => (
          <button
            key={bar}
            className={at?.bar === bar ? 'is-now' : undefined}
            aria-pressed={state.tray?.kind === 'chord' && state.tray.bar === bar}
            onClick={() => onChord(bar)}
          >
            {chordName(chord)}
          </button>
        ))}
      </div>
      <div className="lcd__steps" aria-hidden="true">
        {Array.from({ length: 16 }, (_, step) => (
          <i key={step} className={at?.step === step ? 'is-now' : undefined} />
        ))}
      </div>
    </div>
  )
}
