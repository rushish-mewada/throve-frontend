"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const INITIAL_CART_ITEMS = [
  { id: 1, image: '/products/navy-tailored-mini-dress/main.jpg', title: 'Sleeveless Tailored Mini Dress', variant: 'Navy / M', priceNum: 4800, qty: 1 },
  { id: 2, image: '/products/asymmetric-mandarin-shirt/main.jpg', title: 'Overlapping Mandarin Shirt', variant: 'Espresso Brown / L', priceNum: 3900, qty: 1 },
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState(INITIAL_CART_ITEMS);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.priceNum * item.qty, 0);
  const total = Math.max(0, subtotal - appliedDiscount);

  const handleApplyCoupon = async () => {
    if (isApplyingCoupon) return;
    setIsApplyingCoupon(true);
    // 2-second realistic promo verification
    await new Promise((r) => setTimeout(r, 2000));
    setIsApplyingCoupon(false);
    setAppliedDiscount(500);
    setCouponSuccess(true);
  };

  const handleProceedToCheckout = async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    // 2-second cart serialization & inventory reservation
    await new Promise((r) => setTimeout(r, 2000));
    router.push('/checkout');
  };

  return (
    <main className={styles.cartLayout}>
      <h1 className={styles.title}>Your Cart</h1>
      
      <div className={styles.content}>
        <div className={styles.itemsColumn}>
          <div className={styles.tableHeader}>
            <span className={styles.headerProduct}>Product</span>
            <span className={styles.headerQty}>Quantity</span>
            <span className={styles.headerTotal}>Total</span>
          </div>
          
          <div className={styles.itemsList}>
            {items.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#666666' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Your bag is currently empty.</p>
                <Link href="/collections/women" className={styles.continueLink} style={{ display: 'inline-block' }}>
                  Explore Collections →
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemProduct}>
                    <div className={styles.itemImage}>
                      <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="120px" />
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemVariant}>{item.variant}</p>
                      <p className={styles.itemPrice}>₹{item.priceNum.toLocaleString('en-IN')}.00</p>
                    </div>
                  </div>
                  
                  <div className={styles.itemQty}>
                    <div className={styles.qtySelector}>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">-</button>
                      <span className={styles.qtyNum}>{item.qty}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                  
                  <div className={styles.itemTotal}>
                    ₹{(item.priceNum * item.qty).toLocaleString('en-IN')}.00
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.couponRow}>
              <div className={styles.couponInfo}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>{couponSuccess ? 'Code THROVE500 Applied' : 'Apply Coupons'}</span>
              </div>
              <button
                type="button"
                className={styles.applyOutlineBtn}
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || couponSuccess}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {isApplyingCoupon ? (
                  <>
                    <span className={styles.spinnerPink} />
                    <span>Verifying...</span>
                  </>
                ) : couponSuccess ? (
                  '✓ Applied'
                ) : (
                  'Apply'
                )}
              </button>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}.00</span>
            </div>
            {appliedDiscount > 0 && (
              <div className={styles.summaryRow} style={{ color: '#10b981' }}>
                <span>Seasonal Privilege</span>
                <span>-₹{appliedDiscount.toLocaleString('en-IN')}.00</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Estimated Shipping</span>
              <span style={{ color: '#10b981' }}>FREE (Orders over ₹1,999)</span>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}.00</span>
            </div>
            
            <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>
            
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={handleProceedToCheckout}
              disabled={isCheckingOut || items.length === 0}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: items.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {isCheckingOut ? (
                <>
                  <span className={styles.spinner} />
                  <span>Preparing Secure Checkout...</span>
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            
            <Link href="/collections/women" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
