import { useState, useEffect } from 'react';
import { PokemonInfo } from './PokemonInfo';
import '../Pokemon/styles.scss';

interface PokemonList {
    url: string;
    name: string; 
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
                {
                    pokemons.map(pokemon => {
                        return (
                            <>
                                <a href={'#'} key={pokemon.name}>
                                    <li>
                                        <PokemonInfo pokemon={pokemon} />
                                    </li>
                                </a>  
                            </>
                        )
                    })
                }  
            </ul>
        </section>
    );
}