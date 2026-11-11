import "server-only";
import { fetchStorefront } from "./client.js";
import { toPaymentOptionsProps } from "./adapters.js";

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

/**
 * Resolve active checkout payment methods (single active online PG + optional COD) from GET /v1/config.
 *
 * @returns {Promise<{ activeOnlineGateway: string, codEnabled: boolean, codMaxOrderPaise: number, methods: Array<Object> }>}
 */
export async function getCheckoutPaymentOptions() {
  const config = await getStorefrontConfig();
  return toPaymentOptionsProps(config);
}

