import { useState } from 'react';
import styles from '../css_modules/Checkout.module.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Truck, Boxes, LoaderCircle, Coffee } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Loading from '../components/reusable_components/Loading';

const Checkout = () => {
  const [userObject, setGoToCheckout, dispatch] = useOutletContext();

  const [toggleDonation, setToggleDonation] = useState(true);

  const cart = userObject.cart;
  const finalAmount = cart
    .reduce((acc, item) => acc + item.price * item.count, 0)
    .toFixed(2);

  const deliveryFee = (finalAmount * 0.12).toFixed(2);

  const taxes = (finalAmount * 0.05).toFixed(2);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const payForProducts = () => {
    setLoading(true);
    setTimeout(async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { cart: [] }); // clears user's cart array
      const updatedUser = { ...userObject, cart: [] }; // state payload
      dispatch({ type: 'update-user', payload: updatedUser }); // sends the action to the reducer function
      setLoading(false);
      setPaymentComplete(true);
    }, 5000);
  };

  return (
    <div className={styles.checkoutTable}>
      {userObject ? (
        loading ? (
          <div className={styles.spinnerContainer}>
            <LoaderCircle className={styles.spinnerIcon} />
            <span className={styles.loadingText}>Processing payment...</span>
          </div>
        ) : paymentComplete ? (
          <div className={styles.successfulPayment}>
            <h1>Your payment was accepted</h1>
            <div className={styles.boxes}>
              <Boxes strokeWidth={0.5} size={86} />
              <p>Thank you for choosing BoxCart</p>
            </div>
            <div className={styles.infoContainer}>
              <p>Your order is on its way!</p>
              ...
              <Truck strokeWidth={1} size={40} />
            </div>
            <button
              className={styles.backButton}
              onClick={() => {
                navigate('/');
                window.location.reload(); // fetches the user with useEffect
              }}
            >
              Home
            </button>
          </div>
        ) : (
          <>
            <span className={styles.headerContainer}>
              <div
                className={`${styles.selector} `}
                style={{
                  left: toggleDonation ? 'calc(100% - 151px - 1%)' : '1%',
                }}
              ></div>
              <h1
                className={styles.checkout}
                onClick={() => {
                  return setToggleDonation(false);
                }}
              >
                Checkout
              </h1>
              <h1
                className={styles.donation}
                onClick={() => {
                  return setToggleDonation(true);
                }}
              >
                Donation
              </h1>
            </span>
            {!toggleDonation ? (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>
                  Fake payment implementation
                </h3>
                <div className={styles.feeContainer}>
                  <p>Delivery fee</p>
                  <h3>${deliveryFee}</h3>
                </div>
                <div className={styles.feeContainer}>
                  <p>Taxes</p>
                  <h3>${taxes}</h3>
                </div>
                <div className={styles.feeContainer}>
                  <p>Products purchased</p>
                  <h3>${finalAmount}</h3>
                </div>
                <div className={styles.totalAmountContainer}>
                  <p>Total</p>
                  <h1>
                    $
                    {(
                      parseFloat(finalAmount) +
                      parseFloat(deliveryFee) +
                      parseFloat(taxes)
                    ).toFixed(2)}
                  </h1>
                </div>
                <div className={styles.buttonsContainer}>
                  <button
                    className={styles.backButton}
                    onClick={() => {
                      setGoToCheckout(false);
                      return navigate(-1);
                    }}
                  >
                    Back
                  </button>
                  <button
                    className={styles.payButton}
                    onClick={() => payForProducts()}
                  >
                    Pay
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Real payment implementation</h3>

                <button
                  className={styles.buyMeCoffee}
                  onClick={() =>
                    (window.location.href =
                      'https://buy.stripe.com/aFabJ36DX5Ph5KN598bV600')
                  }
                >
                  Buy me a coffee
                  <Coffee strokeWidth={1} size={38} />
                </button>

                <p className={styles.poweredByStripe}>Powered by Stripe</p>
              </>
            )}
          </>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Checkout;
