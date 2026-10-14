import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// Dummy Data
const dummyOrder = {
  id: 'ORD-893240',
  date: 'October 10, 2026',
  email: 'aryan@example.com',
  total: '₹4,300',
  paymentMethod: 'Razorpay (UPI)',
  shippingAddress: {
    name: 'Aryan Sharma',
    address: '123 Fashion Street, Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '400001'
  },
  items: [
    { id: 1, image: 'https://placehold.co/150x180/111111/ffffff.png?text=Jacket', title: 'Long Sleeve Jacket', variant: 'Peach / 8', price: '₹2,800', qty: 1 },
    { id: 2, image: 'https://placehold.co/150x180/e0e0e0/666666.png?text=Shirt', title: 'Classic Denim Shirt', variant: 'Blue / M', price: '₹1,500', qty: 1 },
  ]
};

export default async function OrderConfirmationPage({ params }) {
  const resolvedParams = await params;
  const orderId = resolvedParams?.id || dummyOrder.id;

  return (
    <main className={styles.orderLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1>Order Confirmed</h1>
          <p>Thank you for your purchase! Your order <strong>{orderId}</strong> has been received.</p>
          <p className={styles.emailHint}>We've sent a confirmation email to {dummyOrder.email}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.leftCol}>
            <div className={styles.section}>
              <h2>Order Details</h2>
              <div className={styles.itemsList}>
                {dummyOrder.items.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.itemImage}>
                      <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="80px" />
                    </div>
                    <div className={styles.itemInfo}>
                      <h3>{item.title}</h3>
                      <p>{item.variant}</p>
                    </div>
                    <div className={styles.itemPriceQty}>
                      <p>{item.price}</p>
                      <span>Qty: {item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Tracking Information</h2>
              <div className={styles.trackingBox}>
                <div className={styles.trackingStep + ' ' + styles.active}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Order Placed</h4>
                    <p>{dummyOrder.date}</p>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Processing</h4>
                    <p>Preparing your items</p>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Shipped</h4>
                    <p>Waiting for courier pickup</p>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Delivered</h4>
                    <p>Estimated in 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.summaryCard}>
              <h2>Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{dummyOrder.total}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.summaryRow + ' ' + styles.totalRow}>
                <span>Total</span>
                <span>{dummyOrder.total}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h2>Delivery Address</h2>
              <p><strong>{dummyOrder.shippingAddress.name}</strong></p>
              <p>{dummyOrder.shippingAddress.address}</p>
              <p>{dummyOrder.shippingAddress.city}, {dummyOrder.shippingAddress.state} {dummyOrder.shippingAddress.pin}</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Payment Method</h2>
              <p>{dummyOrder.paymentMethod}</p>
            </div>
            
            <div className={styles.actions}>
              <Link href="/account" className={styles.outlineBtn}>View My Orders</Link>
              <Link href="/" className={styles.primaryBtn}>Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
