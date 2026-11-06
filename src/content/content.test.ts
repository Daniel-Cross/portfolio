import { expect, test } from 'vitest'
import { projects, site, skills, work } from './index'

test('work cards are the seven agreed, in order', () => {
  expect(work.map((w) => w.name)).toEqual([
    'Fact Machine',
    'Use AI',
    'MetaMask Mobile',
    'Ahlsell',
    'Yomento',
    'Booking.com',
    'Skiddle',
  ])
})

test('projects are the four agreed, in order', () => {
  expect(projects.map((p) => p.name)).toEqual(['Football Alpha', 'Haven', 'Neo', 'Bandwagon'])
})

test('no placeholders or unverified chain claims anywhere', () => {
  const all = JSON.stringify({ work, projects, skills, site })
  for (const banned of ['need from you', 'Bitcoin', 'Tron', '—']) expect(all).not.toContain(banned)
})

test('every proof link is https and MetaMask links its pull requests', () => {
  for (const w of work) for (const p of w.proof) expect(p.href).toMatch(/^https:\/\//)
  const mm = work.find((w) => w.slug === 'metamask')!
  expect(mm.proof.map((p) => p.href).join(' ')).toMatch(/pull\/12429.*pull\/15799.*pull\/16073/)
})

test('Bandwagon has no links', () => {
  expect(projects[3].links).toEqual([])
})
