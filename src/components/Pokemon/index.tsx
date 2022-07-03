import { useState, useEffect } from 'react';
import { Pokedex } from '../Pokedex';
import { api } from '../../services/api';
import '../Pokemon/styles.scss';

interface PokemonCardList {
    name: string; 
    url: string;
}

export function PokemonCard() {
    const [pokemons, setPokemons] = useState<PokemonCardList[]>([]);
   
    const getPokemon = async () => {
        await api.get('?limit=386')
        .then(response => setPokemons(response.data.results))
    }
    
    useEffect(() => { 
        getPokemon();
    }, []);
    
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