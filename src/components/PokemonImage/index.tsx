import React from 'react';

interface PokedexType {
    type: { name: string };
}

interface PokemonImageProps {
    id?: number;
    name: string;
    sprite: string;
    types?: PokedexType[];
}

export function PokemonImage({ id, name, sprite, types }: PokemonImageProps) {
    const type1 = types?.[0]?.type?.name ?? 'N/A';
    const type2 = types?.[1]?.type?.name;

    return (
        <li>
            {sprite ? <img src={sprite} alt={name} /> : <p>No Image</p>}
            <p>#{id ?? 'N/A'}</p>
            <h4>{name}</h4>
            <p className={`type1 ${type1}`}>{type1}</p>
            {type2 && <p className={`type2 ${type2}`}>{type2}</p>}
        </li>
    );
}
