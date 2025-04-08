import styles from '../css_modules/Footer.module.css';

const Footer = () => {
  return (
    <main className={styles.mainContainer}>
      <p className={styles.header}>
        © 2025 BoxCart. All rights reserved.
        <br />
        Developed by{' '}
        <a href='https://github.com/gabriel-caesar' target='_blank'>
          Gabriel Caesar
        </a>
        .
      </p>
    </main>
  );
};

export default Footer;
