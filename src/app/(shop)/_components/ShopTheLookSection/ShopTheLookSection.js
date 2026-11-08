"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ShopTheLookSection.module.css';

const LOOKS = [
  {
    id: 'look_1',
    lookTitle: 'Shop The Look',
    description:
      'The S/S 25 Inaugural Collection explores sculpted sweetheart lines and sweeping circular flare tailoring. A balanced silhouette combining delicate feminine curves with bold architectural proportions.',
    lookbookImage: '/products/high-waisted-flare-pants/main.jpg',
    products: [
      {
        id: 'throve_lp_04',
        title: 'Scalloped Sweetheart Top',
        price: '₹ 2,900',
        rating: '4.8',
        images: ['/products/scalloped-sweetheart-top/main.jpg'],
        colors: ['#E8B4B8'],
        handle: 'scalloped-sweetheart-top',
      },
      {
        id: 'throve_lp_06',
        title: 'High Waisted Circular Flare Pants',
        price: '₹ 3,950',
        rating: '4.9',
        images: ['/products/high-waisted-flare-pants/main.jpg'],
        colors: ['#C47E85'],
        handle: 'high-waisted-flare-pants',
      },
    ],
  },
  {
    id: 'look_2',
    lookTitle: 'Shop The Look · Sartorial Men',
    description:
      'S/S 25 Sartorial Edition. Featuring an asymmetric overlapping mandarin collar shirt in rich espresso brown paired with tailored ivory cream pleated trousers with turn-up cuffs.',
    lookbookImage: '/products/pleated-formal-pants/main.jpg',
    products: [
      {
        id: 'throve_lp_02',
        title: 'Overlapping Mandarin Shirt',
        price: '₹ 3,900',
        rating: '4.9',
        images: ['/products/asymmetric-mandarin-shirt/main.jpg'],
        colors: ['#4A2E18'],
        handle: 'asymmetric-mandarin-shirt',
      },
      {
        id: 'throve_lp_03',
        title: 'Pleated Straight Formal Pants',
        price: '₹ 4,200',
        rating: '4.8',
        images: ['/products/pleated-formal-pants/main.jpg'],
        colors: ['#F5F2EB'],
        handle: 'pleated-formal-pants',
      },
    ],
  },
  {
    id: 'look_3',
    lookTitle: 'Shop The Look · Minimalist Sheath',
    description:
      'Inaugural dresses cut with architectural princess seams, crisp asymmetric collars, and custom geometric hardware. Versatile luxury designed for contemporary evening events.',
    lookbookImage: '/products/navy-tailored-mini-dress/main.jpg',
    products: [
      {
        id: 'throve_lp_01',
        title: 'Sleeveless Tailored Mini Dress',
        price: '₹ 4,800',
        rating: '4.9',
        images: ['/products/navy-tailored-mini-dress/main.jpg'],
        colors: ['#1C2841'],
        handle: 'navy-tailored-mini-dress',
      },
      {
        id: 'throve_lp_05',
        title: 'Sleeveless Princess Line Dress',
        price: '₹ 4,900',
        rating: '4.9',
        images: ['/products/sleeveless-princess-sheath-dress/main.jpg'],
        colors: ['#FAF7F2'],
        handle: 'sleeveless-princess-sheath-dress',
      },
    ],
  },
];

export default function ShopTheLookSection() {
  const [activeLook, setActiveLook] = useState(0);
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
              {currentLook.products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <div className={styles.badge}>Virtual try-on</div>
                    <button
                      type="button"
                      className={styles.wishlistBtn}
                      aria-label="Add to wishlist"
                      onClick={(e) => toggleWishlist(product.id, e)}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={wishlist[product.id] ? "#ef4444" : "none"}
                        stroke={wishlist[product.id] ? "#ef4444" : "currentColor"}
                        strokeWidth="1.5"
                        style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    
                    {/* Arrow Controls Placeholder */}
                    <button className={`${styles.imageNavBtn} ${styles.navLeft}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className={`${styles.imageNavBtn} ${styles.navRight}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <Link href={`/product/${product.handle}`} aria-label={product.title}>
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>

                    {/* Dots Placeholder */}
                    <div className={styles.imageDots}>
                      <span className={`${styles.dot} ${styles.dotActive}`}></span>
                      <span className={styles.dot}></span>
                      <span className={styles.dot}></span>
                      <span className={styles.dot}></span>
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
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
