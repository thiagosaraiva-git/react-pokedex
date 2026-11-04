import '../Header/styles.scss'
import heroBanner from '../../img/hero-banner.webp'
import { LanguageSelector } from '../LanguageSelector'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="hero-banner">
      <div className="hero-background" aria-hidden="true">
        <img
          className="hero-background-image"
          src={heroBanner}
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
        />
      </div>
      <div className="hero-content">
        <div className="pokedex-header">
          <img
            src="https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo-8.png"
            alt="Pokémon Logo"
          />
          <div className="header-controls">
            <LanguageSelector />
            {onMenuClick && (
              <button
                className="hamburger-button"
                type="button"
                onClick={onMenuClick}
                aria-label="Filtros"
                aria-controls="filter-drawer"
              >
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
