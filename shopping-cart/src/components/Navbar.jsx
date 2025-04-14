import { Box } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import styles from '../css_modules/Navbar.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ cart }) => {

  const [itemCount, setItemCount] = useState( // initializing the purchased items count
    cart.reduce((acc, item) => acc + item.count, 0)
  );

  useEffect(() => { // this updates the count whenever the user adds or takes away a item
    setItemCount(cart.reduce((acc, item) => acc + item.count, 0))
  }, [cart]);

  return (
    <nav className={styles.navContainer}>
      <div className={styles.firstContainer}>
        <Box color='#e0e0e0' size={64} strokeWidth={0.5} />
        <p className={styles.name}>BoxCart</p>
      </div>

      <Link to='boxcart' className={styles.link}>
        <button
          aria-label='shopping-cart-button'
          className={styles.boxCartButtonContainer}
        >
          <PackageOpen color='#283739' size={40} strokeWidth={0.5} />
          <span className={styles.itemsCount}>{itemCount}</span>
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;