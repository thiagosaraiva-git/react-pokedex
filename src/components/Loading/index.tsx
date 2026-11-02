import './styles.scss'

interface LoadingProps {
  variant?: 'full' | 'inline'
  progress?: number
  message?: string
}

export function Loading({
  variant = 'full',
  progress,
  message = 'Carregando…',
}: LoadingProps) {
  if (variant === 'inline') {
    return (
      <div className="loading-inline">
        <div className="pokeball-spinner" aria-label="Loading">
          <div className="pokeball-top"></div>
          <div className="pokeball-bottom"></div>
          <div className="pokeball-center"></div>
        </div>
        {message && <span className="loading-message">{message}</span>}
      </div>
    )
  }

  return (
    <div className="loading-container">
      <div className="pokeball-spinner" aria-label="Loading">
        <div className="pokeball-top"></div>
        <div className="pokeball-bottom"></div>
        <div className="pokeball-center"></div>
      </div>
      <p className="loading-message">{message}</p>
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
