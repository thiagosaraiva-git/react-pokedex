import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PokemonModal } from '../src/components/PokemonModal'
import { LanguageProvider } from '../src/contexts/LanguageContext'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('PokemonModal', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    sprite: 'https://example.com/pikachu.png',
    types: [{ type: { name: 'electric' } }],
    abilities: [
      { ability: { name: 'static' }, is_hidden: false },
      { ability: { name: 'lightning-rod' }, is_hidden: true },
    ],
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
      { base_stat: 40, stat: { name: 'defense' } },
      { base_stat: 50, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } },
    ],
  }

  const mockOnClose = vi.fn()

  it('should not render when isOpen is false', () => {
    const { container } = renderWithProvider(
      <PokemonModal isOpen={false} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(container.querySelector('.modal-overlay')).toBeNull()
  })

  it('should render with Pokemon details when isOpen is true', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display Pokemon name, id, and types', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('#25')).toBeInTheDocument()
    expect(screen.getByText('Electric')).toBeInTheDocument()
  })

  it('should separate normal and hidden abilities', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByText('Static')).toBeInTheDocument()
    expect(screen.getByText('Lightning Rod')).toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('should display base stats', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByText('Base Stats')).toBeInTheDocument()
    expect(screen.getByText(/^HP:/)).toBeInTheDocument()
    expect(screen.getByText(/^Attack:/)).toBeInTheDocument()
  })

  it('should have proper ARIA attributes', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('should call onClose when overlay is clicked', () => {
    mockOnClose.mockClear()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const overlay = screen.getByRole('dialog')
    fireEvent.click(overlay)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button is clicked', () => {
    mockOnClose.mockClear()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    mockOnClose.mockClear()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle Pokemon with multiple types', () => {
    const dualTypePokemon = {
      ...mockPokemon,
      types: [{ type: { name: 'water' } }, { type: { name: 'flying' } }],
    }

    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...dualTypePokemon} />
    )

    expect(screen.getByText('Water')).toBeInTheDocument()
    expect(screen.getByText('Flying')).toBeInTheDocument()

    const gradient = document.querySelector('.modal-sprite-gradient')
    expect(gradient).toHaveAttribute('data-types', 'water flying')
    expect(gradient?.querySelector('.water')).toBeInTheDocument()
    expect(gradient?.querySelector('.flying')).toBeInTheDocument()
  })

  it('should handle Pokemon with no hidden abilities', () => {
    const noHiddenAbilities = {
      ...mockPokemon,
      abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
    }

    const { container } = renderWithProvider(
      <PokemonModal
        isOpen={true}
        onClose={mockOnClose}
        {...noHiddenAbilities}
      />
    )

    expect(screen.getByText('Overgrow')).toBeInTheDocument()
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    expect(container.querySelector('.hidden-ability-badge')).toBeNull()
    expect(container.querySelector('.abilities-list.hidden')).toBeNull()
    expect(screen.getByText('Abilities')).toBeInTheDocument()
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
  })

  it('should display image with proper alt text', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const image = screen.getByAltText('pikachu')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockPokemon.sprite)
  })

  it('should paint the sprite area with the pokemon type color', () => {
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const gradient = document.querySelector('.modal-sprite-gradient')
    expect(gradient).toHaveAttribute('data-types', 'electric')
    expect(gradient?.querySelector('.electric')).toBeInTheDocument()
    expect(gradient?.querySelectorAll('.modal-sprite-tone')).toHaveLength(1)
  })

  it('should not propagate click from modal content to overlay', () => {
    mockOnClose.mockClear()
    renderWithProvider(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const modalContent = screen.getByRole('dialog').firstElementChild
    if (modalContent) {
      fireEvent.click(modalContent)
      expect(mockOnClose).not.toHaveBeenCalled()
    }
  })

  it('should restore focus to previously focused element when closed', () => {
    const { rerender } = renderWithProvider(
      <>
        <button data-testid="opener">Open Modal</button>
        <PokemonModal isOpen={false} onClose={mockOnClose} {...mockPokemon} />
      </>
    )

    const openerButton = screen.getByTestId('opener')
    openerButton.focus()
    expect(document.activeElement).toBe(openerButton)

    rerender(
      <LanguageProvider>
        <button data-testid="opener">Open Modal</button>
        <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
      </LanguageProvider>
    )

    expect(document.activeElement).not.toBe(openerButton)

    rerender(
      <LanguageProvider>
        <button data-testid="opener">Open Modal</button>
        <PokemonModal isOpen={false} onClose={mockOnClose} {...mockPokemon} />
      </LanguageProvider>
    )

    expect(document.activeElement).toBe(openerButton)
  })
})
