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

  it("renders at least one accessibly-labelled link per card", () => {
    render(<Projects />)
    for (const project of projects) {
      const heading = screen.getByRole("heading", { name: project.name })
      const card = heading.closest("article")
      expect(card).not.toBeNull()
      const links = within(card as HTMLElement).getAllByRole("link")
      expect(links.length).toBeGreaterThan(0)
      expect(links[0]).toHaveAccessibleName()
    }
  })

  it("renders the section landmark with id=projects", () => {
    const { container } = render(<Projects />)
    expect(container.querySelector("#projects")).toBeInTheDocument()
  })
})
