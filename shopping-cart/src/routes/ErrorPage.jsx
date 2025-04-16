import styles from '../css_modules/ErrorPage.module.css'
import Footer from '../components/Footer';
import { Box, Boxes } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.boxContainer}>
          <Box color='#e0e0e0' size={64} strokeWidth={0.5} />
          <p className={styles.name}>BoxCart</p>
        </div>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          Home
        </button>
      </div>
      <div className={styles.mainContainer}>
        <h1>Error</h1>
        <div className={styles.emptyBoxCart}>
          <Boxes strokeWidth={0.5} size={86} />
          <p>BoxCart's broken...</p>
        </div>
        <p>Bad URL</p>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default ErrorPage;