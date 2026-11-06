'use client'

import { useEffect, useState } from 'react'
import type { Look } from '@/looks/looks'

export type TopBarProps = {
  page: 0 | 1
  playing: boolean
  volume: number
  look: Look
  immersion: boolean
  onPlay(): void
  onVolume(volume: number): void
  onGo(): void
  onPickLook(look: Look): void
  onImmersion(): void
  onTheme(): void
}

const LOOKS: [Look, string][] = [
  ['clean', 'Look: clean'],
  ['e80', 'Look: 80s'],
  ['e90', 'Look: 90s'],
  ['e00', 'Look: 00s'],
  ['e10', 'Look: 10s'],
]

/** The bar across the top of both pages. On a phone the last group folds into a menu. */
export function TopBar(p: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('.bar__more, .bar__menu')) setMenuOpen(false)
    }
    const closeOnScroll = () => setMenuOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('scroll', closeOnScroll, { capture: true, passive: true })
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('scroll', closeOnScroll, { capture: true })
    }
  }, [menuOpen])

  return (
    <header className="bar">
      <span className="label bar__name">Daniel Cross</span>
      <button className="btn bar__play" aria-pressed={p.playing} onClick={p.onPlay}>
        {p.playing ? 'Pause' : 'Play'}
      </button>
      <button className="btn bar__go" onClick={p.onGo}>
        {p.page === 0 ? 'Go to the machine' : 'Back to the CV'}
      </button>
      <button className="btn bar__menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? 'Close' : 'Menu'}
      </button>
      <div className={`bar__more${menuOpen ? ' is-open' : ''}`}>
        <input
          className="bar__volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={p.volume}
          aria-label="Music volume"
          onChange={(event) => p.onVolume(Number(event.target.value))}
        />
        <select
          className="btn bar__look"
          aria-label="Look of the site"
          value={p.look}
          onChange={(event) => p.onPickLook(event.target.value as Look)}
        >
          {LOOKS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
          {p.look === 'c64' ? <option value="c64">Look: ????</option> : null}
        </select>
        <button className="btn bar__immersion" aria-pressed={p.immersion} onClick={p.onImmersion}>
          {p.immersion ? 'Immersion on' : 'Immersion off'}
        </button>
        {p.look === 'clean' ? (
          <button className="btn bar__theme" onClick={p.onTheme}>
            Light / dark
          </button>
        ) : null}
      </div>
    </header>
  )
}
