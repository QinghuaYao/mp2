// Clean shape the app uses
export interface Pokemon {
    id: number;
    name: string;
    height: number;          // decimetres (API unit)
    weight: number;          // hectograms (API unit)
    baseExperience: number;
    types: string[];         // e.g. ["grass", "poison"]
    image: string;           // official artwork (big, for gallery/detail)
    sprite: string;          // small pixel sprite (for list rows)
    stats: { name: string; value: number }[];
    abilities: string[];
  }
  
  // Raw API response — only the fields we use
  export interface PokemonApiResponse {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number | null;
    types: { slot: number; type: { name: string } }[];
    sprites: {
      front_default: string | null;
      other?: { 'official-artwork'?: { front_default: string | null } };
    };
    stats: { base_stat: number; stat: { name: string } }[];
    abilities: { ability: { name: string } }[];
  }