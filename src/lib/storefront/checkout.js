import { fetchStorefront } from "./client.js";
import { toCheckoutProps } from "./adapters.js";

/**
 * Server-only checkout dispatch function.
 *
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function submitCheckout(payload) {
  const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const result = await fetchStorefront("/api/v1/checkout", {
    method: "POST",
    secret: true,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  return toCheckoutProps(result);
}

