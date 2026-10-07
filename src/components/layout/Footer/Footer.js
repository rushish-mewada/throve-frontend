import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top Section: CTA */}
      <div className={styles.ctaSection}>
        <h3 className={styles.ctaSubheading}>FASHION FOR EVERY SEASON</h3>
        <h2 className={styles.ctaHeading}>Request More Information</h2>
        <p className={styles.ctaText}>
          Throve is a luxury fashion brand
        </p>
        <button className={styles.ctaButton}>Contact Us</button>
      </div>

      {/* Main Footer Content */}
      <div className={styles.mainContent}>
        
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Image 
            src="/assets/images/stacked-logo.svg" 
            alt="Throve" 
            width={160} 
            height={160} 
            className={styles.logo}
          />
        </div>

        {/* Links Columns */}
        <div className={styles.linksContainer}>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>Shop</h3>
            <Link href="/account" className={styles.linkItem}>My account</Link>
            <Link href="/login" className={styles.linkItem}>Login</Link>
            <Link href="/wishlist" className={styles.linkItem}>Wishlist</Link>
            <Link href="/cart" className={styles.linkItem}>Cart</Link>
          </div>
          
          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>Information</h3>
            <Link href="/shipping" className={styles.linkItem}>Shipping Policy</Link>
            <Link href="/returns" className={styles.linkItem}>Returns & Refunds</Link>
            <Link href="/cookies" className={styles.linkItem}>Cookies Policy</Link>
            <Link href="/faq" className={styles.linkItem}>Frequently asked</Link>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>Company</h3>
            <Link href="/about" className={styles.linkItem}>About us</Link>
            <Link href="/privacy" className={styles.linkItem}>Privacy Policy</Link>
            <Link href="/terms" className={styles.linkItem}>Terms & Conditions</Link>
            <Link href="/contact" className={styles.linkItem}>Contact Us</Link>
          </div>
        </div>

        {/* Social Icons */}
        <div className={styles.socialCol}>
          <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className={styles.socialIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className={styles.socialIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>&copy; 2025Throvefashion</p>
      </div>
    </footer>
  );
}
