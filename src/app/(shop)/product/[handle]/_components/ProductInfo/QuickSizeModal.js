"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./ProductInfo.module.css";

export default function QuickSizeModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  onSelectSize,
  onConfirm,
  actionType = 'cart', // 'cart' | 'buy'
  onOpenSizeChart,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safeProdImg = Array.isArray(product?.images) && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.url || ''))
    : '';

  const safeVariants = Array.isArray(product?.variants) && product.variants.length > 0
    ? product.variants
    : Array.isArray(product?.sizes) && product.sizes.length > 0
      ? product.sizes.map((s, idx) => ({ id: `sz-${idx}`, name: s, inStock: true }))
      : [
          { id: 'v-s', name: 'S', inStock: true },
          { id: 'v-m', name: 'M', inStock: true },
          { id: 'v-l', name: 'L', inStock: true },
        ];

  const handleSizeClick = (v) => {
    const rawLabel = v.name || v.title || 'M';
    const shortLabel = rawLabel.includes(' / ') ? rawLabel.split(' / ')[0].trim() : rawLabel;
    const sizeObj = { ...v, name: shortLabel };
    onSelectSize(sizeObj);
    onConfirm(actionType, sizeObj);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={`${styles.modalCard} ${styles.quickSizeCard}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} aria-hidden="true" />
        
        {/* Header with Product Preview */}
        <div className={styles.quickSizeHeader}>
          <div className={styles.quickSizeProdRow}>
            {safeProdImg && (
              <div className={styles.quickSizeThumb}>
                <Image
                  src={safeProdImg}
                  alt={product?.title || 'Product'}
                  fill
                  sizes="60px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className={styles.quickSizeMeta}>
              <h3 className={styles.quickSizeTitle}>{product?.title || 'Selected Silhouette'}</h3>
              <div className={styles.quickSizePriceRow}>
                <span className={styles.quickSizePrice}>{product?.price}</span>
                {product?.oldPrice && (
                  <span className={styles.quickSizeOldPrice}>{product.oldPrice}</span>
                )}
                <span className={styles.quickSizeStockBadge}>In Stock</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close size selector"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Size Selection Section: 1-Tap Click to Add/Buy */}
        <div className={styles.quickSizeBody}>
          <div className={styles.quickSizePromptRow}>
            <span className={styles.quickSizeLabel}>
              {actionType === 'buy' ? 'Select size to Buy Now:' : 'Select size to Add to Bag:'}
            </span>
            {onOpenSizeChart && (
              <button
                type="button"
                className={styles.quickSizeGuideBtn}
                onClick={() => {
                  onClose();
                  onOpenSizeChart();
                }}
              >
                Size Guide
              </button>
            )}
          </div>

          <div className={styles.quickSizePillGrid}>
            {safeVariants.map((v) => {
              const rawLabel = v.name || v.title || 'M';
              const shortLabel = rawLabel.includes(' / ') ? rawLabel.split(' / ')[0].trim() : rawLabel;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={styles.quickSizePill}
                  onClick={() => handleSizeClick(v)}
                  aria-label={`Select size ${shortLabel} and ${actionType === 'buy' ? 'buy now' : 'add to bag'}`}
                >
                  <span className={styles.quickSizePillName}>{shortLabel}</span>
                  <span className={styles.quickSizePillSub}>
                    {actionType === 'buy' ? 'Tap to Buy' : 'Tap to Add'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer reassurance */}
        <div className={styles.quickSizeFooter}>
          <div className={styles.quickSizeReassurance}>
            ✓ Complimentary Express Delivery & 7-Day Doorstep Returns
          </div>
        </div>
      </div>
    </div>
  );
}
