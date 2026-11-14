import styles from './ProductInfo.module.css';
import AddToCartClient from './AddToCartClient';
import Link from 'next/link';

export default function ProductInfo({ product }) {
  return (
    <div className={styles.infoContainer}>
      
      {/* Title & Collection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
        <p className={styles.collectionName} style={{ margin: 0 }}>{product.collection}</p>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
          }}
        >
          In Stock · Ready to Ship
        </span>
      </div>
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

      {/* Client Component for interactivity (Color, Size, Buttons, VTON, Size Guide, Delivery T&C) */}
      <AddToCartClient variants={product.variants} colors={product.colors} product={product} />
    </div>
  );
}
