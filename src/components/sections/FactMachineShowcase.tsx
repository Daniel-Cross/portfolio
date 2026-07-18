/* eslint-disable @next/next/no-img-element */

export function FactMachineShowcase() {
  return (
    <section id="fact-machine" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Fact Machine</h2>
        <p className="mt-2 text-muted-foreground">
          Lead mobile engineer for Fact Machine, the Solana prediction-market
          product the owner leads.
        </p>
      </div>

      <div className="mt-8 bg-card py-8">
        <div className="grid items-center lg:grid-cols-2">
          <img
            src="/factmachine/factmachine-iphone-mock.png"
            alt="Fact Machine interface on an iPhone"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-2xl px-6"
          />
          <img
            src="/factmachine/factmachine-flow.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="mx-auto hidden w-full max-w-2xl px-6 lg:block"
          />
        </div>
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
