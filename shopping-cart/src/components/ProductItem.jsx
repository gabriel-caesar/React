import styles from '../css_modules/ProductItem.module.css';

const ProductItem = ({ item }) => {
  return(
    <div className={styles.carouselItem}>
      <div className={styles.wrapper}>
        <img src={item.image} alt="item-image" className={styles.image}/>
        <span className={styles.wrapper2}>
          <p>${item.price}</p>
          <button className={styles.buyButton}>Buy</button>
        </span>
      </div>
      <h3 className={styles.title}>{item.title}</h3>
    </div>
  )
}

export default ProductItem;