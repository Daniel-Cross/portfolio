export type SkillGroup = {
  label: string
  skills: string[]
}

// Plain grouped list — no percentage/proficiency scores (skill bars are
// explicit Out of Scope per REQUIREMENTS.md).
export const skillGroups: SkillGroup[] = [
  {
    label: "Web3 / Solana",
    skills: ["Solana", "Web3", "Rust"],
  },
  {
    label: "React Native / Mobile",
    skills: ["React Native", "Expo", "iOS", "Android"],
  },
  {
    label: "Frontend / Web",
    skills: ["React", "TypeScript", "JavaScript"],
  },
  {
    label: "AI / Tooling",
    skills: ["LLM integration"],
  },
]
