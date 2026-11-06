import Image from 'next/image'
import type { CSSProperties } from 'react'
import { work } from '@/content'

export function Work() {
  return (
    <section aria-labelledby="work-title">
      <h2 id="work-title">Work</h2>
      <div className="work">
        {work.map((job) => (
          <article className="card job" key={job.slug} style={{ '--tint': job.tint } as CSSProperties}>
            <header className="card__head card__head--stack">
              <h3>{job.name}</h3>
              <span className="label role">{job.role}</span>
            </header>
            <p>{job.text}</p>
            <ul className="proof">
              {job.proof.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                  <span>{item.note}</span>
                </li>
              ))}
            </ul>
            <div className={`shots shots--${job.shotLayout}`}>
              {job.shots.map((shot) => (
                <Image key={shot.src} src={shot.src} alt={shot.alt} width={400} height={866} sizes="(min-width: 1180px) 260px, 45vw" />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
