import { employers } from "@/content/employers"

export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">About</h2>
      <p className="mt-6 max-w-xl text-base text-muted-foreground">
        Senior React Native / Web3 engineer based in Stockholm, working
        UK/EU remote. Career spans product-led mobile teams and a run
        shipping features to MetaMask&apos;s mobile wallet, now building
        Solana-based crypto products.
      </p>
      <ul className="mt-8 flex flex-col gap-4">
        {employers.map((employer) => (
          <li key={employer.name} className="border-l-4 border-accent pl-4">
            <p className="font-semibold text-foreground">
              {employer.name}
              {employer.role ? (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  — {employer.role}
                </span>
              ) : null}
            </p>
            {employer.note ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {employer.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
