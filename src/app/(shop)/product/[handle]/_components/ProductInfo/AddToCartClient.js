"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductInfo.module.css';

export default function AddToCartClient({ variants, colors, product }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(variants[1] || variants[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className={styles.formContainer}>
      
      {/* Colors */}
      <div className={styles.optionGroup}>
        <span className={styles.optionLabel}>Color: <span>{selectedColor?.name}</span></span>
        <div className={styles.swatchList}>
          {colors.map(color => (
            <button 
              key={color.id}
              className={`${styles.swatch} ${selectedColor?.id === color.id ? styles.swatchActive : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.optionGroup}>
        <div className={styles.sizeHeader}>
          <span className={styles.optionLabel}>Size: <span>{selectedSize?.name}</span></span>
          <button className={styles.sizeGuideBtn}>View Size Chart</button>
        </div>
        <div className={styles.sizeList}>
          {variants.map(v => (
            <button 
              key={v.id}
              className={`${styles.sizeBtn} ${selectedSize?.id === v.id ? styles.sizeActive : ''}`}
              onClick={() => setSelectedSize(v)}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.addToCartBtn}
          onClick={() => router.push('/cart')}
        >
          Add To Cart
        </button>
        <button
          type="button"
          className={styles.checkoutNowBtn}
          onClick={() => router.push('/checkout')}
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
}
