import { Mail } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { site } from "@/content/site"

import { CopyEmailButton } from "./CopyEmailButton"

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">Get in touch</h2>
      <p className="mt-6 flex max-w-xl items-center gap-2 text-base text-muted-foreground">
        <span
          className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-live"
          aria-hidden="true"
        />
        Open to both contract and full-time crypto engineering roles.
      </p>
      <ul className="mt-4 flex flex-col gap-1 text-base text-muted-foreground">
        <li>Contract: via The App Forge AB (outside IR35, UK/EU remote)</li>
        <li>Full-time: open to senior/staff crypto roles.</li>
        <li>
          US companies welcome: worked remotely with New York-based teams
          including MetaMask, Use AI, and Fact Machine.
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <CopyEmailButton />
          <a
            href={`mailto:${site.email}`}
            aria-label={`Email ${site.email}`}
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-5" aria-hidden="true" />
          </a>
        </div>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          LinkedIn
        </a>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </a>
      </div>
    </section>
  )
}
