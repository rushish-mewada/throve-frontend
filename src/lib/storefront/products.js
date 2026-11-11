import "server-only";
import { fetchStorefront } from "./client.js";
import { toProductProps } from "./adapters.js";

/**
 * List active storefront products adapted for existing UI components.
 *
 * @param {Object} [opts]
 * @param {string} [opts.collection]
 * @param {string} [opts.query]
 * @returns {Promise<Array<Object>>}
 */
export async function getProducts({ collection, query } = {}) {
  const params = new URLSearchParams();
  if (collection) params.set("collection", String(collection));
  if (query) params.set("q", String(query));
  const qs = params.toString() ? `?${params.toString()}` : "";

  const res = await fetchStorefront(`/v1/products${qs}`, {
    next: { tags: ["products"], revalidate: 60 },
  });
  return (res?.data || []).map(toProductProps);
}

/**
 * Fetch a single storefront product by handle or public ID.
 *
 * @param {string} handle
 * @returns {Promise<Object|null>}
 */
export async function getProduct(handle) {
  if (!handle) return null;
  const res = await fetchStorefront(`/v1/products/${encodeURIComponent(handle)}`, {
    next: { tags: [`product:${handle}`], revalidate: 60 },
  });
  return res?.data ? toProductProps(res.data) : null;
}

/**
 * Search active storefront products server-side.
 *
 * @param {string} query
 * @returns {Promise<Array<Object>>}
 */
export async function searchProducts(query) {
  const qs = new URLSearchParams({ q: String(query || "") }).toString();
  const res = await fetchStorefront(`/v1/search?${qs}`, {
    cache: "no-store",
  });
  return (res?.data || []).map(toProductProps);
}

