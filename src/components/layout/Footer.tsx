import { site } from "@/content/site"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 font-mono text-sm text-muted-foreground">
        <span>{site.name}</span>
        <div className="flex flex-wrap gap-6">
          <a
            href={`mailto:${site.email}`}
            className="transition-colors hover:text-foreground"
          >
            {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
