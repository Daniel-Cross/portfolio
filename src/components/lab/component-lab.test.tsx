import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ComponentLab } from "./component-lab"
import { ConsensusDial } from "./consensus-dial"

const TILE_NAMES = [
  "Consensus Dial",
  "Pixel Loader",
  "Looping Gradient Text",
  "Glass Control",
  "Animated Gradient Pill",
]

describe("ComponentLab", () => {
  it("renders all 5 lab component names as headings", () => {
    render(<ComponentLab />)
    for (const name of TILE_NAMES) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument()
    }
  })

  it("renders the section landmark with id=lab", () => {
    const { container } = render(<ComponentLab />)
    expect(container.querySelector("#lab")).toBeInTheDocument()
  })
})

describe("ConsensusDial", () => {
  it("fires onChange with a changed rounded value on pointer drag", () => {
    const handleChange = vi.fn()
    render(<ConsensusDial onChange={handleChange} />)

    const slider = screen.getByRole("slider")
    fireEvent.pointerDown(slider, { clientX: 200, pointerId: 1 })
    fireEvent.pointerMove(slider, { clientX: 120, pointerId: 1 })
    fireEvent.pointerUp(slider, { clientX: 120, pointerId: 1 })

    expect(handleChange).toHaveBeenCalled()
    const lastValue = handleChange.mock.calls.at(-1)?.[0]
    expect(typeof lastValue).toBe("number")
    expect(lastValue).not.toBe(50)
  })
})
