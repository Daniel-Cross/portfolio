import { render, screen } from "@testing-library/react"
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
      const firstLink = project.links[0]
      expect(
        screen.getByRole("link", { name: new RegExp(firstLink.label, "i") })
      ).toHaveAccessibleName()
    }
  })

  it("renders the section landmark with id=projects", () => {
    const { container } = render(<Projects />)
    expect(container.querySelector("#projects")).toBeInTheDocument()
  })
})
