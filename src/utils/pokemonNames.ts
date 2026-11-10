export function getCleanPokemonName(name: string): string {
  const formSuffixes = [
    '-family-of-three',
    '-family-of-four',
    '-wellspring-mask',
    '-hearthflame-mask',
    '-cornerstone-mask',
    '-white-striped',
    '-blue-striped',
    '-10-percent',
    '-50-percent',
    '-power-construct',
    '-battle-bond',
    '-red-meteor',
    '-rapid-strike',
    '-single-strike',
    '-gigantamax',
    '-ice-rider',
    '-shadow-rider',
    '-noice-face',
    '-dusk-mane',
    '-dawn-wings',
    '-full-belly',
    '-eternamax',
    '-mega-x',
    '-mega-y',
    '-pom-pom',
    '-alola',
    '-galar',
    '-hisui',
    '-paldea',
    '-gmax',
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
    '-mega',
    '-blade',
    '-starter',
    '-zen',
    '-resolute',
    '-pirouette',
    '-ordinary',
    '-aria',
    '-active',
    '-busted',
    '-disguised',
    '-midday',
    '-midnight',
    '-dusk',
    '-original',
    '-hoopa',
    '-confined',
    '-unbound',
    '-baile',
    '-pau',
    '-sensu',
    '-solo',
    '-school',
    '-shield',
    '-altered',
    '-land',
    '-incarnate',
    '-standard',
    '-hero',
    '-ice',
    '-noice',
    '-hangry',
    '-average',
    '-low-key',
    '-amped',
    '-gulping',
    '-gorging',
    '-crowned',
    '-male',
    '-female',
    '-red',
    '-blue',
    '-yellow',
    '-green',
    '-orange',
    '-indigo',
    '-violet',
    '-roaming',
    '-complete',
    '-10',
    '-50',
    '-pompom',
    '-core',
    '-family',
    '-ash',
    '-ultra',
    '-antique',
    '-phony',
    '-artisan',
    '-hearthflame',
    '-wellspring',
    '-cornerstone',
    '-teal',
    '-bloodmoon',
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

export function toTitleCase(value: string): string {
  return value
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getFormDisplayName(formName: string): string {
  return toTitleCase(formName)
}
