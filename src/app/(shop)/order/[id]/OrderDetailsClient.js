"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function OrderDetailsClient({ serverOrder, orderId }) {
  const [order, setOrder] = useState(serverOrder);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const raw = sessionStorage.getItem("throve_last_order");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (!serverOrder || parsed.id === orderId || parsed.publicId === orderId)) {
            setOrder(parsed);
          }
        }
      } catch {
        // Ignore storage access errors
      }
    });
    return () => {
      active = false;
    };
  }, [orderId, serverOrder]);

  const activeOrder = order || {
    id: orderId,
    date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    email: "customer@throve.in",
    total: "₹0.00",
    subtotal: "₹0.00",
    shipping: "Free",
    paymentMethod: "Cash on Delivery (COD)",
    shippingAddress: {
      name: "Customer",
      address: "India",
      city: "",
      state: "",
      pin: "",
    },
    items: [],
  };

  return (
    <main className={styles.orderLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1>Order Confirmed</h1>
          <p>
            Thank you for your purchase! Your order <strong>{activeOrder.id || orderId}</strong> has been received.
          </p>
          {activeOrder.email && (
            <p className={styles.emailHint}>We&apos;ve sent a confirmation email to {activeOrder.email}</p>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.leftCol}>
            <div className={styles.section}>
              <h2>Order Details</h2>
              <div className={styles.itemsList}>
                {activeOrder.items && activeOrder.items.length > 0 ? (
                  activeOrder.items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.image || "/images/hero/slide4.png"}
                          alt={item.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="80px"
                        />
                      </div>
                      <div className={styles.itemInfo}>
                        <h3>{item.title}</h3>
                        <p>{item.variant}</p>
                      </div>
                      <div className={styles.itemPriceQty}>
                        <p>{item.price}</p>
                        <span>Qty: {item.qty}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Order items are being processed.</p>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Tracking Information</h2>
              <div className={styles.trackingBox}>
                <div className={styles.trackingStep + " " + styles.active}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Order Placed</h4>
                    <p>{activeOrder.date}</p>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Processing</h4>
                    <p>Preparing your items</p>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Shipped</h4>
                    <p>Waiting for courier pickup</p>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.dot}></div>
                  <div className={styles.stepInfo}>
                    <h4>Delivered</h4>
                    <p>Estimated in 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.summaryCard}>
              <h2>Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{activeOrder.subtotal || activeOrder.total}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{activeOrder.shipping || "Free"}</span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.summaryRow + " " + styles.totalRow}>
                <span>Total</span>
                <span>{activeOrder.total}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h2>Delivery Address</h2>
              <p>
                <strong>{activeOrder.shippingAddress?.name}</strong>
              </p>
              <p>{activeOrder.shippingAddress?.address}</p>
              <p>
                {[
                  activeOrder.shippingAddress?.city,
                  activeOrder.shippingAddress?.state,
                  activeOrder.shippingAddress?.pin,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>India</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Payment Method</h2>
              <p>{activeOrder.paymentMethod}</p>
            </div>

            <div className={styles.actions}>
              <Link href="/track" className={styles.outlineBtn}>
                Track Shipment
              </Link>
              <Link href="/" className={styles.primaryBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
