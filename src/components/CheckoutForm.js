"use client";

import { useState, useTransition } from "react";
import { updateCheckoutInfo, initializePayment, completeOrder } from "@/actions/checkout";
import { useRouter } from "next/navigation";
import styles from "./CheckoutForm.module.css";

export default function CheckoutForm({ cartId, shippingOptions }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1); // 1 = Address, 2 = Payment

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      // 1. Submit Address & Shipping Method
      const result = await updateCheckoutInfo(formData);
      
      if (result.success) {
        // 2. Automatically Initialize Payment Session in background
        await initializePayment();
        
        // 3. Move to Step 2
        setStep(2);
        
        // Refresh the page silently to update the totals with shipping
        router.refresh();
      }
    });
  };

  const handleFinalizeOrder = () => {
    startTransition(async () => {
      const result = await completeOrder();
      if (result.success) {
        alert(`Order Placed Successfully! Order ID: ${result.orderId}`);
        router.push("/");
      } else {
        alert("Payment failed or cart is invalid.");
      }
    });
  };

  if (step === 2) {
    return (
      <div className={styles.paymentContainer}>
        <h3>Payment Information</h3>
        <p>In a real app, the Stripe or Razorpay iframe goes here.</p>
        <div className={styles.dummyCard}>
          <input disabled value="**** **** **** 4242" className={styles.input} />
        </div>
        <button 
          onClick={handleFinalizeOrder} 
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? "Processing securely..." : "Pay & Complete Order"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleAddressSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Email</label>
          <input required name="email" type="email" placeholder="you@example.com" className={styles.input} />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>First Name</label>
          <input required name="first_name" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label>Last Name</label>
          <input required name="last_name" className={styles.input} />
        </div>
      </div>

      <div className={styles.field}>
        <label>Address</label>
        <input required name="address" className={styles.input} />
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>City</label>
          <input required name="city" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label>Postal Code</label>
          <input required name="postal_code" className={styles.input} />
        </div>
      </div>

      <div className={styles.field}>
        <label>Shipping Method</label>
        <div className={styles.radioGroup}>
          {shippingOptions.map(opt => (
            <label key={opt.id} className={styles.radioLabel}>
              <input required type="radio" name="shipping_method" value={opt.id} />
              <span>{opt.name} - {opt.price_type === 'calculated' ? 'Calculated at checkout' : `₹${opt.amount}`}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isPending} className={styles.submitButton}>
        {isPending ? "Securing Session..." : "Continue to Payment"}
      </button>
    </form>
  );
}
