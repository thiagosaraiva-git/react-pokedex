import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from './index'
import { LanguageProvider } from '../../contexts/LanguageContext'

const renderHeader = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('Header', () => {
  it('should render the hero banner', () => {
    renderHeader(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('hero-banner')
  })

  it('should render the Pokémon logo', () => {
    renderHeader(<Header />)

    const logo = screen.getByAltText('Pokémon Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute(
      'src',
      'https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo-8.png'
    )
  })

  it('should render the hamburger menu button when onMenuClick is provided', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filtros')
    expect(hamburgerButton).toBeInTheDocument()
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'filter-drawer')
  })

  it('should not render the hamburger menu button when onMenuClick is not provided', () => {
    renderHeader(<Header />)

    const hamburgerButton = screen.queryByLabelText('Filtros')
    expect(hamburgerButton).not.toBeInTheDocument()
  })

  it('should call onMenuClick when hamburger button is clicked', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filtros')
    fireEvent.click(hamburgerButton)

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1)
  })

  it('should render three hamburger lines', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filtros')
    const hamburgerLines = hamburgerButton.querySelectorAll('.hamburger-line')

    expect(hamburgerLines).toHaveLength(3)
  })

  it('should have proper hero structure with background and content', () => {
    const { container } = renderHeader(<Header />)

    const heroBackground = container.querySelector('.hero-background')
    const heroContent = container.querySelector('.hero-content')
    const heroImage = container.querySelector('.hero-background-image')

    expect(heroBackground).toBeInTheDocument()
    expect(heroContent).toBeInTheDocument()
    expect(heroImage).toBeInTheDocument()
    expect(heroImage).toHaveAttribute('src')
    expect(heroImage).toHaveAttribute('alt', '')
  })

  it('should render the language selector', () => {
    renderHeader(<Header />)

    expect(screen.getByLabelText('Select language')).toBeInTheDocument()
  })

  it('should have proper ARIA attributes for accessibility', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filtros')
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Filtros')
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'filter-drawer')
  })
})
