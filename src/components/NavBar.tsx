import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

function linkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function NavBar() {
  return (
    <header className={styles.header}>
      <NavLink to="/" end className={styles.brand}>
        Pokédex
      </NavLink>
      <nav className={styles.nav}>
        <NavLink to="/" end className={linkClass}>
          List
        </NavLink>
        <NavLink to="/gallery" className={linkClass}>
          Gallery
        </NavLink>
      </nav>
    </header>
  );
}

export default NavBar;