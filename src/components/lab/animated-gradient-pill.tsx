"use client"

import { Zap } from "lucide-react"

// Web port of factmachine-monorepo apps/mobile/components/market/AnimatedGradientPill.tsx.
// The Skia sweep-gradient stroke is reproduced with a rotating conic-gradient
// border (registered custom property --lab-angle) instead of a canvas layer.
const SWEEP_MS = 3000

export function AnimatedGradientPill() {
  return (
    <div
      className="lab-animated inline-flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(var(--card), var(--card)), conic-gradient(from var(--lab-angle), var(--primary), transparent, var(--primary))",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        animation: `lab-rotate ${SWEEP_MS}ms linear infinite`,
      }}
    >
      <Zap size={14} color="var(--primary)" aria-hidden="true" />
      <span
        className="text-sm font-medium"
        style={{ color: "var(--primary)" }}
      >
        Live
      </span>
    </div>
  )
}
