"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './AccountDashboard.module.css';
import Modal from '@/components/ui/Modal/Modal';

export default function AccountDashboard({ user, orders, addresses }) {
  const [activeTab, setActiveTab] = useState('menu');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
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
              <span className={styles.throveTierBadge}>{user.tier}</span>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
            <button className={styles.throveEditBtn}>
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
                <span className={styles.points}>1,240 Pts</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '65%' }}></div>
              </div>
              <p className={styles.tierHint}>Spend ₹1,600 more to reach Platinum</p>
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
              <Link href="/account/login" className={styles.logoutBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log Out</span>
              </Link>
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
                {orders.slice(0,1).map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderCardImage}>
                      <Image src={order.image} alt="Product" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.orderCardInfo}>
                      <h4>{order.id}</h4>
                      <p>Ordered on {order.date}</p>
                      <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>{order.status}</span>
                    </div>
                    <div className={styles.orderCardAction}>
                      <button className={styles.viewBtn}>Track</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ORDERS TAB */}
            {displayTab === 'orders' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>Orders & Returns</h2>
                <div className={styles.orderList}>
                  {orders.map(order => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderCardImage}>
                        <Image src={order.image} alt="Product" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.orderCardInfo}>
                        <h4>{order.id}</h4>
                        <p>Total: {order.total}</p>
                        <p>Placed on {order.date}</p>
                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>{order.status}</span>
                      </div>
                      <div className={styles.orderCardAction}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {displayTab === 'wishlist' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>My Wishlist</h2>
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <h3>Your wishlist is empty</h3>
                  <p>Save items that you like in your wishlist.</p>
                  <Link href="/collections/test" className={styles.primaryBtn}>Continue Shopping</Link>
                </div>
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
                      <p>Valid on all streetwear jackets. Min spend ₹2000.</p>
                    </div>
                    <div className={styles.couponRight}>
                      <span className={styles.couponCode}>THROVE15</span>
                    </div>
                  </div>
                  <div className={styles.couponCard}>
                    <div className={styles.couponLeft}>
                      <span className={styles.discountAmt}>FREE SHIPPING</span>
                      <p>Valid on your first 3 orders.</p>
                    </div>
                    <div className={styles.couponRight}>
                      <span className={styles.couponCode}>FREEDEL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {displayTab === 'addresses' && (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <h2 className={styles.tabTitle}>Saved Addresses</h2>
                  <button className={styles.outlineBtn}>+ Add New</button>
                </div>
                <div className={styles.addressGrid}>
                  {addresses.map(addr => (
                    <div key={addr.id} className={styles.addressCard}>
                      <span className={styles.addressType}>{addr.type}</span>
                      <h4>{addr.name}</h4>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} {addr.pin}</p>
                      <div className={styles.cardActions}>
                        <button className={styles.linkBtn}>Edit</button>
                        <button className={styles.linkBtnDelete}>Remove</button>
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
                <div className={styles.profileForm}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input type="text" defaultValue={user.name} className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Mobile Number</label>
                    <input type="text" defaultValue={user.phone} className={styles.input} readOnly />
                    <span className={styles.helpText}>To change your number, verify a new one.</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input type="email" defaultValue={user.email} className={styles.input} />
                  </div>
                  <button className={styles.primaryBtn}>Save Changes</button>
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {displayTab === 'support' && (
              <div className={styles.tabContent}>
                <h2 className={styles.tabTitle}>Help & Support</h2>
                <div className={styles.overviewGrid}>
                  <div className={styles.overviewCard}>
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Chat with Us</h3>
                      <p>Usually responds in 5 mins</p>
                    </div>
                  </div>
                  <div className={styles.overviewCard}>
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>Return Policy</h3>
                      <p>Learn about easy returns</p>
                    </div>
                  </div>
                  <div className={styles.overviewCard}>
                    <div className={styles.cardIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div className={styles.cardText}>
                      <h3>FAQs</h3>
                      <p>Answers to common questions</p>
                    </div>
                  </div>
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
            <Link href="/account/login" className={styles.primaryBtnDelete}>Yes, Log Out</Link>
          </>
        }
      >
        <p>Are you sure you want to log out of your account?</p>
      </Modal>
      
    </main>
  );
}
