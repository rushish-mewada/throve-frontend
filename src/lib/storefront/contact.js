import "server-only";
import { fetchStorefront } from "./client.js";

/**
 * Server-only helper to submit a customer contact inquiry to the backend.
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} [data.orderNumber]
 * @param {string} data.message
 * @returns {Promise<{ ok: boolean, data?: Object, error?: string }>}
 */
export async function submitContactInquiry({ name, email, orderNumber, message }) {
  try {
    const res = await fetchStorefront("/v1/contact", {
      method: "POST",
      body: { name, email, orderNumber, message },
      cache: "no-store",
    });

    if (res?.error) {
      return { ok: false, error: res.error.message || "Failed to submit inquiry" };
    }

    return { ok: true, data: res?.data };
  } catch (err) {
    return { ok: false, error: err.message || "Network error while submitting inquiry" };
  }
}
