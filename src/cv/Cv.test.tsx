import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Cv } from './Cv'

test('the name is the page heading', () => {
  render(<Cv />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Daniel Cross')
})

test('the only hero button is Email me', () => {
  render(<Cv />)
  const email = screen.getAllByRole('link', { name: 'Email me' })
  expect(email).toHaveLength(1)
  expect(email[0]).toHaveAttribute('href', 'mailto:hello@danielcross.dev')
  expect(screen.queryByText('Book a call')).toBeNull()
  expect(screen.queryByText('Download CV')).toBeNull()
})

test('sections come in the agreed order', () => {
  render(<Cv />)
  const names = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(names).toEqual(['What I do', 'Work', 'Projects'])
})

test('the Work section has seven cards', () => {
  render(<Cv />)
  const section = screen.getByRole('region', { name: 'Work' })
  expect(within(section).getAllByRole('article')).toHaveLength(7)
})

test('the name is the switch for the hidden tune', () => {
  render(<Cv />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('data-secret')
  expect(screen.queryByRole('button', { name: 'Play a hidden tune' })).toBeNull()
})
