import { GithubIcon } from "@/components/icons/github"
import { site } from "@/content/site"

import { MobileNav } from "./MobileNav"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="font-mono text-sm font-medium text-foreground"
        >
          {site.name}
        </a>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on GitHub`}
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-5" aria-hidden="true" />
          </a>
        </nav>
        <MobileNav navLinks={navLinks} github={site.github} />
      </div>
    </header>
  )
}
