import styles from '../css_modules/Footer.module.css';

const Footer = () => {
  return (
    <main className={styles.mainContainer}>
      <p className={styles.header} data-testid='footer-text'>
        © 2025 BoxCart. All rights reserved.
        <br />
        Developed by{' '}
        <a href='https://github.com/gabriel-caesar' target='_blank' data-testid='github-href'>
          Gabriel Caesar
        </a>
        .
      </p>
    </main>
  );
};

export default Footer;
