import { act } from "react"
import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const HEARTBEAT_TICK_MS = 400

class FakeWebSocket {
  static instances: FakeWebSocket[] = []
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  onclose: (() => void) | null = null
  sent: string[] = []

  constructor(public url: string) {
    FakeWebSocket.instances.push(this)
  }

  send(data: string) {
    this.sent.push(data)
  }

  close() {
    // no-op: test drives lifecycle explicitly via onerror/onclose
  }
}

function stubFakeWebSocket() {
  FakeWebSocket.instances = []
  vi.stubGlobal("WebSocket", FakeWebSocket)
}

describe("SlotReadout", () => {
  beforeEach(() => {
    vi.resetModules()
    stubFakeWebSocket()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("shows the formatted slot, 'live', and 'Solana mainnet' from a mocked socket message", async () => {
    const { SlotReadout } = await import("./SlotReadout")
    const store = await import("@/lib/solana-slots")

    const { container } = render(<SlotReadout />)
    const ws = FakeWebSocket.instances[0]
    expect(ws).toBeDefined()

    const before = store.getSnapshot()
    act(() => {
      ws.onopen?.()
      // Unrelated notification should not change the cached snapshot reference.
      ws.onmessage?.({ data: JSON.stringify({ method: "somethingElse" }) })
    })
    expect(store.getSnapshot()).toBe(before)

    act(() => {
      ws.onmessage?.({
        data: JSON.stringify({
          jsonrpc: "2.0",
          method: "slotNotification",
          params: { result: { slot: 312345678 }, subscription: 0 },
        }),
      })
    })

    expect(container.textContent).toContain("312,345,678")
    expect(container.textContent).toContain("live")
    expect(container.textContent).toContain("Solana mainnet")
  })

  it("drops the slot number and 'live' when the socket fails twice and falls back to a heartbeat", async () => {
    vi.useFakeTimers()
    const { SlotReadout } = await import("./SlotReadout")

    const { container } = render(<SlotReadout />)

    act(() => {
      FakeWebSocket.instances[0]?.onerror?.()
    })
    act(() => {
      FakeWebSocket.instances[1]?.onerror?.()
    })
    act(() => {
      vi.advanceTimersByTime(HEARTBEAT_TICK_MS)
    })

    expect(container.textContent).toContain("Solana mainnet")
    expect(container.textContent).not.toContain("live")
    expect(container.textContent).not.toMatch(/\d{1,3}(,\d{3})+/)
  })
})
