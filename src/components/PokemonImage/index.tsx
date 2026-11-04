import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLanguage } from '../../contexts/LanguageContext'

interface PokedexType {
  type: { name: string }
}

interface PokemonImageProps {
  id?: number
  name: string
  sprite: string
  types?: PokedexType[]
}

export function PokemonImage({ id, name, sprite, types }: PokemonImageProps) {
  const { language, getLocalizedName } = useLanguage()
  const [localizedTypes, setLocalizedTypes] = useState<Record<string, string>>(
    {}
  )

  const type1 = types?.[0]?.type?.name ?? 'N/A'
  const type2 = types?.[1]?.type?.name

  useEffect(() => {
    if (!types) return

    const fetchTypeNames = async () => {
      const typePromises = types.map(async typeObj => {
        const typeName = typeObj.type.name
        try {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/type/${typeName}`
          )
          const localizedName = getLocalizedName(response.data.names)
          return { [typeName]: localizedName || typeName }
        } catch (error) {
          return { [typeName]: typeName }
        }
      })

      const results = await Promise.all(typePromises)
      const typeMap = Object.assign({}, ...results)
      setLocalizedTypes(typeMap)
    }

    fetchTypeNames()
  }, [types, language, getLocalizedName])

  const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  const formatType = (type: string, localizedType?: string) => {
    if (type === 'N/A') return type
    const displayType = localizedType || type
    return displayType.charAt(0).toUpperCase() + displayType.slice(1)
  }

  const type1Localized = localizedTypes[type1] || type1
  const type2Localized = type2 ? localizedTypes[type2] || type2 : undefined

  return (
    <li>
      {sprite ? <img src={sprite} alt={name} /> : <p>No Image</p>}
      <p>#{id ?? 'N/A'}</p>
      <h4>{formatName(name)}</h4>
      <p className={`type1 ${type1}`}>{formatType(type1, type1Localized)}</p>
      {type2 && (
        <p className={`type2 ${type2}`}>{formatType(type2, type2Localized)}</p>
      )}
    </li>
  )
}
