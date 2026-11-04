import { useState, useEffect } from 'react'
import useSound from 'use-sound'
import clickSfx from '../../sounds/click.mp3'
import axios from 'axios'
import { api } from '../../services/api'
import { Loading } from '../Loading'
import { PokemonImage } from '../PokemonImage'
import { PokemonModal } from '../PokemonModal'
import { getCleanPokemonName } from '../../utils/pokemonNames'
import { useLanguage } from '../../contexts/LanguageContext'

interface PokedexType {
  type: { name: string; url?: string }
}

interface PokedexSprite {
  other: { home: { front_default: string } }
}

interface PokedexAbility {
  ability: { name: string; url?: string }
  is_hidden?: boolean
}

interface PokedexStat {
  base_stat: number
  stat: { name: string }
}

interface PokedexEntry {
  id?: number
  name: string
  types?: PokedexType[]
  sprites?: PokedexSprite
  abilities?: PokedexAbility[]
  stats?: PokedexStat[]
  species?: { url: string }
}

interface LocalizedName {
  language: { name: string }
  name: string
}

interface SpeciesData {
  names: LocalizedName[]
}

export function Pokedex(props: { name: string }) {
  const [pokemonData, setPokemonData] = useState<PokedexEntry | null>(null)
  const [localizedName, setLocalizedName] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { language, getLocalizedName } = useLanguage()

  useEffect(() => {
    const getPokedex = async () => {
      try {
        const response = await api.get(`${props.name}`)
        setPokemonData(response.data)

        if (response.data.species?.url) {
          try {
            const speciesResponse = await axios.get<SpeciesData>(
              response.data.species.url
            )
            const displayName = getLocalizedName(speciesResponse.data.names)
            setLocalizedName(displayName)
          } catch (error) {
            console.error('Failed to fetch species data:', error)
            setLocalizedName(getCleanPokemonName(response.data.name))
          }
        } else {
          setLocalizedName(getCleanPokemonName(response.data.name))
        }
      } catch (error) {
        console.error('Failed to fetch Pokedex data:', error)
      }
    }
    getPokedex()
  }, [props.name, language, getLocalizedName])

  const [click]: [(() => void) | undefined, { stop: () => void } | undefined] =
    useSound(clickSfx)

  if (!pokemonData) {
    return (
      <li style={{ listStyle: 'none' }}>
        <Loading variant="inline" message="" />
      </li>
    )
  }

  const { id, name, types, sprites, abilities, stats } = pokemonData
  const spriteUrl = sprites?.other?.home?.front_default ?? ''
  const displayName = localizedName || getCleanPokemonName(name)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <>
      <button
        className="pokemon-card-button"
        onClick={openModal}
        onMouseEnter={click}
        aria-label={`View details for ${displayName}`}
      >
        <PokemonImage
          id={id}
          name={displayName}
          sprite={spriteUrl}
          types={types}
        />
      </button>

      <PokemonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        id={id}
        name={displayName}
        sprite={spriteUrl}
        types={types}
        abilities={abilities}
        stats={stats}
      />
    </>
  )
}
