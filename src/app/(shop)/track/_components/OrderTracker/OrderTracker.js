"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trackOrderAction } from '@/actions/tracking';
import styles from './OrderTracker.module.css';

export default function OrderTracker() {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
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
      {/* Search Card */}
      <form onSubmit={handleTrack} className={styles.searchCard}>
        <div className={styles.inputGroup}>
          <label htmlFor="orderId" className={styles.label}>Order Number</label>
          <input
            id="orderId"
            type="text"
            placeholder="e.g. THR-1001 or 1"
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

      {/* Results View */}
      {trackingResult && (
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
