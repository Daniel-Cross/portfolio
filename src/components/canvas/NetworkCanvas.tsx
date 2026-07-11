"use client"

import { useEffect, useRef } from "react"

import { subscribe } from "@/lib/solana-slots"

const NODE_COUNT = 75
const LINK_DISTANCE = 140
const NODE_SPEED = 0.15
const PULSE_DURATION_MS = 1000
const DIM_SCROLL_VIEWPORTS = 1
const MIN_OPACITY = 0.35

type NetworkNode = { x: number; y: number; vx: number; vy: number }
type Pulse = { nodeIndex: number; startedAt: number }

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const context = canvas.getContext("2d")
      if (!context) return
      // Rebind with explicit non-nullable types so nested closures below
      // (resize/step/drawFrame) don't need repeated null checks.
      const el: HTMLCanvasElement = canvas
      const ctx: CanvasRenderingContext2D = context

      const styles = getComputedStyle(document.documentElement)
      const primaryColor = styles.getPropertyValue("--primary").trim()
      const neutralColor = styles.getPropertyValue("--muted-foreground").trim()
      const linkColor = styles.getPropertyValue("--border").trim()

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      let width = 0
      let height = 0

      function resize() {
        const dpr = window.devicePixelRatio || 1
        width = window.innerWidth
        height = window.innerHeight
        el.width = width * dpr
        el.height = height * dpr
        el.style.width = `${width}px`
        el.style.height = `${height}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      resize()
      window.addEventListener("resize", resize)

      const nodes: NetworkNode[] = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
      }))

      const pulses: Pulse[] = []

      function onPulseEvent() {
        pulses.push({
          nodeIndex: Math.floor(Math.random() * nodes.length),
          startedAt: performance.now(),
        })
      }
      const unsubscribe = reducedMotion ? null : subscribe(onPulseEvent)

      function drawFrame(now: number) {
        ctx.clearRect(0, 0, width, height)

        // Faint links between near neighbours.
        ctx.strokeStyle = linkColor
        ctx.lineWidth = 1
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const dist = Math.hypot(dx, dy)
            if (dist < LINK_DISTANCE) {
              ctx.globalAlpha = 1 - dist / LINK_DISTANCE
              ctx.beginPath()
              ctx.moveTo(nodes[i].x, nodes[i].y)
              ctx.lineTo(nodes[j].x, nodes[j].y)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1

        // Base nodes.
        ctx.fillStyle = neutralColor
        for (const node of nodes) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Pulses: Solana-purple ripple + flash, drawn on top, fading over ~1s.
        for (let i = pulses.length - 1; i >= 0; i--) {
          const pulse = pulses[i]
          const elapsed = now - pulse.startedAt
          if (elapsed > PULSE_DURATION_MS) {
            pulses.splice(i, 1)
            continue
          }
          const node = nodes[pulse.nodeIndex]
          if (!node) continue
          // A pulse pushed between frames can carry a startedAt a few ms
          // ahead of this frame's rAF timestamp; unclamped that makes the
          // arc radius negative, which throws and kills the loop.
          const progress = Math.max(0, Math.min(elapsed / PULSE_DURATION_MS, 1))
          ctx.strokeStyle = primaryColor
          ctx.globalAlpha = 1 - progress
          ctx.beginPath()
          ctx.arc(node.x, node.y, progress * LINK_DISTANCE, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = primaryColor
          ctx.beginPath()
          ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      let frameId = 0
      function step(now: number) {
        for (const node of nodes) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0) node.x += width
          if (node.x > width) node.x -= width
          if (node.y < 0) node.y += height
          if (node.y > height) node.y -= height
        }
        // Schedule before drawing so a draw error can never end the loop.
        frameId = requestAnimationFrame(step)
        drawFrame(now)
      }

      if (reducedMotion) {
        drawFrame(performance.now())
      } else {
        frameId = requestAnimationFrame(step)
      }

      function onVisibilityChange() {
        if (reducedMotion) return
        if (document.hidden) {
          cancelAnimationFrame(frameId)
        } else {
          frameId = requestAnimationFrame(step)
        }
      }
      document.addEventListener("visibilitychange", onVisibilityChange)

      function onScroll() {
        const threshold = window.innerHeight * DIM_SCROLL_VIEWPORTS
        const progress = Math.min(window.scrollY / threshold, 1)
        el.style.opacity = String(1 - progress * (1 - MIN_OPACITY))
      }
      window.addEventListener("scroll", onScroll, { passive: true })

      return () => {
        cancelAnimationFrame(frameId)
        window.removeEventListener("resize", resize)
        window.removeEventListener("scroll", onScroll)
        document.removeEventListener("visibilitychange", onVisibilityChange)
        unsubscribe?.()
      }
    } catch {
      return
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
