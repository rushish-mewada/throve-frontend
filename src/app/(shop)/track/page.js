import OrderTracker from './_components/OrderTracker/OrderTracker';
import styles from './page.module.css';

export const metadata = {
  title: 'Track Your Order | Throve Logistics',
  description: 'Real-time order tracking and shipment status across India for Throve clients.',
};

export default function TrackOrderPage() {
  return (
    <main className={styles.trackPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>EXPRESS LOGISTICS DISPATCH</span>
          <h1 className={styles.title}>Track Your Shipment</h1>
          <p className={styles.subtitle}>
            Enter your order reference ID and registered contact number or email to view live delivery updates.
          </p>
        </div>

        <OrderTracker />
      </div>
    </main>
  );
}
