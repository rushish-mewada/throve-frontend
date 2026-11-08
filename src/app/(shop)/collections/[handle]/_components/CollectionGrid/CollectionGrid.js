"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './CollectionGrid.module.css';

export default function CollectionGrid({ products }) {
  const { isInWishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className={styles.grid}>
      {products.map((product) => {
        const isWishlisted = isInWishlist(product.id || product.handle);
        return (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <div className={styles.badge}>Virtual try-on</div>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.wishlistBtn}
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "#ef4444" : "none"}
                    stroke={isWishlisted ? "#ef4444" : "currentColor"}
                    strokeWidth="1.8"
                    style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.quickCartBtn}
                  aria-label="Add to cart"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product, 'M', 'Standard', 1);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </button>
              </div>
            
            <Link href={`/product/${product.handle || 'classic-jacket'}`} aria-label={product.title}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </Link>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.infoTop}>
              <Link
                href={`/product/${product.handle || 'classic-jacket'}`}
                className={styles.productTitle}
                style={{ textDecoration: 'none' }}
              >
                {product.title}
              </Link>
              <span className={styles.productRating}>★ {product.rating}</span>
            </div>
            <div className={styles.infoBottom}>
              <span className={styles.productPrice}>{product.price}</span>
              <div className={styles.colorSwatches}>
                {product.colors.map((color, i) => (
                  <span 
                    key={i} 
                    style={{ backgroundColor: color }} 
                    className={`${styles.swatch} ${i === 0 ? styles.swatchActive : ''}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    })}
    </div>
  );
}
