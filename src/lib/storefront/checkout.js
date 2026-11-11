import "server-only";
import crypto from "node:crypto";
import { fetchStorefront } from "./client.js";
import { toCheckoutProps } from "./adapters.js";

/**
 * Server-only checkout dispatch function.
 *
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function submitCheckout(payload) {
  const idempotencyKey = `idemp_${crypto.randomBytes(10).toString("hex")}`;

  const result = await fetchStorefront("/v1/checkout", {
    method: "POST",
    secret: true,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return toCheckoutProps(result);
}

