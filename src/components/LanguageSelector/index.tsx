import './styles.scss'
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
  LanguageCode,
} from '../../contexts/LanguageContext'

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode)
  }

  return (
    <div className="language-selector">
      <select
        value={language}
        onChange={handleChange}
        aria-label={t('selectLanguage')}
        className="language-select"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
