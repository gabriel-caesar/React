import { Link, useOutletContext } from 'react-router-dom';
import styles from '../css_modules/CartPage.module.css';
import { Boxes, Minus, Plus } from 'lucide-react';

const CartPage = () => {
  const [cart, setCart] = useOutletContext();

  const clearAllItems = () => {
    localStorage.clear();
    setCart([]);
  };

  const increment = (product) => {
    // add more of the given product to the shopping cart
    setCart((prev) =>
      prev.map((item) =>
        item.name === product.name ? { ...item, count: item.count + 1 } : item
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
            if (item.name === product.name) {
              return { ...item, count: item.count - 1 };
            } else {
              return item;
            }
          })
          .filter((item) => item.count > 0) // at the same time filter all items to be item.count > 0
    );
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.secondContainer}>
        <div className={styles.itemTable}>
          {cart.length > 0 ? (
            cart.map((product) => {
              return (
                <div key={product.id} className={styles.wrapper}>
                  <span className={styles.productCount}>{product.count}</span>
                  <div className={styles.verticalItemCards}>
                    <p className={styles.productName}>{product.name}</p>
                    <p className={styles.productPrice}>${product.price}</p>
                  </div>
                  <button
                    onClick={() => decrement(product)}
                    className={styles.productDeleteButton}
                  >
                    <Minus strokeWidth={2} size={30} />
                  </button>
                  <button
                    onClick={() => increment(product)}
                    className={styles.productAddButton}
                  >
                    <Plus strokeWidth={2} size={30} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyBoxCart}>
              <Boxes strokeWidth={0.5} size={86} />
              <p>Box cart's empty...</p>
            </div>
          )}
          {cart.length > 0 && (
            <button
              onClick={() => clearAllItems()}
              className={styles.clearAllButton}
            >
              Clear all
            </button>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          <Link to='/' className={styles.backHomeButton}>
            Back Home
          </Link>
          {cart.length > 0 && (
            <Link to='checkout' className={styles.checkoutButton}>
              Checkout
            </Link>
          )}
          <span className={styles.totalAmount}>
            Total:
            <span className={styles.amountNumber}>
              $
              {cart
                .reduce((acc, item) => acc + item.price * item.count, 0)
                .toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
