import '../Header/styles.scss'
import { LanguageSelector } from '../LanguageSelector'
import { useLanguage } from '../../contexts/LanguageContext'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t } = useLanguage()
  return (
    <header className="pokedex-header">
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
            aria-label={t('filters')}
            aria-controls="filter-drawer"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        )}
      </div>
    </header>
  )
}
