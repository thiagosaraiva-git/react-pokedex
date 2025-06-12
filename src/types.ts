export interface PokemonType {
    slot: number;
    type: { name: string; url: string; };
}

export interface PokemonAbility {
    ability: { name: string; url: string; };
    is_hidden: boolean;
    slot: number;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string; };
}

export interface PokemonHomeSprites {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface PokemonOfficialArtworkSprites {
    front_default: string | null;
}

export interface PokemonOtherSprites {
    home: PokemonHomeSprites;
    "official-artwork"?: PokemonOfficialArtworkSprites;
}

export interface PokemonSprites {
    front_default: string | null;
    front_shiny?: string | null;
    other?: PokemonOtherSprites;
}

export interface PokedexEntry {
    id: number;
    name: string;
    types: PokemonType[];
    sprites: PokemonSprites;
    abilities: PokemonAbility[];
    stats: PokemonStat[];
}
