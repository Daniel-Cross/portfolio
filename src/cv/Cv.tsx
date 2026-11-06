import { Hero } from './Hero'
import { Projects } from './Projects'
import { Skills } from './Skills'
import { Work } from './Work'

export function Cv() {
  return (
    <main className="cv">
      <Hero />
      <Skills />
      <Work />
      <Projects />
    </main>
  )
}
