"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './OrderTracker.module.css';

export default function OrderTracker() {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    setError('');

    if (!orderId.trim() || !contact.trim()) {
      setError('Please provide both Order ID and Phone / Email.');
      return;
    }

    setIsLoading(true);

    // Simulated lookup
    setTimeout(() => {
      setIsLoading(false);
      setTrackingResult({
        orderId: orderId.toUpperCase(),
        placedDate: '10 Oct 2026',
        estimatedDelivery: '14 Oct 2026',
        status: 'in_transit', // placed, processing, in_transit, out_for_delivery, delivered
        courier: 'Blue Dart Express',
        awb: 'BLUEDART-8291839210',
        destination: 'Mumbai, Maharashtra - 400050',
        timeline: [
          { status: 'Order Confirmed', time: '10 Oct, 02:30 PM', completed: true },
          { status: 'Quality Inspected & Packed', time: '11 Oct, 10:15 AM', completed: true },
          { status: 'Handed to Blue Dart (In Transit)', time: '11 Oct, 04:45 PM', completed: true, current: true },
          { status: 'Out for Delivery', time: 'Pending', completed: false },
          { status: 'Delivered', time: 'Pending', completed: false },
        ],
        items: [
          {
            name: 'Boxy Heavyweight Acid Wash Hoodie',
            size: 'L',
            qty: 1,
            price: 4999,
          },
        ],
      });
    }, 600);
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
            placeholder="e.g. THR-82914"
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
            placeholder="+91 98765 43210 or user@example.com"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? 'Verifying Dispatch...' : 'Track Shipment'}
        </button>
      </form>

      {/* Results View */}
      {trackingResult && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div>
              <span className={styles.badge}>Live Tracking</span>
              <h2 className={styles.orderTitle}>Order #{trackingResult.orderId}</h2>
              <p className={styles.metaText}>
                Courier: <strong>{trackingResult.courier}</strong> (AWB: {trackingResult.awb})
              </p>
            </div>
            <div className={styles.etaBox}>
              <span className={styles.etaLabel}>Est. Delivery</span>
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

          {/* Destination & Action */}
          <div className={styles.resultFooter}>
            <div className={styles.destination}>
              <span className={styles.destLabel}>Delivery Address</span>
              <p className={styles.destValue}>{trackingResult.destination}</p>
            </div>
            <Link href="/contact" className={styles.helpLink}>
              Need Help with this Order?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
