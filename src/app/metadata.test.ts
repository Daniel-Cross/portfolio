import { expect, test } from 'vitest'
import { site } from '@/content'
import { metadata, personJsonLd } from './seo'

test('title and description carry the words a recruiter searches for', () => {
  expect(metadata.title).toBe('Daniel Cross | Lead Mobile Engineer, React Native and Crypto')
  const description = metadata.description as string
  expect(description).toContain('React Native')
  expect(description).toContain('Solana')
  expect(description.length).toBeLessThan(160)
})

test('share preview points at the live site', () => {
  expect(metadata.openGraph).toMatchObject({ url: 'https://danielcross.dev' })
})

test('structured data describes the person', () => {
  expect(personJsonLd).toMatchObject({
    '@type': 'Person',
    name: 'Daniel Cross',
    jobTitle: 'Lead Mobile Engineer',
    address: { addressLocality: 'Stockholm' },
  })
  expect(personJsonLd.sameAs).toEqual(expect.arrayContaining([site.github, site.linkedin]))
})
