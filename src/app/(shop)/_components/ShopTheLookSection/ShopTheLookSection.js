"use client";

import { useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import styles from './ShopTheLookSection.module.css';

const LOOKS = [
  {
    id: 'look_1',
    lookTitle: 'Shop The Look',
    description:
      'The S/S 25 Inaugural Collection explores sculpted sweetheart lines and sweeping circular flare tailoring. A balanced silhouette combining delicate feminine curves with bold architectural proportions.',
    lookbookImage: '/images/lookbook/dusty-pink-palazzo.png?v=5',
    products: [
      {
        id: 'throve_lp_04',
        title: 'Scalloped Sweetheart Top',
        price: '₹ 2,900',
        rating: '4.8',
        images: [
          '/products/scalloped-sweetheart-top/front.jpg?v=3',
          '/products/scalloped-sweetheart-top/right tilted.jpg?v=3',
          '/products/scalloped-sweetheart-top/right.jpg?v=3',
          '/products/scalloped-sweetheart-top/back.jpg?v=3',
        ],
        colors: ['#E8B4B8'],
        handle: 'scalloped-sweetheart-top',
      },
      {
        id: 'throve_lp_06',
        title: 'High Waisted Circular Flare Pants',
        price: '₹ 3,950',
        rating: '4.9',
        images: [
          '/products/high-waisted-flare-pants/front.jpg?v=3',
          '/products/high-waisted-flare-pants/right.jpg?v=3',
          '/products/high-waisted-flare-pants/back.jpg?v=3',
        ],
        colors: ['#C47E85'],
        handle: 'high-waisted-flare-pants',
      },
    ],
  },
];

export default function ShopTheLookSection() {
  const [activeLook, setActiveLook] = useState(0);

  const handlePrev = () => {
    setActiveLook((prev) => (prev === 0 ? LOOKS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveLook((prev) => (prev === LOOKS.length - 1 ? 0 : prev + 1));
  };

  const currentLook = LOOKS[activeLook];

  return (
    <section className={styles.shopTheLookSection}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          
          {/* Left Side: Large Lookbook Image */}
          <div className={styles.leftColumn}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={currentLook.lookbookImage}
                alt={currentLook.lookTitle}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Side: Text & Products */}
          <div className={styles.rightColumn}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>{currentLook.lookTitle}</h2>
              <p className={styles.description}>
                {currentLook.description}
              </p>
              
              {LOOKS.length > 1 && (
                <div className={styles.sliderControls}>
                  <button
                    type="button"
                    className={styles.circleBtn}
                    aria-label="Previous Look"
                    onClick={handlePrev}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={styles.circleBtn}
                    aria-label="Next Look"
                    onClick={handleNext}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className={styles.productsGrid}>
              {currentLook.products.map((product) => (
                <ProductCard
                  key={product.id || product.handle}
                  product={product}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
