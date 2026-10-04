"use server";

import { sdk } from "@/lib/medusa";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOrInitCart } from "./cart";

// Action to set shipping address and method
export async function updateCheckoutInfo(formData) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;
  if (!cartId) throw new Error("No cart found");

  const email = formData.get("email");
  const shippingMethodId = formData.get("shipping_method");

  // 1. Update the cart with email & address
  await sdk.store.cart.update(cartId, {
    email: email,
    shipping_address: {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      address_1: formData.get("address"),
      city: formData.get("city"),
      postal_code: formData.get("postal_code"),
      country_code: "in",
    },
  });

  // 2. Add the selected shipping method
  await sdk.store.cart.addShippingMethod(cartId, {
    option_id: shippingMethodId,
  });

  return { success: true };
}

// Action to initialize a payment session on the cart
export async function initializePayment() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;
  if (!cartId) throw new Error("No cart found");

  // Medusa automatically attaches the payment session
  const { cart } = await sdk.store.payment.initiatePaymentSession(cartId);
  return cart;
}

// Finalize the order securely
export async function completeOrder() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;
  if (!cartId) throw new Error("No cart found");

  try {
    const response = await sdk.store.cart.complete(cartId);
    
    // Destroy the cart cookie upon success
    cookieStore.delete("_medusa_cart_id");

    return { success: true, orderId: response.order?.id };
  } catch (error) {
    console.error("Order completion failed:", error);
    return { success: false, error: error.message };
  }
}
