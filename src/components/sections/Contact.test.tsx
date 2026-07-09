import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Contact } from "./Contact"

describe("Contact", () => {
  it("renders a mailto:hello@danielcross.dev link (always present)", () => {
    render(<Contact />)
    const mailtoLink = screen.getByRole("link", {
      name: /hello@danielcross\.dev/i,
    })
    expect(mailtoLink).toHaveAttribute(
      "href",
      "mailto:hello@danielcross.dev"
    )
  })

  it("renders both dual-path availability lines verbatim", () => {
    render(<Contact />)
    expect(
      screen.getByText(/Contract.*The App Forge AB/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Full-time.*senior\/staff crypto/)
    ).toBeInTheDocument()
  })

  it("renders a LinkedIn link and a GitHub link", () => {
    render(<Contact />)
    expect(
      screen.getByRole("link", { name: /linkedin/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /github/i })
    ).toBeInTheDocument()
  })
})
