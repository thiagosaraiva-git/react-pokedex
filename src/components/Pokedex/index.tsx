import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import clickSfx from '../../sounds/click.mp3'
import { api } from '../../services/api';
import { PokemonStats } from '../PokemonStats';
import { PokemonAbilities } from '../PokemonAbilities';
import { PokemonImage } from '../PokemonImage';

interface PokedexType {
    type: { name: string };
}

interface PokedexSprite {
    other: { home: { front_default: string } };
}

interface PokedexAbility {
    ability: { name: string };
    is_hidden?: boolean;
}

interface PokedexStat {
    base_stat: number;
    stat: { name: string };
}

interface PokedexEntry {
    id?: number;
    name: string;
    types?: PokedexType[];
    sprites?: PokedexSprite;
    abilities?: PokedexAbility[];
    stats?: PokedexStat[];
}

export function Pokedex(props: { name: string }) {
    const [pokemonData, setPokemonData] = useState<PokedexEntry | null>(null);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        const getPokedex = async () => {
            try {
                const response = await api.get(`${props.name}`);
                setPokemonData(response.data);
            } catch (error) {
                console.error("Failed to fetch Pokedex data:", error);
            }
        };
        getPokedex();
    }, [props.name]);

    const [click]: [(() => void) | undefined, ({ stop: () => void; }) | undefined] = useSound(clickSfx);

    const { id, name, types, sprites, abilities, stats } = pokemonData!;
    const spriteUrl = sprites?.other?.home?.front_default ?? '';

    function flipCard() {
        setFlip(currentFlip => !currentFlip);
    }

    const flipCheck = flip ? 'active' : null;

    return (
        <>
            <a href={`#${id}`} onClick={flipCard} onMouseEnter={click} onMouseLeave={flipCheck ? flipCard : click}>
                {flipCheck ? (
                    <li>
                        <PokemonAbilities abilities={abilities} />
                        <PokemonStats stats={stats} />
                    </li>
                ) : (
                    <PokemonImage id={id} name={name} sprite={spriteUrl} types={types} />
                )}
            </a>
        </>
    );
}
