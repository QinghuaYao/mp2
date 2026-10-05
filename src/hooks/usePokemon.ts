import { useEffect, useState } from 'react';
import { fetchAllPokemon } from '../api/pokeapi';
import type { Pokemon } from '../types/pokemon';

export function usePokemon() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllPokemon()
      .then((list) => { if (!cancelled) setPokemon(list); })
      .catch(() => { if (!cancelled) setError('Could not load Pokémon. Please try again later.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { pokemon, loading, error };
}