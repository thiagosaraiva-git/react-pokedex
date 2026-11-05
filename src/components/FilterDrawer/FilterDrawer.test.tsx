import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterDrawer } from './index'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  LanguageProvider,
  useLanguage,
  LanguageCode,
} from '../../contexts/LanguageContext'

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
      <button
        type="button"
        onClick={() => setLanguage('pt-br' as LanguageCode)}
      >
        to-pt-br
      </button>
      {children}
    </>
  )
}

describe('FilterDrawer', () => {
  const mockOnClose = vi.fn()
  const mockOnNameFilterChange = vi.fn()
  const mockOnGenerationFilterChange = vi.fn()
  const mockOnTypeFilter1Change = vi.fn()
  const mockOnTypeFilter2Change = vi.fn()
  const mockOnResetFilters = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    nameFilter: '',
    generationFilter: 'all',
    typeFilter1: 'all',
    typeFilter2: 'all',
    onNameFilterChange: mockOnNameFilterChange,
    onGenerationFilterChange: mockOnGenerationFilterChange,
    onTypeFilter1Change: mockOnTypeFilter1Change,
    onTypeFilter2Change: mockOnTypeFilter2Change,
    onResetFilters: mockOnResetFilters,
    hasActiveFilters: false,
  }

  const renderDrawer = (
    props: Partial<typeof defaultProps> = {},
    withSwitcher = false
  ) => {
    const ui = <FilterDrawer {...defaultProps} {...props} />
    return render(
      <LanguageProvider>
        {withSwitcher ? <LanguageHarness>{ui}</LanguageHarness> : ui}
      </LanguageProvider>
    )
  }

  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render when open', () => {
    renderDrawer()
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    renderDrawer({ isOpen: false })
    expect(screen.queryByText('Filters')).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    renderDrawer()
    const closeButton = screen.getByLabelText('Close filters')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    renderDrawer()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should update name filter when input changes', () => {
    renderDrawer()
    const nameInput = screen.getByLabelText('Search by name')
    fireEvent.change(nameInput, { target: { value: 'pikachu' } })
    expect(mockOnNameFilterChange).toHaveBeenCalledWith('pikachu')
  })

  it('should update generation filter when select changes', () => {
    renderDrawer()
    const generationSelect = screen.getByLabelText('Generation')
    fireEvent.change(generationSelect, { target: { value: 'gen1' } })
    expect(mockOnGenerationFilterChange).toHaveBeenCalledWith('gen1')
  })

  it('should update type1 filter when select changes', () => {
    renderDrawer()
    const type1Select = screen.getByLabelText('Type 1')
    fireEvent.change(type1Select, { target: { value: 'fire' } })
    expect(mockOnTypeFilter1Change).toHaveBeenCalledWith('fire')
  })

  it('should update type2 filter when select changes', () => {
    renderDrawer()
    const type2Select = screen.getByLabelText('Type 2')
    fireEvent.change(type2Select, { target: { value: 'water' } })
    expect(mockOnTypeFilter2Change).toHaveBeenCalledWith('water')
  })

  it('should call onResetFilters and onClose when clear button is clicked', () => {
    renderDrawer({ hasActiveFilters: true })
    const clearButton = screen.getByText('Clear filter')
    fireEvent.click(clearButton)
    expect(mockOnResetFilters).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should have proper accessibility attributes', () => {
    renderDrawer()
    const drawer = screen.getByRole('dialog')
    expect(drawer).toHaveAttribute('aria-modal', 'true')
    expect(drawer).toHaveAttribute('aria-labelledby', 'drawer-title')
  })

  it('should display all filter labels', () => {
    renderDrawer()
    expect(screen.getByText('Search by name')).toBeInTheDocument()
    expect(screen.getByText('Generation')).toBeInTheDocument()
    expect(screen.getByText('Type 1')).toBeInTheDocument()
    expect(screen.getByText('Type 2')).toBeInTheDocument()
  })

  it('should reflect current filter values', () => {
    renderDrawer({
      nameFilter: 'charizard',
      generationFilter: 'gen2',
      typeFilter1: 'fire',
      typeFilter2: 'flying',
      hasActiveFilters: true,
    })

    const nameInput = screen.getByLabelText(
      'Search by name'
    ) as HTMLInputElement
    const generationSelect = screen.getByLabelText(
      'Generation'
    ) as HTMLSelectElement
    const type1Select = screen.getByLabelText('Type 1') as HTMLSelectElement
    const type2Select = screen.getByLabelText('Type 2') as HTMLSelectElement

    expect(nameInput.value).toBe('charizard')
    expect(generationSelect.value).toBe('gen2')
    expect(type1Select.value).toBe('fire')
    expect(type2Select.value).toBe('flying')
  })

  it('should disable clear button when no filters are active', () => {
    renderDrawer({ hasActiveFilters: false })
    const clearButton = screen.getByLabelText('Clear filter')
    expect(clearButton).toBeDisabled()
  })

  it('should enable clear button when filters are active', () => {
    renderDrawer({ hasActiveFilters: true })
    const clearButton = screen.getByLabelText('Clear filter')
    expect(clearButton).toBeEnabled()
  })

  it('should not call onResetFilters when clear button is clicked while disabled', () => {
    renderDrawer({ hasActiveFilters: false })
    const clearButton = screen.getByLabelText('Clear filter')
    fireEvent.click(clearButton)
    expect(mockOnResetFilters).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should localize filter labels and type options when language changes', async () => {
    const user = userEvent.setup()
    renderDrawer({}, true)

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getAllByText('Fire').length).toBeGreaterThan(0)
    expect(screen.getByText('National Dex (All Gen)')).toBeInTheDocument()

    await user.click(screen.getByText('to-fr'))

    expect(screen.getByText('Filtres')).toBeInTheDocument()
    expect(screen.getByText('Recherche par nom')).toBeInTheDocument()
    expect(screen.getByText('Génération')).toBeInTheDocument()
    expect(screen.getByText('Type 1')).toBeInTheDocument()
    expect(screen.getAllByText('Feu').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Eau').length).toBeGreaterThan(0)
    expect(screen.getByText('Dex National (toutes gén.)')).toBeInTheDocument()
    expect(screen.getByText('Effacer le filtre')).toBeInTheDocument()
    expect(screen.queryByText('Filters')).not.toBeInTheDocument()
  })

  it('should localize filter chrome into Japanese without remounting', async () => {
    const user = userEvent.setup()
    renderDrawer({}, true)

    await user.click(screen.getByText('to-ja'))

    expect(screen.getByText('フィルター')).toBeInTheDocument()
    expect(screen.getByText('名前で検索')).toBeInTheDocument()
    expect(screen.getAllByText('ほのお').length).toBeGreaterThan(0)
    expect(screen.getByText('フィルターをクリア')).toBeInTheDocument()
  })
})
