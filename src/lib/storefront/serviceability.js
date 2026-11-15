import "server-only";
import { fetchStorefront } from "./client";

/**
 * Check delivery serviceability and COD eligibility for a 6-digit Indian pincode.
 *
 * @param {string} pincode
 * @returns {Promise<Object>}
 */
export async function checkPincodeServiceability(pincode) {
  const cleanPin = String(pincode || "").trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) {
    return { serviceable: false, error: "Invalid 6-digit Indian pincode" };
  }

  try {
    const res = await fetchStorefront(`/v1/serviceability?pincode=${encodeURIComponent(cleanPin)}`, {
      cache: "no-store",
    });
    return res?.data || res;
  } catch (err) {
    return { serviceable: false, error: err.message || "Network error" };
  }
}
