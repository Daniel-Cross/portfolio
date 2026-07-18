/* eslint-disable @next/next/no-img-element */

export function FactMachineShowcase() {
  return (
    <section id="fact-machine" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Fact Machine</h2>
        <p className="mt-2 text-muted-foreground">
          Lead mobile engineer for Fact Machine, the Solana opinion-market
          product.
        </p>
      </div>

      <div className="mt-8 grid gap-3 px-3 lg:grid-cols-2">
        <img
          src="/factmachine/factmachine-iphone-mock.png"
          alt="Fact Machine interface on an iPhone"
          loading="lazy"
          decoding="async"
          className="aspect-square w-full rounded-xl bg-card object-cover"
        />
        <div className="hidden aspect-square w-full rounded-xl bg-[linear-gradient(180deg,#FE9227_6%,#EA4D5F_48%,#327CEB_108%)] lg:block" />
      </div>

      <img
        src="/factmachine/fact-machine-hero-2026-06-29.png"
        alt="Fact Machine brand case-study hero"
        loading="lazy"
        decoding="async"
        className="mt-6 h-auto w-full"
      />

      <div className="mt-6 bg-card">
        <img
          src="/factmachine/app-dock-1600.webp"
          alt="Fact Machine app dock"
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
