"use client"

// Web port of factmachine-monorepo apps/mobile/components/AnimatedDashedGradientLine.tsx.
// The dash pattern is a CSS mask (repeating-linear-gradient) instead of an
// SVG masked-view; the sweeping highlight is a plain gradient div.
const WIDTH = 4
const HEIGHT = 80
const DASH_LENGTH = 10
const DASH_GAP = 10
const DURATION_MS = 3000

export function AnimatedDashedGradientLine() {
  const maskImage = `repeating-linear-gradient(to top, black 0, black ${DASH_LENGTH}px, transparent ${DASH_LENGTH}px, transparent ${DASH_LENGTH + DASH_GAP}px)`

  return (
    <div
      className="pointer-events-none relative overflow-hidden"
      style={{
        width: WIDTH,
        height: HEIGHT,
        borderRadius: WIDTH / 2,
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--muted-foreground)", opacity: 0.3 }}
      />
      <div
        className="lab-animated absolute left-0 top-0"
        style={{
          width: WIDTH,
          height: "100%",
          backgroundImage:
            "linear-gradient(to bottom, transparent 0%, var(--primary) 50%, transparent 100%)",
          animation: `lab-dash ${DURATION_MS}ms linear infinite`,
        }}
      />
    </div>
  )
}
