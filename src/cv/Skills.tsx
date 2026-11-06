import { skills } from '@/content'

export function Skills() {
  return (
    <section aria-labelledby="skills-title">
      <h2 id="skills-title">What I do</h2>
      <div className="grid grid--4">
        {skills.map((skill) => (
          <article className="card" key={skill.name}>
            <header className="card__head">
              <h3>{skill.name}</h3>
            </header>
            <p>{skill.claim}</p>
            <p className="label card__tools">{skill.tools}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
