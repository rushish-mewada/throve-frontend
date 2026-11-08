import { formatMoney } from "./format.js";

/**
 * Maps raw backend checkout result to props expected by the storefront.
 * Conforms to existing frontend components without modifying their markup.
 *
 * @param {Object} raw
 * @returns {Object}
 */
export function toCheckoutProps(raw) {
  if (!raw) return null;

  return {
    orderId: raw.orderId,
    displayId: raw.displayId,
    status: raw.status,
    totalFormatted: formatMoney(raw.totalPaise, raw.currency),
    totalPaise: raw.totalPaise,
    paymentMethod: raw.paymentMethod,
    paymentSession: raw.paymentSession || null,
  };
}

/**
 * Adapts Cart line items to the summary sidebar format
 *
 * @param {Array} items
 * @returns {Array}
 */
export function toSummaryItems(items = []) {
  return items.map((item) => ({
    id: item.variantId || item.id,
    title: item.title || "Custom Apparel",
    variantTitle: item.variantTitle || "Default",
    quantity: item.quantity || 1,
    priceFormatted: formatMoney(item.pricePaise || 0),
    image: item.image || null,
  }));
}

