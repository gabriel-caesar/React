import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../css_modules/CartPage.module.css';
import { Boxes, Minus, Plus } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Loading from '../components/reusable_components/Loading';

const CartPage = () => {
  const [userObject, dispatch, goToCheckout, setGoToCheckout] =
    useOutletContext();

  const navigate = useNavigate();

  const user = auth.currentUser;

  const clearAllItems = async () => {
    const userRef = doc(db, 'users', user.uid); // user reference from db
    await updateDoc(userRef, { cart: [] }); // updates the firestore
    const updatedUser = { ...userObject, cart: [] };
    return dispatch({ type: 'update-user', payload: updatedUser }); // updates the user object
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

  // reusable function to update the local user state and the firebase user record
  async function updateStateAndFirestore(productObj) {
    const userRef = doc(db, 'users', user.uid); // user reference from db
    await updateDoc(userRef, { cart: productObj }); // updates the firestore
    const updatedUser = { ...userObject, cart: productObj };
    return dispatch({ type: 'update-user', payload: updatedUser }); // updates the user object
  }

  return (
    <main className={styles.mainContainer}>
      {userObject ? (
        goToCheckout ? (
          <Outlet context={[userObject, setGoToCheckout, dispatch]} />
        ) : (
          <div className={styles.secondContainer}>
            <div className={styles.itemTable}>
              {userObject.cart.length > 0 ? (
                userObject.cart.map((product) => {
                  return (
                    <div key={product.id} className={styles.wrapper}>
                      <span className={styles.productCount}>
                        {product.count}
                      </span>
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
              {userObject.cart.length > 0 && (
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
              {userObject.cart.length > 0 && (
                <button
                  className={styles.checkoutButton}
                  onClick={() => {
                    setGoToCheckout(true);
                    return navigate('checkout');
                  }}
                >
                  Checkout
                </button>
              )}
              <span className={styles.totalAmount}>
                Total:
                <span className={styles.amountNumber}>
                  $
                  {userObject.cart
                    .reduce((acc, item) => acc + item.price * item.count, 0)
                    .toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        )
      ) : (
        <Loading />
      )}
    </main>
  );
};

export default CartPage;
