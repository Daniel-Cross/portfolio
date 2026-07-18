/* eslint-disable @next/next/no-img-element */

interface MotionClip {
  file: string
  caption: string
}

const MOTION_CLIPS: MotionClip[] = [
  { file: "motion/alpha-delay.mp4", caption: "Alpha delay" },
  { file: "motion/alpha-select.mp4", caption: "Alpha approval" },
  { file: "motion/door-brothers.mp4", caption: "Door Brothers" },
  { file: "motion/market-launch.mp4", caption: "Market launch" },
  { file: "motion/modal-animation.mp4", caption: "Modal animation" },
  { file: "motion/prize-pool-terminal.mp4", caption: "Prize pool terminal" },
]

export function FactMachineShowcase() {
  return (
    <section
      id="fact-machine"
      className="mx-auto max-w-3xl px-6 py-16 md:py-24"
    >
      <h2 className="text-2xl font-semibold md:text-3xl">
        Fact Machine Brand and Motion
      </h2>
      <p className="mt-2 text-muted-foreground">
        Brand identity and motion design for Fact Machine, the Solana
        prediction-market product the owner leads.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg bg-card">
        <img
          src="/factmachine/fact-machine-hero-2026-06-29.png"
          alt="Fact Machine brand case-study hero"
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-card p-6">
          <img
            src="/factmachine/factmachine-wordmark-debossed-1600.webp"
            alt="Debossed wordmark"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Debossed wordmark
          </p>
        </div>
        <div className="rounded-lg bg-card p-6">
          <img
            src="/factmachine/factmachine-logo-drafting-lines.svg"
            alt="Logo drafting geometry"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-[240px]"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Logo drafting geometry
          </p>
        </div>
        <div className="rounded-lg bg-card p-6">
          <img
            src="/factmachine/FactMachine.svg"
            alt="Logomark"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-[240px]"
          />
          <p className="mt-3 text-sm text-muted-foreground">Logomark</p>
        </div>
        <div className="rounded-lg bg-card p-6">
          <img
            src="/factmachine/app-dock-1600.webp"
            alt="App dock"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full"
          />
          <p className="mt-3 text-sm text-muted-foreground">App dock</p>
        </div>
        <div className="rounded-lg bg-card p-6">
          <img
            src="/factmachine/factmachine-iphone-mock.png"
            alt="On device"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full"
          />
          <p className="mt-3 text-sm text-muted-foreground">On device</p>
        </div>
      </div>

      <h3 className="mt-10 text-lg font-semibold">Motion</h3>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {MOTION_CLIPS.map((clip) => (
          <div
            key={clip.file}
            className="overflow-hidden rounded-lg bg-card"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-auto w-full"
            >
              <source
                src={`/factmachine/${clip.file}`}
                type="video/mp4"
              />
            </video>
            <p className="p-4 text-sm text-muted-foreground">
              {clip.caption}
            </p>
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
  )
}
