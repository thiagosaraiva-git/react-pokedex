import { describe, it, expect } from 'vitest'
import {
  GENERATION_STRING_KEYS,
  getUiString,
  POKEMON_TYPES,
  TYPE_STRING_KEYS,
  UI_STRINGS,
  UiStringKey,
} from './uiStrings'
import { SUPPORTED_LANGUAGES } from '../contexts/LanguageContext'

const REQUIRED_KEYS: UiStringKey[] = [
  'filters',
  'closeFilters',
  'searchByName',
  'searchPlaceholder',
  'generation',
  'type1',
  'type2',
  'anyType',
  'clearFilter',
  'nationalDex',
  'alternativeForms',
  'abilities',
  'hiddenAbilities',
  'hidden',
  'baseStats',
  'emptyNoMatch',
  'loading',
]

describe('uiStrings', () => {
  it('should define translations for every supported language', () => {
    Object.keys(SUPPORTED_LANGUAGES).forEach(language => {
      expect(UI_STRINGS).toHaveProperty(language)
    })
  })

  it('should include the same keys for every language', () => {
    const englishKeys = Object.keys(UI_STRINGS.en).sort()

    Object.entries(UI_STRINGS).forEach(([, dictionary]) => {
      expect(Object.keys(dictionary).sort()).toEqual(englishKeys)
    })
  })

  it('should provide non-empty values for critical UI strings', () => {
    Object.values(UI_STRINGS).forEach(dictionary => {
      REQUIRED_KEYS.forEach(key => {
        expect(dictionary[key].length).toBeGreaterThan(0)
      })
    })
  })

  it('should translate the Hidden heading in every supported language', () => {
    expect(getUiString('en', 'hidden')).toBe('Hidden')
    expect(getUiString('ja', 'hidden')).toBe('隠れ')
    expect(getUiString('ja-hrkt', 'hidden')).toBe('かくれ')
    expect(getUiString('ja-roma', 'hidden')).toBe('Kakure')
    expect(getUiString('ko', 'hidden')).toBe('숨겨진')
    expect(getUiString('zh-hans', 'hidden')).toBe('隐藏')
    expect(getUiString('zh-hant', 'hidden')).toBe('隱藏')
    expect(getUiString('fr', 'hidden')).toBe('Caché')
    expect(getUiString('de', 'hidden')).toBe('Versteckt')
    expect(getUiString('es', 'hidden')).toBe('Oculta')
    expect(getUiString('es-419', 'hidden')).toBe('Oculta')
    expect(getUiString('it', 'hidden')).toBe('Nascosta')
    expect(getUiString('cs', 'hidden')).toBe('Skryté')
    expect(getUiString('pt-br', 'hidden')).toBe('Oculta')
  })

  it('should interpolate parameters in UI strings', () => {
    expect(
      getUiString('en', 'showingResults', { shown: 10, total: 1025 })
    ).toBe('Showing 10 of 1025 Pokémon')
    expect(
      getUiString('ja', 'switchToForm', { name: 'メガリザードンＸ' })
    ).toBe('メガリザードンＸに切り替え')
  })

  it('should fall back to English when a language is missing', () => {
    expect(getUiString('en', 'filters')).toBe('Filters')
    expect(getUiString('fr', 'filters')).toBe('Filtres')
  })

  it('should map every Pokémon type to a translation key', () => {
    POKEMON_TYPES.forEach(type => {
      expect(TYPE_STRING_KEYS[type]).toBeDefined()
      expect(getUiString('fr', TYPE_STRING_KEYS[type]).length).toBeGreaterThan(
        0
      )
    })
  })

  it('should map generation options to translation keys', () => {
    expect(getUiString('en', GENERATION_STRING_KEYS.all)).toBe(
      'National Dex (All Gen)'
    )
    expect(getUiString('ja', GENERATION_STRING_KEYS.gen1)).toBe(
      '第1世代 (1-151)'
    )
  })
})
