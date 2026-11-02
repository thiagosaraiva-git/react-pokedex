import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonCard } from './index'
import * as apiModule from '../../services/api'

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
;(globalThis as any).IntersectionObserver = mockIntersectionObserver

vi.mock('../../services/api')
vi.mock('../Pokedex', () => ({
  Pokedex: ({ name }: { name: string }) => (
    <div data-testid={`pokemon-${name}`}>{name}</div>
  ),
}))
vi.mock('../Loading', () => ({
  Loading: ({ progress }: { progress?: number }) => (
    <div data-testid="loading">
      {typeof progress === 'number' && `Carregando… ${progress}%`}
    </div>
  ),
}))
vi.mock('use-sound', () => ({
  default: () => [vi.fn(), { stop: vi.fn() }],
}))

const mockPokemonData = [
  {
    id: 1,
    name: 'bulbasaur',
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  },
  { id: 4, name: 'charmander', types: [{ type: { name: 'fire' } }] },
  { id: 7, name: 'squirtle', types: [{ type: { name: 'water' } }] },
  { id: 25, name: 'pikachu', types: [{ type: { name: 'electric' } }] },
  { id: 152, name: 'chikorita', types: [{ type: { name: 'grass' } }] },
  { id: 155, name: 'cyndaquil', types: [{ type: { name: 'fire' } }] },
  { id: 252, name: 'treecko', types: [{ type: { name: 'grass' } }] },
  { id: 387, name: 'turtwig', types: [{ type: { name: 'grass' } }] },
  { id: 800, name: 'necrozma', types: [{ type: { name: 'psychic' } }] },
  { id: 906, name: 'sprigatito', types: [{ type: { name: 'grass' } }] },
  {
    id: 658,
    name: 'greninja',
    types: [{ type: { name: 'water' } }, { type: { name: 'dark' } }],
  },
]

const mockPokemonDataWithForms = [
  ...mockPokemonData,
  {
    id: 6,
    name: 'charizard',
    types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  },
  {
    id: 10034,
    name: 'charizard-mega-x',
    types: [{ type: { name: 'fire' } }, { type: { name: 'dragon' } }],
  },
  {
    id: 10035,
    name: 'charizard-mega-y',
    types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  },
  { id: 26, name: 'raichu', types: [{ type: { name: 'electric' } }] },
  {
    id: 10100,
    name: 'raichu-alola',
    types: [{ type: { name: 'electric' } }, { type: { name: 'psychic' } }],
  },
]

describe('PokemonCard Filter Logic', () => {
  const defaultProps = {
    nameFilter: '',
    generationFilter: 'all',
    typeFilter1: 'all',
    typeFilter2: 'all',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    const mockGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('?limit=')) {
        return Promise.resolve({
          data: {
            results: mockPokemonData.map(p => ({
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
            })),
          },
        })
      }
      const pokemonName = url
      const pokemon = mockPokemonData.find(p => p.name === pokemonName)
      return Promise.resolve({ data: pokemon })
    })

    ;(apiModule.api.get as any) = mockGet
  })

  afterEach(() => {
    cleanup()
  })

  it('should load and display Pokemon initially', async () => {
    render(<PokemonCard {...defaultProps} />)

    expect(screen.getByTestId('loading')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })
  })

  it('should filter by name search', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(<PokemonCard {...defaultProps} nameFilter="char" />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument()
    })
  })

  it('should filter by generation (Gen 1)', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(<PokemonCard {...defaultProps} generationFilter="gen1" />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
      expect(screen.getByTestId('pokemon-pikachu')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument()
    })
  })

  it('should filter by generation (Gen 2)', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-chikorita')).toBeInTheDocument()
    })

    rerender(<PokemonCard {...defaultProps} generationFilter="gen2" />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-chikorita')).toBeInTheDocument()
      expect(screen.getByTestId('pokemon-cyndaquil')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument()
    })
  })

  it('should filter by single type', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument()
    })

    rerender(<PokemonCard {...defaultProps} typeFilter1="fire" />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument()
      expect(screen.getByTestId('pokemon-cyndaquil')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-squirtle')).not.toBeInTheDocument()
    })
  })

  it('should filter by dual type (both types required)', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard {...defaultProps} typeFilter1="grass" typeFilter2="poison" />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument()
    })
  })

  it('should combine name search with generation filter', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard
        {...defaultProps}
        nameFilter="turt"
        generationFilter="gen4"
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-turtwig')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument()
    })
  })

  it('should combine name search with type filter', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard {...defaultProps} nameFilter="chi" typeFilter1="grass" />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-chikorita')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-cyndaquil')).not.toBeInTheDocument()
    })
  })

  it('should combine generation and type filters', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard
        {...defaultProps}
        generationFilter="gen1"
        typeFilter1="grass"
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument()
    })
  })

  it('should reset filters when all are set to default', async () => {
    const { rerender } = render(
      <PokemonCard
        nameFilter="char"
        generationFilter="gen1"
        typeFilter1="fire"
        typeFilter2="all"
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument()
    })

    rerender(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument()
    })
  })

  it('should display results count', async () => {
    render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText(/Showing \d+ of \d+ Pokémon/)).toBeInTheDocument()
    })
  })

  it('should display empty state when no results match filters', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard {...defaultProps} typeFilter1="fire" typeFilter2="water" />
    )

    await waitFor(() => {
      expect(
        screen.getByText('No Pokémon found matching your filters.')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Try adjusting your search or clearing filters.')
      ).toBeInTheDocument()
    })
  })

  it('should handle Fire + Water dual-type (no matches case)', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard {...defaultProps} typeFilter1="fire" typeFilter2="water" />
    )

    await waitFor(() => {
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-squirtle')).not.toBeInTheDocument()
      expect(screen.getByText(/Showing 0 of 0 Pokémon/)).toBeInTheDocument()
    })
  })

  it('should match dual-type in any order (Water+Dark vs Dark+Water)', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-greninja')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard {...defaultProps} typeFilter1="water" typeFilter2="dark" />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-greninja')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard {...defaultProps} typeFilter1="dark" typeFilter2="water" />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-greninja')).toBeInTheDocument()
    })
  })

  it('should combine name search with generation and type filters (triple combo)', async () => {
    const { rerender } = render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
    })

    rerender(
      <PokemonCard
        nameFilter="bulba"
        generationFilter="gen1"
        typeFilter1="grass"
        typeFilter2="all"
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument()
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument()
    })
  })

  it('should load more Pokemon when scrolling (infinite scroll)', async () => {
    const manyPokemon = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `pokemon${i + 1}`,
      types: [{ type: { name: 'normal' } }],
    }))

    const mockGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('?limit=')) {
        return Promise.resolve({
          data: {
            results: manyPokemon.map(p => ({
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
            })),
          },
        })
      }
      const pokemonName = url
      const pokemon = manyPokemon.find(p => p.name === pokemonName)
      return Promise.resolve({ data: pokemon })
    })

    ;(apiModule.api.get as any) = mockGet

    render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-pokemon1')).toBeInTheDocument()
    })

    const initialCount = screen.getAllByTestId(/pokemon-/).length
    expect(initialCount).toBeLessThanOrEqual(40)
  })

  it('should filter out alternate forms and only show base forms', async () => {
    const mockGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('?limit=')) {
        return Promise.resolve({
          data: {
            results: mockPokemonDataWithForms.map(p => ({
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
            })),
          },
        })
      }
      const pokemonName = url
      const pokemon = mockPokemonDataWithForms.find(p => p.name === pokemonName)
      return Promise.resolve({ data: pokemon })
    })

    ;(apiModule.api.get as any) = mockGet

    render(<PokemonCard {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charizard')).toBeInTheDocument()
      expect(screen.getByTestId('pokemon-raichu')).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId('pokemon-charizard-mega-x')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('pokemon-charizard-mega-y')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('pokemon-raichu-alola')).not.toBeInTheDocument()
  })
})
