"use client"

import { Sparkles } from "lucide-react"

import { fm } from "./fm-palette"

// Web port of factmachine-monorepo apps/mobile/components/GlassControl.tsx.
// Reproduced as a static frosted-glass panel via backdrop-filter; the native
// pressable, haptic, and glass-recipe system is dropped for a showcase tile.
export function GlassControl() {
  return (
    <div
      className="flex items-center gap-2 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 60%)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
      }}
    >
      <Sparkles size={16} color={fm.accent} aria-hidden="true" />
      <span className="text-sm text-muted-foreground">Glass surface</span>
    </div>
  )
}
