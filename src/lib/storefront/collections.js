import "server-only";
import { fetchStorefront } from "./client.js";
import { toProductProps } from "./adapters.js";

/**
 * List public storefront collections.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function getCollections() {
  const res = await fetchStorefront("/v1/collections", {
    next: { tags: ["collections"], revalidate: 60 },
  });
  return res?.data || [];
}

/**
 * Fetch a single collection and its adapted products by handle.
 *
 * @param {string} handle
 * @returns {Promise<{ collection: Object|null, products: Array<Object> }>}
 */
export async function getCollection(handle) {
  if (!handle) return { collection: null, products: [] };
  const res = await fetchStorefront(`/v1/collections/${encodeURIComponent(handle)}`, {
    next: { tags: [`collection:${handle}`], revalidate: 60 },
  });
  return {
    collection: res?.data?.collection || null,
    products: (res?.data?.products || []).map(toProductProps),
  };
}

