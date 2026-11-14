"use client";

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './page.module.css';
import { processCheckoutAction, initiateCashfreeCheckoutAction } from '@/actions/checkout';
import { launchCashfreeCheckout } from '@/lib/cashfree';

const PAYMENT_OPTIONS = [
  {
    id: 'cashfree',
    kind: 'online',
    label: 'Online Payment (UPI, Cards, NetBanking)',
    subtitle: 'Instant secure checkout via Cashfree Payments. Supports Google Pay, PhonePe, Paytm, all Cards & UPI.',
  },
  {
    id: 'cod',
    kind: 'offline',
    label: 'Cash on Delivery (COD)',
    subtitle: 'Pay at your doorstep via cash or courier UPI QR code when your parcel is delivered.',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, clearCart, user, isMounted } = useStore();
  const [step, setStep] = useState(1); // 1: Contact, 2: Delivery, 3: Payment
  
  // Contact & Delivery State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user data if already logged in
  useEffect(() => {
    if (user) {
      if (user.email && user.email !== 'throve.in@gmail.com') setEmail(user.email);
      if (user.phone) {
        const clean = user.phone.replace(/[^0-9]/g, '').slice(-10);
        if (clean) setPhone(clean);
      }
      if (user.name && user.name !== 'Client' && user.name !== 'Valued Client') {
        const parts = user.name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
    }
  }, [user]);

  // Redirect if cart is empty after hydration
  useEffect(() => {
    if (isMounted && (!cartItems || cartItems.length === 0)) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isMounted, cartItems, router]);

  const selectedMethodMeta = PAYMENT_OPTIONS.find((m) => m.id === paymentMethod) || PAYMENT_OPTIONS[0];

  const handleContinueToDelivery = (e) => {
    e?.preventDefault?.();
    setErrorMessage('');
    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order delivery updates.');
      return;
    }
    setStep(2);
  };

  const handleContinueToPayment = (e) => {
    e?.preventDefault?.();
    setErrorMessage('');
    if (!firstName.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setErrorMessage('Please complete all required delivery address fields.');
      return;
    }
    setStep(3);
  };

  const handlePayNow = () => {
    setErrorMessage('');
    startTransition(async () => {
      try {
        const orderItems = cartItems.map((item) => ({
          variantId: item.productId || item.handle || "var_01",
          title: item.title,
          quantity: item.qty || 1,
          pricePaise: Math.round((item.priceNum || 2900) * 100),
        }));

        const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
        const customerName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Valued Customer';
        const fullAddress = [address.trim(), apartment.trim()].filter(Boolean).join(', ');

        // 1. ONLINE PAYMENT: Cashfree One Click / Dropin Checkout
        if (paymentMethod === 'cashfree') {
          const res = await initiateCashfreeCheckoutAction({
            items: orderItems,
            phone: cleanPhone,
            email: email.trim() || `${cleanPhone}@customer.throve.in`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            shippingAddress: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              phone: cleanPhone,
              address1: fullAddress,
              city: city.trim(),
              state,
              pincode: pincode.trim(),
            },
          });

          if (res.success && res.paymentSessionId) {
            // Snapshot order locally for immediate confirmation page rendering
            const targetId = res.displayId || res.orderId;
            const snapshot = {
              id: targetId,
              publicId: res.orderId,
              date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
              email: email || `${cleanPhone}@customer.throve.in`,
              total: `₹${cartSubtotal.toLocaleString('en-IN')}.00`,
              subtotal: `₹${cartSubtotal.toLocaleString('en-IN')}.00`,
              shipping: 'Free',
              paymentMethod: 'Online Payment (Cashfree)',
              shippingAddress: {
                name: customerName,
                address: fullAddress,
                city: city.trim(),
                state,
                pin: pincode.trim(),
              },
              items: cartItems.map((item, idx) => ({
                id: item.id || idx + 1,
                image: item.image || '/products/asymmetric-mandarin-shirt/main.png',
                title: item.title,
                variant: [item.color, item.size].filter(Boolean).join(' / ') || 'Standard',
                price: `₹${(item.priceNum || 0).toLocaleString('en-IN')}.00`,
                qty: item.qty || 1,
              })),
            };

            try {
              sessionStorage.setItem('throve_last_order', JSON.stringify(snapshot));
            } catch {}

            // Launch Cashfree Checkout Modal with customer's real phone & details
            // Note: Cart is preserved until payment is confirmed on /order/[id]
            await launchCashfreeCheckout({
              paymentSessionId: res.paymentSessionId,
              environment: res.environment || 'production',
            });
          } else {
            setErrorMessage(res.error || 'Failed to initialize payment gateway.');
          }
          return;
        }

        // 2. CASH ON DELIVERY (COD)
        const codRes = await processCheckoutAction({
          items: orderItems,
          email: email.trim() || `${cleanPhone}@customer.throve.in`,
          phone: cleanPhone,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          address1: fullAddress,
          city: city.trim(),
          state,
          pincode: pincode.trim(),
          paymentMethod: 'cod',
        });

        if (codRes.success) {
          const targetId = codRes.displayId || codRes.orderId || `THR-${Date.now().toString().slice(-4)}`;
          const snapshot = {
            id: targetId,
            publicId: codRes.orderId,
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            email: email || `${cleanPhone}@customer.throve.in`,
            total: codRes.totalFormatted || `₹${cartSubtotal.toLocaleString('en-IN')}.00`,
            subtotal: codRes.totalFormatted || `₹${cartSubtotal.toLocaleString('en-IN')}.00`,
            shipping: 'Free',
            paymentMethod: 'Cash on Delivery (COD)',
            shippingAddress: {
              name: customerName,
              address: fullAddress,
              city: city.trim(),
              state,
              pin: pincode.trim(),
            },
            items: cartItems.map((item, idx) => ({
              id: item.id || idx + 1,
              image: item.image || '/products/asymmetric-mandarin-shirt/main.png',
              title: item.title,
              variant: [item.color, item.size].filter(Boolean).join(' / ') || 'Standard',
              price: `₹${(item.priceNum || 0).toLocaleString('en-IN')}.00`,
              qty: item.qty || 1,
            })),
          };

          try {
            sessionStorage.setItem('throve_last_order', JSON.stringify(snapshot));
          } catch {}

          clearCart();
          router.push(`/order/${encodeURIComponent(targetId)}`);
        } else {
          setErrorMessage(codRes.error || 'Failed to place order.');
        }
      } catch (err) {
        console.error('Checkout failed:', err);
        setErrorMessage(err.message || 'Checkout failed. Please check your network connection.');
      }
    });
  };

  if (!isMounted) {
    return (
      <main className={styles.checkoutLayout} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px', padding: '32px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '2px solid #e5e5e5',
            borderTopColor: '#111',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#111', margin: 0, letterSpacing: '0.04em' }}>
            Loading your atelier bag...
          </h2>
        </div>
      </main>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className={styles.checkoutLayout} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px', padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#111' }}>Your Bag is Empty</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Add items to your bag before proceeding to checkout.</p>
          <Link
            href="/collections"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#111',
              color: '#fff',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

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
            <Link href="/" className={styles.breadcrumbLink}>Bag</Link> &gt; <span>Contact</span> &gt; <span>Delivery</span> &gt; <span>Payment</span>
          </div>
        </div>

        {errorMessage && (
          <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', borderRadius: '4px', marginBottom: '20px' }}>
            {errorMessage}
          </div>
        )}

        {/* STEP 1: CONTACT */}
        <div className={`${styles.section} ${step === 1 ? styles.sectionActive : styles.sectionCompleted}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepTitle}>
              <span className={styles.stepNum}>1</span>
              <h3>Contact Details</h3>
            </div>
            {step > 1 && (
              <button className={styles.editBtn} onClick={() => setStep(1)}>Edit</button>
            )}
          </div>
          
          {step === 1 ? (
            <div className={styles.sectionBody}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  Mobile Number (for WhatsApp delivery alerts) *
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '12px 14px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRight: 'none', fontSize: '14px', color: '#555', fontWeight: 500 }}>
                    +91
                  </span>
                  <input 
                    type="tel" 
                    placeholder="98926 91094" 
                    className={styles.input} 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ flex: 1 }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  Email Address (for GST tax invoice)
                </label>
                <input 
                  type="email" 
                  placeholder="client@throve.in" 
                  className={styles.input} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="button" className={styles.continueBtn} onClick={handleContinueToDelivery}>
                Continue to Delivery Address
              </button>
            </div>
          ) : (
            <div className={styles.summaryText}>
              <strong>+91 {phone}</strong> {email ? `• ${email}` : ''}
            </div>
          )}
        </div>

        {/* STEP 2: DELIVERY ADDRESS */}
        <div className={`${styles.section} ${step === 2 ? styles.sectionActive : (step > 2 ? styles.sectionCompleted : styles.sectionPending)}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepTitle}>
              <span className={styles.stepNum}>2</span>
              <h3>Delivery Address</h3>
            </div>
            {step > 2 && (
              <button className={styles.editBtn} onClick={() => setStep(2)}>Edit</button>
            )}
          </div>
          
          {step === 2 ? (
            <div className={styles.sectionBody}>
              <div className={styles.formGrid}>
                <input 
                  type="text" 
                  placeholder="First name *" 
                  className={styles.input} 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
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
                  placeholder="Flat, House no., Building, Apartment *" 
                  className={`${styles.input} ${styles.fullWidth}`} 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Area, Street, Sector, Village, Landmark (optional)" 
                  className={`${styles.input} ${styles.fullWidth}`}
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="City *" 
                  className={styles.input} 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
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
                  <option value="Telangana">Telangana</option>
                  <option value="Haryana">Haryana</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Goa">Goa</option>
                  <option value="Punjab">Punjab</option>
                </select>
                <input 
                  type="text" 
                  placeholder="6-digit PIN code *" 
                  className={styles.input} 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </div>
              <button type="button" className={styles.continueBtn} onClick={handleContinueToPayment} style={{ marginTop: '16px' }}>
                Continue to Payment
              </button>
            </div>
          ) : (
            step > 2 && (
              <div className={styles.summaryText}>
                <div><strong>{firstName} {lastName}</strong></div>
                <div>{[address, apartment].filter(Boolean).join(', ')}</div>
                <div>{city}, {state} — {pincode}</div>
              </div>
            )
          )}
        </div>

        {/* STEP 3: PAYMENT */}
        <div className={`${styles.section} ${step === 3 ? styles.sectionActive : styles.sectionPending}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepTitle}>
              <span className={styles.stepNum}>3</span>
              <h3>Payment Method</h3>
            </div>
          </div>
          
          {step === 3 && (
            <div className={styles.sectionBody}>
              <p className={styles.paymentSub}>
                {selectedMethodMeta?.id === 'cod' ? (
                  <><strong>Cash on Delivery:</strong> Pay at doorstep via Cash or UPI QR when your courier arrives.</>
                ) : (
                  <><strong>Online Instant Checkout:</strong> 256-bit encrypted session powered by Cashfree Payments.</>
                )}
              </p>

              <div className={styles.paymentMethods}>
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={styles.paymentMethod}
                      style={{
                        borderColor: isSelected ? '#111111' : '#e0e0e0',
                        backgroundColor: isSelected ? '#fafafa' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '16px',
                        border: '1px solid',
                        borderRadius: '6px',
                        marginBottom: '12px',
                      }}
                    >
                      <div className={styles.radioGroup} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(opt.id)}
                          style={{ marginTop: '3px' }}
                        />
                        <div>
                          <span style={{ fontWeight: 600, display: 'block', color: '#111111', fontSize: '14px' }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '12px', color: '#71717a', marginTop: '4px', display: 'block', lineHeight: 1.5 }}>
                            {opt.subtitle}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.payBtn}
                onClick={handlePayNow}
                disabled={isPending}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '16px' }}
              >
                {isPending ? (
                  <>
                    <span className={styles.spinner} />
                    <span>Connecting Cashfree...</span>
                  </>
                ) : paymentMethod === 'cod' ? (
                  `Confirm Order (Pay ₹${cartSubtotal.toLocaleString('en-IN')}.00 on Delivery)`
                ) : (
                  `Pay ₹${cartSubtotal.toLocaleString('en-IN')}.00 via Cashfree`
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <div className={styles.rightCol}>
        <div className={styles.summaryItems}>
          {cartItems.map((item) => (
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
                <p>{[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'}</p>
              </div>
              <span className={styles.itemPrice}>
                ₹{(((item.priceNum || item.price || 0) * item.qty)).toLocaleString('en-IN')}.00
              </span>
            </div>
          ))}
        </div>

        <div className={styles.totals} style={{ marginTop: '24px' }}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>Complimentary (Free)</span>
          </div>
          <div className={`${styles.totalRow} ${styles.finalTotal}`}>
            <span>Total</span>
            <span className={styles.priceLarge}>
              <span className={styles.currency}>INR</span> ₹{cartSubtotal.toLocaleString('en-IN')}.00
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
