import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import clickSfx from '../../sounds/click.mp3'
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
    const [flip, setFlip] = useState(false);

    const getPokedex = async () => {
        await api.get(`${props.name}`)
        .then(response => setPokedex([...pokedex, response.data]))  
    }

    const [click]: any = useSound(clickSfx)

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
                let maxStat = 255
                
                function flipCard() {
                    setFlip(flip => !flip)
                }

                let flipCheck = flip ? 'active' : null;

                return(
                    <>
                        <a href={'#' + id} onClick={flipCard} onMouseEnter={click} onMouseLeave={flipCheck?(flipCard) : click }>
                            {flipCheck?(
                                 <li>
                                    <h4>Abilities:</h4>
                                    <li>{ability1}</li>
                                    {ability2?(
                                        <li>{ability2}</li>

                                    ):(
                                        <></>
                                    )}
                                    {ability3?(
                                        <li>{ability3}</li>

                                    ):(
                                        <></>
                                    )}
                                    <br/>
                                    <h4>Base Stats:</h4>
                                    <li>
                                        <p>HP: <progress value={hp} max={maxStat}/> {hp}</p>
                                    </li>
                                    <li>
                                        <p>Attack: <progress value={attack} max={maxStat}/> {attack}</p>
                                    </li>
                                    <li>
                                        <p>Defense: <progress value={defense} max={maxStat}/> {defense}</p>
                                    </li>
                                    <li>
                                        <p>Sp. Attack: <progress value={special_attack} max={maxStat}/> {special_attack}</p>
                                    </li>
                                    <li>
                                        <p>Sp. Defense: <progress value={special_defense} max={maxStat}/> {special_defense}</p>
                                    </li>
                                    <li>
                                        <p>Speed: <progress value={speed} max={maxStat}/> {speed}</p>
                                    </li>
                                 </li>
                            ):(
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
                            )} 
                        </a>  
                    </>
                )
            })}
        </>
    )  
}