"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NewArrivalsSection.module.css';

const NEW_ARRIVALS = [
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
  {
    id: 'throve_lp_04',
    title: 'Scalloped Sweetheart Top',
    price: '₹ 2,900',
    rating: '4.8',
    images: ['/products/scalloped-sweetheart-top/main.jpg'],
    colors: ['#E8B4B8'],
    handle: 'scalloped-sweetheart-top',
  },
];

export default function NewArrivalsSection() {
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
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
          {NEW_ARRIVALS.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <div className={styles.badge}>Virtual try-on</div>
                <button
                  type="button"
                  className={styles.wishlistBtn}
                  aria-label="Add to wishlist"
                  onClick={(e) => toggleWishlist(product.id, e)}
                  style={{ transition: 'transform 0.15s ease' }}
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

                <Link href={`/product/${product.handle || 'classic-jacket'}`} aria-label={product.title}>
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
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
                      <span key={i} style={{ backgroundColor: color }} className={i === 0 ? styles.swatchActive : ''} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
