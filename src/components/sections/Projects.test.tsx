import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { projects } from "@/content/projects"

import { Projects } from "./Projects"

describe("Projects", () => {
  it("renders one card per entry in projects, each with the project name as a heading", () => {
    render(<Projects />)
    for (const project of projects) {
      expect(
        screen.getByRole("heading", { name: project.name })
      ).toBeInTheDocument()
    }
  })

  it("renders an accessibly-labelled link for every project link", () => {
    render(<Projects />)
    for (const project of projects) {
      const heading = screen.getByRole("heading", { name: project.name })
      const card = heading.closest("article")
      expect(card).not.toBeNull()
      // Links are optional per content policy; when present they must be
      // rendered and accessibly named.
      const links = within(card as HTMLElement).queryAllByRole("link")
      expect(links.length).toBe(project.links.length)
      for (const link of links) {
        expect(link).toHaveAccessibleName()
      }
    }
  })

  it("renders the section landmark with id=projects", () => {
    const { container } = render(<Projects />)
    expect(container.querySelector("#projects")).toBeInTheDocument()
  })
})
