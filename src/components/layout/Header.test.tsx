import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Header } from "./Header"

describe("Header", () => {
  it("renders a labelled GitHub link", () => {
    render(<Header />)
    const githubLinks = screen.getAllByRole("link", { name: /github/i })
    expect(githubLinks.length).toBeGreaterThan(0)
    expect(githubLinks[0].getAttribute("href")).toContain("github.com")
    expect(githubLinks[0]).toHaveAccessibleName()
  })

  it("renders anchor nav links to About, Projects, and Contact", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about"
    )
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "#projects"
    )
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "#contact"
    )
  })
})
