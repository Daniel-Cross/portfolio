'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { effectiveLook, pickLook, type Look } from '@/looks/looks'
import { createAudioContext } from '@/machine/audio'
import { LazyBoundary } from './LazyBoundary'
import { TopBar } from './TopBar'

// the machine and the animated backgrounds are only downloaded when the visitor asks for them
const Machine = dynamic(() => import('@/machine/Machine'), { ssr: false })
const FxCanvas = dynamic(() => import('@/looks/FxCanvas'), { ssr: false })

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Shell({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<0 | 1>(0)
  const [machineWanted, setMachineWanted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [picked, setPicked] = useState<Look>('clean')
  const [immersion, setImmersion] = useState(true)
  const [songLook, setSongLook] = useState<Look>('e10')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [audio, setAudio] = useState<AudioContext | null>(null)
  const [secret, setSecret] = useState(false)

  const deck = useRef<HTMLDivElement>(null)
  const toggle = useRef<(() => void) | null>(null)
  const playWhenReady = useRef(false)
  const beat = useRef(0)

  // the easter egg brings its own look, whatever the immersion setting
  const look = secret ? 'c64' : effectiveLook({ immersion, playing, songLook, picked })

  useEffect(() => {
    const root = document.documentElement
    if ((root.dataset.era ?? 'clean') === look) return
    const apply = () => {
      if (look === 'clean') delete root.dataset.era
      else root.dataset.era = look
    }
    // wipe the new look across the screen where the browser can and the visitor allows motion
    if (document.startViewTransition && !reducedMotion()) document.startViewTransition(apply)
    else apply()
  }, [look])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // someone sent a loop: open on the machine so they can see it and press Play
  useEffect(() => {
    if (!window.location.hash.startsWith('#v1.')) return
    const frame = requestAnimationFrame(() => {
      setMachineWanted(true)
      deck.current?.scrollTo({ left: deck.current.clientWidth })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  /** Browsers only allow sound that starts inside a tap, so the audio context is made here, before the machine loads. */
  const wantMachine = () => {
    if (!machineWanted) {
      const context = createAudioContext()
      void context?.resume()
      setAudio(context)
    }
    setMachineWanted(true)
  }

  const onPlay = () => {
    wantMachine()
    if (toggle.current) toggle.current()
    else playWhenReady.current = true
  }

  const registerToggle = useCallback((fn: () => void) => {
    toggle.current = fn
    if (playWhenReady.current) {
      playWhenReady.current = false
      fn()
    }
  }, [])

  const onGo = () => {
    const el = deck.current
    if (!el) return
    if (page === 0) wantMachine()
    el.scrollTo({ left: page === 0 ? el.clientWidth : 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  const onDeckScroll = () => {
    const el = deck.current
    if (!el) return
    const now = Math.round(el.scrollLeft / el.clientWidth) === 0 ? 0 : 1
    if (now === page) return
    setPage(now)
    if (now === 1) wantMachine()
  }

  // stopping the music ends the easter egg; the machine also reports "not playing" when it first appears, which must not
  const wasPlaying = useRef(false)
  const onPlayingChange = useCallback((now: boolean) => {
    setPlaying(now)
    if (wasPlaying.current && !now) setSecret(false)
    wasPlaying.current = now
  }, [])

  const onBeat = useCallback(() => {
    beat.current = 1
    if (reducedMotion()) return
    const name = document.getElementById('name')
    name?.classList.add('is-kick')
    setTimeout(() => name?.classList.remove('is-kick'), 70)
  }, [])

  return (
    <>
      <TopBar
        page={page}
        playing={playing}
        volume={volume}
        look={look}
        immersion={immersion}
        onPlay={onPlay}
        onVolume={setVolume}
        onGo={onGo}
        onPickLook={(next) => {
          const result = pickLook({ immersion, playing }, next)
          setPicked(result.picked)
          setImmersion(result.immersion)
        }}
        onImmersion={() => setImmersion((on) => !on)}
        onTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />
      {look !== 'clean' ? (
        <LazyBoundary>
          <FxCanvas look={look} beatRef={beat} />
        </LazyBoundary>
      ) : null}
      <div className="frame" aria-hidden="true" />
      <div className="tape" aria-hidden="true">
        <span>PLAY &#9654;</span>
        <span>SP 0:00:00 &nbsp; NOV. 06 2017</span>
      </div>
      {page === 0 ? (
        <div className="chat" aria-hidden="true">
          <p><b>mika_92</b> anyone else studying for finals?</p>
          <p><b>joao</b> greetings from brazil</p>
          <p><b>sleepycat</b> this beat tho</p>
          <p><b>dev_lena</b> shipping at 2am again</p>
          <p><b>okan</b> hire this guy</p>
        </div>
      ) : null}
      <div
        className="deck"
        ref={deck}
        onScroll={onDeckScroll}
        onClick={(event) => {
          // the name is the hidden switch, but only on the default look
          if (!(event.target instanceof Element) || !event.target.closest('[data-secret]')) return
          if (!secret && look !== 'clean') return
          wantMachine()
          setSecret((on) => !on)
        }}
      >
        <section className="pane">{children}</section>
        <section className="pane pane--machine" aria-label="The DC-1 drum machine">
          <h2 className="machine-title">The DC-1</h2>
          {machineWanted ? (
            <LazyBoundary
              fallback={<p className="label">Could not load the machine. Reload the page to try again.</p>}
              onError={() => void (playWhenReady.current = false)}
            >
              <Machine
                audio={audio}
                page={page}
                secret={secret}
                volume={volume}
                onPlayingChange={onPlayingChange}
                onSongLook={setSongLook}
                onPickSong={() => setSecret(false)}
                onBeat={onBeat}
                registerToggle={registerToggle}
              />
            </LazyBoundary>
          ) : null}
        </section>
      </div>
    </>
  )
}
