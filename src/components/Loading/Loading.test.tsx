import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loading } from './index'

describe('Loading Component', () => {
  it('should render full variant with default message', () => {
    render(<Loading />)
    expect(screen.getByText('Carregando…')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    render(<Loading message="Carregando mais…" />)
    expect(screen.getByText('Carregando mais…')).toBeInTheDocument()
  })

  it('should render progress bar when progress prop is provided', () => {
    render(<Loading progress={45} />)
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '45'
    )
  })

  it('should render inline variant', () => {
    const { container } = render(
      <Loading variant="inline" message="Loading..." />
    )
    expect(container.querySelector('.loading-inline')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should not render progress bar for inline variant', () => {
    render(<Loading variant="inline" progress={50} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('should render pokeball spinner', () => {
    const { container } = render(<Loading />)
    expect(container.querySelector('.pokeball-spinner')).toBeInTheDocument()
    expect(container.querySelector('.pokeball-top')).toBeInTheDocument()
    expect(container.querySelector('.pokeball-bottom')).toBeInTheDocument()
    expect(container.querySelector('.pokeball-center')).toBeInTheDocument()
  })

  it('should update progress bar width', () => {
    const { container } = render(<Loading progress={75} />)
    const progressFill = container.querySelector(
      '.progress-fill'
    ) as HTMLElement
    expect(progressFill).toHaveStyle({ width: '75%' })
  })

  it('should render without message when message is empty', () => {
    const { container } = render(<Loading variant="inline" message="" />)
    expect(container.querySelector('.loading-message')).not.toBeInTheDocument()
  })
})
