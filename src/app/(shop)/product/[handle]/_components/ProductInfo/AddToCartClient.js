"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import styles from './ProductInfo.module.css';
import SizeChartModal from './SizeChartModal';
import DeliveryTermsModal from './DeliveryTermsModal';

export default function AddToCartClient({ variants, colors, product }) {
  const router = useRouter();
  const { addToCart, setIsCartDrawerOpen } = useStore();
  const [selectedSize, setSelectedSize] = useState(variants[1] || variants[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 2000));
    addToCart(product, selectedSize?.name || 'M', selectedColor?.name || 'Standard', 1);
    setIsAdding(false);
    setAddedSuccess(true);
    setIsCartDrawerOpen(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleCheckoutNow = async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    setIsCartDrawerOpen(false);
    await new Promise((r) => setTimeout(r, 600));
    addToCart(product, selectedSize?.name || 'M', selectedColor?.name || 'Standard', 1, false);
    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <div className={styles.formContainer}>

      {/* Colors */}
      <div className={styles.optionGroup}>
        <span className={styles.optionLabel}>Color: <span>{selectedColor?.name}</span></span>
        <div className={styles.swatchList}>
          {colors.map(color => (
            <button
              key={color.id}
              className={`${styles.swatch} ${selectedColor?.id === color.id ? styles.swatchActive : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.optionGroup}>
        <div className={styles.sizeHeader}>
          <span className={styles.optionLabel}>Size: <span>{selectedSize?.name}</span></span>
          <button
            type="button"
            className={styles.sizeGuideBtn}
            onClick={() => setIsSizeChartOpen(true)}
          >
            View Size Chart
          </button>
        </div>
        <div className={styles.sizeList}>
          {variants.map(v => (
            <button
              key={v.id}
              className={`${styles.sizeBtn} ${selectedSize?.id === v.id ? styles.sizeActive : ''}`}
              onClick={() => setSelectedSize(v)}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
          disabled={isAdding}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isAdding ? (
            <>
              <span className={styles.spinner} />
              <span>Adding to Bag...</span>
            </>
          ) : addedSuccess ? (
            <span style={{ color: '#86efac', fontWeight: 600 }}>✓ Added to Bag!</span>
          ) : (
            <>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Add To Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.checkoutNowBtn}
          onClick={handleCheckoutNow}
          disabled={isCheckingOut}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isCheckingOut ? (
            <>
              <span className={styles.spinnerDark} />
              <span>Securing Checkout...</span>
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Checkout Now</span>
            </>
          )}
        </button>
      </div>

      {/* Delivery T&C Trigger */}
      <div>
        <button
          type="button"
          className={styles.deliveryLink}
          onClick={() => setIsDeliveryOpen(true)}
        >
          Delivery T&C
        </button>
      </div>

      {/* Modals */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        product={product}
      />

      <DeliveryTermsModal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
      />
    </div>
  );
}
