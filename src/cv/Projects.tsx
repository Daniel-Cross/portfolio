import Image from 'next/image'
import { projects } from '@/content'

export function Projects() {
  return (
    <section aria-labelledby="projects-title">
      <h2 id="projects-title">Projects</h2>
      <div className="grid grid--4">
        {projects.map((project) => (
          <article className={`card project${project.banner ? '' : ' project--soon'}`} key={project.slug}>
            {project.banner ? (
              <div className={`banner banner--${project.banner.fit ?? 'top'}`}>
                <Image src={project.banner.src} alt={project.banner.alt} fill sizes="(min-width: 1180px) 320px, 100vw" />
              </div>
            ) : (
              <div className="banner banner--soon">Coming soon</div>
            )}
            <header className="card__head card__head--stack">
              <h3>{project.name}</h3>
              {project.status ? <span className="label">{project.status}</span> : null}
            </header>
            <p>{project.text}</p>
            {project.links.length ? (
              <footer className="actions">
                {project.links.map((link) => (
                  <a className="btn" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </footer>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
