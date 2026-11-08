"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import DecartLucyVtonModal from '../DecartLucyVton/DecartLucyVtonModal';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isVtonOpen, setIsVtonOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useStore();

  const isWishlisted = isInWishlist(product?.id || product?.handle);

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
          <button
            className={styles.iconBtn}
            aria-label="Share"
            onClick={async () => {
              if (navigator?.share) {
                try {
                  await navigator.share({
                    title: product?.title || 'Throve',
                    url: window.location.href,
                  });
                } catch (_) {}
              } else {
                navigator?.clipboard?.writeText(window.location.href);
                alert('Product link copied to clipboard!');
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Wishlist"
            onClick={() => toggleWishlist(product)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#ef4444" : "none"}
              stroke={isWishlisted ? "#ef4444" : "currentColor"}
              strokeWidth="1.5"
              style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Virtual Try-On"
            title="Virtual Try-On · Live Stream"
            onClick={() => setIsVtonOpen(true)}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2.5a2.5 2.5 0 0 0-2.5 2.5c0 1.1.7 2 1.7 2.3L2.4 14.7A2 2 0 0 0 2 16v.2a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V16a2 2 0 0 0-.4-1.3L12.5 7.3c.7-.2 1.3-.8 1.5-1.5" />
              <path d="M19 2l.8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2z" fill="currentColor" stroke="none" />
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
