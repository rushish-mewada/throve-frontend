"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './ShopTheLookSection.module.css';

const LOOKS = [
  {
    id: 'look_1',
    lookTitle: 'Shop The Look · Look 01',
    description:
      'The S/S 25 Inaugural Collection explores sculpted sweetheart lines and sweeping circular flare tailoring. A balanced silhouette combining delicate feminine curves with bold architectural proportions.',
    lookbookImage: '/images/lookbook/lookbook-01.jpg?v=3',
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
          '/products/high-waisted-flare-pants/right.jpg?v=3',
          '/products/high-waisted-flare-pants/front.jpg?v=3',
          '/products/high-waisted-flare-pants/back.jpg?v=3',
        ],
        colors: ['#C47E85'],
        handle: 'high-waisted-flare-pants',
      },
    ],
  },
  {
    id: 'look_2',
    lookTitle: 'Shop The Look · Look 02',
    description:
      'S/S 25 Sartorial Edition. Featuring an asymmetric overlapping mandarin collar shirt in rich espresso brown paired with tailored ivory cream pleated trousers with turn-up cuffs.',
    lookbookImage: '/images/lookbook/lookbook-02.jpg?v=3',
    products: [
      {
        id: 'throve_lp_02',
        title: 'Overlapping Mandarin Shirt',
        price: '₹ 3,900',
        rating: '4.9',
        images: [
          '/products/asymmetric-mandarin-shirt/front.jpg?v=3',
          '/products/asymmetric-mandarin-shirt/left tilted.jpg?v=3',
          '/products/asymmetric-mandarin-shirt/back.jpg?v=3',
        ],
        colors: ['#4A2E18'],
        handle: 'asymmetric-mandarin-shirt',
      },
      {
        id: 'throve_lp_03',
        title: 'Pleated Straight Formal Pants',
        price: '₹ 4,200',
        rating: '4.8',
        images: [
          '/products/pleated-formal-pants/front.jpg?v=3',
          '/products/pleated-formal-pants/right.jpg?v=3',
          '/products/pleated-formal-pants/back.jpg?v=3',
        ],
        colors: ['#F5F2EB'],
        handle: 'pleated-formal-pants',
      },
    ],
  },
  {
    id: 'look_3',
    lookTitle: 'Shop The Look · Look 03',
    description:
      'Inaugural dresses cut with architectural princess seams, crisp asymmetric collars, and custom geometric hardware. Versatile luxury designed for contemporary evening events.',
    lookbookImage: '/images/lookbook/lookbook-03.jpg?v=3',
    products: [
      {
        id: 'throve_lp_01',
        title: 'Sleeveless Tailored Mini Dress',
        price: '₹ 4,800',
        rating: '4.9',
        images: [
          '/products/navy-tailored-mini-dress/front.jpg?v=3',
          '/products/navy-tailored-mini-dress/left.jpg?v=3',
          '/products/navy-tailored-mini-dress/right tilted.jpg?v=3',
        ],
        colors: ['#1C2841'],
        handle: 'navy-tailored-mini-dress',
      },
      {
        id: 'throve_lp_05',
        title: 'Sleeveless Princess Line Dress',
        price: '₹ 4,900',
        rating: '4.9',
        images: [
          '/products/sleeveless-princess-sheath-dress/front.jpg?v=3',
          '/products/sleeveless-princess-sheath-dress/right.jpg?v=3',
          '/products/sleeveless-princess-sheath-dress/back.jpg?v=3',
        ],
        colors: ['#FAF7F2'],
        handle: 'sleeveless-princess-sheath-dress',
      },
    ],
  },
];

export default function ShopTheLookSection() {
  const { isInWishlist, toggleWishlist } = useStore();
  const [activeLook, setActiveLook] = useState(0);
  const [activeImageIndices, setActiveImageIndices] = useState({});

  const handlePrev = () => {
    setActiveLook((prev) => (prev === 0 ? LOOKS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveLook((prev) => (prev === LOOKS.length - 1 ? 0 : prev + 1));
  };

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
            </div>

            <div className={styles.productsGrid}>
              {currentLook.products.map((product) => {
                const currentImgIndex = activeImageIndices[product.id] || 0;
                const currentImage = product.images[currentImgIndex];

                return (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.imageContainer}>
                      <div className={styles.badge}>Virtual try-on</div>
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
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={isInWishlist(product.id || product.handle) ? "#ef4444" : "none"}
                          stroke={isInWishlist(product.id || product.handle) ? "#ef4444" : "currentColor"}
                          strokeWidth="1.5"
                          style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      
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
                          sizes="(max-width: 1024px) 50vw, 25vw"
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

        </div>
      </div>
    </section>
  );
}
