'use client'

import { useRef, type KeyboardEvent, type PointerEvent } from 'react'

type Props = {
  label: string
  /** 0 to 1 */
  value: number
  /** what a screen reader announces, for example "104 bpm" */
  valueText: string
  accent?: boolean
  onChange(value: number): void
}

const clamp = (n: number) => Math.max(0, Math.min(1, n))
const STEP = 0.05

/** A dial: drag up and down, or use the arrow keys. */
export function Knob({ label, value, valueText, accent, onChange }: Props) {
  const drag = useRef<{ y: number; value: number } | null>(null)

  const down = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { y: event.clientY, value }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    drag.current.value = clamp(drag.current.value + (drag.current.y - event.clientY) / 160)
    drag.current.y = event.clientY
    onChange(drag.current.value)
  }
  const up = () => void (drag.current = null)
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    const by = { ArrowUp: STEP, ArrowRight: STEP, ArrowDown: -STEP, ArrowLeft: -STEP }[event.key]
    if (!by) return
    event.preventDefault()
    onChange(clamp(value + by))
  }

  return (
    <div className="knob">
      <div
        className={`knob__cap${accent ? ' knob__cap--accent' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={valueText}
        style={{ rotate: `${-135 + value * 270}deg` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onKeyDown={key}
      />
      {label}
    </div>
  )
}
