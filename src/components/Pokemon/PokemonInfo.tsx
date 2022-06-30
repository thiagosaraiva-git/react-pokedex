import { useState, useEffect } from "react";

interface PokemonProps {
    types?: any;
    id?: number;
    pokemon: {
        name: string; 
        url: string; 
    }  
}

export function PokemonInfo(props: PokemonProps) {
    const [pokemons, setPokemons] = useState<PokemonProps[]>([]);

    useEffect(() => { 
        fetch(`https://pokeapi.co/api/v2/pokemon/${props.pokemon.name}`)
        .then(response => response.json())
        .then(data => setPokemons([...pokemons, data]))
               
    }, []);      

    return (
        <a href={'#'}>            
            <li>
                <img src={"https://img.pokemondb.net/sprites/home/normal/"+props.pokemon.name+".png"} />
                {pokemons.map(pokemon => {
                    if(pokemon.types[1]) {
                        return(
                            <>
                                <p>#{pokemon.id}</p>  
                                <h4>{props.pokemon.name}</h4>
                                <p className={"type1 " + pokemon.types[0].type.name}>{pokemon.types[0].type.name}</p>
                                <p className={"type2 " + pokemon.types[1].type.name}>{pokemon.types[1].type.name}</p>
                            </>
                            
                        ) 
                    }else{
                        return(
                            <>
                                <p>#{pokemon.id}</p>
                                <h4>{props.pokemon.name}</h4>
                                <p className={"type1 " + pokemon.types[0].type.name}>{pokemon.types[0].type.name}</p>
                            </>
                        ) 
                    }
                })}                                    
            </li>
        </a>  
    )
}