"use client"

// Web port of factmachine-monorepo apps/mobile/components/PixelLoader.tsx.
// The diagonal brightness wave is reproduced with a negative animation-delay
// per cell instead of a shared Reanimated phase value.
const GRID = 4
const CELL_SIZE = 10
const CELL_GAP = 2.5
const DIAGONALS = GRID * 2 - 1
const CYCLE_MS = 1400

export function PixelLoader() {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="flex flex-col"
      style={{ gap: CELL_GAP }}
    >
      {Array.from({ length: GRID }).map((_, row) => (
        <div key={row} className="flex" style={{ gap: CELL_GAP }}>
          {Array.from({ length: GRID }).map((__, col) => {
            const delayMs = -((row + col) / DIAGONALS) * CYCLE_MS
            return (
              <div
                key={col}
                className="lab-animated"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: "var(--primary)",
                  animation: `lab-pixel ${CYCLE_MS}ms linear infinite`,
                  animationDelay: `${delayMs}ms`,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
