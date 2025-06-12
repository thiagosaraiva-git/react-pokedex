import { useState, useEffect, ChangeEvent } from 'react';
import { Pokedex } from '../Pokedex';
import { api } from '../../services/api';
import '../Pokemon/styles.scss';

interface PokemonCardList {
    id: number;
    name: string;
    types: Array<{ type: { name: string } }>;
}

const generationRanges = {
    gen1: { min: 1, max: 151 },
    gen2: { min: 152, max: 251 },
    gen3: { min: 252, max: 386 },
    gen4: { min: 387, max: 493 },
    gen5: { min: 494, max: 649 },
    gen6: { min: 650, max: 721 },
    gen7: { min: 722, max: 809 },
    gen8: { min: 810, max: 905 },
    gen9: { min: 906, max: 1025 },
};

export function PokemonCard() {
    const [pokemons, setPokemons] = useState<PokemonCardList[]>([]);
    const [nameFilter, setNameFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [generationFilter, setGenerationFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const commonTypes = ["grass", "fire", "water", "electric", "psychic", "normal", "bug", "poison"];

    const getPokemon = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('?limit=1025');
            const pokemonList = response.data.results;

            let detailedPokemonData = await Promise.all(
                pokemonList.map(async (pokemon: { name: string, url: string }) => {
                    const singlePokemonResponse = await api.get(`${pokemon.name}`);
                    return singlePokemonResponse.data;
                })
            );

            detailedPokemonData = detailedPokemonData.filter(pokemon => {
                const hasSprite = pokemon.sprites?.other?.home?.front_default && pokemon.sprites.other.home.front_default !== '';
                const hasTypes = pokemon.types && pokemon.types.length > 0;
                return hasSprite && hasTypes;
            });

            setPokemons(detailedPokemonData);
        } catch (error) {
            console.error("Failed to fetch Pokemon data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getPokemon();
    }, []);

    if (isLoading) {
        return <p>Loading Pokemon...</p>;
    }

    let filteredPokemons = pokemons;

    if (nameFilter) {
        filteredPokemons = filteredPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
    }

    if (typeFilter !== 'all') {
        filteredPokemons = filteredPokemons.filter(pokemon =>
            pokemon.types.some(t => t.type.name === typeFilter)
        );
    }

    if (generationFilter !== 'all') {
        const range = generationRanges[generationFilter as keyof typeof generationRanges];
        if (range) {
            filteredPokemons = filteredPokemons.filter(pokemon =>
                pokemon.id >= range.min && pokemon.id <= range.max
            );
        }
    }

    return (
        <>
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={nameFilter}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNameFilter(e.target.value)}
                />
                <select value={typeFilter} onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    {commonTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                </select>
                <select value={generationFilter} onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenerationFilter(e.target.value)}>
                    <option value="all">All Generations</option>
                    {Object.keys(generationRanges).map(genKey => {
                        const gen = generationRanges[genKey as keyof typeof generationRanges];
                        // Extract number from genKey like "gen1" -> "1"
                        const genNumber = genKey.replace('gen', '');
                        return (
                            <option key={genKey} value={genKey}>
                                {`Gen ${genNumber} (${gen.min}-${gen.max})`}
                            </option>
                        );
                    })}
                </select>
            </div>
            <section className="pokemon-namelist">
                <ul>
                    {filteredPokemons.map(pokemon => {
                        return (
                            <Pokedex key={pokemon.id} name={pokemon.name} />
                        );
                    })}
                </ul>
            </section>
        </>
    );
}
