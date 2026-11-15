"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { isProductVtonActive } from "@/lib/vton";
import styles from "./ProductCard.module.css";

/**
 * Universal Storefront Product Card Component
 * Shared across New Arrivals, Shop The Look, Collection Grids, and Related Products.
 *
 * @param {Object} props
 * @param {Object} props.product
 * @param {string} [props.sizes]
 */
export default function ProductCard({ product, sizes = "(max-width: 768px) 50vw, 25vw" }) {
  const { isInWishlist, toggleWishlist, addToCart } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentDeltaXRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasSwipedRef = useRef(false);

  if (!product) return null;

  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
    : (product.image ? [product.image] : ["/products/asymmetric-mandarin-shirt/main.jpg"]);

  const hasMultipleImages = rawImages.length > 1;

  const handlePrevImage = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setActiveImageIndex((prev) => (prev === 0 ? rawImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setActiveImageIndex((prev) => (prev === rawImages.length - 1 ? 0 : prev + 1));
  };

  /* Unified Swipe-to-Slide Handlers (Mobile Touch + Tablet + Desktop Mouse) */
  const handlePointerDown = (e) => {
    if (rawImages.length <= 1) return;
    if (e.button !== undefined && e.button !== 0) return; // Primary button / touch only

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    currentDeltaXRef.current = 0;
    isPointerDownRef.current = true;
    hasSwipedRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current || rawImages.length <= 1) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    // Discard gesture early if vertical page scrolling dominates
    if (!hasSwipedRef.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
        isPointerDownRef.current = false;
        return;
      }
      if (Math.abs(deltaX) > 6) {
        hasSwipedRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch (_) {}
      }
    }

    if (hasSwipedRef.current) {
      // Elastic rubber-band resistance at track boundaries
      let effectiveDelta = deltaX;
      if (
        (activeImageIndex === 0 && deltaX > 0) ||
        (activeImageIndex === rawImages.length - 1 && deltaX < 0)
      ) {
        effectiveDelta = deltaX * 0.32;
      }
      currentDeltaXRef.current = effectiveDelta;
      setDragOffset(effectiveDelta);
    }
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch (_) {}

    const deltaX = currentDeltaXRef.current;
    const swipeThreshold = 30; // px to commit slide

    if (hasSwipedRef.current && Math.abs(deltaX) >= swipeThreshold && rawImages.length > 1) {
      if (deltaX < 0 && activeImageIndex < rawImages.length - 1) {
        // Swiped left -> next slide
        setActiveImageIndex((prev) => prev + 1);
      } else if (deltaX > 0 && activeImageIndex > 0) {
        // Swiped right -> prev slide
        setActiveImageIndex((prev) => prev - 1);
      }
    }

    setDragOffset(0);

    // Suppress pending click event on the <Link> after a swipe gesture
    if (hasSwipedRef.current) {
      setTimeout(() => {
        hasSwipedRef.current = false;
      }, 120);
    }
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
    hasSwipedRef.current = false;
  };

  const handleLinkClick = (e) => {
    if (hasSwipedRef.current || isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const colors = Array.isArray(product.colors)
    ? product.colors.map((c) => (typeof c === "string" ? c : c?.hex || "#18181b"))
    : (Array.isArray(product.colorHexes) ? product.colorHexes : []);

  const isWishlisted = isInWishlist(product.id || product.handle);
  const isVtonActive = isProductVtonActive(product);
  const ratingNumber = Number(product.rating) || 0;
  const hasRating = Boolean(product.rating !== null && product.rating !== undefined && ratingNumber > 0);
  const ratingDisplay = hasRating ? ratingNumber.toFixed(1) : null;
  const productHandle = product.handle || "sleeveless-princess-sheath-dress";

  return (
    <div className={styles.productCard}>
      {/* Visual Media Container */}
      <div className={styles.imageContainer}>
        {/* Top-Right Floating Action Bar */}
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.actionBtn}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#ef4444" : "none"}
              stroke={isWishlisted ? "#ef4444" : "currentColor"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            aria-label="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, "M", "Standard", 1);
            }}
          >
            <svg
              width="15"
              height="15"
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

          {isVtonActive && (
            <Link
              href={`/product/${productHandle}?vton=true`}
              className={styles.actionBtn}
              aria-label="Virtual Try-On"
              title="Virtual Try-On"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 2.5a2.5 2.5 0 0 0-2.5 2.5c0 1.1.7 2 1.7 2.3L2.4 14.7A2 2 0 0 0 2 16v.2a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V16a2 2 0 0 0-.4-1.3L12.5 7.3c.7-.2 1.3-.8 1.5-1.5" />
                <path d="M19 2l.8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2z" fill="currentColor" stroke="none" />
              </svg>
            </Link>
          )}
        </div>

        {/* Product Image Link with Horizontal Swipe-to-Slide Track */}
        <Link
          href={`/product/${productHandle}`}
          className={styles.imageLink}
          aria-label={product.title}
          onClick={handleLinkClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className={styles.imageTrack}
            style={{
              transform: `translateX(calc(-${activeImageIndex * 100}% + ${dragOffset}px))`,
              transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {rawImages.map((img, idx) => (
              <div key={idx} className={styles.imageSlide}>
                <Image
                  src={img}
                  alt={`${product.title || "Garment"} - image ${idx + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes={sizes}
                  draggable={false}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        </Link>

        {/* Carousel Arrow Controls */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              className={`${styles.imageNavBtn} ${styles.navLeft}`}
              aria-label="Previous image"
              onClick={handlePrevImage}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.imageNavBtn} ${styles.navRight}`}
              aria-label="Next image"
              onClick={handleNextImage}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Carousel Dot Indicators */}
            <div className={styles.imageDots} aria-hidden="true">
              {rawImages.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === activeImageIndex ? styles.dotActive : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(i);
                  }}
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Metadata Block (Flex pinned for perfect baseline alignment) */}
      <div className={styles.productInfo}>
        <Link
          href={`/product/${productHandle}`}
          className={styles.productTitle}
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Rating & Stock status row positioned below title text, spaced equally between title and price */}
        <div className={styles.ratingRow}>
          <div className={styles.ratingCapsuleGroup}>
            {product.inStock !== false && (
              <span className={styles.stockCapsuleMini} aria-label="Status: In Stock">
                <span className={styles.stockDotMini} aria-hidden="true" />
                <span>In Stock</span>
              </span>
            )}
            {hasRating ? (
              <span className={styles.productRating}>
                ★ {ratingDisplay}
              </span>
            ) : (
              <span className={styles.noReviews}>
                No reviews yet
              </span>
            )}
          </div>
        </div>

        {/* Bottom Row: Price & Swatches (Pinned horizontally across all cards) */}
        <div className={styles.infoBottom}>
          <div className={styles.priceGroup}>
            {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice}</span>}
            <span className={styles.productPrice}>{product.price}</span>
          </div>

          {colors.length > 0 && (
            <div className={styles.colorSwatches} aria-label="Available Colors">
              {colors.map((color, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: color }}
                  className={`${styles.swatch} ${i === 0 ? styles.swatchActive : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
