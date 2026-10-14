"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCartClosing, setIsCartClosing] = useState(false);

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuClosing(false);
      setIsMobileMenuOpen(false);
    }, 400); // match animation duration
  };

  const closeCart = () => {
    setIsCartClosing(true);
    setTimeout(() => {
      setIsCartClosing(false);
      setIsCartDrawerOpen(false);
    }, 400); // match animation duration
  };

  // Prevent background scrolling when a drawer is open
  useEffect(() => {
    if (isMobileMenuOpen || isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen, isCartDrawerOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        
        {/* Mobile Hamburger */}
        <button 
          aria-label="Menu" 
          className={styles.hamburgerBtn} 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

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
          
          <button 
            aria-label="Cart" 
            className={styles.cartBtn}
            onClick={() => setIsCartDrawerOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className={styles.cartBadge}>2</span>
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={`${styles.mobileMenuOverlay} ${isMenuClosing ? styles.overlayClosing : ''}`} 
          onClick={closeMenu}
        >
          <div 
            className={`${styles.mobileMenuContent} ${isMenuClosing ? styles.contentClosing : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Menu</span>
              <button 
                className={styles.closeBtn} 
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <nav className={styles.mobileNav}>
              <Link href="/women" className={styles.mobileNavLink} onClick={closeMenu}>Women</Link>
              <Link href="/men" className={styles.mobileNavLink} onClick={closeMenu}>Men</Link>
              <Link href="/sale" className={styles.mobileNavLinkSale} onClick={closeMenu}>Sale</Link>
              <Link href="/new-arrival" className={styles.mobileNavLink} onClick={closeMenu}>New arrival</Link>
              <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>About us</Link>
            </nav>

            <div className={styles.mobileMenuFooter}>
              <Link href="/account" className={styles.mobileSecondaryLink} onClick={closeMenu}>My Account</Link>
              <Link href="/wishlist" className={styles.mobileSecondaryLink} onClick={closeMenu}>Wishlist</Link>
              <Link href="/contact" className={styles.mobileSecondaryLink} onClick={closeMenu}>Contact Us</Link>
              <div className={styles.mobileSocials}>
                <span className={styles.socialDot}>Ig</span>
                <span className={styles.socialDot}>Fb</span>
                <span className={styles.socialDot}>Yt</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartDrawerOpen && (
        <div 
          className={`${styles.cartOverlay} ${isCartClosing ? styles.overlayClosing : ''}`} 
          onClick={closeCart}
        >
          <div 
            className={`${styles.cartContent} ${isCartClosing ? styles.cartContentClosing : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.cartHeader}>
              <span className={styles.cartTitle}>Your Cart (2)</span>
              <button 
                className={styles.closeBtn} 
                onClick={closeCart}
                aria-label="Close cart"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.cartItems}>
              {/* Dummy Cart Item 1 */}
              <div className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                  <Image src="https://placehold.co/150x180/e0e0e0/666666.png?text=Item" alt="Cart item" fill sizes="90px" style={{objectFit: 'cover'}} />
                </div>
                <div className={styles.cartItemDetails}>
                  <div className={styles.cartItemTop}>
                    <span className={styles.cartItemName}>Brown Jacket</span>
                    <button className={styles.removeBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <span className={styles.cartItemVariant}>Size: M | Color: Brown</span>
                  <div className={styles.cartItemBottom}>
                    <div className={styles.quantitySelector}>
                      <button>-</button>
                      <span>1</span>
                      <button>+</button>
                    </div>
                    <span className={styles.cartItemPrice}>₹ 139,600</span>
                  </div>
                </div>
              </div>
              
              {/* Dummy Cart Item 2 */}
              <div className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                  <Image src="https://placehold.co/150x180/e0e0e0/666666.png?text=Item" alt="Cart item" fill sizes="90px" style={{objectFit: 'cover'}} />
                </div>
                <div className={styles.cartItemDetails}>
                  <div className={styles.cartItemTop}>
                    <span className={styles.cartItemName}>Denim Shirt</span>
                    <button className={styles.removeBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <span className={styles.cartItemVariant}>Size: L | Color: Blue</span>
                  <div className={styles.cartItemBottom}>
                    <div className={styles.quantitySelector}>
                      <button>-</button>
                      <span>1</span>
                      <button>+</button>
                    </div>
                    <span className={styles.cartItemPrice}>₹ 89,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cartFooter}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span className={styles.subtotalPrice}>₹ 228,600</span>
              </div>
              <p className={styles.taxNote}>Shipping, taxes, and discount codes calculated at checkout.</p>
              <button className={styles.checkoutBtn}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
