import { describe, it, expect } from 'vitest'
import { getCleanPokemonName, getFormDisplayName } from './pokemonNames'

describe('getCleanPokemonName', () => {
  it('should return the base name for pokemon without form suffixes', () => {
    expect(getCleanPokemonName('pikachu')).toBe('pikachu')
    expect(getCleanPokemonName('charizard')).toBe('charizard')
    expect(getCleanPokemonName('mewtwo')).toBe('mewtwo')
  })

  it('should remove family form suffixes (Maushold)', () => {
    expect(getCleanPokemonName('maushold-family-of-four')).toBe('maushold')
    expect(getCleanPokemonName('maushold-family-of-three')).toBe('maushold')
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

  it('should remove family-of-* suffixes (Maushold)', () => {
    expect(getCleanPokemonName('maushold-family-of-three')).toBe('maushold')
    expect(getCleanPokemonName('maushold-family-of-four')).toBe('maushold')
  })

  it('should remove Zygarde form suffixes', () => {
    expect(getCleanPokemonName('zygarde-10')).toBe('zygarde')
    expect(getCleanPokemonName('zygarde-50')).toBe('zygarde')
    expect(getCleanPokemonName('zygarde-complete')).toBe('zygarde')
    expect(getCleanPokemonName('zygarde-10-percent')).toBe('zygarde')
    expect(getCleanPokemonName('zygarde-50-percent')).toBe('zygarde')
  })

  it('should remove Aegislash blade form suffix', () => {
    expect(getCleanPokemonName('aegislash-blade')).toBe('aegislash')
    expect(getCleanPokemonName('aegislash-shield')).toBe('aegislash')
  })

  it('should remove Oricorio form suffixes', () => {
    expect(getCleanPokemonName('oricorio-baile')).toBe('oricorio')
    expect(getCleanPokemonName('oricorio-pom-pom')).toBe('oricorio')
    expect(getCleanPokemonName('oricorio-pau')).toBe('oricorio')
    expect(getCleanPokemonName('oricorio-sensu')).toBe('oricorio')
  })

  it('should remove Lycanroc form suffixes', () => {
    expect(getCleanPokemonName('lycanroc-midday')).toBe('lycanroc')
    expect(getCleanPokemonName('lycanroc-midnight')).toBe('lycanroc')
    expect(getCleanPokemonName('lycanroc-dusk')).toBe('lycanroc')
  })

  it('should remove Wishiwashi form suffixes', () => {
    expect(getCleanPokemonName('wishiwashi-solo')).toBe('wishiwashi')
    expect(getCleanPokemonName('wishiwashi-school')).toBe('wishiwashi')
  })

  it('should remove legendary form suffixes', () => {
    expect(getCleanPokemonName('zacian-crowned')).toBe('zacian')
    expect(getCleanPokemonName('zamazenta-crowned')).toBe('zamazenta')
    expect(getCleanPokemonName('calyrex-ice-rider')).toBe('calyrex')
    expect(getCleanPokemonName('calyrex-shadow-rider')).toBe('calyrex')
    expect(getCleanPokemonName('necrozma-dusk-mane')).toBe('necrozma')
    expect(getCleanPokemonName('necrozma-dawn-wings')).toBe('necrozma')
  })

  it('should remove Galar starter form suffixes', () => {
    expect(getCleanPokemonName('toxtricity-amped')).toBe('toxtricity')
    expect(getCleanPokemonName('toxtricity-low-key')).toBe('toxtricity')
  })

  it('should remove Pumpkaboo/Gourgeist size suffixes', () => {
    expect(getCleanPokemonName('gourgeist-average')).toBe('gourgeist')
  })

  it('should remove Cramorant form suffixes', () => {
    expect(getCleanPokemonName('cramorant-gulping')).toBe('cramorant')
    expect(getCleanPokemonName('cramorant-gorging')).toBe('cramorant')
  })

  it('should remove Morpeko form suffixes', () => {
    expect(getCleanPokemonName('morpeko-full-belly')).toBe('morpeko')
    expect(getCleanPokemonName('morpeko-hangry')).toBe('morpeko')
  })

  it('should remove Urshifu form suffixes', () => {
    expect(getCleanPokemonName('urshifu-rapid-strike')).toBe('urshifu')
    expect(getCleanPokemonName('urshifu-single-strike')).toBe('urshifu')
  })

  it('should remove Ogerpon mask form suffixes', () => {
    expect(getCleanPokemonName('ogerpon-wellspring')).toBe('ogerpon')
    expect(getCleanPokemonName('ogerpon-hearthflame')).toBe('ogerpon')
    expect(getCleanPokemonName('ogerpon-cornerstone')).toBe('ogerpon')
    expect(getCleanPokemonName('ogerpon-wellspring-mask')).toBe('ogerpon')
    expect(getCleanPokemonName('ogerpon-hearthflame-mask')).toBe('ogerpon')
    expect(getCleanPokemonName('ogerpon-cornerstone-mask')).toBe('ogerpon')
    expect(getCleanPokemonName('ogerpon-teal')).toBe('ogerpon')
  })

  it('should remove Ursaluna form suffix', () => {
    expect(getCleanPokemonName('ursaluna-bloodmoon')).toBe('ursaluna')
  })

  it('should remove Eiscue form suffixes', () => {
    expect(getCleanPokemonName('eiscue-ice')).toBe('eiscue')
    expect(getCleanPokemonName('eiscue-noice')).toBe('eiscue')
    expect(getCleanPokemonName('eiscue-noice-face')).toBe('eiscue')
  })

  it('should remove Eternatus form suffix', () => {
    expect(getCleanPokemonName('eternatus-eternamax')).toBe('eternatus')
  })

  it('should remove Basculegion form suffixes', () => {
    expect(getCleanPokemonName('basculegion-male')).toBe('basculegion')
    expect(getCleanPokemonName('basculegion-female')).toBe('basculegion')
  })

  it('should remove Minior core color suffixes', () => {
    expect(getCleanPokemonName('minior-red')).toBe('minior')
    expect(getCleanPokemonName('minior-orange')).toBe('minior')
    expect(getCleanPokemonName('minior-yellow')).toBe('minior')
    expect(getCleanPokemonName('minior-green')).toBe('minior')
    expect(getCleanPokemonName('minior-blue')).toBe('minior')
    expect(getCleanPokemonName('minior-indigo')).toBe('minior')
    expect(getCleanPokemonName('minior-violet')).toBe('minior')
  })

  it('should match longer suffixes before shorter ones', () => {
    expect(getCleanPokemonName('maushold-family-of-three')).toBe('maushold')
    expect(getCleanPokemonName('zygarde-10-percent')).toBe('zygarde')
    expect(getCleanPokemonName('calyrex-ice-rider')).toBe('calyrex')
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
