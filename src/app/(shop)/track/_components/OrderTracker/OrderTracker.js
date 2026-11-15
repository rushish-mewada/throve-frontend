"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trackOrderAction } from '@/actions/tracking';
import styles from './OrderTracker.module.css';

/**
 * Universal Order & Shipment Tracker Component
 * Automatically displays live tracking for logged-in users with zero manual input.
 * Allows guest users to look up orders via Order Number + Phone/Email.
 */
export default function OrderTracker({
  loggedInUser = null,
  initialOrders = [],
  initialSelectedId = null,
}) {
  const hasUserOrders = Boolean(loggedInUser && Array.isArray(initialOrders) && initialOrders.length > 0);

  // Determine initial active order for logged-in users
  const defaultOrder = hasUserOrders
    ? (initialOrders.find((o) => o.id === initialSelectedId || o.publicId === initialSelectedId) || initialOrders[0])
    : null;

  const [selectedOrder, setSelectedOrder] = useState(defaultOrder);
  const [showManualForm, setShowManualForm] = useState(!hasUserOrders);

  // Manual search form states
  const [orderId, setOrderId] = useState(initialSelectedId || '');
  const [contact, setContact] = useState(loggedInUser?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState('');

  // Fetch tracking for a selected order
  const fetchTrackingForOrder = useCallback(async (orderToTrack) => {
    if (!orderToTrack) return;
    setIsLoading(true);
    setError('');
    try {
      const contactVal = loggedInUser?.phone || loggedInUser?.email || orderToTrack.email || '';
      const result = await trackOrderAction({
        orderId: orderToTrack.id || orderToTrack.publicId,
        contact: contactVal,
      });

      if (result.ok && result.data) {
        setTrackingResult(result.data);
      } else {
        setTrackingResult(null);
        setError(result.error || 'Unable to locate tracking details for this order.');
      }
    } catch {
      setTrackingResult(null);
      setError('An error occurred while tracking your shipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [loggedInUser]);

  // Automatically fetch tracking on load for logged-in user's active order
  useEffect(() => {
    if (hasUserOrders && selectedOrder && !showManualForm) {
      fetchTrackingForOrder(selectedOrder);
    }
  }, [hasUserOrders, selectedOrder, showManualForm, fetchTrackingForOrder]);

  const handleManualTrack = async (e) => {
    e.preventDefault();
    setError('');

    const cleanOrderId = orderId.trim();
    const cleanContact = contact.trim();

    if (!cleanOrderId || !cleanContact) {
      setError('Please provide both Order Number and Phone / Email.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await trackOrderAction({ orderId: cleanOrderId, contact: cleanContact });
      if (result.ok && result.data) {
        setTrackingResult(result.data);
      } else {
        setTrackingResult(null);
        setError(result.error || 'Unable to locate order. Please check the details entered.');
      }
    } catch {
      setTrackingResult(null);
      setError('An error occurred while tracking your shipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Logged-In User Banner & Order Selector */}
      {hasUserOrders && !showManualForm && (
        <div className={styles.loggedInSection}>
          <div className={styles.clientWelcomeBar}>
            <div>
              <span className={styles.clientEyebrow}>VERIFIED CLIENT ACCOUNT</span>
              <h3 className={styles.clientName}>{loggedInUser.name}</h3>
            </div>
            <button
              type="button"
              className={styles.switchModeBtn}
              onClick={() => setShowManualForm(true)}
            >
              Track Another Order ↗
            </button>
          </div>

          {/* Multiple Orders Selector Pills */}
          {initialOrders.length > 1 && (
            <div className={styles.orderSelectBox}>
              <span className={styles.orderSelectLabel}>Select Order to Track:</span>
              <div className={styles.orderPillsList}>
                {initialOrders.map((o) => {
                  const isSelected = selectedOrder?.id === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      className={`${styles.orderPill} ${isSelected ? styles.orderPillActive : ''}`}
                      onClick={() => {
                        setSelectedOrder(o);
                        fetchTrackingForOrder(o);
                      }}
                    >
                      <span className={styles.orderPillId}>#{o.id}</span>
                      <span className={styles.orderPillMeta}>{o.date || 'Recent'}</span>
                      <span className={styles.orderPillStatus}>
                        {o.status === 'delivered' ? 'Delivered' : (o.status || 'Active')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Search Form (For Guests or when toggled) */}
      {showManualForm && (
        <form onSubmit={handleManualTrack} className={styles.searchCard}>
          {hasUserOrders && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>GUEST ORDER LOOKUP</span>
              <button
                type="button"
                className={styles.switchModeBtn}
                onClick={() => {
                  setShowManualForm(false);
                  if (selectedOrder) fetchTrackingForOrder(selectedOrder);
                }}
              >
                ← Back to My Orders
              </button>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="orderId" className={styles.label}>Order Number</label>
            <input
              id="orderId"
              type="text"
              placeholder="e.g. THR-6XXS4P or 1001"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="contact" className={styles.label}>Phone Number or Email</label>
            <input
              id="contact"
              type="text"
              placeholder="+91 98926 91094 or client@throve.in"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>⚠ {error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                <span>Scanning Logistics Network...</span>
              </>
            ) : (
              'Track Live Shipment'
            )}
          </button>
        </form>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className={styles.loadingCard}>
          <div className={styles.spinnerDark} />
          <p className={styles.loadingText}>
            Connecting to Shiprocket Multi-Carrier Hub &amp; fetching live telemetry...
          </p>
        </div>
      )}

      {/* Error Message for Logged-In Flow */}
      {!isLoading && error && !showManualForm && (
        <div className={styles.errorBox}>
          <p>⚠ {error}</p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => selectedOrder && fetchTrackingForOrder(selectedOrder)}
          >
            Retry Tracking
          </button>
        </div>
      )}

      {/* Results View */}
      {!isLoading && trackingResult && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div>
              <span className={styles.badge}>Live Shipment Verified</span>
              <h2 className={styles.orderTitle}>Order #{trackingResult.orderId}</h2>
              <p className={styles.metaText}>
                Logistics Partner: <strong>{trackingResult.courier}</strong> (AWB: <code style={{ backgroundColor: '#f5f5f4', padding: '2px 6px', borderRadius: '4px' }}>{trackingResult.awb}</code>)
              </p>
            </div>
            <div className={styles.etaBox}>
              <span className={styles.etaLabel}>Status / Est. Delivery</span>
              <span className={styles.etaDate}>{trackingResult.estimatedDelivery}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className={styles.timeline}>
            {trackingResult.timeline.map((step, idx) => (
              <div
                key={step.status}
                className={`${styles.timelineStep} ${step.completed ? styles.completed : ''} ${step.current ? styles.current : ''}`}
              >
                <div className={styles.stepIndicator}>
                  <div className={styles.dot} />
                  {idx < trackingResult.timeline.length - 1 && <div className={styles.line} />}
                </div>
                <div className={styles.stepContent}>
                  <span className={styles.stepStatus}>{step.status}</span>
                  <span className={styles.stepTime}>{step.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Items In Shipment */}
          {Array.isArray(trackingResult.items) && trackingResult.items.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '12px' }}>
                Items in This Shipment ({trackingResult.items.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trackingResult.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '58px', position: 'relative', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', flexShrink: 0 }}>
                      <Image src={item.image || '/products/asymmetric-mandarin-shirt/main.jpg'} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1c1917', display: 'block' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', color: '#78716c' }}>Size: {item.size} · Qty: {item.qty}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1c1917' }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destination & Action */}
          <div className={styles.resultFooter}>
            <div className={styles.destination}>
              <span className={styles.destLabel}>Delivery Destination</span>
              <p className={styles.destValue}>{trackingResult.destination}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {trackingResult.trackingUrl && (
                <a
                  href={trackingResult.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.helpLink}
                  style={{ fontWeight: 600, color: '#111' }}
                >
                  Direct Carrier Portal Tracking ↗
                </a>
              )}
              <Link href="/contact" className={styles.helpLink}>
                Need Help with this Order?
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
