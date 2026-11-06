import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { TopBar, type TopBarProps } from './TopBar'

const props = (over: Partial<TopBarProps> = {}): TopBarProps => ({
  page: 0,
  playing: false,
  volume: 0.8,
  look: 'clean',
  immersion: true,
  onPlay: vi.fn(),
  onVolume: vi.fn(),
  onGo: vi.fn(),
  onPickLook: vi.fn(),
  onImmersion: vi.fn(),
  onTheme: vi.fn(),
  ...over,
})

test('shows every control with its plain label', () => {
  render(<TopBar {...props()} />)
  expect(screen.getByText('Daniel Cross')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  expect(screen.getByRole('slider', { name: 'Music volume' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Go to the machine' })).toBeInTheDocument()
  expect(screen.getByRole('combobox', { name: 'Look of the site' })).toHaveValue('clean')
  expect(screen.getByRole('button', { name: 'Immersion on' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'Light / dark' })).toBeInTheDocument()
})

test('the play button says exactly Play or Pause', () => {
  const { rerender } = render(<TopBar {...props()} />)
  expect(screen.getByRole('button', { name: 'Play' })).toHaveTextContent(/^Play$/)
  rerender(<TopBar {...props({ playing: true })} />)
  expect(screen.getByRole('button', { name: 'Pause' })).toHaveTextContent(/^Pause$/)
})

test('on the machine page the switch goes back to the CV', () => {
  render(<TopBar {...props({ page: 1 })} />)
  expect(screen.getByRole('button', { name: 'Back to the CV' })).toBeInTheDocument()
})

test('light and dark is only offered on the clean look', () => {
  render(<TopBar {...props({ look: 'e90' })} />)
  expect(screen.queryByRole('button', { name: 'Light / dark' })).toBeNull()
})

test('immersion off is labelled and unpressed', () => {
  render(<TopBar {...props({ immersion: false })} />)
  expect(screen.getByRole('button', { name: 'Immersion off' })).toHaveAttribute('aria-pressed', 'false')
})

test('controls report what the visitor did', () => {
  const p = props()
  render(<TopBar {...p} />)
  fireEvent.click(screen.getByRole('button', { name: 'Play' }))
  fireEvent.click(screen.getByRole('button', { name: 'Go to the machine' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Look of the site' }), { target: { value: 'e80' } })
  fireEvent.change(screen.getByRole('slider', { name: 'Music volume' }), { target: { value: '0.4' } })
  expect(p.onPlay).toHaveBeenCalledOnce()
  expect(p.onGo).toHaveBeenCalledOnce()
  expect(p.onPickLook).toHaveBeenCalledWith('e80')
  expect(p.onVolume).toHaveBeenCalledWith(0.4)
})

test('the phone menu opens and closes, and a tap elsewhere closes it', () => {
  render(<TopBar {...props()} />)
  const menu = screen.getByRole('button', { name: 'Menu' })
  expect(menu).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(menu)
  expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true')
  fireEvent.pointerDown(document.body)
  expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
})
