import { useState, useEffect, useRef, useCallback } from 'react'
import { Pokedex } from '../Pokedex'
import { Loading } from '../Loading'
import { api } from '../../services/api'
import '../Pokemon/styles.scss'

interface PokemonCardList {
  id: number
  name: string
  types: Array<{ type: { name: string } }>
}

interface PokemonCardProps {
  nameFilter: string
  generationFilter: string
  typeFilter1: string
  typeFilter2: string
}

const generationRanges = {
  gen1: { min: 1, max: 151 },
  gen2: { min: 152, max: 251 },
  gen3: { min: 252, max: 386 },
  gen4: { min: 387, max: 493 },
  gen5: { min: 494, max: 649 },
  gen6: { min: 650, max: 721 },
  gen7: { min: 722, max: 809 },
  gen8: { min: 810, max: 905 },
  gen9: { min: 906, max: 1025 },
}

const BATCH_SIZE = 40
const FETCH_CHUNK_SIZE = 100

export function PokemonCard({
  nameFilter,
  generationFilter,
  typeFilter1,
  typeFilter2,
}: PokemonCardProps) {
  const [pokemons, setPokemons] = useState<PokemonCardList[]>([])
  const [displayedPokemons, setDisplayedPokemons] = useState<PokemonCardList[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [displayCount, setDisplayCount] = useState(BATCH_SIZE)

  const observerTarget = useRef<HTMLDivElement>(null)

  const getPokemon = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('?limit=1025')
      const pokemonList = response.data.results
      const totalPokemon = pokemonList.length

      const allPokemonData: PokemonCardList[] = []

      for (let i = 0; i < pokemonList.length; i += FETCH_CHUNK_SIZE) {
        const chunk = pokemonList.slice(i, i + FETCH_CHUNK_SIZE)

        const chunkData = await Promise.all(
          chunk.map(async (pokemon: { name: string; url: string }) => {
            const singlePokemonResponse = await api.get(`${pokemon.name}`)
            return singlePokemonResponse.data
          })
        )

        allPokemonData.push(...chunkData)
        setPokemons([...allPokemonData])
        setLoadingProgress(
          Math.round((allPokemonData.length / totalPokemon) * 100)
        )
      }
    } catch (error) {
      console.error('Failed to fetch Pokemon data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPokemon()
  }, [])

  const getFilteredPokemons = useCallback(() => {
    let filtered = pokemons

    if (nameFilter) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
    }

    if (typeFilter1 !== 'all' && typeFilter2 !== 'all') {
      filtered = filtered.filter(pokemon => {
        const pokemonTypes = pokemon.types.map(t => t.type.name)
        return (
          pokemonTypes.includes(typeFilter1) &&
          pokemonTypes.includes(typeFilter2)
        )
      })
    } else if (typeFilter1 !== 'all') {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(t => t.type.name === typeFilter1)
      )
    } else if (typeFilter2 !== 'all') {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(t => t.type.name === typeFilter2)
      )
    }

    if (generationFilter !== 'all') {
      const range =
        generationRanges[generationFilter as keyof typeof generationRanges]
      if (range) {
        filtered = filtered.filter(
          pokemon => pokemon.id >= range.min && pokemon.id <= range.max
        )
      }
    }

    return filtered
  }, [pokemons, nameFilter, typeFilter1, typeFilter2, generationFilter])

  useEffect(() => {
    const filtered = getFilteredPokemons()
    setDisplayedPokemons(filtered.slice(0, displayCount))
  }, [getFilteredPokemons, displayCount])

  useEffect(() => {
    setDisplayCount(BATCH_SIZE)
  }, [nameFilter, typeFilter1, typeFilter2, generationFilter])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          const filtered = getFilteredPokemons()
          if (displayedPokemons.length < filtered.length) {
            setIsLoadingMore(true)
            setTimeout(() => {
              setDisplayCount(prev => prev + BATCH_SIZE)
              setIsLoadingMore(false)
            }, 300)
          }
        }
      },
      { threshold: 0.5 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [displayedPokemons, isLoadingMore, getFilteredPokemons])

  if (isLoading) {
    return <Loading progress={loadingProgress} />
  }

  return (
    <>
      <div className="results-info">
        Showing {displayedPokemons.length} of {getFilteredPokemons().length}{' '}
        Pokémon
      </div>
      <section className="pokemon-namelist">
        {displayedPokemons.length === 0 ? (
          <div className="empty-state">
            <p>No Pokémon found matching your filters.</p>
            <p>Try adjusting your search or clearing filters.</p>
          </div>
        ) : (
          <ul>
            {displayedPokemons.map(pokemon => {
              return <Pokedex key={pokemon.id} name={pokemon.name} />
            })}
          </ul>
        )}
      </section>
      <div ref={observerTarget} className="load-more-trigger">
        {isLoadingMore && (
          <Loading variant="inline" message="Carregando mais…" />
        )}
      </div>
    </>
  )
}
