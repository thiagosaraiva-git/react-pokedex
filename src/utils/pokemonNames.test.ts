import { describe, it, expect } from 'vitest'
import { getCleanPokemonName, getFormDisplayName } from './pokemonNames'

describe('getCleanPokemonName', () => {
  it('should return the base name for pokemon without form suffixes', () => {
    expect(getCleanPokemonName('pikachu')).toBe('pikachu')
    expect(getCleanPokemonName('charizard')).toBe('charizard')
    expect(getCleanPokemonName('mewtwo')).toBe('mewtwo')
  })

  it('should remove mega form suffixes', () => {
    expect(getCleanPokemonName('charizard-mega-x')).toBe('charizard')
    expect(getCleanPokemonName('charizard-mega-y')).toBe('charizard')
    expect(getCleanPokemonName('mewtwo-mega-x')).toBe('mewtwo')
    expect(getCleanPokemonName('lucario-mega')).toBe('lucario')
  })

  it('should remove regional form suffixes', () => {
    expect(getCleanPokemonName('vulpix-alola')).toBe('vulpix')
    expect(getCleanPokemonName('meowth-galar')).toBe('meowth')
    expect(getCleanPokemonName('growlithe-hisui')).toBe('growlithe')
    expect(getCleanPokemonName('wooper-paldea')).toBe('wooper')
  })

  it('should remove gigantamax form suffixes', () => {
    expect(getCleanPokemonName('pikachu-gmax')).toBe('pikachu')
    expect(getCleanPokemonName('charizard-gigantamax')).toBe('charizard')
  })

  it('should remove primal and origin form suffixes', () => {
    expect(getCleanPokemonName('groudon-primal')).toBe('groudon')
    expect(getCleanPokemonName('giratina-origin')).toBe('giratina')
  })

  it('should remove therian form suffixes', () => {
    expect(getCleanPokemonName('tornadus-therian')).toBe('tornadus')
    expect(getCleanPokemonName('thundurus-therian')).toBe('thundurus')
  })

  it('should remove other form-specific suffixes', () => {
    expect(getCleanPokemonName('rotom-wash')).toBe('rotom')
    expect(getCleanPokemonName('rotom-heat')).toBe('rotom')
    expect(getCleanPokemonName('rotom-mow')).toBe('rotom')
    expect(getCleanPokemonName('wormadam-plant')).toBe('wormadam')
    expect(getCleanPokemonName('wormadam-sandy')).toBe('wormadam')
    expect(getCleanPokemonName('wormadam-trash')).toBe('wormadam')
  })

  it('should preserve case sensitivity', () => {
    expect(getCleanPokemonName('Charizard-Mega-X')).toBe('charizard')
    expect(getCleanPokemonName('PIKACHU-GMAX')).toBe('pikachu')
  })

  it('should handle names with multiple potential suffixes', () => {
    expect(getCleanPokemonName('charizard-mega-x')).toBe('charizard')
    expect(getCleanPokemonName('charizard-mega-y')).toBe('charizard')
    expect(getCleanPokemonName('alakazam-mega')).toBe('alakazam')
  })
})

describe('getFormDisplayName', () => {
  it('should capitalize words and replace hyphens with spaces', () => {
    expect(getFormDisplayName('charizard-mega-x')).toBe('Charizard Mega X')
    expect(getFormDisplayName('vulpix-alola')).toBe('Vulpix Alola')
    expect(getFormDisplayName('meowth-galar')).toBe('Meowth Galar')
  })

  it('should handle single word names', () => {
    expect(getFormDisplayName('pikachu')).toBe('Pikachu')
    expect(getFormDisplayName('charizard')).toBe('Charizard')
  })

  it('should handle multiple hyphens', () => {
    expect(getFormDisplayName('charizard-mega-x')).toBe('Charizard Mega X')
    expect(getFormDisplayName('wormadam-plant-cloak')).toBe(
      'Wormadam Plant Cloak'
    )
  })

  it('should handle names without hyphens', () => {
    expect(getFormDisplayName('bulbasaur')).toBe('Bulbasaur')
  })
})
