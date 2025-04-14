import { useState } from 'react';
import styles from '../css_modules/Checkout.module.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { Truck, Boxes } from 'lucide-react';

const Checkout = () => {
  const [cart, setCart] = useOutletContext();
  const [finalAmount, setFinalAmout] = useState(
    cart.reduce((acc, item) => acc + item.price * item.count, 0).toFixed(2)
  );
  const [serviceFee, setServiceFee] = useState(
    (finalAmount * 0.041).toFixed(2)
  );
  const [deliveryFee, setDeliveryFee] = useState(
    (finalAmount * 0.12).toFixed(2)
  );
  const [taxes, setTaxes] = useState((finalAmount * 0.05).toFixed(2));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const payForProducts = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      setCart([]);
      setLoading(false);
      setPaymentComplete(true);
    }, 5000);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.checkoutTable}>
        {loading ? (
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
            <button className={styles.backButton} onClick={() => navigate('/')}>
              Home
            </button>
          </div>
        ) : (
          <>
            <h1>Checkout</h1>
            <div className={styles.feeContainer}>
              <p>Service fee</p>
              <h3>${serviceFee}</h3>
            </div>
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
                  parseFloat(serviceFee) +
                  parseFloat(deliveryFee) +
                  parseFloat(taxes)
                ).toFixed(2)}
              </h1>
            </div>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
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
        )}
      </div>
    </main>
  );
};

export default Checkout;
