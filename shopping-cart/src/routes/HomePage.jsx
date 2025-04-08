import styles from '../css_modules/HomePage.module.css';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.headerContainer}>Buy the most wanted items</h1>
      <div className={styles.caroselContainer}>
        <button className={styles.arrowButtons}>
          <ChevronLeft color='#a2c11c' strokeWidth={1} size={40}/>
        </button>
        <button className={styles.arrowButtons}>
          <ChevronRight color='#a2c11c' strokeWidth={1} size={40}/>
        </button>
      </div>
    </main>
  )
}

export default HomePage;