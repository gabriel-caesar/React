import {
  ChevronLeft,
  ChevronRight,
  PackageMinus,
  PackagePlus,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../components/reusable_components/Loading';
import styles from '../css_modules/HomePage.module.css';
import ProductItem from '../components/ProductItem';
import { useOutletContext } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchEngine, setSearchEngine] = useState('');
  const [ userObject, dispatch ] = useOutletContext();
  const user = auth.currentUser;

  const handleSearchEngine = (e) => setSearchEngine(e.target.value);

  const fetchAPI = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch API. ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
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

  const increment = async (product) => {
    // shallow copy of the updated user's cart array
    const updatedUserCart = userObject.cart.map((item) =>
      item.id === product.id ? { ...item, count: item.count + 1 } : item
    );

    try {
      await updateStateAndFirestore(updatedUserCart);
    } catch (error) {
      throw new Error(`Couldn't increment product. ${error.message}`);
    }
    
  };

  const decrement = async (product) => {
    // shallow copy of the updated user's cart array
    const updatedUserCart = userObject.cart
      .map((item) => {
        // map and the decrement the item that the user clicks
        if (item.id === product.id) {
          return { ...item, count: item.count - 1 };
        } else {
          return item;
        }
      })
      .filter((item) => item.count > 0); // at the same time filter all items to be item.count > 0

    try {
      await updateStateAndFirestore(updatedUserCart);
    } catch (error) {
      throw new Error(`Couldn't decrement product. ${error.message}`);
    }
  };

  const handleBuyAction = async (product) => {

    const newItem = {
      // new item being created
      name: product.title,
      price: product.price,
      id: product.id,
      count: 1,
    };

    // shallow copy
    const updatedUserCart = [...userObject.cart, newItem]

    try {
      await updateStateAndFirestore(updatedUserCart);
    } catch (error) {
      throw new Error(`Couldn't add the first product. ${error.message}`);
    }
  };

  // reusable function to update the local user state and the firebase user record
  async function updateStateAndFirestore(productObj) {
    const userRef = doc(db, 'users', user.uid); // user reference from db
    await updateDoc(userRef, { cart: productObj }); // updates the firestore
    const updatedUser = { ...userObject, cart: productObj };
    return dispatch({type: 'update-user', payload: updatedUser}); // updates the user object
  }

  useEffect(() => {
    fetchAPI();
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
          placeholder={userObject ? 'Search for a product to box...' : 'Log in to begin your search...'}
          onChange={(e) => handleSearchEngine(e)}
          // clicking 'Esc' closes the dropdown
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.target.blur();
              return setSearchEngine('');
            }
          }}
          value={searchEngine}
          disabled={userObject ? false : true}
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
                        {userObject.cart.some((p) => p.name === product.title) ? (
                          <span className={styles.spanContainer}>
                            <button
                              className={styles.decrementButton}
                              onClick={() => decrement(product)}
                              data-testid='decrement-button'
                            >
                              <PackageMinus size={28} strokeWidth={1} />
                            </button>
                            <p aria-label='item-count'>
                              {userObject.cart.find((p) => p.name === product.title).count}
                            </p>
                            <button
                              className={styles.incrementButton}
                              onClick={() => increment(product)}
                              data-testid='increment-button'
                            >
                              <PackagePlus size={28} strokeWidth={1} />
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBuyAction(product)}
                            className={styles.buyButton}
                            disabled={auth.currentUser ? false : true}
                          >
                            {auth.currentUser ? 'Buy' : 'Log In to buy'}
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
                cart={userObject !== null ? userObject.cart : []}
              />
              <ProductItem
                item={products[1]}
                decrement={decrement}
                increment={increment}
                handleBuyAction={handleBuyAction}
                cart={userObject !== null ? userObject.cart : []}
              />
              <ProductItem
                item={products[2]}
                decrement={decrement}
                increment={increment}
                handleBuyAction={handleBuyAction}
                cart={userObject !== null ? userObject.cart : []}
              />
            </>
          ) : (
            <Loading />
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
