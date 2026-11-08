"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './NewArrivalsSection.module.css';

const NEW_ARRIVALS = [
  {
    id: 'throve_lp_01',
    title: 'Sleeveless Tailored Mini Dress',
    price: '₹ 4,800',
    rating: '4.9',
    images: [
      '/products/navy-tailored-mini-dress/main.jpg?v=3',
      '/products/navy-tailored-mini-dress/front.jpg?v=3',
      '/products/navy-tailored-mini-dress/right tilted.jpg?v=3',
      '/products/navy-tailored-mini-dress/left.jpg?v=3',
    ],
    colors: ['#1C2841'],
    handle: 'navy-tailored-mini-dress',
  },
  {
    id: 'throve_lp_02',
    title: 'Overlapping Mandarin Shirt',
    price: '₹ 3,900',
    rating: '4.9',
    images: [
      '/products/asymmetric-mandarin-shirt/main.jpg?v=3',
      '/products/asymmetric-mandarin-shirt/front.jpg?v=3',
      '/products/asymmetric-mandarin-shirt/right tilted.jpg?v=3',
      '/products/asymmetric-mandarin-shirt/left tilted.jpg?v=3',
    ],
    colors: ['#4A2E18'],
    handle: 'asymmetric-mandarin-shirt',
  },
  {
    id: 'throve_lp_05',
    title: 'Sleeveless Princess Line Dress',
    price: '₹ 4,900',
    rating: '4.9',
    images: [
      '/products/sleeveless-princess-sheath-dress/main.jpg?v=3',
      '/products/sleeveless-princess-sheath-dress/front.jpg?v=3',
      '/products/sleeveless-princess-sheath-dress/right.jpg?v=3',
      '/products/sleeveless-princess-sheath-dress/back.jpg?v=3',
    ],
    colors: ['#FAF7F2'],
    handle: 'sleeveless-princess-sheath-dress',
  },
  {
    id: 'throve_lp_03',
    title: 'Pleated Straight Formal Pants',
    price: '₹ 4,200',
    rating: '4.8',
    images: [
      '/products/pleated-formal-pants/main.jpg?v=3',
      '/products/pleated-formal-pants/front.jpg?v=3',
      '/products/pleated-formal-pants/right.jpg?v=3',
      '/products/pleated-formal-pants/back.jpg?v=3',
    ],
    colors: ['#F5F2EB'],
    handle: 'pleated-formal-pants',
  },
];

export default function NewArrivalsSection() {
  const { isInWishlist, toggleWishlist, addToCart } = useStore();
  const [activeImageIndices, setActiveImageIndices] = useState({});

  const handlePrevImage = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndices((prev) => {
      const current = prev[product.id] || 0;
      const next = current === 0 ? product.images.length - 1 : current - 1;
      return { ...prev, [product.id]: next };
    });
  };

  const handleNextImage = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndices((prev) => {
      const current = prev[product.id] || 0;
      const next = (current + 1) % product.images.length;
      return { ...prev, [product.id]: next };
    });
  };

  return (
    <section className={styles.newArrivalsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>New Arrivals</h2>
          <Link href="/collections/new-arrivals" className={styles.seeAllLink}>
            See all
          </Link>
        </div>

        <div className={styles.grid}>
          {NEW_ARRIVALS.map((product) => {
            const currentImgIndex = activeImageIndices[product.id] || 0;
            const currentImage = product.images[currentImgIndex];

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
                        fill={isInWishlist(product.id || product.handle) ? "#ef4444" : "none"}
                        stroke={isInWishlist(product.id || product.handle) ? "#ef4444" : "currentColor"}
                        strokeWidth="1.8"
                        style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
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
                  
                  {/* Arrow Controls */}
                  <button
                    type="button"
                    className={`${styles.imageNavBtn} ${styles.navLeft}`}
                    aria-label="Previous image"
                    onClick={(e) => handlePrevImage(product, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`${styles.imageNavBtn} ${styles.navRight}`}
                    aria-label="Next image"
                    onClick={(e) => handleNextImage(product, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <Link href={`/product/${product.handle}`} aria-label={product.title}>
                    <Image
                      src={currentImage}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </Link>

                  {/* Dots Indicator */}
                  <div className={styles.imageDots}>
                    {product.images.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`${styles.dot} ${currentImgIndex === dotIdx ? styles.dotActive : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveImageIndices((prev) => ({ ...prev, [product.id]: dotIdx }));
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.productInfo}>
                  <div className={styles.infoTop}>
                    <Link
                      href={`/product/${product.handle}`}
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
                        <span key={i} style={{ backgroundColor: color }} className={i === 0 ? styles.swatchActive : ''} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
