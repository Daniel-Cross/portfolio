"use client"

import { fm } from "./fm-palette"

// Web port of factmachine-monorepo apps/mobile/components/LoopingGradientText.tsx.
// Reproduced with a background-clip: text shimmer instead of a masked-view
// plus measurement layer, since the layout here is fixed.
const LOOP_MS = 4000

export function LoopingGradientText() {
  return (
    <span
      className="lab-animated inline-block text-4xl font-semibold"
      style={{
        backgroundImage: `linear-gradient(90deg, ${fm.shimmerBase} 0%, ${fm.shimmerBase} 40%, ${fm.shimmerHighlight} 50%, ${fm.shimmerBase} 60%, ${fm.shimmerBase} 100%)`,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        animation: `lab-shimmer ${LOOP_MS}ms linear infinite`,
      }}
    >
      Fact Machine
    </span>
  )
}
