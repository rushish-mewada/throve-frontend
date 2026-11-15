"use client";

import { useState } from 'react';
import styles from './ProductInfo.module.css';
import AddToCartClient from './AddToCartClient';

export default function ProductInfo({ product, config }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.infoContainer}>

      {/* Title & Collection */}
      <p className={styles.collectionName}>{product.collection || 'Collection'}</p>
      <h1 className={styles.title}>{product.title}</h1>

      {/* Price & Capsules */}
      <div className={styles.priceRow}>
        <div className={styles.priceGroup}>
          {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice}</span>}
          <span className={styles.newPrice}>{product.price}</span>
        </div>

        <div className={styles.metaGroup}>
          {product.inStock !== false ? (
            <div className={styles.stockCapsule} aria-label="Status: In Stock">
              <span className={styles.stockDot} aria-hidden="true" />
              <span>In Stock</span>
            </div>
          ) : (
            <div className={`${styles.stockCapsule} ${styles.outOfStockCapsule}`} aria-label="Status: Out of Stock">
              <span>Out of Stock</span>
            </div>
          )}

          {product.sold && product.sold !== "0" && product.sold !== 0 && (
            <div className={styles.soldCapsule}>
              <span>{product.sold} Sold</span>
            </div>
          )}

          {product.rating && Number(product.rating) > 0 ? (
            <button
              type="button"
              className={styles.reviewsCapsule}
              onClick={() => {
                const el = document.getElementById('reviews');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="View Client Reviews"
              aria-label={`Rating: ${product.rating} stars`}
            >
              <span className={styles.starIcon}>★</span>
              <span>{product.rating}</span>
              <span className={styles.reviewsCountText}>
                ({product.reviewsCount ?? 1})
              </span>
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.reviewsCapsule} ${styles.noReviewsCapsule}`}
              onClick={() => {
                const el = document.getElementById('reviews');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Be the first to write a review"
              aria-label="No reviews yet"
            >
              <span>No reviews yet</span>
            </button>
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Short Description */}
      <div className={styles.descriptionBlock}>
        <span className={styles.descriptionTitle}>Overview</span>
        <p className={styles.descriptionText}>
          {product.description}
        </p>
        <button
          type="button"
          className={styles.specsAnchorLink}
          onClick={() => {
            const el = document.getElementById('product-specifications');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="View Anatomy and Craftsmanship Specifications"
        >
          View Anatomy & Full Specifications ↓
        </button>
      </div>

      {/* Client Component for interactivity (Color, Size, Buttons, VTON, Size Guide, Delivery T&C) */}
      <AddToCartClient variants={product.variants} colors={product.colors} product={product} config={config} />
    </div>
  );
}
