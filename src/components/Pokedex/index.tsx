import { useState, useEffect } from 'react'
import useSound from 'use-sound'
import clickSfx from '../../sounds/click.mp3'
import { api } from '../../services/api'
import { Loading } from '../Loading'
import { PokemonImage } from '../PokemonImage'
import { PokemonModal } from '../PokemonModal'

interface PokedexType {
  type: { name: string }
}

interface PokedexSprite {
  other: { home: { front_default: string } }
}

interface PokedexAbility {
  ability: { name: string }
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
}

export function Pokedex(props: { name: string }) {
  const [pokemonData, setPokemonData] = useState<PokedexEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const getPokedex = async () => {
      try {
        const response = await api.get(`${props.name}`)
        setPokemonData(response.data)
      } catch (error) {
        console.error('Failed to fetch Pokedex data:', error)
      }
    }
    getPokedex()
  }, [props.name])

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
        aria-label={`View details for ${name}`}
      >
        <PokemonImage id={id} name={name} sprite={spriteUrl} types={types} />
      </button>

      <PokemonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        id={id}
        name={name}
        sprite={spriteUrl}
        types={types}
        abilities={abilities}
        stats={stats}
      />
    </>
  )
}
