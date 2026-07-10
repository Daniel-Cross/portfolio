"use client"

import { useEffect, useRef } from "react"

// Web port of factmachine-monorepo apps/mobile/components/CrtStaticOverlay.tsx.
// This repo has no noise PNG assets, so the static is drawn directly on a
// canvas each frame instead of cycling four pre-rendered noise images. The
// native visible/dismiss lifecycle and ignition sequence are dropped for an
// always-on showcase tile. Follows the NetworkCanvas pattern: bail out
// rendering nothing on a null 2D context or thrown setup.
const FRAME_INTERVAL_MS = 80
const NOISE_RESOLUTION = 64

export function CrtStaticOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const context = canvas.getContext("2d")
      if (!context) return
      const ctx: CanvasRenderingContext2D = context

      canvas.width = NOISE_RESOLUTION
      canvas.height = NOISE_RESOLUTION

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      function drawNoise() {
        const imageData = ctx.createImageData(
          NOISE_RESOLUTION,
          NOISE_RESOLUTION
        )
        for (let i = 0; i < imageData.data.length; i += 4) {
          const shade = Math.floor(Math.random() * 256)
          imageData.data[i] = shade
          imageData.data[i + 1] = shade
          imageData.data[i + 2] = shade
          imageData.data[i + 3] = 255
        }
        ctx.putImageData(imageData, 0, 0)
      }

      drawNoise()

      if (reducedMotion) return

      let intervalId = window.setInterval(drawNoise, FRAME_INTERVAL_MS)

      function onVisibilityChange() {
        if (document.hidden) {
          window.clearInterval(intervalId)
        } else {
          intervalId = window.setInterval(drawNoise, FRAME_INTERVAL_MS)
        }
      }
      document.addEventListener("visibilitychange", onVisibilityChange)

      return () => {
        window.clearInterval(intervalId)
        document.removeEventListener("visibilitychange", onVisibilityChange)
      }
    } catch {
      return
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-24 w-full rounded-md"
      style={{ imageRendering: "pixelated" }}
    />
  )
}
