import { useState, useEffect } from "react";

interface PokemonProps {
    pokemon: {
        id: number;
        name: string; 
        url: string; 
    }  
}

export function PokemonInfo(props: PokemonProps) {
    const [pokemons, setPokemons] = useState<PokemonProps[]>([]);

    useEffect(() => { 
        fetch(`https://pokeapi.co/api/v2/pokemon/${props.pokemon.name}`)
        .then(response => response.json())
        .then(data => setPokemons(data))         
    }, []);

    return (
        <a href={'#'}>
            <li>
                <img src={"https://img.pokemondb.net/sprites/home/normal/"+props.pokemon.name+".png"} />
                <h5>#{pokemons['id']}</h5>
                <h4>{props.pokemon.name}</h4> 
            </li>
        </a>  
    )
}