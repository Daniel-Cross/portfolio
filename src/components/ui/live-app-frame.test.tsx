import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { LiveAppFrame } from "./live-app-frame"

const links = [{ label: "Open full app", href: "https://www.footballalpha.org" }]

describe("LiveAppFrame", () => {
  it("renders an iframe with the given src and title", () => {
    render(
      <LiveAppFrame
        url="https://www.footballalpha.org"
        title="Football Alpha live app"
        links={links}
      />
    )
    const iframe = screen.getByTitle("Football Alpha live app")
    expect(iframe).toHaveAttribute("src", "https://www.footballalpha.org")
  })

  it("renders a link for every entry in links", () => {
    render(
      <LiveAppFrame
        url="https://www.footballalpha.org"
        title="Football Alpha live app"
        links={links}
      />
    )
    const link = screen.getByRole("link", { name: "Open full app" })
    expect(link).toHaveAttribute("href", "https://www.footballalpha.org")
  })

  it("renders the wallet caveat note", () => {
    render(
      <LiveAppFrame
        url="https://www.footballalpha.org"
        title="Football Alpha live app"
        links={links}
      />
    )
    expect(screen.getByText(/extensions do not inject/i)).toBeInTheDocument()
  })
})
