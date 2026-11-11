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

