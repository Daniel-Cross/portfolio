import { expect, test } from 'vitest'
import { machineZoom, usesWideLayout } from './fit'

test('a desktop window scales the wide machine to fit', () => {
  expect(usesWideLayout(1470, 808)).toBe(true)
  expect(machineZoom(1470, 808)).toBeCloseTo((808 - 200) / 640)
})

test('a phone held sideways gets the scrolling layout at full size, not a tiny machine', () => {
  expect(usesWideLayout(932, 430)).toBe(false)
  expect(machineZoom(932, 430)).toBe(1)
})

test('a phone held upright gets the scrolling layout at full size', () => {
  expect(usesWideLayout(390, 844)).toBe(false)
  expect(machineZoom(390, 844)).toBe(1)
})

test('the wide machine never grows past 1.8 times', () => {
  expect(machineZoom(4000, 3000)).toBe(1.8)
})
