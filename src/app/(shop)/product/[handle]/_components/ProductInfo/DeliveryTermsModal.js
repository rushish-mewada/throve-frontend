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
            ✕
          </button>
        </div>

        <div className={styles.deliveryContent}>
          <div className={styles.deliveryGrid}>
            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>⚡</div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Dispatch & Timelines</h4>
                <p className={styles.deliveryItemDesc}>
                  Orders are packed and dispatched within 24–48 business hours from our fulfillment hub.
                  Metro cities receive delivery in <strong>2–4 business days</strong>; regional destinations in <strong>4–7 business days</strong>.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>📦</div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Complimentary Shipping</h4>
                <p className={styles.deliveryItemDesc}>
                  We extend <strong>Free Express Shipping</strong> on all prepaid orders across India via Blue Dart and Delhivery.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>💵</div>
              <div>
                <h4 className={styles.deliveryItemTitle}>Cash On Delivery (COD)</h4>
                <p className={styles.deliveryItemDesc}>
                  Cash on Delivery is available PAN-India up to ₹15,000 with a nominal verification fee of ₹99. OTP verification is requested upon placing order.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>🔄</div>
              <div>
                <h4 className={styles.deliveryItemTitle}>7-Day Doorstep Exchange</h4>
                <p className={styles.deliveryItemDesc}>
                  Size doesn&apos;t fit quite right? We arrange a complimentary doorstep reverse pickup within 48 hours for hassle-free size exchanges.
                </p>
              </div>
            </div>

            <div className={styles.deliveryItem}>
              <div className={styles.deliveryIcon}>📍</div>
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

