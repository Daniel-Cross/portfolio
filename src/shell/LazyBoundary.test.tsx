import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { LazyBoundary } from './LazyBoundary'

const Broken = () => {
  throw new Error('chunk failed to load')
}

test('a part that fails to load is replaced by its fallback and the rest of the page stays', () => {
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
  const onError = vi.fn()
  render(
    <main>
      <p>The CV</p>
      <LazyBoundary fallback={<p>Could not load the machine</p>} onError={onError}>
        <Broken />
      </LazyBoundary>
    </main>,
  )
  expect(screen.getByText('The CV')).toBeInTheDocument()
  expect(screen.getByText('Could not load the machine')).toBeInTheDocument()
  expect(onError).toHaveBeenCalledOnce()
  quiet.mockRestore()
})
