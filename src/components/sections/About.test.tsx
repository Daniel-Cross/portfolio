import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { employers } from "@/content/employers"
import { skillGroups } from "@/content/skills"
import { socialProof } from "@/content/social-proof"

import { About } from "./About"

describe("About/Skills/SocialProof content", () => {
  it("employers includes MetaMask, The App Forge, Hackberry, Yomento, and BookingGo", () => {
    const names = employers.map((employer) => employer.name).join(" ")
    for (const name of [
      "MetaMask",
      "The App Forge",
      "Hackberry",
      "Yomento",
      "BookingGo",
    ]) {
      expect(names).toContain(name)
    }
  })

  it("skillGroups has at least two groups, each with a label and a non-empty skills list", () => {
    expect(skillGroups.length).toBeGreaterThanOrEqual(2)
    for (const group of skillGroups) {
      expect(group.label).toBeTruthy()
      expect(group.skills.length).toBeGreaterThan(0)
    }
  })

  it("socialProof includes items referencing ex-MetaMask, Evo Nordics, and Football Ramble / App Store", () => {
    const labels = socialProof.map((item) => item.label).join(" ")
    expect(labels).toMatch(/MetaMask/i)
    expect(labels).toMatch(/Evo Nordics/i)
    expect(labels).toMatch(/Football Ramble/i)
  })
})

describe("About", () => {
  it("renders all five employer names and has id=about", () => {
    const { container } = render(<About />)
    const list = screen.getByRole("list")
    for (const employer of employers) {
      expect(
        within(list).getByText(new RegExp(employer.name))
      ).toBeInTheDocument()
    }
    expect(container.querySelector("#about")).toBeInTheDocument()
  })
})
