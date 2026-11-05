import { ChangeEvent, useEffect, useRef } from 'react'
import './styles.scss'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  GENERATION_STRING_KEYS,
  POKEMON_TYPES,
  TYPE_STRING_KEYS,
} from '../../i18n/uiStrings'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  nameFilter: string
  generationFilter: string
  typeFilter1: string
  typeFilter2: string
  onNameFilterChange: (value: string) => void
  onGenerationFilterChange: (value: string) => void
  onTypeFilter1Change: (value: string) => void
  onTypeFilter2Change: (value: string) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
}

export function FilterDrawer({
  isOpen,
  onClose,
  nameFilter,
  generationFilter,
  typeFilter1,
  typeFilter2,
  onNameFilterChange,
  onGenerationFilterChange,
  onTypeFilter1Change,
  onTypeFilter2Change,
  onResetFilters,
  hasActiveFilters,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="drawer-overlay" role="presentation">
      <div
        ref={drawerRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <h2 id="drawer-title">{t('filters')}</h2>
          <button
            className="drawer-close"
            onClick={onClose}
            aria-label={t('closeFilters')}
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <div className="filter-group">
            <label htmlFor="name-filter">{t('searchByName')}</label>
            <input
              id="name-filter"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={nameFilter}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onNameFilterChange(e.target.value)
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="generation-filter">{t('generation')}</label>
            <select
              id="generation-filter"
              value={generationFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onGenerationFilterChange(e.target.value)
              }
            >
              {Object.entries(GENERATION_STRING_KEYS).map(([value, key]) => (
                <option key={value} value={value}>
                  {t(key)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type1-filter">{t('type1')}</label>
            <select
              id="type1-filter"
              value={typeFilter1}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onTypeFilter1Change(e.target.value)
              }
            >
              <option value="all">{t('anyType')}</option>
              {POKEMON_TYPES.map(type => (
                <option key={type} value={type}>
                  {t(TYPE_STRING_KEYS[type])}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type2-filter">{t('type2')}</label>
            <select
              id="type2-filter"
              value={typeFilter2}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onTypeFilter2Change(e.target.value)
              }
            >
              <option value="all">{t('anyType')}</option>
              {POKEMON_TYPES.map(type => (
                <option key={type} value={type}>
                  {t(TYPE_STRING_KEYS[type])}
                </option>
              ))}
            </select>
          </div>

          <button
            className="reset-button"
            onClick={() => {
              onResetFilters()
              onClose()
            }}
            disabled={!hasActiveFilters}
            aria-label={t('clearFilter')}
          >
            {t('clearFilter')}
          </button>
        </div>
      </div>
    </div>
  )
}
