import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface Pokedex {
    id?: number;
    name: string;
    types?: any;
    sprites?: any;
    abilities?: any;
    stats?: any;
}

export function Pokedex(props: Pokedex) {
    const [pokedex, setPokedex] = useState<Pokedex[]>([]);

    const getPokedex = async () => {
        await api.get(`${props.name}`)
        .then(response => setPokedex([...pokedex, response.data]))  
    }

    useEffect(() => { 
        getPokedex()
    }, [])  

    return(
        <>
            {pokedex.map(pokemon => {
                let id = pokemon.id
                let name = pokemon.name
                let type1 = pokemon.types[0].type.name
                let type2 = pokemon.types[1]?.type.name
                let sprite = pokemon.sprites.other.home.front_default
                let ability1 = pokemon.abilities[0].ability.name
                let ability2 = pokemon.abilities[1]?.ability.name
                let ability3 = pokemon.abilities[2]?.ability.name
                let hp = pokemon.stats[0].base_stat
                let attack = pokemon.stats[1].base_stat
                let defense = pokemon.stats[2].base_stat
                let special_attack = pokemon.stats[3].base_stat
                let special_defense = pokemon.stats[4].base_stat
                let speed = pokemon.stats[5].base_stat
        
                return(
                    <>
                        <a href={''}>
                            <li>
                                <img src={sprite} />
                                <p>#{id}</p>  
                                <h4>{name}</h4>
                                <p className={"type1 " + type1}>{type1}</p>
                                {type2?(
                                    <p className={"type2 " + type2}>{type2}</p> 
                                ):(
                                    <></>
                                )}
                            </li> 
                        </a>  
                    </>
                )
            })}
        </>
    )  
}