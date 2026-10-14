"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './WishlistGrid.module.css';

const INITIAL_WISHLIST = [
  {
    id: 'w1',
    title: 'Boxy Heavyweight Acid Wash Hoodie',
    category: 'Outerwear',
    price: 4999,
    originalPrice: 6499,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
    handle: 'boxy-heavyweight-hoodie',
    inStock: true,
    size: 'L',
  },
  {
    id: 'w2',
    title: 'Raw Edge Carpenter Denim Pant',
    category: 'Bottoms',
    price: 5499,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    handle: 'raw-edge-carpenter-denim',
    inStock: true,
    size: '32',
  },
  {
    id: 'w3',
    title: 'Oversized Distressed Graphic Tee',
    category: 'T-Shirts',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    handle: 'oversized-distressed-tee',
    inStock: false,
    size: 'M',
  },
  {
    id: 'w4',
    title: 'Tactical Utility Multi-Pocket Vest',
    category: 'Outerwear',
    price: 4299,
    originalPrice: 5299,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600',
    handle: 'tactical-utility-vest',
    inStock: true,
    size: 'XL',
  },
];

export default function WishlistGrid() {
  const [items, setItems] = useState(INITIAL_WISHLIST);
  const [addedToast, setAddedToast] = useState(null);

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveToBag = (item) => {
    setAddedToast(`Added ${item.title} to bag`);
    setTimeout(() => {
      setAddedToast(null);
    }, 3000);
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
        <p className={styles.emptyText}>
          Explore our seasonal drops and save your favorite streetwear silhouettes.
        </p>
        <Link href="/collections" className={styles.exploreBtn}>
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {addedToast && (
        <div className={styles.toast} role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{addedToast}</span>
        </div>
      )}

      <div className={styles.countBar}>
        <span className={styles.itemCount}>{items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'} SAVED</span>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Link href={`/product/${item.handle}`} className={styles.imageLink}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </Link>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(item.id)}
                aria-label={`Remove ${item.title} from wishlist`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {!item.inStock && (
                <div className={styles.stockBadge}>Out of Stock</div>
              )}
            </div>

            <div className={styles.details}>
              <span className={styles.category}>{item.category}</span>
              <h3 className={styles.itemTitle}>
                <Link href={`/product/${item.handle}`}>{item.title}</Link>
              </h3>

              <div className={styles.priceRow}>
                <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                {item.originalPrice && (
                  <span className={styles.originalPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>

              <div className={styles.metaRow}>
                <span className={styles.sizeTag}>Size: {item.size}</span>
              </div>

              <button
                type="button"
                className={styles.actionBtn}
                disabled={!item.inStock}
                onClick={() => handleMoveToBag(item)}
              >
                {item.inStock ? 'Move to Bag' : 'Notify Me'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
