import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

vi.mock('next/dynamic', () => ({ default: () => () => <div>the machine</div> }))
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
