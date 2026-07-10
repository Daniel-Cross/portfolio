import { buttonVariants } from "@/components/ui/button";
import { SlotReadout } from "@/components/canvas/SlotReadout";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute top-6 right-6">
        <SlotReadout />
      </div>
      <h1 className="text-3xl leading-tight font-semibold text-balance md:text-5xl">
        {site.name}. {site.role}, {site.heroHook}.
      </h1>
      <p className="mt-6 max-w-xl text-base text-muted-foreground">
        {site.heroSubhead}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a href="#projects" className={buttonVariants({ size: "lg" })}>
          View work
        </a>
        <a
          href="#contact"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
