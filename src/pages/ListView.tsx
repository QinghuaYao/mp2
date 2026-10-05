import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import type { Pokemon } from '../types/pokemon';
import typeColors from '../styles/typeColors.module.css';
import styles from './ListView.module.css';

type SortKey = 'id' | 'name' | 'weight' | 'height' | 'baseExperience';
type SortOrder = 'asc' | 'desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id', label: 'Pokédex #' },
  { value: 'name', label: 'Name' },
  { value: 'weight', label: 'Weight' },
  { value: 'height', label: 'Height' },
  { value: 'baseExperience', label: 'Base XP' },
];

function compare(a: Pokemon, b: Pokemon, key: SortKey): number {
  if (key === 'name') return a.name.localeCompare(b.name);
  return a[key] - b[key];
}

function ListView() {
  const { pokemon, loading, error } = usePokemon();
  const [searchParams, setSearchParams] = useSearchParams();

  // search / sort / order live in the URL, e.g. /?q=char&sort=weight&order=desc
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const sortParam = searchParams.get('sort');
  const sortKey: SortKey = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? (sortParam as SortKey)
    : 'id';
  const order: SortOrder = searchParams.get('order') === 'desc' ? 'desc' : 'asc';

  function updateParam(key: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = pokemon
      .filter((p) => p.name.includes(q) || String(p.id) === q)
      .sort((a, b) => compare(a, b, sortKey));
    return order === 'asc' ? sorted : sorted.reverse();
  }, [pokemon, query, sortKey, order]);

  const ids = results.map((p) => p.id);

  if (loading) return <p className={styles.status}>Loading Pokémon…</p>;
  if (error) return <p className={styles.status}>{error}</p>;

  return (
    <section className={styles.page}>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search by name or #…"
          aria-label="Search Pokémon"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateParam('q', e.target.value);
          }}
        />
        <label className={styles.sortLabel}>
          Sort by
          <select value={sortKey} onChange={(e) => updateParam('sort', e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={styles.orderButton}
          onClick={() => updateParam('order', order === 'asc' ? 'desc' : 'asc')}
        >
          {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      <p className={styles.count}>
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <p className={styles.status}>No Pokémon match “{query}”.</p>
      ) : (
        <ul className={styles.list}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} state={{ ids }} className={styles.row}>
                <img src={p.sprite} alt={p.name} className={styles.sprite} loading="lazy" />
                <span className={styles.number}>#{String(p.id).padStart(3, '0')}</span>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.types}>
                  {p.types.map((t) => (
                    <span key={t} className={`${styles.badge} ${typeColors[t]}`}>{t}</span>
                  ))}
                </span>
                <span className={styles.meta}>
                  {(p.weight / 10).toFixed(1)} kg · {(p.height / 10).toFixed(1)} m · {p.baseExperience} XP
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ListView;