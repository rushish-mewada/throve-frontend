"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import styles from './AccountDashboard.module.css';
import Modal from '@/components/ui/Modal/Modal';
import {
  updateCustomerProfileAction,
  saveCustomerAddressAction,
  deleteCustomerAddressAction,
} from '@/actions/customer';

function getStatusConfig(status, paymentStatus, styles) {
  const norm = String(status || '').toLowerCase().replace(/[\s-]/g, '_');
  const payNorm = String(paymentStatus || '').toLowerCase();

  if (norm === 'payment_failed' || payNorm === 'failed' || (norm === 'failed' && payNorm !== 'captured')) {
    return {
      label: 'Payment Failed',
      className: styles.statusFailed,
      dotClass: styles.statusDotRose,
      desc: 'Payment session expired. Click Retry Payment to complete your order.',
      isFailedPayment: true,
    };
  }

  if (norm === 'pending_payment' || payNorm === 'pending' || norm === 'payment_pending') {
    return {
      label: 'Payment Pending',
      className: styles.statusPendingPayment,
      dotClass: styles.statusDotAmber,
      desc: 'Awaiting payment confirmation before atelier tailoring begins.',
      isPendingPayment: true,
    };
  }
  if (norm === 'dispatched' || norm === 'shipped') {
    return {
      label: 'Dispatched · In Transit',
      className: styles.statusDispatched,
      dotClass: styles.statusDotBlue,
      desc: 'Your garment has departed the atelier and is in transit.',
      isDispatched: true,
    };
  }
  if (norm === 'delivered') {
    return {
      label: 'Delivered',
      className: styles.statusDelivered,
      dotClass: styles.statusDotEmerald,
      desc: 'Hand-delivered to your designated address.',
      isDelivered: true,
    };
  }
  if (norm === 'cancelled' || norm === 'failed') {
    return {
      label: 'Cancelled',
      className: styles.statusCancelled,
      dotClass: styles.statusDotStone,
      desc: 'This order was cancelled.',
      isCancelled: true,
    };
  }
  if (norm === 'confirmed' || norm === 'captured') {
    return {
      label: 'Order Confirmed',
      className: styles.statusConfirmed,
      dotClass: styles.statusDotGreen,
      desc: 'Payment captured. Queued for quality inspection & packaging.',
    };
  }
  return {
    label: 'In Atelier Tailoring',
    className: styles.statusProcessing,
    dotClass: styles.statusDotIndigo,
    desc: 'Artisans are crafting and inspecting your garment.',
  };
}

export default function AccountDashboard({
  user: initialUser,
  orders,
  addresses: initialAddresses,
  coupons: initialCoupons,
}) {
  const [activeTab, setActiveTab] = useState('menu');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logoutUser, wishlistItems = [], removeFromWishlist, addToCart, openQuickSize } = useStore();

  // User profile state
  const [user, setUser] = useState(initialUser);
  const [profileName, setProfileName] = useState(initialUser.name || '');
  const [profileEmail, setProfileEmail] = useState(initialUser.email || '');
  const [profileAvatar, setProfileAvatar] = useState(initialUser.avatarUrl || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const fileInputRef = useRef(null);

  // Active coupons from backend
  const coupons = Array.isArray(initialCoupons) && initialCoupons.length > 0 ? initialCoupons : [];

  // Saved addresses state (hydrated from backend props or localStorage fallback)
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Primary',
    name: initialUser.name || '',
    phone: (initialUser.phone || '').replace(/[^0-9]/g, '').slice(-10),
    email: initialUser.email || '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '',
  });

  // Coupons copy state
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  useEffect(() => {
    if (initialAddresses && initialAddresses.length > 0) {
      setAddresses(initialAddresses);
      try {
        localStorage.setItem('throve_user_addresses', JSON.stringify(initialAddresses));
      } catch {}
      return;
    }
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
  }, [initialAddresses]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/account/login";
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileMsg({ type: 'error', text: 'Please select a valid image file (JPG, PNG, WEBP).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ type: 'error', text: 'Image size should be less than 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result;
      if (base64 && typeof base64 === 'string') {
        setProfileAvatar(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await updateCustomerProfileAction({
        name: profileName,
        email: profileEmail,
        avatarUrl: profileAvatar,
      });

      if (res?.ok) {
        setUser((prev) => ({
          ...prev,
          name: profileName,
          email: profileEmail,
          avatarUrl: profileAvatar,
        }));
        setProfileMsg({ type: 'success', text: 'Profile details saved successfully.' });
        try {
          const storedCust = localStorage.getItem('throve_customer');
          const parsed = (storedCust && typeof storedCust === 'string' && storedCust.startsWith('{')) ? JSON.parse(storedCust) : {};
          localStorage.setItem('throve_customer', JSON.stringify({
            ...parsed,
            name: profileName,
            email: profileEmail,
            avatarUrl: profileAvatar,
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

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.address || !addressForm.pin) {
      return;
    }

    const cleanPhone = (addressForm.phone || '').replace(/[^0-9]/g, '').slice(-10);
    const normalized = {
      ...addressForm,
      phone: cleanPhone,
      email: addressForm.email || '',
      address1: addressForm.address,
      pincode: addressForm.pin,
    };

    let serverAssignedId = editingAddressId;
    try {
      const res = await saveCustomerAddressAction({
        id: editingAddressId,
        label: addressForm.type || 'Home',
        name: addressForm.name,
        phone: cleanPhone,
        address1: addressForm.address,
        city: addressForm.city || 'Mumbai',
        state: addressForm.state || 'Maharashtra',
        pincode: addressForm.pin,
      });
      if (res?.data?.publicId || res?.data?.id) {
        serverAssignedId = res.data.publicId || res.data.id;
      }
    } catch {
      // Graceful fallback to optimistic local persistence
    }

    let nextAddresses = [];
    if (editingAddressId) {
      nextAddresses = addresses.map((addr) =>
        addr.id === editingAddressId ? { ...normalized, id: serverAssignedId || editingAddressId } : addr
      );
    } else {
      if (addresses.length >= 5) {
        return;
      }
      nextAddresses = [
        ...addresses,
        {
          ...normalized,
          id: serverAssignedId || Date.now(),
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
      phone: (user.phone || '').replace(/[^0-9]/g, '').slice(-10),
      email: user.email || '',
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
      phone: (addr.phone || '').replace(/[^0-9]/g, '').slice(-10),
      email: addr.email || '',
      address: addr.address || addr.address1 || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      pin: addr.pin || addr.pincode || '',
    });
  };

  const handleDeleteAddress = async (id) => {
    const nextAddresses = addresses.filter((a) => a.id !== id);
    setAddresses(nextAddresses);
    try {
      localStorage.setItem('throve_user_addresses', JSON.stringify(nextAddresses));
    } catch {}

    try {
      await deleteCustomerAddressAction(id);
    } catch {
      // Ignore network errors on delete
    }
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

  // On desktop, default to 'orders' when menu state
  const displayTab = activeTab === 'menu' ? 'orders' : activeTab;

  const pointsTrail = (user.pointsTrail && user.pointsTrail.length > 0)
    ? user.pointsTrail
    : (orders || []).map((o) => {
        const spent = parseInt(String(o.total || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const pts = Math.floor(spent * 0.05);
        return {
          id: `earn-${o.id}`,
          type: 'order_earn',
          typeLabel: 'Order Accrual',
          delta: pts,
          title: `Order Purchase (${o.id})`,
          detail: `Earned 5% points rebate on ${o.total} garment tailoring`,
          date: o.date,
          actor: 'Commerce Engine (Auto)',
        };
      });

  const navItems = [
    { id: 'orders', label: 'Orders & Returns', icon: <><path d="M21 8V21H3V8"></path><path d="M1 3h22v5H1z"></path></> },
    {
      id: 'points',
      label: 'Points History',
      icon: (
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      ),
    },
    { id: 'coupons', label: 'My Coupons', icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></> },
    { id: 'wishlist', label: 'Wishlist', icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></> },
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
            <div className={styles.throveUserTopRow}>
              <div className={styles.throveAvatar}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className={styles.throveUserInfo}>
                <div className={styles.throveNameRow}>
                  <h1>{user.name}</h1>
                  <button
                    type="button"
                    className={styles.throveEditBtn}
                    onClick={() => setActiveTab('profile')}
                    aria-label="Edit Profile"
                    title="Edit Profile"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                </div>
                <p className={styles.throveContactInfo}>
                  {user.phone}{user.email ? ` • ${user.email}` : ''}
                </p>
              </div>
            </div>

            {/* Loyalty & Privilege Progress Card */}
            <div
              className={styles.throveLoyaltyCard}
              onClick={() => setActiveTab('points')}
              style={{ cursor: 'pointer' }}
              title="View Points History"
            >
              <div className={styles.throveTierHeader}>
                <span className={styles.throveTierBadge}>{user.tier}</span>
                <span className={styles.throvePointsBadge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{user.pointsFormatted || `${(user.points || 0).toLocaleString('en-IN')} Pts`}</span>
                </span>
              </div>
              <div className={styles.throveProgressBar}>
                <div
                  className={styles.throveProgressFill}
                  style={{ width: `${Math.min(100, Math.max(0, user.progressPercent || 0))}%` }}
                />
              </div>
              <p className={styles.throveTierHint}>
                {user.tierHint || "Spend more to reach the next privilege tier"}
              </p>
            </div>
          </div>
          
          <div className={styles.throveMenuList}>
            <div className={styles.throveMenuDivider}></div>
            {navItems.map(item => (
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
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className={styles.userDetails}>
                <h1>{user.name}</h1>
                <p>{user.phone} • {user.email}</p>
              </div>
            </div>
            <div
              className={styles.userTier}
              onClick={() => setActiveTab('points')}
              style={{ cursor: 'pointer' }}
              title="View Points History"
            >
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
                    orders.map((order) => {
                      const statusConfig = getStatusConfig(order.status, order.paymentStatus, styles);
                      const orderRef = order.displayId || order.id;
                      const isMultiple = (order.itemsCount || 1) > 1;

                      return (
                        <article key={order.id} className={styles.luxuryOrderCard}>
                          {/* 1. Header: Reference, Date, Status Pill, Total */}
                          <header className={styles.orderCardHeader}>
                            <div className={styles.orderRefCol}>
                              <div className={styles.orderIdRow}>
                                <span className={styles.orderTag}>ORDER</span>
                                <span className={styles.orderNumber}>{orderRef}</span>
                              </div>
                              <span className={styles.orderDate}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Placed on {order.date}
                              </span>
                            </div>

                            <div className={styles.orderStatusCol}>
                              <div className={`${styles.statusCapsule} ${statusConfig.className}`}>
                                <span className={`${styles.statusDot} ${statusConfig.dotClass}`} aria-hidden="true" />
                                <span>{statusConfig.label}</span>
                              </div>
                              <div className={styles.orderTotalRow}>
                                <span className={styles.orderTotalVal}>{order.total}</span>
                                <span className={styles.orderItemCount}>
                                  ({order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'})
                                </span>
                              </div>
                            </div>
                          </header>

                          {/* 2. Body: Garment Media, Title, Specs, Logistics Note */}
                          <div className={styles.orderCardBody}>
                            <div className={styles.orderItemRow}>
                              <div className={styles.orderCardMedia}>
                                <Image
                                  src={order.image}
                                  alt={order.firstItemTitle || 'Product'}
                                  fill
                                  sizes="84px"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>

                              <div className={styles.orderCardDetails}>
                                <div className={styles.orderItemMeta}>
                                  <h4 className={styles.orderItemTitle}>{order.firstItemTitle}</h4>
                                  <div className={styles.orderItemSpecs}>
                                    {order.firstItemSku && (
                                      <span className={styles.specBadge}>SKU: {order.firstItemSku}</span>
                                    )}
                                    <span className={styles.specDot}>•</span>
                                    <span>Qty: {order.items?.[0]?.quantity || 1}</span>
                                    {isMultiple && (
                                      <>
                                        <span className={styles.specDot}>•</span>
                                        <span className={styles.moreItemsTag}>+{order.itemsCount - 1} more items</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Logistics / Fulfillment Note */}
                            <div className={styles.logisticsNotice}>
                              <div className={styles.logisticsIcon}>
                                {statusConfig.isFailedPayment ? (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2.2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                  </svg>
                                ) : statusConfig.isPendingPayment ? (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                  </svg>
                                ) : statusConfig.isDispatched ? (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2">
                                    <rect x="1" y="3" width="15" height="13" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                  </svg>
                                ) : statusConfig.isDelivered ? (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                ) : (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                  </svg>
                                )}
                              </div>
                              <div className={styles.logisticsContent}>
                                <span className={styles.logisticsStatusText}>{statusConfig.desc}</span>
                                {order.courierPartner && (
                                  <span className={styles.logisticsMetaSub}>
                                    {order.courierPartner} {order.awbNumber ? `· AWB: ${order.awbNumber}` : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 3. Footer Bar: Support / Track / View Details */}
                          <footer className={styles.orderCardFooter}>
                            <a
                              href={`https://wa.me/919892691094?text=Hi%20Throve%20Concierge,%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${encodeURIComponent(orderRef)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.conciergeOrderBtn}
                              title="Instant concierge assistance on WhatsApp"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                              </svg>
                              <span>Need Help? Concierge</span>
                            </a>

                            <div className={styles.orderActionsGroup}>
                              {!statusConfig.isPendingPayment && !statusConfig.isFailedPayment && (
                                <Link
                                  href={`/track?id=${encodeURIComponent(orderRef)}`}
                                  className={styles.secondaryTrackBtn}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="12 2 19 21 12 17 5 21 12 2" />
                                  </svg>
                                  <span>Track Order</span>
                                </Link>
                              )}

                              <Link
                                href={`/order/${encodeURIComponent(orderRef)}${statusConfig.isPendingPayment || statusConfig.isFailedPayment ? '?action=pay' : ''}`}
                                className={styles.primaryDetailsBtn}
                              >
                                <span>
                                  {statusConfig.isFailedPayment
                                    ? "Retry Payment"
                                    : statusConfig.isPendingPayment
                                    ? "Complete Payment"
                                    : "View Details"}
                                </span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </Link>
                            </div>
                          </footer>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* POINTS HISTORY TAB */}
            {displayTab === 'points' && (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <h2 className={styles.tabTitle}>Points &amp; Privileges History</h2>
                  <span className={styles.countBadge}>
                    {user.pointsFormatted || `${(user.points || 0).toLocaleString('en-IN')} Pts`}
                  </span>
                </div>

                {/* 1. Overview KPI Cards */}
                <div className={styles.pointsOverviewGrid}>
                  <div className={styles.pointsOverviewCard}>
                    <div className={styles.pointsOverviewCardTitle}>Available Balance</div>
                    <div className={styles.pointsOverviewCardValue}>
                      {user.pointsFormatted || `${(user.points || 0).toLocaleString('en-IN')} Pts`}
                    </div>
                    <div className={styles.pointsOverviewCardSub}>
                      Worth ₹{(user.points || 0).toLocaleString('en-IN')} at checkout (1 Pt = ₹1)
                    </div>
                  </div>

                  <div className={styles.pointsOverviewCard}>
                    <div className={styles.pointsOverviewCardTitle}>Current Tier</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                      <span className={styles.tierBadge}>{user.tier}</span>
                    </div>
                    <div className={styles.progressBar} style={{ margin: '8px 0 4px 0' }}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${Math.min(100, Math.max(0, user.progressPercent || 0))}%` }}
                      />
                    </div>
                    <div className={styles.pointsOverviewCardSub}>
                      {user.tierHint || 'Privilege tier active'}
                    </div>
                  </div>

                  <div className={styles.pointsOverviewCard}>
                    <div className={styles.pointsOverviewCardTitle}>Points Composition</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#78716c' }}>Base Earned:</span>
                        <strong style={{ color: '#1c1917' }}>
                          {(user.basePoints ?? user.points ?? 0).toLocaleString('en-IN')} Pts
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#78716c' }}>Atelier Bonus:</span>
                        <strong style={{ color: '#059669' }}>
                          +{(user.bonusPoints ?? 0).toLocaleString('en-IN')} Pts
                        </strong>
                      </div>
                    </div>
                    <div className={styles.pointsOverviewCardSub}>
                      500 Pts awarded per ₹10,000 spend
                    </div>
                  </div>
                </div>

                {/* 2. Privilege Rule Banner */}
                <div className={styles.pointsRuleBanner}>
                  <div className={styles.pointsRuleIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className={styles.pointsRuleText}>
                    <h4>Privilege Accrual &amp; Redemption</h4>
                    <p>
                      Privilege points are automatically credited upon order confirmation. Every 1 Point is worth ₹1.00 and can be applied during checkout on all luxury tailoring and streetwear.
                    </p>
                  </div>
                </div>

                {/* 3. Chronological Activity Trail */}
                <div className={styles.pointsTrailSection}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1c1917', margin: '0 0 12px 0' }}>
                    Activity &amp; Accrual Trail
                  </h3>

                  {pointsTrail.length === 0 ? (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <h3>No points activity yet</h3>
                      <p>Points earned from garment purchases and atelier privileges will appear here.</p>
                      <Link href="/collections" className={styles.primaryBtn} style={{ textDecoration: 'none', marginTop: '12px' }}>
                        Explore Collection
                      </Link>
                    </div>
                  ) : (
                    <div className={styles.pointsTrailList}>
                      {pointsTrail.map((tx) => {
                        const isDeduction = Number(tx.delta) < 0;
                        const formattedTxDate = tx.date
                          ? new Date(tx.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recorded';

                        return (
                          <div key={tx.id} className={styles.pointsTrailItem}>
                            <div className={styles.pointsTrailLeft}>
                              <div
                                className={`${styles.pointsTrailIcon} ${
                                  isDeduction ? styles.pointsTrailIconDeduct : ''
                                }`}
                              >
                                {isDeduction ? (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                  </svg>
                                ) : (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                  </svg>
                                )}
                              </div>
                              <div className={styles.pointsTrailDetails}>
                                <span className={styles.pointsTrailTitle}>{tx.title}</span>
                                <span className={styles.pointsTrailMeta}>
                                  {formattedTxDate} · {tx.detail || tx.typeLabel}
                                </span>
                              </div>
                            </div>

                            <div className={styles.pointsTrailRight}>
                              <span
                                className={`${styles.pointsDeltaBadge} ${
                                  isDeduction ? styles.pointsDeltaBadgeNegative : ''
                                }`}
                              >
                                {isDeduction ? `${tx.delta} Pts` : `+${tx.delta} Pts`}
                              </span>
                              <span className={styles.pointsTrailType}>
                                {tx.typeLabel || (isDeduction ? 'Redeemed' : 'Earned')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {displayTab === 'wishlist' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>
                  My Wishlist <span className={styles.countBadge}>{wishlistItems.length}</span>
                </h2>
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
                        <div className={styles.wishlistCardActions}>
                          <button
                            type="button"
                            className={styles.viewBtn}
                            onClick={() => openQuickSize(item)}
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
                  {(coupons.length > 0 ? coupons : [
                    {
                      code: 'THROVE15',
                      title: 'FLAT 15% OFF',
                      description: 'Valid on all streetwear jackets & tailoring. Min spend ₹2000.',
                    },
                    {
                      code: 'FREEDEL',
                      title: 'FREE SHIPPING',
                      description: 'Complimentary Express Air delivery across all Indian pin codes.',
                    },
                  ]).map((coupon) => (
                    <div key={coupon.code} className={styles.couponCard}>
                      <div className={styles.couponLeft}>
                        <span className={styles.discountAmt}>{coupon.title}</span>
                        <p>{coupon.description}</p>
                      </div>
                      <div className={styles.couponRight}>
                        <button
                          type="button"
                          className={styles.couponCode}
                          onClick={() => handleCopyCoupon(coupon.code)}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to copy code"
                        >
                          {copiedCoupon === coupon.code ? 'COPIED!' : coupon.code}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {displayTab === 'addresses' && (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <h2 className={styles.tabTitle}>Saved Addresses ({addresses.length} / 5)</h2>
                  {addresses.length < 5 && (
                    <button
                      type="button"
                      className={styles.outlineBtn}
                      onClick={() => {
                        setIsAddingAddress(!isAddingAddress);
                        setEditingAddressId(null);
                        setAddressForm({
                          type: 'Home',
                          name: user.name || '',
                          phone: (user.phone || '').replace(/[^0-9]/g, '').slice(-10),
                          email: user.email || '',
                          address: '',
                          city: 'Mumbai',
                          state: 'Maharashtra',
                          pin: '',
                        });
                      }}
                    >
                      {isAddingAddress ? 'Cancel' : '+ Add New'}
                    </button>
                  )}
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className={styles.inputGroup}>
                        <label>Mobile Number (for delivery)</label>
                        <input
                          type="tel"
                          maxLength={10}
                          className={styles.input}
                          placeholder="10-digit number"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Email Address (for invoice)</label>
                        <input
                          type="email"
                          className={styles.input}
                          placeholder="client@throve.in"
                          value={addressForm.email}
                          onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                        />
                      </div>
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
                      {(addr.phone || addr.email) && (
                        <p style={{ fontSize: '13px', color: '#57534e', margin: '2px 0 6px 0', fontWeight: 500 }}>
                          {addr.phone && `+91 ${addr.phone}`}
                          {addr.phone && addr.email && ' • '}
                          {addr.email}
                        </p>
                      )}
                      <p>{addr.address || addr.address1}</p>
                      <p>{addr.city}, {addr.state} — {addr.pin || addr.pincode}</p>
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
                  <div className={styles.avatarUploadSection}>
                    <div className={styles.avatarPreviewContainer}>
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="Profile Avatar" className={styles.avatarImage} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <button
                        type="button"
                        className={styles.avatarUploadBtnBadge}
                        onClick={() => fileInputRef.current?.click()}
                        title="Change photo"
                        aria-label="Upload profile photo"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                          <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                      </button>
                    </div>
                    <div className={styles.avatarUploadInfo}>
                      <div className={styles.avatarUploadTitle}>Profile Photo</div>
                      <div className={styles.avatarUploadHint}>JPG, PNG or WEBP up to 5MB.</div>
                      <div className={styles.avatarActionBtns}>
                        <button
                          type="button"
                          className={styles.changePhotoBtn}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {profileAvatar ? 'Change Photo' : 'Upload Photo'}
                        </button>
                        {profileAvatar && (
                          <button
                            type="button"
                            className={styles.removePhotoBtn}
                            onClick={handleRemoveAvatar}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        style={{ display: 'none' }}
                        onChange={handleAvatarFileChange}
                      />
                    </div>
                  </div>
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
