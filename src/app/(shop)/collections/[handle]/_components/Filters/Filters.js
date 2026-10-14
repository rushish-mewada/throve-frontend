"use client";
import { useState } from 'react';
import styles from './Filters.module.css';

export default function Filters() {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    size: true,
    color: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={styles.filtersWrapper}>
      <h3 className={styles.filterTitle}>Filters</h3>

      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('categories')}>
          <h4>Categories</h4>
          <span>{openSections.categories ? '−' : '+'}</span>
        </div>
        {openSections.categories && (
          <div className={styles.filterContent}>
            {['All Women', 'Outerwear', 'Shirts & Tops', 'Dresses', 'Bottoms', 'Accessories'].map(item => (
              <label key={item} className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span className={styles.checkmark}></span>
                {item}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('price')}>
          <h4>Price</h4>
          <span>{openSections.price ? '−' : '+'}</span>
        </div>
        {openSections.price && (
          <div className={styles.filterContent}>
            {['Under ₹1,000', '₹1,000 - ₹2,500', '₹2,500 - ₹5,000', 'Over ₹5,000'].map(item => (
              <label key={item} className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span className={styles.checkmark}></span>
                {item}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('size')}>
          <h4>Size</h4>
          <span>{openSections.size ? '−' : '+'}</span>
        </div>
        {openSections.size && (
          <div className={styles.sizeGrid}>
            {['6', '8', '10', '12', '14', '16', '18', '20'].map(size => (
              <button key={size} className={styles.sizeBtn}>{size}</button>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('color')}>
          <h4>Color</h4>
          <span>{openSections.color ? '−' : '+'}</span>
        </div>
        {openSections.color && (
          <div className={styles.colorGrid}>
            {['#111111', '#ffffff', '#cbbda7', '#5f1e24', '#1C2841', '#f5a623'].map(color => (
              <button key={color} className={styles.colorBtn} style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
