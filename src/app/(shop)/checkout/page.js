"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './page.module.css';
import { initiateCashfreeCheckoutAction } from '@/actions/checkout';
import { launchCashfreeCheckout } from '@/lib/cashfree';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems } = useStore();
  const [statusText, setStatusText] = useState('Initiating Cashfree One Click Checkout...');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;

    async function launch() {
      if (!cartItems || cartItems.length === 0) {
        router.replace('/cart');
        return;
      }

      try {
        const orderItems = cartItems.map((item) => ({
          variantId: item.productId || item.handle || "var_01",
          title: item.title,
          quantity: item.qty || 1,
          pricePaise: Math.round((item.priceNum || 2900) * 100),
        }));

        const res = await initiateCashfreeCheckoutAction({ items: orderItems });
        if (!active) return;

        if (res.success && res.paymentSessionId) {
          setStatusText('Launching Cashfree One Click Checkout...');
          await launchCashfreeCheckout({
            paymentSessionId: res.paymentSessionId,
            environment: res.environment || 'production',
          });
        } else {
          setErrorMsg(res.error || 'Failed to initialize payment');
        }
      } catch (err) {
        if (!active) return;
        setErrorMsg(err.message || 'Payment initialization failed');
      }
    }

    launch();

    return () => {
      active = false;
    };
  }, [cartItems, router]);

  return (
    <main className={styles.checkoutLayout} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '440px', padding: '32px' }}>
        {errorMsg ? (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#111' }}>Checkout Notice</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>{errorMsg}</p>
            <Link
              href="/cart"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#111',
                color: '#fff',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '2px',
              }}
            >
              Return to Cart
            </Link>
          </div>
        ) : (
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px solid #e5e5e5',
              borderTopColor: '#111',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <h2 style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '0.04em', color: '#111', marginBottom: '8px' }}>
              {statusText}
            </h2>
            <p style={{ fontSize: '13px', color: '#888' }}>
              Secure 256-bit encrypted checkout via Cashfree Payments
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
