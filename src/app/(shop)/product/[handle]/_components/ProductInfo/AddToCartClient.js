"use client";
import { useState } from 'react';
import styles from './ProductInfo.module.css';
import DecartLucyVtonModal from '../DecartLucyVton/DecartLucyVtonModal';

export default function AddToCartClient({ variants, colors, product }) {
  const [selectedSize, setSelectedSize] = useState(variants[1] || variants[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isVtonOpen, setIsVtonOpen] = useState(false);

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

      {/* Decart Lucy VTON Trigger */}
      <div className={styles.vtonTriggerSection}>
        <button 
          type="button" 
          className={styles.vtonBtn} 
          onClick={() => setIsVtonOpen(true)}
        >
          <span className={styles.vtonIcon}>✨</span>
          <span className={styles.vtonText}>Virtual Try-On · Live Stream</span>
          <span className={styles.vtonBadge}>DECART LUCY</span>
        </button>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.addToCartBtn}>Add To Cart</button>
        <button className={styles.checkoutNowBtn}>Checkout Now</button>
      </div>

      {/* VTON Modal */}
      <DecartLucyVtonModal 
        isOpen={isVtonOpen} 
        onClose={() => setIsVtonOpen(false)} 
        product={product} 
      />
    </div>
  );
}
