import { buttonVariants } from "@/components/ui/button"

// Hand-rolled CSS phone bezel wrapping a live iframe: wallet connect only
// works in the full site, browser extensions do not inject into embeds.
export function LiveAppFrame({
  url,
  title,
  links,
}: {
  url: string
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="mx-auto flex w-[390px] max-w-full shrink-0 flex-col items-center gap-3 md:mx-0">
      <div className="w-full rounded-[2.2rem] border border-border bg-black p-2 shadow-lg">
        <div className="relative aspect-[390/844] overflow-hidden rounded-[1.7rem]">
          <iframe
            src={url}
            title={title}
            loading="lazy"
            className="h-full w-full border-0"
          />
          {/* dynamic-island cutout */}
          <div
            className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Browse the live app · connecting a wallet needs the full site,
        browser extensions do not inject into embeds.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
