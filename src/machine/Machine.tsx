'use client'

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { Look } from '@/looks/looks'
import { createEngine, type Engine } from './engine'
import { createSequencer } from './sequencer'
import { decodeLoop, encodeLoop } from './share'
import { songById, songs } from './songs'
import { initialState, LEAD, leadNote, reduce, type MachineState } from './state'
import { noteName } from './theory'
import { Knob } from './ui/Knob'
import { Lcd } from './ui/Lcd'
import { Tray } from './ui/Tray'

type Props = {
  /** an audio context the shell already unlocked inside a tap, if it has one */
  audio: AudioContext | null
  playing: boolean
  volume: number
  onPlayingChange(playing: boolean): void
  onSongLook(look: Look): void
  /** called on every kick drum */
  onBeat(): void
  /** hands the shell a function that starts or stops playback */
  registerToggle(toggle: () => void): void
}

const PADS = ['Kick', 'Snare', 'Hat', 'Bass', 'Keys', 'Lead']
const TEMPO = { min: 70, max: 150 }

function start(): MachineState {
  const base = initialState()
  const loop = typeof window === 'undefined' ? null : decodeLoop(window.location.hash)
  return loop ? reduce(base, { type: 'restore', loop }) : base
}

export default function Machine({ audio, volume, onPlayingChange, onSongLook, onBeat, registerToggle }: Props) {
  const [state, dispatch] = useReducer(reduce, undefined, start)
  const [at, setAt] = useState<{ step: number; bar: number } | null>(null)
  const [notice, setNotice] = useState<string>()
  const song = songById(state.songId)

  // the sequencer runs outside React's render cycle, so it reads the latest state through a ref
  const live = useRef({ state, song, onBeat })
  useEffect(() => {
    live.current = { state, song, onBeat }
  })

  const [engine] = useState<Engine | null>(() => createEngine(audio))
  const sequencer = useRef<ReturnType<typeof createSequencer> | null>(null)
  useEffect(() => {
    if (!engine) return
    const created = createSequencer({
      engine,
      getState: () => {
        const { state: s, song: sg } = live.current
        return { song: sg, bpm: s.bpm, patterns: s.patterns, chords: s.chords, lead: (step, bar) => leadNote(s, sg, step, bar) }
      },
      onStep: (step, bar, time) => {
        // the sound is scheduled ahead; move the lights when it is actually heard
        setTimeout(() => {
          if (!live.current.state.playing) return
          setAt({ step, bar })
          if (live.current.state.patterns[0] & (1 << step)) live.current.onBeat()
        }, Math.max(0, (time - engine.now()) * 1000))
      },
    })
    sequencer.current = created
    return () => created.stop()
  }, [engine])

  const toggle = useCallback(() => {
    if (!engine || !sequencer.current) return
    void engine.resume()
    const playing = !live.current.state.playing
    if (playing) sequencer.current.start()
    else sequencer.current.stop()
    dispatch({ type: 'setPlaying', playing })
    if (!playing) setAt(null)
  }, [engine])

  useEffect(() => registerToggle(toggle), [registerToggle, toggle])
  useEffect(() => onPlayingChange(state.playing), [onPlayingChange, state.playing])
  useEffect(() => onSongLook(song.look), [onSongLook, song.look])
  useEffect(() => engine?.setVolume(volume), [engine, volume])
  useEffect(() => engine?.setTone(state.tone), [engine, state.tone])
  useEffect(() => engine?.setEcho(state.echo), [engine, state.echo])
  useEffect(() => engine?.setReverb(state.reverb), [engine, state.reverb])
  useEffect(() => engine?.setTempo(state.bpm), [engine, state.bpm])
  useEffect(() => engine?.setCrackle(state.playing && Boolean(song.kit.crackle)), [engine, state.playing, song.kit.crackle])

  const hear = (pad: number, bar: number, note?: number, chord = state.chords[bar]) => {
    if (!engine) return
    void engine.resume()
    engine.trigger(pad, engine.now(), { song, chord, step: at?.step ?? 0, bar, note })
  }

  const tapPad = (pad: number) => {
    dispatch({ type: 'selectPad', pad })
    const bar = at?.bar ?? 0
    hear(pad, bar, pad === LEAD ? leadNote(state, song, at?.step ?? 0, bar) || 60 + state.key.tonic : undefined)
  }

  const loadSong = (id: (typeof songs)[number]['id']) => {
    dispatch({ type: 'loadSong', songId: id })
    if (!state.playing) toggle()
  }

  const share = async () => {
    const hash = encodeLoop(state)
    window.history.replaceState(null, '', hash)
    try {
      await navigator.clipboard.writeText(window.location.href)
      setNotice('Link copied')
    } catch {
      setNotice('Copy the address bar')
    }
    setTimeout(() => setNotice(undefined), 2500)
  }

  // on wide screens the machine is scaled to fill the window, leaving room below for the tray
  useEffect(() => {
    const fit = () => {
      const wide = window.innerWidth >= 900
      const zoom = wide ? Math.min(1.8, (window.innerHeight - 200) / 640, (window.innerWidth - 110) / 860) : 1
      document.documentElement.style.setProperty('--machine-zoom', String(zoom))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const tempo = (state.bpm - TEMPO.min) / (TEMPO.max - TEMPO.min)

  return (
    <>
      <div className="device">
        <div className="device__top">
          <i className={`led${at && at.step % 4 === 0 ? ' is-on' : ''}`} aria-hidden="true" />
          <b className="device__logo">DC-1</b>
          <span className="device__plate">
            Rhythm composer
            <br />
            Daniel Cross, Stockholm
          </span>
          <span className="device__grille" aria-hidden="true" />
        </div>
        <div className="stripe" aria-hidden="true" />

        <div className="device__cols">
          <div className="device__col">
            <Lcd state={state} song={song} at={at} notice={notice} onChord={(bar) => { dispatch({ type: 'tapChord', bar }); hear(4, bar) }} />
            <div className="songs">
              {songs.map((s) => (
                <button key={s.id} aria-pressed={s.id === state.songId} onClick={() => loadSong(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
            <div className="knobs">
              <Knob label="Tempo" value={tempo} valueText={`${state.bpm} bpm`} onChange={(v) => dispatch({ type: 'setKnob', knob: 'bpm', value: Math.round(TEMPO.min + v * (TEMPO.max - TEMPO.min)) })} />
              <Knob label="Tone" accent value={state.tone} valueText={`${Math.round(state.tone * 100)} percent`} onChange={(v) => dispatch({ type: 'setKnob', knob: 'tone', value: v })} />
              <Knob label="Echo" value={state.echo / 0.5} valueText={`${Math.round(state.echo * 200)} percent`} onChange={(v) => dispatch({ type: 'setKnob', knob: 'echo', value: v * 0.5 })} />
              <Knob label="Reverb" value={state.reverb} valueText={`${Math.round(state.reverb * 100)} percent`} onChange={(v) => dispatch({ type: 'setKnob', knob: 'reverb', value: v })} />
            </div>
          </div>

          <div className="device__col">
            <div className="steps">
              {Array.from({ length: 16 }, (_, step) => {
                const on = Boolean(state.patterns[state.pad] & (1 << step))
                const placed = state.pad === LEAD && on ? state.notes[step] : null
                const picking = state.tray?.kind === 'note' && state.tray.step === step
                return (
                  <button
                    key={step}
                    className={`${at?.step === step ? 'is-now' : ''}${picking ? ' is-picking' : ''}`}
                    aria-pressed={on}
                    aria-label={placed != null ? `Step ${step + 1}, ${noteName(placed)}` : `Step ${step + 1}`}
                    onClick={() => dispatch({ type: 'tapStep', step })}
                  >
                    {placed != null ? noteName(placed) : null}
                  </button>
                )
              })}
            </div>
            <div className="pads">
              {PADS.map((name, pad) => {
                const hit = at !== null && Boolean(state.patterns[pad] & (1 << at.step))
                return (
                  <button
                    key={name}
                    className={`pad${hit ? ' is-hit' : ''}`}
                    aria-pressed={state.pad === pad}
                    aria-label={name}
                    onPointerDown={() => tapPad(pad)}
                    onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && tapPad(pad)}
                  >
                    <b aria-hidden="true">{pad + 1}</b>
                    <span aria-hidden="true">{name}</span>
                  </button>
                )
              })}
            </div>
            <div className="transport">
              <button className="transport__play" aria-pressed={state.playing} onClick={toggle}>
                {state.playing ? 'Stop' : 'Play'}
              </button>
              <button onClick={() => dispatch({ type: 'clearPad' })}>Clear</button>
              <button onClick={share}>Share</button>
            </div>
          </div>
        </div>
      </div>
      <Tray
        state={state}
        dispatch={dispatch}
        preview={(what) => ('note' in what ? hear(LEAD, at?.bar ?? 0, what.note) : hear(4, what.bar, undefined, what.chord))}
      />
    </>
  )
}
