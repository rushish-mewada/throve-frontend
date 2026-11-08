"use client";
import { useState } from 'react';
import styles from './Filters.module.css';

export default function Filters({
  categories = ['Outerwear', 'Shirts & Tops', 'Dresses', 'Bottoms', 'Accessories'],
  selectedCategory = '',
  selectedCategories = [],
  onSelectCategory,
  onToggleCategory,
  selectedPriceRanges = [],
  onTogglePriceRange,
  selectedSizes = [],
  onToggleSize,
  selectedColors = [],
  onToggleColor,
  onClearAll,
  hasActiveFilters = false,
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    size: true,
    color: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const priceOptions = [
    'Under ₹50,000',
    '₹50,000 - ₹100,000',
    '₹100,000 - ₹150,000',
    'Over ₹150,000',
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL', '6', '8', '10', '12', '14', '16'];
  const colorOptions = ['#111111', '#ffffff', '#cbbda7', '#5f1e24', '#1C2841', '#5c4033'];

  return (
    <div className={styles.filtersWrapper}>
      <div className={styles.filtersHeader}>
        <h3 className={styles.filterTitle}>Filters</h3>
        <button
          type="button"
          className={`${styles.clearBtn} ${hasActiveFilters ? styles.clearBtnVisible : styles.clearBtnHidden}`}
          onClick={onClearAll}
          aria-hidden={!hasActiveFilters}
          tabIndex={hasActiveFilters ? 0 : -1}
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('categories')}>
          <h4>Categories</h4>
          <span>{openSections.categories ? '−' : '+'}</span>
        </div>
        {openSections.categories && (
          <div className={styles.filterContent}>
            {categories.map((item) => {
              const isSelected = selectedCategories.length > 0
                ? selectedCategories.includes(item)
                : selectedCategory === item;
              return (
                <label
                  key={item}
                  className={styles.checkboxLabel}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onToggleCategory) {
                      onToggleCategory(item);
                    } else if (onSelectCategory) {
                      onSelectCategory(item);
                    }
                  }}
                >
                  <span className={`${styles.checkmark} ${isSelected ? styles.checkmarkChecked : ''}`} />
                  <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? '#111111' : '#555555' }}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price */}
      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('price')}>
          <h4>Price</h4>
          <span>{openSections.price ? '−' : '+'}</span>
        </div>
        {openSections.price && (
          <div className={styles.filterContent}>
            {priceOptions.map((item) => {
              const isChecked = selectedPriceRanges.includes(item);
              return (
                <label
                  key={item}
                  className={styles.checkboxLabel}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onTogglePriceRange) onTogglePriceRange(item);
                  }}
                >
                  <span className={`${styles.checkmark} ${isChecked ? styles.checkmarkChecked : ''}`} />
                  <span style={{ fontWeight: isChecked ? 600 : 400, color: isChecked ? '#111111' : '#555555' }}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Size */}
      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('size')}>
          <h4>Size</h4>
          <span>{openSections.size ? '−' : '+'}</span>
        </div>
        {openSections.size && (
          <div className={styles.sizeGrid}>
            {sizeOptions.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  className={`${styles.sizeBtn} ${isSelected ? styles.sizeBtnActive : ''}`}
                  onClick={() => onToggleSize && onToggleSize(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Color */}
      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => toggleSection('color')}>
          <h4>Color</h4>
          <span>{openSections.color ? '−' : '+'}</span>
        </div>
        {openSections.color && (
          <div className={styles.colorGrid}>
            {colorOptions.map((color) => {
              const isSelected = selectedColors.includes(color);
              return (
                <button
                  type="button"
                  key={color}
                  className={`${styles.colorBtn} ${isSelected ? styles.colorBtnActive : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onToggleColor && onToggleColor(color)}
                  aria-label={`Filter by color ${color}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
