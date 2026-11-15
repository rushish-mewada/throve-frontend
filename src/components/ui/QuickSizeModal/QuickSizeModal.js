"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import styles from "./QuickSizeModal.module.css";

/**
 * Global Quick Size Selector Modal & Slide-Up Bottom Sheet
 * Desktop: Centered luxury popup modal
 * Tablet & Mobile: Smooth bottom slide-up sheet with drag handle
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.product
 * @param {Function} [props.onConfirm] Optional custom confirmation handler
 * @param {string} [props.actionType] 'cart' | 'buy'
 * @param {Function} [props.onOpenSizeChart]
 */
export default function QuickSizeModal({
  isOpen,
  onClose,
  product,
  onConfirm,
  actionType = "cart",
  onOpenSizeChart,
}) {
  const { addToCart } = useStore();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const rawImg = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === "string" ? product.images[0] : (product.images[0]?.url || ""))
    : (typeof product.image === "string" ? product.image : (product.image?.url || ""));

  const safeProdImg = rawImg && rawImg.trim().length > 0
    ? rawImg.trim()
    : "/products/navy-tailored-mini-dress/main.jpg?v=3";

  const safeVariants = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes.map((s, idx) => ({ id: `sz-${idx}`, name: s, inStock: true }))
      : [
          { id: "v-s", name: "S", inStock: true },
          { id: "v-m", name: "M", inStock: true },
          { id: "v-l", name: "L", inStock: true },
          { id: "v-xl", name: "XL", inStock: true },
        ];

  const displayPrice = typeof product.price === "number"
    ? `₹${product.price.toLocaleString("en-IN")}`
    : (product.price || "₹4,200");

  const displayOldPrice = typeof product.oldPrice === "number"
    ? `₹${product.oldPrice.toLocaleString("en-IN")}`
    : product.oldPrice;

  const handleSizeClick = (v) => {
    const rawLabel = v.name || v.title || "M";
    const shortLabel = rawLabel.includes(" / ") ? rawLabel.split(" / ")[0].trim() : rawLabel;
    const sizeObj = { ...v, name: shortLabel };

    if (onConfirm) {
      onConfirm(sizeObj);
    } else {
      addToCart(product, shortLabel, "Standard", 1, true);
    }
    onClose?.();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} aria-hidden="true" />

        {/* Product Preview Header */}
        <div className={styles.header}>
          <div className={styles.prodRow}>
            <div className={styles.thumb}>
              <Image
                src={safeProdImg}
                alt={product.title || "Product"}
                fill
                sizes="52px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.meta}>
              <h3 className={styles.title}>{product.title || "Selected Silhouette"}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{displayPrice}</span>
                {displayOldPrice && (
                  <span className={styles.oldPrice}>{displayOldPrice}</span>
                )}
                <span className={styles.stockBadge}>In Stock</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close size selector"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 1-Tap Size Selection Grid */}
        <div className={styles.body}>
          <div className={styles.promptRow}>
            <span className={styles.label}>
              {actionType === "buy" ? "Select size to Buy Now:" : "Select size to Add to Bag:"}
            </span>
            {onOpenSizeChart && (
              <button
                type="button"
                className={styles.guideBtn}
                onClick={() => {
                  onClose?.();
                  onOpenSizeChart();
                }}
              >
                Size Guide
              </button>
            )}
          </div>

          <div className={styles.pillGrid}>
            {safeVariants.map((v) => {
              const rawLabel = v.name || v.title || "M";
              const shortLabel = rawLabel.includes(" / ") ? rawLabel.split(" / ")[0].trim() : rawLabel;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={styles.pill}
                  onClick={() => handleSizeClick(v)}
                  aria-label={`Select size ${shortLabel} and add to bag`}
                >
                  <span className={styles.pillName}>{shortLabel}</span>
                  <span className={styles.pillSub}>
                    {actionType === "buy" ? "Tap to Buy" : "Tap to Add"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Luxury Reassurance Footer */}
        <div className={styles.footer}>
          <div className={styles.reassurance}>
            ✓ Complimentary Express Delivery & 7-Day Doorstep Returns
          </div>
        </div>
      </div>
    </div>
  );
}
