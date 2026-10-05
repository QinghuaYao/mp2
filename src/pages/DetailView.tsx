import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import typeColors from '../styles/typeColors.module.css';
import styles from './DetailView.module.css';

interface DetailState {
  ids?: number[];
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

function DetailView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { pokemon, loading, error } = usePokemon();

  if (loading) return <p className={styles.status}>Loading Pokémon…</p>;
  if (error) return <p className={styles.status}>{error}</p>;

  const currentId = Number(id);
  const current = pokemon.find((p) => p.id === currentId);

  if (!current) {
    return (
      <div className={styles.status}>
        <p>No Pokémon with id “{id}”.</p>
        <Link to="/">Back to the list</Link>
      </div>
    );
  }

  // the list the user came from, or all Pokémon if opened directly by URL
  const fromState = (location.state as DetailState | null)?.ids;
  const ids =
    fromState && fromState.includes(currentId) ? fromState : pokemon.map((p) => p.id);

  const index = ids.indexOf(currentId);
  const prevId = ids[(index - 1 + ids.length) % ids.length];
  const nextId = ids[(index + 1) % ids.length];

  return (
    <article className={styles.page}>
      <div className={styles.topBar}>
        {fromState ? (
          <button type="button" className={styles.back} onClick={() => navigate(-1)}>
            ← Back
          </button>
        ) : (
          <Link to="/" className={styles.back}>
            ← All Pokémon
          </Link>
        )}
        <span className={styles.position}>
          {index + 1} of {ids.length}
        </span>
      </div>

      <div className={styles.card}>
        <Link
          to={`/pokemon/${prevId}`}
          state={{ ids }}
          replace
          className={styles.arrow}
          aria-label="Previous Pokémon"
        >
          ‹
        </Link>

        <div className={styles.content}>
          <img src={current.image} alt={current.name} className={styles.image} />

          <div>
            <p className={styles.number}>#{String(current.id).padStart(3, '0')}</p>
            <h1 className={styles.name}>{current.name}</h1>

            <div className={styles.types}>
              {current.types.map((t) => (
                <span key={t} className={`${styles.badge} ${typeColors[t]}`}>
                  {t}
                </span>
              ))}
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>Height</dt>
                <dd>{(current.height / 10).toFixed(1)} m</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{(current.weight / 10).toFixed(1)} kg</dd>
              </div>
              <div>
                <dt>Base XP</dt>
                <dd>{current.baseExperience}</dd>
              </div>
              <div>
                <dt>Abilities</dt>
                <dd>{current.abilities.map((a) => a.replace('-', ' ')).join(', ')}</dd>
              </div>
            </dl>

            <h2 className={styles.statsTitle}>Base stats</h2>
            <ul className={styles.stats}>
              {current.stats.map((s) => (
                <li key={s.name} className={styles.stat}>
                  <span className={styles.statName}>{STAT_LABELS[s.name] ?? s.name}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <progress className={styles.bar} max={255} value={s.value} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          to={`/pokemon/${nextId}`}
          state={{ ids }}
          replace
          className={styles.arrow}
          aria-label="Next Pokémon"
        >
          ›
        </Link>
      </div>
    </article>
  );
}

export default DetailView;