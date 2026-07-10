import { AnimatedDashedGradientLine } from "@/components/lab/animated-dashed-gradient-line"
import { AnimatedGradientPill } from "@/components/lab/animated-gradient-pill"
import { ConsensusDial } from "@/components/lab/consensus-dial"
import { CrtStaticOverlay } from "@/components/lab/crt-static-overlay"
import { GlassControl } from "@/components/lab/glass-control"
import { LoopingGradientText } from "@/components/lab/looping-gradient-text"
import { PixelLoader } from "@/components/lab/pixel-loader"

interface LabTile {
  name: string
  description: string
  node: React.ReactNode
  span?: boolean
}

const TILES: LabTile[] = [
  {
    name: "Consensus Dial",
    description:
      "Drag to set a percentage: the tick strip slides under a fixed marker with a live readout.",
    node: <ConsensusDial />,
    span: true,
  },
  {
    name: "Pixel Loader",
    description:
      "A 4 by 4 grid with a diagonal brightness wave on a 1400ms cycle.",
    node: <PixelLoader />,
  },
  {
    name: "Looping Gradient Text",
    description: "A headline with an endlessly cycling gradient shimmer.",
    node: <LoopingGradientText />,
  },
  {
    name: "CRT Static Overlay",
    description: "Canvas-drawn CRT static noise.",
    node: <CrtStaticOverlay />,
  },
  {
    name: "Glass Control",
    description: "A frosted-glass control surface.",
    node: <GlassControl />,
  },
  {
    name: "Animated Dashed Gradient Line",
    description: "A dashed connector with a sweeping gradient highlight.",
    node: <AnimatedDashedGradientLine />,
  },
  {
    name: "Animated Gradient Pill",
    description: "A pill with a rotating sweep-gradient border.",
    node: <AnimatedGradientPill />,
  },
]

export function ComponentLab() {
  return (
    <section id="lab" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">Component Lab</h2>
      <p className="mt-2 text-muted-foreground">
        Rebuilt for the web from the original React Native source of Fact
        Machine, a client app.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {TILES.map((tile) => (
          <div
            key={tile.name}
            className={`flex flex-col gap-3 rounded-lg bg-card p-6 ${tile.span ? "sm:col-span-2" : ""}`}
          >
            <div className="flex min-h-40 items-center justify-center">
              {tile.node}
            </div>
            <h3 className="text-lg font-semibold">{tile.name}</h3>
            <p className="text-sm text-muted-foreground">
              {tile.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
