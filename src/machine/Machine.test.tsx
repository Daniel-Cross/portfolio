import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import type { Engine } from './engine'

const triggers: number[] = []
let running = true
const resume = vi.fn(async () => {})
const engine: Engine = {
  resume,
  running: () => running,
  now: () => 0,
  setVolume() {},
  setTone() {},
  setEcho() {},
  setReverb() {},
  setTempo() {},
  setCrackle() {},
  trigger: (pad) => void triggers.push(pad),
}
let available = true
vi.mock('./engine', () => ({ createEngine: () => (available ? engine : null) }))

const { default: Machine } = await import('./Machine')

const machine = (page: 0 | 1, onPlayingChange = vi.fn()) => (
  <Machine audio={null} page={page} volume={0.8} onPlayingChange={onPlayingChange} onSongLook={() => {}} onBeat={() => {}} registerToggle={() => {}} />
)

const mount = () => {
  const onPlayingChange = vi.fn()
  const view = render(machine(1, onPlayingChange))
  return { onPlayingChange, ...view }
}

beforeEach(() => {
  available = true
  running = true
  resume.mockClear()
  triggers.length = 0
  window.location.hash = ''
})

test('the screen starts with Press play and the song chords', () => {
  mount()
  expect(screen.getByText('Press play')).toBeInTheDocument()
  expect(screen.getByText('Key of C major')).toBeInTheDocument()
  for (const chord of ['Dm7', 'G7', 'Cmaj7', 'Am7']) expect(screen.getByRole('button', { name: chord })).toBeInTheDocument()
})

test('tapping a step on the Lead pad opens the note tray', () => {
  mount()
  fireEvent.pointerDown(screen.getByRole('button', { name: 'Lead' }))
  fireEvent.click(screen.getByRole('button', { name: /^Step 5\b/ }))
  const tray = screen.getByRole('region', { name: 'Notes and chords' })
  expect(within(tray).getByText('Step 5: pick a note')).toBeInTheDocument()
  expect(within(tray).getByRole('button', { name: 'Remove note' })).toBeInTheDocument()
})

test('picking a note shows it on the step', () => {
  mount()
  fireEvent.pointerDown(screen.getByRole('button', { name: 'Lead' }))
  fireEvent.click(screen.getByRole('button', { name: /^Step 5\b/ }))
  fireEvent.click(screen.getByRole('button', { name: 'G4' }))
  expect(screen.getByRole('button', { name: 'Step 5, G4' })).toHaveAttribute('aria-pressed', 'true')
})

test('tapping a chord opens the chord tray with plain chords from the key', () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'G7' }))
  const tray = screen.getByRole('region', { name: 'Notes and chords' })
  expect(within(tray).getByText('Bar 2: pick a chord')).toBeInTheDocument()
  expect(within(tray).getByRole('button', { name: 'Sevenths' })).toHaveAttribute('aria-pressed', 'false')
  for (const chord of ['C', 'Dm', 'Em', 'F', 'G', 'Am']) expect(within(tray).getByRole('button', { name: chord })).toBeInTheDocument()
})

test('Key + moves the whole song up a semitone', () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'G7' }))
  fireEvent.click(screen.getByRole('button', { name: 'Key +' }))
  expect(screen.getByText('Key of C# major')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Ebm7' })).toBeInTheDocument()
})

test('the machine shows music, not jobs', () => {
  mount()
  expect(screen.queryByText(/Fact Machine|MetaMask|Open it/)).toBeNull()
})

test('pressing Play reports playing, and Stop reports stopped', () => {
  const { onPlayingChange } = mount()
  fireEvent.click(screen.getByRole('button', { name: 'Play' }))
  expect(onPlayingChange).toHaveBeenLastCalledWith(true)
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
  expect(onPlayingChange).toHaveBeenLastCalledWith(false)
})

test('with no audio support Play does nothing and does not throw', () => {
  available = false
  const { onPlayingChange } = mount()
  fireEvent.click(screen.getByRole('button', { name: 'Play' }))
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  expect(onPlayingChange).not.toHaveBeenCalledWith(true)
})

test('a share link in the address bar restores the loop; a bad one is ignored', async () => {
  const { encodeLoop } = await import('./share')
  const { initialState } = await import('./state')
  window.location.hash = encodeLoop({ ...initialState('e80'), bpm: 131 })
  mount()
  expect(screen.getByText('131 bpm')).toBeInTheDocument()
  expect(screen.getByText('Key of D minor')).toBeInTheDocument()
})

test('a broken share link falls back to the default song', () => {
  window.location.hash = '#garbage'
  mount()
  expect(screen.getByText('76 bpm')).toBeInTheDocument()
})

test('leaving the machine page closes the tray', () => {
  const { rerender } = mount()
  fireEvent.click(screen.getByRole('button', { name: 'G7' }))
  expect(screen.getByText('Bar 2: pick a chord')).toBeInTheDocument()
  rerender(machine(0))
  expect(screen.queryByText('Bar 2: pick a chord')).toBeNull()
})

test('opening the tray moves focus into it; Escape closes it and gives focus back', () => {
  mount()
  const chord = screen.getByRole('button', { name: 'G7' })
  chord.focus()
  fireEvent.click(chord)
  const tray = screen.getByRole('region', { name: 'Notes and chords' })
  expect(tray.contains(document.activeElement)).toBe(true)
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
  expect(screen.queryByText('Bar 2: pick a chord')).toBeNull()
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'G7' }))
})

test('pads stay silent until sound is unlocked, and a click unlocks it', () => {
  running = false
  mount()
  const kick = screen.getByRole('button', { name: 'Kick' })
  fireEvent.pointerDown(kick)
  expect(triggers).toEqual([])
  fireEvent.click(kick)
  expect(resume).toHaveBeenCalled()
  expect(kick).toHaveAttribute('aria-pressed', 'true')
})

test('the hidden tune loads and starts when asked, and stopping it brings the default song back', () => {
  const onPlayingChange = vi.fn()
  const secret = (on: boolean) => (
    <Machine audio={null} page={0} secret={on} volume={0.8} onPlayingChange={onPlayingChange} onSongLook={() => {}} onBeat={() => {}} registerToggle={() => {}} />
  )
  const { rerender } = render(secret(true))
  expect(onPlayingChange).toHaveBeenLastCalledWith(true)
  expect(screen.getByText('Secret 64')).toBeInTheDocument()
  rerender(secret(false))
  expect(onPlayingChange).toHaveBeenLastCalledWith(false)
  expect(screen.getByText('76 bpm')).toBeInTheDocument()
})
