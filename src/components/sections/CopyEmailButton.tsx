"use client"

import { useState } from "react"

import { site } from "@/content/site"

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard write failed — fail silently, the mailto link is the
      // guaranteed fallback (D-15).
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-mono text-base text-foreground transition-colors hover:text-accent"
    >
      {copied ? "Copied!" : site.email}
    </button>
  )
}
