import "server-only";
import { formatMoney } from "./format.js";

/**
 * Maps public /v1/products payload to exact props expected by existing storefront components.
 *
 * @param {Object} raw
 * @returns {Object|null}
 */
export function toProductProps(raw) {
  if (!raw) return null;

  const pricePaise = Number(raw.pricePaise) || 0;
  const compareAtPaise = Number(raw.compareAtPricePaise) || 0;
  const category = raw.metadata?.category || "Women";
  const subcategory = raw.metadata?.subcategory || category;

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    collection: raw.metadata?.subtitle || category || "Collection",
    category,
    subcategory,
    filterCategory: subcategory,
    description: raw.description || "",
    price: formatMoney(pricePaise, raw.currency || "INR"),
    oldPrice: compareAtPaise > pricePaise ? formatMoney(compareAtPaise, raw.currency || "INR") : null,
    priceNum: Math.round(pricePaise / 100),
    rating: "4.9",
    sold: "0",
    comingSoon: false,
    preOrder: false,
    inStock: Boolean(raw.inStock),
    images: (raw.images || []).map((img) => img.url).filter(Boolean),
    colors: [],
    colorHexes: ["#18181b"],
    sizes: (raw.variants || []).map((v) => v.title).filter(Boolean),
    variants: (raw.variants || []).map((v) => ({
      id: v.id,
      name: v.title,
      sku: v.sku,
      pricePaise: Number(v.pricePaise) || pricePaise,
      priceFormatted: formatMoney(Number(v.pricePaise) || pricePaise, raw.currency || "INR"),
      inStock: Boolean(v.inStock),
      images: Array.isArray(v.images) ? v.images.map((img) => img.url).filter(Boolean) : undefined,
      vton: v.vton || undefined,
    })),
    seo: raw.metadata?.seo || undefined,
    vton: raw.metadata?.vton || undefined,
  };
}

export const PAYMENT_METHOD_LABELS = {
  cod: { label: "Cash on Delivery (COD)", subtitle: "Pay at doorstep via cash or courier UPI" },
  razorpay: { label: "Razorpay", subtitle: "UPI, Cards, NetBanking & Wallets" },
  juspay: { label: "Juspay HyperCheckout", subtitle: "1-Click UPI & Orchestrated Cards" },
  payu: { label: "PayU India", subtitle: "Cards, UPI AutoPay & NetBanking" },
  cashfree: { label: "Cashfree Payments", subtitle: "Instant UPI, Cards & Wallets" },
  phonepe: { label: "PhonePe PG", subtitle: "Direct PhonePe & UPI Switch" },
  paytm: { label: "Paytm Gateway", subtitle: "Paytm Wallet, UPI & Postpaid" },
  easebuzz: { label: "Easebuzz", subtitle: "UPI QR, Cards & NetBanking" },
  stripe: { label: "Stripe", subtitle: "International Cards, Apple Pay & Google Pay" },
  paypal: { label: "PayPal", subtitle: "PayPal Wallet & International Cards" },
};

/**
 * Derive checkout payment method options from GET /v1/config (enforces single active online PG + optional COD).
 *
 * @param {Object} config
 * @returns {{ activeOnlineGateway: string, codEnabled: boolean, codMaxOrderPaise: number, methods: Array<Object> }}
 */
export function toPaymentOptionsProps(config = {}) {
  const commerce = config?.commerce || {};
  const enabledList = Array.isArray(commerce.enabledPaymentGateways)
    ? commerce.enabledPaymentGateways.map((id) => String(id || "").toLowerCase())
    : ["cod", "razorpay"];

  const activeOnlineGateway =
    String(commerce.activePaymentGateway || "").toLowerCase() ||
    enabledList.find((id) => id !== "cod") ||
    "";

  const codEnabled = commerce.codEnabled !== undefined ? Boolean(commerce.codEnabled) : enabledList.includes("cod");
  const codMaxOrderPaise = Number(commerce.codMaxOrderPaise) || 1500000;

  const methods = [];
  if (activeOnlineGateway && PAYMENT_METHOD_LABELS[activeOnlineGateway]) {
    methods.push({
      id: activeOnlineGateway,
      kind: "online",
      ...PAYMENT_METHOD_LABELS[activeOnlineGateway],
    });
  }
  if (codEnabled) {
    methods.push({
      id: "cod",
      kind: "offline",
      ...PAYMENT_METHOD_LABELS.cod,
    });
  }

  return {
    activeOnlineGateway,
    codEnabled,
    codMaxOrderPaise,
    methods,
  };
}

/**
 * Maps raw backend checkout result to props expected by the storefront.
 * Conforms to existing frontend components without modifying their markup.
 *
 * @param {Object} raw
 * @returns {Object|null}
 */
export function toCheckoutProps(raw) {
  if (!raw) return null;

  const methodInfo = PAYMENT_METHOD_LABELS[raw.paymentMethod] || PAYMENT_METHOD_LABELS.cod;
  const session = raw.paymentSession || null;

  return {
    orderId: raw.orderId,
    displayId: raw.displayId,
    status: raw.status,
    totalFormatted: formatMoney(raw.totalPaise, raw.currency),
    totalPaise: raw.totalPaise,
    paymentMethod: raw.paymentMethod,
    paymentMethodLabel: methodInfo.label,
    paymentSession: session
      ? {
          provider: session.provider,
          environment: session.environment,
          providerOrderId: session.providerOrderId,
          publicKey: session.publicKey,
          checkoutUrl: session.checkoutUrl,
          clientSecret: session.clientSecret,
          razorpayOrderId: session.razorpayOrderId,
          razorpayKeyId: session.razorpayKeyId,
          amountPaise: session.amountPaise,
          currency: session.currency,
        }
      : null,
  };
}

/**
 * Normalize verification payload returned to client components after server-to-server verification.
 *
 * @param {Object} raw
 * @returns {Object|null}
 */
export function toPaymentVerificationProps(raw) {
  if (!raw) return null;
  return {
    verified: Boolean(raw.verified),
    provider: raw.provider,
    orderId: raw.orderId,
    paymentStatus: raw.paymentStatus,
    orderStatus: raw.orderStatus,
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

