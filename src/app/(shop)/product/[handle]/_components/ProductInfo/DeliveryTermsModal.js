"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./ProductInfo.module.css";

export default function DeliveryTermsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Delivery Terms & Conditions</h3>
            <p className={styles.modalSubtitle}>PAN-India Shipping, COD & Doorstep Exchange Policy</p>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close delivery terms"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.deliveryContent}>
          <div className={styles.deliveryGrid}>
            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Dispatch & Timelines</h4>
                <p className={styles.deliveryItemDesc}>
                  Orders are packed and dispatched within 24–48 business hours from our fulfillment hub.
                  Metro cities receive delivery in <strong>2–4 business days</strong>; regional destinations in <strong>4–7 business days</strong>.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Complimentary Shipping</h4>
                <p className={styles.deliveryItemDesc}>
                  We extend <strong>Free Express Shipping</strong> on all prepaid orders across India via Blue Dart and Delhivery.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Cash On Delivery (COD)</h4>
                <p className={styles.deliveryItemDesc}>
                  Cash on Delivery is available PAN-India up to ₹15,000 with a nominal verification fee of ₹99. OTP verification is requested upon placing order.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <div>
                <h4 className={styles.deliveryItemTitle}>7-Day Doorstep Exchange</h4>
                <p className={styles.deliveryItemDesc}>
                  Size doesn&apos;t fit quite right? We arrange a complimentary doorstep reverse pickup within 48 hours for hassle-free size exchanges.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Real-time Order Tracking</h4>
                <p className={styles.deliveryItemDesc}>
                  Live courier tracking link and status milestones are dispatched via WhatsApp and SMS the moment your parcel departs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Link
            href="/policies/shipping"
            className={styles.fullPolicyLink}
            onClick={onClose}
          >
            Read Full Shipping Policy →
          </Link>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

