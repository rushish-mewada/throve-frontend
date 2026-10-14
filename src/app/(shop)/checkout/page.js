"use client";
import { useState } from 'react';
import styles from './page.module.css';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('user@example.com');
  const [address, setAddress] = useState('');

  return (
    <main className={styles.checkoutLayout}>
      <div className={styles.leftCol}>
        <div className={styles.header}>
          <h2>Throve</h2>
          <div className={styles.breadcrumbs}>
            <span>Cart</span> &gt; <span>Information</span> &gt; <span>Shipping</span> &gt; <span>Payment</span>
          </div>
        </div>

        {/* STEP 1: CONTACT */}
        <div className={`${styles.section} ${step === 1 ? styles.sectionActive : styles.sectionCompleted}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepTitle}>
              <span className={styles.stepNum}>1</span>
              <h3>Contact</h3>
            </div>
            {step > 1 ? (
              <button className={styles.editBtn} onClick={() => setStep(1)}>Edit</button>
            ) : (
              <a href="/login" className={styles.loginLink}>Log in</a>
            )}
          </div>
          
          {step === 1 ? (
            <div className={styles.sectionBody}>
              <input 
                type="email" 
                placeholder="Email or mobile phone number" 
                className={styles.input} 
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Email me with news and offers</span>
              </label>
              <button className={styles.continueBtn} onClick={() => setStep(2)}>Continue to Delivery</button>
            </div>
          ) : (
            <div className={styles.summaryText}>{email || 'No contact provided'}</div>
          )}
        </div>

        {/* STEP 2: DELIVERY */}
        <div className={`${styles.section} ${step === 2 ? styles.sectionActive : (step > 2 ? styles.sectionCompleted : styles.sectionPending)}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepTitle}>
              <span className={styles.stepNum}>2</span>
              <h3>Delivery</h3>
            </div>
            {step > 2 && (
              <button className={styles.editBtn} onClick={() => setStep(2)}>Edit</button>
            )}
          </div>
          
          {step === 2 ? (
            <div className={styles.sectionBody}>
              <div className={styles.formGrid}>
                <select className={`${styles.input} ${styles.fullWidth}`}>
                  <option>India</option>
                </select>
                <input type="text" placeholder="First name" className={styles.input} />
                <input type="text" placeholder="Last name" className={styles.input} />
                <input 
                  type="text" 
                  placeholder="Address" 
                  className={`${styles.input} ${styles.fullWidth}`} 
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" className={`${styles.input} ${styles.fullWidth}`} />
                <input type="text" placeholder="City" className={styles.input} />
                <select className={styles.input}>
                  <option>State</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                </select>
                <input type="text" placeholder="PIN code" className={styles.input} />
              </div>
              <button className={styles.continueBtn} onClick={() => setStep(3)}>Continue to Payment</button>
            </div>
          ) : (
            step > 2 && <div className={styles.summaryText}>{address || 'No address provided'}</div>
          )}
        </div>

        {/* STEP 3: PAYMENT */}
        <div className={`${styles.section} ${step === 3 ? styles.sectionActive : styles.sectionPending}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepTitle}>
              <span className={styles.stepNum}>3</span>
              <h3>Payment</h3>
            </div>
          </div>
          
          {step === 3 && (
            <div className={styles.sectionBody}>
              <p className={styles.paymentSub}>All transactions are secure and encrypted.</p>
              
              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <div className={styles.radioGroup}>
                    <input type="radio" name="payment" defaultChecked />
                    <span>Razorpay (UPI, Cards, NetBanking)</span>
                  </div>
                </label>
                <label className={styles.paymentMethod}>
                  <div className={styles.radioGroup}>
                    <input type="radio" name="payment" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                </label>
              </div>
              <button className={styles.payBtn}>Pay now</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightCol}>
        <div className={styles.summaryItems}>
          <div className={styles.summaryItem}>
            <div className={styles.itemImageWrapper}>
              <div className={styles.itemImage}></div>
              <span className={styles.itemBadge}>1</span>
            </div>
            <div className={styles.itemInfo}>
              <h4>Long Sleeve Jacket</h4>
              <p>Peach / 8</p>
            </div>
            <span className={styles.itemPrice}>₹2,800.00</span>
          </div>
          
          <div className={styles.summaryItem}>
            <div className={styles.itemImageWrapper}>
              <div className={styles.itemImage}></div>
              <span className={styles.itemBadge}>2</span>
            </div>
            <div className={styles.itemInfo}>
              <h4>Classic Denim Shirt</h4>
              <p>Blue / M</p>
            </div>
            <span className={styles.itemPrice}>₹1,500.00</span>
          </div>
        </div>

        <div className={styles.couponBox}>
          <div className={styles.couponHeader}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>Apply Coupon</span>
          </div>
          <div className={styles.discountRow}>
            <input type="text" placeholder="Enter coupon code" className={styles.input} />
            <button className={styles.applyBtn}>Apply</button>
          </div>
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>₹4,300.00</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={`${styles.totalRow} ${styles.finalTotal}`}>
            <span>Total</span>
            <span className={styles.priceLarge}><span className={styles.currency}>INR</span> ₹4,300.00</span>
          </div>
        </div>
      </div>
    </main>
  );
}
