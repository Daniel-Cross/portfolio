import { existsSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { projects } from "./projects"

const publicDir = path.resolve(import.meta.dirname, "../../public")

describe("projects", () => {
  it("contains 5 entries", () => {
    expect(projects.length).toBe(5)
  })

  it("includes Football Alpha, MetaMask, Ahlsell, Safe Haven, and Neo", () => {
    const names = projects.map((p) => p.name)
    expect(names).toEqual(
      expect.arrayContaining([
        "Football Alpha",
        "MetaMask",
        "Ahlsell",
        "Safe Haven",
        "Neo",
      ])
    )
  })

  it("every project has a blurb, at least one tag, and only valid links", () => {
    for (const project of projects) {
      expect(project.blurb.length).toBeGreaterThan(0)
      expect(project.tags.length).toBeGreaterThan(0)
      // Links are optional (content honesty: no invented URLs), but any
      // present link must be a labelled https URL.
      for (const link of project.links) {
        expect(link.label.length).toBeGreaterThan(0)
        expect(link.href).toMatch(/^https:\/\//)
      }
    }
  })

  it("every project screenshot exists in public/", () => {
    for (const project of projects) {
      const screenshotPath = path.join(publicDir, project.screenshot)
      expect(
        existsSync(screenshotPath),
        `expected screenshot to exist at ${screenshotPath} (project.screenshot: ${project.screenshot})`
      ).toBe(true)
    }
  })
})
