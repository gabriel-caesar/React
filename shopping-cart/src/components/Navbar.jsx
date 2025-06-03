import { Box } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import styles from '../css_modules/Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ userObject, setGoToCheckout, setIsUserLogged, setBridge }) => {

  const [itemCount, setItemCount] = useState(
    // initializing the purchased items count
    userObject && userObject.cart.reduce((acc, item) => acc + item.count, 0)
  );

  // redirect user
  const navigate = useNavigate();

  // signs user out, navigate to main page and reloads the browser
  async function handleLogOut() {
    await signOut(auth);
    setIsUserLogged(false); // updating logged state
    navigate('/');
    return window.location.reload()
  }

  // useEffect updates the count whenever the user adds or takes away a item
  useEffect(() => {
    if (userObject) setItemCount(userObject.cart.reduce((acc, item) => acc + item.count, 0));
  }, [userObject]);

  return (
    <nav className={styles.navContainer}>
      
      <div className={styles.firstContainer} onClick={() => {
                setGoToCheckout(false);
                return navigate('/');
              }}>
        <Box color='#e0e0e0' size={64} strokeWidth={0.5} />
        <p className={styles.name}>BoxCart</p>
      </div>
      

      {(auth.currentUser && userObject) ? (
        <div className={styles.wrapper}>
          <h2 className={styles.greetings}>Hello, {userObject.firstName}!</h2>
          <span
            className={styles.accountLink}
            onClick={() => navigate('/account')}
          >
            Account
          </span>
          <span
            className={styles.accountLink}
            onClick={async () => handleLogOut()}
          >
            Log Out
          </span>
          <Link to='boxcart' className={styles.link}>
            <button
              aria-label='shopping-cart-button'
              className={styles.boxCartButtonContainer}
            >
              <PackageOpen color='#283739' size={40} strokeWidth={0.5} />
              <span className={styles.itemsCount}>{itemCount}</span>
            </button>
          </Link>
        </div>
      ) : (
        <span className={styles.LogInButtonContainer}>
          <Link to='login'>
            <button className={styles.logInButton}>Log In</button>
          </Link>
          <Link to='signup'>
            <button className={styles.signUpButton} onClick={() => setBridge(false)}>Sign Up</button>
          </Link>
        </span>
      )}
    </nav>
  );
};

export default Navbar;
