import './styles.scss'
import pokedexHero from '../../img/pokedex-hero.webp'

export function Hero() {
  return (
    <section className="hero-banner" aria-label="Pokédex">
      <div className="hero-background" aria-hidden="true">
        <img
          className="hero-background-image"
          src={pokedexHero}
          alt=""
          width={1280}
          height={420}
          fetchPriority="high"
        />
      </div>
    </section>
  )
}
