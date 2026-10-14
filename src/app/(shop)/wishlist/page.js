import WishlistGrid from './_components/WishlistGrid/WishlistGrid';
import styles from './page.module.css';

export const metadata = {
  title: 'Wishlist | Throve Luxury Streetwear',
  description: 'View and manage your saved Throve pieces. Exclusive Indian luxury streetwear.',
};

export default function WishlistPage() {
  return (
    <main className={styles.wishlistPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>CURATED SAVED PIECES</span>
          <h1 className={styles.title}>Your Wishlist</h1>
          <p className={styles.subtitle}>
            Items saved to your personal collection. Stock is limited for all seasonal drops.
          </p>
        </div>
        <WishlistGrid />
      </div>
    </main>
  );
}
