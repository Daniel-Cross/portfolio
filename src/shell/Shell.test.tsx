import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

// like the real machine, the stand-in reports "not playing" as soon as it appears
vi.mock('next/dynamic', async () => {
  const { useEffect } = await import('react')
  const Stub = ({ onPlayingChange }: { onPlayingChange?: (playing: boolean) => void }) => {
    useEffect(() => onPlayingChange?.(false), [onPlayingChange])
    return <div>the machine</div>
  }
  return { default: () => Stub }
})
const { Shell } = await import('./Shell')

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => setTimeout(() => fn(0), 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  Element.prototype.scrollTo = vi.fn()
})

afterEach(() => {
  vi.unstubAllGlobals()
  window.location.hash = ''
})

test('a plain visit does not load the machine', async () => {
  render(<Shell>cv</Shell>)
  await act(() => new Promise((r) => setTimeout(r, 5)))
  expect(screen.queryByText('the machine')).toBeNull()
})

test('a shared loop link opens on the machine', async () => {
  window.location.hash = '#v1.abc'
  render(<Shell>cv</Shell>)
  await act(() => new Promise((r) => setTimeout(r, 5)))
  expect(screen.getByText('the machine')).toBeInTheDocument()
  expect(Element.prototype.scrollTo).toHaveBeenCalled()
})

test('pressing the hidden button loads the machine', async () => {
  render(
    <Shell>
      <button data-secret aria-label="Play a hidden tune" />
    </Shell>,
  )
  expect(screen.queryByText('the machine')).toBeNull()
  await act(async () => screen.getByRole('button', { name: 'Play a hidden tune' }).click())
  // the stub stands in for both lazy parts, so the machine and the look's background may both appear
  expect(screen.getAllByText('the machine').length).toBeGreaterThan(0)
  expect(document.documentElement.dataset.era).toBe('c64')
})
