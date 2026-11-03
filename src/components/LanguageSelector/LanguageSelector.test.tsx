import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSelector } from './index'
import { LanguageProvider } from '../../contexts/LanguageContext'

describe('LanguageSelector', () => {
  const renderWithProvider = () => {
    return render(
      <LanguageProvider>
        <LanguageSelector />
      </LanguageProvider>
    )
  }

  it('should render language selector with default value', () => {
    renderWithProvider()
    const select = screen.getByRole('combobox', { name: /select language/i })
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('en')
  })

  it('should render all supported languages as options', () => {
    renderWithProvider()
    const select = screen.getByRole('combobox', { name: /select language/i })

    const options = Array.from(select.querySelectorAll('option'))
    const expectedLanguages = [
      'en',
      'ja',
      'ja-hrkt',
      'ja-roma',
      'ko',
      'zh-hans',
      'zh-hant',
      'fr',
      'de',
      'es',
      'es-419',
      'it',
      'cs',
      'pt-br',
    ]

    expect(options).toHaveLength(expectedLanguages.length)
    expectedLanguages.forEach(lang => {
      expect(options.find(opt => opt.value === lang)).toBeDefined()
    })
  })

  it('should change language when selecting an option', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const select = screen.getByRole('combobox', { name: /select language/i })

    await user.selectOptions(select, 'ja')
    expect(select).toHaveValue('ja')

    await user.selectOptions(select, 'fr')
    expect(select).toHaveValue('fr')
  })

  it('should persist language selection to localStorage', async () => {
    const user = userEvent.setup()
    localStorage.clear()

    renderWithProvider()
    const select = screen.getByRole('combobox', { name: /select language/i })

    await user.selectOptions(select, 'ja')
    expect(localStorage.getItem('pokedex-language')).toBe('ja')
  })

  it('should have accessible label', () => {
    renderWithProvider()
    const select = screen.getByRole('combobox', { name: /select language/i })
    expect(select).toHaveAccessibleName()
  })
})
