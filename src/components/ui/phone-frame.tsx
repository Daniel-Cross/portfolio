import Image from "next/image"

// Hand-rolled CSS phone bezel (stack guidance: no device-frame libraries).
// Renders a portrait screenshot inside a dark rounded bezel with a
// dynamic-island style cutout.
export function PhoneFrame({
  src,
  alt,
  priority = false,
}: {
  src: string
  alt: string
  priority?: boolean
}) {
  return (
    <div className="relative mx-auto w-44 shrink-0 md:w-52">
      <div className="rounded-[2.2rem] border border-border bg-black p-2 shadow-lg">
        <div className="relative overflow-hidden rounded-[1.7rem]">
          <Image
            src={src}
            alt={alt}
            width={390}
            height={844}
            className="h-auto w-full"
            priority={priority}
          />
          {/* dynamic-island cutout */}
          <div
            className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
