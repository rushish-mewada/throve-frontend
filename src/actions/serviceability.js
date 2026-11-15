"use server";

import { checkPincodeServiceability } from "@/lib/storefront/serviceability";

/**
 * Server Action: Check if a pincode is serviceable and return delivery timeline.
 *
 * @param {string} pincode
 * @returns {Promise<{ ok: boolean, serviceable?: boolean, message?: string, error?: string }>}
 */
export async function checkPincodeAction(pincode) {
  try {
    const cleanPin = String(pincode || "").trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      return { ok: false, error: "Enter valid 6-digit pincode" };
    }

    const res = await checkPincodeServiceability(cleanPin);
    const data = res?.data || res;

    if (data?.serviceable) {
      const rec = data.recommended || {};
      const etaDays = rec.etaDays ? `${rec.etaDays}–${rec.etaDays + 2} days` : "2–4 days";
      const codAvailable = rec.supportsCod !== false;

      return {
        ok: true,
        serviceable: true,
        pincode: cleanPin,
        deliveryDays: etaDays,
        codAvailable,
        message: `Available · Delivery in ${etaDays}`,
      };
    } else {
      return {
        ok: true,
        serviceable: false,
        pincode: cleanPin,
        message: `Unavailable for ${cleanPin}`,
      };
    }
  } catch (error) {
    return { ok: false, error: error.message || "Failed to check serviceability." };
  }
}
