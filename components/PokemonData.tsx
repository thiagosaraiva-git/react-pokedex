interface PokemonProps {
    pokemon: {
        name: string;
        url: string 
    }
}

export function PokemonData(props: PokemonProps) {
    return (
        <a href={ props.pokemon?.url }>
            <li>
                <img src={"https://img.pokemondb.net/sprites/black-white/anim/normal/"+props.pokemon.name+".gif"} />
                <h5>{ props.pokemon.name }</h5>
            </li>
        </a>
    )
}

