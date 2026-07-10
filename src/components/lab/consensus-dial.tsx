"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Web port of factmachine-monorepo apps/mobile/components/consensus-dial/
// (consensus-dial.tsx, dial-model.ts, use-consensus-dial.ts,
// consensus-dial-marker.tsx, consensus-dial-readout.tsx,
// consensus-tick-strip.tsx). The pure math from dial-model.ts is ported
// exactly (worklet directives dropped); Gesture.Pan is ported to pointer
// events, and the Reanimated spring settle is a CSS transition.
const MIN_VALUE = 0
const MAX_VALUE = 100
const TICK_COUNT = MAX_VALUE - MIN_VALUE + 1
const MAJOR_TICK_EVERY = 5
const TICK_PITCH = 8
const DRAG_SIGN = -1

const VELOCITY_PROJECTION_WINDOW_S = 0.08
const MAX_VELOCITY_THROW_TICKS = 14

const TICK_BASE_OPACITY = 0.4
const TICK_GLOW_OPACITY = 0.6

const TRACK_HEIGHT = 48
const TRACK_MAX_WIDTH = 500
const TICK_WIDTH = 2
const MINOR_TICK_HEIGHT = 8
const MAJOR_TICK_HEIGHT = 14
const EDGE_FADE_WIDTH = 48
const SETTLE_MS = 250
const SETTLE_EASING = "cubic-bezier(0.4, 0, 0, 1)"

const CARET_WIDTH = 2
const CARET_HEIGHT = 20
const TRIANGLE_WIDTH = 6
const TRIANGLE_HEIGHT = 3
const TRIANGLE_GAP = 2

function clampPercentValue(value: number): number {
  return Math.min(MAX_VALUE, Math.max(MIN_VALUE, value))
}

function roundPercentValue(value: number): number {
  return clampPercentValue(Math.round(value))
}

function valueFromTranslation(
  startValue: number,
  translationX: number,
  pitch: number
): number {
  return clampPercentValue(startValue + (DRAG_SIGN * translationX) / pitch)
}

function projectedVelocityTicks(velocityX: number, pitch: number): number {
  const rawTicks =
    (DRAG_SIGN * velocityX * VELOCITY_PROJECTION_WINDOW_S) / pitch
  return Math.max(
    -MAX_VELOCITY_THROW_TICKS,
    Math.min(MAX_VELOCITY_THROW_TICKS, rawTicks)
  )
}

function projectValueFromRelease(
  currentValue: number,
  velocityX: number,
  pitch: number
): number {
  return roundPercentValue(
    currentValue + projectedVelocityTicks(velocityX, pitch)
  )
}

function getGlowOpacityAt(
  index: number,
  value: number,
  radius = MAJOR_TICK_EVERY
): number {
  const tint = Math.max(0, 1 - Math.abs(index - value) / radius)
  return TICK_BASE_OPACITY + TICK_GLOW_OPACITY * tint
}

const TICK_INDEXES = Array.from({ length: TICK_COUNT }, (_, index) => index)

interface ConsensusDialProps {
  defaultValue?: number
  onChange?: (value: number) => void
}

export function ConsensusDial({
  defaultValue = 50,
  onChange,
}: ConsensusDialProps) {
  const [displayValue, setDisplayValue] = useState(
    clampPercentValue(defaultValue)
  )
  const [touched, setTouched] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const startClientXRef = useRef(0)
  const startValueRef = useRef(clampPercentValue(defaultValue))
  const lastEmittedRef = useRef(roundPercentValue(defaultValue))
  const lastSampleRef = useRef({ clientX: 0, time: 0, velocityX: 0 })

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  }, [])

  const emitIfChanged = useCallback(
    (value: number) => {
      const rounded = roundPercentValue(value)
      if (rounded !== lastEmittedRef.current) {
        lastEmittedRef.current = rounded
        onChange?.(rounded)
      }
    },
    [onChange]
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (trackRef.current?.setPointerCapture) {
        trackRef.current.setPointerCapture(event.pointerId)
      }
      startClientXRef.current = event.clientX
      startValueRef.current = displayValue
      lastSampleRef.current = {
        clientX: event.clientX,
        time: event.timeStamp,
        velocityX: 0,
      }
      setTouched(true)
      setDragging(true)
      emitIfChanged(displayValue)
    },
    [displayValue, emitIfChanged]
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return
      const translationX = event.clientX - startClientXRef.current
      const next = valueFromTranslation(
        startValueRef.current,
        translationX,
        TICK_PITCH
      )
      const lastSample = lastSampleRef.current
      const deltaTime = (event.timeStamp - lastSample.time) / 1000
      const velocityX =
        deltaTime > 0
          ? (event.clientX - lastSample.clientX) / deltaTime
          : lastSample.velocityX
      lastSampleRef.current = {
        clientX: event.clientX,
        time: event.timeStamp,
        velocityX,
      }
      setDisplayValue(next)
      emitIfChanged(next)
    },
    [dragging, emitIfChanged]
  )

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (trackRef.current?.hasPointerCapture?.(event.pointerId)) {
        trackRef.current.releasePointerCapture(event.pointerId)
      }
      setDragging(false)
      const target = projectValueFromRelease(
        displayValue,
        lastSampleRef.current.velocityX,
        TICK_PITCH
      )
      emitIfChanged(target)
      setDisplayValue(target)
    },
    [displayValue, emitIfChanged]
  )

  const roundedValue = Math.round(displayValue)
  const numberColor = touched ? "var(--primary)" : "var(--muted-foreground)"
  const stripTransition =
    !dragging && !reducedMotion
      ? `transform ${SETTLE_MS}ms ${SETTLE_EASING}`
      : "none"

  return (
    <div
      className="mx-auto flex w-full flex-col items-stretch gap-3"
      style={{ maxWidth: TRACK_MAX_WIDTH }}
    >
      <div className="flex items-center justify-center">
        <span
          className="text-5xl font-semibold md:text-6xl"
          style={{ color: numberColor }}
        >
          {roundedValue}
          <span className="ml-0.5">%</span>
        </span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={MIN_VALUE}
        aria-valuemax={MAX_VALUE}
        aria-valuenow={roundedValue}
        aria-label="Consensus percentage"
        className="relative w-full overflow-hidden"
        style={{ height: TRACK_HEIGHT, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute top-0 left-1/2"
          style={{
            height: TRACK_HEIGHT,
            transform: `translateX(${-displayValue * TICK_PITCH}px)`,
            transition: stripTransition,
          }}
        >
          {TICK_INDEXES.map((index) => {
            const isMajor = index % MAJOR_TICK_EVERY === 0
            const height = isMajor ? MAJOR_TICK_HEIGHT : MINOR_TICK_HEIGHT
            const opacity = touched
              ? getGlowOpacityAt(index, displayValue)
              : TICK_BASE_OPACITY
            return (
              <div
                key={index}
                className="absolute top-1/2 rounded-full"
                style={{
                  left: index * TICK_PITCH - TICK_WIDTH / 2,
                  width: TICK_WIDTH,
                  height,
                  marginTop: -height / 2,
                  opacity,
                  backgroundColor: "var(--primary)",
                }}
              />
            )
          })}
        </div>

        <div
          className="pointer-events-none absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: CARET_WIDTH,
            height: CARET_HEIGHT,
            marginLeft: -CARET_WIDTH / 2,
            marginTop: -CARET_HEIGHT / 2,
            backgroundColor: "var(--primary)",
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2"
          style={{
            width: 0,
            height: 0,
            marginLeft: -TRIANGLE_WIDTH / 2,
            marginTop: -(CARET_HEIGHT / 2 + TRIANGLE_GAP + TRIANGLE_HEIGHT),
            borderLeft: `${TRIANGLE_WIDTH / 2}px solid transparent`,
            borderRight: `${TRIANGLE_WIDTH / 2}px solid transparent`,
            borderTop: `${TRIANGLE_HEIGHT}px solid var(--primary)`,
          }}
        />

        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0"
          style={{
            width: EDGE_FADE_WIDTH,
            background: "linear-gradient(to right, var(--card), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0"
          style={{
            width: EDGE_FADE_WIDTH,
            background: "linear-gradient(to left, var(--card), transparent)",
          }}
        />
      </div>
    </div>
  )
}
