import styles from '../css_modules/ProductItem.module.css';
import PropTypes from 'prop-types';
import { PackagePlus } from 'lucide-react';
import { PackageMinus } from 'lucide-react';

const ProductItem = ({ item, cart, increment, decrement, handleBuyAction }) => {

  return (
    <div className={styles.carouselItem}>
      <div className={styles.wrapper}>
        <img src={item.image} alt='item-image' className={styles.image} />
        <span className={styles.wrapper2}>
          <p>${item.price}</p>
          {cart.some((p) => p.name === item.title) ? (
            <span className={styles.spanContainer}>
              <button
                className={styles.incrementButton}
                onClick={() => increment(item)}
                data-testid='increment-button'
              >
                <PackagePlus size={32} strokeWidth={1}/>
              </button>
              {cart.find((p) => p.name === item.title).count}
              <button
                className={styles.decrementButton}
                onClick={() => decrement(item)}
                data-testid='decrement-button'
              >
                <PackageMinus size={32} strokeWidth={1}/>
              </button>
            </span>
          ) : (
            <button
              onClick={() => handleBuyAction(item)}
              className={styles.buyButton}
            >
              Buy
            </button>
          )}
        </span>
      </div>
      <h3 className={styles.title}>{item.title}</h3>
    </div>
  );
};

// ProductItem.PropTypes = { // defining this component's types
//   item: PropTypes.object,
// }

// PropTypes slows the carousel down, I will avoid it

export default ProductItem;
