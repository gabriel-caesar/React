import styles from '../../css_modules/Loading.module.css';
import { LoaderCircle  } from 'lucide-react';

function Loading({ marginTop }) {
  return (
    <div className={styles.spinnerContainer}>
      <LoaderCircle className={styles.spinnerIcon} style={{marginTop: marginTop}}/>
    </div>
  );
}

export default Loading;
