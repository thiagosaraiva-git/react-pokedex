import { useState, useEffect } from 'react';
import { PokemonData } from "./PokemonData";

import '../src/pokemon.scss';

interface Pokemon {
    name: string;
    url: string;
}

export function PokemonCard() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon/?limit=251')
        .then(response => response.json())
        .then(data => setPokemons(data.results))
    }, []);

    return (       
        <section className="pokemon-namelist">    
            <ul>
                {pokemons.map(pokemon => {
                    return (
                        <PokemonData key={pokemon.name} pokemon={pokemon} />
                    );
                })}
            </ul>
        </section>
    );
}