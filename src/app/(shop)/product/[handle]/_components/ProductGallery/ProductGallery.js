"use client";

import { useState } from 'react';
import Image from 'next/image';
import DecartLucyVtonModal from '../DecartLucyVton/DecartLucyVtonModal';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isVtonOpen, setIsVtonOpen] = useState(false);

  return (
    <div className={styles.gallery}>
      {/* Main Image */}
      <div className={styles.mainImageContainer}>
        <Image 
          src={images[activeImage]} 
          alt="Product Main" 
          fill 
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />

        {/* Floating Icons */}
        <div className={styles.actionIcons}>
          <button className={styles.iconBtn} aria-label="Share">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
          <button className={styles.iconBtn} aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="red" stroke="red" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Virtual Try-On"
            title="Virtual Try-On · Live Stream"
            onClick={() => setIsVtonOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.636 5.636l2.122 2.122m8.484 8.485l2.122 2.122M5.636 18.364l2.122-2.122m8.484-8.485l2.122-2.122" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbnailStrip}>
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={`${styles.thumbnail} ${activeImage === idx ? styles.thumbnailActive : ''}`}
            onClick={() => setActiveImage(idx)}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              sizes="150px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      <DecartLucyVtonModal 
        isOpen={isVtonOpen} 
        onClose={() => setIsVtonOpen(false)} 
        product={product} 
      />
    </div>
  );
}
