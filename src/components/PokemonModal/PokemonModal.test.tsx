import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonModal } from './index'
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext'
import axios from 'axios'

vi.mock('axios')

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

function mockPrefersReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
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
    mockPrefersReducedMotion(false)
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
    vi.useRealTimers()
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

    expect(screen.getByText('Blaze')).toBeInTheDocument()
    expect(screen.getByText('Solar Power')).toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  it('should render hidden abilities with a star badge and Hidden heading', () => {
    const { container } = renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    const hiddenList = container.querySelector('.abilities-list.hidden')
    const badge = container.querySelector('.hidden-ability-badge')
    const commonList = container.querySelector('.abilities-list:not(.hidden)')

    expect(screen.getByText('Hidden')).toBeInTheDocument()
    expect(hiddenList).toBeInTheDocument()
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('★')
    expect(commonList?.textContent).toContain('Blaze')
    expect(commonList?.querySelector('.hidden-ability-badge')).toBeNull()
  })

  it('should omit the hidden ability block when the Pokemon has none', () => {
    const noHidden = {
      ...mockPokemonData,
      abilities: [{ ability: { name: 'blaze' }, is_hidden: false }],
    }
    const { container } = renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...noHidden} />
    )

    expect(screen.getByText('Blaze')).toBeInTheDocument()
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    expect(container.querySelector('.abilities-list.hidden')).toBeNull()
    expect(container.querySelector('.hidden-ability-badge')).toBeNull()
    expect(screen.getByText('Abilities')).toBeInTheDocument()
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
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
    expect(screen.getByText('Hidden')).toBeInTheDocument()
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()

    await user.click(screen.getByText('to-fr'))

    expect(screen.getByText('Talents')).toBeInTheDocument()
    expect(screen.getByText('Caché')).toBeInTheDocument()
    expect(screen.getByText('Stats de base')).toBeInTheDocument()
    expect(screen.getByLabelText('Fermer la fenêtre')).toBeInTheDocument()
    expect(screen.queryByText('Abilities')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()

    await user.click(screen.getByText('to-ja'))

    expect(screen.getByText('特性')).toBeInTheDocument()
    expect(screen.getByText('隠れ')).toBeInTheDocument()
    expect(screen.queryByText('Caché')).not.toBeInTheDocument()
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

  it('should localize the default form chip from species names', async () => {
    const user = userEvent.setup()
    localStorage.clear()

    const speciesWithNames = {
      ...mockSpeciesData,
      names: [
        { language: { name: 'en' }, name: 'Venusaur' },
        { language: { name: 'ja' }, name: 'フシギバナ' },
      ],
      varieties: [
        {
          is_default: true,
          pokemon: {
            name: 'venusaur',
            url: 'https://pokeapi.co/api/v2/pokemon/3/',
          },
        },
        {
          is_default: false,
          pokemon: {
            name: 'venusaur-mega',
            url: 'https://pokeapi.co/api/v2/pokemon/10033/',
          },
        },
      ],
    }

    const venusaurForm = {
      name: 'venusaur',
      sprites: {
        front_default: 'https://example.com/venusaur.png',
        other: { home: { front_default: 'https://example.com/venusaur.png' } },
      },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: mockPokemonData.stats,
      forms: [
        {
          name: 'venusaur',
          url: 'https://pokeapi.co/api/v2/pokemon-form/3/',
        },
      ],
    }

    const venusaurMegaForm = {
      name: 'venusaur-mega',
      sprites: {
        front_default: 'https://example.com/venusaur-mega.png',
        other: {
          home: { front_default: 'https://example.com/venusaur-mega.png' },
        },
      },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: mockPokemonData.stats,
      forms: [
        {
          name: 'venusaur-mega',
          url: 'https://pokeapi.co/api/v2/pokemon-form/10033/',
        },
      ],
    }

    const mockAxiosGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: speciesWithNames })
      }
      if (url.includes('pokemon-form/10033')) {
        return Promise.resolve({
          data: {
            names: [],
            form_names: [
              { language: { name: 'en' }, name: 'Mega Venusaur' },
              { language: { name: 'ja' }, name: 'メガフシギバナ' },
            ],
          },
        })
      }
      if (url.includes('pokemon-form/')) {
        return Promise.resolve({ data: { names: [], form_names: [] } })
      }
      if (url.includes('10033')) {
        return Promise.resolve({ data: venusaurMegaForm })
      }
      return Promise.resolve({ data: venusaurForm })
    })
    ;(axios.get as any) = mockAxiosGet

    renderWithProvider(
      <LanguageHarness>
        <PokemonModal
          isOpen={true}
          onClose={vi.fn()}
          {...mockPokemonData}
          id={3}
          name="venusaur"
        />
      </LanguageHarness>
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /switch to venusaur$/i })
      ).toBeInTheDocument()
      expect(screen.getByText('Mega Venusaur')).toBeInTheDocument()
    })

    await user.click(screen.getByText('to-ja'))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'フシギバナに切り替え' })
      ).toBeInTheDocument()
      expect(screen.getByText('メガフシギバナ')).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /switch to venusaur$/i })
      ).not.toBeInTheDocument()
    })
  })

  it('should animate stat bars from 0 to base_stat when the modal opens', () => {
    mockPrefersReducedMotion(false)
    vi.useFakeTimers()

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    const bars = screen.getAllByRole('progressbar')
    expect(bars[0]).toHaveAttribute('value', '0')
    expect(bars[0]).not.toHaveClass('animating')
    expect(bars[0].parentElement).toHaveClass('stat-bar')
    expect(bars[0].parentElement).not.toHaveClass('is-filling')
    expect(bars[0].parentElement).toHaveStyle({ '--stat-progress': '0%' })

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(bars[0]).toHaveAttribute('value', '78')
    expect(bars[0]).toHaveClass('animating')
    expect(bars[0].parentElement).toHaveClass('is-filling')
    expect(bars[0].parentElement).toHaveStyle({
      '--stat-progress': `${(78 / 255) * 100}%`,
    })
    expect(bars[1]).toHaveAttribute('value', '84')
    expect(bars[1].parentElement).toHaveStyle({
      '--stat-progress': `${(84 / 255) * 100}%`,
    })

    vi.useRealTimers()
  })

  it('should show final stat values immediately when prefers-reduced-motion is set', () => {
    mockPrefersReducedMotion(true)

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    const bars = screen.getAllByRole('progressbar')
    expect(bars[0]).toHaveAttribute('value', '78')
    expect(bars[1]).toHaveAttribute('value', '84')
    expect(bars[5]).toHaveAttribute('value', '100')
    expect(bars[0]).toHaveClass('animating')
    expect(bars[0].parentElement).toHaveClass('is-filling')
    expect(bars[0].parentElement).toHaveStyle({
      '--stat-progress': `${(78 / 255) * 100}%`,
    })
  })

  it('should keep final stat values when switching forms with reduced motion', async () => {
    mockPrefersReducedMotion(true)

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
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })

    const megaXButton = screen.getByRole('button', {
      name: /switch to charizard mega x/i,
    })
    await userEvent.click(megaXButton)

    const bars = screen.getAllByRole('progressbar')
    expect(bars[1]).toHaveAttribute('value', '130')
    expect(bars[1]).toHaveClass('animating')
    expect(bars[1].parentElement).toHaveClass('is-filling')
    expect(bars[1].parentElement).toHaveStyle({
      '--stat-progress': `${(130 / 255) * 100}%`,
    })
  })

  it('should replay the stat bar fill animation when switching forms', async () => {
    mockPrefersReducedMotion(false)

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
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })

    await waitFor(() => {
      const openedBars = screen.getAllByRole('progressbar')
      expect(openedBars[1]).toHaveAttribute('value', '84')
      expect(openedBars[1]).toHaveClass('animating')
    })

    const megaXButton = screen.getByRole('button', {
      name: /switch to charizard mega x/i,
    })
    await userEvent.click(megaXButton)

    const resetBars = screen.getAllByRole('progressbar')
    expect(resetBars[1]).toHaveAttribute('value', '0')
    expect(resetBars[1]).not.toHaveClass('animating')
    expect(resetBars[1].parentElement).not.toHaveClass('is-filling')
    expect(resetBars[1].parentElement).toHaveStyle({ '--stat-progress': '0%' })

    await waitFor(() => {
      const filledBars = screen.getAllByRole('progressbar')
      expect(filledBars[1]).toHaveAttribute('value', '130')
      expect(filledBars[1]).toHaveClass('animating')
      expect(filledBars[1].parentElement).toHaveClass('is-filling')
    })
  })

  it('should paint a dual-type gradient behind the sprite using type color classes', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...mockPokemonData} />
    )

    const spriteSection = document.querySelector('.modal-sprite-section')
    const gradient = spriteSection?.querySelector('.modal-sprite-gradient')
    expect(gradient).toBeInTheDocument()
    expect(gradient).toHaveAttribute('data-types', 'fire flying')
    expect(gradient?.querySelectorAll('.modal-sprite-tone')).toHaveLength(2)
    expect(gradient?.querySelector('.fire')).toBeInTheDocument()
    expect(gradient?.querySelector('.flying')).toBeInTheDocument()
    expect(
      document.querySelector('.modal-content > .modal-sprite-gradient')
    ).not.toBeInTheDocument()
  })

  it('should paint a single-type gradient behind the sprite', () => {
    const singleTypePokemon = {
      ...mockPokemonData,
      types: [{ type: { name: 'electric' } }],
    }

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={vi.fn()} {...singleTypePokemon} />
    )

    const gradient = document.querySelector('.modal-sprite-gradient')
    expect(gradient).toHaveAttribute('data-types', 'electric')
    expect(gradient?.querySelectorAll('.modal-sprite-tone')).toHaveLength(1)
    expect(gradient?.querySelector('.electric')).toBeInTheDocument()
    expect(gradient?.querySelector('.flying')).not.toBeInTheDocument()
  })

  it('should update the sprite gradient types when switching forms', async () => {
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
      expect(screen.getByText('Charizard Mega X')).toBeInTheDocument()
    })

    expect(document.querySelector('.modal-sprite-gradient')).toHaveAttribute(
      'data-types',
      'fire flying'
    )

    await userEvent.click(
      screen.getByRole('button', { name: /switch to charizard mega x/i })
    )

    await waitFor(() => {
      const gradient = document.querySelector('.modal-sprite-gradient')
      expect(gradient).toHaveAttribute('data-types', 'fire dragon')
      expect(gradient?.querySelector('.dragon')).toBeInTheDocument()
      expect(gradient?.querySelector('.flying')).not.toBeInTheDocument()
    })
  })
})
