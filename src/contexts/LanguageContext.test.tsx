import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import {
  LanguageProvider,
  useLanguage,
  SUPPORTED_LANGUAGES,
} from './LanguageContext'

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('LanguageProvider', () => {
    it('should provide default language as en', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('en')
    })

    it('should load language from localStorage if available', () => {
      localStorage.setItem('pokedex-language', 'ja')

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('ja')
    })

    it('should use default language if localStorage has invalid value', () => {
      localStorage.setItem('pokedex-language', 'invalid-lang')

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('en')
    })

    it('should update language and persist to localStorage', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('fr')
      })

      expect(result.current.language).toBe('fr')
      expect(localStorage.getItem('pokedex-language')).toBe('fr')
    })
  })

  describe('getLocalizedName', () => {
    it('should return localized name for selected language', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('ja')
      })

      const names = [
        { language: { name: 'en' }, name: 'Pikachu' },
        { language: { name: 'ja' }, name: 'ピカチュウ' },
        { language: { name: 'fr' }, name: 'Pikachu' },
      ]

      const localizedName = result.current.getLocalizedName(names)
      expect(localizedName).toBe('ピカチュウ')
    })

    it('should fallback to en when selected language is not available', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('ko')
      })

      const names = [
        { language: { name: 'en' }, name: 'Pikachu' },
        { language: { name: 'ja' }, name: 'ピカチュウ' },
      ]

      const localizedName = result.current.getLocalizedName(names)
      expect(localizedName).toBe('Pikachu')
    })

    it('should return first name if neither selected nor en is available', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('ko')
      })

      const names = [
        { language: { name: 'ja' }, name: 'ピカチュウ' },
        { language: { name: 'fr' }, name: 'Pikachu' },
      ]

      const localizedName = result.current.getLocalizedName(names)
      expect(localizedName).toBe('ピカチュウ')
    })

    it('should return empty string for empty names array', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      const localizedName = result.current.getLocalizedName([])
      expect(localizedName).toBe('')
    })

    it('should match PokéAPI language codes case-insensitively', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('ja-hrkt')
      })

      const names = [
        { language: { name: 'en' }, name: 'Pikachu' },
        { language: { name: 'ja-Hrkt' }, name: 'ピカチュウ' },
      ]

      expect(result.current.getLocalizedName(names)).toBe('ピカチュウ')
    })

    it('should map ja-roma to PokéAPI roomaji names', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('ja-roma')
      })

      const names = [
        { language: { name: 'en' }, name: 'Pikachu' },
        { language: { name: 'roomaji' }, name: 'Pikachuu' },
      ]

      expect(result.current.getLocalizedName(names)).toBe('Pikachuu')
    })

    it('should use Spanish names for es-419 when es-419 is absent', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('es-419')
      })

      const names = [
        { language: { name: 'en' }, name: 'Pikachu' },
        { language: { name: 'es' }, name: 'Pikachu ES' },
      ]

      expect(result.current.getLocalizedName(names)).toBe('Pikachu ES')
    })
  })

  describe('t', () => {
    it('should return English UI strings by default', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.t('filters')).toBe('Filters')
      expect(result.current.t('alternativeForms')).toBe('Alternative Forms')
    })

    it('should switch UI strings when the language changes', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('ja')
      })

      expect(result.current.t('filters')).toBe('フィルター')
      expect(result.current.t('alternativeForms')).toBe('別の姿')
      expect(result.current.t('abilities')).toBe('特性')
    })

    it('should interpolate values in translated strings', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('fr')
      })

      expect(result.current.t('showingResults', { shown: 3, total: 20 })).toBe(
        'Affichage de 3 sur 20 Pokémon'
      )
    })
  })

  describe('useLanguage hook', () => {
    it('should throw error when used outside LanguageProvider', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(() => {
        renderHook(() => useLanguage())
      }).toThrow('useLanguage must be used within a LanguageProvider')

      consoleError.mockRestore()
    })
  })

  describe('SUPPORTED_LANGUAGES', () => {
    it('should contain all required languages', () => {
      const requiredLanguages = [
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

      requiredLanguages.forEach(lang => {
        expect(SUPPORTED_LANGUAGES).toHaveProperty(lang)
      })
    })
  })
})
