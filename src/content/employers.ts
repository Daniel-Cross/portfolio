export type Employer = {
  name: string
  role?: string
  note?: string
}

// Reverse-chronological (current first). Sourced from PROJECT.md career context.
export const employers: Employer[] = [
  {
    name: "The App Forge AB",
    role: "Senior React Native Engineer (contract)",
    note: "Current — building footballAlpha, a revenue-backed football player exchange on Solana.",
  },
  {
    name: "MetaMask",
    role: "Senior React Native Engineer",
    note: "Apr 2024 – Nov 2025 — shipped features to the self-custody mobile wallet trusted by 30M+ users.",
  },
  {
    name: "Hackberry",
    role: "React Native Consultant",
  },
  {
    name: "Yomento",
    role: "Head of Engineering",
  },
  {
    name: "BookingGo",
  },
]
