import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Hero } from "./Hero"

describe("Hero", () => {
  it("renders name, role, and the ex-MetaMask hook above the fold", () => {
    render(<Hero />)
    expect(screen.getByText(/Daniel Cross/)).toBeInTheDocument()
    expect(screen.getByText(/Senior React Native/)).toBeInTheDocument()
    expect(screen.getByText(/ex-MetaMask/)).toBeInTheDocument()
  })

  it("renders the concrete-numbers subhead", () => {
    render(<Hero />)
    const subhead = screen.getByText(/30M\+/)
    expect(subhead).toBeInTheDocument()
    expect(subhead.textContent).toMatch(/MetaMask/)
  })

  it("renders a primary CTA to #projects and a secondary CTA to #contact", () => {
    render(<Hero />)
    expect(screen.getByRole("link", { name: /view work/i })).toHaveAttribute(
      "href",
      "#projects"
    )
    expect(
      screen.getByRole("link", { name: /get in touch/i })
    ).toHaveAttribute("href", "#contact")
  })
})
