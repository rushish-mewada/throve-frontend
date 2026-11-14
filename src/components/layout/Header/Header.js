"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import FloatingSearch from '@/components/layout/FloatingSearch/FloatingSearch';
import styles from './Header.module.css';
import { initiateCashfreeCheckoutAction } from '@/actions/checkout';
import { launchCashfreeCheckout } from '@/lib/cashfree';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isCartClosing, setIsCartClosing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerCheckingOut, setIsDrawerCheckingOut] = useState(false);

  const {
    cartItems,
    cartCount,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQty,
    removeFromCart,
    wishlistCount,
    isLoggedIn,
    user,
  } = useStore();

  const isLinkActive = (path) => {
    if (!pathname) return false;
    if (path === '/women') return pathname === '/women' || pathname.startsWith('/collections/women');
    if (path === '/men') return pathname === '/men' || pathname.startsWith('/collections/men');
    if (path === '/sale') return pathname === '/sale' || pathname.startsWith('/collections/sale');
    if (path === '/new-arrival') return pathname === '/new-arrival' || pathname.startsWith('/collections/new-arrival');
    if (path === '/about') return pathname === '/about';
    return pathname === path;
  };

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

  // Prevent background scrolling when a drawer or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isCartDrawerOpen || isSearchOpen) {
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
  }, [isMobileMenuOpen, isCartDrawerOpen, isSearchOpen]);

  // Global shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleDrawerCheckout = async () => {
    if (isDrawerCheckingOut || cartItems.length === 0) return;
    setIsDrawerCheckingOut(true);
    try {
      const orderItems = cartItems.map((item) => ({
        variantId: item.productId || item.handle || "var_01",
        title: item.title,
        quantity: item.qty || 1,
        pricePaise: Math.round((item.priceNum || 2900) * 100),
      }));

      const res = await initiateCashfreeCheckoutAction({ items: orderItems });
      if (res.success && res.paymentSessionId) {
        closeCart();
        await launchCashfreeCheckout({
          paymentSessionId: res.paymentSessionId,
          environment: res.environment || "production",
        });
      } else {
        console.error("Cashfree checkout error:", res?.error);
      }
    } catch (err) {
      console.error("Cashfree checkout error:", err);
    } finally {
      setIsDrawerCheckingOut(false);
    }
  };

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
          <Link
            href="/women"
            className={isLinkActive('/women') ? styles.navLinkActive : styles.navLink}
          >
            Women
          </Link>
          <Link
            href="/men"
            className={isLinkActive('/men') ? styles.navLinkActive : styles.navLink}
          >
            Men
          </Link>
          <Link
            href="/sale"
            className={`${styles.navLinkSale} ${isLinkActive('/sale') ? styles.navLinkActive : ''}`}
          >
            Sale
          </Link>
          <Link
            href="/new-arrival"
            className={isLinkActive('/new-arrival') ? styles.navLinkActive : styles.navLink}
          >
            New arrival
          </Link>
          <Link
            href="/about"
            className={isLinkActive('/about') ? styles.navLinkActive : styles.navLink}
          >
            About us
          </Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            aria-label="Search"
            className={styles.iconBtn}
            onClick={() => setIsSearchOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M20 20L16 16"/>
            </svg>
          </button>
          
          <Link 
            href={isLoggedIn ? "/account" : "/account/login"} 
            aria-label={isLoggedIn ? "My Account" : "Login"} 
            title={isLoggedIn ? "My Account" : "Login"} 
            className={styles.iconBtn}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          
          <Link href="/wishlist" aria-label="Wishlist" className={styles.iconBtn} style={{ position: 'relative' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && <span className={styles.cartBadge}>{wishlistCount}</span>}
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
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>

        {/* Mobile Right Spacer for perfect logo centering */}
        <div className={styles.mobileRightSpacer} aria-hidden="true" />

      </div>

      {/* Floating Bottom Menu for Mobile View */}
      <nav className={styles.floatingBottomBar} aria-label="Mobile Navigation">
        <Link 
          href="/" 
          className={`${styles.bottomNavItem} ${pathname === '/' ? styles.bottomNavItemActive : ''}`}
          aria-label="Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={pathname === '/' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className={styles.bottomNavLabel}>Home</span>
        </Link>

        <Link 
          href="/collections" 
          className={`${styles.bottomNavItem} ${pathname?.startsWith('/collections') ? styles.bottomNavItemActive : ''}`}
          aria-label="Shop Collections"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span className={styles.bottomNavLabel}>Shop</span>
        </Link>

        <button 
          type="button"
          className={`${styles.bottomNavItem} ${isSearchOpen ? styles.bottomNavItemActive : ''}`}
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7"/>
            <path d="M20 20L16 16"/>
          </svg>
          <span className={styles.bottomNavLabel}>Search</span>
        </button>

        <Link 
          href="/wishlist" 
          className={`${styles.bottomNavItem} ${pathname === '/wishlist' ? styles.bottomNavItemActive : ''}`}
          aria-label="Wishlist"
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={pathname === '/wishlist' ? "#ef4444" : "none"} stroke={pathname === '/wishlist' ? "#ef4444" : "currentColor"} strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && <span className={styles.bottomNavBadge}>{wishlistCount}</span>}
          </div>
          <span className={styles.bottomNavLabel}>Wishlist</span>
        </Link>

        <button 
          type="button"
          className={`${styles.bottomNavItem} ${isCartDrawerOpen ? styles.bottomNavItemActive : ''}`}
          onClick={() => setIsCartDrawerOpen(true)}
          aria-label="Bag"
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className={styles.bottomNavBadge}>{cartCount}</span>}
          </div>
          <span className={styles.bottomNavLabel}>Bag</span>
        </button>
      </nav>

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
              <Link 
                href={isLoggedIn ? "/account" : "/account/login"} 
                className={styles.mobileSecondaryLink} 
                onClick={closeMenu}
              >
                {isLoggedIn ? "My Account" : "Login"}
              </Link>
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
              <span className={styles.cartTitle}>Your Cart ({cartCount})</span>
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
              {cartItems.length === 0 ? (
                <div style={{ padding: '48px 16px', textAlign: 'center', color: '#666666' }}>
                  <p style={{ fontSize: '1rem', marginBottom: '12px' }}>Your bag is currently empty.</p>
                  <Link
                    href="/collections/women"
                    onClick={closeCart}
                    style={{ color: '#111111', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Explore Collections →
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      <Image src={item.image} alt={item.title || item.name} fill sizes="90px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <div className={styles.cartItemTop}>
                        <span className={styles.cartItemName}>{item.title || item.name}</span>
                        <button
                          className={styles.removeBtn}
                          aria-label="Remove item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      <span className={styles.cartItemVariant}>{item.variant}</span>
                      <div className={styles.cartItemBottom}>
                        <div className={styles.quantitySelector}>
                          <button onClick={() => updateCartQty(item.id, -1)} aria-label="Decrease quantity">-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <span className={styles.cartItemPrice}>₹ {((item.priceNum || item.price || 0) * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.cartFooter}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span className={styles.subtotalPrice}>₹ {cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className={styles.taxNote}>Shipping, taxes, and discount codes calculated at checkout.</p>
              <div className={styles.cartActions}>
                <button
                  type="button"
                  onClick={handleDrawerCheckout}
                  disabled={isDrawerCheckingOut}
                  className={styles.checkoutBtn}
                  style={{ width: '100%', flex: '1 1 100%' }}
                >
                  {isDrawerCheckingOut ? "Connecting Cashfree..." : "Checkout with Cashfree"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Instant Search Modal */}
      <FloatingSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
}
