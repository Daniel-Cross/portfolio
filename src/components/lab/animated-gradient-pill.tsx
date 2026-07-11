"use client"

import { Zap } from "lucide-react"

import { fm } from "./fm-palette"

// Web port of factmachine-monorepo apps/mobile/components/market/AnimatedGradientPill.tsx.
// The Skia sweep-gradient stroke is reproduced with a rotating conic-gradient
// border (registered custom property --lab-angle) instead of a canvas layer.
const SWEEP_MS = 3000
const SWEEP = `conic-gradient(from var(--lab-angle), ${fm.pillGlow[0]}, ${fm.pillGlow[1]}, ${fm.pillGlow[2]}, ${fm.pillGlow[3]}, ${fm.pillGlow[0]})`

export function AnimatedGradientPill() {
  return (
    <div
      className="lab-animated inline-flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        border: "2px solid transparent",
        backgroundImage: `linear-gradient(var(--card), var(--card)), ${SWEEP}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        animation: `lab-rotate ${SWEEP_MS}ms linear infinite`,
      }}
    >
      <Zap size={14} color={fm.pillText} aria-hidden="true" />
      <span className="text-sm font-medium" style={{ color: fm.pillText }}>
        Live
      </span>
    </div>
  )
}
