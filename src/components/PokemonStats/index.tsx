import React from 'react';

interface PokedexStat {
    base_stat: number;
    stat: { name: string };
}

interface PokemonStatsProps {
    stats?: PokedexStat[];
}

const maxStat = 255;

export function PokemonStats({ stats }: PokemonStatsProps) {
    const hp = stats?.[0]?.base_stat ?? 0;
    const attack = stats?.[1]?.base_stat ?? 0;
    const defense = stats?.[2]?.base_stat ?? 0;
    const special_attack = stats?.[3]?.base_stat ?? 0;
    const special_defense = stats?.[4]?.base_stat ?? 0;
    const speed = stats?.[5]?.base_stat ?? 0;

    return (
        <>
            <h4>Base Stats:</h4>
            <li><p>HP: <progress value={hp} max={maxStat} /> {hp}</p></li>
            <li><p>Attack: <progress value={attack} max={maxStat} /> {attack}</p></li>
            <li><p>Defense: <progress value={defense} max={maxStat} /> {defense}</p></li>
            <li><p>Sp. Attack: <progress value={special_attack} max={maxStat} /> {special_attack}</p></li>
            <li><p>Sp. Defense: <progress value={special_defense} max={maxStat} /> {special_defense}</p></li>
            <li><p>Speed: <progress value={speed} max={maxStat} /> {speed}</p></li>
        </>
    );
}
