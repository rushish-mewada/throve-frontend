"use client";

let cashfreeSdkPromise = null;

/**
 * Dynamically load official Cashfree JavaScript SDK (v3).
 *
 * @returns {Promise<any>}
 */
export function loadCashfree() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Cashfree) return Promise.resolve(window.Cashfree);

  if (!cashfreeSdkPromise) {
    cashfreeSdkPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById("cashfree-sdk-script");
      if (existing) {
        existing.addEventListener("load", () => resolve(window.Cashfree));
        return;
      }
      const script = document.createElement("script");
      script.id = "cashfree-sdk-script";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => resolve(window.Cashfree);
      script.onerror = () => {
        cashfreeSdkPromise = null;
        reject(new Error("Unable to load Cashfree SDK"));
      };
      document.body.appendChild(script);
    });
  }
  return cashfreeSdkPromise;
}

/**
 * Launch Cashfree One Click Checkout (headless / dropin modal).
 *
 * @param {Object} options
 * @param {string} options.paymentSessionId
 * @param {string} [options.environment="production"]
 * @returns {Promise<any>}
 */
export async function launchCashfreeCheckout({ paymentSessionId, environment = "production" }) {
  if (!paymentSessionId) {
    throw new Error("Missing Cashfree payment session ID");
  }

  const Cashfree = await loadCashfree();
  if (!Cashfree) {
    throw new Error("Cashfree SDK could not be loaded");
  }

  const mode = environment === "live" || environment === "production" ? "production" : "sandbox";
  const cashfree = Cashfree({ mode });

  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_modal",
  });
}
