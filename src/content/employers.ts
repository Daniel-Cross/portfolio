export type Employer = {
  name: string
  role?: string
  note?: string
  highlights?: string[]
}

// Reverse-chronological (current first). Roles, dates, and highlights sourced
// from Daniel's CV (2026); current role from PROJECT.md career context.
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
    highlights: [
      "Implemented multi-chain support, integrating Bitcoin, Solana, and Tron into MetaMask Mobile",
      "Optimised blockchain transaction handling for low-end Android devices",
      "Helped adopt Expo inside the bare React Native app",
    ],
  },
  {
    name: "Hackberry",
    role: "Tech Lead React Native (consultant)",
    note: "Aug 2022 – Apr 2024 — led transitions of legacy React Native apps to Expo and launched them across Sweden, Norway, and Finland.",
    highlights: [
      "Owned the iOS and Android release process and built CI/CD pipelines for every app",
      "Shipped features and redesigns that significantly increased revenue",
    ],
  },
  {
    name: "Yomento",
    role: "Head of Engineering",
    note: "May 2020 – Aug 2022 — oversaw all frontend development across mobile and web.",
    highlights: [
      "Designed the build and deployment architecture; led App Store and Google Play release cycles",
    ],
  },
  {
    name: "Booking.com",
    role: "React Developer",
    note: "Oct 2018 – May 2020 — helped migrate the platform from Java/jQuery to React in an agile, UI/UX-focused team.",
  },
]
