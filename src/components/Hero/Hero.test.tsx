import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Hero } from './index'

describe('Hero', () => {
  it('should render the Pokédex hero banner in document flow', () => {
    render(<Hero />)

    const hero = screen.getByRole('region', { name: 'Pokédex' })
    expect(hero).toBeInTheDocument()
    expect(hero).toHaveClass('hero-banner')
    expect(hero).not.toHaveClass('pokedex-header')
  })

  it('should render the background image with cover-friendly dimensions', () => {
    const { container } = render(<Hero />)

    const heroBackground = container.querySelector('.hero-background')
    const heroImage = container.querySelector('.hero-background-image')

    expect(heroBackground).toBeInTheDocument()
    expect(heroImage).toBeInTheDocument()
    expect(heroImage).toHaveAttribute('src')
    expect(heroImage).toHaveAttribute('alt', '')
    expect(heroImage).toHaveAttribute('width', '1280')
    expect(heroImage).toHaveAttribute('height', '420')
  })
})
