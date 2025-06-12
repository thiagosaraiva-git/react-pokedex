import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import useSound from 'use-sound';
import clickSfx from '../../sounds/click.mp3';
import { api } from '../../services/api';
import { PokedexEntry } from '../../types';
import { PokedexCardDetails } from '../PokedexCardDetails'; // Import new component

interface PokedexProps {
    name: string;
}

type UseSoundTuple = [() => void, { stop: () => void; isPlaying: boolean; sound: any; duration: number | null }];

export function Pokedex(props: PokedexProps) {
    const [pokemonDetails, setPokemonDetails] = useState<PokedexEntry | null>(null);
    const [flip, setFlip] = useState(false);

    // Wrapped in useCallback as per the subtask description
    const getPokedexData = useCallback(async () => {
        if (!props.name) return;
        try {
            const response = await api.get<PokedexEntry>(`${props.name}`);
            setPokemonDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch Pokedex data for:", props.name, error);
            setPokemonDetails(null);
        }
    }, [props.name]); // Added props.name dependency

    const [playClickSound, { isPlaying: clickIsPlaying, stop: stopClickSound }] = useSound(clickSfx, { volume: 0.5 }) as UseSoundTuple;

    useEffect(() => {
        getPokedexData();
    }, [getPokedexData]); // useEffect depends on getPokedexData

    const flipCard = useCallback(() => { // Wrapped in useCallback
        setFlip(currentFlip => !currentFlip);
    }, []);

    if (!pokemonDetails) {
        return <li>Loading {props.name}...</li>;
    }

    const { id, name, types, sprites, abilities, stats } = pokemonDetails;

    const mainSprite = sprites.other?.home?.front_default || sprites.front_default || '/src/img/pokeball.png';

    const type1 = types?.[0]?.type?.name || 'unknown';
    const type2 = types?.[1]?.type?.name;

    // maxStat is defined here, to be passed to PokedexCardDetails
    const maxStat = 255;

    // Removed direct ability and stat definitions here as they are handled in PokedexCardDetails

    const handleMouseEnter = () => {
        playClickSound();
    };

    const handleMouseLeave = () => {
        // Behavior refined: do nothing on mouse leave
    };

    const cardKey = `pokemon-${id}-${name.replace(/[^a-zA-Z0-9-]/g, '')}`; // Sanitize name for key

    return (
        <li key={cardKey} className={`pokemon-card ${flip ? 'flipped' : ''}`}>
            <div
                className="card-inner"
                onClick={flipCard}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') flipCard(); }}>
                {!flip ? (
                    <div className="card-front">
                        <img src={mainSprite} alt={name} />
                        <p>#{id}</p>
                        <h4>{name}</h4>
                        <p className={`type1 ${type1}`}>{type1}</p>
                        {type2 && <p className={`type2 ${type2}`}>{type2}</p>}
                    </div>
                ) : (
                    // Use the new PokedexCardDetails component
                    <PokedexCardDetails abilities={abilities} stats={stats} maxStat={maxStat} />
                )}
            </div>
        </li>
    );
}
