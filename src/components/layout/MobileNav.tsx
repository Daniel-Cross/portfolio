"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"

import { GithubIcon } from "@/components/icons/github"

type NavLink = {
  href: string
  label: string
}

type MobileNavProps = {
  navLinks: NavLink[]
  github: string
}

export function MobileNav({ navLinks, github }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex size-11 items-center justify-center text-foreground"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </button>
      {open && (
        <nav
          aria-label="Mobile"
          className="absolute inset-x-0 top-16 flex flex-col gap-1 border-b border-border bg-card px-6 py-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </nav>
      )}
    </div>
  )
}
