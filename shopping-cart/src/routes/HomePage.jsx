import styles from '../css_modules/HomePage.module.css';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductItem from '../components/ProductItem';
import { Search } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    setProducts(data);
  };

  const slideRight = () => {
    const copy = products.slice(0);
    const fItem = copy.shift();
    copy.push(fItem);
    setProducts(copy);
  }

  const slideLeft = () => {
    const copy = products.slice(0);
    const fItem = copy.pop();
    copy.unshift(fItem);
    setProducts(copy);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.headerContainer}>Shop... eh.., BOX our products!</h1>

      <label htmlFor='searchForItemsInput' className={styles.inputContainer}>
        <input
          type='text'
          id='searchForItemsInput'
          className={styles.searchInput}
          placeholder='Search for a product to box...'
        />
        <div className={styles.searchMagnifier}>
          <Search color='#e3f6f5' size={24} />
        </div>
      </label>

      <div className={styles.caroselContainer}>
        <button onClick={() => slideLeft()} className={styles.arrowButtons}>
          <ChevronLeft color='#a2c11c' strokeWidth={1} size={40} />
        </button>
        <div className={styles.itemsContainer}>
          {products.length !== 0 ? (
            <>
              <ProductItem item={products[0]} />
              <ProductItem item={products[1]} />
              <ProductItem item={products[2]} />
            </>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
        <button onClick={() => slideRight()} className={styles.arrowButtons}>
          <ChevronRight color='#a2c11c' strokeWidth={1} size={40} />
        </button>
      </div>
    </main>
  );
};

export default HomePage;
