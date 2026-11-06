import type { Action, MachineState } from '../state'
import { borrowedChords, chordName, inKey, keyChords, noteName, pitchName, type Chord } from '../theory'

type Props = {
  state: MachineState
  dispatch(action: Action): void
  /** play a note or chord so the visitor hears the choice */
  preview(what: { note: number } | { chord: Chord; bar: number }): void
}

/** white keys of one octave with the black key that follows each, if any */
const WHITE: [number, number | null][] = [
  [0, 1],
  [2, 3],
  [4, null],
  [5, 6],
  [7, 8],
  [9, 10],
  [11, null],
]

const modeName = (mode: 'maj' | 'min') => (mode === 'maj' ? 'major' : 'minor')

function Piano({ state, dispatch, preview }: Props & { step: number }) {
  const placed = state.tray?.kind === 'note' ? state.notes[state.tray.step] : null
  const pick = (midi: number) => {
    dispatch({ type: 'pickNote', midi })
    preview({ note: midi })
  }
  return (
    <div className="piano">
      {[state.trayOctave, state.trayOctave + 1].flatMap((octave) =>
        WHITE.map(([white, black]) => {
          const midi = 12 * (octave + 1) + white
          return (
            <div className="piano__slot" key={midi}>
              <button className={`piano__white${placed === midi ? ' is-on' : ''}`} aria-label={noteName(midi)} onClick={() => pick(midi)}>
                {inKey(white, state.key) ? <i aria-hidden="true" /> : null}
                {white === 0 ? <span aria-hidden="true">{noteName(midi)}</span> : null}
              </button>
              {black !== null ? (
                <button
                  className={`piano__black${placed === midi + 1 ? ' is-on' : ''}`}
                  aria-label={noteName(midi + 1)}
                  onClick={() => pick(midi + 1)}
                />
              ) : null}
            </div>
          )
        }),
      )}
    </div>
  )
}

function Chords({ state, dispatch, preview, bar }: Props & { bar: number }) {
  const current = state.chords[bar]
  const other = state.key.mode === 'maj' ? 'min' : 'maj'
  const row = (chords: Chord[]) =>
    chords.map((chord) => (
      <button
        key={chordName(chord)}
        className="tray__chord"
        aria-pressed={chord.root === current.root && chord.quality === current.quality}
        onClick={() => {
          dispatch({ type: 'pickChord', chord })
          preview({ chord, bar })
        }}
      >
        {chordName(chord)}
      </button>
    ))
  return (
    <>
      <div className="tray__row">
        <span className="label">In key</span>
        {row(keyChords(state.key, state.sevenths))}
      </div>
      <div className="tray__row">
        <span className="label">{`Borrowed from ${pitchName(state.key.tonic)} ${modeName(other)}`}</span>
        {row(borrowedChords(state.key, state.sevenths))}
      </div>
    </>
  )
}

/** The panel that slides out under the machine to pick a note for a step or a chord for a bar. */
export function Tray(props: Props) {
  const { state, dispatch } = props
  const tray = state.tray
  return (
    <div className={`tray${tray ? ' is-open' : ''}`} role="region" aria-label="Notes and chords" aria-live="polite">
      {tray?.kind === 'note' ? (
        <>
          <div className="tray__head">
            <span className="label">{`Step ${tray.step + 1}: pick a note`}</span>
            <button onClick={() => dispatch({ type: 'trayOctave', by: -1 })}>Octave −</button>
            <button onClick={() => dispatch({ type: 'trayOctave', by: 1 })}>Octave +</button>
            <button onClick={() => dispatch({ type: 'removeNote' })}>Remove note</button>
            <button onClick={() => dispatch({ type: 'closeTray' })}>Done</button>
          </div>
          <Piano {...props} step={tray.step} />
        </>
      ) : null}
      {tray?.kind === 'chord' ? (
        <>
          <div className="tray__head">
            <span className="label">{`Bar ${tray.bar + 1}: pick a chord`}</span>
            <button onClick={() => dispatch({ type: 'shiftKey', by: -1 })}>Key −</button>
            <b className="tray__key">{`${pitchName(state.key.tonic)} ${modeName(state.key.mode)}`}</b>
            <button onClick={() => dispatch({ type: 'shiftKey', by: 1 })}>Key +</button>
            <button onClick={() => dispatch({ type: 'toggleMode' })}>Major / minor</button>
            <button aria-pressed={state.sevenths} onClick={() => dispatch({ type: 'toggleSevenths' })}>
              Sevenths
            </button>
            <button onClick={() => dispatch({ type: 'closeTray' })}>Done</button>
          </div>
          <Chords {...props} bar={tray.bar} />
        </>
      ) : null}
    </div>
  )
}
