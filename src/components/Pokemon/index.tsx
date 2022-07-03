import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import '../Pokemon/styles.scss';

interface PokemonCardInfoProps {
    types?: any;
    id?: number;
    sprites?: any;
    pokemon: {
        name: string; 
        url: string; 
    }  
}

interface PokemonCardList {
    name: string; 
    url: string;
}

function PokemonCardInfo(props: PokemonCardInfoProps) {
    const [pokemons, setPokemons] = useState<PokemonCardInfoProps[]>([]);

    const getPokemonInfo = async () => {
        await api.get(`${props.pokemon.name}`)
        .then(response => setPokemons([...pokemons, response.data]))  
    }

    useEffect(() => { 
        getPokemonInfo()
    }, [])  
 
    return(
        <>
            {pokemons.map(pokemon => {
                const imgUrl = pokemon.sprites?.other.home.front_default
                const id = pokemon.id
                const name = props.pokemon.name
                const type1 = pokemon.types[0].type.name
                return(
                    <a href={''}>
                        <li>
                            <img src={imgUrl} />
                            <p>#{id}</p>  
                            <h4>{name}</h4>
                            <p className={"type1 " + type1}>{type1}</p>
                            {pokemons.map(pokemon => {
                                if(pokemon.types[1]) {
                                const type2 = pokemon.types[1].type.name
                                return(
                                    <p className={"type2 " + type2}>{type2}</p>
                                )}
                            })}
                        </li> 
                    </a>  
                )
            })}                                
        </>
    )
}

export function PokemonCard() {
    const [pokemons, setPokemons] = useState<PokemonCardList[]>([]);
   
    const getPokemon = async () => {
        await api.get('?limit=251')
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
                        <PokemonCardInfo key={pokemon.name} pokemon={pokemon}/>   
                    ); 
                })}  
            </ul>
        </section>   
    );
}