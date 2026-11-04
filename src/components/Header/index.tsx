import '../Header/styles.scss'
import { LanguageSelector } from '../LanguageSelector'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header>
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
      <div className="space" />
    </header>
  )
}
