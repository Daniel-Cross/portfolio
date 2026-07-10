import { employers } from "@/content/employers"

export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">About</h2>
      <p className="mt-6 max-w-xl text-base text-muted-foreground">
        Senior React Native / Web3 engineer based in Stockholm, working
        UK/EU remote, with 8+ years building and scaling mobile and web
        applications. Career spans leading frontend teams, modernising
        legacy codebases, and shipping features to MetaMask&apos;s 30M+
        user wallet. Now building Solana-based crypto products, focused
        on performance, maintainable architecture, and owning features
        end-to-end from design through release.
      </p>
      <ul className="mt-8 flex flex-col gap-4">
        {/* List is reverse-chronological: index 0 is the current role, marked live-green. */}
        {employers.map((employer, index) => (
          <li
            key={employer.name}
            className={`border-l-4 pl-4 ${index === 0 ? "border-live" : "border-accent"}`}
          >
            <p className="font-semibold text-foreground">
              {employer.name}
              {employer.role ? (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {employer.role}
                </span>
              ) : null}
            </p>
            {employer.note ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {employer.note}
              </p>
            ) : null}
            {employer.highlights ? (
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm text-muted-foreground">
                {employer.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
