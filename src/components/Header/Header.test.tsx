import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from './index'
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext'
import userEvent from '@testing-library/user-event'

function LanguageHarness({ children }: { children: React.ReactNode }) {
  const { setLanguage } = useLanguage()
  return (
    <>
      <button type="button" onClick={() => setLanguage('ja')}>
        to-ja
      </button>
      {children}
    </>
  )
}

const renderHeader = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('Header', () => {
  it('should render the red nav chrome without the hero banner', () => {
    const { container } = renderHeader(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('pokedex-header')
    expect(header).not.toHaveClass('hero-banner')
    expect(container.querySelector('.hero-banner')).not.toBeInTheDocument()
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

    const hamburgerButton = screen.getByLabelText('Filters')
    expect(hamburgerButton).toBeInTheDocument()
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'filter-drawer')
  })

  it('should not render the hamburger menu button when onMenuClick is not provided', () => {
    renderHeader(<Header />)

    const hamburgerButton = screen.queryByLabelText('Filters')
    expect(hamburgerButton).not.toBeInTheDocument()
  })

  it('should call onMenuClick when hamburger button is clicked', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filters')
    fireEvent.click(hamburgerButton)

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1)
  })

  it('should render three hamburger lines', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filters')
    const hamburgerLines = hamburgerButton.querySelectorAll('.hamburger-line')

    expect(hamburgerLines).toHaveLength(3)
  })

  it('should render the language selector', () => {
    renderHeader(<Header />)

    expect(screen.getByLabelText('Select language')).toBeInTheDocument()
  })

  it('should have proper ARIA attributes for accessibility', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader(<Header onMenuClick={mockOnMenuClick} />)

    const hamburgerButton = screen.getByLabelText('Filters')
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Filters')
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'filter-drawer')
  })

  it('should localize the hamburger label when language changes', async () => {
    const user = userEvent.setup()
    const mockOnMenuClick = vi.fn()
    renderHeader(
      <LanguageHarness>
        <Header onMenuClick={mockOnMenuClick} />
      </LanguageHarness>
    )

    expect(screen.getByLabelText('Filters')).toBeInTheDocument()
    expect(screen.getByLabelText('Select language')).toBeInTheDocument()

    await user.click(screen.getByText('to-ja'))

    expect(screen.getByLabelText('フィルター')).toBeInTheDocument()
    expect(screen.getByLabelText('言語を選択')).toBeInTheDocument()
  })
})
