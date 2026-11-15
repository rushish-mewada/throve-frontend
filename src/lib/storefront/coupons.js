import "server-only";
import { fetchStorefront } from "./client.js";

/**
 * Server-only helper to fetch active coupons from the backend.
 * @returns {Promise<Array>}
 */
export async function getStorefrontCoupons() {
  try {
    const res = await fetchStorefront("/v1/coupons", {
      next: { tags: ["coupons"] },
      cache: "no-store",
    });
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
}
