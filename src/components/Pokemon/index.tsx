import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Pokedex } from '../Pokedex';
import { api } from '../../services/api';
import '../Pokemon/styles.scss';

interface PokemonCardList {
    name: string;
    url: string;
}

export function PokemonCard() {
    const [pokemons, setPokemons] = useState<PokemonCardList[]>([]);

    const getPokemon = useCallback(async () => { // Wrapped in useCallback
        try {
            const response = await api.get('?limit=386');
            // It's good practice to check if response.data.results actually exists
            if (response && response.data && response.data.results) {
                setPokemons(response.data.results);
            } else {
                console.error('API response did not contain expected data structure:', response);
                setPokemons([]); // Set to empty or handle error state
            }
        } catch (error) {
            console.error("Failed to fetch Pokemon list:", error);
            setPokemons([]); // Set to empty or handle error state appropriately
        }
    }, []); // No dependencies for getPokemon itself

    useEffect(() => {
        getPokemon();
    }, [getPokemon]); // useEffect depends on the memoized getPokemon

    return (
        <section className="pokemon-namelist">
            <ul>
                {pokemons.map(pokemon => {
                    return (
                        <Pokedex key={pokemon.name} name={pokemon.name}/>
                    );
                })}
            </ul>
        </section>
    );
}
