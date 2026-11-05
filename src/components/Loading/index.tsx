import './styles.scss'
import { useLanguage } from '../../contexts/LanguageContext'

interface LoadingProps {
  variant?: 'full' | 'inline'
  progress?: number
  message?: string
}

export function Loading({ variant = 'full', progress, message }: LoadingProps) {
  const { t } = useLanguage()
  const defaultMessage = variant === 'inline' ? t('loadingMore') : t('loading')
  const displayMessage = message === undefined ? defaultMessage : message

  if (variant === 'inline') {
    return (
      <div className="loading-inline">
        <div className="pokeball-spinner" aria-label={t('loading')}>
          <div className="pokeball-top"></div>
          <div className="pokeball-bottom"></div>
          <div className="pokeball-center"></div>
        </div>
        {displayMessage && (
          <span className="loading-message">{displayMessage}</span>
        )}
      </div>
    )
  }

  return (
    <div className="loading-container">
      <div className="pokeball-spinner" aria-label={t('loading')}>
        <div className="pokeball-top"></div>
        <div className="pokeball-bottom"></div>
        <div className="pokeball-center"></div>
      </div>
      <p className="loading-message">{displayMessage}</p>
      {typeof progress === 'number' && (
        <>
          <p className="loading-progress">{progress}%</p>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  )
}
