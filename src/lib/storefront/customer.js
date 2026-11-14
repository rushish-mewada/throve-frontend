import "server-only";
import { fetchStorefront } from "./client.js";

/**
 * Server-only helper to update customer profile data.
 *
 * @param {Object} data
 * @param {string} data.phone
 * @param {string} [data.name]
 * @param {string} [data.email]
 * @returns {Promise<{ ok: boolean, customer?: Object, error?: string }>}
 */
export async function updateCustomerProfile({ phone, name, email }) {
  if (!phone) {
    return { ok: false, error: "Phone number is required" };
  }

  try {
    const res = await fetchStorefront("/v1/customers/profile", {
      method: "POST",
      body: { phone, name, email },
      cache: "no-store",
    });

    if (res?.error) {
      return { ok: false, error: res.error.message || "Failed to update profile" };
    }

    return { ok: true, customer: res?.data };
  } catch (err) {
    return { ok: false, error: err.message || "Network error while saving profile" };
  }
}
