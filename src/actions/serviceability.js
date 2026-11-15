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
      return { ok: false, error: "Please enter a valid 6-digit Indian pincode." };
    }

    const res = await checkPincodeServiceability(cleanPin);
    const data = res?.data || res;

    if (data?.serviceable) {
      const rec = data.recommended || {};
      const carrier = rec.displayName || rec.courier || rec.provider || "Shiprocket / Blue Dart Air";
      const etaDays = rec.etaDays ? `${rec.etaDays}-${rec.etaDays + 2} business days` : "2-4 business days";
      const codStatus = rec.supportsCod !== false ? "Cash on Delivery Available" : "Prepaid Only";

      return {
        ok: true,
        serviceable: true,
        pincode: cleanPin,
        carrier,
        deliveryEst: etaDays,
        codStatus,
        message: `Express Delivery available to ${cleanPin} in ${etaDays}.`,
      };
    } else {
      return {
        ok: true,
        serviceable: false,
        pincode: cleanPin,
        message: `Delivery currently unavailable to pincode ${cleanPin}.`,
      };
    }
  } catch (error) {
    return { ok: false, error: error.message || "Failed to check serviceability." };
  }
}
