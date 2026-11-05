import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonModal } from './index'
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext'
import axios from 'axios'

vi.mock('axios')

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

function LanguageHarness({ children }: { children: React.ReactNode }) {
  const { setLanguage } = useLanguage()
  return (
    <>
      <button type="button" onClick={() => setLanguage('fr')}>
        to-fr
      </button>
      <button type="button" onClick={() => setLanguage('ja')}>
        to-ja
      </button>
      {children}
    </>
  )
}

const mockPokemonData = {
  id: 6,
  name: 'charizard',
  sprite: 'https://example.com/charizard.png',
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
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

const mockSpeciesData = {
  varieties: [
    {
      is_default: true,
      pokemon: {
        name: 'charizard',
        url: 'https://pokeapi.co/api/v2/pokemon/6/',
      },
    },
    {
      is_default: false,
      pokemon: {
        name: 'charizard-mega-x',
        url: 'https://pokeapi.co/api/v2/pokemon/10034/',
      },
    },
    {
      is_default: false,
      pokemon: {
        name: 'charizard-mega-y',
        url: 'https://pokeapi.co/api/v2/pokemon/10035/',
      },
    },
  ],
}

const mockCharizardFormData = {
  name: 'charizard',
  sprites: {
    front_default: 'https://example.com/charizard.png',
    other: {
      home: { front_default: 'https://example.com/charizard-home.png' },
    },
  },
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  stats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 84, stat: { name: 'attack' } },
    { base_stat: 78, stat: { name: 'defense' } },
    { base_stat: 109, stat: { name: 'special-attack' } },
    { base_stat: 85, stat: { name: 'special-defense' } },
    { base_stat: 100, stat: { name: 'speed' } },
  ],
}

const mockCharizardMegaXFormData = {
  name: 'charizard-mega-x',
  sprites: {
    front_default: 'https://example.com/charizard-mega-x.png',
    other: {
      home: { front_default: 'https://example.com/charizard-mega-x-home.png' },
    },
  },
  types: [{ type: { name: 'fire' } }, { type: { name: 'dragon' } }],
  stats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 130, stat: { name: 'attack' } },
    { base_stat: 111, stat: { name: 'defense' } },
    { base_stat: 130, stat: { name: 'special-attack' } },
    { base_stat: 85, stat: { name: 'special-defense' } },
    { base_stat: 100, stat: { name: 'speed' } },
  ],
}

const mockCharizardMegaYFormData = {
  name: 'charizard-mega-y',
  sprites: {
    front_default: 'https://example.com/charizard-mega-y.png',
    other: {
      home: { front_default: 'https://example.com/charizard-mega-y-home.png' },
    },
  },
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  stats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 104, stat: { name: 'attack' } },
    { base_stat: 78, stat: { name: 'defense' } },
    { base_stat: 159, stat: { name: 'special-attack' } },
    { base_stat: 115, stat: { name: 'special-defense' } },
    { base_stat: 100, stat: { name: 'speed' } },
  ],
}

describe('PokemonModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(axios.get as any) = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/type/')) {
        return Promise.resolve({
          data: {
            names: [{ language: { name: 'en' }, name: url.split('/').pop() }],
          },
        })
      }
      if (url.includes('/ability/')) {
        return Promise.resolve({
          data: {
            names: [{ language: { name: 'en' }, name: url.split('/').pop() }],
          },
        })
      }
      if (url.includes('/pokemon-species/')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('/pokemon/')) {
        const name = url.split('/').filter(Boolean).pop()
        if (name === '10034') {
          return Promise.resolve({ data: mockCharizardMegaXFormData })
        }
        if (name === '10035') {
          return Promise.resolve({ data: mockCharizardMegaYFormData })
        }
        return Promise.resolve({ data: mockPokemonData })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  afterEach(async () => {
    cleanup()
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  it('should not render when isOpen is false', () => {
    renderWithProvider(
      <PokemonModal isOpen={false} onClose={vi.fn()} {...mockPokemonData} />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render modal with pokemon details when isOpen is true', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Charizard')).toBeInTheDocument()
    expect(screen.getByText('#6')).toBeInTheDocument()
    expect(screen.getByText('Abilities')).toBeInTheDocument()
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
  })

  it('should display abilities correctly', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    expect(screen.getByText('blaze')).toBeInTheDocument()
    expect(screen.getByText('solar-power')).toBeInTheDocument()
    expect(screen.getByText('Hidden Abilities')).toBeInTheDocument()
  })

  it('should display stats with correct values', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: { varieties: [] } })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /base stats/i })
      ).toBeInTheDocument()
    })

    const statsContainer = screen.getByText(/HP:/).closest('.stats-container')
    expect(statsContainer).toBeInTheDocument()
    expect(statsContainer).toHaveTextContent('HP:')
    expect(statsContainer).toHaveTextContent('Attack:')
    expect(statsContainer).toHaveTextContent('Defense:')
  })

  it('should close modal when close button is clicked', async () => {
    const onClose = vi.fn()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={onClose} {...mockPokemonData} />
    )

    const closeButton = screen.getByRole('button', { name: /close modal/i })
    await userEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should close modal when overlay is clicked', async () => {
    const onClose = vi.fn()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={onClose} {...mockPokemonData} />
    )

    const overlay = screen.getByRole('dialog')
    await userEvent.click(overlay)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not close modal when content is clicked', async () => {
    const onClose = vi.fn()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={onClose} {...mockPokemonData} />
    )

    const modalContent = screen.getByText('Charizard')
    await userEvent.click(modalContent)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('should close modal when Escape key is pressed', async () => {
    const onClose = vi.fn()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={onClose} {...mockPokemonData} />
    )

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should fetch and display alternate forms', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      const charizardElements = screen.getAllByText('Charizard')
      expect(charizardElements.length).toBeGreaterThan(0)
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
      expect(screen.getByText('Charizard Mega Y')).toBeInTheDocument()
    })
  })

  it('should not display forms section for pokemon with only one form', async () => {
    const singleFormSpeciesData = {
      varieties: [
        {
          is_default: true,
          pokemon: {
            name: 'charizard',
            url: 'https://pokeapi.co/api/v2/pokemon/6/',
          },
        },
      ],
    }

    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: singleFormSpeciesData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.queryByText('Alternative Forms')).not.toBeInTheDocument()
    })
  })

  it('should switch forms when form button is clicked', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })

    const megaXButton = screen.getByRole('button', {
      name: /switch to charizard mega x/i,
    })
    await userEvent.click(megaXButton)

    await waitFor(() => {
      const modalImages = screen.getAllByAltText(
        'charizard'
      ) as HTMLImageElement[]
      const mainModalImage = modalImages.find(img =>
        img.className.includes('modal-image')
      )
      expect(mainModalImage?.src).toContain('charizard-mega-x-home.png')
    })
  })

  it('should update types when switching forms', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })

    expect(screen.getByText('Flying')).toBeInTheDocument()

    const megaXButton = screen.getByRole('button', {
      name: /switch to charizard mega x/i,
    })
    await userEvent.click(megaXButton)

    await waitFor(() => {
      expect(screen.getByText('Dragon')).toBeInTheDocument()
    })
  })

  it('should eventually display forms after loading', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })
  })

  it('should handle forms fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockAxiosGet = vi
      .fn()
      .mockRejectedValue(new Error('Failed to fetch forms'))
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    expect(screen.queryByText('Alternative Forms')).not.toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should mark the first form as active by default', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      const charizardButton = screen.getByRole('button', {
        name: /switch to charizard$/i,
      })
      expect(charizardButton).toHaveClass('active')
    })
  })

  it('should update stats when switching forms', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })

    const statsContainer = screen.getByText('Base Stats').nextElementSibling
    expect(statsContainer).toHaveTextContent('84')

    const megaXButton = screen.getByRole('button', {
      name: /switch to charizard mega x/i,
    })
    await userEvent.click(megaXButton)

    await waitFor(() => {
      const updatedStatsContainer =
        screen.getByText('Base Stats').nextElementSibling
      expect(updatedStatsContainer).toHaveTextContent('130')
    })
  })

  it('should have aria-pressed attribute on form buttons', async () => {
    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('10034')) {
        return Promise.resolve({ data: mockCharizardMegaXFormData })
      }
      if (url.includes('10035')) {
        return Promise.resolve({ data: mockCharizardMegaYFormData })
      }
      return Promise.resolve({ data: mockCharizardFormData })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
    })

    await waitFor(() => {
      const charizardButton = screen.getByRole('button', {
        name: /switch to charizard$/i,
      })
      expect(charizardButton).toHaveAttribute('aria-pressed', 'true')
    })

    const megaXButton = screen.getByRole('button', {
      name: /switch to charizard mega x/i,
    })
    expect(megaXButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('should localize modal section titles when language changes', async () => {
    const user = userEvent.setup()
    localStorage.clear()

    renderWithProvider(
      <LanguageHarness>
        <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
      </LanguageHarness>
    )

    expect(screen.getByText('Abilities')).toBeInTheDocument()
    expect(screen.getByText('Hidden Abilities')).toBeInTheDocument()
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()

    await user.click(screen.getByText('to-fr'))

    expect(screen.getByText('Talents')).toBeInTheDocument()
    expect(screen.getByText('Talents cachés')).toBeInTheDocument()
    expect(screen.getByText('Stats de base')).toBeInTheDocument()
    expect(screen.getByLabelText('Fermer la fenêtre')).toBeInTheDocument()
    expect(screen.queryByText('Abilities')).not.toBeInTheDocument()
  })

  it('should localize alternative form names from the API with English fallback', async () => {
    const user = userEvent.setup()
    localStorage.clear()

    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      if (url.includes('pokemon-form/10034')) {
        return Promise.resolve({
          data: {
            names: [
              { language: { name: 'en' }, name: 'Mega Charizard X' },
              { language: { name: 'fr' }, name: 'Méga-Dracaufeu X' },
            ],
            form_names: [
              { language: { name: 'en' }, name: 'Mega Charizard X' },
              { language: { name: 'ja' }, name: 'メガリザードンＸ' },
              { language: { name: 'fr' }, name: 'Méga-Dracaufeu X' },
            ],
          },
        })
      }
      if (url.includes('pokemon-form/')) {
        return Promise.resolve({ data: { names: [], form_names: [] } })
      }
      if (url.includes('10034')) {
        return Promise.resolve({
          data: {
            ...mockCharizardMegaXFormData,
            forms: [
              {
                name: 'charizard-mega-x',
                url: 'https://pokeapi.co/api/v2/pokemon-form/10034/',
              },
            ],
          },
        })
      }
      if (url.includes('10035')) {
        return Promise.resolve({
          data: {
            ...mockCharizardMegaYFormData,
            forms: [
              {
                name: 'charizard-mega-y',
                url: 'https://pokeapi.co/api/v2/pokemon-form/10035/',
              },
            ],
          },
        })
      }
      return Promise.resolve({
        data: {
          ...mockCharizardFormData,
          forms: [
            {
              name: 'charizard',
              url: 'https://pokeapi.co/api/v2/pokemon-form/6/',
            },
          ],
        },
      })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <LanguageHarness>
        <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
      </LanguageHarness>
    )

    await waitFor(() => {
      expect(screen.getByText('Alternative Forms')).toBeInTheDocument()
      expect(screen.getByText('Mega Charizard X')).toBeInTheDocument()
      expect(screen.getByText('Charizard Mega Y')).toBeInTheDocument()
    })

    await user.click(screen.getByText('to-ja'))

    await waitFor(() => {
      expect(screen.getByText('別の姿')).toBeInTheDocument()
      expect(screen.getByText('メガリザードンＸ')).toBeInTheDocument()
      expect(screen.getByText('Charizard Mega Y')).toBeInTheDocument()
    })
  })
})
