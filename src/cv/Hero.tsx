import Image from 'next/image'
import { site } from '@/content'

export function Hero() {
  return (
    <header className="hero">
      <div className="hero__name">
        <h1 id="name">
          Daniel <br />
          Cross
        </h1>
        <div className="stripe" aria-hidden="true" />
      </div>
      <div className="hero__about">
        <div className="photo">
          <Image src="/daniel.jpg" alt="Daniel Cross" fill sizes="196px" priority />
        </div>
        <p className="pitch">{site.pitch}</p>
        <p className="bio">{site.bio}</p>
        <div className="actions">
          <a className="btn btn--primary" href={`mailto:${site.email}`}>
            Email me
          </a>
        </div>
      </div>
    </header>
  )
}
