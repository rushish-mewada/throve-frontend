"use client";

import { useState } from 'react';
import styles from './ProductInfo.module.css';
import AddToCartClient from './AddToCartClient';

export default function ProductInfo({ product }) {
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
          {product.inStock !== false && (
            <div className={styles.stockCapsule} aria-label="Status: In Stock">
              <span className={styles.stockDot} aria-hidden="true" />
              <span>In Stock</span>
            </div>
          )}
          {product.rating && (
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
                ({product.reviewsCount || (product.handle === 'sleeveless-princess-sheath-dress' ? '1' : '1')})
              </span>
            </button>
          )}
        </div>
      </div>
      
      <hr className={styles.divider} />
      
      {/* Description */}
      <div className={styles.descriptionBlock}>
        <span className={styles.descriptionTitle}>Specification & Silhouette:</span>
        <p className={styles.descriptionText}>
          {product.description}
          {' '}
          <button
            type="button"
            className={styles.seeMore}
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}
          >
            {isExpanded ? 'Show Less' : 'See More....'}
          </button>
        </p>

        {isExpanded && (
          <div
            style={{
              marginTop: '12px',
              padding: '14px',
              backgroundColor: '#fafaf9',
              borderRadius: '6px',
              border: '1px solid #e7e5e4',
              fontSize: '13px',
              color: '#44403c',
              lineHeight: 1.6,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div>
              <strong style={{ color: '#1c1917' }}>Fabric & Drape:</strong> Japanese-grade high-density structured weave with breathable soft-touch hand feel.
            </div>
            <div>
              <strong style={{ color: '#1c1917' }}>Tailoring:</strong> Precision contouring princess seams, reinforced bonded hems, and antique hardware.
            </div>
            <div>
              <strong style={{ color: '#1c1917' }}>Garment Care:</strong> Specialist dry clean recommended or gentle cold hand wash. Steam iron on low heat.
            </div>
          </div>
        )}
      </div>

      {/* Client Component for interactivity (Color, Size, Buttons, VTON, Size Guide, Delivery T&C) */}
      <AddToCartClient variants={product.variants} colors={product.colors} product={product} />
    </div>
  );
}
