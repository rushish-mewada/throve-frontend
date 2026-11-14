"use client";

import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ title, products, seeAllLink }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {seeAllLink && (
          <Link href={seeAllLink} className={styles.seeAll}>
            See All
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id || product.handle}
            product={product}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  );
}
