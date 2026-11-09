"use client";
import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './page.module.css';
import { processCheckoutAction } from '@/actions/checkout';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('user@example.com');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handlePayNow = () => {
    startTransition(async () => {
      // 2 seconds realistic payment gateway handshake & encryption
      await new Promise((r) => setTimeout(r, 2000));
      const res = await processCheckoutAction({
        email,
        firstName: firstName || 'Customer',
        lastName: lastName || 'User',
        address1: address || '123 Fashion Street',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        pincode: pincode || '400001',
        paymentMethod,
      });

      if (res.success) {
        clearCart();
        setOrderConfirmed(res);
      } else {
        alert(res.error || 'Failed to place order');
      }
    });
  };

  return (
    <main className={styles.checkoutLayout}>
      <div className={styles.leftCol}>
        <div className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <Image 
              src="/assets/images/inline-logo.svg" 
              alt="Throve" 
              width={140} 
              height={32} 
              priority
            />
          </Link>
          <div className={styles.breadcrumbs}>
            <Link href="/cart" className={styles.breadcrumbLink}>Cart</Link> &gt; <span>Information</span> &gt; <span>Shipping</span> &gt; <span>Payment</span>
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
                <input 
                  type="text" 
                  placeholder="First name" 
                  className={styles.input} 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Last name" 
                  className={styles.input} 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Address" 
                  className={`${styles.input} ${styles.fullWidth}`} 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" className={`${styles.input} ${styles.fullWidth}`} />
                <input 
                  type="text" 
                  placeholder="City" 
                  className={styles.input} 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <select 
                  className={styles.input}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
                <input 
                  type="text" 
                  placeholder="PIN code" 
                  className={styles.input} 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
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
              {orderConfirmed ? (
                <div style={{ padding: "16px 0", color: "#10b981", fontWeight: 600 }}>
                  <p style={{ fontSize: "1.1rem" }}>✓ Order Placed Successfully!</p>
                  <p style={{ color: "#52525b", fontWeight: 400, fontSize: "14px", marginTop: "4px" }}>
                    Order ID: <strong>{orderConfirmed.displayId}</strong> ({orderConfirmed.orderId})
                  </p>
                  <p style={{ color: "#52525b", fontWeight: 400, fontSize: "14px", marginTop: "2px" }}>
                    Amount: <strong>{orderConfirmed.totalFormatted}</strong> · Payment: {orderConfirmed.paymentMethod?.toUpperCase()}
                  </p>
                  <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                    <a
                      href="/track"
                      style={{
                        padding: "10px 18px",
                        backgroundColor: "#111111",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "inline-block"
                      }}
                    >
                      Track Shipment →
                    </a>
                    <a
                      href="/"
                      style={{
                        padding: "10px 18px",
                        backgroundColor: "#f4f4f5",
                        color: "#111111",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "inline-block"
                      }}
                    >
                      Back to Store
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className={styles.paymentSub}>
                    <strong>Pre-Order Edition:</strong> Pay zero rupees today. 100% Cash on Delivery (COD) upon doorstep arrival.
                  </p>
                  
                  <div className={styles.paymentMethods}>
                    <label className={styles.paymentMethod} style={{ borderColor: '#111111', backgroundColor: '#fcfcfc', cursor: 'default' }}>
                      <div className={styles.radioGroup}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={true}
                          readOnly
                        />
                        <div>
                          <span style={{ fontWeight: 600, display: 'block', color: '#111111' }}>
                            Cash on Delivery (COD) · Zero Upfront Payment
                          </span>
                          <span style={{ fontSize: '12px', color: '#71717a', marginTop: '2px', display: 'block' }}>
                            Your pre-order will be tailored and dispatched with priority. Pay via Cash or UPI QR only when your parcel arrives.
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <button 
                    className={styles.payBtn} 
                    onClick={handlePayNow} 
                    disabled={isPending}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {isPending ? (
                      <>
                        <span className={styles.spinner} />
                        <span>Confirming Pre-Order...</span>
                      </>
                    ) : (
                      "Confirm Pre-Order (Pay on Delivery)"
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightCol}>
        <div className={styles.summaryItems}>
          {cartItems.length === 0 ? (
            <p style={{ color: '#666666', fontSize: '0.9rem' }}>No items in checkout</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.itemImageWrapper}>
                  <div className={styles.itemImage} style={{ position: 'relative', overflow: 'hidden' }}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title || item.name}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <span className={styles.itemBadge}>{item.qty}</span>
                </div>
                <div className={styles.itemInfo}>
                  <h4>{item.title || item.name}</h4>
                  <p>{item.variant}</p>
                </div>
                <span className={styles.itemPrice}>
                  ₹{(((item.priceNum || item.price || 0) * item.qty)).toLocaleString('en-IN')}.00
                </span>
              </div>
            ))
          )}
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
            <span>₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={`${styles.totalRow} ${styles.finalTotal}`}>
            <span>Total</span>
            <span className={styles.priceLarge}><span className={styles.currency}>INR</span> ₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
          </div>
        </div>
      </div>
    </main>
  );
}
