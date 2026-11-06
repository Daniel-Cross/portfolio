import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import type { Engine } from './engine'

const triggers: number[] = []
const engine: Engine = {
  resume: async () => {},
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

const mount = () => {
  const onPlayingChange = vi.fn()
  render(
    <Machine audio={null} playing={false} volume={0.8} onPlayingChange={onPlayingChange} onSongLook={() => {}} onBeat={() => {}} registerToggle={() => {}} />,
  )
  return { onPlayingChange }
}

beforeEach(() => {
  available = true
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
