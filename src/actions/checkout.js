"use server";

import { submitCheckout } from "@/lib/storefront/checkout";

/**
 * Server Action: Process checkout submission via THROVE commerce engine.
 * Never exposes backend tokens or internal database URLs to the browser.
 *
 * @param {Object} data
 * @returns {Promise<{ success: boolean, orderId?: string, displayId?: string, totalFormatted?: string, error?: string }>}
 */
export async function processCheckoutAction(data) {
  try {
    const payload = {
      items: data.items && data.items.length > 0 ? data.items : [
        {
          variantId: "var_long_sleeve_01",
          title: "Long Sleeve Jacket",
          quantity: 1,
          pricePaise: 280000,
        },
        {
          variantId: "var_denim_shirt_02",
          title: "Classic Denim Shirt",
          quantity: 2,
          pricePaise: 150000,
        },
      ],
      email: data.email || "customer@example.com",
      shippingAddress: {
        firstName: data.firstName || "Customer",
        lastName: data.lastName || "Name",
        email: data.email || "customer@example.com",
        phone: data.phone || "9876543210",
        address1: data.address1 || "123 Fashion Street",
        address2: data.address2 || "",
        city: data.city || "Mumbai",
        state: data.state || "Maharashtra",
        pincode: data.pincode ? String(data.pincode).trim() : "400001",
        countryCode: "IN",
      },
      paymentMethod: "cod",
      couponCode: data.couponCode || "",
    };

    const result = await submitCheckout(payload);
    return {
      success: true,
      orderId: result.orderId,
      displayId: result.displayId,
      status: result.status,
      totalFormatted: result.totalFormatted,
      paymentMethod: result.paymentMethod,
      paymentSession: result.paymentSession,
    };
  } catch (error) {
    console.error("[Checkout Server Action Error]:", error);
    return {
      success: false,
      error: error.message || "Failed to complete checkout",
    };
  }
}
