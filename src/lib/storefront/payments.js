import "server-only";
import crypto from "node:crypto";
import { fetchStorefront } from "./client.js";
import { toPaymentVerificationProps } from "./adapters.js";

/**
 * Server-only payment signature verification through POST /v1/payments/verify.
 * Uses the storefront secret key and attaches an idempotency key.
 *
 * @param {Object} payload
 * @param {string} payload.provider
 * @param {string} payload.orderId
 * @param {string} payload.providerOrderId
 * @param {string} payload.providerPaymentId
 * @param {string} payload.signature
 * @param {string} [payload.idempotencyKey]
 * @returns {Promise<Object|null>}
 */
export async function verifyPaymentCallback(payload) {
  const idempotencyKey =
    payload?.idempotencyKey || `payverify_${crypto.randomBytes(10).toString("hex")}`;

  const res = await fetchStorefront("/v1/payments/verify", {
    method: "POST",
    secret: true,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      provider: payload.provider,
      orderId: payload.orderId,
      providerOrderId: payload.providerOrderId,
      providerPaymentId: payload.providerPaymentId,
      signature: payload.signature,
    }),
    cache: "no-store",
  });

  return toPaymentVerificationProps(res?.data || res);
}

