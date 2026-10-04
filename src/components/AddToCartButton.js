"use client";

import { useTransition } from "react";
import { addToCart } from "@/actions/cart";
import styles from "@/app/page.module.css";

export default function AddToCartButton({ variantId }) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCart(variantId);
      if (result.success) {
        alert("Added to cart securely (Check your Network tab—no API calls!)");
      } else {
        alert("Failed to add to cart");
      }
    });
  };

  return (
    <button 
      className={styles.addToCartButton} 
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
