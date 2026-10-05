import axios from 'axios';
import type { Pokemon, PokemonApiResponse } from '../types/pokemon';

const api = axios.create({ baseURL: 'https://pokeapi.co/api/v2' });

export const POKEMON_COUNT = 151;

function toPokemon(raw: PokemonApiResponse): Pokemon {
  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience ?? 0,
    types: raw.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
    image:
      raw.sprites.other?.['official-artwork']?.front_default ??
      raw.sprites.front_default ??
      '',
    sprite: raw.sprites.front_default ?? '',
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    abilities: raw.abilities.map((a) => a.ability.name),
  };
}
let cache: Promise<Pokemon[]> | null = null;

export function fetchAllPokemon(): Promise<Pokemon[]> {
  if (!cache) {
    const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1);
    cache = Promise.all(
      ids.map((id) =>
        api.get<PokemonApiResponse>(`/pokemon/${id}`).then((res) => toPokemon(res.data)),
      ),
    ).catch((err) => {
      cache = null;   // so a failed load can be retried
      throw err;
    });
  }
  return cache;
}