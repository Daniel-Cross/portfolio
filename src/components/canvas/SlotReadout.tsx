"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/solana-slots"

export function SlotReadout() {
  const { slot, live } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  return (
    <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span
        className={cn(
          "h-1.5 w-1.5 animate-pulse rounded-full",
          live ? "bg-live" : "bg-muted-foreground"
        )}
        aria-hidden="true"
      />
      {live && slot !== null
        ? `${slot.toLocaleString("en-US")} · live · Solana mainnet`
        : "Solana mainnet"}
    </p>
  )
}
