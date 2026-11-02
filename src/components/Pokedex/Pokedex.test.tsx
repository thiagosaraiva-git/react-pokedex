import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pokedex } from './index'
import * as apiModule from '../../services/api'

vi.mock('../../services/api')
vi.mock('use-sound', () => ({
  default: () => [vi.fn(), { stop: vi.fn() }],
}))

const mockPokemonData = {
  id: 6,
  name: 'charizard',
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  sprites: {
    other: {
      home: {
        front_default: 'https://example.com/charizard.png',
      },
    },
  },
  abilities: [
    { ability: { name: 'blaze' }, is_hidden: false },
    { ability: { name: 'solar-power' }, is_hidden: true },
  ],
  stats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 84, stat: { name: 'attack' } },
    { base_stat: 78, stat: { name: 'defense' } },
    { base_stat: 109, stat: { name: 'special-attack' } },
    { base_stat: 85, stat: { name: 'special-defense' } },
    { base_stat: 100, stat: { name: 'speed' } },
  ],
}

const mockCharizardMegaXData = {
  id: 6,
  name: 'charizard-mega-x',
  types: [{ type: { name: 'fire' } }, { type: { name: 'dragon' } }],
  sprites: {
    other: {
      home: {
        front_default: 'https://example.com/charizard-mega-x.png',
      },
    },
  },
  abilities: [{ ability: { name: 'tough-claws' }, is_hidden: false }],
  stats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 130, stat: { name: 'attack' } },
    { base_stat: 111, stat: { name: 'defense' } },
    { base_stat: 130, stat: { name: 'special-attack' } },
    { base_stat: 85, stat: { name: 'special-defense' } },
    { base_stat: 100, stat: { name: 'speed' } },
  ],
}

describe('Pokedex Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(async () => {
    cleanup()
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  it('should render loading state initially', () => {
    const mockGet = vi.fn().mockImplementation(() => {
      return new Promise(() => {})
    })
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="charizard" />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should display clean pokemon name without form suffix', async () => {
    const mockGet = vi.fn().mockImplementation(() => {
      return Promise.resolve({ data: mockCharizardMegaXData })
    })
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="charizard-mega-x" />)

    await waitFor(() => {
      expect(screen.getByText('charizard')).toBeInTheDocument()
    })
  })

  it('should render pokemon card with image and details', async () => {
    const mockGet = vi.fn().mockImplementation(() => {
      return Promise.resolve({ data: mockPokemonData })
    })
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="charizard" />)

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: /view details for charizard/i,
      })
      expect(button).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByAltText('charizard')).toBeInTheDocument()
    })
  })

  it('should open modal when card is clicked', async () => {
    const mockGet = vi.fn().mockImplementation(() => {
      return Promise.resolve({ data: mockPokemonData })
    })
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="charizard" />)

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: /view details for charizard/i,
      })
      expect(button).toBeInTheDocument()
    })

    const button = screen.getByRole('button', {
      name: /view details for charizard/i,
    })
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /^abilities$/i, level: 3 })
      ).toBeInTheDocument()
    })
  })

  it('should close modal when close button is clicked', async () => {
    const mockGet = vi.fn().mockImplementation(() => {
      return Promise.resolve({ data: mockPokemonData })
    })
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="charizard" />)

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: /view details for charizard/i,
      })
      expect(button).toBeInTheDocument()
    })

    const cardButton = screen.getByRole('button', {
      name: /view details for charizard/i,
    })
    await userEvent.click(cardButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    const closeButton = screen.getByRole('button', { name: /close modal/i })
    await userEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should handle pokemon with form suffixes correctly', async () => {
    const mockGet = vi.fn().mockImplementation(() => {
      return Promise.resolve({ data: mockCharizardMegaXData })
    })
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="charizard-mega-x" />)

    await waitFor(() => {
      expect(screen.getByText('charizard')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', {
      name: /view details for charizard/i,
    })
    expect(button).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockGet = vi.fn().mockRejectedValue(new Error('API Error'))
    ;(apiModule.api.get as any) = mockGet

    render(<Pokedex name="invalid-pokemon" />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch Pokedex data:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })
})
