import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

test('test harness renders and asserts', () => {
  render(<p>harness ok</p>)
  expect(screen.getByText('harness ok')).toBeInTheDocument()
})
