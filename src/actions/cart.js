"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const CART_COOKIE = "_throve_cart";

/**
 * Retrieve or initialize a first-party HttpOnly cart stored on the storefront origin.
 */
export async function getOrInitCart() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    } catch {
      // Create fresh cart if cookie is malformed
    }
  }

  const freshCart = {
    id: `cart_${crypto.randomBytes(8).toString("hex")}`,
    currency: "INR",
    items: [],
  };

  cookieStore.set(CART_COOKIE, JSON.stringify(freshCart), {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return freshCart;
}

/**
 * Server Action: Add a variant line item to the first-party HttpOnly cart cookie.
 */
export async function addToCart(variantId, quantity = 1) {
  try {
    const cookieStore = await cookies();
    const cart = await getOrInitCart();
    const existing = cart.items.find((it) => it.variantId === variantId);

    if (existing) {
      existing.quantity += Math.max(1, Number(quantity) || 1);
    } else {
      cart.items.push({ variantId, quantity: Math.max(1, Number(quantity) || 1) });
    }

    cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    revalidatePath("/");
    return { success: true, cart };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { success: false, error: error.message };
  }
}
