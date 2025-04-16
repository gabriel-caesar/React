import {
  ChevronLeft,
  LoaderCircle,
  ChevronRight,
  PackageMinus,
  PackagePlus,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import styles from '../css_modules/HomePage.module.css';
import ProductItem from '../components/ProductItem';
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchEngine, setSearchEngine] = useState('');
  const [cart, setCart] = useOutletContext();

  const handleSearchEngine = (e) => setSearchEngine(e.target.value);

  const fetchData = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch API. ${response.status}`)
      }
      const data = await response.json();
      setProducts(data);
    } catch(error) {
      console.error(error.message);
    }
  };

  const slideRight = (array) => {
    if (array.length !== 0) {
      const copy = array.slice(0);
      const fItem = copy.shift();
      copy.push(fItem);
      setProducts(copy);
    }
  };

  const slideLeft = (array) => {
    if (array.length !== 0) {
      const copy = array.slice(0);
      const fItem = copy.pop();
      copy.unshift(fItem);
      setProducts(copy);
    }
  };

  const increment = (product) => {
    // add more of the given product to the shopping cart
    setCart((prev) =>
      prev.map((item) =>
        item.name === product.title ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const decrement = (product) => {
    // take away the given product to the shopping cart
    setCart(
      (prev) =>
        prev
          .map((item) => {
            // map and the decrement the item that the user clicks
            if (item.name === product.title) {
              return { ...item, count: item.count - 1 };
            } else {
              return item;
            }
          })
          .filter((item) => item.count > 0) // at the same time filter all items to be item.count > 0
    );
  };

  const handleBuyAction = (product) => {
    setCart((prev) => {
      const newItem = {
        // new item being created
        name: product.title,
        price: product.price,
        id: product.id,
        count: 1,
      };
      return [...prev, newItem]; // spread the previous items in the cart alongside the new one
    }); // updating the cart array
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.headerContainer}>
        Shop... eh.., BOX our products!
      </h1>

      <label htmlFor='searchForItemsInput' className={styles.inputContainer}>
        <input
          type='text'
          id='searchForItemsInput'
          className={styles.searchInput}
          placeholder='Search for a product to box...'
          onChange={(e) => handleSearchEngine(e)}
          onKeyDown={(e) => e.key === 'Escape' && e.target.blur()}
          value={searchEngine}
        />
        <div className={styles.searchMagnifier}>
          <Search color='#e3f6f5' size={24} />
        </div>
        <div
          className={`${styles.searchDropdownContainer} ${searchEngine === '' ? styles.hidden : ''}`}
        >
          {searchEngine !== '' &&
            products.map((product) => {
              // checks the user input against the products
              const search = new RegExp(`\\b${searchEngine}`, 'i'); // \\b finds a full word
              if (search.test(product.title)) {
                // if there are any matches
                return (
                  <div key={product.id} className={styles.dropdownCard}>
                    <span className={styles.spanWrapper}>
                      <p>{product.title}</p>
                      <div className={styles.wrapperDiv}>
                        <h1>${product.price}</h1>
                        {cart.some((p) => p.name === product.title) ? (
                          <span className={styles.spanContainer}>
                            <button
                              className={styles.incrementButton}
                              onClick={() => increment(product)}
                              data-testid='increment-button'
                            >
                              <PackagePlus size={28} strokeWidth={1} />
                            </button>
                            <p aria-label='item-count'>
                              {cart.find((p) => p.name === product.title).count}
                            </p>
                            <button
                              className={styles.decrementButton}
                              onClick={() => decrement(product)}
                              data-testid='decrement-button'
                            >
                              <PackageMinus size={28} strokeWidth={1} />
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBuyAction(product)}
                            className={styles.buyButton}
                          >
                            Buy
                          </button>
                        )}
                      </div>
                    </span>
                    <img
                      src={product.image}
                      alt={`${product.title}_image`}
                      className={styles.image}
                    />
                  </div>
                );
              }
            })}
        </div>
      </label>

      <div className={styles.caroselContainer}>
        <button
          onClick={() => slideLeft(products)}
          className={styles.arrowButtons}
          aria-label='slideLeftButton'
        >
          <ChevronLeft color='#a2c11c' strokeWidth={1} size={40} />
        </button>
        <div className={styles.itemsContainer}>
          {products.length !== 0 ? (
            <>
              <ProductItem
                item={products[0]}
                decrement={decrement}
                increment={increment}
                handleBuyAction={handleBuyAction}
                cart={cart}
              />
              <ProductItem
                item={products[1]}
                decrement={decrement}
                increment={increment}
                handleBuyAction={handleBuyAction}
                cart={cart}
              />
              <ProductItem
                item={products[2]}
                decrement={decrement}
                increment={increment}
                handleBuyAction={handleBuyAction}
                cart={cart}
              />
            </>
          ) : (
            <div className={styles.spinnerContainer}>
              <LoaderCircle className={styles.spinnerIcon} />
            </div>
          )}
        </div>
        <button
          onClick={() => slideRight(products)}
          className={styles.arrowButtons}
          aria-label='slideRightButton'
        >
          <ChevronRight color='#a2c11c' strokeWidth={1} size={40} />
        </button>
      </div>
    </main>
  );
};

export default HomePage;
