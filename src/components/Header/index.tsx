import '../Header/styles.scss'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header>
      <div className="pokedex-header">
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
        <img
          src="https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo-8.png"
          alt="Pokémon Logo"
        />
      </div>
      <div className="space" />
    </header>
  )
}
