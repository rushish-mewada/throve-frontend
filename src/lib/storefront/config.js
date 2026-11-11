import "server-only";
import { fetchStorefront } from "./client.js";

/**
 * Fetch published non-secret storefront settings from GET /v1/config.
 * Tagged with `config` for instant webhook invalidation.
 *
 * @returns {Promise<Object>}
 */
export async function getStorefrontConfig() {
  const res = await fetchStorefront("/v1/config", {
    next: { tags: ["config"], revalidate: 60 },
  });
  return res?.data || {};
}

