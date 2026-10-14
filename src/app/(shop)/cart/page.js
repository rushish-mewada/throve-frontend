import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const dummyCartItems = [
  { id: 1, image: 'https://placehold.co/150x180/e0e0e0/666666.png?text=Jacket', title: 'Long Sleeve Jacket', variant: 'Peach / 8', price: '₹2,800.00', qty: 1 },
  { id: 2, image: 'https://placehold.co/150x180/d5d5d5/666666.png?text=Shirt', title: 'Classic Denim Shirt', variant: 'Blue / M', price: '₹1,500.00', qty: 2 },
];

export default function CartPage() {
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
            {dummyCartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemProduct}>
                  <div className={styles.itemImage}>
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="120px" />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemVariant}>{item.variant}</p>
                    <p className={styles.itemPrice}>{item.price}</p>
                  </div>
                </div>
                
                <div className={styles.itemQty}>
                  <div className={styles.qtySelector}>
                    <button className={styles.qtyBtn}>-</button>
                    <span className={styles.qtyNum}>{item.qty}</span>
                    <button className={styles.qtyBtn}>+</button>
                  </div>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
                
                <div className={styles.itemTotal}>
                  {item.price} {/* Simplified for dummy data */}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.couponRow}>
              <div className={styles.couponInfo}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>Apply Coupons</span>
              </div>
              <button className={styles.applyOutlineBtn}>Apply</button>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹4,300.00</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Estimated Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>₹4,300.00</span>
            </div>
            
            <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>
            
            <Link href="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
            
            <Link href="/collections/women" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
