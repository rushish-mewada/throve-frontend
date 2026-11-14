"use client";

import { useEffect, useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './page.module.css';
import { processCheckoutAction, initiateCashfreeCheckoutAction } from '@/actions/checkout';
import { launchCashfreeCheckout } from '@/lib/cashfree';
import CustomInput from '@/components/ui/CustomInput/CustomInput';
import CustomSelect from '@/components/ui/CustomSelect/CustomSelect';
import { UpiIcon, GPayIcon, PhonePeIcon, RuPayIcon, MastercardIcon, VisaIcon, CashfreeIcon, CodIcon } from '@/components/ui/PaymentIcons';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const PIN_PREFIX_STATE_MAP = {
  '11': { state: 'Delhi', city: 'New Delhi' },
  '12': { state: 'Haryana', city: 'Gurugram' },
  '13': { state: 'Haryana', city: 'Faridabad' },
  '14': { state: 'Punjab', city: 'Ludhiana' },
  '15': { state: 'Punjab', city: 'Amritsar' },
  '16': { state: 'Chandigarh', city: 'Chandigarh' },
  '17': { state: 'Himachal Pradesh', city: 'Shimla' },
  '18': { state: 'Jammu and Kashmir', city: 'Srinagar' },
  '19': { state: 'Jammu and Kashmir', city: 'Jammu' },
  '20': { state: 'Uttar Pradesh', city: 'Noida' },
  '21': { state: 'Uttar Pradesh', city: 'Prayagraj' },
  '22': { state: 'Uttar Pradesh', city: 'Lucknow' },
  '24': { state: 'Uttarakhand', city: 'Dehradun' },
  '25': { state: 'Uttar Pradesh', city: 'Meerut' },
  '28': { state: 'Uttar Pradesh', city: 'Agra' },
  '30': { state: 'Rajasthan', city: 'Jaipur' },
  '31': { state: 'Rajasthan', city: 'Udaipur' },
  '34': { state: 'Rajasthan', city: 'Jodhpur' },
  '36': { state: 'Gujarat', city: 'Rajkot' },
  '38': { state: 'Gujarat', city: 'Ahmedabad' },
  '39': { state: 'Gujarat', city: 'Surat' },
  '40': { state: 'Maharashtra', city: 'Mumbai' },
  '41': { state: 'Maharashtra', city: 'Pune' },
  '42': { state: 'Maharashtra', city: 'Nashik' },
  '44': { state: 'Maharashtra', city: 'Nagpur' },
  '45': { state: 'Madhya Pradesh', city: 'Indore' },
  '46': { state: 'Madhya Pradesh', city: 'Bhopal' },
  '49': { state: 'Chhattisgarh', city: 'Raipur' },
  '50': { state: 'Telangana', city: 'Hyderabad' },
  '51': { state: 'Andhra Pradesh', city: 'Tirupati' },
  '52': { state: 'Andhra Pradesh', city: 'Vijayawada' },
  '53': { state: 'Andhra Pradesh', city: 'Visakhapatnam' },
  '56': { state: 'Karnataka', city: 'Bengaluru' },
  '57': { state: 'Karnataka', city: 'Mangaluru' },
  '58': { state: 'Karnataka', city: 'Hubli' },
  '60': { state: 'Tamil Nadu', city: 'Chennai' },
  '64': { state: 'Tamil Nadu', city: 'Coimbatore' },
  '67': { state: 'Kerala', city: 'Kozhikode' },
  '68': { state: 'Kerala', city: 'Kochi' },
  '69': { state: 'Kerala', city: 'Thiruvananthapuram' },
  '70': { state: 'West Bengal', city: 'Kolkata' },
  '75': { state: 'Odisha', city: 'Bhubaneswar' },
  '78': { state: 'Assam', city: 'Guwahati' },
  '80': { state: 'Bihar', city: 'Patna' },
  '83': { state: 'Jharkhand', city: 'Ranchi' },
};

const PAYMENT_OPTIONS = [
  {
    id: 'cashfree',
    title: 'UPI / Cards / NetBanking',
    subtitle: 'Instant payment via Google Pay, PhonePe, Paytm, all Cards & UPI.',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery (COD)',
    subtitle: 'Pay at your doorstep via cash or courier UPI QR upon parcel arrival.',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, clearCart, user, isMounted } = useStore();
  
  // Mobile Order Summary Dropdown State (Shopflo Mobile Standard)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Contact & Delivery State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  // Saved Address Handling
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Payment & Coupon State
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved address from localStorage or user context
  useEffect(() => {
    if (!isMounted) return;

    try {
      const saved = localStorage.getItem('throve_shipping_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.firstName && parsed.phone && parsed.address1 && parsed.city && parsed.pincode) {
          setFirstName(parsed.firstName || '');
          setLastName(parsed.lastName || '');
          setPhone(parsed.phone || '');
          setEmail(parsed.email || '');
          setAddress1(parsed.address1 || '');
          setAddress2(parsed.address2 || '');
          setCity(parsed.city || '');
          setState(parsed.state || 'Maharashtra');
          setPincode(parsed.pincode || '');
          setHasSavedAddress(true);
          setIsEditingAddress(false);
          return;
        }
      }
    } catch {}

    // Fallback: Populate from logged in user if available
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
    setIsEditingAddress(true);
  }, [isMounted, user]);

  // Smart Indian PIN code auto-population
  const handlePincodeChange = useCallback(async (rawPin) => {
    const cleanPin = rawPin.replace(/\D/g, '').slice(0, 6);
    setPincode(cleanPin);

    if (cleanPin.length === 6) {
      // 1. Instant heuristic fallback by prefix
      const prefix2 = cleanPin.substring(0, 2);
      if (PIN_PREFIX_STATE_MAP[prefix2]) {
        const mapped = PIN_PREFIX_STATE_MAP[prefix2];
        if (!city) setCity(mapped.city);
        if (mapped.state) setState(mapped.state);
      }

      // 2. Exact PIN postal verification
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            if (po.District) setCity(po.District);
            if (po.State && INDIAN_STATES.includes(po.State)) {
              setState(po.State);
            }
          }
        }
      } catch {
        // Fallback already assigned
      }
    }
  }, [city]);

  // Handle Coupon Application
  const handleApplyCoupon = (e) => {
    e?.preventDefault?.();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'THROVE10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedCoupon({ code, discount, label: '10% Privilege Discount' });
      setCouponInput('');
    } else if (code === 'WELCOME500' || code === 'FIRST500') {
      const discount = Math.min(500, cartSubtotal);
      setAppliedCoupon({ code, discount, label: '₹500 Courtesy Discount' });
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try THROVE10 for 10% off.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Save current address inputs to localStorage
  const persistAddressLocally = () => {
    try {
      const addressData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.replace(/[^0-9]/g, '').slice(-10),
        email: email.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
        city: city.trim(),
        state,
        pincode: pincode.trim(),
      };
      localStorage.setItem('throve_shipping_address', JSON.stringify(addressData));
      setHasSavedAddress(true);
      setIsEditingAddress(false);
    } catch {}
  };

  // Redirect if cart is empty after hydration
  useEffect(() => {
    if (isMounted && (!cartItems || cartItems.length === 0)) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isMounted, cartItems, router]);

  // Calculate pricing breakdown
  const discountAmount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);
  const itemCount = cartItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;

  // Checkout submission handler
  const handlePayNow = () => {
    setErrorMessage('');

    // Comprehensive client validation
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order delivery updates.');
      return;
    }
    if (!firstName.trim()) {
      setErrorMessage('Please enter your first name for shipping.');
      return;
    }
    if (!address1.trim()) {
      setErrorMessage('Please enter your street address (Flat / House No., Building, Street).');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your delivery city.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    // Persist address for future visits
    persistAddressLocally();

    startTransition(async () => {
      try {
        const orderItems = cartItems.map((item) => ({
          variantId: item.productId || item.handle || "var_01",
          title: item.title,
          quantity: item.qty || 1,
          pricePaise: Math.round((item.priceNum || 2900) * 100),
        }));

        const customerName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Valued Customer';
        const fullAddress = [address1.trim(), address2.trim()].filter(Boolean).join(', ');

        // 1. ONLINE PAYMENT: Cashfree One Click / Dropin Checkout
        if (paymentMethod === 'cashfree') {
          const res = await initiateCashfreeCheckoutAction({
            items: orderItems,
            phone: cleanPhone,
            email: email.trim() || `${cleanPhone}@customer.throve.in`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            couponCode: appliedCoupon?.code || '',
            shippingAddress: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              phone: cleanPhone,
              address1: address1.trim(),
              address2: address2.trim(),
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
              total: `₹${finalTotal.toLocaleString('en-IN')}.00`,
              subtotal: `₹${cartSubtotal.toLocaleString('en-IN')}.00`,
              discount: discountAmount ? `₹${discountAmount.toLocaleString('en-IN')}.00` : null,
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
          address1: address1.trim(),
          address2: address2.trim(),
          city: city.trim(),
          state,
          pincode: pincode.trim(),
          paymentMethod: 'cod',
          couponCode: appliedCoupon?.code || '',
        });

        if (codRes.success) {
          const targetId = codRes.displayId || codRes.orderId || `THR-${Date.now().toString().slice(-4)}`;
          const snapshot = {
            id: targetId,
            publicId: codRes.orderId,
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            email: email || `${cleanPhone}@customer.throve.in`,
            total: `₹${finalTotal.toLocaleString('en-IN')}.00`,
            subtotal: `₹${cartSubtotal.toLocaleString('en-IN')}.00`,
            discount: discountAmount ? `₹${discountAmount.toLocaleString('en-IN')}.00` : null,
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

  // Reusable Order Summary Items & Breakdown Block
  const renderSummaryDetails = () => (
    <>
      <div className={styles.itemsList}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.itemRow}>
            {/* Container with overflow: visible prevents quantity badge from clipping */}
            <div className={styles.itemImageContainer}>
              <div className={styles.itemImageThumb}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title || item.name}
                    fill
                    sizes="62px"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <span className={styles.itemQuantityBadge}>{item.qty || 1}</span>
            </div>

            <div className={styles.itemDetails}>
              <h4 className={styles.itemTitle}>{item.title || item.name}</h4>
              <p className={styles.itemVariant}>
                {[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'}
              </p>
            </div>

            <span className={styles.itemPrice}>
              ₹{(((item.priceNum || item.price || 0) * (item.qty || 1))).toLocaleString('en-IN')}.00
            </span>
          </div>
        ))}
      </div>

      {/* COUPON CARD */}
      {appliedCoupon ? (
        <div className={styles.couponAppliedTag}>
          <div>
            <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})
          </div>
          <button type="button" className={styles.removeCouponBtn} onClick={handleRemoveCoupon}>
            Remove
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.couponCard}>
            <input
              type="text"
              placeholder="Discount code or gift card"
              className={styles.couponInput}
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button
              type="button"
              className={styles.couponButton}
              onClick={handleApplyCoupon}
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '-12px', marginBottom: '16px' }}>
              {couponError}
            </p>
          )}
        </div>
      )}

      {/* COST BREAKDOWN */}
      <div className={styles.costBreakdown}>
        <div className={styles.costRow}>
          <span>Subtotal</span>
          <span className={styles.costValue}>₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
        </div>

        {appliedCoupon && (
          <div className={styles.costRow}>
            <span style={{ color: '#166534' }}>Discount ({appliedCoupon.code})</span>
            <span className={styles.costValue} style={{ color: '#166534' }}>
              - ₹{discountAmount.toLocaleString('en-IN')}.00
            </span>
          </div>
        )}

        <div className={styles.costRow}>
          <span>Shipping</span>
          <span className={styles.costValueFree}>Free</span>
        </div>

        <div className={styles.costRow}>
          <span>Estimated Taxes</span>
          <span className={styles.costValue} style={{ color: '#78716c', fontSize: '0.82rem' }}>
            Included in Price (GST)
          </span>
        </div>
      </div>

      {/* FINAL TOTAL */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#78716c', marginRight: '6px' }}>INR</span>
          ₹{finalTotal.toLocaleString('en-IN')}.00
        </span>
      </div>
    </>
  );

  if (!isMounted) {
    return (
      <main className={styles.checkoutLayout} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px', padding: '32px' }}>
          <div className={styles.spinner} style={{ margin: '0 auto 16px', borderColor: '#e5e5e5', borderTopColor: '#111', width: '32px', height: '32px' }} />
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#111', margin: 0, letterSpacing: '0.04em' }}>
            Preparing your checkout...
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
              borderRadius: '4px',
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
      {/* MOBILE SHOPFLO TOP SUMMARY BAR (Collapsible Dropdown) */}
      <div 
        className={styles.mobileSummaryBar} 
        onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
      >
        <div className={styles.mobileSummaryToggle}>
          <span className={styles.mobileCartIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </span>
          <span>{isSummaryExpanded ? 'Hide order summary' : 'Show order summary'}</span>
          <svg 
            className={`${styles.mobileChevron} ${isSummaryExpanded ? styles.mobileChevronOpen : ''}`} 
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div className={styles.mobileSummaryTotal}>
          ₹{finalTotal.toLocaleString('en-IN')}.00
        </div>
      </div>

      {/* MOBILE EXPANDED SUMMARY CONTENT */}
      {isSummaryExpanded && (
        <div className={styles.mobileSummaryContent}>
          {renderSummaryDetails()}
        </div>
      )}

      {/* LEFT COLUMN: SHOPFLO CHECKOUT FORM & SAVED ADDRESS */}
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
          <div className={styles.securityBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {errorMessage && (
          <div className={styles.alertBox}>
            {errorMessage}
          </div>
        )}

        <form className={styles.checkoutForm} onSubmit={(e) => { e.preventDefault(); handlePayNow(); }}>
          {/* 1. CONTACT INFORMATION (CUSTOM COMPONENTS) */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeading}>
              <div className={styles.headingLeft}>
                <span className={styles.stepPill}>1</span>
                <span>Contact Information</span>
              </div>
            </div>

            <div className={styles.formGrid}>
              <CustomInput
                label="Mobile Number (for WhatsApp delivery alerts) *"
                id="contact-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                placeholder="98926 91094"
                prefix="+91"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
                fullWidth
              />

              <CustomInput
                label="Email Address (for GST tax invoice)"
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="client@throve.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </div>
          </div>

          {/* 2. DELIVERY ADDRESS: SAVED CARD OR EDITABLE FORM (CUSTOM COMPONENTS) */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeading}>
              <div className={styles.headingLeft}>
                <span className={styles.stepPill}>2</span>
                <span>Delivery Address</span>
              </div>
              {hasSavedAddress && isEditingAddress && (
                <button
                  type="button"
                  className={styles.changeAddressBtn}
                  onClick={() => setIsEditingAddress(false)}
                >
                  Use Saved Address
                </button>
              )}
            </div>

            {hasSavedAddress && !isEditingAddress ? (
              /* SHOPFLO SAVED ADDRESS CARD */
              <div className={styles.savedAddressCard}>
                <div className={styles.savedAddressHeader}>
                  <span className={styles.savedAddressBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Delivering To
                  </span>
                  <button
                    type="button"
                    className={styles.changeAddressBtn}
                    onClick={() => setIsEditingAddress(true)}
                  >
                    Change
                  </button>
                </div>
                <div className={styles.savedNamePhone}>
                  <span className={styles.savedName}>{firstName} {lastName}</span>
                  <span className={styles.savedPhone}>+91 {phone}</span>
                </div>
                <div className={styles.savedAddressText}>
                  {[address1, address2].filter(Boolean).join(', ')}
                </div>
                <div className={styles.savedCityState}>
                  {city}, {state} — {pincode}
                </div>
                {email && (
                  <div className={styles.savedEmail}>
                    Tax Invoice sent to: {email}
                  </div>
                )}
              </div>
            ) : (
              /* EDITABLE ADDRESS FORM WITH CUSTOM COMPONENTS & PRECISION AUTOFILL */
              <div className={styles.formGrid}>
                <CustomInput
                  label="First Name *"
                  id="shipping-firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

                <CustomInput
                  label="Last Name"
                  id="shipping-lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                {/* Exact WHATWG address-line1 mapping prevents autofill from inverting lines */}
                <CustomInput
                  label="Street Address *"
                  id="shipping-address1"
                  name="address1"
                  type="text"
                  autoComplete="address-line1"
                  placeholder="House / Flat No., Building Name, Street *"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                  fullWidth
                />

                {/* Exact WHATWG address-line2 mapping */}
                <CustomInput
                  label="Apartment, Suite, Landmark (optional)"
                  id="shipping-address2"
                  name="address2"
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Apartment, Suite, Unit, Landmark (optional)"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  fullWidth
                />

                <CustomInput
                  label="PIN Code *"
                  id="shipping-pincode"
                  name="postal-code"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="6-digit PIN code *"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  maxLength={6}
                  required
                />

                <CustomInput
                  label="City *"
                  id="shipping-city"
                  name="address-level2"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                {/* BESPOKE CUSTOM DROPDOWN COMPONENT MATCHING BRAND THEME */}
                <div className={styles.fullWidth}>
                  <CustomSelect
                    label="State *"
                    id="shipping-state"
                    name="address-level1"
                    autoComplete="address-level1"
                    value={state}
                    onChange={(val) => setState(val)}
                    options={INDIAN_STATES}
                    placeholder="Select State *"
                    required
                    searchable
                  />
                </div>

                {hasSavedAddress && (
                  <div className={styles.fullWidth} style={{ marginTop: '4px' }}>
                    <button
                      type="button"
                      className={styles.saveAddressBtn}
                      onClick={persistAddressLocally}
                    >
                      Update Delivery Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. SHIPPING METHOD BANNER */}
          <div className={styles.shippingBanner}>
            <div className={styles.shippingInfo}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span>Express Delivery (2–4 Business Days via Blue Dart / Delhivery Air)</span>
            </div>
            <span className={styles.shippingPrice}>Free</span>
          </div>

          {/* 4. PAYMENT METHOD SELECTOR (REFINED CLEAN UI) */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeading}>
              <div className={styles.headingLeft}>
                <span className={styles.stepPill}>3</span>
                <span>Payment Method</span>
              </div>
            </div>

            <div className={styles.paymentList}>
              {PAYMENT_OPTIONS.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`${styles.paymentCard} ${isSelected ? styles.paymentCardSelected : ''}`}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <div className={`${styles.radioCircle} ${isSelected ? styles.radioCircleSelected : ''}`}>
                      {isSelected && <div className={styles.radioDot} />}
                    </div>

                    <div className={styles.paymentMeta}>
                      <div className={styles.paymentHeader}>
                        <span className={styles.paymentTitle}>{opt.title}</span>
                        {opt.id === 'cashfree' ? (
                          <div className={styles.paymentIconsRow}>
                            <UpiIcon />
                            <GPayIcon />
                            <PhonePeIcon />
                            <RuPayIcon />
                            <MastercardIcon />
                            <VisaIcon />
                          </div>
                        ) : (
                          <div className={styles.paymentIconsRow}>
                            <CodIcon />
                          </div>
                        )}
                      </div>
                      <p className={styles.paymentSubtitle}>{opt.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRIMARY SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              className={styles.payButton}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className={styles.spinner} />
                  <span>Securing Order Session...</span>
                </>
              ) : paymentMethod === 'cod' ? (
                `Confirm Order • Pay ₹${finalTotal.toLocaleString('en-IN')}.00 on Delivery`
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>Pay ₹{finalTotal.toLocaleString('en-IN')}.00</span>
                  <CashfreeIcon height={20} />
                </span>
              )}
            </button>

            <div className={styles.microTrust}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Safe & Secure Checkout • RBI Authorized Cashfree Gateway</span>
            </div>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: DESKTOP STICKY ORDER SUMMARY */}
      <div className={styles.rightCol}>
        <div className={styles.sidebarSummary}>
          <h2 className={styles.summaryTitle}>
            Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h2>

          {renderSummaryDetails()}

          {/* TRUST ASSURANCE CARDS */}
          <div className={styles.trustContainer}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div>
                <div className={styles.trustTextTitle}>100% Genuine Craftsmanship</div>
                <div className={styles.trustTextDesc}>Handcrafted luxury tailored exclusively with sustainable organic fibers.</div>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div>
                <div className={styles.trustTextTitle}>Express Air Delivery</div>
                <div className={styles.trustTextDesc}>Insured priority transit via Blue Dart and Delhivery Air across India.</div>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </div>
              <div>
                <div className={styles.trustTextTitle}>7-Day Doorstep Returns & Exchanges</div>
                <div className={styles.trustTextDesc}>Instant doorstep pickups with zero-hassle inspection.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
