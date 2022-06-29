import { useState, useEffect } from 'react';
import { PokemonInfo } from './PokemonInfo';
import '../Pokemon/styles.scss';

interface PokemonList {
    id: number;
    name: string; 
    url: string;
}

export function PokemonCard() {
    const [pokemons, setPokemons] = useState<PokemonList[]>([]);
   
    useEffect(() => { 
        fetch(`https://pokeapi.co/api/v2/pokemon/?limit=386`)
        .then(response => response.json())
        .then(data => setPokemons(data.results))
          
    }, []);
    
    return (       
        <section className="pokemon-namelist">    
            <ul>
                {pokemons.map(pokemon => {
                    return (
                        <PokemonInfo key={pokemon.name} pokemon={pokemon}/>   
                    ); 
                })}  
            </ul>
        </section>
    );
}
