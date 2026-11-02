import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PokemonModal } from '../src/components/PokemonModal'

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
    const { container } = render(
      <PokemonModal isOpen={false} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render with Pokemon details when isOpen is true', () => {
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display Pokemon name, id, and types', () => {
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByText('pikachu')).toBeInTheDocument()
    expect(screen.getByText('#25')).toBeInTheDocument()
    expect(screen.getByText('electric')).toBeInTheDocument()
  })

  it('should separate normal and hidden abilities', () => {
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByText('static')).toBeInTheDocument()
    expect(screen.getByText('lightning-rod')).toBeInTheDocument()
    expect(screen.getByText('Hidden Abilities')).toBeInTheDocument()
  })

  it('should display base stats', () => {
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    expect(screen.getByText('Base Stats')).toBeInTheDocument()
    expect(screen.getByText(/^HP:/)).toBeInTheDocument()
    expect(screen.getByText(/^Attack:/)).toBeInTheDocument()
  })

  it('should have proper ARIA attributes', () => {
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('should call onClose when overlay is clicked', () => {
    mockOnClose.mockClear()
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const overlay = screen.getByRole('dialog')
    fireEvent.click(overlay)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button is clicked', () => {
    mockOnClose.mockClear()
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    mockOnClose.mockClear()
    render(
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

    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...dualTypePokemon} />
    )

    expect(screen.getByText('water')).toBeInTheDocument()
    expect(screen.getByText('flying')).toBeInTheDocument()
  })

  it('should handle Pokemon with no hidden abilities', () => {
    const noHiddenAbilities = {
      ...mockPokemon,
      abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
    }

    render(
      <PokemonModal
        isOpen={true}
        onClose={mockOnClose}
        {...noHiddenAbilities}
      />
    )

    expect(screen.getByText('overgrow')).toBeInTheDocument()
    expect(screen.queryByText('Hidden Abilities')).not.toBeInTheDocument()
  })

  it('should display image with proper alt text', () => {
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const image = screen.getByAltText('pikachu')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockPokemon.sprite)
  })

  it('should not propagate click from modal content to overlay', () => {
    mockOnClose.mockClear()
    render(
      <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
    )

    const modalContent = screen.getByRole('dialog').firstElementChild
    if (modalContent) {
      fireEvent.click(modalContent)
      expect(mockOnClose).not.toHaveBeenCalled()
    }
  })

  it('should restore focus to previously focused element when closed', () => {
    const { rerender } = render(
      <>
        <button data-testid="opener">Open Modal</button>
        <PokemonModal isOpen={false} onClose={mockOnClose} {...mockPokemon} />
      </>
    )

    const openerButton = screen.getByTestId('opener')
    openerButton.focus()
    expect(document.activeElement).toBe(openerButton)

    rerender(
      <>
        <button data-testid="opener">Open Modal</button>
        <PokemonModal isOpen={true} onClose={mockOnClose} {...mockPokemon} />
      </>
    )

    expect(document.activeElement).not.toBe(openerButton)

    rerender(
      <>
        <button data-testid="opener">Open Modal</button>
        <PokemonModal isOpen={false} onClose={mockOnClose} {...mockPokemon} />
      </>
    )

    expect(document.activeElement).toBe(openerButton)
  })
})
