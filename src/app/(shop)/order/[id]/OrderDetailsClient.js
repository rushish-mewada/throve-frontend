"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import styles from "./page.module.css";

export default function OrderDetailsClient({ serverOrder, orderId }) {
  const [order, setOrder] = useState(serverOrder);
  const { clearCart } = useStore();

  useEffect(() => {
    // Clear the cart once on successful order confirmation page arrival
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const raw = sessionStorage.getItem("throve_last_order");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (!serverOrder || parsed.id === orderId || parsed.publicId === orderId)) {
            setOrder((prev) => (prev ? prev : parsed));
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

  const rawStatus = (activeOrder.status || "").toLowerCase();
  const isPendingPayment = rawStatus.includes("pending_payment") || (activeOrder.paymentStatus || "").toLowerCase() === "pending" || rawStatus === "awaiting";
  let currentStep = 1;
  if (rawStatus === "delivered") {
    currentStep = 4;
  } else if (rawStatus === "shipped" || rawStatus === "dispatched" || activeOrder.fulfillmentStatus === "fulfilled") {
    currentStep = 3;
  } else if (rawStatus === "processing" || rawStatus === "confirmed" || rawStatus === "pending_dispatch") {
    currentStep = 2;
  } else {
    currentStep = 1;
  }

  const trackingSteps = [
    { step: 1, title: "Order Placed", desc: activeOrder.date || "Order recorded" },
    { step: 2, title: "Processing & Tailoring", desc: currentStep >= 2 ? "Garment crafted at atelier" : "Preparing your items" },
    { step: 3, title: "Dispatched", desc: activeOrder.courierPartner ? `${activeOrder.courierPartner}${activeOrder.awbNumber ? ` · AWB: ${activeOrder.awbNumber}` : ""}` : (currentStep >= 3 ? "In transit with courier" : "Waiting for courier pickup") },
    { step: 4, title: "Delivered", desc: currentStep === 4 ? "Delivered to recipient" : "Estimated in 3-5 business days" },
  ];

  return (
    <main className={styles.orderLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={`${styles.successIcon} ${isPendingPayment ? styles.pendingIcon : ''}`}>
            {isPendingPayment ? (
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ) : (
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
          <h1>Order #{activeOrder.id || orderId}</h1>
          <div>
            <div
              className={`${styles.statusCapsule} ${
                isPendingPayment ? styles.statusCapsulePending : styles.statusCapsuleConfirmed
              }`}
            >
              <span
                className={`${styles.statusDot} ${
                  isPendingPayment ? styles.statusDotAmber : styles.statusDotGreen
                }`}
              />
              <span>{isPendingPayment ? "Payment Pending" : "Order Confirmed · Paid"}</span>
            </div>
          </div>
          <p>
            {isPendingPayment
              ? <>Awaiting payment confirmation for order <strong>{activeOrder.id || orderId}</strong> before atelier tailoring begins.</>
              : <>Thank you for your purchase! Your order <strong>{activeOrder.id || orderId}</strong> has been received.</>}
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

            {isPendingPayment ? (
              <div className={styles.section}>
                <h2>Atelier Tailoring & Fulfillment</h2>
                <div className={styles.pendingNoticeBox}>
                  <div className={styles.pendingNoticeIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.pendingNoticeTitle}>Payment Confirmation Pending</h4>
                    <p className={styles.pendingNoticeDesc}>
                      Artisan tailoring and courier dispatch will begin immediately upon payment confirmation. Once verified, live logistics milestones and courier tracking will activate right here.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.section}>
                <h2>Tracking Information</h2>
                <div className={styles.trackingBox}>
                  {trackingSteps.map((step) => {
                    const isActive = step.step <= currentStep;
                    return (
                      <div key={step.step} className={`${styles.trackingStep} ${isActive ? styles.active : ""}`}>
                        <div className={styles.dot}></div>
                        <div className={styles.stepInfo}>
                          <h4>{step.title}</h4>
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h2 style={{ margin: 0, paddingBottom: 0, borderBottom: "none" }}>Payment Method</h2>
                <span
                  className={`${styles.statusCapsule} ${
                    isPendingPayment ? styles.statusCapsulePending : styles.statusCapsuleConfirmed
                  }`}
                  style={{ margin: 0, fontSize: "0.75rem", padding: "3px 10px" }}
                >
                  <span
                    className={`${styles.statusDot} ${
                      isPendingPayment ? styles.statusDotAmber : styles.statusDotGreen
                    }`}
                  />
                  <span>{isPendingPayment ? "Payment Pending" : "Paid"}</span>
                </span>
              </div>
              <p style={{ marginTop: "8px" }}>{activeOrder.paymentMethod}</p>
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
