import { Box } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import styles from '../css_modules/Navbar.module.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className={styles.navContainer}>
      <div className={styles.firstContainer}>
        <Box color='#e0e0e0' size={64} strokeWidth={0.5} />
        <p className={styles.name}>BoxCart</p>
      </div>

      <Link to='boxcart' className={styles.link}>
        <button aria-label='shopping-cart' className={styles.boxCartButtonContainer}>
          <PackageOpen color='#283739' size={40} strokeWidth={0.5} />
          <span className={styles.itemsCount}>0</span>
        </button>
      </Link>

    </nav>
  );
};

export default Navbar;
