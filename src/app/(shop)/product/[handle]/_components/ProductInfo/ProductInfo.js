import styles from './ProductInfo.module.css';
import AddToCartClient from './AddToCartClient';
import Link from 'next/link';

export default function ProductInfo({ product }) {
  return (
    <div className={styles.infoContainer}>
      
      {/* Title & Collection */}
      <p className={styles.collectionName}>{product.collection}</p>
      <h1 className={styles.title}>{product.title}</h1>
      
      {/* Price & Sales */}
      <div className={styles.priceRow}>
        <div className={styles.priceGroup}>
          <span className={styles.oldPrice}>{product.oldPrice}</span>
          <span className={styles.newPrice}>{product.price}</span>
        </div>
        <div className={styles.salesInfo}>
          {product.sold} Sold &bull; ⭐️ {product.rating}
        </div>
      </div>
      
      <hr className={styles.divider} />
      
      {/* Description */}
      <div className={styles.descriptionBlock}>
        <span className={styles.descriptionTitle}>Description:</span>
        <p className={styles.descriptionText}>
          {product.description} <span className={styles.seeMore}>See More....</span>
        </p>
      </div>

      {/* Client Component for interactivity (Color, Size, Buttons, VTON) */}
      <AddToCartClient variants={product.variants} colors={product.colors} product={product} />

      <Link href="#" className={styles.deliveryLink}>Delivery T&C</Link>
    </div>
  );
}
