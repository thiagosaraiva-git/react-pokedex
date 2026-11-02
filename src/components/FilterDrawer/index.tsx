import { ChangeEvent, useEffect, useRef } from 'react'
import './styles.scss'

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
}

const allTypes = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

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
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

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
          <h2 id="drawer-title">Filtros</h2>
          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Fechar filtros"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <div className="filter-group">
            <label htmlFor="name-filter">Busca por nome</label>
            <input
              id="name-filter"
              type="text"
              placeholder="Search by name"
              value={nameFilter}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onNameFilterChange(e.target.value)
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="generation-filter">Geração</label>
            <select
              id="generation-filter"
              value={generationFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onGenerationFilterChange(e.target.value)
              }
            >
              <option value="all">National Dex (All Gen)</option>
              <option value="gen1">Gen 1 (1-151)</option>
              <option value="gen2">Gen 2 (152-251)</option>
              <option value="gen3">Gen 3 (252-386)</option>
              <option value="gen4">Gen 4 (387-493)</option>
              <option value="gen5">Gen 5 (494-649)</option>
              <option value="gen6">Gen 6 (650-721)</option>
              <option value="gen7">Gen 7 (722-809)</option>
              <option value="gen8">Gen 8 (810-905)</option>
              <option value="gen9">Gen 9 (906-1025)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type1-filter">Tipo 1</label>
            <select
              id="type1-filter"
              value={typeFilter1}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onTypeFilter1Change(e.target.value)
              }
            >
              <option value="all">Any</option>
              {allTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type2-filter">Tipo 2</label>
            <select
              id="type2-filter"
              value={typeFilter2}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onTypeFilter2Change(e.target.value)
              }
            >
              <option value="all">Any</option>
              {allTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  )
}
