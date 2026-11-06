import { render } from '@testing-library/react'
import { createRef, type MutableRefObject } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { FxCanvas } from './FxCanvas'

const beat = () => Object.assign(createRef<number>(), { current: 0 }) as MutableRefObject<number>

function motion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced && query.includes('reduce'), addEventListener() {}, removeEventListener() {} }))
}

let raf: ReturnType<typeof vi.fn>
let cancel: ReturnType<typeof vi.fn>

beforeEach(() => {
  raf = vi.fn(() => 7)
  cancel = vi.fn()
  vi.stubGlobal('requestAnimationFrame', raf)
  vi.stubGlobal('cancelAnimationFrame', cancel)
  // jsdom has no canvas; a context that accepts any call is enough to run the draw code
  const ctx = new Proxy({}, { get: (_t, key) => (key === 'canvas' ? {} : () => ({ addColorStop() {} })), set: () => true })
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test('the clean look runs no animation', () => {
  motion(false)
  render(<FxCanvas look="clean" beatRef={beat()} />)
  expect(raf).not.toHaveBeenCalled()
})

test('a decade look starts a loop and unmounting cancels it', () => {
  motion(false)
  const view = render(<FxCanvas look="e80" beatRef={beat()} />)
  expect(raf).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(cancel).toHaveBeenCalledWith(7)
})

test('reduced motion draws one still frame and leaves no loop running', () => {
  motion(true)
  render(<FxCanvas look="e80" beatRef={beat()} />)
  expect(raf.mock.calls.length).toBeLessThanOrEqual(1)
  const [frame] = raf.mock.calls[0] ?? []
  if (frame) (frame as FrameRequestCallback)(16)
  expect(raf.mock.calls.length).toBeLessThanOrEqual(1)
})
