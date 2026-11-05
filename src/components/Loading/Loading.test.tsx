import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Loading } from './index'
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext'

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

const renderLoading = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('Loading Component', () => {
  it('should render full variant with default message', () => {
    renderLoading(<Loading />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading…')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    renderLoading(<Loading message="Carregando mais…" />)
    expect(screen.getByText('Carregando mais…')).toBeInTheDocument()
  })

  it('should render progress bar when progress prop is provided', () => {
    renderLoading(<Loading progress={45} />)
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '45'
    )
  })

  it('should render inline variant', () => {
    const { container } = renderLoading(
      <Loading variant="inline" message="Loading..." />
    )
    expect(container.querySelector('.loading-inline')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should not render progress bar for inline variant', () => {
    renderLoading(<Loading variant="inline" progress={50} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('should render pokeball spinner', () => {
    const { container } = renderLoading(<Loading />)
    expect(container.querySelector('.pokeball-spinner')).toBeInTheDocument()
    expect(container.querySelector('.pokeball-top')).toBeInTheDocument()
    expect(container.querySelector('.pokeball-bottom')).toBeInTheDocument()
    expect(container.querySelector('.pokeball-center')).toBeInTheDocument()
  })

  it('should update progress bar width', () => {
    const { container } = renderLoading(<Loading progress={75} />)
    const progressFill = container.querySelector(
      '.progress-fill'
    ) as HTMLElement
    expect(progressFill).toHaveStyle({ width: '75%' })
  })

  it('should render without message when message is empty', () => {
    const { container } = renderLoading(<Loading variant="inline" message="" />)
    expect(container.querySelector('.loading-message')).not.toBeInTheDocument()
  })

  it('should localize the default loading message when language changes', async () => {
    const user = userEvent.setup()
    renderLoading(
      <LanguageHarness>
        <Loading />
      </LanguageHarness>
    )

    expect(screen.getByText('Loading…')).toBeInTheDocument()

    await user.click(screen.getByText('to-ja'))

    expect(screen.getByText('読み込み中…')).toBeInTheDocument()
  })
})
