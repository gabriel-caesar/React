import { Box } from 'lucide-react';
import { Search } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import styles from '../css_modules/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navContainer}>
      <div className={styles.firstContainer}>
        <Box color='#e0e0e0' size={64} strokeWidth={0.5} />
        <p className={styles.name}>BoxCart</p>
      </div>

      <label htmlFor='searchForItemsInput' className={styles.secondContainer}>
        <input
          type='text'
          id='searchForItemsInput'
          className={styles.searchInput}
        />
        <div className={styles.searchMagnifier}>
          <Search color='#283739' size={24} />
        </div>
      </label>

      <button className={styles.boxCartButtonContainer}>
        <PackageOpen color='#283739' size={40} strokeWidth={0.5} />
        <span className={styles.itemsCount}>0</span>
      </button>
    </nav>
  );
};

export default Navbar;
