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
        <p className="katakana" lang="ja" aria-hidden="true">
          ダニエル・クロス
        </p>
        <button type="button" className="stripe stripe--secret" data-secret aria-label="Play a hidden tune" />
      </div>
      <div className="hero__about">
        <p className="live" aria-hidden="true">
          <b>LIVE</b>
          <span>daniel cross radio, apps to relax/ship to</span>
        </p>
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
