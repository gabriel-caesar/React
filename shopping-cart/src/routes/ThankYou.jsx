import { useNavigate } from 'react-router-dom';
import styles from '../css_modules/ThankYou.module.css';
import { Coffee, Boxes } from 'lucide-react';

function ThankYou() {

  const navigate = useNavigate();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.thanksContainer}>
        <div className={styles.successfulPayment}>
            <h1>Your donation was successful</h1>
            <div className={styles.boxes}>
              <Boxes strokeWidth={0.5} size={86} />
              <p>Thank you for the support</p>
            </div>
            <div className={styles.infoContainer}>
              <p>Now let me enjoy my coffee...</p>
              <Coffee strokeWidth={1} size={40} />
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
      </div>
    </div>
  );
}

export default ThankYou;
