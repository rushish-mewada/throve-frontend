"use server";

import { cookies } from "next/headers";
import { submitCheckout } from "@/lib/storefront/checkout";
import { getCheckoutPaymentOptions } from "@/lib/storefront/config";
import { verifyPaymentCallback } from "@/lib/storefront/payments";

/**
 * Server Action: Return active payment options published from admin settings.
 * Never exposes gateway secrets or backend URLs.
 */
export async function getCheckoutPaymentOptionsAction() {
  try {
    const options = await getCheckoutPaymentOptions();
    return { success: true, ...options };
  } catch (error) {
    console.error("[Payment Options Server Action Error]:", error);
    return {
      success: false,
      activeOnlineGateway: "",
      codEnabled: true,
      codMaxOrderPaise: 1500000,
      methods: [
        {
          id: "cod",
          kind: "offline",
          label: "Cash on Delivery (COD)",
          subtitle: "Pay at doorstep via cash or courier UPI",
        },
      ],
      error: error.message || "Failed to load payment methods",
    };
  }
}

/**
 * Server Action: Process checkout submission via THROVE commerce engine.
 * Never exposes backend tokens or internal database URLs to the browser.
 *
 * @param {Object} data
 * @returns {Promise<{ success: boolean, orderId?: string, displayId?: string, totalFormatted?: string, paymentMethod?: string, paymentMethodLabel?: string, paymentSession?: Object|null, error?: string }>}
 */
export async function processCheckoutAction(data) {
  try {
    const cookieStore = await cookies();
    let attribution;
    try {
      const attrCookie = cookieStore.get("throve_attr")?.value;
      if (attrCookie) attribution = JSON.parse(attrCookie);
    } catch {
      attribution = undefined;
    }

    const requestedMethod = String(data?.paymentMethod || "cod").toLowerCase();

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
      paymentMethod: requestedMethod,
      couponCode: data.couponCode || "",
      ...(attribution ? { attribution } : {}),
    };

    const result = await submitCheckout(payload);
    return {
      success: true,
      orderId: result.orderId,
      displayId: result.displayId,
      status: result.status,
      totalFormatted: result.totalFormatted,
      paymentMethod: result.paymentMethod,
      paymentMethodLabel: result.paymentMethodLabel,
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

/**
 * Server Action: Verify an online payment gateway callback via POST /v1/payments/verify.
 *
 * @param {Object} data
 * @returns {Promise<{ success: boolean, verification?: Object|null, error?: string }>}
 */
export async function verifyPaymentAction(data) {
  try {
    const verification = await verifyPaymentCallback({
      provider: String(data?.provider || "").toLowerCase(),
      orderId: String(data?.orderId || ""),
      providerOrderId: String(data?.providerOrderId || ""),
      providerPaymentId: String(data?.providerPaymentId || ""),
      signature: String(data?.signature || ""),
      idempotencyKey: data?.idempotencyKey,
    });
    return { success: true, verification };
  } catch (error) {
    console.error("[Verify Payment Server Action Error]:", error);
    return {
      success: false,
      error: error.message || "Payment signature verification failed",
    };
  }
}

/**
 * Server Action: Initiate Cashfree One Click Checkout session.
 * Creates order in commerce engine and returns Cashfree payment session ID.
 *
 * @param {Object} data
 * @returns {Promise<{ success: boolean, paymentSessionId?: string, environment?: string, orderId?: string, displayId?: string, checkoutUrl?: string, error?: string }>}
 */
export async function initiateCashfreeCheckoutAction(data = {}) {
  // First attempt: Standard backend commerce engine checkout
  try {
    const checkoutRes = await processCheckoutAction({
      ...data,
      paymentMethod: "cashfree",
    });

    if (checkoutRes.success && checkoutRes.paymentSession) {
      const session = checkoutRes.paymentSession;
      const paymentSessionId = session?.clientSecret || session?.payment_session_id || null;
      if (paymentSessionId) {
        return {
          success: true,
          paymentSessionId,
          environment: session?.environment || "production",
          orderId: checkoutRes.orderId,
          displayId: checkoutRes.displayId,
          checkoutUrl: session?.checkoutUrl,
        };
      }
    }
  } catch (backendErr) {
    console.warn("[Backend Checkout Fallback to Direct Cashfree]:", backendErr.message);
  }

  // Resilient fallback: Direct Cashfree PG API order initialization
  try {
    const appId = process.env.CASHFREE_APP_ID || process.env.APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY || process.env.SECRET_KEY;
    if (!appId || !secretKey) {
      return {
        success: false,
        error: "Cashfree live credentials not found in server environment",
      };
    }

    // Calculate total amount in paise from items
    let totalPaise = 0;
    if (Array.isArray(data.items) && data.items.length > 0) {
      for (const item of data.items) {
        const qty = item.quantity || item.qty || 1;
        const itemPaise = item.pricePaise || Math.round((item.priceNum || item.price || 0) * 100);
        totalPaise += itemPaise * qty;
      }
    }
    if (totalPaise <= 0) {
      totalPaise = 290000;
    }

    const orderAmount = Number((totalPaise / 100).toFixed(2));
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderId = `THR-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    // Cashfree Production requires https return_url
    const returnUrl = `https://throve.in/order/${orderId}?order_id={order_id}`;

    const customerPhone = String(data.phone || data.shippingAddress?.phone || "9999999999")
      .replace(/[^0-9]/g, "")
      .slice(-10) || "9999999999";
    const customerEmail = data.email || data.shippingAddress?.email || "concierge@throve.in";
    const customerName = [
      data.firstName || data.shippingAddress?.firstName,
      data.lastName || data.shippingAddress?.lastName,
    ].filter(Boolean).join(" ") || "Valued Customer";

    const cashfreeRes = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${customerPhone}`,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_name: customerName,
        },
        order_meta: {
          return_url: returnUrl,
        },
        order_note: "THROVE Direct One-Click Checkout",
      }),
      signal: AbortSignal.timeout(10000),
    });

    const body = await cashfreeRes.json().catch(() => ({}));
    if (!cashfreeRes.ok || !body?.payment_session_id) {
      return {
        success: false,
        error: body?.message || `Cashfree checkout initialization failed (${cashfreeRes.status})`,
      };
    }

    return {
      success: true,
      paymentSessionId: body.payment_session_id,
      environment: "production",
      orderId,
      displayId: orderId,
      checkoutUrl: body.payments?.url,
    };
  } catch (error) {
    console.error("[Cashfree Checkout Action Error]:", error);
    return {
      success: false,
      error: error.message || "Failed to initiate Cashfree checkout",
    };
  }
}
