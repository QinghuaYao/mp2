import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import typeColors from '../styles/typeColors.module.css';
import styles from './GalleryView.module.css';

function GalleryView() {
  const { pokemon, loading, error } = usePokemon();
  const [searchParams, setSearchParams] = useSearchParams();

  // selected types live in the URL, e.g. /gallery?types=fire,water
  const selected = useMemo(
    () => searchParams.get('types')?.split(',').filter(Boolean) ?? [],
    [searchParams],
  );

  function setSelected(types: string[]) {
    setSearchParams(types.length ? { types: types.join(',') } : {}, { replace: true });
  }

  function toggleType(type: string) {
    setSelected(
      selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type],
    );
  }

  // every type that appears in the data, alphabetized
  const allTypes = useMemo(
    () => [...new Set(pokemon.flatMap((p) => p.types))].sort(),
    [pokemon],
  );

  // no selection → show all; otherwise keep Pokémon having ANY selected type
  const results = useMemo(
    () =>
      selected.length === 0
        ? pokemon
        : pokemon.filter((p) => p.types.some((t) => selected.includes(t))),
    [pokemon, selected],
  );

  const ids = results.map((p) => p.id);

  if (loading) return <p className={styles.status}>Loading Pokémon…</p>;
  if (error) return <p className={styles.status}>{error}</p>;

  return (
    <section className={styles.page}>
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Filter by type:</span>
        {allTypes.map((type) => {
          const isOn = selected.includes(type);
          return (
            <button
              key={type}
              type="button"
              aria-pressed={isOn}
              className={isOn ? `${styles.chip} ${typeColors[type]}` : styles.chip}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          );
        })}
        {selected.length > 0 && (
          <button type="button" className={styles.clear} onClick={() => setSelected([])}>
            Clear
          </button>
        )}
      </div>

      <p className={styles.count}>
        Showing {results.length} of {pokemon.length}
      </p>

      <ul className={styles.grid}>
        {results.map((p) => (
          <li key={p.id}>
            <Link to={`/pokemon/${p.id}`} state={{ ids }} className={styles.card}>
              <img src={p.image} alt={p.name} className={styles.image} loading="lazy" />
              <span className={styles.number}>#{String(p.id).padStart(3, '0')}</span>
              <span className={styles.name}>{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default GalleryView;