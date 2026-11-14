"use client";

import ProductCard from '@/components/ui/ProductCard/ProductCard';
import styles from './CollectionGrid.module.css';

export default function CollectionGrid({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No products found in this collection.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id || product.handle}
          product={product}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      ))}
    </div>
  );
}
