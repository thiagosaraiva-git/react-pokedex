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
            const response = await api.get('?limit=386');
            const pokemonList = response.data.results;

            const detailedPokemonData = await Promise.all(
                pokemonList.map(async (pokemon: { name: string, url: string }) => {
                    const singlePokemonResponse = await api.get(`${pokemon.name}`);
                    return singlePokemonResponse.data;
                })
            );

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
                    <option value="gen1">Gen 1 (1-151)</option>
                    <option value="gen2">Gen 2 (152-251)</option>
                    <option value="gen3">Gen 3 (252-386)</option>
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
