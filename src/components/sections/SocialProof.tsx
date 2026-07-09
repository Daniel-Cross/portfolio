import { socialProof } from "@/content/social-proof"

export function SocialProof() {
  return (
    <section
      id="social-proof"
      className="mx-auto max-w-3xl px-6 py-16 md:py-24"
    >
      <h2 className="text-2xl font-semibold md:text-3xl">Social proof</h2>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {socialProof.map((item) =>
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ) : (
            <span key={item.label}>{item.label}</span>
          )
        )}
      </div>
    </section>
  )
}
