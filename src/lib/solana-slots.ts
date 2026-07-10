/**
 * Singleton subscription to Solana mainnet slot notifications over a raw
 * WebSocket. One connection is shared by every subscriber (NetworkCanvas +
 * SlotReadout) via reference counting. On failure (retried once), falls back
 * to a simulated heartbeat that keeps notifying listeners but never fakes a
 * slot number.
 */

const WS_URL = "wss://api.mainnet-beta.solana.com"
const HEARTBEAT_MS = 400

type SlotState = { slot: number | null; live: boolean }

const SERVER_SNAPSHOT: SlotState = { slot: null, live: false }

let state: SlotState = { slot: null, live: false }
let cached: SlotState = state

const listeners = new Set<() => void>()

let socket: WebSocket | null = null
let heartbeatId: ReturnType<typeof setInterval> | null = null
let retried = false

function notify() {
  for (const listener of listeners) listener()
}

function updateAndNotify(next: SlotState) {
  if (next.slot !== state.slot || next.live !== state.live) {
    state = next
    cached = { slot: state.slot, live: state.live }
  }
  notify()
}

function startHeartbeat() {
  if (heartbeatId !== null) return
  heartbeatId = setInterval(() => {
    updateAndNotify({ slot: null, live: false })
  }, HEARTBEAT_MS)
}

function cleanupSocket() {
  if (socket) {
    socket.onopen = null
    socket.onmessage = null
    socket.onerror = null
    socket.onclose = null
    try {
      socket.close()
    } catch {
      // socket already closing/closed
    }
    socket = null
  }
}

function openSocket() {
  if (typeof WebSocket === "undefined") {
    startHeartbeat()
    return
  }

  let settled = false
  const fail = () => {
    if (settled) return
    settled = true
    cleanupSocket()
    if (!retried) {
      retried = true
      openSocket()
    } else {
      startHeartbeat()
    }
  }

  try {
    socket = new WebSocket(WS_URL)
  } catch {
    fail()
    return
  }

  socket.onopen = () => {
    socket?.send(
      JSON.stringify({ jsonrpc: "2.0", id: 1, method: "slotSubscribe" })
    )
  }
  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(String(event.data))
      if (data?.method === "slotNotification") {
        const slot = data?.params?.result?.slot
        if (typeof slot === "number") {
          updateAndNotify({ slot, live: true })
        }
      }
    } catch {
      // ignore malformed/unexpected payload
    }
  }
  socket.onerror = fail
  socket.onclose = fail
}

function stopAll() {
  cleanupSocket()
  if (heartbeatId !== null) {
    clearInterval(heartbeatId)
    heartbeatId = null
  }
  retried = false
  state = { slot: null, live: false }
  cached = state
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (listeners.size === 1) {
    openSocket()
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      stopAll()
    }
  }
}

export function getSnapshot(): SlotState {
  return cached
}

export function getServerSnapshot(): SlotState {
  return SERVER_SNAPSHOT
}
