"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import styles from './AccountDashboard.module.css';
import Modal from '@/components/ui/Modal/Modal';
import { updateCustomerProfileAction } from '@/actions/customer';

export default function AccountDashboard({ user: initialUser, orders, addresses: initialAddresses }) {
  const [activeTab, setActiveTab] = useState('menu');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logoutUser, wishlistItems = [], removeFromWishlist, addToCart } = useStore();

  // User profile state
  const [user, setUser] = useState(initialUser);
  const [profileName, setProfileName] = useState(initialUser.name || '');
  const [profileEmail, setProfileEmail] = useState(initialUser.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Saved addresses state (hydrated from localStorage or initial props)
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Primary',
    name: initialUser.name || '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '',
  });

  // Coupons copy state
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('throve_user_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/account/login";
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await updateCustomerProfileAction({
        name: profileName,
        email: profileEmail,
      });

      if (res?.ok) {
        setUser((prev) => ({
          ...prev,
          name: profileName,
          email: profileEmail,
        }));
        setProfileMsg({ type: 'success', text: 'Profile details saved successfully.' });
        try {
          const storedCust = localStorage.getItem('throve_customer');
          const parsed = storedCust ? JSON.parse(storedCust) : {};
          localStorage.setItem('throve_customer', JSON.stringify({
            ...parsed,
            name: profileName,
            email: profileEmail,
          }));
        } catch {}
      } else {
        setProfileMsg({ type: 'error', text: res?.error || 'Failed to save changes.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Network error saving profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.address || !addressForm.pin) {
      return;
    }

    let nextAddresses = [];
    if (editingAddressId) {
      nextAddresses = addresses.map((addr) =>
        addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
      );
    } else {
      nextAddresses = [
        ...addresses,
        {
          ...addressForm,
          id: Date.now(),
        },
      ];
    }

    setAddresses(nextAddresses);
    try {
      localStorage.setItem('throve_user_addresses', JSON.stringify(nextAddresses));
    } catch {}

    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({
      type: 'Home',
      name: user.name || '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '',
    });
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
    setAddressForm({
      type: addr.type || 'Home',
      name: addr.name || '',
      address: addr.address || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      pin: addr.pin || '',
    });
  };

  const handleDeleteAddress = (id) => {
    const nextAddresses = addresses.filter((a) => a.id !== id);
    setAddresses(nextAddresses);
    try {
      localStorage.setItem('throve_user_addresses', JSON.stringify(nextAddresses));
    } catch {}
  };

  const handleCopyCoupon = (code) => {
    if (!code) return;
    try {
      navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch {
      // Fallback
    }
  };

  // On desktop, we always want to show content. If state is 'menu', default to 'overview'.
  const displayTab = activeTab === 'menu' ? 'overview' : activeTab;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></> },
    { id: 'orders', label: 'Orders & Returns', icon: <><path d="M21 8V21H3V8"></path><path d="M1 3h22v5H1z"></path></> },
    { id: 'wishlist', label: 'Wishlist', icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></> },
    { id: 'coupons', label: 'My Coupons', icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></> },
    { id: 'addresses', label: 'Saved Addresses', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></> },
    { id: 'profile', label: 'Profile Details', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></> },
    { id: 'support', label: 'Help & Support', icon: <><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></> },
  ];

  return (
    <main className={styles.accountLayout}>
      <div className={styles.container}>
        
        {/* MOBILE MENU VIEW (THROVE STYLE) */}
        <div className={`${styles.mobileMenuContainer} ${activeTab === 'menu' ? styles.showOnMobile : styles.hideOnMobile}`}>
          <div className={styles.throveUserBanner}>
            <div className={styles.throveAvatar}>{user.name.charAt(0)}</div>
            <div className={styles.throveUserInfo}>
              <h1>{user.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <span className={styles.throveTierBadge}>{user.tier}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#eab308' }}>
                  {user.pointsFormatted || `${(user.points || 0).toLocaleString('en-IN')} Pts`}
                </span>
              </div>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
            <button
              type="button"
              className={styles.throveEditBtn}
              onClick={() => setActiveTab('profile')}
              aria-label="Edit Profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
          
          <div className={styles.throveMenuList}>
            <div className={styles.throveMenuDivider}></div>
            {navItems.filter(item => item.id !== 'overview').map(item => (
              <div key={item.id} className={styles.throveMenuItem} onClick={() => setActiveTab(item.id)}>
                <div className={styles.throveMenuLeft}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {item.icon}
                  </svg>
                  <span>{item.label}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            ))}
            <div className={styles.throveMenuDivider}></div>
            <button className={styles.throveLogoutBtn} onClick={() => setShowLogoutModal(true)}>
              Logout
            </button>
          </div>
        </div>

        {/* DESKTOP LAYOUT / MOBILE SUB-VIEW */}
        <div className={`${styles.desktopContainer} ${activeTab !== 'menu' ? styles.showOnMobile : styles.hideOnMobile}`}>
          
          {/* Mobile Back Header */}
          <div className={styles.mobileBackHeader}>
            <button className={styles.backBtn} onClick={() => setActiveTab('menu')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h1 className={styles.mobileBackTitle}>
              {navItems.find(i => i.id === displayTab)?.label || 'Details'}
            </h1>
          </div>

          {/* Top User Banner (Desktop Only) */}
          <div className={styles.userBanner}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user.name.charAt(0)}
              </div>
              <div className={styles.userDetails}>
                <h1>{user.name}</h1>
                <p>{user.phone} • {user.email}</p>
              </div>
            </div>
            <div className={styles.userTier}>
              <div className={styles.tierHeader}>
                <span className={styles.tierBadge}>{user.tier}</span>
                <span className={styles.points}>{user.pointsFormatted || `${(user.points || 0).toLocaleString('en-IN')} Pts`}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.min(100, Math.max(0, user.progressPercent || 0))}%` }}
                ></div>
              </div>
              <p className={styles.tierHint}>
                {user.tierHint || "Spend more to reach the next privilege tier"}
              </p>
            </div>
          </div>

          <div className={styles.content}>
            {/* Sidebar Navigation (Desktop Only) */}
            <aside className={styles.sidebar}>
              <nav className={styles.nav}>
              {navItems.map(item => (
                <button 
                  key={item.id}
                  className={`${styles.navBtn} ${displayTab === item.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {item.icon}
                  </svg>
                  <span>{item.label}</span>
                </button>
              ))}
              <div className={styles.navDivider}></div>
              <button 
                type="button" 
                onClick={() => setShowLogoutModal(true)} 
                className={styles.logoutBtn}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Panel */}
          <section className={styles.panel}>
            
            {/* OVERVIEW TAB */}
            {displayTab === 'overview' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>Overview</h2>
                
                <div className={styles.overviewGrid}>
                  <div className={styles.overviewCard} onClick={() => setActiveTab('orders')}>
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 8V21H3V8"></path><path d="M1 3h22v5H1z"></path>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Orders</h3>
                      <p>Check your order status</p>
                    </div>
                  </div>
                  <div className={styles.overviewCard} onClick={() => setActiveTab('coupons')}>
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Coupons</h3>
                      <p>Manage discounts & offers</p>
                    </div>
                  </div>
                  <div className={styles.overviewCard} onClick={() => setActiveTab('addresses')}>
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Addresses</h3>
                      <p>Save delivery locations</p>
                    </div>
                  </div>
                </div>

                <h3 className={styles.sectionSubTitle}>Recent Orders</h3>
                {orders.length === 0 ? (
                  <p style={{ color: "#78716c", fontSize: "14px", margin: "12px 0" }}>No recent orders. Your purchases will appear here.</p>
                ) : (
                  orders.slice(0,1).map(order => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderCardImage}>
                        <Image src={order.image} alt="Product" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.orderCardInfo}>
                        <h4>{order.id}</h4>
                        <p>Ordered on {order.date}</p>
                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || ''}`}>{order.status}</span>
                      </div>
                      <div className={styles.orderCardAction}>
                        <Link href="/track" className={styles.viewBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>Track</Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {displayTab === 'orders' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>Orders & Returns</h2>
                <div className={styles.orderList}>
                  {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <p style={{ color: "#78716c", fontSize: "14px", marginBottom: "16px" }}>You have not placed any orders yet.</p>
                      <Link href="/collections" className={styles.primaryBtn} style={{ display: "inline-block", textDecoration: "none" }}>
                        Discover Collection
                      </Link>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderCardImage}>
                          <Image src={order.image} alt="Product" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.orderCardInfo}>
                          <h4>{order.id}</h4>
                          <p>Total: {order.total}</p>
                          <p>Placed on {order.date}</p>
                          <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || ''}`}>{order.status}</span>
                        </div>
                        <div className={styles.orderCardAction}>
                          <Link href={`/order/${encodeURIComponent(order.id)}`} style={{ textDecoration: 'none' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {displayTab === 'wishlist' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>My Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items that you like in your wishlist.</p>
                    <Link href="/collections" className={styles.primaryBtn} style={{ textDecoration: 'none' }}>Continue Shopping</Link>
                  </div>
                ) : (
                  <div className={styles.orderList}>
                    {wishlistItems.map((item) => (
                      <div key={item.id} className={styles.orderCard}>
                        <div className={styles.orderCardImage}>
                          <Image src={item.image || '/images/hero/slide4.png'} alt={item.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.orderCardInfo}>
                          <h4>{item.title}</h4>
                          <p>{item.price}</p>
                          <span className={styles.statusBadge} style={{ background: '#f5f5f5', color: '#111' }}>
                            {item.category || 'Collection'}
                          </span>
                        </div>
                        <div className={styles.orderCardAction} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            className={styles.viewBtn}
                            onClick={() => addToCart(item, 'M', 'Standard', 1, true)}
                          >
                            Add to Bag
                          </button>
                          <button
                            type="button"
                            className={styles.linkBtnDelete}
                            onClick={() => removeFromWishlist(item.id)}
                            style={{ textDecoration: 'none', padding: '8px 12px' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COUPONS TAB */}
            {displayTab === 'coupons' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>My Coupons</h2>
                <div className={styles.couponList}>
                  <div className={styles.couponCard}>
                    <div className={styles.couponLeft}>
                      <span className={styles.discountAmt}>FLAT 15% OFF</span>
                      <p>Valid on all streetwear jackets & tailoring. Min spend ₹2000.</p>
                    </div>
                    <div className={styles.couponRight}>
                      <button
                        type="button"
                        className={styles.couponCode}
                        onClick={() => handleCopyCoupon('THROVE15')}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to copy code"
                      >
                        {copiedCoupon === 'THROVE15' ? 'COPIED!' : 'THROVE15'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.couponCard}>
                    <div className={styles.couponLeft}>
                      <span className={styles.discountAmt}>FREE SHIPPING</span>
                      <p>Complimentary Express Air delivery across all Indian pin codes.</p>
                    </div>
                    <div className={styles.couponRight}>
                      <button
                        type="button"
                        className={styles.couponCode}
                        onClick={() => handleCopyCoupon('FREEDEL')}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to copy code"
                      >
                        {copiedCoupon === 'FREEDEL' ? 'COPIED!' : 'FREEDEL'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {displayTab === 'addresses' && (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <h2 className={styles.tabTitle}>Saved Addresses ({addresses.length})</h2>
                  <button
                    type="button"
                    className={styles.outlineBtn}
                    onClick={() => {
                      setIsAddingAddress(!isAddingAddress);
                      setEditingAddressId(null);
                      setAddressForm({
                        type: 'Home',
                        name: user.name || '',
                        address: '',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        pin: '',
                      });
                    }}
                  >
                    {isAddingAddress ? 'Cancel' : '+ Add New'}
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleSaveAddress} className={styles.profileForm} style={{ marginBottom: '32px', background: '#fafafa', padding: '24px', borderRadius: '8px', border: '1px solid #eaeaec' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111' }}>
                      {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                    </h3>
                    <div className={styles.inputGroup}>
                      <label>Address Label (e.g. Home, Office, Studio)</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={addressForm.type}
                        onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Recipient Full Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Flat, Suite, Street Address</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className={styles.inputGroup}>
                        <label>City</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Pincode</label>
                        <input
                          type="text"
                          maxLength={6}
                          className={styles.input}
                          value={addressForm.pin}
                          onChange={(e) => setAddressForm({ ...addressForm, pin: e.target.value.replace(/\D/g, '') })}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button type="submit" className={styles.primaryBtn}>
                        {editingAddressId ? 'Save Changes' : 'Add Address'}
                      </button>
                      <button
                        type="button"
                        className={styles.outlineBtn}
                        onClick={() => {
                          setIsAddingAddress(false);
                          setEditingAddressId(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 && !isAddingAddress && (
                  <div style={{ padding: '32px 20px', textAlign: 'center', backgroundColor: '#fafaf9', borderRadius: '8px', border: '1px solid #e7e5e4', color: '#78716c' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 500, color: '#1c1917' }}>No saved addresses yet</p>
                    <p style={{ margin: 0, fontSize: '13px' }}>Your delivery address will be gathered seamlessly at the time of checkout, or you can add one now.</p>
                  </div>
                )}

                <div className={styles.addressGrid}>
                  {addresses.map(addr => (
                    <div key={addr.id} className={styles.addressCard}>
                      <span className={styles.addressType}>{addr.type}</span>
                      <h4>{addr.name}</h4>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} {addr.pin}</p>
                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => handleEditAddress(addr)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.linkBtnDelete}
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {displayTab === 'profile' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>Profile Details</h2>
                {profileMsg && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '20px',
                      backgroundColor: profileMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                      color: profileMsg.type === 'success' ? '#166534' : '#991b1b',
                      border: `1px solid ${profileMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    {profileMsg.text}
                  </div>
                )}
                <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      defaultValue={user.phone}
                      className={styles.input}
                      readOnly
                      style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
                    />
                    <span className={styles.helpText}>To change your number, verify a new one via WhatsApp login.</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                  <button type="submit" disabled={profileSaving} className={styles.primaryBtn}>
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* SUPPORT TAB */}
            {displayTab === 'support' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>Help & Support</h2>
                <div className={styles.overviewGrid}>
                  <a
                    href="https://wa.me/919892691094?text=Hi%20Throve%20Concierge,%20I%20need%20assistance%20with%20my%20account"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overviewCard}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Chat with Us</h3>
                      <p>WhatsApp Concierge: +91 98926 91094</p>
                    </div>
                  </a>
                  <Link
                    href="/policies/refunds"
                    className={styles.overviewCard}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Return Policy</h3>
                      <p>Learn about 7-day easy returns</p>
                    </div>
                  </Link>
                  <Link
                    href="/faq"
                    className={styles.overviewCard}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>FAQs</h3>
                      <p>Answers to common questions</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>
      </div>
      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        title="Log Out"
        actions={
          <>
            <button onClick={() => setShowLogoutModal(false)} className={styles.outlineBtn}>Cancel</button>
            <button onClick={handleLogout} className={styles.primaryBtnDelete}>Yes, Log Out</button>
          </>
        }
      >
        <p>Are you sure you want to log out of your account?</p>
      </Modal>
      
    </main>
  );
}
