/* eslint-disable @next/next/no-img-element */

const MOTION_CLIPS = [
  "motion/alpha-delay.mp4",
  "motion/alpha-select.mp4",
  "motion/door-brothers.mp4",
  "motion/market-launch.mp4",
  "motion/modal-animation.mp4",
  "motion/prize-pool-terminal.mp4",
];

export function FactMachineShowcase() {
  return (
    <section
      id="fact-machine"
      className="mx-auto max-w-3xl px-6 py-16 md:py-24"
    >
      <h2 className="text-2xl font-semibold md:text-3xl">Fact Machine</h2>
      <p className="mt-2 text-muted-foreground">
        Brand identity and motion design for Fact Machine, the Solana
        prediction-market product the owner leads.
      </p>

      <div className="mt-8 rounded-lg bg-card p-6">
        <img
          src="/factmachine/factmachine-iphone-mock.png"
          alt="Fact Machine interface on an iPhone"
          loading="lazy"
          decoding="async"
          className="mx-auto w-full max-w-md"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-card">
        <img
          src="/factmachine/fact-machine-hero-2026-06-29.png"
          alt="Fact Machine brand case-study hero"
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </div>

      <div className="mt-6 rounded-lg bg-card p-6">
        <img
          src="/factmachine/app-dock-1600.webp"
          alt="Fact Machine app dock"
          loading="lazy"
          decoding="async"
          className="mx-auto w-full"
        />
      </div>

      <h3 className="mt-10 text-lg font-semibold">Motion</h3>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {MOTION_CLIPS.map((clip) => (
          <div key={clip} className="overflow-hidden rounded-lg bg-card">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-auto w-full"
            >
              <source src={`/factmachine/${clip}`} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Brand identity and motion design by{" "}
        <a
          href="https://terraform.nyc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-accent"
        >
          Terraform
        </a>
        .
      </p>
    </section>
  );
}
