import { PokedexEntry } from '../../types';
import './styles.scss';

interface PokedexCardDetailsProps {
    abilities: PokedexEntry['abilities'];
    stats: PokedexEntry['stats'];
    maxStat: number;
}

export function PokedexCardDetails({ abilities, stats, maxStat }: PokedexCardDetailsProps) {
    const ability1 = abilities?.[0]?.ability?.name;
    const ability2 = abilities?.[1]?.ability?.name;
    const ability3 = abilities?.[2]?.ability?.name;

    const hp = stats?.[0]?.base_stat || 0;
    const attack = stats?.[1]?.base_stat || 0;
    const defense = stats?.[2]?.base_stat || 0;
    const special_attack = stats?.[3]?.base_stat || 0;
    const special_defense = stats?.[4]?.base_stat || 0;
    const speed = stats?.[5]?.base_stat || 0;

    return (
        <div className="card-back-details">
            <h4>Abilities:</h4>
            <ul>
                {ability1 && <li>{ability1}</li>}
                {ability2 && <li>{ability2}</li>}
                {ability3 && <li>{ability3}</li>}
                {(!ability1 && !ability2 && !ability3) && <li>No abilities listed</li>}
            </ul>
            <br />
            <h4>Base Stats:</h4>
            <ul>
                <li><p>HP: <progress value={hp} max={maxStat} /> {hp}</p></li>
                <li><p>Attack: <progress value={attack} max={maxStat} /> {attack}</p></li>
                <li><p>Defense: <progress value={defense} max={maxStat} /> {defense}</p></li>
                <li><p>Sp. Attack: <progress value={special_attack} max={maxStat} /> {special_attack}</p></li>
                <li><p>Sp. Defense: <progress value={special_defense} max={maxStat} /> {special_defense}</p></li>
                <li><p>Speed: <progress value={speed} max={maxStat} /> {speed}</p></li>
            </ul>
        </div>
    );
}
