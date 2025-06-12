import React from 'react';

interface PokedexAbility {
    ability: { name: string };
    is_hidden?: boolean;
}

interface PokemonAbilitiesProps {
    abilities?: PokedexAbility[];
}

export function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
    const ability1 = abilities?.[0]?.ability?.name ?? 'N/A';
    const ability2 = abilities?.[1]?.ability?.name;
    const ability3 = abilities?.[2]?.ability?.name;

    return (
        <>
            <h4>Abilities:</h4>
            <li>{ability1}</li>
            {ability2 && <li>{ability2}</li>}
            {ability3 && <li>{ability3}</li>}
            <br />
        </>
    );
}
