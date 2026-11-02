export function getCleanPokemonName(name: string): string {
  const formSuffixes = [
    '-family-of-four',
    '-family-of-three',
    '-mega-x',
    '-mega-y',
    '-mega',
    '-alola',
    '-galar',
    '-hisui',
    '-paldea',
    '-gmax',
    '-gigantamax',
    '-primal',
    '-origin',
    '-therian',
    '-black',
    '-white',
    '-sky',
    '-attack',
    '-defense',
    '-speed',
    '-plant',
    '-sandy',
    '-trash',
    '-frost',
    '-fan',
    '-mow',
    '-wash',
    '-heat',
  ]

  let cleanName = name.toLowerCase()

  for (const suffix of formSuffixes) {
    if (cleanName.endsWith(suffix)) {
      cleanName = cleanName.slice(0, -suffix.length)
      break
    }
  }

  return cleanName
}

export function getFormDisplayName(formName: string): string {
  const cleaned = formName.replace(/-/g, ' ')
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
