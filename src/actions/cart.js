"use server";

import { sdk } from "@/lib/medusa";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Retrieves or creates a cart ID stored securely in a httpOnly cookie
export async function getOrInitCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;

  if (cartId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(cartId, { fields: "*items, *region" });
      return cart;
    } catch (e) {
      console.warn("Could not retrieve cart, creating a new one.");
    }
  }

  // Fetch the India region from the backend to ensure Indian Taxes & INR apply
  const { regions } = await sdk.store.region.list({ country_code: "in" });
  const indiaRegion = regions[0];

  // Create a new cart explicitly bound to India
  const { cart } = await sdk.store.cart.create({ 
    region_id: indiaRegion?.id 
  });
  
  cookieStore.set("_medusa_cart_id", cart.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return cart;
}

// Zero-API Server Action: Adds an item to the cart strictly on the backend
export async function addToCart(variantId) {
  try {
    const cart = await getOrInitCart();
    
    // Add the line item via the Medusa SDK (happens entirely on the Next.js Server)
    await sdk.store.cart.createLineItem(cart.id, {
      variant_id: variantId,
      quantity: 1,
    });

    // Silently refresh the page data without full reload
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { success: false, error: error.message };
  }
}
