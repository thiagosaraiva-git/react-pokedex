import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './styles.scss'
import { getFormDisplayName } from '../../utils/pokemonNames'

interface PokedexType {
  type: { name: string }
}

interface PokedexAbility {
  ability: { name: string }
  is_hidden?: boolean
}

interface PokedexStat {
  base_stat: number
  stat: { name: string }
}

interface PokemonForm {
  name: string
  sprites: {
    front_default?: string
    other?: { home?: { front_default?: string } }
  }
  types?: PokedexType[]
}

interface PokemonVariety {
  is_default: boolean
  pokemon: {
    name: string
    url: string
  }
}

interface PokemonModalProps {
  isOpen: boolean
  onClose: () => void
  id?: number
  name: string
  sprite: string
  types?: PokedexType[]
  abilities?: PokedexAbility[]
  stats?: PokedexStat[]
}

const maxStat = 255

export function PokemonModal({
  isOpen,
  onClose,
  id,
  name,
  sprite,
  types,
  abilities,
  stats,
}: PokemonModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  const [forms, setForms] = useState<PokemonForm[]>([])
  const [selectedFormIndex, setSelectedFormIndex] = useState(0)
  const [isLoadingForms, setIsLoadingForms] = useState(false)
  const [currentSprite, setCurrentSprite] = useState(sprite)
  const [currentTypes, setCurrentTypes] = useState(types)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement

    closeButtonRef.current?.focus()

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTabKey)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTabKey)
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !id) return

    setIsLoadingForms(true)
    setSelectedFormIndex(0)
    setCurrentSprite(sprite)
    setCurrentTypes(types)

    let cancelled = false

    const fetchForms = async () => {
      if (cancelled) return
      try {
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        )
        const varieties: PokemonVariety[] = speciesResponse.data.varieties || []

        if (varieties.length <= 1) {
          setForms([])
          setIsLoadingForms(false)
          return
        }

        const formDataPromises = varieties.map(async variety => {
          try {
            const pokemonResponse = await axios.get(variety.pokemon.url)
            return {
              name: variety.pokemon.name,
              sprites: pokemonResponse.data.sprites,
              types: pokemonResponse.data.types || [],
            } as PokemonForm
          } catch (error) {
            console.error(
              `Failed to fetch form data for ${variety.pokemon.name}:`,
              error
            )
            return null
          }
        })

        const formsData = await Promise.all(formDataPromises)
        const validForms: PokemonForm[] = formsData.filter(
          (form): form is PokemonForm => form !== null
        )

        if (!cancelled) {
          setForms(validForms)
        }
      } catch (error) {
        console.error('Failed to fetch Pokemon forms:', error)
        if (!cancelled) {
          setForms([])
        }
      } finally {
        if (!cancelled) {
          setIsLoadingForms(false)
        }
      }
    }

    fetchForms()

    return () => {
      cancelled = true
    }
  }, [isOpen, id, name, sprite, types])

  const handleFormSelect = (index: number) => {
    if (index < 0 || index >= forms.length) return

    setSelectedFormIndex(index)
    const selectedForm = forms[index]
    const newSprite =
      selectedForm.sprites?.other?.home?.front_default ||
      selectedForm.sprites?.front_default ||
      sprite
    setCurrentSprite(newSprite)
    setCurrentTypes(selectedForm.types || types)
  }

  if (!isOpen) return null

  const displayTypes = currentTypes || types
  const type1 = displayTypes?.[0]?.type?.name ?? 'N/A'
  const type2 = displayTypes?.[1]?.type?.name

  const normalAbilities = abilities?.filter(a => !a.is_hidden) ?? []
  const hiddenAbilities = abilities?.filter(a => a.is_hidden) ?? []

  const hp = stats?.[0]?.base_stat ?? 0
  const attack = stats?.[1]?.base_stat ?? 0
  const defense = stats?.[2]?.base_stat ?? 0
  const special_attack = stats?.[3]?.base_stat ?? 0
  const special_defense = stats?.[4]?.base_stat ?? 0
  const speed = stats?.[5]?.base_stat ?? 0

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        <button
          ref={closeButtonRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="modal-header">
          {currentSprite ? (
            <img src={currentSprite} alt={name} className="modal-image" />
          ) : (
            <p>No Image</p>
          )}
          <h2 id="modal-title" className="modal-name">
            {name}
          </h2>
          <p className="modal-id">#{id ?? 'N/A'}</p>
          <div className="modal-types">
            <span className={`type-badge ${type1}`}>{type1}</span>
            {type2 && <span className={`type-badge ${type2}`}>{type2}</span>}
          </div>
        </div>

        {forms.length > 1 && (
          <div className="modal-section forms-section">
            <h3>Forms</h3>
            {isLoadingForms ? (
              <p className="loading-forms">Loading forms...</p>
            ) : (
              <div className="forms-grid">
                {forms.map((form, index) => {
                  const formSprite =
                    form.sprites?.other?.home?.front_default ||
                    form.sprites?.front_default
                  return (
                    <button
                      key={form.name}
                      className={`form-button ${
                        index === selectedFormIndex ? 'active' : ''
                      }`}
                      onClick={() => handleFormSelect(index)}
                      aria-label={`Switch to ${getFormDisplayName(form.name)}`}
                    >
                      {formSprite && (
                        <img
                          src={formSprite}
                          alt={form.name}
                          className="form-sprite"
                        />
                      )}
                      <span className="form-name">
                        {getFormDisplayName(form.name)}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="modal-body">
          <div className="modal-section">
            <h3>Abilities</h3>
            {normalAbilities.length > 0 && (
              <ul className="abilities-list">
                {normalAbilities.map((ability, index) => (
                  <li key={index}>{ability.ability.name}</li>
                ))}
              </ul>
            )}
            {hiddenAbilities.length > 0 && (
              <>
                <h4 className="hidden-abilities-title">Hidden Abilities</h4>
                <ul className="abilities-list hidden">
                  {hiddenAbilities.map((ability, index) => (
                    <li key={index}>{ability.ability.name}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="modal-section">
            <h3>Base Stats</h3>
            <div className="stats-container">
              <li>
                <p>
                  HP: <progress value={hp} max={maxStat} /> {hp}
                </p>
              </li>
              <li>
                <p>
                  Attack: <progress value={attack} max={maxStat} /> {attack}
                </p>
              </li>
              <li>
                <p>
                  Defense: <progress value={defense} max={maxStat} /> {defense}
                </p>
              </li>
              <li>
                <p>
                  Sp. Attack: <progress value={special_attack} max={maxStat} />{' '}
                  {special_attack}
                </p>
              </li>
              <li>
                <p>
                  Sp. Defense:{' '}
                  <progress value={special_defense} max={maxStat} />{' '}
                  {special_defense}
                </p>
              </li>
              <li>
                <p>
                  Speed: <progress value={speed} max={maxStat} /> {speed}
                </p>
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
