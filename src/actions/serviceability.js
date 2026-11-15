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

    if (res?.serviceable) {
      const carrier = res.recommended?.courier || res.recommended?.provider || "Shiprocket / Blue Dart Air";
      const deliveryEst = "3-5 business days";
      const codStatus = res.recommended?.isCodAvailable !== false ? "Cash on Delivery Available" : "Prepaid Only";

      return {
        ok: true,
        serviceable: true,
        pincode: cleanPin,
        carrier,
        deliveryEst,
        codStatus,
        message: `Express Delivery available to ${cleanPin} in ${deliveryEst}.`,
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
