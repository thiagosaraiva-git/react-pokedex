import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { getUiString, UiStringKey } from '../i18n/uiStrings'

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ja: '日本語',
  'ja-hrkt': '日本語 (ひらがな)',
  'ja-roma': '日本語 (Rōmaji)',
  ko: '한국어',
  'zh-hans': '简体中文',
  'zh-hant': '繁體中文',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  'es-419': 'Español (LA)',
  it: 'Italiano',
  cs: 'Čeština',
  'pt-br': 'Português (BR)',
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

const LANGUAGE_STORAGE_KEY = 'pokedex-language'
const DEFAULT_LANGUAGE: LanguageCode = 'en'

const API_LANGUAGE_ALIASES: Record<LanguageCode, string[]> = {
  en: ['en'],
  ja: ['ja'],
  'ja-hrkt': ['ja-hrkt'],
  'ja-roma': ['ja-roma', 'roomaji'],
  ko: ['ko'],
  'zh-hans': ['zh-hans'],
  'zh-hant': ['zh-hant'],
  fr: ['fr'],
  de: ['de'],
  es: ['es'],
  'es-419': ['es-419', 'es'],
  it: ['it'],
  cs: ['cs'],
  'pt-br': ['pt-br'],
}

const HTML_LANG: Record<LanguageCode, string> = {
  en: 'en',
  ja: 'ja',
  'ja-hrkt': 'ja',
  'ja-roma': 'ja',
  ko: 'ko',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
  fr: 'fr',
  de: 'de',
  es: 'es',
  'es-419': 'es-419',
  it: 'it',
  cs: 'cs',
  'pt-br': 'pt-BR',
}

export interface LocalizedApiName {
  language: { name: string }
  name: string
}

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  getLocalizedName: (names: LocalizedApiName[]) => string
  t: (key: UiStringKey, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

function getStoredLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && stored in SUPPORTED_LANGUAGES) {
      return stored as LanguageCode
    }
  } catch (error) {
    console.error(
      'Failed to read language preference from localStorage:',
      error
    )
  }
  return DEFAULT_LANGUAGE
}

function storeLanguage(lang: LanguageCode): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  } catch (error) {
    console.error('Failed to save language preference to localStorage:', error)
  }
}

function matchesApiLanguage(
  apiLanguageName: string,
  selected: LanguageCode
): boolean {
  return API_LANGUAGE_ALIASES[selected].includes(apiLanguageName.toLowerCase())
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(getStoredLanguage)

  useEffect(() => {
    storeLanguage(language)
    document.documentElement.lang = HTML_LANG[language]
  }, [language])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
  }

  const getLocalizedName = (names: LocalizedApiName[]): string => {
    if (!names || names.length === 0) return ''

    const localizedName = names.find(n =>
      matchesApiLanguage(n.language.name, language)
    )
    if (localizedName) return localizedName.name

    const englishName = names.find(n => n.language.name.toLowerCase() === 'en')
    return englishName?.name || names[0]?.name || ''
  }

  const t = (
    key: UiStringKey,
    params?: Record<string, string | number>
  ): string => {
    return getUiString(language, key, params)
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, getLocalizedName, t }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
