import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { FilterDrawer } from './index'
import { describe, it, expect, vi, beforeEach } from 'vitest'

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
  }

  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render when open', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    render(<FilterDrawer {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Filtros')).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(<FilterDrawer {...defaultProps} />)
    const closeButton = screen.getByLabelText('Fechar filtros')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    render(<FilterDrawer {...defaultProps} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should update name filter when input changes', () => {
    render(<FilterDrawer {...defaultProps} />)
    const nameInput = screen.getByLabelText('Busca por nome')
    fireEvent.change(nameInput, { target: { value: 'pikachu' } })
    expect(mockOnNameFilterChange).toHaveBeenCalledWith('pikachu')
  })

  it('should update generation filter when select changes', () => {
    render(<FilterDrawer {...defaultProps} />)
    const generationSelect = screen.getByLabelText('Geração')
    fireEvent.change(generationSelect, { target: { value: 'gen1' } })
    expect(mockOnGenerationFilterChange).toHaveBeenCalledWith('gen1')
  })

  it('should update type1 filter when select changes', () => {
    render(<FilterDrawer {...defaultProps} />)
    const type1Select = screen.getByLabelText('Tipo 1')
    fireEvent.change(type1Select, { target: { value: 'fire' } })
    expect(mockOnTypeFilter1Change).toHaveBeenCalledWith('fire')
  })

  it('should update type2 filter when select changes', () => {
    render(<FilterDrawer {...defaultProps} />)
    const type2Select = screen.getByLabelText('Tipo 2')
    fireEvent.change(type2Select, { target: { value: 'water' } })
    expect(mockOnTypeFilter2Change).toHaveBeenCalledWith('water')
  })

  it('should call onResetFilters and onClose when clear button is clicked', () => {
    render(<FilterDrawer {...defaultProps} />)
    const clearButton = screen.getByText('Limpar filtros')
    fireEvent.click(clearButton)
    expect(mockOnResetFilters).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should have proper accessibility attributes', () => {
    render(<FilterDrawer {...defaultProps} />)
    const drawer = screen.getByRole('dialog')
    expect(drawer).toHaveAttribute('aria-modal', 'true')
    expect(drawer).toHaveAttribute('aria-labelledby', 'drawer-title')
  })

  it('should display all filter labels', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByText('Busca por nome')).toBeInTheDocument()
    expect(screen.getByText('Geração')).toBeInTheDocument()
    expect(screen.getByText('Tipo 1')).toBeInTheDocument()
    expect(screen.getByText('Tipo 2')).toBeInTheDocument()
  })

  it('should reflect current filter values', () => {
    const propsWithFilters = {
      ...defaultProps,
      nameFilter: 'charizard',
      generationFilter: 'gen2',
      typeFilter1: 'fire',
      typeFilter2: 'flying',
    }
    render(<FilterDrawer {...propsWithFilters} />)

    const nameInput = screen.getByLabelText(
      'Busca por nome'
    ) as HTMLInputElement
    const generationSelect = screen.getByLabelText(
      'Geração'
    ) as HTMLSelectElement
    const type1Select = screen.getByLabelText('Tipo 1') as HTMLSelectElement
    const type2Select = screen.getByLabelText('Tipo 2') as HTMLSelectElement

    expect(nameInput.value).toBe('charizard')
    expect(generationSelect.value).toBe('gen2')
    expect(type1Select.value).toBe('fire')
    expect(type2Select.value).toBe('flying')
  })
})
