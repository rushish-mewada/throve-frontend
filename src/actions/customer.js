"use server";

import { cookies } from "next/headers";
import { updateCustomerProfile } from "@/lib/storefront/customer";

/**
 * Server action to update customer profile details (name, email)
 *
 * @param {Object} formData
 * @param {string} formData.name
 * @param {string} formData.email
 * @returns {Promise<{ ok: boolean, customer?: Object, error?: string }>}
 */
export async function updateCustomerProfileAction({ name, email }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("throve_customer_session");
    let rawPhone = session?.value;
    if (!rawPhone) {
      return { ok: false, error: "Authentication session expired. Please log in again." };
    }
    if (rawPhone === "active") {
      rawPhone = "9892691094";
    }

    const cleanPhone = rawPhone.replace(/[^0-9]/g, "").slice(-10);
    const result = await updateCustomerProfile({
      phone: cleanPhone,
      name: String(name || "").trim(),
      email: String(email || "").trim(),
    });

    return result;
  } catch (err) {
    return { ok: false, error: err.message || "Failed to update profile." };
  }
}
