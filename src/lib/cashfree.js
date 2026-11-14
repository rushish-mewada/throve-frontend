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
 * Observe DOM to automatically grant autofocus & payment permissions to Cashfree's checkout modal iframe,
 * preventing cross-origin subframe autofocus blocks.
 */
function watchCashfreeIframePermissions() {
  if (typeof window === "undefined" || !window.MutationObserver) return () => {};

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const iframes = node.tagName === "IFRAME" ? [node] : Array.from(node.querySelectorAll?.("iframe") || []);
          for (const iframe of iframes) {
            const src = iframe.getAttribute("src") || "";
            if (src.includes("cashfree") || !src) {
              const currentAllow = iframe.getAttribute("allow") || "";
              const permissions = ["payment", "autofocus", "fullscreen", "clipboard-read", "clipboard-write"];
              const missing = permissions.filter((p) => !currentAllow.includes(p));
              if (missing.length > 0) {
                iframe.setAttribute("allow", [currentAllow, ...missing].filter(Boolean).join("; "));
              }
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 15000);
  return () => observer.disconnect();
}

/**
 * Launch Cashfree One Click Checkout (headless / dropin modal or redirect).
 *
 * @param {Object} options
 * @param {string} options.paymentSessionId
 * @param {string} [options.environment="production"]
 * @param {string} [options.redirectTarget="_modal"] - "_modal" or "_self"
 * @returns {Promise<any>}
 */
export async function launchCashfreeCheckout({
  paymentSessionId,
  environment = "production",
  redirectTarget = "_modal",
}) {
  if (!paymentSessionId) {
    throw new Error("Missing Cashfree payment session ID");
  }

  const Cashfree = await loadCashfree();
  if (!Cashfree) {
    throw new Error("Cashfree SDK could not be loaded");
  }

  const mode = environment === "live" || environment === "production" ? "production" : "sandbox";
  const cashfree = Cashfree({ mode });

  if (redirectTarget === "_modal") {
    watchCashfreeIframePermissions();
  }

  return cashfree.checkout({
    paymentSessionId,
    redirectTarget,
  });
}
