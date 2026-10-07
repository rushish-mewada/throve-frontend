import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <Image 
            src="/assets/images/inline-logo.svg" 
            alt="Throve" 
            width={140} 
            height={32} 
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/women" className={styles.navLinkActive}>Women</Link>
          <Link href="/men" className={styles.navLink}>Men</Link>
          <Link href="/sale" className={styles.navLinkSale}>Sale</Link>
          <Link href="/new-arrival" className={styles.navLink}>New arrival</Link>
          <Link href="/about" className={styles.navLink}>About us</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button aria-label="Search" className={styles.iconBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M20 20L16 16"/>
            </svg>
          </button>
          
          <Link href="/account" aria-label="Account" className={styles.iconBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          
          <Link href="/wishlist" aria-label="Wishlist" className={styles.iconBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </Link>
          
          <Link href="/cart" aria-label="Cart" className={styles.cartBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className={styles.cartBadge}>0</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
