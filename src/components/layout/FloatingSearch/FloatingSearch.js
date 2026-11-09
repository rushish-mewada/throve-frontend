"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LAUNCH_PRODUCTS } from "@/lib/catalog";
import styles from "./FloatingSearch.module.css";

const TRENDING_SEARCHES = [
  "Mandarin Shirt",
  "Tailored Mini Dress",
  "Flare Pants",
  "Formal Pants",
  "Sweetheart Top",
];

export default function FloatingSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setQuery("");
      onClose();
    }, 220);
  };

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter products in real time
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return LAUNCH_PRODUCTS.filter((product) => {
      const titleMatch = product.title?.toLowerCase().includes(q);
      const categoryMatch = product.category?.toLowerCase().includes(q);
      const subcategoryMatch = product.subcategory?.toLowerCase().includes(q);
      const descMatch = product.description?.toLowerCase().includes(q);
      const collectionMatch = product.collection?.toLowerCase().includes(q);
      return titleMatch || categoryMatch || subcategoryMatch || descMatch || collectionMatch;
    });
  }, [query]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={styles.header}>
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L16 16" strokeLinecap="round" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search dresses, shirts, trousers, collections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear query"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <button
            type="button"
            className={styles.closeKeyHint}
            onClick={handleClose}
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className={styles.body}>
          {query.trim().length === 0 ? (
            /* Suggestions & Trending */
            <div className={styles.suggestionsSection}>
              <span className={styles.sectionLabel}>Popular Searches</span>
              <div className={styles.chipsContainer}>
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={styles.chip}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "12px" }}>
                <span className={styles.sectionLabel}>Quick Collections</span>
                <div className={styles.quickCategories}>
                  <Link
                    href="/collections/women"
                    onClick={handleClose}
                    className={styles.categoryLink}
                  >
                    Women's Collection
                  </Link>
                  <Link
                    href="/collections/men"
                    onClick={handleClose}
                    className={styles.categoryLink}
                  >
                    Men's Collection
                  </Link>
                  <Link
                    href="/collections/new-arrivals"
                    onClick={handleClose}
                    className={styles.categoryLink}
                  >
                    New Arrivals S/S 25
                  </Link>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Matching Results */
            <div className={styles.resultsSection}>
              <div className={styles.resultsHeader}>
                <span className={styles.sectionLabel}>
                  {results.length} {results.length === 1 ? "Style" : "Styles"} Found
                </span>
              </div>
              <div className={styles.resultsList}>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.handle}`}
                    onClick={handleClose}
                    className={styles.resultItem}
                  >
                    <div className={styles.itemImage}>
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="60px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemTitle}>{product.title}</span>
                      <span className={styles.itemSubtitle}>
                        {product.category} · {product.collection}
                      </span>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemPrice}>{product.price}</span>
                        {product.preOrder && (
                          <span className={styles.itemPreOrder}>Pre-Order</span>
                        )}
                        <span className={styles.itemRating}>★ {product.rating}</span>
                      </div>
                    </div>
                    <div className={styles.itemArrow}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No matching styles found</p>
              <p className={styles.emptyDesc}>
                We couldn't find any designs matching &ldquo;{query}&rdquo;. Check your spelling or explore our inaugural drop.
              </p>
              <Link
                href="/collections/women"
                onClick={handleClose}
                className={styles.browseBtn}
              >
                Browse All Collections →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

